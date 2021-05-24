import Repository from "./Repository";

const resource = "owners";
export default {
  getOwners() {
    return Repository.get(`${resource}`);
  },

  getOwner(owner_id) {
    return Repository.get(`${resource}/${owner_id}`);
  },

  confirmOwner(payload) {
    return Repository.post(`${resource}/confirm`, payload);
  },

  createOwner(payload) {
    return Repository.post(`${resource}`, payload);
  },

  updateOwner(owner_id, payload) {
    return Repository.put(`${resource}/${owner_id}`, payload);
  },

  updatePassword(owner_id, payload) {
    return Repository.put(`${resource}/${owner_id}/password`, payload);
  },

  deleteOwner(owner_id) {
    return Repository.delete(`${resource}/${owner_id}`);
  },

  getOwnerShop(owner_id) {
    return Repository.get(`${resource}/${owner_id}/shop`);
  },
};
