import router from "../router/index";

export default {
  $_movePageWithPram(pageName, paramName, param) {
    router.push({
      name: pageName,
      params: {
        [paramName]: param,
      },
    });
  },
};
