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
    },
  ],
});

export default router;
