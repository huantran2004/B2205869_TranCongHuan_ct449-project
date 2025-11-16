<template>
  <Form @submit="submitSach" :validation-schema="sachFormSchema">
    <!-- Mã sách tự động sinh, chỉ hiển thị khi edit -->
    <div class="form-group" v-if="!isAddMode">
      <label for="MaSach">Mã sách</label>
      <input
        type="text"
        class="form-control"
        :value="sachLocal.MaSach"
        disabled
        readonly
      />
      <small class="form-text text-muted">Mã sách được tạo tự động</small>
    </div>
    
    <div class="form-group">
      <label for="TenSach">Tên sách <span class="text-danger">*</span></label>
      <Field
        name="TenSach"
        type="text"
        class="form-control"
        v-model="sachLocal.TenSach"
      />
      <ErrorMessage name="TenSach" class="error-feedback" />
    </div>
    
    <div class="form-group">
      <label for="TacGia">Tác giả</label>
      <Field
        name="TacGia"
        type="text"
        class="form-control"
        v-model="sachLocal.TacGia"
      />
      <ErrorMessage name="TacGia" class="error-feedback" />
    </div>
    
    <div class="form-group">
      <label for="DonGia">Đơn giá</label>
      <Field
        name="DonGia"
        type="number"
        class="form-control"
        v-model="sachLocal.DonGia"
      />
      <ErrorMessage name="DonGia" class="error-feedback" />
    </div>
    
    <div class="form-group">
      <label for="SoQuyen">Số quyển</label>
      <Field
        name="SoQuyen"
        type="number"
        class="form-control"
        v-model="sachLocal.SoQuyen"
      />
      <ErrorMessage name="SoQuyen" class="error-feedback" />
    </div>
    
    <div class="form-group">
      <label for="NamXuatBan">Năm xuất bản</label>
      <Field
        name="NamXuatBan"
        type="number"
        class="form-control"
        v-model="sachLocal.NamXuatBan"
      />
      <ErrorMessage name="NamXuatBan" class="error-feedback" />
    </div>
    
    <div class="form-group">
      <label for="MaNXB">Nhà xuất bản <span class="text-danger">*</span></label>
      <Field
        name="MaNXB"
        as="select"
        class="form-control"
        v-model="sachLocal.MaNXB"
      >
        <option value="">-- Chọn nhà xuất bản --</option>
        <option v-for="nxb in nhaXuatBans" :key="nxb.MaNXB" :value="nxb.MaNXB">
          {{ nxb.MaNXB }} - {{ nxb.TenNXB }}
        </option>
      </Field>
      <ErrorMessage name="MaNXB" class="error-feedback" />
    </div>
    
    <div class="form-group">
      <label for="NguonGoc">Nguồn gốc</label>
      <Field
        name="NguonGoc"
        type="text"
        class="form-control"
        v-model="sachLocal.NguonGoc"
      />
      <ErrorMessage name="NguonGoc" class="error-feedback" />
    </div>
    
    <div class="form-group mt-3">
      <button class="btn btn-primary mr-2" type="submit">
        <i class="fas fa-save"></i> Lưu
      </button>
      <button
        v-if="!isAddMode"
        type="button"
        class="btn btn-danger mr-2"
        @click="deleteSach"
      >
        <i class="fas fa-trash"></i> Xóa
      </button>
      <button
        type="button"
        class="btn btn-secondary"
        @click="$router.push({ name: 'sachbook' })"
      >
        <i class="fas fa-arrow-left"></i> Quay lại
      </button>
    </div>
  </Form>
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  props: {
    sach: { type: Object, required: true },
  },
  data() {
    const sachFormSchema = yup.object().shape({
      // Không validate MaSach vì sẽ tự động sinh
      TenSach: yup
        .string()
        .required("Tên sách là bắt buộc.")
        .min(2, "Tên sách phải ít nhất 2 ký tự.")
        .max(100, "Tên sách có nhiều nhất 100 ký tự."),
      TacGia: yup
        .string()
        .max(100, "Tên tác giả có nhiều nhất 100 ký tự."),
      DonGia: yup
        .number()
        .min(0, "Đơn giá phải >= 0")
        .required("Đơn giá là bắt buộc."),
      SoQuyen: yup
        .number()
        .min(0, "Số quyển phải >= 0")
        .required("Số quyển là bắt buộc."),
      NamXuatBan: yup
        .number()
        .min(1900, "Năm xuất bản phải >= 1900")
        .max(new Date().getFullYear() + 1, "Năm xuất bản không hợp lệ"),
      MaNXB: yup.string().required("Nhà xuất bản là bắt buộc."),
      NguonGoc: yup.string(),
    });

    return {
      sachLocal: { ...this.sach },
      sachFormSchema,
      nhaXuatBans: [],
    };
  },
  computed: {
    isAddMode() {
      return !this.sach._id;
    }
  },
  async mounted() {
    await this.loadNhaXuatBan();
  },
  methods: {
    async loadNhaXuatBan() {
      try {
        const NhaXuatBanService = (await import('@/services/nhaxuatban.service')).default;
        this.nhaXuatBans = await NhaXuatBanService.getAll();
      } catch (error) {
        console.error('Lỗi khi tải danh sách NXB:', error);
      }
    },
    submitSach() {
      this.$emit("submit:sach", this.sachLocal);
    },
    deleteSach() {
      this.$emit("delete:sach");
    },
  },
};
</script>

<style scoped>
.form-group {
  margin-bottom: 1rem;
}
.mr-2 {
  margin-right: 0.5rem;
}
</style>
