<template>
  <v-card></v-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    shopId: {
      type: Number,
      require: true,
    },
  },

  data() {
    return {};
  },

  computed: {
    ...mapGetters(["user"]),
  },

  methods: {},
};
</script>
