<template>
  <div>
    <v-row>
      <v-col v-for="shop in shops" :key="shop.id" cols="4">
        <v-card height="300">
          <v-img height="125" :src="shop.image_url"></v-img>
          <v-card-title>{{ shop.name }}</v-card-title>
          <v-card-text>
            <v-row align="center" class="mx-0">
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
          </v-card-text>
          <v-card-subtitle class="py-1">
            #{{ shop.area.name }}#{{ shop.genre.name }}
          </v-card-subtitle>
          <v-card-actions class="d-flex justify-space-between">
            <v-btn color="amber" dark rounded @click="moveShopDeatail(shop.id)"
              >詳細
            </v-btn>
            <v-btn text icon>
              <v-icon
                color="red"
                large
                @click="removeFavorite(shop.id, shop.favorite.id)"
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
import { mapState } from "vuex";
import favoritesRepository from "../repositories/favoritesRepository.js";

export default {
  data() {
    return {
      shops: [],
    };
  },

  computed: {
    ...mapState(["user"]),
  },

  created() {
    this.getUserFavorites();
  },

  methods: {
    async getUserFavorites() {
      const resData = await favoritesRepository.getUserFavorites(this.user.id);
      this.shops = resData.data.data;
    },

    async removeFavorite(shopId, favoriteId) {
      const sendData = {
        user_id: this.user.id,
        favorite_id: favoriteId,
      };
      await favoritesRepository.removeFavorite(shopId, sendData);
      this.getUserFavorites();
    },

    moveShopDeatail(shopId) {
      this.$helpers.$_movePageWithPram("Detail", "shopId", shopId);
    },
  },
};
</script>

<style></style>
