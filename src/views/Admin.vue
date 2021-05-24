<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app>
      <v-sheet color="amber" class="pa-8">
        <v-row class="align-center">
          <v-avatar color="white" size="64">
            <v-icon>mdi-silverware-variant</v-icon>
          </v-avatar>
          <div class="pl-4">Rese</div>
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
              <v-list-item-title>店舗一覧</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item @click="currentComponent = 'AdminOwnerList'">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>店舗代表者一覧</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item @click="currentComponent = 'AdminUserList'">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>ユーザー一覧</v-list-item-title>
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
import { mapGetters } from "vuex";
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
      currentComponent: AdminOwnerList,
    };
  },

  computed: {
    ...mapGetters(["user"]),
  },

  created() {},

  methods: {
    logout() {
      this.$store.dispatch("logout");
    },
  },
};
</script>
