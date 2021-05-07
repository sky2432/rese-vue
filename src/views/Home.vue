<template>
  <div>
    <v-app-bar app class="amber" light>
      <v-container>
        <v-row class="align-center">
          <v-col cols="4">
            <div class="header-logo d-flex">
              <v-icon class="mr-1" large>mdi-silverware-variant</v-icon>
              <h1 class="header-txt" @click="$router.push('/topPage')">Rese</h1>
            </div>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="8">
            <v-row>
              <v-col class="px-0" cols="3">
                <v-select
                  v-model="areaSelected"
                  :items="areaItems"
                  class="rounded-r-0"
                  solo
                  dense
                  hide-details
                ></v-select>
              </v-col>
              <v-col class="px-0" cols="3">
                <v-select
                  v-model="genreSelected"
                  :items="genreItems"
                  class="rounded-0"
                  solo
                  dense
                  hide-details
                ></v-select>
              </v-col>
              <v-col class="px-0" cols="4">
                <v-text-field
                  label="Search..."
                  class="rounded-l-0"
                  prepend-inner-icon="mdi-magnify"
                  solo
                  dense
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="2" class="align-self-center mypage">
                <v-btn text @click="moveUserMypage">
                  <v-icon>mdi-account</v-icon>
                  マイページ
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <v-main>
      <v-container class="mt-2">
        <v-row>
          <v-col v-for="n in 24" :key="n" cols="3">
            <v-card height="300">
              <v-img
                height="125"
                src="https://coachtech-matter.s3-ap-northeast-1.amazonaws.com/image/sushi.jpg"
              ></v-img>
              <v-card-title>仙人</v-card-title>
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
                #東京都＃寿司
              </v-card-subtitle>
              <v-card-actions class="d-flex justify-space-between">
                <v-btn
                  color="amber"
                  class="white--text"
                  @click="showShopDeatail(n)"
                  >詳しく見る
                </v-btn>
                <v-btn text icon>
                  <v-icon v-if="heratOutline" large>mdi-heart-outline</v-icon>
                  <v-icon v-if="heart" color="red" large>mdi-heart</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      areaSelected: "All area",
      areaItems: ["All area", "東京都", "大阪府", "福岡県"],
      genreSelected: "All genre",
      genreItems: [
        "All genre",
        "寿司",
        "焼肉",
        "居酒屋",
        "イタリアン",
        "ラーメン",
      ],
      heratOutline: true,
      heart: false,
    };
  },
  methods: {
    changeHeartIcon() {
      this.heratOutline = !this.heratOutline;
      this.heart = !this.heart;
    },

    showShopDeatail(shopId) {
      this.$router.push({
        name: "Detail",
        params: {
          id: shopId,
        },
      });
    },

    moveUserMypage() {
      this.$router.push({
        name: "Mypage",
        params: {
          id: 1,
        },
      });
    },
  },
};
</script>

<style scoped>
.header-txt {
  cursor: pointer;
}
</style>
