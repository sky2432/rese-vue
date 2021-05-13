<template>
  <div>
    <v-row class="mt-1">
      <v-col v-for="shop in shops" :key="shop.reservation.id" cols="12">
        <v-card height="300" class="card">
          <v-row class="row">
            <v-col cols="4" class="pa-0 image-wrap">
              <v-img class="image" height="300px" :src="shop.image_url"></v-img>
            </v-col>
            <v-col cols="4"></v-col>
            <v-col cols="4" class="col">
              <v-card-title>{{ shop.name }}</v-card-title>
              <v-card-text>
                <v-row align="center" class="mx-0">
                  <v-rating
                    :value="shop.evaluation"
                    color="amber"
                    dense
                    readonly
                    size="14"
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
                <p>来店日時：{{ shop.reservation.visited_on }}</p>
                <p>来店人数：{{ shop.reservation.number_of_visiters }}</p>
              </v-card-text>
            </v-col>

            <v-col cols="4" class="d-flex justify-center align-center col">
              <v-card-actions class="flex-column">
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
                  @click="deleteReservation(shop.id, shop.reservation.id)"
                  width="100"
                  >キャンセル
                </v-btn>
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
              </v-card-actions>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-dialog
        v-model="showEvaluationDialog"
        :retain-focus="false"
        max-width="500px"
      >
        <v-card>
          <v-card-title class="amber">
            評価
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
            <v-btn color="amber" @click="createEvaluation">
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

      <v-dialog v-model="showDoneMsgDialog" max-width="500px">
        <v-card>
          <v-card-title class="justify-center">
            予約を変更しました
          </v-card-title>
          <v-card-actions class="justify-center">
            <v-btn color="amber" @click="showDoneMsgDialog = false">
              閉じる
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import { mapState } from "vuex";
import reservationsRepository from "../repositories/reservationsRepository.js";
import evaluationsRepository from "../repositories/evaluationsRepository";
import config from "../config/config.js";

export default {
  data() {
    return {
      shops: [],
      selectedShop: "",
      selectedEvaluation: "",
      evaluation: 0,
      updatedEvaluation: 0,
      visitsDate: "",
      visitsTime: "",
      visitsNumber: "",
      showDialogEditEvaluation: false,
      showEvaluationDialog: false,
      showDialogUpdateReservation: false,
      showDialogConfirmReservation: false,
      showDoneMsgDialog: false,
      showdatePickerMenu: false,
      updateLoading: false,
      today: config.today,
      timeOptions: config.timeOptions,
      numberOptions: config.numberOptions,
    };
  },

  computed: {
    ...mapState(["user"]),

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
    async deleteEvaluation() {
      this.showDialogEditEvaluation = false;
      const sendData = {
        user_id: this.user.id,
      };
      await evaluationsRepository.deleteEvaluation(
        this.selectedEvaluation.shop_id,
        this.selectedEvaluation.id,
        sendData
      );
      this.getUserReservations();
    },

    displayDialogEditEvaluation(evaluations) {
      this.showDialogEditEvaluation = true;
      this.serchUserEvaluation(evaluations);
    },

    serchUserEvaluation(evaluations) {
      for (let i in evaluations) {
        if (this.user.id === evaluations[i].user_id) {
          this.updatedEvaluation = evaluations[i].evaluation;
          this.selectedEvaluation = evaluations[i];
        }
      }
    },

    async updateEvaluation() {
      this.showDialogEditEvaluation = false;
      const sendData = {
        user_id: this.user.id,
        evaluation: this.updatedEvaluation,
      };
      await evaluationsRepository.updateEvaluation(
        this.selectedEvaluation.shop_id,
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
        evaluation: this.evaluation,
      };
      await evaluationsRepository.createEvaluation(
        this.selectedShop.id,
        sendData
      );
      this.selectedShop = "";
      this.getUserReservations();
    },

    async updateReservation() {
      this.updateLoading = true;
      const sendData = {
        user_id: this.user.id,
        visited_on: `${this.visitsDate} ${this.visitsTime}`,
        number_of_visiters: this.visitsNumber,
      };
      await reservationsRepository.updateReservation(
        this.selectedShop.id,
        this.selectedShop.reservation.id,
        sendData
      );
      this.updateLoading = false;
      this.changeDialog();
      this.resetUpdateData();
      this.getUserReservations();
    },

    changeDialog() {
      this.showDialogUpdateReservation = false;
      this.showDialogConfirmReservation = false;
      this.showDoneMsgDialog = true;
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

    async deleteReservation(shop_id, reservation_id) {
      const sendData = {
        user_id: this.user.id,
      };
      await reservationsRepository.deleteReservation(
        shop_id,
        reservation_id,
        sendData
      );
      this.getUserReservations();
    },

    async getUserReservations() {
      const resData =  await reservationsRepository.getUserReservations(this.user.id);
      this.shops = resData.data.data;
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
  top: 0;
  left: 0;
}

.image {
  border-radius: 5px 0 0 5px;
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
</style>
