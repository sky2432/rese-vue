import Repository from "./Repository";

const resource = "shops/favorite";
export default {
  getUserFavorites(userId) {
    return Repository.get(`users/${userId}/favorites`);
  },

  addFavorite(payload) {
    return Repository.post(`${resource}`, payload);
  },

  removeFavorite(favoriteId) {
    return Repository.delete(`${resource}/${favoriteId}`);
  },
};
