import Repository from "./Repository";

const resource = "mail";
export default {
  sendMailForAll(payload) {
    return Repository.post(`${resource}`, payload);
  },

  sendMailForUsers(payload) {
    return Repository.post(`users/${resource}`, payload);
  },
  
  sendMailForOwners(payload) {
    return Repository.post(`owners/${resource}`, payload);
  },
};
