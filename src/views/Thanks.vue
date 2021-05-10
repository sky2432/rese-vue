<template>
  <div>
    <TheHeader></TheHeader>
    <v-main>
      <div class="wrapper">
        <v-card
          class="white pa-16"
          elevation="2"
          outlined
          shaped
          tile
          width="600px"
        >
          <v-card-title class="justify-center">
            会員登録ありがとうございます
          </v-card-title>
          <v-card-actions class="justify-center">
            <v-btn color="amber" @click="$router.push('/login')">
              ログインする
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </v-main>
  </div>
</template>


