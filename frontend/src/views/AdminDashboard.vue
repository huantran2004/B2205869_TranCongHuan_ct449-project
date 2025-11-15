<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h2><i class="fas fa-tachometer-alt"></i> Admin Dashboard</h2>
      <div class="user-info">
        <span><i class="fas fa-user"></i> {{ admin.HoTenNV }}</span>
        <span class="badge">{{ admin.ChucVu }}</span>
        <button class="btn btn-sm btn-danger" @click="logout">
          <i class="fas fa-sign-out-alt"></i> Đăng xuất
        </button>
      </div>
    </div>

    <div class="dashboard-content">
      <div class="welcome-card">
        <h3>Chào mừng, {{ admin.HoTenNV }}!</h3>
        <p>MSNV: {{ admin.MSNV }}</p>
        <p>Chức vụ: {{ admin.ChucVu }}</p>
        <p>SĐT: {{ admin.SoDienThoai }}</p>
      </div>

      <div class="quick-links">
        <h4>Quản lý</h4>
        <div class="link-grid">
          <router-link to="/admin/statistics" class="link-card">
            <i class="fas fa-chart-bar fa-2x"></i>
            <span>Thống kê tổng quan</span>
          </router-link>
          <router-link to="/admin/sach" class="link-card">
            <i class="fas fa-book fa-2x"></i>
            <span>Quản lý Sách</span>
          </router-link>
          <router-link to="/admin/docgia" class="link-card">
            <i class="fas fa-users fa-2x"></i>
            <span>Quản lý Độc giả</span>
          </router-link>
          <router-link to="/admin/nhanvien" class="link-card">
            <i class="fas fa-user-tie fa-2x"></i>
            <span>Quản lý Nhân viên</span>
          </router-link>
          <router-link to="/admin/theodoimuonsach" class="link-card">
            <i class="fas fa-book-reader fa-2x"></i>
            <span>Theo dõi mượn sách</span>
          </router-link>
          <router-link to="/admin/nhaxuatban" class="link-card">
            <i class="fas fa-building fa-2x"></i>
            <span>Nhà xuất bản</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      admin: null,
    };
  },
  methods: {
    logout() {
      if (confirm("Bạn có chắc muốn đăng xuất?")) {
        localStorage.removeItem("admin");
        localStorage.removeItem("userType");
        this.$router.push({ name: "admin.login" });
      }
    },
  },
  created() {
    const adminData = localStorage.getItem("admin");
    if (!adminData) {
      this.$router.push({ name: "admin.login" });
      return;
    }
    this.admin = JSON.parse(adminData);
  },
};
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 30px;
  border-radius: 10px;
  margin-bottom: 30px;
}

.dashboard-header h2 {
  margin: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.badge {
  background: rgba(255, 255, 255, 0.3);
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 14px;
}

.welcome-card {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.welcome-card h3 {
  color: #667eea;
  margin-bottom: 15px;
}

.welcome-card p {
  margin: 8px 0;
  color: #666;
}

.quick-links h4 {
  margin-bottom: 20px;
  color: #333;
}

.link-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.link-card {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  text-decoration: none;
  color: #333;
  transition: all 0.3s;
}

.link-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.3);
  color: #667eea;
}

.link-card i {
  color: #667eea;
  margin-bottom: 15px;
}

.link-card span {
  display: block;
  font-weight: 500;
}
</style>
