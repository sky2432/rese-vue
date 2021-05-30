import axios from "axios";
import store from "../store/index";

const baseDomain = "http://127.0.0.1:8000";

const baseURL = `${baseDomain}/api`;

let url;
const token = store.getters.apiToken;
if (token) {
  url = axios.create({
    baseURL: baseURL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
} else {
  url = axios.create({
    baseURL: baseURL,
  });
}

export default url;
