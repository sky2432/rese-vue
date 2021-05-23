<template>
  <v-main>
    <v-container class="py-4 px-6" fluid>
      <v-card>
        <v-card-title class="amber">
          予約一覧
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="検索"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="showReservations"
          item-key="reservaiton.id"
          :search="search"
          :loading="loading"
          loading-text="予約を取得中です"
        >
          <template v-slot:top>
            <v-switch
              v-model="showTodayReservations"
              label="本日の予約"
              class="pa-3"
            ></v-switch>
          </template>
          <template v-slot:[`item.reservation.status`]="{ item }">
            <v-chip :color="getStatusColor(item.reservation.status)" dark>
              {{ item.reservation.status }}
            </v-chip>
          </template>
          <template v-slot:[`item.reservation.number_of_visiters`]="{ item }">
            {{ item.reservation.number_of_visiters }}名
          </template>
          <template v-slot:no-data>
            予約がありません
          </template>
          <template v-slot:no-results>
            検索条件に当てはまる予約はありません
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </v-main>
</template>

<script>
import reservationsRepository from "../repositories/reservationsRepository";

export default {
  props: {
    shopId: {
      type: Number,
      // require: true,
    },
    existsShop: {
      type: Boolean,
      require: true,
    },
  },

  data() {
    return {
      search: "",
      loading: true,
      showTodayReservations: false,
      reservations: [],
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

  computed: {
    showReservations() {
      if (this.showTodayReservations === false) {
        return this.reservations;
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
        return todayReservations;
      }
    },

    getStatusColor() {
      return function(status) {
        if (status === "予約中") {
          return "green";
        }
        if (status === "来店済み") {
          return "amber";
        }
        if (status === "キャンセル") {
          return "red";
        }
      };
    },
  },

  //タブ切り替えした際に発火
  created() {
    if (this.shopId && this.existsShop) {
      this.getShopReservations();
    }
    if (!this.existsShop) {
      this.loading = false;
    }
  },

  //最初の読み込みで発火
  //createdの段階だとまだ親のデータが送られてきていないのでwatchで親のデータが来るタイミングを監視して処理を実行している
  watch: {
    shopId() {
      if (this.existsShop) {
        this.getShopReservations();
      }
    },
    existsShop() {
      if (!this.existsShop) {
        this.loading = false;
      }
    },
  },

  methods: {
    async getShopReservations() {
      const resData = await reservationsRepository.getShopReservations(
        this.shopId
      );
      this.reservations = this.convetReservationStatus(resData.data.data);
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
