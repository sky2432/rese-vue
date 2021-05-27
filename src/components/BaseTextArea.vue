<template>
  <validation-provider
    v-slot="{ errors }"
    :name="name"
    :rules="rules"
    :vid="vid"
  >
    <v-textarea
      :counter="counter"
      :clearable="clearable"
      clear-icon="mdi-close-circle"
      :error-messages="errors"
      :label="label"
      :prepend-icon="icon"
      outlined
      required
      :value="value"
      @input="$emit('input', $event)"
    ></v-textarea>
  </validation-provider>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      require: true,
    },
    rules: {
      type: String,
      default: "required",
    },
    vid: {
      type: String,
      require: true,
    },
    counter: {
      type: Number,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      require: true,
    },
    icon: {
      type: String,
    },
    value: {
      type: String,
    },
  },
};
</script>
