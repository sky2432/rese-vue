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
    const config = { headers: { "content-type": "multipart/form-data" } };
    return Repository.post(`${resource}`, payload, config);
  },

  updateShop(shop_id, payload) {
    return Repository.put(`${resource}/${shop_id}`, payload);
  },

  // updateAddress(shop_id, payload) {
  //   return Repository.put(`${resource}/${shop_id}/address`, payload);
  // },

  updateImage(shop_id, payload) {
    const config = {
      headers: {
        "content-type": "multipart/form-data",
        "X-HTTP-Method-Override": "PUT",
      },
    };
    return Repository.post(`${resource}/${shop_id}/image`, payload, config);
  },

  deleteShop(shop_id) {
    return Repository.delete(`${resource}/${shop_id}`);
  },

  downloadImage(shop_id) {
    return Repository.get(`${resource}/${shop_id}/image`, {
      responseType: "blob",
    });
  },
};
