<template>
  <v-card>
    <v-card-title :class="titleColor">
      <slot name="title"></slot>
      <v-spacer></v-spacer>
      <v-text-field
        class="pt-0 mr-4"
        v-model="search"
        append-icon="mdi-magnify"
        :label="label"
        single-line
        hide-details
      ></v-text-field>
      <slot name="addButton"></slot>
    </v-card-title>
    <v-data-table
      :items="tableData"
      :headers="headers"
      :item-key="itemKey"
      :search="search"
      :loading="loading"
      :items-per-page="perPage"
      loading-text="ロード中です"
    >
      <template v-slot:top>
        <slot name="top"></slot>
      </template>
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
      <template v-slot:[`item.delete`]="{ item }" v-if="deletion">
        <v-icon @click="openDeleteDialog(item.id)">mdi-delete</v-icon>
      </template>
      <template
        v-if="reservationStatus"
        v-slot:[`item.reservation.status`]="{ item }"
      >
        <v-chip :color="getStatusColor(item.reservation.status)" dark>
          {{ item.reservation.status }}
        </v-chip>
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
    loading: {
      type: Boolean,
      default: true,
    },
    avatar: {
      type: Boolean,
      default: false,
    },
    detail: {
      type: Boolean,
      default: false,
    },
    deletion: {
      type: Boolean,
      default: false,
    },
    reservationStatus: {
      type: Boolean,
      default: false,
    },
    itemKey: {
      type: String,
      default: "id",
    },
    titleColor: {
      type: String,
      default: "amber",
    },
    perPage: {
      type: Number,
      default: 10,
    },
  },

  data() {
    return {
      search: "",
    };
  },

  computed: {
    getStatusColor() {
      return function(status) {
        if (status === "予約中") {
          return "green";
        }
        if (status === "来店済み") {
          return "amber";
        }
        if (status === "キャンセル") {
          return "red";
        }
      };
    },
  },

  methods: {
    movePage(itemId) {
      this.$emit("move-page", itemId);
    },

    openDeleteDialog(itemId) {
      this.$emit("open-delete-dialog", itemId);
    },
  },
};
</script>
