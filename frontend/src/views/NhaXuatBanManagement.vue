<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2><i class="fas fa-building"></i> Quản lý Nhà Xuất Bản</h2>
      <button class="btn btn-primary" @click="showAddModal">
        <i class="fas fa-plus"></i> Thêm NXB mới
      </button>
    </div>

    <!-- Search Bar -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="input-group">
          <input
            type="text"
            class="form-control"
            v-model="searchText"
            placeholder="Tìm kiếm theo tên nhà xuất bản hoặc địa chỉ..."
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

    <!-- NXB List -->
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="sr-only">Đang tải...</span>
      </div>
    </div>

    <div v-else-if="filteredNXB.length === 0" class="alert alert-info">
      <i class="fas fa-info-circle"></i> Không tìm thấy nhà xuất bản nào.
    </div>

    <div v-else class="card">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead class="thead-light">
              <tr>
                <th>Mã NXB</th>
                <th>Tên NXB</th>
                <th>Địa chỉ</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="nxb in filteredNXB" :key="nxb._id">
                <td>{{ nxb.MaNXB }}</td>
                <td>{{ nxb.TenNXB }}</td>
                <td>{{ nxb.DiaChi }}</td>
                <td>
                  <button
                    class="btn btn-sm btn-info mr-2"
                    @click="showEditModal(nxb)"
                  >
                    <i class="fas fa-edit"></i> Sửa
                  </button>
                  <button
                    class="btn btn-sm btn-danger"
                    @click="confirmDelete(nxb)"
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

    <!-- Add/Edit Modal -->
    <div
      class="modal fade"
      id="nxbModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="nxbModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="nxbModalLabel">
              {{ isEditing ? 'Sửa Nhà Xuất Bản' : 'Thêm Nhà Xuất Bản' }}
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
              <!-- Thông báo auto-generate MaNXB khi thêm mới -->
              <div class="alert alert-info" v-if="!isEditing">
                <i class="fas fa-info-circle"></i>
                Mã nhà xuất bản sẽ được tạo tự động (NXB001, NXB002, ...)
              </div>
              
              <!-- Chỉ hiển thị MaNXB khi đang sửa (readonly) -->
              <div class="form-group" v-if="isEditing">
                <label for="maNXB">Mã NXB</label>
                <Field
                  name="MaNXB"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.MaNXB }"
                  v-model="formData.MaNXB"
                  readonly
                />
                <ErrorMessage name="MaNXB" class="invalid-feedback" />
              </div>

              <div class="form-group">
                <label for="tenNXB">Tên NXB <span class="text-danger">*</span></label>
                <Field
                  name="TenNXB"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.TenNXB }"
                  v-model="formData.TenNXB"
                />
                <ErrorMessage name="TenNXB" class="invalid-feedback" />
              </div>

              <div class="form-group">
                <label for="diaChi">Địa chỉ</label>
                <Field
                  name="DiaChi"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.DiaChi }"
                  v-model="formData.DiaChi"
                />
                <ErrorMessage name="DiaChi" class="invalid-feedback" />
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
                  <i class="fas fa-save"></i>
                  {{ isEditing ? 'Cập nhật' : 'Thêm mới' }}
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
import NhaXuatBanService from '@/services/nhaxuatban.service';

export default {
  name: 'NhaXuatBanManagement',
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    return {
      nxbList: [],
      filteredNXB: [],
      searchText: '',
      loading: false,
      isEditing: false,
      formData: {
        MaNXB: '',
        TenNXB: '',
        DiaChi: '',
      },
      editingId: null,
    };
  },
  computed: {
    schema() {
      return yup.object({
        // MaNXB chỉ bắt buộc khi đang sửa
        MaNXB: this.isEditing 
          ? yup.string().required('Mã NXB là bắt buộc')
          : yup.string().notRequired(),
        TenNXB: yup.string().required('Tên NXB là bắt buộc'),
        DiaChi: yup.string(),
      });
    },
  },
  mounted() {
    this.loadNXB();
  },
  methods: {
    async loadNXB() {
      this.loading = true;
      try {
        this.nxbList = await NhaXuatBanService.getAll();
        this.filteredNXB = this.nxbList;
      } catch (error) {
        console.error('Lỗi khi tải danh sách NXB:', error);
        alert('Không thể tải danh sách nhà xuất bản');
      } finally {
        this.loading = false;
      }
    },
    handleSearch() {
      const search = this.searchText.toLowerCase().trim();
      if (!search) {
        this.filteredNXB = this.nxbList;
      } else {
        this.filteredNXB = this.nxbList.filter(
          (nxb) =>
            nxb.TenNXB.toLowerCase().includes(search) ||
            (nxb.DiaChi && nxb.DiaChi.toLowerCase().includes(search)) ||
            nxb.MaNXB.toLowerCase().includes(search)
        );
      }
    },
    showAddModal() {
      this.isEditing = false;
      this.formData = {
        MaNXB: '',
        TenNXB: '',
        DiaChi: '',
      };
      window.$('#nxbModal').modal('show');
    },
    showEditModal(nxb) {
      this.isEditing = true;
      this.editingId = nxb._id;
      this.formData = {
        MaNXB: nxb.MaNXB,
        TenNXB: nxb.TenNXB,
        DiaChi: nxb.DiaChi || '',
      };
      window.$('#nxbModal').modal('show');
    },
    async handleSubmit() {
      try {
        if (this.isEditing) {
          await NhaXuatBanService.update(this.editingId, this.formData);
          alert('Cập nhật nhà xuất bản thành công!');
        } else {
          await NhaXuatBanService.create(this.formData);
          alert('Thêm nhà xuất bản thành công!');
        }
        window.$('#nxbModal').modal('hide');
        this.loadNXB();
      } catch (error) {
        console.error('Lỗi:', error);
        alert('Có lỗi xảy ra: ' + (error.response?.data?.message || error.message));
      }
    },
    async confirmDelete(nxb) {
      if (confirm(`Bạn có chắc muốn xóa nhà xuất bản "${nxb.TenNXB}"?`)) {
        try {
          await NhaXuatBanService.delete(nxb._id);
          alert('Xóa nhà xuất bản thành công!');
          this.loadNXB();
        } catch (error) {
          console.error('Lỗi khi xóa:', error);
          alert('Không thể xóa nhà xuất bản: ' + (error.response?.data?.message || error.message));
        }
      }
    },
  },
};
</script>

<style scoped>
.table td, .table th {
  vertical-align: middle;
}
</style>
