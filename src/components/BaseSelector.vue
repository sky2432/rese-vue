<template>
  <validation-provider v-slot="{ errors }" :name="name" rules="selectRequired">
    <v-select
      :error-messages="errors"
      :items="options"
      item-text="state"
      item-value="abbr"
      :label="label"
      :prepend-icon="icon"
      required
      :value="value"
      @input="$emit('input', $event)"
    ></v-select>
  </validation-provider>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      require: true,
    },
    value: {
      type: Number,
    },
    name: {
      type: String,
    },
    label: {
      type: String,
    },
    icon: {
      type: String,
    },
  },
};
</script>
