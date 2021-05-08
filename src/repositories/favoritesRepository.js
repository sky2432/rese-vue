import Repository from "./Repository";

const resource = "/favorite";
export default {
  showFavorites(user_id) {
    return Repository.get(`users/${user_id}/favorites`);
  },

  addFavorite(user_id) {
    return Repository.get(`users/${user_id}/${resource}`);
  },

  deleteFavorite(user_id, payload) {
    return Repository.delete(`users/${user_id}/${resource}`, payload);
  },
};
