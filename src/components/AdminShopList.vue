<template>
  <v-container class="py-4 px-6" fluid>
    <DataTable
      ref="dataTable"
      label="ID・店名・エリア・ジャンルで検索"
      v-bind="{
        tableData: shops,
        headers: headers,
        loading: loading,
        name: true,
        shopName: true,
        area: true,
        detail: true,
      }"
      @move-page="moveShopDetail"
    >
      <template #title>
        <span class="data-table-header">店舗リスト</span>
      </template>
      <template #addButton>
        <v-btn class="data-table-header" @click="getShops">
          <v-icon>mdi-autorenew</v-icon>
        </v-btn>
      </template>
      <template #noData>店舗はありません</template>
      <template #noResults>検索条件に当てはまる店舗はありません</template>
    </DataTable>
  </v-container>
</template>

<script>
import shopsRepository from "../repositories/shopsRepository";
import DataTable from "../components/DataTable";

export default {
  components: {
    DataTable,
  },

  data() {
    return {
      shops: [],
      loading: true,
      headers: [
        { text: "店舗ID", value: "id" },
        { text: "店名", value: "name" },
        { text: "エリア", value: "main_address" },
        { text: "ジャンル", value: "genre.name" },
        { text: "", value: "detail", sortable: false, filterable: false },
      ],
    };
  },

  created() {
    this.getShops();
  },

  methods: {
    async getShops() {
      this.loading = true;
      const resData = await shopsRepository.getShops();
      this.shops = resData.data.data;
      this.loading = false;
    },

    moveShopDetail(shopId) {
      this.$helpers.$_movePageWithPram("ShopDetail", "shopId", shopId);
    },
  },
};
</script>
