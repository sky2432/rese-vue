import Repository from "./Repository";

const resource = "login";
export default {
  userLogin(payload) {
    return Repository.post(`users/${resource}`, payload);
  },

  ownerLogin(payload) {
    return Repository.post(`owners/${resource}`, payload);
  },

  adminLogin(payload) {
    return Repository.post(`admins/${resource}`, payload);
  },

  logout() {
    return Repository.post(`logout`);
  },
};
