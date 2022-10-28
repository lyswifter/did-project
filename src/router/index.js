import { createRouter, createWebHistory, createWebHashHistory } from "vue-router";
import LoginView from "../views/Login.vue";
import PersonInfo from "../views/PersonInfo.vue";
import HomeView from "../views/Home.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/home",
    },
    {
      path: "/home",
      name: "home",
      component: HomeView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/personinfo",
      name: "personInfo",
      component: PersonInfo,
    },
  ],
});

router.beforeEach((to, from, next) => {
  let token = localStorage.getItem("token");
  let isAuthenticated = true;
  if (token == undefined || token == null) {
    isAuthenticated = false;
  }

  if (to.name !== 'login' && !isAuthenticated) next({ name: 'login' })
  // else if (to.redirectedFrom) {
  //   router.replace(to.redirectedFrom);
  // }
  else next()
})

export default router;
