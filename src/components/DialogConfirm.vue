<template>
  <BaseDialog
    ref="baseDialog"
    v-bind="{
      body: true,
      divider: true,
      baseButtonText: cancellButtonText,
    }"
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
