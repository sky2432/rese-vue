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
              v-model="keyword"
              label="Enter shop name"
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
      <div class="wrapper" v-if="loading">
        <v-progress-circular indeterminate color="amber"></v-progress-circular>
      </div>
      <v-container v-if="loaded" class="mt-2">
        <v-row>
          <v-col v-for="shop in filteredShops" :key="shop.id" cols="3">
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
                #{{ shop.area.name }}＃{{ shop.genre.name }}
              </v-card-subtitle>
              <v-card-actions>
                <v-btn
                  color="amber"
                  @click="moveShopDetail(shop.id)"
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
