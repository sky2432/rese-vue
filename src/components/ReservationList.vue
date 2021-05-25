<template>
  <DataTable
    label="検索"
    v-bind="{
      tableData: sendReservations,
      headers: headers,
      loading: loading,
      reservationStatus: true,
      perPage: perPage
    }"
    itemKey="reservaiton.id"
    :titleColor="titleColor"
  >
    <template #title>
      <v-switch
        v-model="showTodayReservations"
        :value="showTodayReservations"
        @change="showReservations($event)"
        label="本日の予約"
        class="pa-3"
      ></v-switch>
    </template>
    <template #noData>予約はありません</template>
    <template #noResults>検索条件に当てはまる予約はありません</template>
  </DataTable>
</template>

<script>
import reservationsRepository from "../repositories/reservationsRepository";
import DataTable from "../components/DataTable";

export default {
  components: {
    DataTable,
  },

  props: {
    titleColor: {
      type: String,
    },
    perPage: {
      type: String,
      default: 10,
    }
  },

  data() {
    return {
      loading: true,
      showTodayReservations: false,
      reservations: [],
      sendReservations: [],
      headers: [
        {
          text: "予約ID",
          align: "start",
          value: "reservation.id",
        },
        { text: "予約状況", value: "reservation.status" },
        { text: "予約者名", value: "name" },
        { text: "来店人数", value: "reservation.number_of_visiters" },
        { text: "来店日時", value: "reservation.visited_on" },
      ],
    };
  },

  methods: {
    stopLoading() {
      this.loading = false;
    },

    showReservations(event) {
      this.showTodayReservations = event;
      if (this.showTodayReservations === null) {
        this.sendReservations = this.reservations;
      }
      //本日の予約のみを表示
      if (this.showTodayReservations === true) {
        let todayReservations = [];
        const today = this.$helpers.$_createToday();
        for (let i in this.reservations) {
          const reservations = this.reservations[i];
          const reserveDate = this.$helpers.$_createSpecificDate(
            reservations.reservation.visited_on
          );
          if (today.getTime() === reserveDate.getTime()) {
            todayReservations.push(reservations);
          }
        }
        this.sendReservations = todayReservations;
      }
    },

    async getShopReservations(shopId) {
      const resData = await reservationsRepository.getShopReservations(
        shopId
      );
      const reservaitons = this.convetReservationStatus(resData.data.data);
      this.reservations = reservaitons;
      this.sendReservations = reservaitons;
      this.loading = false;
    },

    convetReservationStatus(data) {
      for (let i in data) {
        if (data[i].reservation.status === "reserving") {
          data[i].reservation.status = "予約中";
        }
        if (data[i].reservation.status === "visited") {
          data[i].reservation.status = "来店済み";
        }
        if (data[i].reservation.status === "cancelled") {
          data[i].reservation.status = "キャンセル";
        }
      }
      return data;
    },
  },
};
</script>
