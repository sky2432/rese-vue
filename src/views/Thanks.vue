<template>
  <div>
    <TheHeader></TheHeader>
    <v-main class="d-flex align-center justify-center main">
      <v-card
        class="white pa-16"
        elevation="2"
        outlined
        shaped
        tile
        width="600px"
      >
        <v-card-title>
          <div >
            会員登録ありがとうございます
          </div>
        </v-card-title>
        <v-card-text> </v-card-text>
        <v-card-action>
          <div style="text-align: center">
            <v-btn color="amber" @click="$router.push('/login')">
              ログインする
            </v-btn>
          </div>
        </v-card-action>
      </v-card>
    </v-main>
  </div>
</template>

<script>
export default {
  data: () => ({
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
      (v) => /.+@.+/.test(v) || "正しいメールアドレスの形式で入力してください",
    ],
    passwordRules: [
      (v) => !!v || "パスワードを入力してください",
      (v) => v.length >= 4 || "パスワードは4文字以上です",
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

::v-deep .v-card__title {
  justify-content: center;
}
</style>
