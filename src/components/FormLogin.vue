<template>
  <v-card class="white pa-5" elevation="2" width="600px" outlined shaped tile>
    <v-card-title :class="titleClass">
      <slot name="title"></slot>
    </v-card-title>
    <v-card-text class="mt-4 pb-0">
      <validation-observer ref="observer" v-slot="{ invalid }">
        <v-form v-model="formValid">
          <TextFieldEmail mode="eager" v-model="email"></TextFieldEmail>

          <TextFieldPassword
            mode="eager"
            v-model="password"
          ></TextFieldPassword>

          <v-card-actions class="justify-center">
            <v-btn
              class="ml-2"
              color="amber white--text"
              :loading="loading1"
              @click="guestLogin"
            >
              ゲストログイン
            </v-btn>
            <v-btn
              color="amber white--text"
              :disabled="invalid"
              :loading="loading2"
              @click="login"
            >
              ログイン
            </v-btn>
          </v-card-actions>
          <v-card-text class="text-center">
            ※ゲストログインでは一部機能が制限されています
          </v-card-text>
        </v-form>
      </validation-observer>
    </v-card-text>
  </v-card>
</template>

<script>
import "../plugins/veeValidate.js";
import TextFieldEmail from "../components/TextFieldEmail";
import TextFieldPassword from "../components/TextFieldPassword";

export default {
  components: {
    TextFieldEmail,
    TextFieldPassword,
  },

  props: {
    titleClass: {
      type: String,
    },
  },

  data() {
    return {
      email: "",
      password: "",
      formValid: false,
      loading1: false,
      loading2: false,
    };
  },

  methods: {
    guestLogin() {
      this.loading1 = true;
      this.$emit("guest-login");
    },

    login() {
      this.loading2 = true;
      const sendData = {
        email: this.email,
        password: this.password,
      };
      this.$emit("login", sendData);
    },

    stopLoading() {
      this.loading1 = false;
      this.loading2 = false;
    },
  },
};
</script>
