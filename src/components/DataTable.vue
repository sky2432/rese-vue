<template>
  <v-card :tile="tile">
    <v-card-title :class="titleColor">
      <slot name="title"></slot>
      <v-spacer></v-spacer>
      <v-text-field
        class="mt-3 mt-sm-0 mr-4 pt-0"
        append-icon="mdi-magnify"
        hide-details
        :label="label"
        single-line
        v-model="search"
      ></v-text-field>
      <slot name="addButton"></slot>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="tableData"
      :item-key="itemKey"
      :items-per-page="perPage"
      :loading="loading"
      loading-text="ロード中です"
      :search="search"
    >
      <template v-slot:top>
        <slot name="top"></slot>
      </template>
      <template v-slot:[`item.name`]="{ item }" v-if="name">
        <div v-if="shopName">
          <v-avatar color="white" size="35">
            <v-img :src="item.image_url"></v-img>
          </v-avatar>
          {{ item.name }}
        </div>
        <div v-if="userName">
          {{ maskUserName(item.name) }}
        </div>
      </template>
      <template v-slot:[`item.main_address`]="{ item }" v-if="area">
        {{ $helpers.$_showArea(item.main_address) }}
      </template>
      <template v-slot:[`item.detail`]="{ item }" v-if="detail">
        <v-btn color="amber white--text" outlined @click="movePage(item.id)"
          >詳細</v-btn
        >
      </template>
      <template v-slot:[`item.delete`]="{ item }" v-if="deletion">
        <v-icon v-if="item.role !== 1" @click="openDeleteDialog(item.id)"
          >mdi-delete</v-icon
        >
      </template>
      <template v-slot:[`item.edit`]="{ item }" v-if="edit">
        <v-icon
          @click="openEditDialog(item.reservation.id)"
          v-if="item.reservation.status === '来店済み'"
          >mdi-pencil</v-icon
        >
      </template>
      <template
        v-if="reservationStatus"
        v-slot:[`item.reservation.status`]="{ item }"
      >
        <v-chip
          :color="getStatusColor(item.reservation.status)"
          class="white--text"
        >
          {{ item.reservation.status }}
        </v-chip>
      </template>
      <template v-if="email" v-slot:[`item.email`]>
        *******
      </template>
      <template v-if="role" v-slot:[`item.role`]="{ item }">
        {{ showRoleText(item.role) }}
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
    name: {
      type: Boolean,
      default: false,
    },
    shopName: {
      type: Boolean,
      default: false,
    },
    userName: {
      type: Boolean,
      default: false,
    },
    area: {
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
    edit: {
      type: Boolean,
      default: false,
    },
    reservationStatus: {
      type: Boolean,
      default: false,
    },
    role: {
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
      default: -1,
    },
    tile: {
      type: Boolean,
      default: false,
    },
    email: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      search: "",
    };
  },

  computed: {
    maskUserName() {
      return function(name) {
        const length = name.length;
        let mask = name.substr(0, 1);
        for (let i = 0; i < length - 1; i++) {
          mask = mask + "*";
        }
        return mask;
      };
    },

    getStatusColor() {
      return function(status) {
        if (status === "予約中") {
          return "green";
        }
        if (status === "来店済み") {
          return "amber";
        }
        if (status === "キャンセル") {
          return "grey";
        }
        if (status === "非来店") {
          return "red";
        }
      };
    },

    showRoleText() {
      return function(role) {
        if (role === 1) {
          return "Top";
        }
        if (role === 0) {
          return "Sub";
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

    openEditDialog(reservaitonId) {
      this.$emit("open-edit-dialog", reservaitonId);
    },
  },
};
</script>
