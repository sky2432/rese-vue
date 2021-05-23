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

  $_createToday() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return today;
  },

  $_createSpecificDate(value) {
    const date = new Date(value);
    const specificDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    return specificDate;
  },
};
