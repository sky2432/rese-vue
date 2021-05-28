<template>
  <div>
    <TheHeader></TheHeader>
    <v-main>
      <div class="wrapper">
        <v-card
          class="pa-16"
          elevation="2"
          width="500px"
          outlined
          tile
        >
          <v-card-title class="justify-center">
            ご予約ありがとうございます
          </v-card-title>
          <v-card-actions class="justify-center">
            <v-btn color="amber" @click="$router.push('/home')">
              戻る
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </v-main>
  </div>
</template>
