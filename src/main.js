import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import TheHeader from "./components/TheHeader.vue";
import TheHomeHeader from "./components/TheHomeHeader.vue";
import BaseDialog from "./components/BaseDialog.vue";
import helpers from "./helpers/helper";

const plugin = {
  install() {
    Vue.prototype.$helpers = helpers;
  },
};

Vue.use(plugin);

Vue.component("TheHeader", TheHeader);
Vue.component("TheHomeHeader", TheHomeHeader);
Vue.component("BaseDialog", BaseDialog);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
