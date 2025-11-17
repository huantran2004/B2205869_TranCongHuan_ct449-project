<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2><i class="fas fa-user-tie"></i> Quản lý Nhân Viên</h2>
      <button class="btn btn-primary" @click="showAddModal">
        <i class="fas fa-user-plus"></i> Thêm nhân viên mới
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
            placeholder="Tìm kiếm theo tên, MSNV, hoặc chức vụ..."
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

    <!-- NhanVien List -->
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="sr-only">Đang tải...</span>
      </div>
    </div>

    <div v-else-if="filteredNhanVien.length === 0" class="alert alert-info">
      <i class="fas fa-info-circle"></i> Không tìm thấy nhân viên nào.
    </div>

    <div v-else class="card">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead class="thead-light">
              <tr>
                <th>MSNV</th>
                <th>Họ tên</th>
                <th>Chức vụ</th>
                <th>Địa chỉ</th>
                <th>Số điện thoại</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="nv in filteredNhanVien" :key="nv._id">
                <td>{{ nv.MSNV }}</td>
                <td>{{ nv.HoTenNV }}</td>
                <td>
                  <span class="badge badge-info">{{ nv.ChucVu }}</span>
                </td>
                <td>{{ nv.DiaChi }}</td>
                <td>{{ nv.SoDienThoai }}</td>
                <td>
                  <button
                    class="btn btn-sm btn-info mr-2"
                    @click="showEditModal(nv)"
                  >
                    <i class="fas fa-edit"></i> Sửa
                  </button>
                  <button
                    class="btn btn-sm btn-danger"
                    @click="confirmDelete(nv)"
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
      id="nhanVienModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="nhanVienModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="nhanVienModalLabel">
              {{ isEditing ? 'Sửa Nhân Viên' : 'Thêm Nhân Viên' }}
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
              <div class="row">
                <!-- Thông báo auto-generate MSNV khi thêm mới -->
                <div class="col-12" v-if="!isEditing">
                  <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i>
                    Mã nhân viên sẽ được tạo tự động (NV001, NV002, ...)
                  </div>
                </div>
                
                <!-- Chỉ hiển thị MSNV khi đang sửa (readonly) -->
                <div class="col-md-6" v-if="isEditing">
                  <div class="form-group">
                    <label>MSNV</label>
                    <Field
                      name="MSNV"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors.MSNV }"
                      v-model="formData.MSNV"
                      readonly
                    />
                    <ErrorMessage name="MSNV" class="invalid-feedback" />
                  </div>
                </div>
                <div :class="isEditing ? 'col-md-6' : 'col-md-12'">
                  <div class="form-group">
                    <label>Họ Tên <span class="text-danger">*</span></label>
                    <Field
                      name="HoTenNV"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors.HoTenNV }"
                      v-model="formData.HoTenNV"
                    />
                    <ErrorMessage name="HoTenNV" class="invalid-feedback" />
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label>Chức Vụ <span class="text-danger">*</span></label>
                    <Field
                      name="ChucVu"
                      as="select"
                      class="form-control"
                      :class="{ 'is-invalid': errors.ChucVu }"
                      v-model="formData.ChucVu"
                    >
                      <option value="">-- Chọn chức vụ --</option>
                      <option value="Quản lý">Quản lý</option>
                      <option value="Thủ thư">Thủ thư</option>
                      <option value="Nhân viên">Nhân viên</option>
                    </Field>
                    <ErrorMessage name="ChucVu" class="invalid-feedback" />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label>Số Điện Thoại <span class="text-danger">*</span></label>
                    <Field
                      name="SoDienThoai"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors.SoDienThoai }"
                      v-model="formData.SoDienThoai"
                    />
                    <ErrorMessage name="SoDienThoai" class="invalid-feedback" />
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label>Địa Chỉ <span class="text-danger">*</span></label>
                <Field
                  name="DiaChi"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.DiaChi }"
                  v-model="formData.DiaChi"
                />
                <ErrorMessage name="DiaChi" class="invalid-feedback" />
              </div>

              <div class="form-group" v-if="!isEditing">
                <label>Mật khẩu <span class="text-danger">*</span></label>
                <Field
                  name="Password"
                  type="password"
                  class="form-control"
                  :class="{ 'is-invalid': errors.Password }"
                  v-model="formData.Password"
                />
                <ErrorMessage name="Password" class="invalid-feedback" />
                <small class="form-text text-muted">
                  Mật khẩu để đăng nhập hệ thống quản trị
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
import NhanVienService from '@/services/nhanvien.service';

export default {
  name: 'NhanVienManagement',
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    return {
      nhanVienList: [],
      filteredNhanVien: [],
      searchText: '',
      loading: false,
      isEditing: false,
      formData: {
        MSNV: '',
        HoTenNV: '',
        ChucVu: '',
        DiaChi: '',
        SoDienThoai: '',
        Password: '',
      },
      editingId: null,
      schema: null, // Sẽ được set trong computed
    };
  },
  computed: {
    schema() {
      return yup.object({
        // MSNV chỉ bắt buộc khi đang sửa
        MSNV: this.isEditing 
          ? yup.string().required('MSNV là bắt buộc')
          : yup.string().notRequired(),
        HoTenNV: yup.string().required('Họ tên là bắt buộc'),
        ChucVu: yup.string().required('Chức vụ là bắt buộc'),
        DiaChi: yup.string().required('Địa chỉ là bắt buộc'),
        SoDienThoai: yup.string().required('Số điện thoại là bắt buộc'),
        // Password chỉ bắt buộc khi thêm mới
        Password: this.isEditing
          ? yup.string().notRequired()
          : yup.string().required('Mật khẩu là bắt buộc').min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
      });
    },
  },
  mounted() {
    this.loadNhanVien();
  },
  methods: {
    async loadNhanVien() {
      this.loading = true;
      try {
        this.nhanVienList = await NhanVienService.getAll();
        this.filteredNhanVien = this.nhanVienList;
      } catch (error) {
        console.error('Lỗi khi tải danh sách nhân viên:', error);
        alert('Không thể tải danh sách nhân viên');
      } finally {
        this.loading = false;
      }
    },
    handleSearch() {
      const search = this.searchText.toLowerCase().trim();
      if (!search) {
        this.filteredNhanVien = this.nhanVienList;
      } else {
        this.filteredNhanVien = this.nhanVienList.filter(
          (nv) =>
            nv.MSNV.toLowerCase().includes(search) ||
            nv.HoTenNV.toLowerCase().includes(search) ||
            nv.ChucVu.toLowerCase().includes(search) ||
            (nv.SoDienThoai && nv.SoDienThoai.includes(search))
        );
      }
    },
    showAddModal() {
      this.isEditing = false;
      this.formData = {
        MSNV: '',
        HoTenNV: '',
        ChucVu: '',
        DiaChi: '',
        SoDienThoai: '',
        Password: '',
      };
      window.$('#nhanVienModal').modal('show');
    },
    showEditModal(nv) {
      this.isEditing = true;
      this.editingId = nv._id;
      this.formData = {
        MSNV: nv.MSNV,
        HoTenNV: nv.HoTenNV,
        ChucVu: nv.ChucVu,
        DiaChi: nv.DiaChi,
        SoDienThoai: nv.SoDienThoai,
      };
      window.$('#nhanVienModal').modal('show');
    },
    async handleSubmit() {
      try {
        const submitData = { ...this.formData };
        if (this.isEditing) {
          // Khi sửa: Xóa Password (giữ nguyên password cũ)
          delete submitData.Password;
          await NhanVienService.update(this.editingId, submitData);
          alert('Cập nhật nhân viên thành công!');
        } else {
          // Khi thêm: Xóa MSNV (để backend auto-generate)
          delete submitData.MSNV;
          const result = await NhanVienService.create(submitData);
          alert(`Thêm nhân viên thành công!\nMã nhân viên: ${result.MSNV}`);
        }
        window.$('#nhanVienModal').modal('hide');
        this.loadNhanVien();
      } catch (error) {
        console.error('Lỗi:', error);
        alert('Có lỗi xảy ra: ' + (error.response?.data?.message || error.message));
      }
    },
    async confirmDelete(nv) {
      if (confirm(`Bạn có chắc muốn xóa nhân viên "${nv.HoTenNV}"?`)) {
        try {
          await NhanVienService.delete(nv._id);
          alert('Xóa nhân viên thành công!');
          this.loadNhanVien();
        } catch (error) {
          console.error('Lỗi khi xóa:', error);
          alert('Không thể xóa nhân viên: ' + (error.response?.data?.message || error.message));
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
