import { createWebHistory, createRouter } from "vue-router";
import SachBook from "@/views/SachBook.vue";

const routes = [
  {
    path: "/",
    name: "sachbook",
    component: SachBook,
  },
  {
    path: "/sach/add",
    name: "sach.add",
    component: () => import("@/views/SachEdit.vue"),
  },
  {
    path: "/sach/:id",
    name: "sach.edit",
    component: () => import("@/views/SachEdit.vue"),
    props: true, 
  },
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

export default router;
