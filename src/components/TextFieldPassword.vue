<template>
  <validation-provider
    v-slot="{ errors }"
    :name="name"
    rules="required|min:4"
    :vid="vid"
  >
    <v-text-field
      :error-messages="errors"
      :label="label"
      prepend-icon="mdi-key"
      :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
      :type="showPassword ? 'text' : 'password'"
      :value="value"
      required
      @input="$emit('input', $event)"
      @click:append="showPassword = !showPassword"
    ></v-text-field>
  </validation-provider>
</template>

<script>
import "../plugins/veeValidate.js";
export default {
  props: {
    value: {
      type: String,
    },
    name: {
      type: String,
      default: "パスワード",
    },
    label: {
      type: String,
      default: "Password",
    },
    vid: {
      type: String,
      default: "password",
    },
  },

  data() {
    return {
      showPassword: false,
    };
  },
};
</script>
