<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2><i class="fas fa-users"></i> Quản lý Độc Giả</h2>
      <button class="btn btn-primary" @click="showAddModal">
        <i class="fas fa-user-plus"></i> Thêm độc giả mới
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
            placeholder="Tìm kiếm theo tên, mã độc giả, hoặc số điện thoại..."
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

    <!-- DocGia List -->
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="sr-only">Đang tải...</span>
      </div>
    </div>

    <div v-else-if="filteredDocGia.length === 0" class="alert alert-info">
      <i class="fas fa-info-circle"></i> Không tìm thấy độc giả nào.
    </div>

    <div v-else class="card">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead class="thead-light">
              <tr>
                <th>Mã ĐG</th>
                <th>Họ tên</th>
                <th>Ngày sinh</th>
                <th>Phái</th>
                <th>Địa chỉ</th>
                <th>Điện thoại</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="dg in filteredDocGia" :key="dg._id">
                <td>{{ dg.MaDocGia }}</td>
                <td>{{ dg.HoLot }} {{ dg.Ten }}</td>
                <td>{{ formatDate(dg.NgaySinh) }}</td>
                <td>{{ dg.Phai === 0 ? 'Nam' : 'Nữ' }}</td>
                <td>{{ dg.DiaChi }}</td>
                <td>{{ dg.DienThoai }}</td>
                <td>
                  <button
                    class="btn btn-sm btn-info mr-2"
                    @click="showEditModal(dg)"
                  >
                    <i class="fas fa-edit"></i> Sửa
                  </button>
                  <button
                    class="btn btn-sm btn-danger"
                    @click="confirmDelete(dg)"
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
      id="docGiaModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="docGiaModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="docGiaModalLabel">
              {{ isEditing ? 'Sửa Độc Giả' : 'Thêm Độc Giả' }}
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
                <div class="col-md-6" v-if="isEditing">
                  <div class="form-group">
                    <label>Mã Độc Giả</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="formData.MaDocGia"
                      disabled
                      readonly
                    />
                    <small class="form-text text-muted">Mã tự động (không thể sửa)</small>
                  </div>
                </div>
                <div :class="isEditing ? 'col-md-6' : 'col-md-12'">
                  <div class="alert alert-info" v-if="!isEditing">
                    <i class="fas fa-info-circle"></i> 
                    Mã độc giả sẽ được tạo tự động (DG001, DG002, ...)
                  </div>
                </div>
              </div>
              
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label>Họ Lót <span class="text-danger">*</span></label>
                    <Field
                      name="HoLot"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors.HoLot }"
                      v-model="formData.HoLot"
                    />
                    <ErrorMessage name="HoLot" class="invalid-feedback" />
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label>Tên <span class="text-danger">*</span></label>
                    <Field
                      name="Ten"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors.Ten }"
                      v-model="formData.Ten"
                    />
                    <ErrorMessage name="Ten" class="invalid-feedback" />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label>Ngày Sinh <span class="text-danger">*</span></label>
                    <Field
                      name="NgaySinh"
                      type="date"
                      class="form-control"
                      :class="{ 'is-invalid': errors.NgaySinh }"
                      v-model="formData.NgaySinh"
                    />
                    <ErrorMessage name="NgaySinh" class="invalid-feedback" />
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label>Phái <span class="text-danger">*</span></label>
                    <Field
                      name="Phai"
                      as="select"
                      class="form-control"
                      :class="{ 'is-invalid': errors.Phai }"
                      v-model="formData.Phai"
                    >
                      <option value="">-- Chọn phái --</option>
                      <option :value="0">Nam</option>
                      <option :value="1">Nữ</option>
                    </Field>
                    <ErrorMessage name="Phai" class="invalid-feedback" />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label>Điện Thoại <span class="text-danger">*</span></label>
                    <Field
                      name="DienThoai"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors.DienThoai }"
                      v-model="formData.DienThoai"
                    />
                    <ErrorMessage name="DienThoai" class="invalid-feedback" />
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
                  Mật khẩu để đăng nhập hệ thống
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
import DocGiaService from '@/services/docgia.service';

export default {
  name: 'DocGiaManagement',
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    return {
      docGiaList: [],
      filteredDocGia: [],
      searchText: '',
      loading: false,
      isEditing: false,
      formData: {
        MaDocGia: '',
        HoLot: '',
        Ten: '',
        NgaySinh: '',
        Phai: '',
        DiaChi: '',
        DienThoai: '',
        Password: '',
      },
      editingId: null,
    };
  },
  computed: {
    schema() {
      // Dynamic schema based on isEditing
      return yup.object({
        MaDocGia: this.isEditing 
          ? yup.string().required('Mã độc giả là bắt buộc')
          : yup.string().notRequired(), // Không bắt buộc khi thêm mới (auto-generate)
        HoLot: yup.string().required('Họ lót là bắt buộc'),
        Ten: yup.string().required('Tên là bắt buộc'),
        NgaySinh: yup.date().required('Ngày sinh là bắt buộc'),
        Phai: yup.number().required('Phái là bắt buộc'),
        DiaChi: yup.string().required('Địa chỉ là bắt buộc'),
        DienThoai: yup.string().required('Điện thoại là bắt buộc'),
        Password: this.isEditing 
          ? yup.string().notRequired()
          : yup.string().required('Mật khẩu là bắt buộc').min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
      });
    },
  },
  mounted() {
    this.loadDocGia();
  },
  methods: {
    async loadDocGia() {
      this.loading = true;
      try {
        this.docGiaList = await DocGiaService.getAll();
        this.filteredDocGia = this.docGiaList;
      } catch (error) {
        console.error('Lỗi khi tải danh sách độc giả:', error);
        alert('Không thể tải danh sách độc giả');
      } finally {
        this.loading = false;
      }
    },
    handleSearch() {
      const search = this.searchText.toLowerCase().trim();
      if (!search) {
        this.filteredDocGia = this.docGiaList;
      } else {
        this.filteredDocGia = this.docGiaList.filter(
          (dg) =>
            dg.MaDocGia.toLowerCase().includes(search) ||
            `${dg.HoLot} ${dg.Ten}`.toLowerCase().includes(search) ||
            (dg.DienThoai && dg.DienThoai.includes(search))
        );
      }
    },
    showAddModal() {
      this.isEditing = false;
      this.formData = {
        MaDocGia: '',
        HoLot: '',
        Ten: '',
        NgaySinh: '',
        Phai: '',
        DiaChi: '',
        DienThoai: '',
        Password: '',
      };
      // jQuery global (Bootstrap 4)
      window.$('#docGiaModal').modal('show');
    },
    showEditModal(dg) {
      this.isEditing = true;
      this.editingId = dg._id;
      this.formData = {
        MaDocGia: dg.MaDocGia,
        HoLot: dg.HoLot,
        Ten: dg.Ten,
        NgaySinh: dg.NgaySinh ? dg.NgaySinh.split('T')[0] : '',
        Phai: dg.Phai,
        DiaChi: dg.DiaChi,
        DienThoai: dg.DienThoai,
      };
      // jQuery global (Bootstrap 4)
      window.$('#docGiaModal').modal('show');
    },
    async handleSubmit() {
      try {
        const submitData = { ...this.formData };
        if (this.isEditing) {
          // Khi sửa: Xóa Password (giữ nguyên password cũ)
          delete submitData.Password;
          await DocGiaService.update(this.editingId, submitData);
          alert('Cập nhật độc giả thành công!');
        } else {
          // Khi thêm: Xóa MaDocGia (để backend auto-generate)
          delete submitData.MaDocGia;
          const result = await DocGiaService.create(submitData);
          alert(`Thêm độc giả thành công!\nMã độc giả: ${result.MaDocGia}`);
        }
        // jQuery global để đóng modal (Bootstrap 4)
        window.$('#docGiaModal').modal('hide');
        this.loadDocGia();
      } catch (error) {
        console.error('Lỗi:', error);
        alert('Có lỗi xảy ra: ' + (error.response?.data?.message || error.message));
      }
    },
    async confirmDelete(dg) {
      if (confirm(`Bạn có chắc muốn xóa độc giả "${dg.HoLot} ${dg.Ten}"?`)) {
        try {
          await DocGiaService.delete(dg._id);
          alert('Xóa độc giả thành công!');
          this.loadDocGia();
        } catch (error) {
          console.error('Lỗi khi xóa:', error);
          alert('Không thể xóa độc giả: ' + (error.response?.data?.message || error.message));
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
