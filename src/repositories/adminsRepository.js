import Repository from "./Repository";

const resource = "/admins";
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

  updateUser(admin_id, payload) {
    return Repository.put(`${resource}/${admin_id}`, payload);
  },

  updatePassword(admin_id, payload) {
    return Repository.put(`${resource}/${admin_id}/password`, payload);
  },

  deleteUser(admin_id) {
    return Repository.delete(`${resource}/${admin_id}`);
  },
};
