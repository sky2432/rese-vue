import Repository from "./Repository";

const resource = "owners";
export default {
  getOwnerShop(owner_id) {
    return Repository.get(`${resource}/${owner_id}/shop`);
  },
};
