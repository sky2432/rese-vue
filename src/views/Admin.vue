<template>
  <div>
    <AppBar :drawer="drawer" @change-drawer="drawer = $event"></AppBar>

    <v-navigation-drawer app mobile-breakpoint="960" v-model="drawer">
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
        <v-list-item-group color="amber" v-model="drawerItem">
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

          <v-list-item
            @click="currentComponent = 'AdminList'"
            v-if="user.role === 1"
          >
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>管理者リスト</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item @click="currentComponent = 'AdminMail'">
            <v-list-item-icon>
              <v-icon>mdi-email</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>メール送信</v-list-item-title>
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
        <component :is="currentComponent"></component>
      </keep-alive>
    </v-main>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import windowWidthMixin from "../mixins/windowWidthMixin.js";
import AdminOwnerList from "../components/AdminOwnerList";
import AdminUserList from "../components/AdminUserList";
import AdminShopList from "../components/AdminShopList";
import AdminList from "../components/AdminList";
import AdminMail from "../components/AdminMail";
import OwnerAccount from "../components/OwnerAccount";
import AppBar from "../components/AppBar";


export default {
  components: {
    AdminShopList,
    AdminOwnerList,
    AdminUserList,
    AdminList,
    AdminMail,
    OwnerAccount,
    AppBar
  },

  mixins: [windowWidthMixin],

  data() {
    return {
      drawer: null,
      drawerItem: 0,
      currentComponent: AdminShopList,
    };
  },

  computed: {
    ...mapGetters(["user"]),
  },

  watch: {
    drawerItem() {
      //this.widthはwindowWidthMixinの変数
      if (this.width < 960) {
        this.drawer = false;
      }
    },
  },

  methods: {
    async logout() {
      await this.$store.dispatch("logout");
      this.$router.replace("/");
    },
  },
};
</script>
