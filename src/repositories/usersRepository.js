import Repository from "./Repository";

const resource = "/users";
export default {
  getUsers() {
    return Repository.get(`${resource}`);
  },

  confirmUser(payload) {
    return Repository.post(`${resource}/confirm`, payload);
  },

  createUser(payload) {
    return Repository.post(`${resource}`, payload);
  },

  updateUser(user_id, payload) {
    return Repository.put(`${resource}/${user_id}`, payload);
  },

  updatePassword(user_id, payload) {
    return Repository.put(`${resource}/${user_id}/password`, payload);
  },

  deleteUser(user_id) {
    return Repository.delete(`${resource}/${user_id}`);
  },
};
