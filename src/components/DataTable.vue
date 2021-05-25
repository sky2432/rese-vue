<template>
  <v-card>
    <v-card-title class="amber">
      <slot name="title"></slot>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        :label="label"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :items="tableData"
      :headers="headers"
      :item-key="itemKey"
      :search="search"
      :loading="loading"
      loading-text="ロード中です"
    >
      <template v-slot:[`item.name`]="{ item }" v-if="avatar">
        <v-avatar color="white" size="35">
          <v-img :src="item.image_url"></v-img>
        </v-avatar>
        {{ item.name }}
      </template>
      <template v-slot:[`item.detail`]="{ item }" v-if="detail">
        <v-btn color="amber" dark outlined @click="movePage(item.id)"
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
</template>

<script>
export default {
  props: {
    tableData: {
      type: Array,
      require: true,
    },
    headers: {
      type: Array,
      require: true,
    },
    label: {
      type: String,
      require: true,
    },
    avatar: {
      type: Boolean,
      default: false,
    },
    detail: {
      type: Boolean,
      default: false,
    },
    itemKey: {
      type: String,
      default: "id",
    },
  },

  data() {
    return {
      loading: true,
      search: "",
    };
  },

  methods: {
    stopLoading() {
      this.loading = false;
    },

    movePage(itemId) {
      this.$emit("move-page", itemId);
    },
  },
};
</script>
