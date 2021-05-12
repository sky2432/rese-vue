import Repository from "./Repository";

const resource = "evaluation";
export default {
  createEvaluation(shop_id, payload) {
    return Repository.post(`shops/${shop_id}/${resource}`, payload);
  },

  updateEvaluation(shop_id, evaluation_id, payload) {
    return Repository.put(
      `shops/${shop_id}/${resource}/${evaluation_id}`,
      payload
    );
  },

  deleteEvaluation(shop_id, evaluation_id, payload) {
    return Repository.request({
      method: "delete",
      url: `shops/${shop_id}/${resource}/${evaluation_id}`,
      data: payload,
    });
  },
};
