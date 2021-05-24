<template>
  <v-main>
    <v-container class="py-4 px-6" fluid>
      <v-card>
        <v-card-title class="amber">
          店舗一覧
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="ID・店名・エリア・ジャンルで検索"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="shops"
          :search="search"
          :loading="loading"
          item-key="id"
          loading-text="ロード中です"
        >
          <template v-slot:[`item.name`]="{ item }">
            <v-avatar color="white" size="35">
              <v-img :src="item.image_url"></v-img>
            </v-avatar>
            {{ item.name }}
          </template>
          <template v-slot:[`item.detail`]="{ item }">
            <v-icon small @click="editItem(item)">
              mdi-pencil
            </v-icon>
          </template>
          <template v-slot:no-data>
            店舗はありません
          </template>
          <template v-slot:no-results>
            検索条件に当てはまる店舗はありません
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </v-main>
</template>

<script>
import shopsRepository from "../repositories/shopsRepository";

export default {
  data() {
    return {
      shops: [],
      search: "",
      loading: true,
      headers: [
        { text: "店舗ID", value: "id" },
        { text: "店名", value: "name" },
        { text: "エリア", value: "area.name" },
        { text: "ジャンル", value: "genre.name" },
        { text: "", value: "detail", sortable: false },
      ],
    };
  },

  computed: {},

  created() {
    this.getShops();
  },

  methods: {
    async getShops() {
      const resData = await shopsRepository.getShops();
      this.shops = resData.data.data;
      this.loading = false;
      console.log(this.shops);
    },
  },
};
</script>
