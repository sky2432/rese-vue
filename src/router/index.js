import Vue from 'vue'
import VueRouter from 'vue-router'
import Register from "../views/Register.vue";
import Thanks from "../views/Thanks.vue";
import Login from "../views/Login.vue";
import Home from "../views/Home.vue";

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
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
    path: "/home",
    name: "Home",
    component: Home,
    meta: { title: "ホーム", desc: "ホーム画面です。" },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
