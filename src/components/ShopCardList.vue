<template>
  <div>
    <v-row>
      <v-col cols="3" v-for="shop in shops" :key="shop.id">
        <v-card height="300">
          <v-img height="140" :src="shop.image_url"></v-img>
          <v-card-title>{{ shop.name }}</v-card-title>
          <v-card-text>
            <v-row class="mx-0" align="center">
              <v-rating
                color="amber"
                :value="shop.evaluation"
                size="14"
                dense
                half-increments
                readonly
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
              class="white--text"
              rounded
              @click="moveShopDetail(shop.id)"
              >詳細
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn text icon>
              <v-icon color="red" large @click="changeFavorite(shop.id)">{{
                showFavoriteIcon(shop.id)
              }}</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import favoritesRepository from "../repositories/favoritesRepository";

export default {
  props: {
    shops: {
      type: Array,
      require: true,
    },
    favorites: {
      type: Array,
    },
  },

  data() {
    return {
      favoriteIcon: "mdi-heart",
      notFavoriteIcon: "mdi-heart-outline",
    };
  },

  computed: {
    ...mapGetters(["user"]),

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

  methods: {
    fileterShops(shops, itemName, target) {
      let filteredShops = [];
      for (let i in shops) {
        let shop = shops[i];
        if (shop[itemName].name.indexOf(target) !== -1) {
          filteredShops.push(shop);
        }
      }
      return filteredShops;
    },

    fileterShopsByKeyword(shops, keyword) {
      let filteredShops = [];
      for (let i in shops) {
        let shop = shops[i];
        if (shop.name.indexOf(keyword) !== -1) {
          filteredShops.push(shop);
        }
      }
      return filteredShops;
    },

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
      this.$emit("reload-favorites");
    },

    async removeFavorite(shopId) {
      const favoriteId = this.getFavoriteId(shopId);
      await favoritesRepository.removeFavorite(favoriteId);
      this.$emit("reload-favorites");
    },

    getFavoriteId(shopId) {
      for (let i in this.favorites) {
        if (shopId === this.favorites[i].id) {
          return this.favorites[i].favorite.id;
        }
      }
    },

    moveShopDetail(shopId) {
      this.$helpers.$_movePageWithPram("Detail", "shopId", shopId);
    },
  },
};
</script>
