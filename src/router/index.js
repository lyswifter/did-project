import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/Login.vue";
import PersonInfo from "../views/PersonInfo.vue";
import HomeView from "../views/Home.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
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
let fromStr = from.path;
console.log(fromStr);

  let token = localStorage.getItem("token");
  let isAuthenticated = true;
  if (token == undefined || token == null) {
    isAuthenticated = false;
  }

  if (to.name !== 'login' && !isAuthenticated) next({ name: 'login' })
  // else if () {

  // }
  else next()
})

export default router;
