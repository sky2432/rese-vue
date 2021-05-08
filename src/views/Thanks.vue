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
          <div>
            会員登録ありがとうございます
          </div>
        </v-card-title>
        <div style="text-align: center">
          <v-btn color="amber" @click="$router.push('/login')">
            ログインする
          </v-btn>
        </div>
      </v-card>
    </v-main>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.main {
  height: calc(100vh - 64px);
}

::v-deep .v-main__wrap {
  flex: 0;
}

::v-deep .v-card__title {
  justify-content: center;
}
</style>
