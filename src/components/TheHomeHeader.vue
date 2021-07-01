<template>
  <div>
    <v-app-bar class="amber" app light>
      <v-container>
        <v-row class="align-center">
          <v-col cols="2" class="header-txt" @click="$router.push('/home')">
            <div class="d-flex">
              <v-icon class="mr-1" large>mdi-silverware-variant</v-icon>
              <h1>Rese</h1>
            </div>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="10">
            <v-row class="ma-0 flex-nowrap justify-end">
              <slot name="search"></slot>
              <v-app-bar-nav-icon
                @click.stop="drawer = !drawer"
                class="drawer-icon align-self-center"
              ></v-app-bar-nav-icon>
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    class="white align-self-center menu-button"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <span class="amber--text">{{ user.name }}</span>
                    <v-icon color="amber">mdi-menu-down</v-icon>
                  </v-btn>
                </template>
                <v-list nav dense>
                  <v-list-item-group color="primary">
                    <v-list-item
                      class="menu-item"
                      v-if="$route.name !== 'Home'"
                      @click="$router.push('/home')"
                    >
                      <v-list-item-icon class="mr-2">
                        <v-icon>mdi-store</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>店舗一覧</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>

                    <v-list-item
                      class="menu-item"
                      v-if="$route.name !== 'Mypage'"
                      @click="
                        $helpers.$_movePageWithPram('Mypage', 'tabIndex', 0)
                      "
                    >
                      <v-list-item-icon class="mr-2">
                        <v-icon>mdi-account</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>マイページ</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>

                    <v-list-item
                      class="menu-item"
                      v-if="$route.name !== 'Setting'"
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
            </v-row>
          </v-col>
        </v-row>
      </v-container>
      <template #extension v-if="showTab">
        <slot name="tab"></slot>
      </template>
    </v-app-bar>

    <v-navigation-drawer app temporary v-model="drawer">
      <v-subheader class="amber">{{ user.name }}</v-subheader>
      <slot name="drawer-search"></slot>
      <v-list nav dense>
        <v-list-item-group color="amber">
          <v-list-item
            v-if="$route.name !== 'Home'"
            @click="$router.push('/home')"
          >
            <v-list-item-icon class="mr-2">
              <v-icon>mdi-store</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>店舗一覧</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            v-if="$route.name !== 'Mypage'"
            @click="$helpers.$_movePageWithPram('Mypage', 'tabIndex', 0)"
          >
            <v-list-item-icon class="mr-2">
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>マイページ</v-list-item-title>
          </v-list-item>

          <v-list-item
            v-if="$route.name !== 'Setting'"
            @click="$router.push('/setting')"
          >
            <v-list-item-icon class="mr-2">
              <v-icon>mdi-cog</v-icon>
            </v-list-item-icon>
            <v-list-item-title>設定</v-list-item-title>
          </v-list-item>

          <v-list-item @click="logout">
            <v-list-item-icon class="mr-2">
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-title>ログアウト</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    showTab: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      drawer: false,
    };
  },

  computed: {
    ...mapGetters(["user"]),
  },

  methods: {
    async logout() {
      await this.$store.dispatch("logout");
      this.$router.replace("/");
    },
  },
};
</script>

<style scoped>
.menu-button {
  display: none;
}

@media screen and (min-width: 960px) {
  .drawer-icon {
    display: none;
  }

  .menu-button {
    display: block;
  }
}
</style>
