<template>
  <v-app-bar color="amber" dense light app>
    <v-app-bar-nav-icon
      @click.stop="$emit('change-drawer', !drawer)"
      class="drawer-icon align-self-center"
    ></v-app-bar-nav-icon>
    <div class="d-flex">
      <v-icon class="mr-1" medium>mdi-silverware-variant</v-icon>
      <h2>Rese</h2>
    </div>
  </v-app-bar>
</template>

<script>
export default {
  props: {
    drawer: {
      type: Boolean,
      require: true,
    }
  }
};
</script>

