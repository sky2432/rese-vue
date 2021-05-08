import Repository from "./Repository";

const resource = "/users";
export default {
  login(payload) {
    return Repository.post(`${resource}/login`, payload);
  },

  confirm(payload) {
    return Repository.post(`${resource}/login/confirm`, payload);
  },

  logout() {
    return Repository.post(`${resource}/logout`);
  },
};
