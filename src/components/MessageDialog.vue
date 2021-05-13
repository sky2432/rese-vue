<template>
  <v-dialog v-model="showMessageDialog" max-width="500px">
    <v-card>
      <v-card-title class="justify-center">
        <slot name="message"></slot>
      </v-card-title>
      <v-card-actions class="justify-center">
        <v-btn color="amber" @click="showMessageDialog = false">
          閉じる
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      showMessageDialog: false,
    }
  },
  methods: {
    changeShowMessageDialog() {
      this.showMessageDialog = !this.showMessageDialog;
    },
  }

};
</script>
