<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app>
      <v-sheet color="amber" class="pa-8">
        <v-row class="align-center">
          <v-avatar color="white" size="64">
            <v-img v-if="existsShop" :src="shop.image_url"></v-img>
            <v-icon v-if="!existsShop">mdi-silverware-variant</v-icon>
          </v-avatar>
          <div v-if="existsShop" class="pl-4">{{ shop.name }}</div>
          <div v-if="!existsShop" class="pl-4">Rese</div>
        </v-row>
      </v-sheet>

      <v-divider></v-divider>

      <v-list>
        <v-list-item-group color="amber" v-model="selectedItem">
          <v-list-item @click="currentComponent = 'OwnerReservation'">
            <v-list-item-icon>
              <v-icon>mdi-inbox-arrow-down</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>予約一覧</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item @click="currentComponent = 'OwnerShop'">
            <v-list-item-icon>
              <v-icon>mdi-inbox-arrow-down</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>店舗情報</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item @click="currentComponent = 'OwnerAccount'">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>アカウント</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item @click="logout">
            <v-list-item-icon>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>ログアウト</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <component
        v-bind="childComponentProps"
        :existsShop="existsShop"
        :is="currentComponent"
        @reload="getOwnerShop"
      ></component>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";
import ownersRepository from "../repositories/ownersRepository.js";
import OwnerReservation from "../components/OwnerReservation";
import OwnerShop from "../components/OwnerShop";
import OwnerAccount from "../components/OwnerAccount";

export default {
  components: {
    OwnerReservation,
    OwnerShop,
    OwnerAccount,
  },

  data() {
    return {
      shop: "",
      shopArea: "",
      shopGenre: "",
      existsShop: true,
      drawer: null,
      selectedItem: 0,
      currentComponent: OwnerReservation,
    };
  },

  computed: {
    ...mapGetters(["user"]),

    childComponentProps() {
      const {
        id: shopId,
        name: shopName,
        area_id: areaId,
        genre_id: genreId,
        overview: shopOverview,
        image_url: shopImageUrl,
      } = this.shop;
      const { name: areaName } = this.shopArea;
      const { name: genreName } = this.shopGenre;
      return {
        shopId,
        shopName,
        areaId,
        genreId,
        shopOverview,
        shopImageUrl,
        areaName,
        genreName,
      };
    },
  },

  created() {
    this.getOwnerShop();
  },

  methods: {
    async getOwnerShop() {
      const resData = await ownersRepository.getOwnerShop(this.user.id);
      if (resData.status === 200) {
        const shop = resData.data.data;
        this.shop = shop;
        this.shopArea = shop.area;
        this.shopGenre = shop.genre;
        this.existsShop = true;
      }
      if (resData.status === 204) {
        this.existsShop = false;
      }
    },

    logout() {
      this.$store.dispatch("logout");
    },
  },
};
</script>
