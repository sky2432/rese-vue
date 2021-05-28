<template>
  <v-card
    :class="padding"
    :elevation="elevation"
    :width="width"
    :outlined="outlined"
    :tile="tile"
  >
    <v-card-title class="justify-center">
      <slot name="title"></slot>
    </v-card-title>
    <v-card-text v-if="showCardText">
      <slot name="cardText"></slot>
    </v-card-text>
    <v-card-actions class="justify-center">
      <slot name="leftButton"></slot>
      <slot name="rightButton"></slot>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    padding: {
      type: String,
    },
    elevation: {
      type: Number,
      default: 2,
    },
    width: {
      type: String,
      default: "600px",
    },
    showCardText: {
      type: Boolean,
      default: false,
    },
    tile: {
      type: Boolean,
      default: false,
    },
    outlined: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
