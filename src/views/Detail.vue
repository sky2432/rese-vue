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
              <h1 class="ml-5">仙人</h1>
            </div>
            <v-img
              class="mt-5"
              src="https://coachtech-matter.s3-ap-northeast-1.amazonaws.com/image/sushi.jpg"
            >
            </v-img>
            <p class="mt-5">地域：東京<br />ジャンル：寿司</p>
            <p>
              料理長厳選の食材から作る寿司を用いたコースをぜひお楽しみください。食材・味・価格、お客様の満足度を徹底的に追及したお店です。特別な日のお食事、ビジネス接待まで気軽に使用することができます。
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
                        仙人
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
                        {{ number }}
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </div>
            <div class="mt-5" style="text-align: center">
              <v-btn @click="$router.push('/done')">予約</v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: Number,
      require: true,
    },
  },
  data() {
    return {
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
        "1人",
        "2人",
        "3人",
        "4人",
        "5人",
        "6人",
        "7人",
        "8人",
        "9人",
        "10人",
      ],
    };
  },
};
</script>

<style scoped></style>
