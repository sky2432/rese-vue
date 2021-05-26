<template>
  <v-app>
    <v-navigation-drawer app v-model="drawer">
      <v-sheet class="pa-8" color="amber">
        <v-row class="align-center">
          <v-avatar color="white" size="64">
            <v-icon>mdi-silverware-variant</v-icon>
          </v-avatar>
          <div class="pl-4">Rese管理者</div>
        </v-row>
      </v-sheet>

      <v-divider></v-divider>

      <v-list>
        <v-list-item-group color="amber" v-model="selectedItem">
          <v-list-item @click="currentComponent = 'AdminShopList'">
            <v-list-item-icon>
              <v-icon>mdi-store</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>店舗リスト</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item @click="currentComponent = 'AdminOwnerList'">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>オーナーリスト</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item @click="currentComponent = 'AdminUserList'">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>ユーザーリスト</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-email</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>メール送信</v-list-item-title>
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

    <component :is="currentComponent"></component>
  </v-app>
</template>

<script>
import AdminOwnerList from "../components/AdminOwnerList";
import AdminUserList from "../components/AdminUserList";
import AdminShopList from "../components/AdminShopList";

export default {
  components: {
    AdminShopList,
    AdminOwnerList,
    AdminUserList,
  },

  data() {
    return {
      drawer: null,
      selectedItem: 0,
      currentComponent: AdminShopList,
    };
  },

  created() {},

  methods: {
    logout() {
      this.$store.dispatch("logout");
    },
  },
};
</script>
