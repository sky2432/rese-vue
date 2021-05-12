<template>
  <div>
    <TheHeader></TheHeader>
    <v-main>
      <v-container class="mt-5">
        <v-row>
          <v-col cols="6">
            <div class="d-flex">
              <v-btn @click="$router.push('/home')">
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
                <v-form v-model="valid">
                  <v-card-text class="mt-5 px-5">
                    <v-menu
                      ref="menu"
                      v-model="menu"
                      :close-on-content-click="false"
                      :return-value.sync="date"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template #activator="{ on }">
                        <validation-provider
                          v-slot="{ errors }"
                          name="日付"
                          rules="selectRequired"
                        >
                          <v-text-field
                            v-model="date"
                            label="日付を選択"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-on="on"
                            :error-messages="errors"
                          ></v-text-field>
                        </validation-provider>
                      </template>
                      <v-date-picker
                        v-model="date"
                        no-title
                        scrollable
                        :min="today"
                      >
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="menu = false">
                          キャンセル
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="$refs.menu.save(date)"
                        >
                          選択
                        </v-btn>
                      </v-date-picker>
                    </v-menu>

                    <validation-provider
                      v-slot="{ errors }"
                      name="時刻"
                      rules="selectRequired"
                    >
                      <v-select
                        :items="items"
                        v-model="time"
                        label="時刻を選択"
                        prepend-icon="mdi-clock-time-eight-outline"
                        :error-messages="errors"
                      ></v-select>
                    </validation-provider>

                    <validation-provider
                      v-slot="{ errors }"
                      name="人数"
                      rules="selectRequired"
                    >
                      <v-select
                        :items="numbers"
                        item-text="state"
                        item-value="abbr"
                        v-model="number"
                        label="人数を選択"
                        prepend-icon="mdi-account"
                        :error-messages="errors"
                      ></v-select>
                    </validation-provider>
                  </v-card-text>

                  <v-card-actions class="justify-center pb-5">
                    <v-btn @click="dialog = true" :disabled="invalid"
                      >予約</v-btn
                    >
                  </v-card-actions>
                </v-form>
              </validation-observer>
            </v-card>

            <v-dialog v-model="dialog" width="500" persistent>
              <v-card>
                <v-card-title class="amber">
                  予約内容の確認
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
                            {{ shop.name }}
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
                  <v-btn color="red" dark @click="dialog = false"
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
import { mapState } from "vuex";
import shopsRepository from "../repositories/shopsRepository.js";
import reservationsRepository from "../repositories/reservationsRepository";
import "../plugins/veeValidate.js";
import config from "../config/config.js";

export default {
  props: {
    shop_id: {
      type: Number,
      require: true,
    },
  },
  data() {
    return {
      valid: false,
      dialog: false,
      shop: "",
      menu: false,
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
  },

  created() {
    this.showShop();
  },

  methods: {
    async showShop() {
      const resData = await shopsRepository.showShop(this.shop_id);
      this.shop = resData.data.data;
    },

    async createReservation() {
      const sendData = {
        user_id: this.user.id,
        visited_on: `${this.date} ${this.time}`,
        number_of_visiters: this.number,
      };
      const resData = await reservationsRepository.createReservation(
        this.shop.id,
        sendData
      );
      this.$router.push("/done");
    },
  },
};
</script>

<style scoped>
.card {
  margin-top: 68px;
}

.table-line {
  line-height: 50px;
}
</style>
