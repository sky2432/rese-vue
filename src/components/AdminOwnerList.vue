<template>
  <v-main>
    <v-container class="py-4 px-6" fluid>
      <v-card>
        <v-card-title class="amber">
          店舗代表者一覧
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="検索"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="owners"
          :search="search"
          :loading="loading"
          item-key="id"
          loading-text="ロード中です"
        >
          <template v-slot:no-data>
            店舗代表者はいません
          </template>
          <template v-slot:no-results>
            検索条件に当てはまる店舗代表者はいません
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </v-main>
</template>

<script>
import ownersRepository from "../repositories/ownersRepository.js";

export default {
  data() {
    return {
      owners: [],
      search: "",
      loading: true,
      headers: [
        { text: "ID", value: "id" },
        { text: "名前", value: "name" },
        { text: "メールアドレス", value: "email" },
        { text: "店舗名", value: "shop.name" },
      ],
    };
  },

  computed: {},

  created() {
    this.getOwners();
  },

  methods: {
    async getOwners() {
      const resData = await ownersRepository.getOwners();
      this.owners = resData.data.data;
      this.loading = false;
      console.log(this.owners);
    },
  },
};
</script>
