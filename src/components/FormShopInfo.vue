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
      <FormAddress
        v-bind="{
          shopPostCode: postCode,
          shopMainAddress: mainAddress,
          shopOptionAddress: optionAddress,
        }"
        @setPostCode="postCode = $event"
        @setMainAddress="mainAddress = $event"
        @setOptionAddress="optionAddress = $event"
        @auto-set-address="mainAddress = $event"
      ></FormAddress>
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
import FormAddress from "../components/FormAddress";

export default {
  components: {
    BaseSelector,
    TextFieldName,
    BaseTextArea,
    FormAddress,
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
