<template>
  <v-container class="py-4 px-6" fluid>
    <!-- <v-card>
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
          予約はありません
        </template>
        <template v-slot:no-results>
          検索条件に当てはまる予約はありません
        </template>
      </v-data-table>
    </v-card> -->
    <DataTable
      label="検索"
      v-bind="{
        tableData: sendReservations,
        headers: headers,
        loading: loading,
      }"
      :reservationStatus="true"
      itemKey="reservaiton.id"
    >
      <template #title>
        予約一覧
      </template>
      <template #top>
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
  </v-container>
</template>

<script>
import reservationsRepository from "../repositories/reservationsRepository";
import DataTable from "../components/DataTable";

export default {
  components: {
    DataTable,
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

  data() {
    return {
      loading: true,
      showTodayReservations: null,
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

    async getShopReservations() {
      const resData = await reservationsRepository.getShopReservations(
        this.shopId
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
