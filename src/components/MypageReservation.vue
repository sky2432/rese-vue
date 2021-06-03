<template>
  <div>
    <div class="wrapper" v-if="loading">
      <v-progress-circular color="amber" indeterminate></v-progress-circular>
    </div>
    <v-row class="mt-1" v-if="loaded">
      <v-col cols="12" v-for="shop in shops" :key="shop.reservation.id">
        <v-card class="card" height="300">
          <v-card-title class="amber">{{
            showReservationStatus(shop.reservation)
          }}</v-card-title>
          <v-row class="row">
            <v-col cols="4" class="pa-0 image-wrap">
              <v-img class="image" :src="shop.image_url" height="236px"></v-img>
            </v-col>
            <v-col cols="4" class="reservation-col"></v-col>
            <v-col cols="4" class="reservation-col">
              <v-card-title>{{ shop.name }}</v-card-title>
              <v-card-text>
                <v-row class="mx-0" align="center">
                  <v-rating
                    :value="shop.evaluation"
                    color="amber"
                    size="14"
                    dense
                    half-increments
                    readonly
                  ></v-rating>

                  <div class="ml-1">
                    {{ shop.evaluation
                    }}<span class="grey--text ml-2"
                      >({{ shop.evaluation_count }}件)</span
                    >
                  </div>
                </v-row>
              </v-card-text>
              <v-card-subtitle class="py-1">
                #{{ shop.area.name }}＃{{ shop.genre.name }}
              </v-card-subtitle>
              <v-card-text class="mt-6">
                <p class="mb-1">
                  来店日：{{ getVisitsDate(shop.reservation.visited_on) }}
                </p>
                <p class="mb-1">
                  来店時刻：{{ getVisitsTime(shop.reservation.visited_on) }}
                </p>
                <p class="mb-1">
                  来店人数：{{ shop.reservation.number_of_visiters }}名
                </p>
              </v-card-text>
            </v-col>

            <v-col
              cols="4"
              class="d-flex justify-center align-center reservation-col"
            >
              <v-card-actions
                class="flex-column"
                v-if="showButtonInReserving(shop.reservation.status)"
              >
                <v-btn
                  class="white--text"
                  color="amber"
                  width="100"
                  @click="displayDialogUpdateReservation(shop)"
                  >変更
                </v-btn>
                <v-btn
                  class="white--text mt-2 ml-0"
                  color="red"
                  width="100"
                  @click="displayCancelDialog(shop.reservation)"
                  >キャンセル
                </v-btn>
              </v-card-actions>
              <v-card-actions
                class="flex-column"
                v-if="showButtonInVisited(shop.reservation.status)"
              >
                <v-btn
                  class="white--text mt-2 ml-0"
                  color="amber"
                  width="100"
                  v-if="showAddEvaluationButton(shop.evaluations)"
                  @click="displayEvaluationDialog(shop)"
                  >評価
                </v-btn>
                <v-btn
                  class="white--text mt-2 ml-0"
                  color="amber"
                  width="100"
                  v-if="showEditEvaluationButton(shop.evaluations)"
                  @click="displayDialogEditEvaluation(shop.evaluations)"
                  >評価を編集
                </v-btn>
                <v-btn
                  class="white--text mt-2 ml-0"
                  color="amber"
                  width="100"
                  @click="moveShopDeatail(shop.id)"
                  >もう一度予約
                </v-btn>
              </v-card-actions>
              <v-card-actions
                class="flex-column"
                v-if="showButtonInCancelled(shop.reservation.status)"
              >
                <v-btn
                  class="white--text mt-2 ml-0"
                  color="amber"
                  width="100"
                  @click="moveShopDeatail(shop.id)"
                  >もう一度予約
                </v-btn>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <BaseDialog ref="dialogConfirmCancelReservation" baseButtonText="いいえ">
        <template #message>本当にキャンセルしますか？</template>
        <template #leftButton>
          <v-btn color="red" class="white--text" @click="deleteReservation">
            はい
          </v-btn>
        </template>
      </BaseDialog>

      <BaseDialog ref="cancelBaseDialog">
        <template #message>予約をキャンセルしました</template>
      </BaseDialog>

      <v-dialog width="500" persistent v-model="DialogUpdateReservation">
        <FormReservation
          v-bind="{
            date: visitsDate,
            time: visitsTime,
            number: visitsNumber,
          }"
          ref="formReservation"
          @check-time="checkTime"
        >
          <template #title>予約の変更</template>
          <template #leftButton
            ><v-btn
              color="red"
              class="white--text"
              @click="DialogUpdateReservation = false"
            >
              キャンセル
            </v-btn></template
          >
        </FormReservation>
      </v-dialog>

      <DialogConfirm ref="dialogConfirm" :tableData="confirmDialogData">
        <template #title>変更内容の確認</template>
        <template #actionButton
          ><v-btn color="amber" class="white--text" @click="updateReservation"
            >変更</v-btn
          ></template
        >
      </DialogConfirm>

      <BaseDialog ref="updateBaseDialog">
        <template #message>予約を変更しました</template>
      </BaseDialog>

      <DialogEvaluation ref="DialogCreateEvaluation" v-model="evaluation">
        <template #title>評価</template>
        <template #rightButton>
          <v-btn
            class="white--text"
            color="amber"
            :disabled="isEvaluated"
            @click="createEvaluation"
          >
            投稿
          </v-btn>
        </template>
      </DialogEvaluation>

      <DialogEvaluation
        ref="DialogUpdateEvaluation"
        v-model="updatedEvaluation"
      >
        <template #title>評価を編集</template>
        <template #leftButton>
          <v-btn color="red" class="white--text" @click="deleteEvaluation">
            削除
          </v-btn>
        </template>
        <template #rightButton>
          <v-btn color="amber" class="white--text" @click="updateEvaluation">
            更新
          </v-btn>
        </template>
      </DialogEvaluation>
    </v-row>
  </div>
</template>

<script>
import "../plugins/veeValidate.js";
import { mapGetters } from "vuex";
import reservationsRepository from "../repositories/reservationsRepository.js";
import evaluationsRepository from "../repositories/evaluationsRepository";
import DialogConfirm from "../components/DialogConfirm";
import DialogEvaluation from "../components/DialogEvaluation";
import FormReservation from "../components/FormReservation";

export default {
  components: {
    FormReservation,
    DialogConfirm,
    DialogEvaluation,
  },

  data() {
    return {
      shops: [],
      selectedShop: "",
      selectedEvaluation: "",
      slectedReservation: "",
      visitsDate: "",
      visitsTime: "",
      visitsNumber: 0,
      evaluation: 0,
      updatedEvaluation: 0,
      DialogUpdateReservation: false,
      loading: true,
      loaded: false,
      reservationData: "",
      confirmDialogData: [],
    };
  },

  computed: {
    ...mapGetters(["user"]),

    getVisitsDate() {
      return function(visitedOn) {
        const date = visitedOn.substr(0, 10);
        const convertedDate = this.convertDateFormat(date, "YYYY年MM月DD日");
        return convertedDate;
      };
    },

    getVisitsTime() {
      return function(visitedOn) {
        const time = visitedOn.substr(11, 5);
        return time;
      };
    },

    isEvaluated() {
      if (this.evaluation > 0) {
        return false;
      } else {
        return true;
      }
    },

    showReservationStatus() {
      return function(reservation) {
        if (reservation.status === "reserving") {
          return "予約中";
        }
        if (reservation.status === "cancelled") {
          return "キャンセル";
        }
        if (reservation.status === "visited") {
          return "来店済み";
        }
      };
    },

    showButtonInReserving() {
      return function(reservationStatus) {
        if (reservationStatus === "reserving") {
          return true;
        }
        return false;
      };
    },

    showButtonInVisited() {
      return function(reservationStatus) {
        if (reservationStatus === "visited") {
          return true;
        }
        return false;
      };
    },

    showButtonInCancelled() {
      return function(reservationStatus) {
        if (reservationStatus === "cancelled") {
          return true;
        }
        return false;
      };
    },

    showEditEvaluationButton() {
      return function(evaluations) {
        return this.exisitsUserEvaluation(evaluations);
      };
    },

    showAddEvaluationButton() {
      return function(evaluations) {
        const result = this.exisitsUserEvaluation(evaluations);
        if (result === true) {
          return false;
        } else {
          return true;
        }
      };
    },
  },

  created() {
    this.getUserReservations();
  },

  methods: {
    convertDateFormat(date, format) {
      format = format.replace(/YYYY/, date.substr(0, 4));
      format = format.replace(/MM/, date.substr(5, 2));
      format = format.replace(/DD/, date.substr(8, 2));

      return format;
    },

    exisitsUserEvaluation(evaluations) {
      for (let i in evaluations) {
        if (this.user.id === evaluations[i].user_id) {
          return true;
        }
      }
      return false;
    },

    //評価
    displayEvaluationDialog(shop) {
      this.$refs.DialogCreateEvaluation.openDialog();
      this.selectedShop = shop;
      this.evaluation = 0;
    },

    async createEvaluation() {
      this.$refs.DialogCreateEvaluation.startLoading();
      const sendData = {
        user_id: this.user.id,
        shop_id: this.selectedShop.id,
        evaluation: this.evaluation,
      };
      await evaluationsRepository.createEvaluation(sendData);
      this.$refs.DialogCreateEvaluation.closeDialog();
      this.$refs.DialogCreateEvaluation.stopLoading();
      this.selectedShop = "";
      this.getUserReservations();
    },

    displayDialogEditEvaluation(evaluations) {
      this.$refs.DialogUpdateEvaluation.openDialog();
      this.serchUserEvaluation(evaluations);
    },

    serchUserEvaluation(evaluations) {
      for (let i in evaluations) {
        if (this.user.id === evaluations[i].user_id) {
          this.updatedEvaluation = parseFloat(evaluations[i].evaluation);
          this.selectedEvaluation = evaluations[i];
        }
      }
    },

    async updateEvaluation() {
      this.$refs.DialogUpdateEvaluation.startLoading();
      const sendData = {
        evaluation: this.updatedEvaluation,
      };
      await evaluationsRepository.updateEvaluation(
        this.selectedEvaluation.id,
        sendData
      );
      this.$refs.DialogUpdateEvaluation.closeDialog();
      this.$refs.DialogUpdateEvaluation.stopLoading();
      this.getUserReservations();
    },

    async deleteEvaluation() {
      this.$refs.DialogUpdateEvaluation.startLoading();
      await evaluationsRepository.deleteEvaluation(this.selectedEvaluation.id);
      this.$refs.DialogUpdateEvaluation.closeDialog();
      this.$refs.DialogUpdateEvaluation.stopLoading();
      this.getUserReservations();
    },

    //予約
    displayDialogUpdateReservation(shop) {
      this.DialogUpdateReservation = true;
      this.setReservationUpdateData(shop);
    },

    setReservationUpdateData(shop) {
      this.selectedShop = shop;
      this.visitsDate = shop.reservation.visited_on.substr(0, 10);
      this.visitsTime = shop.reservation.visited_on.substr(11, 5);
      this.visitsNumber = shop.reservation.number_of_visiters;
    },

    checkTime(sendData) {
      const dateTime = `${sendData.visitsDate} ${sendData.visitsTime}`;
      const result = this.$helpers.$_isBeforeThanNow(dateTime);
      if (result) {
        this.$refs.formReservation.$refs.observer.setErrors({
          time: ["現在時刻よりも後の時刻を選択してください"],
        });
      }
      if (!result) {
        this.reservationData = sendData;
        this.$refs.dialogConfirm.openDialog();
        this.createConfirmDialogData(sendData);
      }
    },

    createConfirmDialogData(sendData) {
      this.confirmDialogData = this.$helpers.$_createDataConfirmReservation(
        this.selectedShop.name,
        sendData.visitsDate,
        sendData.visitsTime,
        sendData.visitsNumber
      );
    },

    async updateReservation() {
      this.$refs.dialogConfirm.startLoading();
      const sendData = {
        visited_on: `${this.reservationData.visitsDate} ${this.reservationData.visitsTime}`,
        number_of_visiters: this.reservationData.visitsNumber,
      };
      await reservationsRepository.updateReservation(
        this.selectedShop.reservation.id,
        sendData
      );
      this.$refs.dialogConfirm.stopLoading();
      this.changeDialog();
      this.resetUpdateData();
      this.getUserReservations();
    },

    changeDialog() {
      this.$refs.updateBaseDialog.openDialog();
      this.DialogUpdateReservation = false;
      this.$refs.dialogConfirm.closeDialog();
    },

    resetUpdateData() {
      this.selectedShop = "";
      this.visitsDate = "";
      this.visitsTime = "";
      this.visitsNumber = 0;
    },

    //キャンセル
    displayCancelDialog(reservation) {
      this.$refs.dialogConfirmCancelReservation.openDialog();
      this.slectedReservation = reservation;
    },

    async deleteReservation() {
      this.$refs.dialogConfirmCancelReservation.startLoading();
      await reservationsRepository.deleteReservation(
        this.slectedReservation.id
      );
      this.$refs.dialogConfirmCancelReservation.stopLoading();
      this.$refs.cancelBaseDialog.openDialog();
      this.$refs.dialogConfirmCancelReservation.closeDialog();
      this.getUserReservations();
    },

    async getUserReservations() {
      const resData = await reservationsRepository.getUserReservations(
        this.user.id
      );
      this.shops = this.sortReservations(resData.data.data);
      this.loading = false;
      this.loaded = true;
    },

    //予約中の昇順、その後に来店済みとキャンセルの降順で配列を並び替え
    sortReservations(reservations) {
      let reserving = [];
      for (let i in reservations) {
        if (reservations[i].reservation.status === "reserving") {
          reserving.push(reservations[i]);
        }
      }
      let visitedAndCancelled = [];
      for (let i in reservations) {
        if (
          reservations[i].reservation.status === "visited" ||
          reservations[i].reservation.status === "cancelled"
        ) {
          visitedAndCancelled.push(reservations[i]);
        }
      }
      visitedAndCancelled.sort(function(a, b) {
        if (a.reservation.visited_on > b.reservation.visited_on) {
          return -1;
        } else {
          return 1;
        }
      });
      for (let i in visitedAndCancelled) {
        reserving.push(visitedAndCancelled[i]);
      }
      return reserving;
    },

    moveShopDeatail(shopId) {
      this.$helpers.$_movePageWithPram("Detail", "shopId", shopId);
    },
  },
};
</script>

<style scoped>
.card {
  position: relative;
}

.image-wrap {
  position: absolute;
  top: 64px;
  left: 0;
}

.image {
  border-radius: 0 0 0 5px;
}

.row {
  height: 100%;
}

.btn-wrap {
  text-align: left;
}

.reservation-col {
  height: 236px;
}
</style>
