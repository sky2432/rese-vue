<template>
  <div>
    <p class="mb-0" style="font-size: 16px">
      <v-icon class="mr-1 pb-1">mdi-mailbox</v-icon>住所
    </p>

    <v-row class="ma-0 ml-6 align-center">
      <v-col cols="3" class="pl-0 pb-0">
        <BaseTextField
          name="郵便番号"
          rules="required|postCodeRegex:^[0-9]*$|length:7"
          hint="ハイフンなしで入力してください"
          label="郵便番号"
          :value="shopPostCode"
          @input="$emit('setPostCode', $event)"
        ></BaseTextField>
      </v-col>
      <v-col cols="12" sm="9" class="pl-0 pt-0 pt-sm-3">
        <v-btn @click="searchAdress">郵便番号から住所を検索</v-btn>
      </v-col>
    </v-row>

    <div class="ml-6">
      <BaseTextField
        name="都道府県・市区町村・番地"
        rules="required|max:255"
        label="都道府県・市区町村・番地"
        :value="shopMainAddress"
        @input="$emit('setMainAddress', $event)"
      ></BaseTextField>
    </div>

    <div class="ml-6">
      <BaseTextField
        name="建物・部屋番号"
        rules="max:255"
        label="建物・部屋番号"
        :value="shopOptionAddress"
        @input="$emit('setOptionAddress', $event)"
      ></BaseTextField>
    </div>
  </div>
</template>

<script>
import "../plugins/veeValidate.js";
import BaseTextField from "../components/BaseTextField";
import axios from "axios";

export default {
  components: {
    BaseTextField,
  },

  props: {
    shopPostCode: {
      type: String,
    },
    shopMainAddress: {
      type: String,
    },
    shopOptionAddress: {
      type: String,
    },
  },

  methods: {
    async searchAdress() {
      axios
        .get(
          `https://apis.postcode-jp.com/api/v4/postcodes/${this.shopPostCode}?apikey=${process.env.VUE_APP_POST_CODE_API_KEY}`
        )
        .then((response) => {
          this.$emit("auto-set-address", response.data[0].allAddress);
        })
        .catch(() => {
          return;
        });
    },
  },
};
</script>
