<template>
  <div>
    <DataTable
      label="ID・予約状況・予約者名・人数・日時で検索"
      v-bind="{
        tableData: sendReservations,
        headers: headers,
        loading: loading,
        reservationStatus: true,
        titleColor: titleColor,
        tile: true,
        name: isGuest,
        userName: isGuest,
        edit: edit,
      }"
      itemKey="reservaiton.id"
      @open-edit-dialog="openEditDialog"
    >
      <template #title>
        <span v-if="ownerType" class="data-table-header">予約一覧</span>
        <v-switch
          class="pr-2 mt-7 mt-sm-4"
          label="本日の予約"
          :value="showTodayReservations"
          v-if="detailType"
          v-model="showTodayReservations"
          @change="showReservations($event)"
        ></v-switch>
      </template>
      <template #top v-if="ownerType">
        <v-row class="ma-0">
          <v-switch
            class="pa-3"
            label="本日の予約"
            :value="showTodayReservations"
            v-model="showTodayReservations"
            @change="showReservations($event)"
          ></v-switch>
        </v-row>
      </template>
      <template #addButton>
        <v-btn class="data-table-header" @click="getShopReservations(shopId)">
          <v-icon>mdi-autorenew</v-icon>
        </v-btn>
      </template>
      <template #noData>予約はありません</template>
      <template #noResults>検索条件に当てはまる予約はありません</template>
    </DataTable>

    <BaseDialog
      ref="editDialog"
      v-bind="{ body: true, closeIcon: true }"
      titleClass="amber justify-center"
      textClass="mt-4 text-center"
    >
      <template #title>お客様が来店されませんでしたか？</template>
      <template #body>
        来店されなかった場合はこちらから予約状況を非来店にしてください。
        ※一度非来店にすると来店済みに戻すことはできません。
      </template>
      <template #baseButton>
        <v-btn
          color="red white--text"
          @click="$refs.confirmEditDialog.openDialog()"
        >
          非来店にする
        </v-btn>
      </template>
    </BaseDialog>

    <BaseDialog ref="confirmEditDialog" baseButtonText="いいえ">
      <template #title>本当にこの予約を非来店にしますか？</template>
      <template #leftButton>
        <v-btn
          color="red white--text"
          :disabled="isGuest"
          @click="changeReservationStatus"
        >
          はい
        </v-btn>
      </template>
      <template #baseButton>
        <v-btn color="amber white--text" @click="closeDialog">
          いいえ
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
import { mapGetters } from "vuex";

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

  computed: {
    ...mapGetters(["user", "role"]),

    isGuest() {
      return this.$helpers.$_isGuest(this.role);
    },
  },

  methods: {
    async getShopReservations(shopId) {
      this.loading = true;
      const resData = await reservationsRepository.getShopReservations(shopId);
      const reservaitons = this.convetReservationStatus(resData.data.data);
      const convertedReservaitons = this.convetVisitsNumber(reservaitons);
      this.reservations = convertedReservaitons;
      this.sendReservations = convertedReservaitons;
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

    convetVisitsNumber(data) {
      for (let i in data) {
        data[i].reservation.number_of_visiters =
          data[i].reservation.number_of_visiters + "名";
      }
      return data;
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

    openEditDialog(reservationId) {
      this.$refs.editDialog.openDialog();
      this.reservationId = reservationId;
    },

    async changeReservationStatus() {
      this.$refs.confirmEditDialog.startLoading();
      const sendData = {
        status: "notVisited",
      };
      await reservationsRepository.updateReservation(
        this.reservationId,
        sendData
      );
      this.getShopReservations(this.shopId);
      this.$refs.confirmEditDialog.stopLoading();
      this.$refs.messageDialog.openDialog();
      this.closeDialog();
    },

    closeDialog() {
      this.$refs.editDialog.closeDialog();
      this.$refs.confirmEditDialog.closeDialog();
    },

    stopLoading() {
      this.loading = false;
    },
  },
};
</script>