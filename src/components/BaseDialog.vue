<template>
  <v-dialog :max-width="maxWidth" v-model="dialog" :persistent="persistent">
    <v-card :loading="loading">
      <v-card-title :class="titleClass">
        <slot name="title"></slot>
        <template v-if="closeIcon">
          <v-spacer></v-spacer>
          <slot name="closeIcon">
            <v-btn icon @click="dialog = false"
              ><v-icon>mdi-window-close</v-icon></v-btn
            >
          </slot>
        </template>
      </v-card-title>
      <v-card-text v-if="body" :class="textClass">
        <slot name="body"></slot>
      </v-card-text>
      <v-divider v-if="divider"></v-divider>
      <v-card-actions :class="actionsClass" v-if="button">
        <slot name="leftButton"></slot>
        <slot name="baseButton">
          <v-btn color="amber white--text" @click="dialog = false">
            {{ baseButtonText }}
          </v-btn>
        </slot>
        <slot name="lightButton"></slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    baseButtonText: {
      type: String,
      default: "閉じる",
    },
    body: {
      type: Boolean,
      default: false,
    },
    button: {
      type: Boolean,
      default: true,
    },
    divider: {
      type: Boolean,
      default: false,
    },
    closeIcon: {
      type: Boolean,
      default: false,
    },
    titleClass: {
      type: String,
      default: "justify-center",
    },
    actionsClass: {
      type: String,
      default: "justify-center",
    },
    textClass: {
      type: String,
    },
    persistent: {
      type: Boolean,
      default: false,
    },
    maxWidth: {
      type: String,
      default: "500px",
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
