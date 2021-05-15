import Repository from "./Repository";

const resource = "/users";
export default {
  showUser(user_id) {
    return Repository.get(`${resource}/${user_id}`);
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
