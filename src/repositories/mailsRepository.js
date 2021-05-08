import Repository from "./Repository";

const resource = "/mail";
export default {
  sendMail(payload) {
    return Repository.post(`users/${resource}`, payload);
  },
};
