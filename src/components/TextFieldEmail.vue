<template>
  <validation-provider
    v-slot="{ errors }"
    name="メールアドレス"
    rules="required|email"
    vid="email"
  >
    <v-text-field
      :value="value"
      @input="$emit('input', $event)"
      :error-messages="errors"
      label="E-mail"
      prepend-icon="mdi-email"
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
  },
};
</script>
