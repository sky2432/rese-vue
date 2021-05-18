<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app>
      <v-sheet color="amber" class="pa-8">
        <v-row class="align-center">
          <v-avatar color="grey darken-1" size="64">
            <img :src="shop.image_url" alt="" />
          </v-avatar>
          <div class="pl-4">{{ shop.name }}</div>
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
      <v-container class="py-8 px-6" fluid>
        <component :is="currentComponent"></component>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";
import OwnerReservation from "../components/OwnerReservation";
import OwnerShop from "../components/OwnerShop";

export default {
  components: {
    OwnerReservation,
    OwnerShop,
  },

  data() {
    return {
      drawer: null,
      selectedItem: 0,
      currentComponent: OwnerReservation,
    };
  },

  computed: {
    ...mapGetters(["shop"]),
  },

  methods: {
    logout() {
      this.$store.dispatch("logout");
    },
  },
};
</script>
