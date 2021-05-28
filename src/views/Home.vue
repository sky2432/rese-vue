<template>
  <div>
    <TheHomeHeader>
      <template #search>
        <v-row>
          <v-col cols="3" class="px-0">
            <v-select
              class="rounded-r-0"
              :items="areaOptions"
              dense
              hide-details
              solo
              v-model="selectedArea"
            ></v-select>
          </v-col>
          <v-col cols="3" class="px-0">
            <v-select
              class="rounded-0"
              :items="genreOptions"
              dense
              hide-details
              solo
              v-model="selectedGenre"
            ></v-select>
          </v-col>
          <v-col cols="6" class="px-0">
            <v-text-field
              class="rounded-l-0"
              label="Enter shop name"
              prepend-inner-icon="mdi-magnify"
              dense
              hide-details
              solo
              v-model="keyword"
            ></v-text-field>
          </v-col>
        </v-row>
      </template>
    </TheHomeHeader>

    <v-main>
      <div class="wrapper" v-if="loading">
        <v-progress-circular color="amber" indeterminate></v-progress-circular>
      </div>
      <v-container class="mt-2" v-if="loaded">
        <v-row>
          <v-col cols="3" v-for="shop in filteredShops" :key="shop.id">
            <v-card height="300">
              <v-img height="125" :src="shop.image_url"></v-img>
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
      </v-container>
    </v-main>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
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
      keyword: "",
      favoriteIcon: "mdi-heart",
      notFavoriteIcon: "mdi-heart-outline",
      loading: true,
      loaded: false,
    };
  },

  computed: {
    ...mapGetters(["user"]),

    filteredShops() {
      let shops = [];

      // 全てのエリア・ジャンルを表示
      if (
        this.selectedArea === "All area" &&
        this.selectedGenre === "All genre"
      ) {
        if (this.keyword !== "") {
          return this.fileterShopsByKeyword(this.shops, this.keyword);
        }
      }

      //エリアのみで検索
      if (
        this.selectedArea !== "All area" &&
        this.selectedGenre === "All genre"
      ) {
        shops = this.fileterShops(this.shops, "area", this.selectedArea);
        if (this.keyword === "") {
          return shops;
        } else {
          return this.fileterShopsByKeyword(this.shops, this.keyword);
        }
      }

      // ジャンルのみで検索
      if (
        this.selectedArea === "All area" &&
        this.selectedGenre !== "All genre"
      ) {
        shops = this.fileterShops(this.shops, "genre", this.selectedGenre);
        if (this.keyword === "") {
          return shops;
        } else {
          return this.fileterShopsByKeyword(this.shops, this.keyword);
        }
      }

      // エリアとジャンルで検索
      if (
        this.selectedArea !== "All area" &&
        this.selectedGenre !== "All genre"
      ) {
        shops = this.fileterShops(this.shops, "area", this.selectedArea);
        const filteredShops = this.fileterShops(
          shops,
          "genre",
          this.selectedGenre
        );
        if (this.keyword === "") {
          return filteredShops;
        } else {
          return this.fileterShopsByKeyword(this.shops, this.keyword);
        }
      }
      return this.shops;
    },

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
      this.loading = false;
      this.loaded = true;
    },

    async getShops() {
      const resData = await shopsRepository.getShops();
      const shops = resData.data.data;
      this.shops = shops;
      this.createSerchOptions(shops, "areaOptions", "area");
      this.createSerchOptions(shops, "genreOptions", "genre");
      // console.log(resData);
    },

    //エリア・ジャンル検索における選択肢を作成する
    createSerchOptions(shops, options, itemName) {
      for (let i in shops) {
        let result = this[options].includes(shops[i][itemName].name);
        if (result === false) {
          this[options].push(shops[i][itemName].name);
        }
      }
    },

    moveShopDetail(shopId) {
      this.$helpers.$_movePageWithPram("Detail", "shopId", shopId);
    },

    logout() {
      this.$store.dispatch("logout");
    },
  },
};
</script>
