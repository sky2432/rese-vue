<template>
  <BaseTextField
    name="メールアドレス"
    rules="required|email"
    vid="email"
    icon="mdi-email"
    label="E-mail"
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
  },
};
</script>
