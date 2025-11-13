<template>
  <nav class="navbar">
    <div class="nav-container">
      <RouterLink to="/" class="nav-brand">
        <h2>My App</h2>
      </RouterLink>
      <ul class="nav-menu">
        <li class="nav-item">
          <RouterLink to="/" class="nav-link" active-class="active">
            Home
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/contacts" class="nav-link" active-class="active">
            Contacts
          </RouterLink>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>

<style scoped>
.navbar {
  background-color: #2c3e50;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  color: white;
}

.nav-brand h2 {
  margin: 0;
  font-size: 24px;
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 2rem;
  margin: 0;
}

.nav-link {
  color: #ecf0f1;
  font-size: 16px;
  transition: color 0.3s;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

.nav-link:hover {
  color: #3498db;
}

.nav-link.active {
  background-color: #34495e;
  color: white;
}
</style>
