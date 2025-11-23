<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2><i class="fas fa-book-reader"></i> Quản lý Mượn Sách</h2>
      <button class="btn btn-primary" @click="showAddModal">
        <i class="fas fa-plus"></i> Tạo phiếu mượn mới
      </button>
    </div>

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
          :class="{ active: filter === 'choduyet' }"
          @click.prevent="filter = 'choduyet'"
          href="#"
        >
          <i class="fas fa-hourglass-half"></i> Chờ duyệt
        </a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :class="{ active: filter === 'daduyet' }"
          @click.prevent="filter = 'daduyet'"
          href="#"
        >
          <i class="fas fa-book-open"></i> Đã duyệt
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

    <!-- Search Bar -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="input-group">
          <input
            type="text"
            class="form-control"
            v-model="searchText"
            placeholder="Tìm kiếm theo mã độc giả hoặc mã sách..."
            @input="handleSearch"
          />
          <div class="input-group-append">
            <span class="input-group-text">
              <i class="fas fa-search"></i>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- List -->
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="sr-only">Đang tải...</span>
      </div>
    </div>

    <div v-else-if="filteredList.length === 0" class="alert alert-info">
      <i class="fas fa-info-circle"></i> Không tìm thấy phiếu mượn nào.
    </div>

    <div v-else class="card">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead class="thead-light">
              <tr>
                <th>Mã ĐG</th>
                <th>Mã Sách</th>
                <th>Ngày mượn</th>
                <th>Ngày trả (Dự kiến/Thực tế)</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredList" :key="item._id" :class="{ 'table-danger': isOverdue(item) }">
                <td>{{ item.MaDocGia }}</td>
                <td>{{ item.MaSach }}</td>
                <td>{{ formatDate(item.NgayMuon) }}</td>
                <td>
                  <strong :class="item.TrangThai === 'Đã trả' ? 'text-success' : 'text-primary'">
                    {{ formatDate(item.NgayTra) }}
                  </strong>
                  <span v-if="isOverdue(item)" class="badge badge-danger ml-2">
                    <i class="fas fa-exclamation-triangle"></i> Quá hạn
                  </span>
                  <br>
                  <small class="text-muted">
                    {{ item.TrangThai === 'Đã trả' ? '(Ngày trả thực tế)' : '(Ngày trả dự kiến)' }}
                  </small>
                </td>
                <td>
                  <span v-if="item.TrangThai === 'Chờ duyệt'" class="badge badge-info">
                    <i class="fas fa-hourglass-half"></i> Chờ duyệt
                  </span>
                  <span v-else-if="item.TrangThai === 'Đã duyệt'" class="badge badge-warning">
                    <i class="fas fa-book-open"></i> Đã duyệt
                  </span>
                  <span v-else-if="item.TrangThai === 'Đã trả'" class="badge badge-success">
                    <i class="fas fa-check"></i> Đã trả
                  </span>
                </td>
                <td>
                  <button
                    v-if="item.TrangThai === 'Chờ duyệt'"
                    class="btn btn-sm btn-primary mr-2"
                    @click="confirmDuyet(item)"
                  >
                    <i class="fas fa-check"></i> Duyệt
                  </button>
                  <button
                    v-if="item.TrangThai === 'Đã duyệt'"
                    class="btn btn-sm btn-success mr-2"
                    @click="confirmTraSach(item)"
                  >
                    <i class="fas fa-hand-holding"></i> Trả sách
                  </button>
                  <button
                    class="btn btn-sm btn-danger"
                    @click="confirmDelete(item)"
                  >
                    <i class="fas fa-trash"></i> Xóa
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add Modal -->
    <div
      class="modal fade"
      id="muonSachModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="muonSachModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="muonSachModalLabel">
              Tạo Phiếu Mượn Sách
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <Form @submit="handleSubmit" :validation-schema="schema" v-slot="{ errors }">
              <div class="form-group">
                <label>Mã Độc Giả <span class="text-danger">*</span></label>
                <Field
                  name="MaDocGia"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.MaDocGia }"
                  v-model="formData.MaDocGia"
                />
                <ErrorMessage name="MaDocGia" class="invalid-feedback" />
              </div>

              <div class="form-group">
                <label>Mã Sách <span class="text-danger">*</span></label>
                <Field
                  name="MaSach"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.MaSach }"
                  v-model="formData.MaSach"
                />
                <ErrorMessage name="MaSach" class="invalid-feedback" />
              </div>

              <div class="form-group">
                <label>Ngày Mượn <span class="text-danger">*</span></label>
                <Field
                  name="NgayMuon"
                  type="date"
                  class="form-control"
                  :class="{ 'is-invalid': errors.NgayMuon }"
                  v-model="formData.NgayMuon"
                />
                <ErrorMessage name="NgayMuon" class="invalid-feedback" />
                <small class="form-text text-muted">
                  <i class="fas fa-info-circle"></i> Ngày trả dự kiến sẽ tự động được tính là <strong>14 ngày</strong> sau ngày mượn
                </small>
              </div>

              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Hủy
                </button>
                <button type="submit" class="btn btn-primary">
                  <i class="fas fa-save"></i> Tạo phiếu
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import TheoDoiMuonSachService from '@/services/theodoimuonsach.service';

export default {
  name: 'TheoDoiMuonSachManagement',
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const schema = yup.object({
      MaDocGia: yup.string().required('Mã độc giả là bắt buộc'),
      MaSach: yup.string().required('Mã sách là bắt buộc'),
      NgayMuon: yup.date().required('Ngày mượn là bắt buộc'),
    });

    return {
      list: [],
      filteredList: [],
      searchText: '',
      loading: false,
      filter: 'all',
      formData: {
        MaDocGia: '',
        MaSach: '',
        NgayMuon: new Date().toISOString().split('T')[0],
      },
      schema,
    };
  },
  mounted() {
    this.loadAll();
  },
  watch: {
    filter(newVal) {
      if (newVal === 'all') {
        this.loadAll();
      } else if (newVal === 'choduyet') {
        this.filteredList = this.list.filter((item) => item.TrangThai === 'Chờ duyệt');
        this.handleSearch();
      } else if (newVal === 'daduyet') {
        this.filteredList = this.list.filter((item) => item.TrangThai === 'Đã duyệt');
        this.handleSearch();
      } else if (newVal === 'datra') {
        this.filteredList = this.list.filter((item) => item.TrangThai === 'Đã trả');
        this.handleSearch();
      }
    },
  },
  methods: {
    async loadAll() {
      this.loading = true;
      this.filter = 'all';
      try {
        this.list = await TheoDoiMuonSachService.getAll();
        this.filteredList = this.list;
      } catch (error) {
        console.error('Lỗi khi tải danh sách:', error);
        alert('Không thể tải danh sách mượn sách');
      } finally {
        this.loading = false;
      }
    },
    async loadChuaTra() {
      this.loading = true;
      this.filter = 'chuatra';
      try {
        this.list = await TheoDoiMuonSachService.getChuaTra();
        this.filteredList = this.list;
      } catch (error) {
        console.error('Lỗi khi tải danh sách chưa trả:', error);
        alert('Không thể tải danh sách sách chưa trả');
      } finally {
        this.loading = false;
      }
    },
    handleSearch() {
      const search = this.searchText.toLowerCase().trim();
      if (!search) {
        if (this.filter === 'choduyet') {
          this.filteredList = this.list.filter((item) => item.TrangThai === 'Chờ duyệt');
        } else if (this.filter === 'daduyet') {
          this.filteredList = this.list.filter((item) => item.TrangThai === 'Đã duyệt');
        } else if (this.filter === 'datra') {
          this.filteredList = this.list.filter((item) => item.TrangThai === 'Đã trả');
        } else {
          this.filteredList = this.list;
        }
      } else {
        let baseList = this.list;
        if (this.filter === 'choduyet') {
          baseList = this.list.filter((item) => item.TrangThai === 'Chờ duyệt');
        } else if (this.filter === 'daduyet') {
          baseList = this.list.filter((item) => item.TrangThai === 'Đã duyệt');
        } else if (this.filter === 'datra') {
          baseList = this.list.filter((item) => item.TrangThai === 'Đã trả');
        }
        
        this.filteredList = baseList.filter(
          (item) =>
            item.MaDocGia.toLowerCase().includes(search) ||
            item.MaSach.toLowerCase().includes(search)
        );
      }
    },
    showAddModal() {
      this.formData = {
        MaDocGia: '',
        MaSach: '',
        NgayMuon: new Date().toISOString().split('T')[0],
      };
      window.$('#muonSachModal').modal('show');
    },
    async handleSubmit() {
      try {
        await TheoDoiMuonSachService.create(this.formData);
        alert('Tạo phiếu mượn thành công!');
        window.$('#muonSachModal').modal('hide');
        this.loadAll();
      } catch (error) {
        console.error('Lỗi:', error);
        alert('Có lỗi xảy ra: ' + (error.response?.data?.message || error.message));
      }
    },
    async confirmDuyet(item) {
      console.log('Duyệt item:', item);
      console.log('ID:', item._id);
      if (confirm(`Xác nhận duyệt yêu cầu mượn sách "${item.MaSach}" của độc giả ${item.MaDocGia}?`)) {
        try {
          await TheoDoiMuonSachService.duyetMuonSach(item._id);
          alert('Duyệt yêu cầu mượn sách thành công!');
          this.loadAll();
        } catch (error) {
          console.error('Lỗi khi duyệt:', error);
          console.error('Error response:', error.response);
          alert('Không thể duyệt: ' + (error.response?.data?.message || error.message));
        }
      }
    },
    async confirmTraSach(item) {
      console.log('Trả sách item:', item);
      console.log('ID:', item._id);
      if (confirm(`Xác nhận trả sách "${item.MaSach}"?`)) {
        try {
          // Sử dụng endpoint mới để trả sách
          await TheoDoiMuonSachService.traSach(item._id);
          alert('Cập nhật trả sách thành công!');
          this.loadAll();
        } catch (error) {
          console.error('Lỗi khi cập nhật:', error);
          console.error('Error response:', error.response);
          alert('Không thể cập nhật: ' + (error.response?.data?.message || error.message));
        }
      }
    },
    isOverdue(item) {
      // Kiểm tra xem sách có quá hạn không
      // Quá hạn = Trạng thái "Đã duyệt" (đang mượn) VÀ ngày hiện tại > NgayTra (ngày trả dự kiến)
      if (item.TrangThai !== 'Đã duyệt') return false; // Chỉ check quá hạn với sách đang mượn
      if (!item.NgayTra) return false;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time để chỉ so sánh ngày
      
      const dueDate = new Date(item.NgayTra);
      dueDate.setHours(0, 0, 0, 0);
      
      return today > dueDate;
    },
    async confirmDelete(item) {
      if (confirm(`Bạn có chắc muốn xóa phiếu mượn này?`)) {
        try {
          await TheoDoiMuonSachService.delete(item._id);
          alert('Xóa phiếu mượn thành công!');
          this.loadAll();
        } catch (error) {
          console.error('Lỗi khi xóa:', error);
          alert('Không thể xóa: ' + (error.response?.data?.message || error.message));
        }
      }
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN');
    },
  },
};
</script>

<style scoped>
.table td, .table th {
  vertical-align: middle;
}
</style>
