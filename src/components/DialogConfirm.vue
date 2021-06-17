<template>
  <BaseDialog
    ref="baseDialog"
    v-bind="{
      body: true,
      divider: true,
      maxWidth: maxWidth,
    }"
    baseButtonText="修正"
    titleClass="amber"
    textClass="pt-5 pb-0"
  >
    <template #title>
      <slot name="title"></slot>
    </template>
    <template #body>
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
    </template>
    <template #lightButton>
      <slot name="actionButton"></slot>
    </template>
  </BaseDialog>
</template>

<script>
export default {
  props: {
    tableData: {
      type: Array,
      require: true,
    },
    color: {
      type: String,
    },
    maxWidth: {
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
      this.$refs.baseDialog.openDialog();
    },

    closeDialog() {
      this.$refs.baseDialog.closeDialog();
    },

    startLoading() {
      this.$refs.baseDialog.startLoading();
    },

    stopLoading() {
      this.$refs.baseDialog.stopLoading();
    },
  },
};
</script>

<style scoped>
.theme--light.v-data-table
  > .v-data-table__wrapper
  > table
  > tbody
  > tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
  background-color: white;
}
</style>
