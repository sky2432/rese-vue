<template>
  <validation-provider
    v-slot="{ errors }"
    :name="name"
    :rules="rules"
    :mode="mode"
    :vid="vid"
  >
    <v-textarea
      :counter="counter"
      :clearable="clearable"
      :error-messages="errors"
      :label="label"
      :prepend-icon="icon"
      clear-icon="mdi-close-circle"
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
    mode: {
      type: String,
    },
  },
};
</script>
