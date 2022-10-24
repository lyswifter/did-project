import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/Login.vue";
import PersonInfo from "../views/PersonInfo.vue";
import HomeView from "../views/Home.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: LoginView,
    },
    {
      path: "/personinfo",
      name: "personInfo",
      component: PersonInfo,
    },
    {
      path: "/home",
      name: "home",
      component: HomeView,
    }
    // {
    //   path: "/about",
    //   name: "about",
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import("../views/AboutView.vue"),
    // },
  ],
});

export default router;
