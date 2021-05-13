import Repository from "./Repository";

const resource = "favorite";
export default {
  getUserFavorites(user_id) {
    return Repository.get(`users/${user_id}/favorites`);
  },

  addFavorite(shop_id, payload) {
    return Repository.put(`shops/${shop_id}/${resource}`, payload);
  },

  removeFavorite(shop_id, payload) {
    return Repository.request({
      method: "delete",
      url: `shops/${shop_id}/${resource}`,
      data: payload,
    });
  },
};
