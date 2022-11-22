import { createRouter, createWebHistory, createWebHashHistory } from "vue-router";
import LoginView from "../views/Login.vue";
import PersonInfo from "../views/PersonInfo.vue";
import HomeView from "../views/Home.vue";
import EntryView from "../views/Entry.vue";
import RecoveryView from "../views/Recovery.vue";
import CreateView from "../views/Create.vue";
import MnemonicView from "../views/Mnemonic.vue";
import ConfirmView from "../views/Confirm.vue";

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
      path: "/entry",
      name: "entry",
      component: EntryView,
    },
    {
      path: "/recovery",
      name: "recovery",
      component: RecoveryView,
    },
    {
      path: "/create",
      name: "create",
      component: CreateView,
    },
    {
      path: "/mnemonic",
      name: "mnemonic",
      component: MnemonicView,
      params: true,
    },
    {
      path: "/confirm",
      name: "confirm",
      component: ConfirmView,
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

  let did = localStorage.getItem("userdid");
  let isDid = true;
  if (did == undefined || did == null) {
    isDid = false;
  }

  if (to.name == 'recovery') next()

  if (to.name == 'create') next()

  if (to.name !== 'entry' && !isAuthenticated && !isDid) {
    next({ name: 'entry' })
  } else {
    next()
  }
})

export default router;
