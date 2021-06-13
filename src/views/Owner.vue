<template>
  <div>
    <v-navigation-drawer app permanent>
      <v-sheet class="pa-8" color="amber">
        <v-row class="align-center">
          <v-avatar color="white" size="64">
            <v-img :src="shop.image_url" v-if="existsShop"></v-img>
            <v-icon v-if="!existsShop">mdi-silverware-variant</v-icon>
          </v-avatar>
          <div class="pl-4" v-if="existsShop">{{ shop.name }}</div>
          <div class="pl-4" v-if="!existsShop">Rese</div>
        </v-row>
      </v-sheet>

      <v-divider></v-divider>

      <v-list>
        <v-list-item-group color="amber" v-model="selectedItem">
          <v-list-item @click="currentComponent = 'OwnerReservation'">
            <v-list-item-icon>
              <v-icon>mdi-format-list-bulleted</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>予約一覧</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item @click="currentComponent = 'OwnerShop'">
            <v-list-item-icon>
              <v-icon>mdi-store</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>店舗情報</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item @click="currentComponent = 'OwnerAccount'">
            <v-list-item-icon>
              <v-icon>mdi-cog</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>アカウント</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

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
      <keep-alive>
        <component
          v-bind="childComponentProps"
          :existsShop="existsShop"
          :loading="loading"
          :loaded="loaded"
          :is="currentComponent"
          @reload="getOwnerShop"
        ></component>
      </keep-alive>
    </v-main>
  </div>
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
      shopGenre: "",
      existsShop: true,
      loading: true,
      loaded: false,
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
        genre_id: shopGenreId,
        overview: shopOverview,
        image_url: shopImageUrl,
        postal_code: shopPostalCode,
        main_address: shopMainAddress,
        option_address: shopOptionAddress,
      } = this.shop;
      const { name: genreName } = this.shopGenre;
      return {
        shopId,
        shopName,
        shopGenreId,
        shopOverview,
        shopImageUrl,
        shopPostalCode,
        shopMainAddress,
        shopOptionAddress,
        genreName,
      };
    },
  },

  created() {
    this.getOwnerShop();
  },

  methods: {
    async getOwnerShop() {
      this.loading = true;
      this.loaded = false;
      const resData = await ownersRepository.getOwnerShop(this.user.id);
      if (resData.status === 200) {
        const shop = resData.data.data;
        this.shop = shop;
        this.shopGenre = shop.genre;
        this.existsShop = true;
        this.changeLoading();
      }
      if (resData.status === 204) {
        this.existsShop = false;
        this.changeLoading();
      }
    },

    changeLoading() {
      this.loading = false;
      this.loaded = true;
    },

    logout() {
      this.$store.dispatch("logout");
    },
  },
};
</script>
