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
          <v-list-item @click="showOwnerReservation">
            <v-list-item-icon>
              <v-icon>mdi-inbox-arrow-down</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>予約一覧</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item @click="showOwnerShop">
            <v-list-item-icon>
              <v-icon>mdi-inbox-arrow-down</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>店舗情報</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
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
      <v-container class="py-4 px-6" fluid>
        <OwnerReservation
          v-if="ownerReservation"
          v-bind="{ shopId: shop.id, existsShop: existsShop }"
        ></OwnerReservation>
        <OwnerShop
          v-if="ownerShop"
          v-bind="childComponentProps"
          :existsShop="existsShop"
          @reload="getOwnerShop"
        ></OwnerShop>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";
import OwnerReservation from "../components/OwnerReservation";
import OwnerShop from "../components/OwnerShop";
import ownersRepository from "../repositories/ownersRepository.js";

export default {
  components: {
    OwnerReservation,
    OwnerShop,
  },

  data() {
    return {
      shop: "",
      shopArea: "",
      shopGenre: "",
      existsShop: true,
      ownerReservation: true,
      ownerShop: false,
      drawer: null,
      selectedItem: 0,
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
    showOwnerReservation() {
      this.ownerReservation = true;
      this.ownerShop = false;
    },

    showOwnerShop() {
      this.ownerReservation = false;
      this.ownerShop = true;
    },

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
