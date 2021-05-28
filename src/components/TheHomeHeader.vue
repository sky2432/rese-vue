<template>
  <v-app-bar app class="amber" light>
    <v-container>
      <v-row class="align-center">
        <v-col cols="4">
          <div class="header-logo d-flex">
            <v-icon class="mr-1" large>mdi-silverware-variant</v-icon>
            <h1 class="header-txt" @click="$router.push('/home')">Rese</h1>
          </div>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="8">
          <v-row>
            <v-col cols="10">
              <slot name="search"></slot>
            </v-col>
            <v-col cols="2" class="align-self-center text-right">
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn class="white" v-bind="attrs" v-on="on">
                    <span class="amber--text">{{ user.name }}</span>
                    <v-icon color="amber">mdi-menu-down</v-icon>
                  </v-btn>
                </template>
                <v-list nav dense>
                  <v-list-item-group color="primary">
                    <v-list-item
                      class="menu-item"
                      @click="$router.push('mypage')"
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
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
    <template #extension v-if="showTab">
      <slot name="tab"></slot>
    </template>
  </v-app-bar>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    showTab: {
      type: Boolean,
    },
  },

  computed: {
    ...mapGetters(["user"]),
  },

  methods: {
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
</style>
