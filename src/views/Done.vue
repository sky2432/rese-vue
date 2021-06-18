<template>
  <div>
    <TheHeader></TheHeader>
    <v-main>
      <div class="wrapper">
        <BaseCard padding="pa-16" v-bind="{ outlined: true, tile: true }">
          <template #title>ご予約ありがとうございます</template>
          <template #leftButton>
            <v-btn
              class="mr-2"
              color="amber white--text"
              @click="$router.push('/home')"
            >
              ホームへ
            </v-btn>
          </template>
          <template #rightButton>
            <v-btn
              color="amber white--text"
              @click="$helpers.$_movePageWithPram('Mypage', 'tabIndex', 1)"
            >
              予約一覧へ
            </v-btn>
          </template>
        </BaseCard>
      </div>
    </v-main>
  </div>
</template>

<script>
import BaseCard from "../components/BaseCard";

export default {
  components: {
    BaseCard,
  },
};
</script>
