<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <i class="fas fa-user-circle fa-3x"></i>
        <h2>Đăng nhập Độc giả</h2>
        <p>Hệ thống mượn sách thư viện</p>
      </div>

      <Form @submit="handleLogin" :validation-schema="loginSchema">
        <div class="form-group">
          <label for="MaDocGia">
            <i class="fas fa-id-badge"></i> Mã độc giả
          </label>
          <Field
            name="MaDocGia"
            type="text"
            class="form-control"
            v-model="credentials.MaDocGia"
            placeholder="Nhập mã độc giả"
          />
          <ErrorMessage name="MaDocGia" class="error-feedback" />
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

        <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
          <i class="fas fa-sign-in-alt"></i>
          {{ loading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
        </button>
      </Form>

      <div class="login-footer">
        <p>Bạn là quản trị viên? 
          <router-link to="/admin/login">Đăng nhập tại đây</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import DocGiaService from "@/services/docgia.service";

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const loginSchema = yup.object().shape({
      MaDocGia: yup
        .string()
        .required("Mã độc giả là bắt buộc."),
      Password: yup
        .string()
        .required("Mật khẩu là bắt buộc.")
        .min(4, "Mật khẩu phải có ít nhất 4 ký tự."),
    });

    return {
      credentials: {
        MaDocGia: "",
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
        const response = await DocGiaService.login(
          this.credentials.MaDocGia,
          this.credentials.Password
        );

        // Lưu thông tin client vào localStorage
        localStorage.setItem("client", JSON.stringify(response));
        localStorage.setItem("userType", "client");

        // Redirect đến trang client dashboard
        this.$router.push({ name: "client.dashboard" });
      } catch (error) {
        console.error(error);
        this.errorMessage = error.response?.data?.message || "Mã độc giả hoặc mật khẩu không đúng!";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #56ab2f 0%, #a8e063 100%);
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
  color: #56ab2f;
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
  color: #56ab2f;
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
  border-color: #56ab2f;
  box-shadow: 0 0 0 3px rgba(86, 171, 47, 0.1);
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
  background: linear-gradient(135deg, #56ab2f 0%, #a8e063 100%);
  border: none;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(86, 171, 47, 0.4);
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
  color: #56ab2f;
  text-decoration: none;
  font-weight: 500;
}

.login-footer a:hover {
  text-decoration: underline;
}
</style>
