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
    updateUser(state, payload) {
      state.user = payload;
    },
    resetRole(state) {
      state.role = "";
    },
    resetUser(state) {
      state.user = "";
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
      commit("resetRole");
      commit("resetUser");
      router.replace("/");
    },
  },
});
