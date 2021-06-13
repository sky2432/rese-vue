<template>
  <div>
    <TheHeader></TheHeader>
    <v-main>
      <div class="wrapper">
        <BaseCard padding="pa-16" v-bind="{ outlined: true, tile: true }">
          <template #title>
            <p class="mb-0">アカウントは削除されました</p>
            <p>またのご利用お待ちしております</p>
          </template>
          <template #rightButton
            ><v-btn color="amber" @click="$router.push('/')">
              トップページへ戻る
            </v-btn></template
            >
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
