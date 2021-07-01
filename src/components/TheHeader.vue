<template>
  <v-app-bar class="amber" app light>
    <v-container>
      <v-row>
        <div class="d-flex align-center header-txt" @click="movePage">
          <v-icon class="mr-1 " large>mdi-silverware-variant</v-icon>
          <h1>Rese</h1>
        </div>
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
