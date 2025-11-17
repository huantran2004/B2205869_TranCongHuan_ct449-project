<template>
  <div class="page row">
    <div class="col-md-10">
      <InputSearch v-model="searchText" />
      
      <!-- AI Voice Search -->
      <div class="mt-3">
        <VoiceSearch 
          @search="handleVoiceSearch"
          @transcript-change="handleTranscriptChange"
          :auto-search="true"
          lang="vi-VN"
          idle-text="🎤 Tìm sách bằng giọng nói (AI)"
          listening-text="🎙️ Đang nghe..."
        />
      </div>
    </div>
    <div class="col-md-2">
      <button class="btn btn-sm btn-success" @click="goToAddSach">
        <i class="fas fa-plus"></i> Thêm mới
      </button>
    </div>
    
    <div class="mt-3 col-md-12">
      <h4>
        Danh sách sách
        <i class="fas fa-book"></i>
      </h4>
      <SachList
        v-if="filteredSachsCount > 0"
        :sachs="filteredSachs"
        v-model:activeIndex="activeIndex"
      />
      <p v-else>Không có sách nào.</p>
      
      <div class="mt-3 row justify-content-around align-items-center">
        <button class="btn btn-sm btn-primary" @click="refreshList">
          <i class="fas fa-redo"></i> Làm mới
        </button>
        
        <button class="btn btn-sm btn-danger" @click="removeAllSachs">
          <i class="fas fa-trash"></i> Xóa tất cả
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import SachList from "@/components/SachList.vue";
import InputSearch from "@/components/InputSearch.vue";
import VoiceSearch from "@/components/VoiceSearch.vue";
import SachService from "@/services/sach.service";

export default {
  components: {
    SachList,
    InputSearch,
    VoiceSearch,
  },
  data() {
    return {
      sachs: [],
      activeIndex: -1,
      searchText: "",
    };
  },
  watch: {
    searchText() {
      this.activeIndex = -1;
    },
  },
  computed: {
    sachStrings() {
      return this.sachs.map((sach) => {
        const { TenSach, TacGia, NamXuatBan } = sach;
        return [TenSach, TacGia, NamXuatBan].join("");
      });
    },
    filteredSachs() {
      if (!this.searchText) return this.sachs;
      return this.sachs.filter((_sach, index) =>
        this.sachStrings[index].toLowerCase().includes(this.searchText.toLowerCase())
      );
    },
    activeSach() {
      if (this.activeIndex < 0) return null;
      return this.filteredSachs[this.activeIndex];
    },
    filteredSachsCount() {
      return this.filteredSachs.length;
    },
  },
  methods: {
    async retrieveSachs() {
      try {
        this.sachs = await SachService.getAll();
      } catch (error) {
        console.log(error);
      }
    },
    refreshList() {
      this.retrieveSachs();
      this.activeIndex = -1;
    },
    async removeAllSachs() {
      if (confirm("Bạn muốn xóa tất cả Sách?")) {
        try {
          await SachService.deleteAll();
          this.refreshList();
        } catch (error) {
          console.log(error);
        }
      }
    },
    goToAddSach() {
      this.$router.push({ name: "admin.sach.add" });
    },
    
    // AI Voice Search Methods
    handleVoiceSearch(transcript) {
      // Update search text with voice transcript
      this.searchText = transcript;
    },
    
    handleTranscriptChange(transcript) {
      // Optional: Update search text as user speaks
      this.searchText = transcript;
    },
  },
  mounted() {
    this.refreshList();
  },
};
</script>

<style scoped>
.page {
  text-align: left;
  max-width: 750px;
}
</style>
