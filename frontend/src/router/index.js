import { createWebHistory, createRouter } from "vue-router";
import SachBook from "@/views/SachBook.vue";
import HomePage from "@/views/HomePage.vue";

const routes = [
  // Home - Redirect to login selection page
  {
    path: "/",
    name: "home",
    component: HomePage,
  },
  // Login routes
  {
    path: "/admin/login",
    name: "admin.login",
    component: () => import("@/views/AdminLogin.vue"),
  },
  {
    path: "/client/login",
    name: "client.login",
    component: () => import("@/views/ClientLogin.vue"),
  },
  // Dashboard routes
  {
    path: "/admin/dashboard",
    name: "admin.dashboard",
    component: () => import("@/views/AdminDashboard.vue"),
    meta: { requiresAuth: true, userType: 'admin' }
  },
  {
    path: "/client/dashboard",
    name: "client.dashboard",
    component: () => import("@/views/ClientDashboard.vue"),
    meta: { requiresAuth: true, userType: 'client' }
  },
  
  // Admin Management Routes
  {
    path: "/admin/statistics",
    name: "admin.statistics",
    component: () => import("@/views/AdminStatistics.vue"),
    meta: { requiresAuth: true, userType: 'admin' }
  },
  {
    path: "/admin/sach",
    name: "admin.sach",
    component: SachBook,
    meta: { requiresAuth: true, userType: 'admin' }
  },
  {
    path: "/admin/sach/add",
    name: "admin.sach.add",
    component: () => import("@/views/SachEdit.vue"),
    meta: { requiresAuth: true, userType: 'admin' }
  },
  {
    path: "/admin/sach/:id",
    name: "admin.sach.edit",
    component: () => import("@/views/SachEdit.vue"),
    props: true,
    meta: { requiresAuth: true, userType: 'admin' }
  },
  {
    path: "/admin/docgia",
    name: "admin.docgia",
    component: () => import("@/views/DocGiaManagement.vue"),
    meta: { requiresAuth: true, userType: 'admin' }
  },
  {
    path: "/admin/nhanvien",
    name: "admin.nhanvien",
    component: () => import("@/views/NhanVienManagement.vue"),
    meta: { requiresAuth: true, userType: 'admin' }
  },
  {
    path: "/admin/nhaxuatban",
    name: "admin.nhaxuatban",
    component: () => import("@/views/NhaXuatBanManagement.vue"),
    meta: { requiresAuth: true, userType: 'admin' }
  },
  {
    path: "/admin/theodoimuonsach",
    name: "admin.theodoimuonsach",
    component: () => import("@/views/TheoDoiMuonSachManagement.vue"),
    meta: { requiresAuth: true, userType: 'admin' }
  },
  
  // Client Routes
  {
    path: "/client/books",
    name: "client.books",
    component: () => import("@/views/ClientBookList.vue"),
    meta: { requiresAuth: true, userType: 'client' }
  },
  {
    path: "/client/history",
    name: "client.history",
    component: () => import("@/views/ClientBorrowHistory.vue"),
    meta: { requiresAuth: true, userType: 'client' }
  },
  
  // 404 Not Found
  {
    path: '/:pathMatch(.*)*',       
    name: 'notfound',
    component: () => import('@/views/NotFound.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const userType = localStorage.getItem('userType');
  
  if (requiresAuth) {
    const requiredType = to.meta.userType;
    
    if (!userType) {
      // Chưa đăng nhập
      if (requiredType === 'admin') {
        next({ name: 'admin.login' });
      } else {
        next({ name: 'client.login' });
      }
    } else if (userType !== requiredType) {
      // Đăng nhập nhưng sai quyền
      alert('Bạn không có quyền truy cập trang này!');
      next(false);
    } else {
      // Xóa localStorage của user type khác để tránh xung đột
      if (requiredType === 'admin') {
        localStorage.removeItem('client');
      } else if (requiredType === 'client') {
        localStorage.removeItem('admin');
      }
      next();
    }
  } else {
    next();
  }
});

export default router;
