<template>
  <div class="voice-search-container">
    <!-- Voice Search Button -->
    <button 
      @click="toggleVoiceSearch"
      :class="['btn', 'voice-btn', { 'listening': isListening, 'disabled': !isSupported }]"
      :disabled="!isSupported"
      type="button"
      :title="isSupported ? 'Tìm kiếm bằng giọng nói' : 'Trình duyệt không hỗ trợ'"
    >
      <i :class="['fas', isListening ? 'fa-microphone-slash' : 'fa-microphone']"></i>
      <span class="ms-2">{{ buttonText }}</span>
      
      <!-- Listening Animation -->
      <span v-if="isListening" class="listening-indicator">
        <span class="pulse-ring"></span>
        <span class="pulse-ring pulse-ring-delay"></span>
      </span>
    </button>

    <!-- Transcript Display -->
    <div v-if="transcript" class="transcript-box mt-2">
      <div class="d-flex justify-content-between align-items-center">
        <small class="text-muted">
          <i class="fas fa-quote-left"></i> Bạn nói:
        </small>
        <button 
          @click="clearTranscript" 
          class="btn btn-sm btn-link text-danger p-0"
          type="button"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
      <p class="mb-0 mt-1"><strong>{{ transcript }}</strong></p>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="alert alert-warning alert-dismissible fade show mt-2" role="alert">
      <i class="fas fa-exclamation-triangle"></i> {{ errorMessage }}
      <button type="button" class="btn-close" @click="errorMessage = ''" aria-label="Close"></button>
    </div>

    <!-- Browser Support Info -->
    <div v-if="!isSupported" class="alert alert-info mt-2" role="alert">
      <i class="fas fa-info-circle"></i> 
      Trình duyệt của bạn không hỗ trợ tìm kiếm bằng giọng nói. 
      Vui lòng sử dụng Chrome, Edge hoặc Safari.
    </div>
  </div>
</template>

<script>
export default {
  name: 'VoiceSearch',
  
  props: {
    // Language for speech recognition
    lang: {
      type: String,
      default: 'vi-VN' // Vietnamese
    },
    
    // Auto search when voice input stops
    autoSearch: {
      type: Boolean,
      default: true
    },

    // Placeholder when listening
    listeningText: {
      type: String,
      default: 'Đang nghe...'
    },

    // Button text when not listening
    idleText: {
      type: String,
      default: 'Tìm bằng giọng nói'
    }
  },

  emits: ['search', 'transcript-change'],

  data() {
    return {
      isListening: false,
      isSupported: false,
      transcript: '',
      errorMessage: '',
      recognition: null,
      speechSynthesis: null,
    };
  },

  computed: {
    buttonText() {
      return this.isListening ? this.listeningText : this.idleText;
    }
  },

  mounted() {
    this.initSpeechRecognition();
  },

  beforeUnmount() {
    this.stopListening();
  },

  methods: {
    /**
     * Initialize Web Speech API
     */
    initSpeechRecognition() {
      // Check browser support
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        this.isSupported = false;
        console.warn('Web Speech API is not supported in this browser.');
        return;
      }

      this.isSupported = true;
      this.recognition = new SpeechRecognition();
      
      // Configure recognition
      this.recognition.lang = this.lang;
      this.recognition.continuous = false; // Stop after one sentence
      this.recognition.interimResults = false; // Only final results
      this.recognition.maxAlternatives = 1;

      // Event handlers
      this.recognition.onstart = () => {
        this.isListening = true;
        this.errorMessage = '';
      };

      this.recognition.onresult = (event) => {
        const result = event.results[0][0].transcript;
        this.transcript = result;
        this.$emit('transcript-change', result);
        
        // Auto search if enabled
        if (this.autoSearch) {
          this.$emit('search', result);
          this.speak(`Đang tìm kiếm ${result}`);
        }
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;
        
        switch(event.error) {
          case 'no-speech':
            this.errorMessage = 'Không nhận được giọng nói. Vui lòng thử lại.';
            break;
          case 'audio-capture':
            this.errorMessage = 'Không tìm thấy microphone. Vui lòng kiểm tra thiết bị.';
            break;
          case 'not-allowed':
            this.errorMessage = 'Quyền truy cập microphone bị từ chối. Vui lòng cho phép trong cài đặt trình duyệt.';
            break;
          default:
            this.errorMessage = `Lỗi: ${event.error}`;
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      // Initialize Text-to-Speech
      this.speechSynthesis = window.speechSynthesis;
    },

    /**
     * Toggle voice search on/off
     */
    toggleVoiceSearch() {
      if (this.isListening) {
        this.stopListening();
      } else {
        this.startListening();
      }
    },

    /**
     * Start listening to voice input
     */
    startListening() {
      if (!this.recognition) return;
      
      try {
        this.transcript = '';
        this.errorMessage = '';
        this.recognition.start();
        this.speak('Tôi đang nghe');
      } catch (error) {
        console.error('Error starting recognition:', error);
        this.errorMessage = 'Không thể khởi động microphone.';
      }
    },

    /**
     * Stop listening
     */
    stopListening() {
      if (this.recognition && this.isListening) {
        this.recognition.stop();
      }
    },

    /**
     * Clear transcript
     */
    clearTranscript() {
      this.transcript = '';
      this.errorMessage = '';
      this.$emit('transcript-change', '');
    },

    /**
     * Text-to-Speech: Read text aloud
     */
    speak(text) {
      if (!this.speechSynthesis) return;

      // Cancel any ongoing speech
      this.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = this.lang;
      utterance.rate = 1.0; // Speed
      utterance.pitch = 1.0; // Pitch
      utterance.volume = 0.8; // Volume

      this.speechSynthesis.speak(utterance);
    },

    /**
     * Public method: Speak custom text
     */
    speakText(text) {
      this.speak(text);
    }
  }
};
</script>

<style scoped>
.voice-search-container {
  position: relative;
}

.voice-btn {
  position: relative;
  padding: 0.5rem 1rem;
  border: 2px solid #007bff;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 25px;
  transition: all 0.3s ease;
  overflow: hidden;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.voice-btn:hover:not(.disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

.voice-btn.listening {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-color: #f5576c;
  animation: pulse-button 1.5s infinite;
}

.voice-btn.disabled {
  background: #6c757d;
  border-color: #6c757d;
  cursor: not-allowed;
  opacity: 0.6;
}

/* Listening Animation */
.listening-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.pulse-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  border: 3px solid rgba(255, 255, 255, 0.6);
  border-radius: 25px;
  animation: pulse-ring 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
}

.pulse-ring-delay {
  animation-delay: 0.5s;
}

@keyframes pulse-ring {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.3);
    opacity: 0;
  }
}

@keyframes pulse-button {
  0%, 100% {
    box-shadow: 0 2px 8px rgba(245, 87, 108, 0.3);
  }
  50% {
    box-shadow: 0 4px 16px rgba(245, 87, 108, 0.6);
  }
}

/* Transcript Box */
.transcript-box {
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 10px;
  border-left: 4px solid #667eea;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.transcript-box p {
  color: #333;
  font-size: 1rem;
}

/* Responsive */
@media (max-width: 576px) {
  .voice-btn {
    font-size: 0.9rem;
    padding: 0.4rem 0.8rem;
  }
  
  .voice-btn .ms-2 {
    display: none;
  }
}
</style>
