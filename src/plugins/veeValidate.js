import Vue from "vue";

import { required, email, max, min } from "vee-validate/dist/rules";
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode,
} from "vee-validate";

Vue.component("ValidationObserver", ValidationObserver);
Vue.component("ValidationProvider", ValidationProvider);

setInteractionMode("eager");

extend("required", {
  ...required,
  message: "{_field_}を入力してください",
});

extend("selectRequired", {
  ...required,
  message: "{_field_}を選択してください",
});

extend("max", {
  ...max,
  message: "{_field_}は{length}文字以下で入力してください",
});

extend("min", {
  ...min,
  message: "{_field_}は{length}文字以上で入力してください",
});

extend("email", {
  ...email,
  message: "Emailを正しい形式で入力してください",
});