import Repository from "./Repository";

const resource = "shops/evaluation";
export default {
  createEvaluation(payload) {
    return Repository.post(`${resource}`, payload);
  },

  updateEvaluation(evaluation_id, payload) {
    return Repository.put(`${resource}/${evaluation_id}`, payload);
  },

  deleteEvaluation(evaluation_id) {
    return Repository.delete(`${resource}/${evaluation_id}`);
  },
};
