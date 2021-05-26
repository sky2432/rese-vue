<template>
  <div>
    <TheHomeHeader :showTab="true">
      <template #tab>
        <v-tabs slider-color="grey" centered>
          <v-tab @click="currentComponent = 'MypageFavorite'">お気に入り</v-tab>
          <v-tab @click="currentComponent = 'MypageReservation'"
            >予約一覧</v-tab
          >
        </v-tabs>
      </template>
    </TheHomeHeader>

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

  data() {
    return {
      currentComponent: MypageReservation,
    };
  },
};
</script>
