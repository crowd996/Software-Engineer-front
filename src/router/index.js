import { createRouter, createWebHistory } from "vue-router";
import store from "../store";
import component from "element-plus/es/components/tree-select/src/tree-select-option.mjs";

// 在createRouter中需要导入页面的相关信息
const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/login/LoginView.vue"),
    meta: { requiresAuth: false }
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/login/LoginView.vue"),
    meta: { requiresAuth: false }
  },
  {
    path: "/reception",
    name: "Reception",
    component: () => import("../views/reception_board/RecpBoardView.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/ac",
    name: "AC",
    component: () => import("../views/AC_board/ACView.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/404",
    name: "404",
    component: () => import("../views/error/404.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/client",
    name: "Client",
    component: () => import("../views/client_panel/client_panel.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/ac_panel",
    name: "AC_Panel",
    component: () => import("../views/air_panel/air_panel.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/manager",
    name: "Manager",
    component: () => import("../views/manager/Manager.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import("../views/error/404.vue"),
    meta: { requiresAuth: false }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters.isLoggedIn && !localStorage.getItem('user')) {
      // 如果用户未登录，重定向到登录页面
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    } else {
      // 如果用户已登录，允许访问
      next();
    }
  } else {
    // 如果路由不需要认证，直接前往
    next();
  }
  next();
});

export default router;