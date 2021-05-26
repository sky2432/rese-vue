<template>
  <validation-provider
    v-slot="{ errors }"
    :name="name"
    rules="required|min:2|max:10"
    vid="name"
  >
    <v-text-field
      :value="value"
      @input="$emit('input', $event)"
      :counter="10"
      :error-messages="errors"
      :label="label"
      prepend-icon="mdi-account"
      required
    ></v-text-field>
  </validation-provider>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
    },
    name: {
      type: String,
      default: "名前",
    },
    label: {
      type: String,
      default: "Name",
    },
  },
};
</script>
