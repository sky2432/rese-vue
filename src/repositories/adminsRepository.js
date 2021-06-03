import Repository from "./Repository";

const resource = "/admins";
export default {
  getAdmins() {
    return Repository.get(`${resource}`);
  },

  confirmAdmin(payload) {
    return Repository.post(`${resource}/confirm`, payload);
  },

  createAdmin(payload) {
    return Repository.post(`${resource}`, payload);
  },

  updateAdmin(admin_id, payload) {
    return Repository.put(`${resource}/${admin_id}`, payload);
  },

  updatePassword(admin_id, payload) {
    return Repository.put(`${resource}/${admin_id}/password`, payload);
  },

  deleteAdmin(admin_id) {
    return Repository.delete(`${resource}/${admin_id}`);
  },
};
