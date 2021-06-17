<template>
  <BaseTextField
    :name="name"
    rules="required|min:2|max:10"
    vid="name"
    :counter="10"
    :icon="icon"
    :label="label"
    :mode="mode"
    :value="value"
    @input="$emit('input', $event)"
  ></BaseTextField>
</template>

<script>
import BaseTextField from "../components/BaseTextField";
export default {
  components: {
    BaseTextField,
  },

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
    icon: {
      type: String,
      default: "mdi-account",
    },
    mode: {
      type: String,

    }
  },
};
</script>
