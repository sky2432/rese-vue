<template>
  <div>
    <v-app-bar app class="amber">
      <div class="header-logo d-flex ml-5">
        <v-icon
          class="mdi mdi-silverware-variant mr-1 "
          color="white"
          large
        ></v-icon>
        <h1 class="header-txt">Rese</h1>
      </div>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row>
          <v-col
            v-for="n in 24"
            :key="n"
            cols="3"
          >
            <v-card height="200"></v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </div>
</template>

<script>
export default {};
</script>

<style></style>
