<template>
  <div>
    <TheHeader></TheHeader>
    <v-main>
      <div class="wrapper">
        <BaseCard class="pa-16" v-bind="{ outlined: true, tile: true }">
          <template #title>会員登録ありがとうございます</template>
          <template #rightButton
            ><v-btn color="amber white--text" @click="$router.push('/login')">
              ログイン
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
