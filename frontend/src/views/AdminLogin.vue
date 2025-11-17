<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <i class="fas fa-user-shield fa-3x text-danger"></i>
        <h2>🔒 Khu vực Quản trị</h2>
        <p class="text-muted">Chỉ dành cho nhân viên thư viện</p>
        <div class="alert alert-warning mt-3 py-2">
          <small>
            <i class="fas fa-exclamation-triangle"></i> 
            <strong>BẢO MẬT:</strong> Trang này không công khai
          </small>
        </div>
      </div>

      <Form @submit="handleLogin" :validation-schema="loginSchema">
        <div class="form-group">
          <label for="MSNV">
            <i class="fas fa-id-card"></i> Mã số nhân viên
          </label>
          <Field
            name="MSNV"
            type="text"
            class="form-control"
            v-model="credentials.MSNV"
            placeholder="Nhập mã số nhân viên"
          />
          <ErrorMessage name="MSNV" class="error-feedback" />
        </div>

        <div class="form-group">
          <label for="Password">
            <i class="fas fa-lock"></i> Mật khẩu
          </label>
          <Field
            name="Password"
            type="password"
            class="form-control"
            v-model="credentials.Password"
            placeholder="Nhập mật khẩu"
          />
          <ErrorMessage name="Password" class="error-feedback" />
        </div>

        <div v-if="errorMessage" class="alert alert-danger">
          {{ errorMessage }}
        </div>

        <button type="submit" class="btn btn-danger btn-block" :disabled="loading">
          <i class="fas fa-sign-in-alt"></i>
          {{ loading ? 'Đang xác thực...' : 'Đăng nhập Admin' }}
        </button>
      </Form>

      <!-- XÓA LINK ĐẾN CLIENT LOGIN (Bảo mật) -->
    </div>
  </div>
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import NhanVienService from "@/services/nhanvien.service";

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const loginSchema = yup.object().shape({
      MSNV: yup
        .string()
        .required("Mã số nhân viên là bắt buộc."),
      Password: yup
        .string()
        .required("Mật khẩu là bắt buộc.")
        .min(4, "Mật khẩu phải có ít nhất 4 ký tự."),
    });

    return {
      credentials: {
        MSNV: "",
        Password: "",
      },
      loginSchema,
      errorMessage: "",
      loading: false,
    };
  },
  methods: {
    async handleLogin() {
      this.errorMessage = "";
      this.loading = true;

      try {
        const response = await NhanVienService.login(
          this.credentials.MSNV,
          this.credentials.Password
        );

        // Xóa hết localStorage cũ trước khi lưu mới
        localStorage.clear();
        
        // Lưu thông tin admin vào localStorage
        localStorage.setItem("admin", JSON.stringify(response));
        localStorage.setItem("userType", "admin");

        // Redirect đến trang admin dashboard
        this.$router.push({ name: "admin.dashboard" });
      } catch (error) {
        console.error(error);
        this.errorMessage = error.response?.data?.message || "Mã nhân viên hoặc mật khẩu không đúng!";
      } finally {
        this.loading = false;
      }
    },
  },
  created() {
    // Xóa localStorage khi vào trang login để AppHeader hiển thị đúng
    localStorage.clear();
  },
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  padding: 40px;
  max-width: 450px;
  width: 100%;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header i {
  color: #667eea;
  margin-bottom: 15px;
}

.login-header h2 {
  color: #333;
  margin-bottom: 10px;
}

.login-header p {
  color: #666;
  font-size: 14px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
}

.form-group label i {
  margin-right: 5px;
  color: #667eea;
}

.form-control {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.error-feedback {
  color: #dc3545;
  font-size: 13px;
  margin-top: 5px;
  display: block;
}

.alert {
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.btn-block {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-footer {
  margin-top: 25px;
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.login-footer p {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.login-footer a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.login-footer a:hover {
  text-decoration: underline;
}
</style>
