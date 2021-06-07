<template>
  <div>
    <TextFieldName
      name="店名"
      label="ShopName"
      icon="mdi-store"
      v-model="name"
    ></TextFieldName>

    <BaseSelector
      :options="areaOptions"
      name="エリア"
      label="Area"
      icon="mdi-map-marker"
      v-model="area"
    ></BaseSelector>

    <BaseSelector
      :options="genreOptions"
      name="ジャンル"
      label="Genre"
      icon="mdi-silverware-fork-knife"
      v-model="genre"
    ></BaseSelector>

    <template v-if="formAddress">
      <p class="mb-0 mt-6" style="font-size: 16px">
        <v-icon class="mr-1">mdi-mailbox</v-icon>address
      </p>

      <v-row class="ma-0 ml-6 align-center">
        <v-col cols="3" class="pl-0">
          <BaseTextField
            name="郵便番号"
            rules="required|postCodeRegex:^[0-9]*$"
            label="PostCode"
            v-model="postCode"
          ></BaseTextField>
        </v-col>
        <v-col cols="9">
          <v-btn @click="searchAdress">郵便番号から住所を検索</v-btn>
        </v-col>
      </v-row>

      <div class="ml-6">
        <BaseTextField
          name="都道府県・市区町村・番地"
          rules="required"
          label="Prefectures/Municipality/HouseNumber"
          v-model="mainAddress"
        ></BaseTextField>
      </div>

      <div class="ml-6">
        <BaseTextField
          name="建物・号室"
          label="Building/RoomNumber"
          v-model="optionAddress"
        ></BaseTextField>
      </div>
    </template>

    <div class="mt-4">
      <BaseTextArea
        name="店舗概要"
        rules="required|max:255"
        vid="overview"
        :counter="255"
        label="Overview"
        icon="mdi-storefront"
        v-model="overview"
      ></BaseTextArea>
    </div>

    <slot name="file"></slot>
  </div>
</template>

<script>
import "../plugins/veeValidate.js";
import config from "../config/const.js";
import TextFieldName from "../components/TextFieldName";
import BaseSelector from "../components/BaseSelector";
import BaseTextArea from "../components/BaseTextArea";
import BaseTextField from "../components/BaseTextField";
import axios from "axios";

export default {
  components: {
    BaseSelector,
    TextFieldName,
    BaseTextArea,
    BaseTextField,
  },

  props: {
    shopName: {
      type: String,
    },
    shopArea: {
      type: Number,
    },
    shopGenre: {
      type: Number,
    },
    shopOverview: {
      type: String,
    },
    formAddress: {
      type: Boolean,
      default: false,
    },
  },

  created() {
    this.name = this.shopName;
    this.area = this.shopArea;
    this.genre = this.shopGenre;
    this.overview = this.shopOverview;
  },

  data() {
    return {
      areaOptions: config.areaOptions,
      genreOptions: config.genreOptions,
      name: "",
      area: null,
      genre: null,
      overview: "",
      postCode: "",
      mainAddress: "",
      optionAddress: "",
    };
  },

  methods: {
    async searchAdress() {
      axios
        .get(
          `https://apis.postcode-jp.com/api/v4/postcodes/${this.postCode}?apikey=UuqgYKMuxKCuqFJFGBEBFPkZmIMxGV4bBdBetew`
        )
        .then((reponse) => {
          this.mainAddress = reponse.data[0].allAddress;
        })
        .catch(() => {
          return;
        });
    },

    sendUpdateData() {
      const sendData = {
        name: this.name,
        area_id: this.area,
        genre_id: this.genre,
        overview: this.overview,
      };
      this.$emit("send-update-data", sendData);
    },

    sendCreateData() {
      const sendData = {
        name: this.name,
        area_id: this.area,
        genre_id: this.genre,
        overview: this.overview,
        address: this.mainAddress + this.optionAddress,
      };
      this.$emit("send-create-data", sendData);
    },
  },
};
</script>
