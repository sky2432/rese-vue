<template>
  <v-app-bar app class="amber" light>
    <v-container>
      <div class="header-logo d-flex">
        <v-icon class="mr-1 " large
          >mdi-silverware-variant</v-icon
        >
        <h1 class="header-txt" @click="$router.push('/')">Rese</h1>
      </div>
    </v-container>
  </v-app-bar>
</template>

<script>
export default {};
</script>

<style scoped>
.header-txt {
  cursor: pointer;
}
</style>
