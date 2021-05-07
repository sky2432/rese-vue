<template>
  <div>
    <v-row class="mt-1">
      <v-col v-for="n in 24" :key="n" cols="12">
        <v-card height="300" class="card">
          <v-row class="row">
            <v-col
              cols="4"
              class="pa-0 image rounded-md"
            >
              <v-img
                height="300px"
                src="https://coachtech-matter.s3-ap-northeast-1.amazonaws.com/image/sushi.jpg"
              ></v-img>
            </v-col>
            <v-col cols="4"></v-col>
            <v-col cols="4" class="col">
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
              <v-card-text class="mt-6">
                <p>予約日時：</p>
                <p>人数：</p>
              </v-card-text>
            </v-col>

            <v-col cols="4" class="d-flex justify-center align-center col">
              <v-card-actions class="d-flex flex-column">
                <v-btn
                  color="amber"
                  class="white--text"
                  >変更
                </v-btn>
                <v-btn
                  color="red"
                  class="white--text mt-2"
                  >キャンセル
                </v-btn>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
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
  },
};
</script>

<style scoped>
.card {
  position: relative;
}

.image {
  position: absolute;
  top: 0;
  left: 0;
}

.row {
  height: 100%;
}

.btn-wrap {
  text-align: left;
}


</style>
