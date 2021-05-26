<template>
  <validation-provider
    v-slot="{ errors }"
    ref="fileProvider"
    name="店舗画像"
    rules="selectRequired|image"
  >
    <v-file-input
      :value="value"
      @change="$emit('setImage', $event)"
      accept="image/*"
      label="Select Image"
      :error-messages="errors"
      chips
    ></v-file-input>
  </validation-provider>
</template>

<script>
export default {
  props: {
    value: {
      type: File,
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
