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
                    :value="4.5"
                    color="amber"
                    dense
                    half-increments
                    readonly
                    size="14"
                  ></v-rating>
                  <div class="grey--text ml-4">
                    4.5 (413)
                  </div>
                </v-row>
              </v-card-text>
              <v-card-subtitle class="py-1">
                #{{ shop.area.name }}＃{{ shop.genre.name }}
              </v-card-subtitle>
              <v-card-text class="mt-6">
                <p>予約日時：{{ shop.reservation.visited_on }}</p>
                <p>人数：{{ shop.reservation.number_of_visiters }}</p>
              </v-card-text>
            </v-col>

            <v-col cols="4" class="d-flex justify-center align-center col">
              <v-card-actions class="d-flex flex-column">
                <v-btn
                  @click="showUpdateDisplay(shop)"
                  color="amber"
                  class="white--text mt-2"
                  >変更
                </v-btn>
                <v-btn
                  color="red"
                  class="white--text mt-2"
                  @click="deleteReservation(shop.id, shop.reservation.id)"
                  >キャンセル
                </v-btn>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <!-- ダイアログ -->
      <v-dialog v-model="dialog" width="500" persistent>
        <v-card :loading="loading">
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
                    Cancel
                  </v-btn>
                  <v-btn text color="primary" @click="$refs.menu.save(date)">
                    OK
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
            <div>
              <p>予約内容の確認</p>
              <v-simple-table>
                <template v-slot:default>
                  <tbody>
                    <tr class="table-line">
                      <th class="text-left">
                        店舗名
                      </th>
                      <td class="text-left">
                        {{ shopName }}
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
            </div>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions class="pb-6">
            <v-spacer></v-spacer>
            <v-btn color="red" class="white--text" @click="dialog = false">
              キャンセル
            </v-btn>
            <v-btn color="amber" class="white--text" @click="updateReservation">
              変更
            </v-btn>
          </v-card-actions>
        </v-card>

      </v-dialog>
      <v-dialog v-model="confirmDialog" max-width="500px">
        <v-card>
          <v-card-title class="justify-center">
            予約を変更しました
          </v-card-title>
          <v-card-actions class="justify-center">
            <v-btn color="amber" @click="confirmDialog = false">
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

export default {
  data() {
    return {
      shops: [],
      dialog: false,
      confirmDialog: false,
      loading: false,
      menu: false,
      reservationId: "",
      shopName: "",
      shopId: "",
      date: "",
      time: "",
      number: "",
      today: new Date().toISOString().slice(0, 10),
      items: [
        "12:00",
        "12:30",
        "13:00",
        "13:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
        "17:00",
        "17:30",
        "18:00",
        "18:30",
        "19:00",
        "19:30",
        "20:00",
        "20:30",
        "21:00",
        "21:30",
        "22:00",
        "22:30",
        "23:00",
        "23:30",
      ],
      numbers: [
        { state: "1名", abbr: 1 },
        { state: "2名", abbr: 2 },
        { state: "3名", abbr: 3 },
        { state: "4名", abbr: 4 },
        { state: "5名", abbr: 5 },
        { state: "6名", abbr: 6 },
        { state: "7名", abbr: 7 },
        { state: "8名", abbr: 8 },
        { state: "9名", abbr: 9 },
        { state: "10名", abbr: 10 },
      ],
    };
  },

  computed: {
    ...mapState(["user"]),
  },

  created() {
    this.showReservations();
  },

  methods: {
    async updateReservation() {
      this.loading = true;
      const sendData = {
        user_id: this.user.id,
        visited_on: `${this.date} ${this.time}`,
        number_of_visiters: this.number,
      };
      const resData = await reservationsRepository.updateReservation(
        this.shopId,
        this.reservationId,
        sendData
      );
      this.loading = false;
      this.dialog = false;
      this.confirmDialog = true;
      this.showReservations();
    },

    showUpdateDisplay(shop) {
      this.dialog = true;
      this.reservationId = shop.reservation.id;
      this.shopId = shop.id;
      this.shopName = shop.name;
      this.date = shop.reservation.visited_on.substr(0, 10);
      this.time = shop.reservation.visited_on.substr(11, 5);
      this.number = shop.reservation.number_of_visiters;
    },

    async showReservations() {
      const resData = await reservationsRepository.showUserReservations(
        this.user.id
      );
      this.shops = resData.data.data;
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
