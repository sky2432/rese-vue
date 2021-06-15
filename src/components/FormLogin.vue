<template>
  <div>
    <v-card class="white pa-5" elevation="2" width="600px" outlined shaped tile>
      <v-card-title :class="titleClass">
        <slot name="title"></slot>
      </v-card-title>
      <v-card-text class="mt-4 pb-0">
        <validation-observer ref="observer" v-slot="{ invalid }">
          <v-form v-model="formValid">
            <TextFieldEmail v-model="email"></TextFieldEmail>

            <TextFieldPassword v-model="password"></TextFieldPassword>

            <v-card-actions class="justify-center">
              <v-btn color="amber" :disabled="invalid" @click="login">
                ログイン
              </v-btn>
            </v-card-actions>
          </v-form>
        </validation-observer>
      </v-card-text>
    </v-card>
  </div>
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
    }
  },

  data() {
    return {
      email: "",
      password: "",
      formValid: false,
    };
  },

  methods: {
    login() {
      const sendData = {
        email: this.email,
        password: this.password,
      };
      this.$emit("login", sendData);
    },
  },
};
</script>
