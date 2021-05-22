import Vue from "vue";
import VueRouter from "vue-router";
import Register from "../views/Register.vue";
import Thanks from "../views/Thanks.vue";
import Login from "../views/Login.vue";
import Home from "../views/Home.vue";
import Detail from "../views/Detail.vue";
import Done from "../views/Done.vue";
import TopPage from "../views/TopPage.vue";
import Mypage from "../views/Mypage.vue";
import Setting from "../views/Setting.vue";
import Owner from "../views/Owner.vue";
import store from "../store/index";
import multiguard from "vue-router-multiguard";

Vue.use(VueRouter);

const loginedAccount = function(to, from, next) {
  if (store.state.auth && store.state.role === "user") {
    next("/home");
  }
  if (store.state.auth && store.state.role === "owner") {
    next("/owner");
  }
  next();
};

const routes = [
  {
    path: "/",
    name: "TopPage",
    component: TopPage,
    meta: {
      title: "トップページ",
      desc: "トップページです。",
    },
    beforeEnter: multiguard([loginedAccount]),
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: {
      title: "会員登録",
      desc: "会員登録ページです。",
    },
    beforeEnter: multiguard([loginedAccount]),
  },
  {
    path: "/thanks",
    name: "Thanks",
    component: Thanks,
    meta: {
      title: "会員登録完了",
      desc: "会員登録完了ページです。",
    },
    beforeEnter: multiguard([loginedAccount]),
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      title: "ログイン",
      desc: "ログインページです。",
    },
    beforeEnter: multiguard([loginedAccount]),
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
    meta: {
      requiresAuth: true,
      title: "ホーム",
      desc: "飲食店一覧ページです。",
    },
  },
  {
    path: "/detail/:shopId",
    name: "Detail",
    component: Detail,
    props: true,
    meta: {
      requiresAuth: true,
      title: "店舗詳細",
      desc: "店舗詳細ページです。",
    },
  },
  {
    path: "/done",
    name: "Done",
    component: Done,
    meta: {
      requiresAuth: true,
      title: "予約完了",
      desc: "予約完了ページです。",
    },
  },
  {
    path: "/mypage",
    name: "Mypage",
    component: Mypage,
    meta: {
      requiresAuth: true,
      title: "マイページ",
      desc: "マイページです。",
    },
  },
  {
    path: "/setting",
    name: "Setting",
    component: Setting,
    props: true,
    meta: {
      requiresAuth: true,
      title: "設定ページ",
      desc: "設定ぺージです。",
    },
  },
  {
    path: "/owner",
    name: "Owner",
    component: Owner,
    meta: {
      requiresAuth: true,
      title: "店舗代表者ページ",
      desc: "店舗代表者ページです。",
    },
  },
  {
    path: "*",
    redirect: "/",
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !store.getters.auth
  ) {
    next({
      path: "/",
      query: {
        redirect: to.fullPath,
      },
    });
  }
  if (store.state.role === "user") {
    if (to.name === "Owner") {
      next("/home");
    }
  }
  if (store.state.role === "owner") {
    if (
      to.name === "Home" ||
      to.name === "Detail" ||
      to.name === "Done" ||
      to.name === "Mypage" ||
      to.name === "Setting"
    ) {
      next("/owner");
    }
  }
  next();
});

export default router;
