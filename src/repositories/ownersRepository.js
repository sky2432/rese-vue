import Repository from "./Repository";

const resource = "owners";
export default {
  getOwnerShop(owner_id) {
    return Repository.get(`${resource}/${owner_id}/shop`);
  },

  updateOwner(owner_id, payload) {
    return Repository.put(`${resource}/${owner_id}`, payload);
  },

  updatePassword(owner_id, payload) {
    return Repository.put(`${resource}/${owner_id}/password`, payload);
  },
};
