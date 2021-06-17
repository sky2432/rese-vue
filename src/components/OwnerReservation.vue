<template>
  <v-container class="py-4 px-6" fluid>
    <ReservationList
      ref="reservationList"
      :edit="true"
      :shopId="shopId"
      v-show="user.shop_present"
    ></ReservationList>
    <div class="wrapper" v-if="!user.shop_present">
      <v-card>
        <v-card-title>店舗情報タブより店舗を登録してください</v-card-title>
      </v-card>
    </div>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import ReservationList from "../components/ReservationList";

export default {
  components: {
    ReservationList,
  },

  props: {
    shopId: {
      type: Number,
    },
  },

  computed: {
    ...mapGetters(["user"]),
  },

  //最初の読み込みで発火
  //createdの段階だとまだ親のデータが送られてきていないのでwatchで親のデータが来るタイミングを監視して処理を実行している
  watch: {
    shopId() {
      if (this.user.shop_present) {
        this.getShopReservations();
      }
    },
  },

  //タブ切り替えした際に発火
  mounted() {
    if (this.shopId && this.user.shop_present) {
      this.getShopReservations();
    }
    if (!this.user.shop_present) {
      this.stopLoading();
    }
  },

  methods: {
    getShopReservations() {
      this.$refs.reservationList.getShopReservations(this.shopId);
    },

    stopLoading() {
      this.$refs.reservationList.stopLoading();
    },
  },
};
</script>
