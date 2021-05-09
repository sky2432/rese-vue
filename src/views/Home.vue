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
                  <v-list>
                    <v-list-item class="menu-item">
                      <v-list-item-title @click="moveUserMypage"
                        ><v-icon>mdi-account</v-icon
                        >マイページ</v-list-item-title
                      >
                    </v-list-item>
                    <v-list-item class="menu-item">
                      <v-list-item-title @click="logout"
                        ><v-icon>mdi-logout</v-icon
                        >ログアウト</v-list-item-title
                      >
                    </v-list-item>
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
              <v-img height="125" :src="shop.image_url"></v-img>
              <v-card-title>{{ shop.name }}</v-card-title>
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
                #{{ shop.area.name }}＃{{ shop.genre.name }}
              </v-card-subtitle>
              <v-card-actions class="d-flex justify-space-between">
                <v-btn
                  color="amber"
                  class="white--text"
                  @click="showShopDeatail(shop.id)"
                  >詳しく見る
                </v-btn>
                <v-btn text icon>
                  <v-icon large color="red" @click="changeFavorite(shop.id)">{{
                    showHeart(shop.id)
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

    showHeart() {
      return function(shop_id) {
        for (let i in this.favorites) {
          if (shop_id === this.favorites[i].id) {
            return "mdi-heart";
          }
        }
        return "mdi-heart-outline";
      };
    },
  },

  created() {
    this.getShops();
    this.showFavorites();
  },

  methods: {
    checkFavorite(shop_id) {
      for (let i in this.favorites) {
        if (shop_id === this.favorites[i].id) {
          const sendData = {
            exsist: true,
            favorite_id: this.favorites[i].favorite.id,
          };
          return sendData;
        }
      }
      const sendData = {
        exsist: false
      };
      return sendData;
    },

    async changeFavorite(shop_id) {
      const result = this.checkFavorite(shop_id);
      if (result.exsist === false) {
        const sendData = {
          user_id: this.user.id,
        };
        const resData = await favoritesRepository.addFavorite(
          shop_id,
          sendData
        );
        // console.log(resData);
      } else if (result.exsist === true) {
        const sendData = {
          user_id: this.user.id,
          favorite_id: result.favorite_id
        };
        const resData = await favoritesRepository.deleteFavorite(
          shop_id,
          sendData
        );
        // console.log(resData);
      }
      this.showFavorites();
    },

    async showFavorites() {
      const resData = await favoritesRepository.showFavorites(this.user.id);
      this.favorites = resData.data.data;
      // console.log(resData);
    },

    async getShops() {
      const resData = await shopsRepository.getShops();
      // console.log(resData);
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

    moveUserMypage() {
      this.$router.push({
        name: "Mypage",
        params: {
          id: this.user.id,
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

.menu-item {
  cursor: pointer;
  transition: all 1;
}

.menu-item:hover {
  opacity: 0.5;
}
</style>
