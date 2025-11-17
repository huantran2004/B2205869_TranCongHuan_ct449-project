<template>
  <div class="container mt-4">
    <h2 class="mb-4">
      <i class="fas fa-book"></i> Danh sách Sách
    </h2>

    <!-- Search and Filter -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row">
          <div class="col-md-8">
            <div class="input-group">
              <input
                type="text"
                class="form-control"
                v-model="searchText"
                placeholder="Tìm kiếm sách theo tên, tác giả... hoặc dùng giọng nói"
                @input="handleSearch"
              />
              <div class="input-group-append">
                <span class="input-group-text">
                  <i class="fas fa-search"></i>
                </span>
              </div>
            </div>
            
            <!-- AI Voice Search -->
            <div class="mt-3">
              <VoiceSearch 
                @search="handleVoiceSearch"
                @transcript-change="handleTranscriptChange"
                :auto-search="true"
                lang="vi-VN"
                idle-text="🎤 Tìm bằng giọng nói (AI)"
                listening-text="🎙️ Đang nghe..."
              />
            </div>
          </div>
          <div class="col-md-4">
            <select class="form-control" v-model="sortBy" @change="handleSort">
              <option value="">Sắp xếp theo...</option>
              <option value="TenSach">Tên sách (A-Z)</option>
              <option value="DonGia">Giá (Thấp - Cao)</option>
              <option value="NamXuatBan">Năm xuất bản</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Books Grid -->
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="sr-only">Đang tải...</span>
      </div>
    </div>

    <div v-else-if="filteredBooks.length === 0" class="alert alert-info">
      <i class="fas fa-info-circle"></i> Không tìm thấy sách nào.
    </div>

    <div v-else class="row">
      <div v-for="book in filteredBooks" :key="book._id" class="col-md-4 col-sm-6 mb-4">
        <div class="card book-card h-100">
          <div class="card-body">
            <h5 class="card-title">{{ book.TenSach }}</h5>
            <p class="card-text">
              <strong>Tác giả:</strong> {{ book.TacGia }}<br />
              <strong>Năm XB:</strong> {{ book.NamXuatBan }}<br />
              <strong>NXB:</strong> {{ book.MaNXB }}<br />
              <strong>Số lượng:</strong> 
              <span :class="book.SoQuyen > 0 ? 'text-success' : 'text-danger'">
                {{ book.SoQuyen }} quyển
              </span>
            </p>
            <p class="book-price">
              {{ formatCurrency(book.DonGia) }}
            </p>
            <button
              v-if="book.SoQuyen > 0"
              class="btn btn-primary btn-block"
              @click="requestBorrow(book)"
            >
              <i class="fas fa-hand-holding"></i> Yêu cầu mượn
            </button>
            <button
              v-else
              class="btn btn-secondary btn-block"
              disabled
            >
              Hết sách
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SachService from '@/services/sach.service';
import TheoDoiMuonSachService from '@/services/theodoimuonsach.service';
import VoiceSearch from '@/components/VoiceSearch.vue';

export default {
  name: 'ClientBookList',
  components: {
    VoiceSearch,
  },
  data() {
    return {
      books: [],
      filteredBooks: [],
      searchText: '',
      sortBy: '',
      loading: false,
    };
  },
  mounted() {
    this.loadBooks();
  },
  methods: {
    async loadBooks() {
      this.loading = true;
      try {
        this.books = await SachService.getAll();
        this.filteredBooks = this.books;
      } catch (error) {
        console.error('Lỗi khi tải danh sách sách:', error);
        alert('Không thể tải danh sách sách');
      } finally {
        this.loading = false;
      }
    },
    handleSearch() {
      const search = this.searchText.toLowerCase().trim();
      if (!search) {
        this.filteredBooks = this.books;
      } else {
        this.filteredBooks = this.books.filter(
          (book) =>
            book.TenSach.toLowerCase().includes(search) ||
            (book.TacGia && book.TacGia.toLowerCase().includes(search)) ||
            (book.MaNXB && book.MaNXB.toLowerCase().includes(search))
        );
      }
      this.handleSort();
    },
    handleSort() {
      if (!this.sortBy) return;
      
      this.filteredBooks.sort((a, b) => {
        if (this.sortBy === 'TenSach') {
          return a.TenSach.localeCompare(b.TenSach);
        } else if (this.sortBy === 'DonGia') {
          return a.DonGia - b.DonGia;
        } else if (this.sortBy === 'NamXuatBan') {
          return b.NamXuatBan - a.NamXuatBan;
        }
      });
    },
    formatCurrency(value) {
      if (!value) return '0đ';
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(value);
    },
    async requestBorrow(book) {
      const clientData = localStorage.getItem('client');
      if (!clientData) {
        alert('Vui lòng đăng nhập!');
        this.$router.push({ name: 'client.login' });
        return;
      }

      const client = JSON.parse(clientData);
      
      if (confirm(`Bạn muốn mượn sách "${book.TenSach}"?`)) {
        try {
          await TheoDoiMuonSachService.create({
            MaDocGia: client.MaDocGia,
            MaSach: book.MaSach,
            NgayMuon: new Date().toISOString(),
          });
          alert('Yêu cầu mượn sách thành công! Vui lòng đến thư viện để nhận sách.');
          this.loadBooks();
        } catch (error) {
          console.error('Lỗi:', error);
          alert('Có lỗi xảy ra: ' + (error.response?.data?.message || error.message));
        }
      }
    },
    
    // AI Voice Search Methods
    handleVoiceSearch(transcript) {
      // Update search text with voice transcript
      this.searchText = transcript;
      this.handleSearch();
    },
    
    handleTranscriptChange(transcript) {
      // Optional: Update search text as user speaks
      this.searchText = transcript;
    },
  },
};
</script>

<style scoped>
.book-card {
  transition: transform 0.2s;
  border: 1px solid #dee2e6;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.book-price {
  font-size: 1.25rem;
  color: #28a745;
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 10px;
}

.card-title {
  color: #333;
  font-weight: bold;
  min-height: 50px;
}
</style>
