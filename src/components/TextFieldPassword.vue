<template>
  <validation-provider
    v-slot="{ errors }"
    :name="name"
    rules="required|min:4"
    :vid="vid"
  >
    <v-text-field
      :value="value"
      @input="$emit('input', $event)"
      :error-messages="errors"
      :label="label"
      :type="showPassword ? 'text' : 'password'"
      :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
      @click:append="showPassword = !showPassword"
      prepend-icon="mdi-key"
      required
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
