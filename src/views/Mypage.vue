<template>
  <div>
    <TheHomeHeader :showTab="true">
      <template #tab>
        <v-tabs slider-color="grey" centered v-model="tab">
          <v-tab @click="tab = 0">お気に入り</v-tab>
          <v-tab @click="tab = 1">予約一覧</v-tab>
        </v-tabs>
      </template>
    </TheHomeHeader>

    <v-main>
      <v-container>
        <keep-alive>
          <component :is="currentComponent"></component>
        </keep-alive>
      </v-container>
    </v-main>
  </div>
</template>

<script>
import MypageFavorite from "../components/MypageFavorite";
import MypageReservation from "../components/MypageReservation";

export default {
  components: {
    MypageFavorite,
    MypageReservation,
  },

  props: {
    tabIndex: {
      type: Number,
    },
  },

  data() {
    return {
      tab: 0,
      currentComponent: MypageFavorite,
    };
  },

  watch: {
    tab() {
      this.changeComponent();
    },
  },

  created() {
    this.tab = this.tabIndex;
  },

  methods: {
    changeComponent() {
      if (this.tab === 0) {
        this.currentComponent = "MypageFavorite";
      }
      if (this.tab === 1) {
        this.currentComponent = "MypageReservation";
      }
    },
  },
};
</script>
