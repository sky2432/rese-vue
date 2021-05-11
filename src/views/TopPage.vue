<template>
  <div>
    <TheHeader></TheHeader>
    <v-main>
      <div class="wrapper">
        <div class="text-center">
          <h1>Rese</h1>
          <div class="mt-5">
            <v-btn class="mr-2" color="amber" @click="$router.push('/register')"
              >会員登録</v-btn
            >
            <v-btn color="amber" @click="$router.push('/login')"
              >ログイン</v-btn
            >
          </div>
        </div>
      </div>
    </v-main>
  </div>
</template>

