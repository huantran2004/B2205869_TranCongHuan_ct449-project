<template>
  <nav class="navbar navbar-expand navbar-dark bg-dark">
    <router-link to="/" class="navbar-brand">Ứng dụng Quản lý mượn sách</router-link>
    <div class="mr-auto navbar-nav">
      <!-- Chỉ hiển thị menu khi đã đăng nhập -->
      <li v-if="isLoggedIn && userType === 'admin'" class="nav-item">
        <router-link :to="{ name: 'admin.sach' }" class="nav-link">
          <i class="fas fa-book"></i> Danh sách sách
        </router-link>
      </li>
      <li v-if="isLoggedIn && userType === 'client'" class="nav-item">
        <router-link :to="{ name: 'client.books' }" class="nav-link">
          <i class="fas fa-book"></i> Danh sách sách
        </router-link>
      </li>
    </div>
    <div class="navbar-nav ml-auto">
      <!-- Nếu chưa đăng nhập -->
      <li v-if="!isLoggedIn" class="nav-item">
        <router-link :to="{ name: 'admin.login' }" class="nav-link">
          <i class="fas fa-sign-in-alt"></i> Đăng nhập Admin
        </router-link>
      </li>
      <li v-if="!isLoggedIn" class="nav-item">
        <router-link :to="{ name: 'client.login' }" class="nav-link">
          <i class="fas fa-sign-in-alt"></i> Đăng nhập Độc giả
        </router-link>
      </li>
      
      <!-- Nếu đã đăng nhập -->
      <li v-if="isLoggedIn" class="nav-item">
        <span class="nav-link">
          <i class="fas fa-user"></i> {{ userName }} ({{ userTypeLabel }})
        </span>
      </li>
      <li v-if="isLoggedIn" class="nav-item">
        <router-link :to="dashboardRoute" class="nav-link">
          <i class="fas fa-tachometer-alt"></i> Dashboard
        </router-link>
      </li>
      <li v-if="isLoggedIn" class="nav-item">
        <a href="#" @click.prevent="logout" class="nav-link">
          <i class="fas fa-sign-out-alt"></i> Đăng xuất
        </a>
      </li>
    </div>
  </nav>
</template>

<script>
export default {
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem('userType');
    },
    userType() {
      return localStorage.getItem('userType');
    },
    userTypeLabel() {
      return this.userType === 'admin' ? 'Quản trị viên' : 'Độc giả';
    },
    userName() {
      if (this.userType === 'admin') {
        const adminData = localStorage.getItem('admin');
        if (!adminData) return 'Admin';
        try {
          const admin = JSON.parse(adminData);
          return admin.HoTenNV || 'Admin';
        } catch (e) {
          return 'Admin';
        }
      } else if (this.userType === 'client') {
        const clientData = localStorage.getItem('client');
        if (!clientData) return 'Độc giả';
        try {
          const client = JSON.parse(clientData);
          const hoLot = client.HoLot || '';
          const ten = client.Ten || '';
          return `${hoLot} ${ten}`.trim() || 'Độc giả';
        } catch (e) {
          return 'Độc giả';
        }
      }
      return 'Người dùng';
    },
    dashboardRoute() {
      return this.userType === 'admin' 
        ? { name: 'admin.dashboard' }
        : { name: 'client.dashboard' };
    }
  },
  methods: {
    logout() {
      if (confirm('Bạn có chắc muốn đăng xuất?')) {
        localStorage.removeItem('admin');
        localStorage.removeItem('client');
        localStorage.removeItem('userType');
        
        const loginRoute = this.userType === 'admin' 
          ? { name: 'admin.login' }
          : { name: 'client.login' };
        
        this.$router.push(loginRoute);
      }
    }
  }
};
</script>

<style scoped>
.ml-auto {
  margin-left: auto;
}
</style>
