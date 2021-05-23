import Repository from "./Repository";

const resource = "owners";
export default {
  getOwners() {
    return Repository.get(`${resource}`);
  },

  updateOwner(owner_id, payload) {
    return Repository.put(`${resource}/${owner_id}`, payload);
  },

  updatePassword(owner_id, payload) {
    return Repository.put(`${resource}/${owner_id}/password`, payload);
  },

  getOwnerShop(owner_id) {
    return Repository.get(`${resource}/${owner_id}/shop`);
  },
};
