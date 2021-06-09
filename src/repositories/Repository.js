import axios from "axios";
import store from "../store/index";

//開発環境ドメイン
const baseDomain = "http://127.0.0.1:8000";
//本番環境ドメイン
// const baseDomain = "https://rese-laravel.herokuapp.com";

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
