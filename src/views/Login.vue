<template>
  <div>
    <TheHeader></TheHeader>
    <v-main>
      <div class="wrapper">
        <div>
          <v-card tile>
            <v-tabs>
              <v-tab @click="currentComponent = 'LoginUser'">ユーザー</v-tab>
              <v-tab @click="currentComponent = 'LoginOwner'">店舗代表者</v-tab>
              <v-tab @click="currentComponent = 'LoginAdmin'">管理者</v-tab>
            </v-tabs>
          </v-card>
          <component :is="currentComponent"></component>
        </div>
      </div>
    </v-main>
  </div>
</template>

<script>
import LoginUser from "../components/LoginUser";
import LoginOwner from "../components/LoginOwner";
import LoginAdmin from "../components/LoginAdmin";

export default {
  components: {
    LoginUser,
    LoginOwner,
    LoginAdmin,
  },

  data() {
    return {
      currentComponent: LoginUser,
    };
  },
};
</script>
