import Repository from "./Repository";

const resource = "/shops";
export default {
  getShops() {
    return Repository.get(resource);
  },

  getShop(shop_id) {
    return Repository.get(`${resource}/${shop_id}`);
  },

  createShop(payload) {
    return Repository.post(`${resource}`, payload);
  },

  updateShop(shop_id, payload) {
    return Repository.put(`${resource}/${shop_id}`, payload);
  },

  deleteShop(shop_id) {
    return Repository.delete(`${resource}/${shop_id}`);
  },
};
