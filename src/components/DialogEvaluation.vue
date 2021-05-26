<template>
  <v-dialog v-model="dialog" max-width="500" persistent>
    <v-card :loading="loading">
      <v-card-title class="amber">
        <slot name="title"></slot>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false"
          ><v-icon>mdi-window-close</v-icon></v-btn
        >
      </v-card-title>
      <v-card-text class="text-center mt-4">
        <v-rating
          :value="value"
          @input="$emit('input', $event)"
          half-increments
          hover
          color="amber"
        ></v-rating>
      </v-card-text>
      <v-card-actions class="justify-center">
        <slot name="leftButton"></slot>
        <slot name="rightButton"></slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
