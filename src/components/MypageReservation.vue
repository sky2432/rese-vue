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
                  @click="showUpdateDisplay(shop)"
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
                  v-if="showAddEvaluation(shop.evaluations)"
                  color="amber"
                  class="white--text mt-2 ml-0"
                  width="100"
                  @click="showEvaluateDisplay(shop)"
                  >評価
                </v-btn>
                <v-btn
                  v-if="showEditEvaluation(shop.evaluations)"
                  color="amber"
                  class="white--text mt-2 ml-0"
                  width="100"
                  @click="showEditEvaluateDisplay(shop.evaluations)"
                  >評価を編集
                </v-btn>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-dialog v-model="evaluateDialog" max-width="500px">
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

      <v-dialog v-model="editEvaluateDialog" max-width="500px">
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

      <!-- ダイアログ -->
      <v-dialog v-model="updateDialog" width="500" persistent>
        <v-card>
          <v-card-title class="headline amber">
            予約変更
          </v-card-title>

          <v-card-text class="pb-0">
            <div class="mt-5">
              <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                :return-value.sync="date"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template #activator="{ on, attrs }">
                  <v-text-field
                    v-model="date"
                    label="日付を選択"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="date" no-title scrollable :min="today">
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="menu = false">
                    キャンセル
                  </v-btn>
                  <v-btn text color="primary" @click="$refs.menu.save(date)">
                    選択
                  </v-btn>
                </v-date-picker>
              </v-menu>
              <v-select
                :items="items"
                v-model="time"
                label="時刻を選択"
                prepend-icon="mdi-clock-time-eight-outline"
              ></v-select>
              <v-select
                :items="numbers"
                item-text="state"
                item-value="abbr"
                v-model="number"
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
              @click="updateDialog = false"
            >
              キャンセル
            </v-btn>
            <v-btn
              color="amber"
              class="white--text"
              @click="confirmDialog = true"
            >
              確認
            </v-btn>
          </v-card-actions>
        </v-card>

        <v-dialog v-model="confirmDialog" width="500" persistent>
          <v-card :loading="loading">
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
                        {{ updateShop.name }}
                      </td>
                    </tr>
                    <tr class="table-line">
                      <th class="text-left">
                        日付
                      </th>
                      <td class="text-left">
                        {{ date }}
                      </td>
                    </tr>
                    <tr class="table-line">
                      <th class="text-left">
                        時刻
                      </th>
                      <td class="text-left">
                        {{ time }}
                      </td>
                    </tr>
                    <tr class="table-line">
                      <th class="text-left">
                        人数
                      </th>
                      <td class="text-left">
                        {{ number }}<span v-if="number">名</span>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions class="pb-6">
              <v-spacer></v-spacer>
              <v-btn color="red" dark @click="confirmDialog = false"
                >キャンセル</v-btn
              >
              <v-btn color="amber" dark @click="updateReservation">変更</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-dialog>

      <v-dialog v-model="messageDialog" max-width="500px">
        <v-card>
          <v-card-title class="justify-center">
            予約を変更しました
          </v-card-title>
          <v-card-actions class="justify-center">
            <v-btn color="amber" @click="messageDialog = false">
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
      editEvaluateDialog: false,
      updatedEvaluation: 0,
      updateEvaluateData: "",
      evaluation: 0,
      evaluateShop: "",
      shops: [],
      evaluateDialog: false,
      updateDialog: false,
      confirmDialog: false,
      messageDialog: false,
      loading: false,
      menu: false,
      updateShop: "",
      date: "",
      time: "",
      number: "",
      today: config.today,
      items: config.items,
      numbers: config.numbers,
    };
  },

  computed: {
    ...mapState(["user"]),

    showEditEvaluation() {
      return function(evaluations) {
        return this.isExisitUserEvaluation(evaluations);
      };
    },

    showAddEvaluation() {
      return function(evaluations) {
        const result = this.isExisitUserEvaluation(evaluations);
        if (result === true) {
          return false;
        } else {
          return true;
        }
      };
    },
  },

  created() {
    this.showReservations();
  },

  methods: {
    async deleteEvaluation() {
      this.editEvaluateDialog = false;
      const sendData = {
        user_id: this.user.id,
      };
      const resData = await evaluationsRepository.deleteEvaluation(
        this.updateEvaluateData.shop_id,
        this.updateEvaluateData.id,
        sendData
      );
      console.log(resData);
      this.showReservations();
    },

    showEditEvaluateDisplay(evaluations) {
      this.editEvaluateDialog = true;
      for (let i in evaluations) {
        if (this.user.id === evaluations[i].user_id) {
          this.updatedEvaluation = evaluations[i].evaluation;
          this.updateEvaluateData = evaluations[i];
          console.log(this.updateEvaluateData);
        }
      }
    },

    async updateEvaluation() {
      this.editEvaluateDialog = false;
      const sendData = {
        user_id: this.user.id,
        evaluation: this.updatedEvaluation,
      };
      const resData = await evaluationsRepository.updateEvaluation(
        this.updateEvaluateData.shop_id,
        this.updateEvaluateData.id,
        sendData
      );
      // console.log(resData);
      this.showReservations();
    },

    isExisitUserEvaluation(evaluations) {
      for (let i in evaluations) {
        if (this.user.id === evaluations[i].user_id) {
          return true;
        }
      }
      return false;
    },

    showEvaluateDisplay(shop) {
      this.evaluateDialog = true;
      this.evaluateShop = shop;
      this.evaluation = 0;
    },

    async createEvaluation() {
      this.evaluateDialog = false;
      const sendData = {
        user_id: this.user.id,
        evaluation: this.evaluation,
      };
      const resData = await evaluationsRepository.createEvaluation(
        this.evaluateShop.id,
        sendData
      );
      // console.log(resData);
      this.showReservations();
    },

    async updateReservation() {
      this.loading = true;
      const sendData = {
        user_id: this.user.id,
        visited_on: `${this.date} ${this.time}`,
        number_of_visiters: this.number,
      };
      const resData = await reservationsRepository.updateReservation(
        this.updateShop.id,
        this.updateShop.reservation.id,
        sendData
      );
      this.loading = false;
      this.changeDialog();
      this.resetUpdateData();
      this.showReservations();
    },

    changeDialog() {
      this.updateDialog = false;
      this.confirmDialog = false;
      this.messageDialog = true;
    },

    resetUpdateData() {
      this.updateShop = "";
      this.date = "";
      this.time = "";
      this.number = "";
    },

    showUpdateDisplay(shop) {
      this.updateDialog = true;
      this.updateShop = shop;
      this.date = shop.reservation.visited_on.substr(0, 10);
      this.time = shop.reservation.visited_on.substr(11, 5);
      this.number = shop.reservation.number_of_visiters;
    },

    async showReservations() {
      const resData = await reservationsRepository.showUserReservations(
        this.user.id
      );
      this.shops = resData.data.data;
      console.log(resData);
    },

    async deleteReservation(shop_id, reservation_id) {
      const sendData = {
        user_id: this.user.id,
      };
      const resData = await reservationsRepository.deleteReservation(
        shop_id,
        reservation_id,
        sendData
      );
      this.showReservations();
    },

    showShopDeatail(shopId) {
      this.$router.push({
        name: "Detail",
        params: {
          id: shopId,
        },
      });
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
