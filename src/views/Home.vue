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
        <ShopCardList
          :shops="filteredShops"
          :favorites="favorites"
          @reload-favorites="getUserFavorites"
        ></ShopCardList>
      </v-container>
    </v-main>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import shopsRepository from "../repositories/shopsRepository.js";
import favoritesRepository from "../repositories/favoritesRepository";
import ShopCardList from "../components/ShopCardList";

export default {
  components: {
    ShopCardList,
  },

  data() {
    return {
      shops: [],
      favorites: [],
      areaOptions: ["All area"],
      genreOptions: ["All genre"],
      selectedArea: "All area",
      selectedGenre: "All genre",
      keyword: "",
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
        shops = this.fileterShopsByArea(this.shops, this.selectedArea);
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
        shops = this.fileterShopsByGenre(this.shops, this.selectedGenre);
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
        shops = this.fileterShopsByArea(this.shops, this.selectedArea);
        const filteredShops = this.fileterShopsByGenre(
          shops,
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
  },

  created() {
    this.getShops();
    this.getUserFavorites();
  },

  methods: {
    fileterShopsByGenre(shops, target) {
      let filteredShops = [];
      for (let i in shops) {
        let shop = shops[i];
        if (shop.genre.name.indexOf(target) !== -1) {
          filteredShops.push(shop);
        }
      }
      return filteredShops;
    },

    fileterShopsByArea(shops, target) {
      let filteredShops = [];
      for (let i in shops) {
        let shop = shops[i];
        if (shop.main_address.indexOf(target) !== -1) {
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
      this.createGenreSerchOptions(shops);
      this.createAreaSerchOptions(shops);
    },

    //ジャンル検索における選択肢を作成する
    createGenreSerchOptions(shops) {
      for (let i in shops) {
        let genre = shops[i].genre.name;
        let result = this.genreOptions.includes(genre);
        if (result === false) {
          this.genreOptions.push(genre);
        }
      }
    },

    //エリア検索における選択肢を作成する
    createAreaSerchOptions(shops) {
      for (let i in shops) {
        let area = shops[i].main_address.substr(0, 3);
        let result = this.areaOptions.includes(area);
        if (result === false) {
          this.areaOptions.push(area);
        }
      }
    },
  },
};
</script>
