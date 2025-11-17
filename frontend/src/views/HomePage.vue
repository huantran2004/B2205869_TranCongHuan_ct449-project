<template>
  <div class="home-container">
    <div class="home-content">
      <!-- Hero Section -->
      <div class="hero-section">
        <i class="fas fa-book-open fa-5x text-white mb-4"></i>
        <h1 class="display-4 text-white mb-3">📚 Thư viện Trường Đại học</h1>
        <p class="lead text-white mb-5">Hệ thống mượn sách trực tuyến - Nhanh chóng, tiện lợi</p>
      </div>
      
      <!-- Client Login Card -->
      <div class="client-login-section">
        <div class="login-card">
          <i class="fas fa-user-circle fa-4x text-success mb-3"></i>
          <h3 class="mb-3">Đăng nhập Độc giả</h3>
          <p class="text-muted mb-4">
            <i class="fas fa-check-circle text-success"></i> Mượn sách trực tuyến<br>
            <i class="fas fa-check-circle text-success"></i> Xem lịch sử mượn sách<br>
            <i class="fas fa-check-circle text-success"></i> Quản lý tài khoản cá nhân
          </p>
          <button class="btn btn-success btn-lg px-5" @click="goToClientLogin">
            <i class="fas fa-sign-in-alt"></i> Đăng nhập ngay
          </button>
        </div>
      </div>
      
      <!-- Quick Links -->
      <div class="quick-links mt-5">
        <h5 class="text-white mb-4">
          <i class="fas fa-star"></i> Hoặc khám phá ngay
        </h5>
        <div class="d-flex justify-content-center gap-3 flex-wrap">
          <button class="btn btn-outline-light" @click="viewBooks">
            <i class="fas fa-book"></i> Xem danh sách sách
          </button>
          <button class="btn btn-outline-light" @click="showGuide">
            <i class="fas fa-info-circle"></i> Hướng dẫn sử dụng
          </button>
        </div>
      </div>
      
      <!-- Footer Info -->
      <div class="footer-info mt-5">
        <p class="text-white-50 small">
          <i class="fas fa-map-marker-alt"></i> Trường Đại học Cần Thơ<br>
          <i class="fas fa-phone"></i> Hotline: 0292-xxxx-xxx | 
          <i class="fas fa-envelope"></i> library@ctu.edu.vn
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  methods: {
    goToClientLogin() {
      this.$router.push({ name: 'client.login' });
    },
    viewBooks() {
      // Yêu cầu login để xem sách
      this.$router.push({ name: 'client.login' });
    },
    showGuide() {
      alert('Hướng dẫn sử dụng:\n\n1. Đăng nhập bằng Mã độc giả và Số điện thoại\n2. Xem danh sách sách\n3. Gửi yêu cầu mượn sách\n4. Theo dõi trạng thái: Chờ duyệt → Đã duyệt → Đã trả\n5. Sử dụng AI Voice Search để tìm sách bằng giọng nói!');
    }
  },
  created() {
    // Auto redirect nếu đã đăng nhập
    const userType = localStorage.getItem('userType');
    if (userType === 'admin') {
      // Admin đã login → redirect về admin dashboard
      this.$router.push({ name: 'admin.dashboard' });
    } else if (userType === 'client') {
      // Client đã login → redirect về client dashboard
      this.$router.push({ name: 'client.dashboard' });
    }
    // Nếu chưa login → giữ nguyên HomePage (public landing page for clients)
  }
};
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #56ab2f 100%);
  padding: 20px;
}

.home-content {
  text-align: center;
  max-width: 900px;
  width: 100%;
}

/* Hero Section */
.hero-section {
  margin-bottom: 50px;
}

.hero-section h1 {
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.hero-section p {
  font-size: 1.25rem;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
}

/* Client Login Section */
.client-login-section {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.login-card {
  background: white;
  border-radius: 20px;
  padding: 50px 60px;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3);
  max-width: 450px;
  width: 100%;
  transition: all 0.3s ease;
}

.login-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

.login-card h3 {
  color: #333;
  font-weight: 600;
}

.login-card p {
  color: #666;
}

.login-card .btn {
  padding: 12px 40px;
  font-size: 1.1rem;
  border-radius: 25px;
  transition: all 0.3s;
}

.login-card .btn:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(40, 167, 69, 0.4);
}

/* Quick Links */
.quick-links h5 {
  font-weight: 500;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.quick-links .btn-outline-light {
  padding: 10px 25px;
  border-radius: 20px;
  transition: all 0.3s;
  margin: 0 10px;
}

.quick-links .btn-outline-light:hover {
  background: white;
  color: #667eea;
  transform: translateY(-2px);
}

/* Footer Info */
.footer-info {
  font-size: 0.9rem;
}

.footer-info i {
  margin: 0 5px;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-section h1 {
    font-size: 2rem;
  }
  
  .hero-section p {
    font-size: 1rem;
  }
  
  .login-card {
    padding: 40px 30px;
  }
  
  .quick-links .btn-outline-light {
    display: block;
    margin: 10px auto;
    width: 80%;
  }
}
</style>
