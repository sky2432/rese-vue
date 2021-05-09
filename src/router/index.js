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
import store from "../store/index";


Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "TopPage",
    component: TopPage,
    meta: {
      title: "トップページ",
      desc: "トップページです。",
    },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: {
      title: "会員登録",
      desc: "会員登録ページです。",
    },
  },
  {
    path: "/thanks",
    name: "Thanks",
    component: Thanks,
    meta: {
      title: "会員登録完了",
      desc: "会員登録完了ページです。",
    },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      title: "ログイン",
      desc: "ログインページです。",
    },
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
    path: "/detail/:shop_id",
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
    path: "/mypage/:id",
    name: "Mypage",
    component: Mypage,
    props: true,
    meta: {
      requiresAuth: true,
      title: "マイページ",
      desc: "マイページです。",
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
    !store.state.auth
  ) {
    next({
      path: "/",
      query: {
        redirect: to.fullPath,
      },
    });
  }
  next();
});

export default router;
