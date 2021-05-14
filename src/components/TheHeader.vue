<template>
  <v-app-bar app class="amber" light>
    <v-container>
      <v-row class="align-center">
        <v-col>
          <div class="header-logo d-flex">
            <v-icon class="mr-1 " large>mdi-silverware-variant</v-icon>
            <h1 class="header-txt" @click="$router.push('/')">Rese</h1>
          </div>
        </v-col>
        <v-spacer></v-spacer>
        <v-col class="text-right">
          <slot name="menu"></slot>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script>
export default {

};
</script>

<style scoped>
.header-txt {
  cursor: pointer;
}
</style>
