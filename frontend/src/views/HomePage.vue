<template>
  <div class="home-container">
    <div class="home-content">
      <h1><i class="fas fa-book-open"></i> Hệ thống Quản lý Mượn Sách</h1>
      <p class="subtitle">Chào mừng bạn đến với hệ thống quản lý thư viện</p>
      
      <div class="login-options">
        <div class="login-card admin-card" @click="goToAdminLogin">
          <i class="fas fa-user-shield fa-4x"></i>
          <h3>Đăng nhập Admin</h3>
          <p>Quản lý hệ thống, sách, độc giả</p>
          <button class="btn btn-primary">
            Đăng nhập <i class="fas fa-arrow-right"></i>
          </button>
        </div>
        
        <div class="login-card client-card" @click="goToClientLogin">
          <i class="fas fa-user-circle fa-4x"></i>
          <h3>Đăng nhập Độc giả</h3>
          <p>Xem sách, lịch sử mượn trả</p>
          <button class="btn btn-success">
            Đăng nhập <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
      
      <div class="quick-access">
        <p>hoặc</p>
        <router-link to="/" class="btn btn-outline">
          <i class="fas fa-book"></i> Xem danh sách sách
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goToAdminLogin() {
      this.$router.push({ name: 'admin.login' });
    },
    goToClientLogin() {
      this.$router.push({ name: 'client.login' });
    }
  },
  created() {
    // Redirect nếu đã đăng nhập
    const userType = localStorage.getItem('userType');
    if (userType === 'admin') {
      this.$router.push({ name: 'admin.dashboard' });
    } else if (userType === 'client') {
      this.$router.push({ name: 'client.dashboard' });
    }
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
  max-width: 1000px;
}

.home-content h1 {
  color: white;
  font-size: 3rem;
  margin-bottom: 15px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
  margin-bottom: 50px;
}

.login-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.login-card {
  background: white;
  border-radius: 15px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.3s;
}

.login-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
}

.admin-card i {
  color: #667eea;
}

.client-card i {
  color: #56ab2f;
}

.login-card h3 {
  margin: 20px 0 10px;
  color: #333;
}

.login-card p {
  color: #666;
  margin-bottom: 25px;
}

.quick-access {
  margin-top: 40px;
}

.quick-access p {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 15px;
}

.btn-outline {
  background: transparent;
  border: 2px solid white;
  color: white;
  padding: 12px 30px;
  border-radius: 25px;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s;
}

.btn-outline:hover {
  background: white;
  color: #667eea;
}

@media (max-width: 768px) {
  .home-content h1 {
    font-size: 2rem;
  }
  
  .login-options {
    grid-template-columns: 1fr;
  }
}
</style>
