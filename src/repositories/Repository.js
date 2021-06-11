import axios from "axios";

//開発環境ドメイン
const baseDomain = "http://127.0.0.1:8000";
//本番環境ドメイン
// const baseDomain = "https://rese-laravel.herokuapp.com";

const baseURL = `${baseDomain}/api`;

export default axios.create({
  baseURL: baseURL,
});
