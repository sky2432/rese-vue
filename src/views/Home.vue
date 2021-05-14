<template>
  <div>
    <TheHomeHeader>
      <template #search>
        <v-row>
          <v-col class="px-0" cols="3">
            <v-select
              v-model="selectedArea"
              :items="areaOptions"
              class="rounded-r-0"
              solo
              dense
              hide-details
            ></v-select>
          </v-col>
          <v-col class="px-0" cols="3">
            <v-select
              v-model="selectedGenre"
              :items="genreOptions"
              class="rounded-0"
              solo
              dense
              hide-details
            ></v-select>
          </v-col>
          <v-col class="px-0" cols="6">
            <v-text-field
              label="Search..."
              class="rounded-l-0"
              prepend-inner-icon="mdi-magnify"
              solo
              dense
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
      </template>
    </TheHomeHeader>

    <v-main>
      <v-container class="mt-2">
        <v-row>
          <v-col v-for="shop in shops" :key="shop.id" cols="3">
            <v-card height="300">
              <v-hover>
                <v-img height="125" :src="shop.image_url"></v-img>
              </v-hover>
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
                #{{ shop.area.name }}＃{{ shop.genre.name }}
              </v-card-subtitle>
              <v-card-actions>
                <v-btn
                  color="amber"
                  @click="moveShopDeatail(shop.id)"
                  rounded
                  dark
                  >詳細
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn text icon>
                  <v-icon large color="red" @click="changeFavorite(shop.id)">{{
                    showFavoriteIcon(shop.id)
                  }}</v-icon>
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
import { mapState } from "vuex";
import shopsRepository from "../repositories/shopsRepository.js";
import favoritesRepository from "../repositories/favoritesRepository";

export default {
  data() {
    return {
      shops: [],
      favorites: [],
      areaOptions: ["All area"],
      genreOptions: ["All genre"],
      selectedArea: "All area",
      selectedGenre: "All genre",
      favoriteIcon: "mdi-heart",
      notFavoriteIcon: "mdi-heart-outline",
    };
  },

  computed: {
    ...mapState(["user"]),

    showFavoriteIcon() {
      return function(shopId) {
        const result = this.isFavorite(shopId);
        if (result === true) {
          return this.favoriteIcon;
        } else {
          return this.notFavoriteIcon;
        }
      };
    },
  },

  created() {
    this.getShops();
    this.getUserFavorites();
  },

  methods: {
    changeFavorite(shopId) {
      const result = this.isFavorite(shopId);
      if (result === false) {
        this.addFavorite(shopId);
      } else if (result === true) {
        this.removeFavorite(shopId);
      }
    },

    isFavorite(shopId) {
      for (let i in this.favorites) {
        if (shopId === this.favorites[i].id) {
          return true;
        }
      }
      return false;
    },

    async addFavorite(shopId) {
      const sendData = {
        user_id: this.user.id,
        shop_id: shopId,
      };
      await favoritesRepository.addFavorite(sendData);
      this.getUserFavorites();
    },

    async removeFavorite(shopId) {
      const favoriteId = this.getFavoriteId(shopId);
      await favoritesRepository.removeFavorite(favoriteId);
      this.getUserFavorites();
    },

    getFavoriteId(shopId) {
      for (let i in this.favorites) {
        if (shopId === this.favorites[i].id) {
          return this.favorites[i].favorite.id;
        }
      }
    },

    async getUserFavorites() {
      const resData = await favoritesRepository.getUserFavorites(this.user.id);
      this.favorites = resData.data.data;
    },

    async getShops() {
      const resData = await shopsRepository.getShops();
      const shops = resData.data.data;
      this.shops = shops;
      this.createSerchOptions(shops, "areaOptions", "area");
      this.createSerchOptions(shops, "genreOptions", "genre");
    },

    createSerchOptions(shops, options, itemName) {
      for (let i in shops) {
        let result = this[options].includes(shops[i][itemName].name);
        if (result === false) {
          this[options].push(shops[i][itemName].name);
        }
      }
    },

    moveShopDeatail(shopId) {
      this.$helpers.$_movePageWithPram("Detail", "shopId", shopId);
    },

    logout() {
      this.$store.dispatch("logout");
    },
  },
};
</script>

<style scoped>
.header-txt {
  cursor: pointer;
}
</style>
