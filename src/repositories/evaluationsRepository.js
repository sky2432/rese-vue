import Repository from "./Repository";

const resource = "/evaluation";
export default {

  createEvaluation(shop_id, payload) {
    return Repository.post(`shops/${shop_id}/${resource}`, payload);
  },

  updateEvaluation(shop_id, payload) {
    return Repository.put(`shops/${shop_id}/${resource}`, payload);
  },

  deleteEvaluation(shop_id, payload) {
    return Repository.delete(`shops/${shop_id}/${resource}`, payload);
  },
};
