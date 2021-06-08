<template>
  <ReservationList
    ref="reservationList"
    titleColor="white"
    v-bind="{ ownerType: false, detailType: true }"
  ></ReservationList>
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
  },

  mounted() {
    this.$refs.reservationList.getShopReservations(this.shopId);
  },
};
</script>
