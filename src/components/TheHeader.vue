<template>
  <v-app-bar class="amber" light app>
    <v-container>
      <v-row class="align-center">
        <v-col>
          <div class="header-logo d-flex">
            <v-icon class="mr-1 " large>mdi-silverware-variant</v-icon>
            <h1 class="header-txt" @click="movePage">Rese</h1>
          </div>
        </v-col>
        <v-spacer></v-spacer>
        <v-col class="text-right">
          <slot name="menu"></slot>
        </v-col>
      </v-row>
    </v-container>
    <template #extension v-if="showTab">
      <slot name="tab"></slot>
    </template>
  </v-app-bar>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: "default",
    },
    showTab: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    movePage() {
      if (this.type === "default") {
        this.$router.go(-1);
      }
      if (this.type === "admin") {
        this.$router.push("/admin");
      }
    },
  },
};
</script>

<style scoped>
.header-txt {
  cursor: pointer;
}
</style>
