<template>
  <div>
    <v-card class="white pa-5" elevation="2" outlined shaped tile width="600px">
      <v-card-title>
        <slot name="title"></slot>
      </v-card-title>
      <v-card-text>
        <validation-observer ref="observer" v-slot="{ invalid }">
          <v-form v-model="formValid">
            <validation-provider
              v-slot="{ errors }"
              name="メールアドレス"
              vid="email"
              rules="required|email"
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
              vid="password"
              rules="required|min:4"
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

export default {
  data() {
    return {
      email: "",
      password: "",
      formValid: false,
      showPassword: false,
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
