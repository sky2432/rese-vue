import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import router from "../router/index";
import authRepository from "../repositories/authRepository";
import Repository from "../repositories/Repository";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],

  state: {
    auth: false,
    role: "",
    apiToken: "",
    user: "",
  },

  getters: {
    auth(state) {
      return state.auth;
    },
    user(state) {
      return state.user;
    },
    role(state) {
      return state.role;
    },
    apiToken(state) {
      return state.apiToken;
    },
  },

  mutations: {
    auth(state, payload) {
      state.auth = payload;
    },
    role(state, payload) {
      state.role = payload;
    },
    apiToken(state, payload) {
      state.apiToken = payload;
    },
    user(state, payload) {
      state.user = payload;
    },
    resetLoginData(state) {
      state.user = "";
      state.role = "";
      state.apiToken = "";
    },
  },

  actions: {
    async login({ commit }, resData) {
      console.log('vuex');
      if (resData.auth === true) {
        Repository.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${resData.token}`;

        commit("auth", resData.auth);
        commit("role", resData.role);
        commit("apiToken", resData.token);
        commit("user", resData.data);

        if (resData.role === "user") {
          router.replace("/home");
        }
        if (resData.role === "owner") {
          router.replace("/owner");
        }
        if (resData.role === "admin") {
          router.replace("/admin");
        }
      }
    },

    async logout({ commit }) {
      delete Repository.defaults.headers.common["Authorization"];

      const resData = await authRepository.logout();

      commit("auth", resData.data.auth);
      commit("resetLoginData");
    },

    updateUser({ commit }, data) {
      commit("user", data);
    },
  },
});
