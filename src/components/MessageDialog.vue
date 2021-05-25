<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card :loading="loading">
      <v-card-title class="justify-center">
        <slot name="message"></slot>
      </v-card-title>
      <v-card-actions class="justify-center">
        <slot name="leftButton"></slot>
        <slot name="rightButton">
          <v-btn color="amber" dark @click="dialog = false">
            {{ rightButtonText }}
          </v-btn>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    rightButtonText: {
      type: String,
      default: "閉じる",
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
