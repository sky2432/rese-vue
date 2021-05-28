<template>
  <div>
    <TheHeader type="admin"></TheHeader>
    <v-main>
      <div class="wrapper">
        <v-container>

          <v-card tile>
            <v-tabs>
              <v-tab @click="currentComponent = 'ShopDetailInfo'"
                >店舗情報</v-tab
              >
              <v-tab @click="currentComponent = 'ShopDetailReservation'"
                >予約一覧</v-tab
              >
            </v-tabs>
          </v-card>
          <component :is="currentComponent" :shopId="shopId"></component>
        </v-container>
      </div>
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
