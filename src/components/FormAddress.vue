<template>
  <div>
    <p class="mb-0" style="font-size: 16px">
      <v-icon class="mr-1">mdi-mailbox</v-icon>address
    </p>

    <v-row class="ma-0 ml-6 align-center">
      <v-col cols="3" class="pl-0">
        <BaseTextField
          name="郵便番号"
          rules="required|postCodeRegex:^[0-9]*$|length:7"
          hint="ハイフンなしで入力してください"
          label="PostCode"
          :value="shopPostCode"
          @input="$emit('setPostCode', $event)"
        ></BaseTextField>
      </v-col>
      <v-col cols="9">
        <v-btn @click="searchAdress">郵便番号から住所を検索</v-btn>
      </v-col>
    </v-row>

    <div class="ml-6">
      <BaseTextField
        name="都道府県・市区町村・番地"
        rules="required|max:255"
        label="Prefectures/Municipality/HouseNumber"
        :value="shopMainAddress"
        @input="$emit('setMainAddress', $event)"
      ></BaseTextField>
    </div>

    <div class="ml-6">
      <BaseTextField
        name="建物・号室"
        rules="max:255"
        label="Building/RoomNumber"
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
        .then((reponse) => {
          this.$emit("auto-set-address", reponse.data[0].allAddress);
        })
        .catch(() => {
          return;
        });
    },
  },
};
</script>
