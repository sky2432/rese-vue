<template>
  <div>
    <div class="wrapper" v-if="loading">
      <v-progress-circular indeterminate color="amber"></v-progress-circular>
    </div>
    <v-row v-if="loaded" class="mt-1">
      <v-col v-for="shop in shops" :key="shop.reservation.id" cols="12">
        <v-card height="300" class="card">
          <v-card-title class="amber">{{
            showReservationStatus(shop.reservation)
          }}</v-card-title>
          <v-row class="row">
            <v-col cols="4" class="pa-0 image-wrap">
              <v-img class="image" height="236px" :src="shop.image_url"></v-img>
            </v-col>
            <v-col cols="4" class="reservation-col"></v-col>
            <v-col cols="4" class="reservation-col">
              <v-card-title>{{ shop.name }}</v-card-title>
              <v-card-text>
                <v-row align="center" class="mx-0">
                  <v-rating
                    :value="shop.evaluation"
                    color="amber"
                    dense
                    readonly
                    size="14"
                    half-increments
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
                  @click="displayDialogUpdateReservation(shop)"
                  color="amber"
                  class="white--text"
                  width="100"
                  >変更
                </v-btn>
                <v-btn
                  color="red"
                  class="white--text mt-2 ml-0"
                  @click="displayCancelDialog(shop.reservation)"
                  width="100"
                  >キャンセル
                </v-btn>
              </v-card-actions>
              <v-card-actions
                class="flex-column"
                v-if="showButtonInVisited(shop.reservation.status)"
              >
                <v-btn
                  v-if="showAddEvaluationButton(shop.evaluations)"
                  color="amber"
                  class="white--text mt-2 ml-0"
                  width="100"
                  @click="displayEvaluationDialog(shop)"
                  >評価
                </v-btn>
                <v-btn
                  v-if="showEditEvaluationButton(shop.evaluations)"
                  color="amber"
                  class="white--text mt-2 ml-0"
                  width="100"
                  @click="displayDialogEditEvaluation(shop.evaluations)"
                  >評価を編集
                </v-btn>
                <v-btn
                  color="amber"
                  class="white--text mt-2 ml-0"
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
                  color="amber"
                  class="white--text mt-2 ml-0"
                  width="100"
                  @click="moveShopDeatail(shop.id)"
                  >もう一度予約
                </v-btn>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-dialog
        v-model="showDialogConfirmCancelReservation"
        max-width="500px"
        :retain-focus="false"
      >
        <v-card :loading="cancelLoading">
          <v-card-title class="justify-center">
            本当にキャンセルしますか？
          </v-card-title>
          <v-card-actions class="justify-center">
            <v-btn
              color="amber"
              dark
              @click="showDialogConfirmCancelReservation = false"
            >
              いいえ
            </v-btn>
            <v-btn color="red" dark @click="deleteReservation">
              はい
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <MessageDialog ref="cancelMessageDialog">
        <template #message>予約をキャンセルしました</template>
      </MessageDialog>

      <v-dialog v-model="showDialogUpdateReservation" width="500" persistent>
        <v-card>
          <v-card-title class="headline amber">
            予約変更
          </v-card-title>

          <v-card-text class="pb-0">
            <div class="mt-5">
              <v-menu
                ref="datePickerMenu"
                v-model="showdatePickerMenu"
                :close-on-content-click="false"
                :return-value.sync="visitsDate"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template #activator="{ on, attrs }">
                  <v-text-field
                    v-model="visitsDate"
                    label="日付を選択"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  :value="visitsDate"
                  @input="visitsDate = $event"
                  no-title
                  scrollable
                  :min="today"
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    text
                    color="primary"
                    @click="showdatePickerMenu = false"
                  >
                    キャンセル
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.datePickerMenu.save(visitsDate)"
                  >
                    選択
                  </v-btn>
                </v-date-picker>
              </v-menu>
              <v-select
                :items="timeOptions"
                v-model="visitsTime"
                label="時刻を選択"
                prepend-icon="mdi-clock-time-eight-outline"
              ></v-select>
              <v-select
                :items="numberOptions"
                item-text="state"
                item-value="abbr"
                v-model="visitsNumber"
                label="人数を選択"
                prepend-icon="mdi-account"
              ></v-select>
            </div>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions class="pb-6">
            <v-spacer></v-spacer>
            <v-btn
              color="red"
              class="white--text"
              @click="showDialogUpdateReservation = false"
            >
              キャンセル
            </v-btn>
            <v-btn
              color="amber"
              class="white--text"
              @click="showDialogConfirmReservation = true"
            >
              確認
            </v-btn>
          </v-card-actions>
        </v-card>

        <v-dialog v-model="showDialogConfirmReservation" width="500" persistent>
          <v-card :loading="updateLoading">
            <v-card-title class="amber">
              変更内容の確認
            </v-card-title>
            <v-card-text class="pt-5 pb-0">
              <v-simple-table>
                <template v-slot:default>
                  <tbody>
                    <tr class="table-line">
                      <th class="text-left">
                        店舗名
                      </th>
                      <td class="text-left">
                        {{ selectedShop.name }}
                      </td>
                    </tr>
                    <tr class="table-line">
                      <th class="text-left">
                        日付
                      </th>
                      <td class="text-left">
                        {{ visitsDate }}
                      </td>
                    </tr>
                    <tr class="table-line">
                      <th class="text-left">
                        時刻
                      </th>
                      <td class="text-left">
                        {{ visitsTime }}
                      </td>
                    </tr>
                    <tr class="table-line">
                      <th class="text-left">
                        人数
                      </th>
                      <td class="text-left">
                        {{ visitsNumber }}<span v-if="visitsNumber">名</span>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions class="pb-6">
              <v-spacer></v-spacer>
              <v-btn
                color="red"
                dark
                @click="showDialogConfirmReservation = false"
                >キャンセル</v-btn
              >
              <v-btn color="amber" dark @click="updateReservation">変更</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-dialog>

      <MessageDialog ref="updateMessageDialog">
        <template #message>予約を変更しました</template>
      </MessageDialog>

      <v-dialog
        v-model="showEvaluationDialog"
        :retain-focus="false"
        max-width="500px"
      >
        <v-card>
          <v-card-title class="amber">
            評価
            <v-spacer></v-spacer>
            <v-btn icon @click="showEvaluationDialog = false"
              ><v-icon>mdi-window-close</v-icon></v-btn
            >
          </v-card-title>
          <v-card-text class="text-center mt-4">
            <v-rating
              v-model="evaluation"
              half-increments
              hover
              color="amber"
            ></v-rating>
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn
              color="amber"
              @click="createEvaluation"
              :disabled="isEvaluated"
            >
              投稿
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog
        v-model="showDialogEditEvaluation"
        :retain-focus="false"
        max-width="500px"
      >
        <v-card>
          <v-card-title class="amber">
            評価を編集
            <v-spacer></v-spacer>
            <v-btn icon @click="showDialogEditEvaluation = false"
              ><v-icon>mdi-window-close</v-icon></v-btn
            >
          </v-card-title>
          <v-card-text class="text-center mt-4">
            <v-rating
              v-model="updatedEvaluation"
              half-increments
              hover
              color="amber"
            ></v-rating>
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn color="red" @click="deleteEvaluation">
              削除
            </v-btn>
            <v-btn color="amber" @click="updateEvaluation">
              更新
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import MessageDialog from "../components/MessageDialog";
import reservationsRepository from "../repositories/reservationsRepository.js";
import evaluationsRepository from "../repositories/evaluationsRepository";
import config from "../config/const.js";
import "../plugins/veeValidate.js";

export default {
  components: {
    MessageDialog,
  },

  data() {
    return {
      shops: [],
      selectedShop: "",
      selectedEvaluation: "",
      slectedReservation: "",
      evaluation: 0,
      updatedEvaluation: 0,
      visitsDate: "",
      visitsTime: "",
      visitsNumber: "",
      showDialogEditEvaluation: false,
      showEvaluationDialog: false,
      showDialogUpdateReservation: false,
      showDialogConfirmReservation: false,
      showDialogConfirmCancelReservation: false,
      showdatePickerMenu: false,
      updateLoading: false,
      cancelLoading: false,
      today: config.today,
      timeOptions: config.timeOptions,
      numberOptions: config.numberOptions,
      loading: true,
      loaded: false,
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

    async deleteEvaluation() {
      this.showDialogEditEvaluation = false;
      await evaluationsRepository.deleteEvaluation(this.selectedEvaluation.id);
      this.getUserReservations();
    },

    displayDialogEditEvaluation(evaluations) {
      this.showDialogEditEvaluation = true;
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
      this.showDialogEditEvaluation = false;
      const sendData = {
        evaluation: this.updatedEvaluation,
      };
      await evaluationsRepository.updateEvaluation(
        this.selectedEvaluation.id,
        sendData
      );
      this.getUserReservations();
    },

    exisitsUserEvaluation(evaluations) {
      for (let i in evaluations) {
        if (this.user.id === evaluations[i].user_id) {
          return true;
        }
      }
      return false;
    },

    displayEvaluationDialog(shop) {
      this.showEvaluationDialog = true;
      this.selectedShop = shop;
      this.evaluation = 0;
    },

    async createEvaluation() {
      this.showEvaluationDialog = false;
      const sendData = {
        user_id: this.user.id,
        shop_id: this.selectedShop.id,
        evaluation: this.evaluation,
      };
      await evaluationsRepository.createEvaluation(sendData);
      this.selectedShop = "";
      this.getUserReservations();
    },

    async updateReservation() {
      this.updateLoading = true;
      const sendData = {
        visited_on: `${this.visitsDate} ${this.visitsTime}`,
        number_of_visiters: this.visitsNumber,
      };
      await reservationsRepository.updateReservation(
        this.selectedShop.reservation.id,
        sendData
      );
      this.updateLoading = false;
      this.changeDialog();
      this.resetUpdateData();
      this.getUserReservations();
    },

    changeDialog() {
      this.$refs.updateMessageDialog.changeShowMessageDialog();
      this.showDialogUpdateReservation = false;
      this.showDialogConfirmReservation = false;
    },

    resetUpdateData() {
      (this.selectedShop = ""), (this.visitsDate = "");
      this.visitsTime = "";
      this.visitsNumber = "";
    },

    displayDialogUpdateReservation(shop) {
      this.showDialogUpdateReservation = true;
      this.setReservationUpdateData(shop);
    },

    setReservationUpdateData(shop) {
      this.selectedShop = shop;
      this.visitsDate = shop.reservation.visited_on.substr(0, 10);
      this.visitsTime = shop.reservation.visited_on.substr(11, 5);
      this.visitsNumber = shop.reservation.number_of_visiters;
    },

    displayCancelDialog(reservation) {
      this.showDialogConfirmCancelReservation = true;
      this.slectedReservation = reservation;
    },

    async deleteReservation() {
      this.cancelLoading = true;
      await reservationsRepository.deleteReservation(
        this.slectedReservation.id
      );
      this.cancelLoading = false;
      this.$refs.cancelMessageDialog.changeShowMessageDialog();
      this.showDialogConfirmCancelReservation = false;
      this.getUserReservations();
    },

    async getUserReservations() {
      const resData = await reservationsRepository.getUserReservations(
        this.user.id
      );
      this.shops = resData.data.data;
      this.loading = false;
      this.loaded = true;
      // console.log(resData);
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

.table-line {
  line-height: 50px;
}

.reservation-col {
  height: 236px;
}
</style>
