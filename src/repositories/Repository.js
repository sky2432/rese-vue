import axios from "axios";
import store from "../store/index";
import router from "../router/index";

const baseDomain = process.env.VUE_APP_API_BASE_URL;

const baseURL = `${baseDomain}/api`;

const url = axios.create({
  baseURL: baseURL,
});

url.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      redirect();
    }
    return Promise.reject(error);
  }
);

async function redirect() {
  await store.dispatch("logout");
  await router.replace("/login");
  alert(
    "認証エラーが発生したためログイン画面に移ります。再度ログインをお願いします"
  );
}

export default url;
