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
    user: "",
  },

  mutations: {
    auth(state, payload) {
      state.auth = payload;
    },
    user(state, payload) {
      state.user = payload;
    },
    updateUser(state, payload) {
      state.user = payload;
    },
  },

  actions: {
    async login({ commit }, { email, password }) {
      const sendData = {
        email: email,
        password: password,
      };
      const resData = await authRepository.login(sendData);

      if (resData.data.auth === true) {
        commit("auth", resData.data.auth);
        commit("user", resData.data.data);

        if (resData.data.data.role === "user") {
          router.replace("/home");
        }
      }
    },

    async logout({ commit }) {
      const resData = await authRepository.logout();

      commit("auth", resData.data.auth);
      router.replace("/");
    },
  },
});
