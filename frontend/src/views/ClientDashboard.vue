<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h2><i class="fas fa-book-reader"></i> Trang Độc giả</h2>
      <div class="user-info">
        <span><i class="fas fa-user"></i> {{ docgia.HoLot }} {{ docgia.Ten }}</span>
        <button class="btn btn-sm btn-danger" @click="logout">
          <i class="fas fa-sign-out-alt"></i> Đăng xuất
        </button>
      </div>
    </div>

    <div class="dashboard-content">
      <div class="welcome-card">
        <h3>Xin chào, {{ docgia.HoLot }} {{ docgia.Ten }}!</h3>
        <p>Mã độc giả: {{ docgia.MaDocGia }}</p>
        <p>Ngày sinh: {{ formatDate(docgia.NgaySinh) }}</p>
        <p>Giới tính: {{ docgia.Phai }}</p>
        <p>Địa chỉ: {{ docgia.DiaChi }}</p>
        <p>Điện thoại: {{ docgia.DienThoai }}</p>
      </div>

      <div class="quick-links">
        <h4>Chức năng</h4>
        <div class="link-grid">
          <router-link to="/client/books" class="link-card">
            <i class="fas fa-book fa-2x"></i>
            <span>Xem danh sách sách</span>
          </router-link>
          <router-link to="/client/history" class="link-card">
            <i class="fas fa-history fa-2x"></i>
            <span>Lịch sử mượn sách</span>
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
      docgia: null,
    };
  },
  methods: {
    logout() {
      if (confirm("Bạn có chắc muốn đăng xuất?")) {
        localStorage.removeItem("client");
        localStorage.removeItem("userType");
        this.$router.push({ name: "client.login" });
      }
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN');
    },
  },
  created() {
    const clientData = localStorage.getItem("client");
    if (!clientData) {
      this.$router.push({ name: "client.login" });
      return;
    }
    this.docgia = JSON.parse(clientData);
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
  background: linear-gradient(135deg, #56ab2f 0%, #a8e063 100%);
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

.welcome-card {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.welcome-card h3 {
  color: #56ab2f;
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
  cursor: pointer;
}

.link-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(86, 171, 47, 0.3);
  color: #56ab2f;
}

.link-card i {
  color: #56ab2f;
  margin-bottom: 15px;
}

.link-card span {
  display: block;
  font-weight: 500;
}
</style>
