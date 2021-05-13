<template>
  <div>
    <v-app-bar app class="amber" light>
      <v-container>
        <v-row class="align-center">
          <v-col cols="4">
            <div class="header-logo d-flex">
              <v-icon class="mr-1" large>mdi-silverware-variant</v-icon>
              <h1 class="header-txt" @click="$router.push('/')">Rese</h1>
            </div>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="8">
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
                <v-menu offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn class="white" dark v-bind="attrs" v-on="on">
                      <span class="amber--text">{{ user.name }}</span>
                      <v-icon color="amber">mdi-menu-down</v-icon>
                    </v-btn>
                  </template>
                  <v-list nav dense>
                    <v-list-item-group color="primary">
                      <v-list-item
                        class="menu-item"
                        @click="$router.push('mypage')"
                      >
                        <v-list-item-icon class="mr-2">
                          <v-icon>mdi-account</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>マイページ</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item
                        class="menu-item"
                        @click="$router.push('/setting')"
                      >
                        <v-list-item-icon class="mr-2">
                          <v-icon>mdi-cog</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>設定</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>

                      <v-list-item class="menu-item" @click="logout">
                        <v-list-item-icon class="mr-2">
                          <v-icon>mdi-logout</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>ログアウト</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list-item-group>
                  </v-list>
                </v-menu>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

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

  mounted: function() {
    // ブラウザのコンソールにルート要素を表示します。
    console.log(this.$el);
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
      };
      await favoritesRepository.addFavorite(shopId, sendData);
      this.getUserFavorites();
    },

    async removeFavorite(shopId) {
      const favoriteId = this.getFavoriteId(shopId);
      const sendData = {
        user_id: this.user.id,
        favorite_id: favoriteId,
      };
      await favoritesRepository.removeFavorite(shopId, sendData);
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
