<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <h2><i class="fas fa-user-plus"></i> Đăng Ký Tài Khoản</h2>
        <p class="text-muted">Tạo tài khoản độc giả mới</p>
      </div>

      <Form @submit="handleRegister" :validation-schema="schema" v-slot="{ errors, isSubmitting }">
        <div class="form-row">
          <div class="form-group col-md-6">
            <label>Họ lót <span class="text-danger">*</span></label>
            <Field
              name="HoLot"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors.HoLot }"
              v-model="formData.HoLot"
              placeholder="Nhập họ lót"
            />
            <ErrorMessage name="HoLot" class="invalid-feedback" />
          </div>

          <div class="form-group col-md-6">
            <label>Tên <span class="text-danger">*</span></label>
            <Field
              name="Ten"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors.Ten }"
              v-model="formData.Ten"
              placeholder="Nhập tên"
            />
            <ErrorMessage name="Ten" class="invalid-feedback" />
          </div>
        </div>

        <div class="form-group">
          <label>Ngày sinh <span class="text-danger">*</span></label>
          <Field
            name="NgaySinh"
            type="date"
            class="form-control"
            :class="{ 'is-invalid': errors.NgaySinh }"
            v-model="formData.NgaySinh"
          />
          <ErrorMessage name="NgaySinh" class="invalid-feedback" />
        </div>

        <div class="form-group">
          <label>Phái <span class="text-danger">*</span></label>
          <Field
            name="Phai"
            as="select"
            class="form-control"
            :class="{ 'is-invalid': errors.Phai }"
            v-model="formData.Phai"
          >
            <option value="">-- Chọn giới tính --</option>
            <option :value="0">Nam</option>
            <option :value="1">Nữ</option>
          </Field>
          <ErrorMessage name="Phai" class="invalid-feedback" />
        </div>

        <div class="form-group">
          <label>Địa chỉ <span class="text-danger">*</span></label>
          <Field
            name="DiaChi"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors.DiaChi }"
            v-model="formData.DiaChi"
            placeholder="Nhập địa chỉ"
          />
          <ErrorMessage name="DiaChi" class="invalid-feedback" />
        </div>

        <div class="form-group">
          <label>Số điện thoại <span class="text-danger">*</span></label>
          <Field
            name="DienThoai"
            type="tel"
            class="form-control"
            :class="{ 'is-invalid': errors.DienThoai }"
            v-model="formData.DienThoai"
            placeholder="Nhập số điện thoại"
          />
          <ErrorMessage name="DienThoai" class="invalid-feedback" />
        </div>

        <div class="form-group">
          <label>Mật khẩu <span class="text-danger">*</span></label>
          <Field
            name="Password"
            type="password"
            class="form-control"
            :class="{ 'is-invalid': errors.Password }"
            v-model="formData.Password"
            placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
          />
          <ErrorMessage name="Password" class="invalid-feedback" />
        </div>

        <div class="form-group">
          <label>Xác nhận mật khẩu <span class="text-danger">*</span></label>
          <Field
            name="ConfirmPassword"
            type="password"
            class="form-control"
            :class="{ 'is-invalid': errors.ConfirmPassword }"
            v-model="formData.ConfirmPassword"
            placeholder="Nhập lại mật khẩu"
          />
          <ErrorMessage name="ConfirmPassword" class="invalid-feedback" />
        </div>

        <div v-if="message" class="alert" :class="messageType === 'success' ? 'alert-success' : 'alert-danger'">
          {{ message }}
        </div>

        <button type="submit" class="btn btn-primary btn-block" :disabled="isSubmitting">
          <i class="fas fa-user-plus"></i> 
          {{ isSubmitting ? 'Đang xử lý...' : 'Đăng Ký' }}
        </button>

        <div class="text-center mt-3">
          <p>
            Đã có tài khoản? 
            <router-link to="/client/login" class="text-primary">
              <i class="fas fa-sign-in-alt"></i> Đăng nhập ngay
            </router-link>
          </p>
        </div>
      </Form>
    </div>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import DocGiaService from '@/services/docgia.service';

export default {
  name: 'ClientRegister',
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    return {
      formData: {
        HoLot: '',
        Ten: '',
        NgaySinh: '',
        Phai: '',
        DiaChi: '',
        DienThoai: '',
        Password: '',
        ConfirmPassword: '',
      },
      message: '',
      messageType: '',
    };
  },
  computed: {
    schema() {
      return yup.object({
        HoLot: yup.string().required('Họ lót là bắt buộc'),
        Ten: yup.string().required('Tên là bắt buộc'),
        NgaySinh: yup.date().required('Ngày sinh là bắt buộc').max(new Date(), 'Ngày sinh không hợp lệ'),
        Phai: yup.number().required('Giới tính là bắt buộc').transform((value) => {
          return value === '' || isNaN(value) ? undefined : Number(value);
        }),
        DiaChi: yup.string().required('Địa chỉ là bắt buộc'),
        DienThoai: yup.string()
          .required('Số điện thoại là bắt buộc')
          .matches(/^[0-9]{10}$/, 'Số điện thoại phải có 10 chữ số'),
        Password: yup.string()
          .required('Mật khẩu là bắt buộc')
          .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
        ConfirmPassword: yup.string()
          .required('Xác nhận mật khẩu là bắt buộc')
          .oneOf([yup.ref('Password')], 'Mật khẩu xác nhận không khớp'),
      });
    },
  },
  methods: {
    async handleRegister() {
      try {
        this.message = '';
        
        // Chuẩn bị dữ liệu để gửi (không gửi ConfirmPassword)
        const { ConfirmPassword, ...registerData } = this.formData;
        
        // Convert Phai to number
        registerData.Phai = Number(registerData.Phai);
        
        // Gọi API đăng ký
        const result = await DocGiaService.create(registerData);
        
        this.messageType = 'success';
        this.message = `Đăng ký thành công! Mã độc giả của bạn là: ${result.MaDocGia}. Vui lòng đăng nhập.`;
        
        // Reset form
        this.formData = {
          HoLot: '',
          Ten: '',
          NgaySinh: '',
          Phai: '',
          DiaChi: '',
          DienThoai: '',
          Password: '',
          ConfirmPassword: '',
        };
        
        // Chuyển đến trang đăng nhập sau 3 giây
        setTimeout(() => {
          this.$router.push({ name: 'client.login' });
        }, 3000);
      } catch (error) {
        console.error('Lỗi đăng ký:', error);
        this.messageType = 'error';
        this.message = 'Đăng ký thất bại: ' + (error.response?.data?.message || error.message);
      }
    },
  },
};
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.register-card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 600px;
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-header h2 {
  color: #333;
  margin-bottom: 10px;
  font-weight: 600;
}

.register-header i {
  color: #667eea;
  margin-right: 10px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  font-weight: 500;
  color: #555;
  margin-bottom: 8px;
  display: block;
}

.form-control {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  transition: all 0.3s;
}

.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.form-control.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  display: block;
  color: #dc3545;
  font-size: 12px;
  margin-top: 5px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  padding: 12px;
  font-size: 16px;
  font-weight: 600;
  transition: transform 0.2s;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-block {
  width: 100%;
}

.alert {
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 20px;
}

.alert-success {
  background-color: #d4edda;
  border-color: #c3e6cb;
  color: #155724;
}

.alert-danger {
  background-color: #f8d7da;
  border-color: #f5c6cb;
  color: #721c24;
}

.text-primary {
  color: #667eea !important;
  text-decoration: none;
  font-weight: 500;
}

.text-primary:hover {
  text-decoration: underline;
}

.text-danger {
  color: #dc3545;
}

.text-muted {
  color: #6c757d;
}

@media (max-width: 768px) {
  .register-card {
    padding: 30px 20px;
  }
  
  .form-row {
    flex-direction: column;
  }
  
  .form-row .col-md-6 {
    width: 100%;
  }
}
</style>
