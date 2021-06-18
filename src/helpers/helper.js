import router from "../router/index";
import config from "../config/const.js";

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

  $_isBeforeThanNow(dateTime) {
    const now = new Date();
    const selected = new Date(dateTime);
    if (now > selected) {
      return true;
    }
    if (now <= selected) {
      return false;
    }
  },

  $_createDataConfirmReservation(name, date, time, number) {
    return [
      { header: "店舗名", data: name },
      { header: "日付", data: date },
      { header: "時刻", data: time },
      { header: "人数", data: `${number}名` },
    ];
  },

  $_createDataConfirmRegistration(name, email) {
    return [
      { header: "Name", data: name },
      { header: "E-mail", data: email },
      { header: "Password", data: "表示されません" },
    ];
  },

  $_stringInsert(string, index, value) {
    var res = string.slice(0, index) + value + string.slice(index);
    return res;
  },

  $_showArea(mainAddress) {
    let index;
    for (let i in config.Prefectures) {
      let result = mainAddress.indexOf(config.Prefectures[i]);
      if (result !== -1) {
        index = i;
        break;
      }
    }
    return config.Prefectures[index];
  },
};
