<template>
  <v-card class="white pa-5" elevation="2" outlined shaped tile width="600px">
    <v-card-title>
      <slot name="title"></slot>
      <slot name="closeIcon"></slot>
    </v-card-title>
    <v-card-text>
      <validation-observer ref="observer" v-slot="{ invalid }">
        <v-form v-model="formValid">
          <validation-provider
            v-slot="{ errors }"
            name="名前"
            rules="required|max:10"
            vid="name"
          >
            <v-text-field
              v-model="name"
              :counter="10"
              :error-messages="errors"
              label="Name"
              prepend-icon="mdi-account"
              required
            ></v-text-field>
          </validation-provider>

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

          <validation-provider
            v-slot="{ errors }"
            name="パスワード"
            rules="required|min:4"
            vid="password"
          >
            <v-text-field
              v-model="password"
              :error-messages="errors"
              label="Password"
              :type="showPassword ? 'text' : 'password'"
              :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append="showPassword = !showPassword"
              prepend-icon="mdi-key"
              required
            ></v-text-field>
          </validation-provider>

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

export default {
  data() {
    return {
      name: "",
      email: "",
      password: "",
      formValid: false,
      showPassword: false,
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
