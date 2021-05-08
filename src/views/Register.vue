<template>
  <div>
    <TheHeader></TheHeader>
    <v-main class="d-flex align-center justify-center main">
      <v-card
        class="white pa-5"
        elevation="2"
        outlined
        shaped
        tile
        width="600px"
      >
        <v-card-title>
          Registration
        </v-card-title>
        <v-card-text>
          <v-form v-model="valid">
            <v-text-field
              v-model="name"
              :rules="nameRules"
              :counter="10"
              label="Name"
              prepend-icon="mdi-account"
              required
            ></v-text-field>

            <v-text-field
              v-model="email"
              :rules="emailRules"
              label="Email"
              prepend-icon="mdi-email"
              required
            ></v-text-field>

            <v-text-field
              v-model="password"
              :rules="passwordRules"
              label="Password"
              prepend-icon="mdi-key"
              required
            ></v-text-field>
            <div style="text-align: center">
              <v-btn color="amber" :disabled="!valid" @click="register">
                登録
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-main>
  </div>
</template>

<script>
import usersRepository from "../repositories/usersRepository.js";

export default {
  data() {
    return {
      valid: false,
      name: "",
      email: "",
      password: "",
      nameRules: [
        (v) => !!v || "名前を入力してください",
        (v) => v.length <= 10 || "名前は10文字以下です",
      ],
      emailRules: [
        (v) => !!v || "メールアドレスを入力してくだい",
        (v) =>
          /.+@.+/.test(v) || "正しいメールアドレスの形式で入力してください",
      ],
      passwordRules: [
        (v) => !!v || "パスワードを入力してください",
        (v) => v.length >= 4 || "パスワードは4文字以上です",
      ],
    };
  },

  methods: {
    async register() {
      const sendData = {
        name: this.name,
        email: this.email,
        password: this.password,
        role: "user",
      };
      const resData = await usersRepository.createUser(sendData);
      console.log(resData);

      this.$router.replace("/thanks");
    },
  },
};
</script>

<style scoped>
.main {
  height: calc(100vh - 64px);
}

::v-deep .v-main__wrap {
  flex: 0;
}
</style>
