import Repository from "./Repository";

const resource = "reservations";
const resource2 = "reservation";
export default {
  showUserReservations(user_id) {
    return Repository.get(`users/${user_id}/${resource}`);
  },

  showShopReservations(shop_id) {
    return Repository.get(`shops/${shop_id}/${resource}`);
  },

  createReservation(shop_id, payload) {
    return Repository.post(`shops/${shop_id}/${resource2}`, payload);
  },

  updateReservation(shop_id, payload) {
    return Repository.put(`shops/${shop_id}/${resource2}`, payload);
  },

  deleteReservation(shop_id, payload) {
    return Repository.delete(`shops/${shop_id}/${resource2}`, payload);
  },
};
