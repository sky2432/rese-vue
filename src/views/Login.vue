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
          Login
        </v-card-title>
        <v-card-text>
          <v-form v-model="valid">
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
            <v-card-action>
              <div style="text-align: center">
                <!-- :disabled="!valid" -->
                <v-btn color="amber" @click="$router.push('/home')">
                  ログイン
                </v-btn>
              </div>
            </v-card-action>
          </v-form>
        </v-card-text>
      </v-card>
    </v-main>
  </div>
</template>

<script>
export default {
  data: () => ({
    valid: false,
    email: "",
    password: "",
    emailRules: [
      (v) => !!v || "メールアドレスを入力してくだい",
      (v) => /.+@.+/.test(v) || "正しいメールアドレスの形式で入力してください",
    ],
    passwordRules: [
      (v) => !!v || "パスワードを入力してください",
      (v) => v.length >= 4  || "パスワードは4文字以上です"
    ],
  }),
};
</script>

<style scoped>
.main {
  height: calc(100vh - 56px);
}

::v-deep .v-main__wrap {
  flex: 0;
}
</style>
