<template>
  <validation-provider
    v-slot="{ errors }"
    :name="name"
    :rules="rules"
    :vid="vid"
  >
    <v-text-field
      :counter="counter"
      :error-messages="errors"
      :hint="hint"
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
    },
    vid: {
      type: String,
      require: true,
    },
    counter: {
      type: Number,
    },
    hint: {
      type: String,
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
