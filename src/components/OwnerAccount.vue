<template>
  <div class="wrapper">
    <div class="wrap">
      <v-card tile>
        <v-tabs>
          <v-tab @click="currentComponent = 'FormUpdateNameEmail'"
            >名前・メールアドレス</v-tab
          >
          <v-tab @click="currentComponent = 'FormUpdatePassword'"
            >パスワード</v-tab
          >
        </v-tabs>
      </v-card>
      <component :is="currentComponent"></component>
    </div>
  </div>
</template>

<script>
import FormUpdateNameEmail from "../components/FormUpdateNameEmail";
import FormUpdatePassword from "../components/FormUpdatePassword";

export default {
  components: {
    FormUpdateNameEmail,
    FormUpdatePassword,
  },

  data() {
    return {
      currentComponent: FormUpdateNameEmail,
    };
  },
};
</script>

<style scoped>
.wrap {
  width: 100%;
}

@media screen and (min-width: 600px) {
  .wrap {
    width: 90%;
  }
}
</style>
