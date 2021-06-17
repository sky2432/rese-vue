<template>
  <div>
    <TheHeader :showTab="true" type="admin">
      <template #tab>
        <v-tabs slider-color="grey" centered>
          <v-tab @click="currentComponent = 'ShopDetailInfo'">店舗情報</v-tab>
          <v-tab @click="currentComponent = 'ShopDetailReservation'"
            >予約一覧</v-tab
          >
        </v-tabs>
      </template>
    </TheHeader>
    <v-main>
      <v-container>
        <keep-alive>
          <component :is="currentComponent" :shopId="shopId"></component>
        </keep-alive>
      </v-container>
    </v-main>
  </div>
</template>

<script>
import ShopDetailInfo from "../components/ShopDetailInfo";
import ShopDetailReservation from "../components/ShopDetailReservation";

export default {
  components: {
    ShopDetailInfo,
    ShopDetailReservation,
  },

  props: {
    shopId: {
      type: Number,
      require: true,
    },
  },

  data() {
    return {
      currentComponent: ShopDetailInfo,
    };
  },
};
</script>
