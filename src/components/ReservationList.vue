<template>
  <div>
    <DataTable
      label="検索"
      v-bind="{
        tableData: sendReservations,
        headers: headers,
        loading: loading,
        reservationStatus: true,
        titleColor: titleColor,
        tile: true,
        edit: edit,
      }"
      itemKey="reservaiton.id"
      @open-edit-dialog="openEditDialog"
    >
      <template #title>
        <span v-if="ownerType">予約一覧</span>
        <v-switch
          class="pa-3"
          :value="showTodayReservations"
          label="本日の予約"
          v-if="detailType"
          v-model="showTodayReservations"
          @change="showReservations($event)"
        ></v-switch>
      </template>
      <template #top v-if="ownerType">
        <v-switch
          class="pa-3"
          :value="showTodayReservations"
          label="本日の予約"
          v-model="showTodayReservations"
          @change="showReservations($event)"
        ></v-switch>
      </template>
      <template #noData>予約はありません</template>
      <template #noResults>検索条件に当てはまる予約はありません</template>
    </DataTable>

    <BaseDialog ref="editDialog" baseButtonText="いいえ">
      <template #title>予約状況を非来店にしますか？</template>
      <template #leftButton>
        <v-btn color="red" class="white--text" @click="changeReservationStatus">
          はい
        </v-btn>
      </template>
    </BaseDialog>

    <BaseDialog ref="messageDialog">
      <template #title>予約状況を非来店にしました</template>
    </BaseDialog>
  </div>
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
    titleColor: {
      type: String,
    },
    ownerType: {
      type: Boolean,
      default: true,
    },
    detailType: {
      type: Boolean,
      default: false,
    },
    edit: {
      type: Boolean,
      default: false,
    },
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
        { text: "", value: "edit", sortable: false },
      ],
      reservationId: "",
    };
  },

  methods: {
    openEditDialog(reservationId) {
      this.$refs.editDialog.openDialog();
      this.reservationId = reservationId;
    },

    async changeReservationStatus() {
      this.$refs.editDialog.startLoading();
      const sendData = {
        status: "notVisited",
      };
      await reservationsRepository.updateReservation(
        this.reservationId,
        sendData
      );
      this.getShopReservations(this.shopId);
      this.$refs.editDialog.stopLoading();
      this.$refs.messageDialog.openDialog();
      this.$refs.editDialog.closeDialog();
    },

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
      const resData = await reservationsRepository.getShopReservations(shopId);
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
        if (data[i].reservation.status === "notVisited") {
          data[i].reservation.status = "非来店";
        }
      }
      return data;
    },
  },
};
</script>
