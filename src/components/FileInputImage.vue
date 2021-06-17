<template>
  <validation-provider
    v-slot="{ errors }"
    ref="fileProvider"
    rules="selectRequired|image"
    name="店舗画像"
  >
    <v-file-input
      accept="image/*"
      :error-messages="errors"
      label="店舗画像を選択"
      chips
      :value="value"
      @change="$emit('setImage', $event)"
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
