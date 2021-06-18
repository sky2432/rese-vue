<template>
  <BaseTextField
    name="メールアドレス"
    rules="required|email|max:255"
    vid="email"
    icon="mdi-email"
    label="E-mail"
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
    mode: {
      type: String,
    },
  },
};
</script>
