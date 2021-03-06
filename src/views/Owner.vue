<template>
  <div>
    <AppBar :drawer="drawer" @change-drawer="drawer = $event"></AppBar>

    <v-navigation-drawer app mobile-breakpoint="960" v-model="drawer">
      <v-sheet class="pa-8" color="amber">
        <v-row class="align-center">
          <v-avatar color="white" size="64">
            <v-img :src="shop.image_url" v-if="user.is_shop"></v-img>
            <v-icon v-if="!user.is_shop">mdi-silverware-variant</v-icon>
          </v-avatar>
          <div class="pl-4" v-if="user.is_shop">{{ shop.name }}</div>
          <div class="pl-4" v-if="!user.is_shop">Rese</div>
        </v-row>
      </v-sheet>

      <v-divider></v-divider>

      <v-list>
        <v-list-item-group color="amber" v-model="drawerItem">
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

          <v-list-item @click="currentComponent = 'SettingAccount'">
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
          v-bind="{
            shopId: shop.id,
            shopName: shop.name,
            shopGenreId: shop.genre_id,
            genreName: shopGenre.name,
            shopOverview: shop.overview,
            shopImageUrl: shop.image_url,
            shopPostalCode: shop.postal_code,
            shopMainAddress: shop.main_address,
            shopOptionAddress: shop.option_address,
            loading: loading,
            loaded: loaded,
          }"
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
import windowWidthHeightMixin from "../mixins/windowWidthHeightMixin.js";
import OwnerReservation from "../components/OwnerReservation";
import OwnerShop from "../components/OwnerShop";
import SettingAccount from "../components/SettingAccount";
import AppBar from "../components/AppBar";

export default {
  components: {
    OwnerReservation,
    OwnerShop,
    SettingAccount,
    AppBar,
  },

  mixins: [windowWidthHeightMixin],

  data() {
    return {
      drawer: null,
      drawerItem: 0,
      shop: "",
      shopGenre: "",
      loading: null,
      loaded: null,
      currentComponent: OwnerReservation,
    };
  },

  watch: {
    drawerItem() {
      //this.widthはwindowWidthHeightMixinの変数
      if (this.width < 960) {
        this.drawer = false;
      }
    },
  },

  computed: {
    ...mapGetters(["user"]),
  },

  created() {
    if (this.user.is_shop) {
      this.getOwnerShop();
    } else {
      this.changeLoading();
    }
    if (this.width < 960) {
      this.drawer = false;
    } else {
      this.drawer = true;
    }
  },

  methods: {
    async getOwnerShop() {
      this.loading = true;
      this.loaded = false;
      const resData = await ownersRepository.getOwnerShop(this.user.id);
      const shop = resData.data.data;
      this.shop = shop;
      this.shopGenre = shop.genre;
      this.loading = false;
      this.loaded = true;
    },

    changeLoading() {
      this.loading = false;
      this.loaded = true;
    },

    async logout() {
      await this.$store.dispatch("logout");
      this.$router.replace("/");
    },
  },
};
</script>
