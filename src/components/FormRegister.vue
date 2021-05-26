<template>
  <v-card class="white pa-5" elevation="2" outlined shaped tile width="600px">
    <v-card-title>
      <slot name="title"></slot>
      <slot name="closeIcon"></slot>
    </v-card-title>
    <v-card-text>
      <validation-observer ref="observer" v-slot="{ invalid }">
        <v-form v-model="formValid">
          <TextFieldName v-model="name"></TextFieldName>

          <validation-provider
            v-slot="{ errors }"
            name="メールアドレス"
            rules="required|email"
            vid="email"
          >
            <v-text-field
              v-model="email"
              :error-messages="errors"
              label="E-mail"
              prepend-icon="mdi-email"
              required
            ></v-text-field>
          </validation-provider>

          <TextFieldPassword v-model="password"></TextFieldPassword>

          <v-card-actions class="justify-center">
            <v-btn color="amber" :disabled="invalid" @click="confirm">
              確認
            </v-btn>
          </v-card-actions>
        </v-form>
      </validation-observer>
    </v-card-text>
  </v-card>
</template>

<script>
import "../plugins/veeValidate.js";
import TextFieldName from "../components/TextFieldName";
import TextFieldPassword from "../components/TextFieldPassword";

export default {
  components: {
    TextFieldName,
    TextFieldPassword,
  },

  data() {
    return {
      name: "",
      email: "",
      password: "",
      formValid: false,
    };
  },

  methods: {
    resetData() {
      this.name = "";
      this.email = "";
      this.password = "";
      this.$refs.observer.reset();
    },

    confirm() {
      const sendData = {
        name: this.name,
        email: this.email,
        password: this.password,
      };
      this.$emit("confirm", sendData);
    },
  },
};
</script>
