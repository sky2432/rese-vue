import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import router from "../router/index";
import authRepository from "../repositories/authRepository";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],

  state: {
    auth: false,
    role: "",
    user: "",
    existsShop: false,
    shop: "",
  },

  getters: {
    auth(state) {
      return state.auth;
    },
    user(state) {
      return state.user;
    },
    existsShop(state) {
      return state.existsShop;
    },
    shop(state) {
      return state.shop;
    },
  },

  mutations: {
    auth(state, payload) {
      state.auth = payload;
    },
    role(state, payload) {
      state.role = payload;
    },
    user(state, payload) {
      state.user = payload;
    },
    existsShop(state, payload) {
      state.existsShop = payload;
    },
    shop(state, payload) {
      state.shop = payload;
    },
    resetShop(state) {
      state.shop = "";
    },
    resetLoginData(state) {
      state.user = "";
      state.role = "";
      state.shop = "";
    },
  },

  actions: {
    async login({ commit }, resData) {
      if (resData.auth === true) {
        commit("auth", resData.auth);
        commit("role", resData.role);
        commit("user", resData.data);
        if (resData.role === "user") {
          router.replace("/home");
        }
        if (resData.role === "owner") {
          router.replace("/owner");
        }
        if (resData.role === "admin") {
          router.replace("/");
        }
      }
    },

    async logout({ commit }) {
      const resData = await authRepository.logout();

      commit("auth", resData.data.auth);
      commit("resetLoginData");
      router.replace("/");
    },

    updateUser({ commit }, data) {
      commit("user", data);
    },

    shop({ commit }, data) {
      commit("shop", data);
    },

    resetShop({ commit }) {
      commit("resetShop");
    },

    existsShop({ commit }, data) {
      commit("existsShop", data);
    },
  },
});
