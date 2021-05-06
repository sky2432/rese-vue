<template>
  <div>
    <TheHeader></TheHeader>
    <v-main class="d-flex align-center justify-center main">
      <div style="text-align: center">
        <h1>Rese</h1>
        <div class="d-flex mt-5">
          <v-btn class="mr-2" color="amber" @click="$router.push('/register')"
            >会員登録</v-btn
          >
          <v-btn color="amber" @click="$router.push('/login')">ログイン</v-btn>
        </div>
      </div>
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
