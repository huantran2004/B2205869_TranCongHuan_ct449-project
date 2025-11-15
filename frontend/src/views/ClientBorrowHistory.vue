<template>
  <div class="container mt-4">
    <h2 class="mb-4">
      <i class="fas fa-history"></i> Lịch sử mượn sách
    </h2>

    <!-- Filter Tabs -->
    <ul class="nav nav-tabs mb-3">
      <li class="nav-item">
        <a
          class="nav-link"
          :class="{ active: filter === 'all' }"
          @click.prevent="filter = 'all'"
          href="#"
        >
          <i class="fas fa-list"></i> Tất cả
        </a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :class="{ active: filter === 'dangmuon' }"
          @click.prevent="filter = 'dangmuon'"
          href="#"
        >
          <i class="fas fa-clock"></i> Đang mượn
        </a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :class="{ active: filter === 'datra' }"
          @click.prevent="filter = 'datra'"
          href="#"
        >
          <i class="fas fa-check-circle"></i> Đã trả
        </a>
      </li>
    </ul>

    <!-- History List -->
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="sr-only">Đang tải...</span>
      </div>
    </div>

    <div v-else-if="filteredHistory.length === 0" class="alert alert-info">
      <i class="fas fa-info-circle"></i> Bạn chưa có lịch sử mượn sách nào.
    </div>

    <div v-else class="card">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead class="thead-light">
              <tr>
                <th>Mã Sách</th>
                <th>Ngày mượn</th>
                <th>Ngày trả</th>
                <th>Trạng thái</th>
                <th>Thời gian mượn</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredHistory" :key="item._id">
                <td>{{ item.MaSach }}</td>
                <td>{{ formatDate(item.NgayMuon) }}</td>
                <td>
                  <span v-if="item.NgayTra">{{ formatDate(item.NgayTra) }}</span>
                  <span v-else class="text-muted">Chưa trả</span>
                </td>
                <td>
                  <span v-if="item.NgayTra" class="badge badge-success">
                    <i class="fas fa-check"></i> Đã trả
                  </span>
                  <span v-else-if="isOverdue(item.NgayMuon)" class="badge badge-danger">
                    <i class="fas fa-exclamation-triangle"></i> Quá hạn
                  </span>
                  <span v-else class="badge badge-warning">
                    <i class="fas fa-clock"></i> Đang mượn
                  </span>
                </td>
                <td>{{ calculateDays(item.NgayMuon, item.NgayTra) }} ngày</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Statistics -->
    <div class="row mt-4">
      <div class="col-md-4">
        <div class="card text-white bg-primary">
          <div class="card-body">
            <h5 class="card-title">
              <i class="fas fa-book"></i> Tổng số lần mượn
            </h5>
            <h2>{{ statistics.total }}</h2>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card text-white bg-warning">
          <div class="card-body">
            <h5 class="card-title">
              <i class="fas fa-clock"></i> Đang mượn
            </h5>
            <h2>{{ statistics.borrowing }}</h2>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card text-white bg-success">
          <div class="card-body">
            <h5 class="card-title">
              <i class="fas fa-check"></i> Đã trả
            </h5>
            <h2>{{ statistics.returned }}</h2>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TheoDoiMuonSachService from '@/services/theodoimuonsach.service';

export default {
  name: 'ClientBorrowHistory',
  data() {
    return {
      history: [],
      filteredHistory: [],
      filter: 'all',
      loading: false,
      client: null,
    };
  },
  computed: {
    statistics() {
      return {
        total: this.history.length,
        borrowing: this.history.filter(item => !item.NgayTra).length,
        returned: this.history.filter(item => item.NgayTra).length,
      };
    },
  },
  watch: {
    filter(newVal) {
      this.applyFilter(newVal);
    },
  },
  mounted() {
    const clientData = localStorage.getItem('client');
    if (!clientData) {
      this.$router.push({ name: 'client.login' });
      return;
    }
    this.client = JSON.parse(clientData);
    this.loadHistory();
  },
  methods: {
    async loadHistory() {
      this.loading = true;
      try {
        const allRecords = await TheoDoiMuonSachService.getAll();
        // Lọc chỉ lấy lịch sử của độc giả hiện tại
        this.history = allRecords.filter(
          record => record.MaDocGia === this.client.MaDocGia
        );
        this.applyFilter(this.filter);
      } catch (error) {
        console.error('Lỗi khi tải lịch sử:', error);
        alert('Không thể tải lịch sử mượn sách');
      } finally {
        this.loading = false;
      }
    },
    applyFilter(filterType) {
      if (filterType === 'all') {
        this.filteredHistory = this.history;
      } else if (filterType === 'dangmuon') {
        this.filteredHistory = this.history.filter(item => !item.NgayTra);
      } else if (filterType === 'datra') {
        this.filteredHistory = this.history.filter(item => item.NgayTra);
      }
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN');
    },
    calculateDays(startDate, endDate) {
      const start = new Date(startDate);
      const end = endDate ? new Date(endDate) : new Date();
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    },
    isOverdue(borrowDate) {
      const maxDays = 30; // Quy định mượn tối đa 30 ngày
      const days = this.calculateDays(borrowDate, null);
      return days > maxDays;
    },
  },
};
</script>

<style scoped>
.table td, .table th {
  vertical-align: middle;
}

.card {
  margin-bottom: 20px;
}
</style>
