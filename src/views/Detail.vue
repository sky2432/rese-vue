<template>
  <div>
    <TheHomeHeader></TheHomeHeader>
    <v-main>
      <div class="wrapper" v-if="loading">
        <v-progress-circular indeterminate color="amber"></v-progress-circular>
      </div>
      <v-container v-if="loaded" class="mt-5">
        <v-row>
          <v-col cols="6">
            <div class="d-flex">
              <v-btn @click="$router.go(-1)">
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
              <h1 class="ml-5">{{ shop.name }}</h1>
            </div>
            <v-img class="mt-5" :src="shop.image_url"> </v-img>
            <v-row align="center" class="mx-0 mt-5">
              <v-rating
                :value="shop.evaluation"
                color="amber"
                dense
                half-increments
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
            <p class="mt-5" v-if="shop">
              エリア：{{ shop.area.name }}<br />ジャンル：{{ shop.genre.name }}
            </p>
            <p>
              {{ shop.overview }}
            </p>
          </v-col>
          <v-col cols="6">
            <v-card class="card">
              <v-card-title class="amber">予約</v-card-title>
              <validation-observer ref="observer" v-slot="{ invalid }">
                <v-form v-model="formValid">
                  <v-card-text class="mt-5 px-5">
                    <v-menu
                      ref="datePickerMenu"
                      v-model="showdatePickerMenu"
                      :return-value.sync="visitsDate"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template #activator="{ on }">
                        <validation-provider
                          v-slot="{ errors }"
                          name="日付"
                          rules="selectRequired"
                          vid="date"
                        >
                          <v-text-field
                            v-model="visitsDate"
                            label="日付を選択"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-on="on"
                            :error-messages="errors"
                          ></v-text-field>
                        </validation-provider>
                      </template>
                      <v-date-picker
                        v-model="visitsDate"
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

                    <validation-provider
                      v-slot="{ errors }"
                      name="時刻"
                      rules="selectRequired"
                      vid="time"
                    >
                      <v-select
                        v-model="visitsTime"
                        :items="timeOptions"
                        label="時刻を選択"
                        prepend-icon="mdi-clock-time-eight-outline"
                        :error-messages="errors"
                      ></v-select>
                    </validation-provider>

                    <validation-provider
                      v-slot="{ errors }"
                      name="人数"
                      rules="selectRequired"
                      vid="number"
                    >
                      <v-select
                        :items="numberOptions"
                        item-text="state"
                        item-value="abbr"
                        v-model="visitsNumber"
                        label="人数を選択"
                        prepend-icon="mdi-account"
                        :error-messages="errors"
                      ></v-select>
                    </validation-provider>
                  </v-card-text>

                  <v-card-actions class="justify-center pb-5">
                    <v-btn @click="checkTime" :disabled="invalid">予約</v-btn>
                  </v-card-actions>
                </v-form>
              </validation-observer>
            </v-card>

            <v-dialog v-model="showReservationDialog" width="500" persistent>
              <v-card :loading="reservationLoading">
                <v-card-title class="amber">
                  予約内容の確認
                </v-card-title>
                <v-card-text class="pt-5 pb-0">
                  <v-simple-table>
                    <template v-slot:default>
                      <tbody>
                        <tr>
                          <th class="text-left">
                            店舗名
                          </th>
                          <td class="text-left">
                            {{ shop.name }}
                          </td>
                        </tr>
                        <tr>
                          <th class="text-left">
                            日付
                          </th>
                          <td class="text-left">
                            {{ visitsDate }}
                          </td>
                        </tr>
                        <tr>
                          <th class="text-left">
                            時刻
                          </th>
                          <td class="text-left">
                            {{ visitsTime }}
                          </td>
                        </tr>
                        <tr>
                          <th class="text-left">
                            人数
                          </th>
                          <td class="text-left">
                            {{ visitsNumber
                            }}<span v-if="visitsNumber">名</span>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions class="pb-6">
                  <v-spacer></v-spacer>
                  <v-btn color="red" dark @click="showReservationDialog = false"
                    >キャンセル</v-btn
                  >
                  <v-btn color="amber" dark @click="createReservation"
                    >予約</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </div>
</template>

<script>
import "../plugins/veeValidate.js";
import config from "../config/const.js";
import { mapGetters } from "vuex";
import shopsRepository from "../repositories/shopsRepository.js";
import reservationsRepository from "../repositories/reservationsRepository";

export default {
  props: {
    shopId: {
      type: Number,
      require: true,
    },
  },

  data() {
    return {
      shop: "",
      visitsDate: "",
      visitsTime: "",
      visitsNumber: "",
      formValid: false,
      showdatePickerMenu: false,
      showReservationDialog: false,
      today: config.today,
      timeOptions: config.timeOptions,
      numberOptions: config.numberOptions,
      loading: true,
      loaded: false,
      reservationLoading: false,
    };
  },

  computed: {
    ...mapGetters(["user"]),
  },

  created() {
    this.getShop();
  },

  methods: {
    checkTime() {
      if (this.visitsDate && this.visitsTime) {
        const now = new Date();
        const dayTime = `${this.visitsDate} ${this.visitsTime}`;
        const selected = new Date(dayTime);
        if (now > selected) {
          this.$refs.observer.setErrors({
            time: ["現在時刻よりも後の時刻を選択してください"],
          });
        }
        if (now <= selected) {
          this.showReservationDialog = true;
        }
      }
    },

    async getShop() {
      const resData = await shopsRepository.getShop(this.shopId);
      this.shop = resData.data.data;
      this.loading = false;
      this.loaded = true;
    },

    async createReservation() {
      this.reservationLoading = true;
      const sendData = {
        user_id: this.user.id,
        shop_id: this.shop.id,
        visited_on: `${this.visitsDate} ${this.visitsTime}`,
        number_of_visiters: this.visitsNumber,
      };
      await reservationsRepository.createReservation(sendData);
      this.$router.push("/done");
      this.reservationLoading = false;
    },
  },
};
</script>

<style scoped>
.card {
  margin-top: 68px;
}
</style>
