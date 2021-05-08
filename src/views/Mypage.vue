<template>
  <div>
    <v-app-bar app color="amber" light flat>
      <v-container>
        <div class="header-logo d-flex">
          <v-icon class="mr-1 " large>mdi-silverware-variant</v-icon>
          <h1 class="header-txt" @click="$router.push('/home')">Rese</h1>
        </div>
      </v-container>

      <template v-slot:extension>
        <v-tabs centered slider-color="grey">
          <v-tab @click="currentComponent = 'MypageFavorite'">お気に入り</v-tab>
          <v-tab @click="currentComponent = 'MypageReservation'"
            >予約一覧</v-tab
          >
        </v-tabs>
      </template>
    </v-app-bar>

    <v-main>
      <v-container>
        <component :is="currentComponent"></component>
      </v-container>
    </v-main>
  </div>
</template>

<script>
import MypageFavorite from "../components/MypageFavorite.vue";
import MypageReservation from "../components/MypageReservation";
export default {
  components: {
    MypageFavorite,
    MypageReservation,
  },

  props: {
    id: {
      type: Number,
      require: true,
    },
  },

  data() {
    return {
      currentComponent: MypageFavorite,
    };
  },

  methods: {},
};
</script>

<style scoped>
.header-txt {
  cursor: pointer;
}
</style>
