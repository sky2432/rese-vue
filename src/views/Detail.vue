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
            <p class="mt-5" v-if="shop">
              エリア：{{ shop.area.name }}<br />ジャンル：{{ shop.genre.name }}
            </p>
            <p>
              {{ shop.overview }}
            </p>
          </v-col>
          <v-col cols="6" class="amber pa-5">
            <h1 class="white--text">予約</h1>
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
              <p>予約内容</p>
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
                        {{ date }}
                      </td>
                    </tr>
                    <tr>
                      <th class="text-left">
                        時刻
                      </th>
                      <td class="text-left">
                        {{ time }}
                      </td>
                    </tr>
                    <tr>
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
            <div class="mt-5" style="text-align: center">
              <v-btn @click="createReservation">予約</v-btn>
            </div>
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
export default {
  props: {
    shop_id: {
      type: Number,
      require: true,
    },
  },
  data() {
    return {
      shop: "",
      menu: false,
      date: "",
      today: new Date().toISOString().slice(0, 10),
      time: "",
      number: "",
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
      console.log(resData);
      this.$router.push("/done");
    },
  },
};
</script>

<style scoped></style>
