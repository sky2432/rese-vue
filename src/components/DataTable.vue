<template>
  <v-main>
    <v-container class="py-4 px-6" fluid>
      <v-card>
        <v-card-title class="amber">
          <slot name="title"></slot>
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
            <slot name="avatar"></slot>
            {{ item.name }}
          </template>
          <template v-slot:[`item.detail`]="{ item }">
            <v-btn color="amber" dark outlined @click="moveShopDetail(item.id)"
              >詳細</v-btn
            >
          </template>
          <template v-slot:no-data>
            <slot name="noData"></slot>
          </template>
          <template v-slot:no-results>
            <slot name="noResults"></slot>
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
    return {};
  },

  computed: {},

  created() {
    // this.getShops();
  },

  methods: {
    // async getShops() {
    //   const resData = await shopsRepository.getShops();
    //   this.shops = resData.data.data;
    //   this.loading = false;
    // },

    // moveShopDetail(shopId) {
    //   this.$helpers.$_movePageWithPram("ShopDetail", "shopId", shopId);
    // },
  },
};
</script>
