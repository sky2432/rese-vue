<template>
  <v-container class="py-4 px-6" fluid>
    <ReservationList ref="reservationList" :edit="true" :shopId="shopId"></ReservationList>
  </v-container>
</template>

<script>
import ReservationList from "../components/ReservationList";

export default {
  components: {
    ReservationList,
  },

  props: {
    shopId: {
      type: Number,
    },
    existsShop: {
      type: Boolean,
      require: true,
    },
  },

  //タブ切り替えした際に発火
  mounted() {
    if (this.shopId && this.existsShop) {
      this.$refs.reservationList.getShopReservations(this.shopId);
    }
    if (!this.existsShop) {
      this.$refs.reservationList.stopLoading();
    }
  },

  //最初の読み込みで発火
  //createdの段階だとまだ親のデータが送られてきていないのでwatchで親のデータが来るタイミングを監視して処理を実行している
  watch: {
    shopId() {
      if (this.existsShop) {
        this.$refs.reservationList.getShopReservations(this.shopId);
      }
    },
    existsShop() {
      if (!this.existsShop) {
        this.$refs.reservationList.stopLoading();
      }
    },
  },
};
</script>
