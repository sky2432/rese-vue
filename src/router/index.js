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
import Admin from "../views/Admin.vue";
import ShopDetail from "../views/ShopDetail.vue";
import OwnerDetail from "../views/OwnerDetail.vue";
import AccountDelete from "../views/AccountDelete.vue";
import store from "../store/index";
import multiguard from "vue-router-multiguard";

Vue.use(VueRouter);

const loginedAccount = function(to, from, next) {
  const auth = store.getters.auth;
  const role = store.getters.role;
  if ((auth && role === "user") || (auth && role === "guestUser")) {
    next("/home");
  }
  if ((auth && role === "owner") || (auth && role === "guestOwner")) {
    next("/owner");
  }
  if ((auth && role === "admin") || (auth && role === "guestAdmin")) {
    next("/admin");
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
      title: "予約",
      desc: "予約ページです。",
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
    path: "/mypage/:tabIndex",
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
    path: "/setting",
    name: "Setting",
    component: Setting,
    meta: {
      requiresAuth: true,
      title: "設定ページ",
      desc: "設定ぺージです。",
    },
  },
  {
    path: "/accountDelete",
    name: "AccountDelete",
    component: AccountDelete,
    meta: {
      title: "アカウント削除完了",
      desc: "アカウント削除完了ぺージです。",
    },
  },
  {
    path: "/owner",
    name: "Owner",
    component: Owner,
    meta: {
      requiresAuth: true,
      title: "オーナーページ",
      desc: "オーナーページです。",
    },
  },
  {
    path: "/admin",
    name: "Admin",
    component: Admin,
    meta: {
      requiresAuth: true,
      title: "管理者ページ",
      desc: "管理者ページです。",
    },
  },
  {
    path: "/admin/shops/:shopId",
    name: "ShopDetail",
    component: ShopDetail,
    props: true,
    meta: {
      requiresAuth: true,
      title: "店舗詳細",
      desc: "店舗詳細ページです",
    },
  },
  {
    path: "/admin/owner/:ownerId",
    name: "OwnerDetail",
    component: OwnerDetail,
    props: true,
    meta: {
      requiresAuth: true,
      title: "オーナー詳細",
      desc: "オーナー詳細ページです",
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
  const role = store.getters.role;
  if (role === "user" || role === "guestUser") {
    if (
      to.name === "Owner" ||
      to.name === "Admin" ||
      to.name === "ShopDetail" ||
      to.name === "OwnerDetail"
    ) {
      next("/home");
    }
  }
  if (role === "owner" || role === "guestOwner") {
    if (
      to.name === "Admin" ||
      to.name === "ShopDetail" ||
      to.name === "OwnerDetail"
    ) {
      next("/owner");
    }
  }
  if (role === "admin" || role === "guestAdmin") {
    if (to.name === "Owner") {
      next("/admin");
    }
  }
  if (
    role === "owner" ||
    role === "guestOwner" ||
    role === "admin" ||
    role === "guestAdmin"
  ) {
    if (
      to.name === "Home" ||
      to.name === "Detail" ||
      to.name === "Done" ||
      to.name === "Mypage" ||
      to.name === "Setting" ||
      to.name === "AccountDelete"
    ) {
      if (role === "owner" || role === "guestOwner") next("/owner");
      if (role === "admin" || role === "guestAdmin") next("/admin");
    }
  }
  next();
});

export default router;
