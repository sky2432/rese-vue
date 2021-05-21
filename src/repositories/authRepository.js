import Repository from "./Repository";

const resource = "login";
export default {
  login(type, payload) {
    return Repository.post(`${resource}/${type}`, payload);
  },

  logout() {
    return Repository.post(`logout`);
  },
};
