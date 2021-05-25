<template>
  <ReservationList ref="reservationList" titleColor="white" :perPage="5"></ReservationList>
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
