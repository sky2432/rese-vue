<template>
  <div>
    <div class="wrapper" v-if="loading">
      <v-progress-circular color="amber" indeterminate></v-progress-circular>
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
      this.shops = resData.data.data;
      this.loading = false;
      this.loaded = true;
    },
  },
};
</script>

<style scoped>
.wrapper {
  height: calc(100vh - 112px);
}
</style>
