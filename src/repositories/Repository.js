import axios from "axios";
import store from "../store/index";

const baseDomain = "http://127.0.0.1:8000";

const baseURL = `${baseDomain}/api`;

const token = store.getters.apiToken;

let url = axios.create({
  baseURL: baseURL,
});

url.interceptors.request.use((config) => {
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  }
  return config;
});

export default url;
