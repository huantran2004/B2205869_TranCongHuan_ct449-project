<template>
  <div class="home">
    <div class="card">
      <h1>Welcome to the App</h1>
      <p>This is a full-stack application built with:</p>
      <ul>
        <li><strong>Backend:</strong> Node.js, Express.js, MongoDB</li>
        <li><strong>Frontend:</strong> Vue.js 3, Vue Router, Pinia</li>
      </ul>
      <div class="actions">
        <RouterLink to="/contacts" class="btn btn-primary">
          View Contacts
        </RouterLink>
      </div>
    </div>

    <div class="card">
      <h2>Features</h2>
      <ul>
        <li>✅ RESTful API with Express.js</li>
        <li>✅ MongoDB database integration</li>
        <li>✅ Vue 3 Composition API</li>
        <li>✅ State management with Pinia</li>
        <li>✅ Vue Router for navigation</li>
        <li>✅ Axios for HTTP requests</li>
        <li>✅ Template files for quick entity creation</li>
      </ul>
    </div>

    <div class="card">
      <h2>Quick Start</h2>
      <div class="instructions">
        <div class="step">
          <h3>Backend Setup</h3>
          <ol>
            <li>Navigate to backend folder: <code>cd backend</code></li>
            <li>Install dependencies: <code>npm install</code></li>
            <li>Copy .env.example to .env: <code>cp .env.example .env</code></li>
            <li>Update MongoDB URI in .env file</li>
            <li>Start server: <code>npm run dev</code></li>
          </ol>
        </div>
        <div class="step">
          <h3>Frontend Setup</h3>
          <ol>
            <li>Navigate to frontend folder: <code>cd frontend</code></li>
            <li>Install dependencies: <code>npm install</code></li>
            <li>Copy .env.example to .env: <code>cp .env.example .env</code></li>
            <li>Start dev server: <code>npm run dev</code></li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>

<style scoped>
.home {
  max-width: 900px;
  margin: 0 auto;
}

h1 {
  color: #2c3e50;
  margin-bottom: 20px;
}

h2 {
  color: #34495e;
  margin-bottom: 15px;
}

h3 {
  color: #2c3e50;
  margin-bottom: 10px;
}

ul {
  list-style-position: inside;
  line-height: 2;
}

ol {
  padding-left: 20px;
  line-height: 1.8;
}

.actions {
  margin-top: 20px;
}

.instructions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.step {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
}

code {
  background: #e9ecef;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  color: #c7254e;
}

@media (max-width: 768px) {
  .instructions {
    grid-template-columns: 1fr;
  }
}
</style>
