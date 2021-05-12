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
                <v-menu offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn class="white" dark v-bind="attrs" v-on="on">
                      <span class="amber--text">{{ user.name }}</span>
                      <v-icon color="amber">mdi-menu-down</v-icon>
                    </v-btn>
                  </template>
                  <v-list nav dense>
                    <v-list-item-group color="primary">
                      <v-list-item class="menu-item" @click="$router.push('mypage')">
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
                  @click="showShopDeatail(shop.id)"
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
      areaSelected: "All area",
      areaItems: ["All area"],
      genreSelected: "All genre",
      genreItems: ["All genre"],
      shops: [],
      favorites: [],
    };
  },

  computed: {
    ...mapState(["user"]),

    showFavoriteIcon() {
      return function(shop_id) {
        const result = this.isFavorite(shop_id);
        if (result === true) {
          return "mdi-heart";
        } else {
          return "mdi-heart-outline";
        }
      };
    },
  },

  created() {
    this.getShops();
    this.showFavorites();
  },

  methods: {
    changeFavorite(shop_id) {
      const result = this.isFavorite(shop_id);
      if (result === false) {
        this.addFavorite(shop_id);
      } else if (result === true) {
        this.deleteFavorite(shop_id);
      }
    },

    isFavorite(shop_id) {
      for (let i in this.favorites) {
        if (shop_id === this.favorites[i].id) {
          return true;
        }
      }
      return false;
    },

    async addFavorite(shop_id) {
      const sendData = {
        user_id: this.user.id,
      };
      await favoritesRepository.addFavorite(shop_id, sendData);
      this.showFavorites();
    },

    async deleteFavorite(shop_id) {
      const favoriteId = this.getFavoriteId(shop_id);
      const sendData = {
        user_id: this.user.id,
        favorite_id: favoriteId,
      };
      await favoritesRepository.deleteFavorite(
        shop_id,
        sendData
      );
      this.showFavorites();
    },

    getFavoriteId(shop_id) {
      for (let i in this.favorites) {
        if (shop_id === this.favorites[i].id) {
          return this.favorites[i].favorite.id;
        }
      }
    },

    async showFavorites() {
      const resData = await favoritesRepository.showFavorites(this.user.id);
      this.favorites = resData.data.data;
    },

    async getShops() {
      const resData = await shopsRepository.getShops();
      const data = resData.data.data;
      this.shops = data;
      this.createSerchItems(data, "areaItems", "area");
      this.createSerchItems(data, "genreItems", "genre");
    },

    createSerchItems(data, items, name) {
      for (let i in data) {
        let result = this[items].includes(data[i][name].name);
        if (result === false) {
          this[items].push(data[i][name].name);
        }
      }
    },

    showShopDeatail(shop_id) {
      this.$router.push({
        name: "Detail",
        params: {
          shop_id: shop_id,
        },
      });
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
