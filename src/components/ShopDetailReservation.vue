<template>
  <ReservationList
    ref="reservationList"
    titleColor="white"
    v-bind="{ perPage: 5, ownerType: false, detailType: true }"
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
