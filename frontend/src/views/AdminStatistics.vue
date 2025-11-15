<template>
  <div class="container mt-4">
    <h2 class="mb-4">
      <i class="fas fa-chart-bar"></i> Thống kê Tổng quan
    </h2>

    <!-- Statistics Cards -->
    <div class="row mb-4">
      <div class="col-md-3">
        <div class="card stats-card bg-primary text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="card-title">Tổng số sách</h6>
                <h2>{{ statistics.totalBooks }}</h2>
              </div>
              <div>
                <i class="fas fa-book fa-3x opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-3">
        <div class="card stats-card bg-success text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="card-title">Tổng độc giả</h6>
                <h2>{{ statistics.totalReaders }}</h2>
              </div>
              <div>
                <i class="fas fa-users fa-3x opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-3">
        <div class="card stats-card bg-warning text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="card-title">Đang mượn</h6>
                <h2>{{ statistics.borrowing }}</h2>
              </div>
              <div>
                <i class="fas fa-clock fa-3x opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-3">
        <div class="card stats-card bg-info text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="card-title">NXB</h6>
                <h2>{{ statistics.totalPublishers }}</h2>
              </div>
              <div>
                <i class="fas fa-building fa-3x opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Borrowing -->
    <div class="row">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0">
              <i class="fas fa-book-reader"></i> Phiếu mượn gần đây
            </h5>
          </div>
          <div class="card-body">
            <div v-if="loading" class="text-center">
              <div class="spinner-border" role="status">
                <span class="sr-only">Đang tải...</span>
              </div>
            </div>
            <div v-else-if="recentBorrows.length === 0" class="alert alert-info">
              Chưa có phiếu mượn nào
            </div>
            <div v-else class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Mã ĐG</th>
                    <th>Mã Sách</th>
                    <th>Ngày mượn</th>
                    <th>Ngày trả</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="borrow in recentBorrows" :key="borrow._id">
                    <td>{{ borrow.MaDocGia }}</td>
                    <td>{{ borrow.MaSach }}</td>
                    <td>{{ formatDate(borrow.NgayMuon) }}</td>
                    <td>
                      <span v-if="borrow.NgayTra">{{ formatDate(borrow.NgayTra) }}</span>
                      <span v-else class="text-muted">Chưa trả</span>
                    </td>
                    <td>
                      <span v-if="borrow.NgayTra" class="badge badge-success">
                        Đã trả
                      </span>
                      <span v-else class="badge badge-warning">
                        Đang mượn
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Books Inventory -->
    <div class="row mt-4">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header bg-success text-white">
            <h5 class="mb-0">
              <i class="fas fa-inventory"></i> Sách có sẵn
            </h5>
          </div>
          <div class="card-body">
            <div v-if="loading" class="text-center">
              <div class="spinner-border" role="status">
                <span class="sr-only">Đang tải...</span>
              </div>
            </div>
            <div v-else-if="availableBooks.length === 0" class="alert alert-warning">
              Không có sách nào còn trong kho
            </div>
            <div v-else class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Mã Sách</th>
                    <th>Tên Sách</th>
                    <th>Tác giả</th>
                    <th>Số lượng</th>
                    <th>Đơn giá</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="book in availableBooks.slice(0, 10)" :key="book._id">
                    <td>{{ book.MaSach }}</td>
                    <td>{{ book.TenSach }}</td>
                    <td>{{ book.TacGia }}</td>
                    <td>
                      <span :class="book.SoQuyen > 5 ? 'text-success' : 'text-warning'">
                        {{ book.SoQuyen }} quyển
                      </span>
                    </td>
                    <td>{{ formatCurrency(book.DonGia) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SachService from '@/services/sach.service';
import DocGiaService from '@/services/docgia.service';
import NhaXuatBanService from '@/services/nhaxuatban.service';
import TheoDoiMuonSachService from '@/services/theodoimuonsach.service';

export default {
  name: 'AdminStatistics',
  data() {
    return {
      loading: false,
      statistics: {
        totalBooks: 0,
        totalReaders: 0,
        borrowing: 0,
        totalPublishers: 0,
      },
      recentBorrows: [],
      availableBooks: [],
    };
  },
  mounted() {
    this.loadStatistics();
  },
  methods: {
    async loadStatistics() {
      this.loading = true;
      try {
        // Load all data in parallel
        const [books, readers, publishers, borrows] = await Promise.all([
          SachService.getAll(),
          DocGiaService.getAll(),
          NhaXuatBanService.getAll(),
          TheoDoiMuonSachService.getAll(),
        ]);

        // Calculate statistics
        this.statistics.totalBooks = books.length;
        this.statistics.totalReaders = readers.length;
        this.statistics.totalPublishers = publishers.length;
        this.statistics.borrowing = borrows.filter(b => !b.NgayTra).length;

        // Get recent borrows (last 10)
        this.recentBorrows = borrows
          .sort((a, b) => new Date(b.NgayMuon) - new Date(a.NgayMuon))
          .slice(0, 10);

        // Get available books
        this.availableBooks = books.filter(b => b.SoQuyen > 0);
      } catch (error) {
        console.error('Lỗi khi tải thống kê:', error);
        alert('Không thể tải dữ liệu thống kê');
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN');
    },
    formatCurrency(value) {
      if (!value) return '0đ';
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(value);
    },
  },
};
</script>

<style scoped>
.stats-card {
  margin-bottom: 20px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.stats-card:hover {
  transform: translateY(-5px);
}

.opacity-50 {
  opacity: 0.5;
}

.table td, .table th {
  vertical-align: middle;
}

.card {
  margin-bottom: 20px;
}
</style>
