import Vue from 'vue'
import VueRouter from 'vue-router'
import Register from "../views/Register.vue";
import Thanks from "../views/Thanks.vue";
import Login from "../views/Login.vue";
import Home from "../views/Home.vue";
import Detail from "../views/Detail.vue";
import Done from "../views/Done.vue";
import TopPage from "../views/TopPage.vue";

Vue.use(VueRouter)

const routes = [
  {
    path: "/topPage",
    name: "TopPage",
    component: TopPage,
    meta: { title: "トップページ", desc: "トップページです。" },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: { title: "会員登録", desc: "会員登録ページです。" },
  },
  {
    path: "/thanks",
    name: "Thanks",
    component: Thanks,
    meta: { title: "会員登録完了", desc: "会員登録完了ページです。" },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { title: "ログイン", desc: "ログインページです。" },
  },
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { title: "ホーム", desc: "飲食店一覧ページです。" },
  },
  {
    path: "/detail/:id",
    name: "Detail",
    component: Detail,
    props: true,
    meta: { title: "店舗詳細", desc: "店舗詳細ページです。" },
  },
  {
    path: "/done",
    name: "Done",
    component: Done,
    meta: { title: "予約完了", desc: "予約完了ページです。" },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
