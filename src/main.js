import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import TheHeader from "./components/TheHeader.vue";
import helpers from "./helpers/helper";

const plugin = {
  install() {
    Vue.prototype.$helpers = helpers;
  },
};

Vue.use(plugin);

Vue.component("TheHeader", TheHeader);

Vue.config.productionTip = false

new Vue({
  router,
  store,
    vuetify,
  render: h => h(App)
}).$mount('#app')
