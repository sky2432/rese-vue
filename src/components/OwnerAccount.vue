<template>
  <v-main>
    <div class="wrapper">
      <div class="container">
        <v-card tile>
          <v-tabs>
            <v-tab @click="currentComponent = 'SettingNameEmail'"
              >名前・メールアドレス</v-tab
            >
            <v-tab @click="currentComponent = 'SettingPassword'"
              >パスワード</v-tab
            >
          </v-tabs>
        </v-card>
        <component :is="currentComponent"></component>
      </div>
    </div>
  </v-main>
</template>

<script>
import SettingNameEmail from "../components/SettingNameEmail";
import SettingPassword from "../components/SettingPassword";

export default {
  components: {
    SettingNameEmail,
    SettingPassword,
  },

  data() {
    return {
      currentComponent: SettingNameEmail,
    };
  },
};
</script>

<style scoped>
.container {
  width: 80%;
}
</style>
