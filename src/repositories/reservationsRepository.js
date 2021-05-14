import Repository from "./Repository";

const resource = "reservations";
const resource2 = "shops/reservation";
export default {
  getUserReservations(user_id) {
    return Repository.get(`users/${user_id}/${resource}`);
  },

  showShopReservations(shop_id) {
    return Repository.get(`shops/${shop_id}/${resource}`);
  },

  createReservation(payload) {
    return Repository.post(`${resource2}`, payload);
  },

  updateReservation(reservation_id, payload) {
    return Repository.put(`${resource2}/${reservation_id}`, payload);
  },

  deleteReservation(reservation_id) {
    return Repository.delete(`${resource2}/${reservation_id}`);
  },
};
