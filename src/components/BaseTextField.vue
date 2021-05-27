<template>
  <validation-provider
    v-slot="{ errors }"
    :name="name"
    :rules="rules"
    :vid="vid"
  >
    <v-text-field
      :error-messages="errors"
      :label="label"
      :prepend-icon="icon"
      required
      :value="value"
      @input="$emit('input', $event)"
    ></v-text-field>
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
    label: {
      type: String,
      require: true,
    },
    icon: {
      type: String,
      // require: true,
    },
    value: {
      type: String,
    },
  },
};
</script>
