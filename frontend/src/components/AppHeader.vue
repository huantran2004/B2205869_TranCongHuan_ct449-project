<template>
  <nav class="navbar navbar-expand navbar-dark bg-dark">
    <a href="/" class="navbar-brand">Ứng dụng Quản lý mượn sách</a>
    <div class="mr-auto navbar-nav">
      <li class="nav-item">
        <router-link :to="{ name: 'sachbook' }" class="nav-link">
          Danh sách sách
          <i class="fas fa-book"></i>
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
      return this.userType === 'admin' ? 'Admin' : 'Độc giả';
    },
    userName() {
      if (this.userType === 'admin') {
        const admin = JSON.parse(localStorage.getItem('admin') || '{}');
        return admin.HoTenNV || 'Admin';
      } else {
        const client = JSON.parse(localStorage.getItem('client') || '{}');
        return `${client.HoLot || ''} ${client.Ten || ''}`.trim() || 'Độc giả';
      }
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
