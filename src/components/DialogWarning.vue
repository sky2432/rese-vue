<template>
  <BaseDialog
    ref="baseDialog"
    v-bind="{
      body: true,
      closeIcon: true,
    }"
    titleClass="amber"
    textClass="mt-4"
    actionsClass="justify-center pt-0"
  >
    <template #title>
      ※注意事項
    </template>
    <template #body>
      <v-alert class="text-center mb-0" type="error" text>
        <h3>必ずご確認ください</h3>
        <p class="mb-0">
          店舗を削除すると、店舗に関係する全ての情報が削除されます。
        </p>
      </v-alert>
    </template>
    <template #baseButton>
      <v-btn
        class="white--text"
        color="red lighten-1"
        @click="$emit('open-dialog')"
        >店舗を削除</v-btn
      >
    </template>
  </BaseDialog>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
    };
  },

  methods: {
    openDialog() {
      this.$refs.baseDialog.openDialog();
    },

    closeDialog() {
      this.$refs.baseDialog.closeDialog();
    },
  },
};
</script>
