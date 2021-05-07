<template>
  <div>
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
            <v-btn color="amber" class="white--text" @click="showShopDeatail(n)"
              >詳しく見る
            </v-btn>
            <v-btn text icon>
              <v-icon v-if="heratOutline" @click="changeHeartIcon" large
                >mdi-heart-outline</v-icon
              >
              <v-icon
                v-if="heart"
                @click="changeHeartIcon"
                class="mdi "
                color="red"
                >mdi-heart</v-icon
              >
            </v-btn>
          </v-card-actions>
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

<style></style>
