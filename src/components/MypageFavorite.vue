<template>
  <div>
    <div class="wrapper" v-if="loading">
      <v-progress-circular color="amber" indeterminate></v-progress-circular>
    </div>
    <div class="wrapper" v-if="notExits">
      <p>お気に入りの店舗はありません</p>
    </div>
    <ShopCardList
      v-if="loaded"
      :shops="shops"
      :favorites="shops"
      @reload-favorites="getUserFavorites"
    ></ShopCardList>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import favoritesRepository from "../repositories/favoritesRepository.js";
import ShopCardList from "../components/ShopCardList";

export default {
  components: {
    ShopCardList,
  },

  data() {
    return {
      shops: [],
      loading: true,
      loaded: false,
      notExits: false,
    };
  },

  computed: {
    ...mapGetters(["user"]),
  },

  created() {
    this.getUserFavorites();
  },

  methods: {
    async getUserFavorites() {
      const resData = await favoritesRepository.getUserFavorites(this.user.id);
      this.loading = false;
      const favoriteShops = resData.data.data;
      if (favoriteShops.length === 0) {
        this.notExits = true;
      } else {
        this.shops = favoriteShops;
        this.loaded = true;
      }
    },
  },
};
</script>

<style scoped>
.wrapper {
  height: calc(100vh - 136px);
}
</style>
