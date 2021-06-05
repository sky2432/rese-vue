<template>
  <BaseDialog
    ref="baseDialog"
    v-bind="{
      body: true,
      closeIcon: true,
    }"
    titleClass="amber"
    textClass="text-center mt-4"
  >
    <template #title>
      <slot name="title"></slot>
    </template>
    <template #body>
      <v-rating
        color="amber"
        half-increments
        hover
        :value="value"
        @input="$emit('input', $event)"
      ></v-rating>
    </template>
    <template #leftButton>
      <slot name="leftButton"></slot>
    </template>
    <template #baseButton>
      <slot name="rightButton"></slot>
    </template>
  </BaseDialog>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
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
