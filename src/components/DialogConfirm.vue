<template>
  <v-dialog max-width="500" persistent v-model="dialog">
    <v-card :loading="loading">
      <v-card-title class="amber">
        <slot name="title"></slot>
      </v-card-title>
      <v-card-text class="pt-5 pb-0">
        <v-simple-table>
          <template #default>
            <tbody>
              <tr v-for="item in tableData" :key="item.header">
                <th>{{ item.header }}</th>
                <td :style="color">{{ item.data }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <slot name="additional"></slot>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pb-6 justify-center">
        <v-btn color="red" class="white--text" @click="dialog = false">{{
          cancellButtonText
        }}</v-btn>
        <slot name="actionButton"></slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    tableData: {
      type: Array,
      require: true,
    },
    cancellButtonText: {
      type: String,
      default: "キャンセル",
    },
    color: {
      type: String,
    },
  },

  data() {
    return {
      dialog: false,
      loading: false,
    };
  },

  methods: {
    openDialog() {
      this.dialog = true;
    },

    closeDialog() {
      this.dialog = false;
    },

    startLoading() {
      this.loading = true;
    },

    stopLoading() {
      this.loading = false;
    },
  },
};
</script>
