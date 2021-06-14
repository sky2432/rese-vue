<template>
  <v-card class="white pa-5" elevation="2" width="600px" outlined shaped tile>
    <v-card-title>
      <slot name="title"></slot>
      <slot name="closeIcon"></slot>
    </v-card-title>
    <v-card-text>
      <validation-observer ref="observer" v-slot="{ invalid }">
        <v-form v-model="formValid">
          <TextFieldName v-model="name"></TextFieldName>

          <TextFieldEmail v-model="email"></TextFieldEmail>

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
import TextFieldEmail from "../components/TextFieldEmail";
import TextFieldPassword from "../components/TextFieldPassword";

export default {
  components: {
    TextFieldName,
    TextFieldEmail,
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
