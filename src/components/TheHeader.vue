<template>
  <v-app-bar app class="amber">
    <v-container>
      <div class="header-logo d-flex" @click="$router.push('/topPage')">
        <v-icon class="mr-1 " color="white" large
          >mdi-silverware-variant</v-icon
        >
        <h1 class="header-txt">Rese</h1>
      </div>
    </v-container>
  </v-app-bar>
</template>

<script>
export default {};
</script>

<style scoped>
.header-logo {
  cursor: pointer;
}
</style>
