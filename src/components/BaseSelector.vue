<template>
  <validation-provider v-slot="{ errors }" :name="name" rules="selectRequired">
    <v-select
      :value="value"
      @input="$emit('input', $event)"
      :items="options"
      item-text="state"
      item-value="abbr"
      :error-messages="errors"
      :label="label"
      :prepend-icon="icon"
      required
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
