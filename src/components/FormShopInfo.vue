<template>
  <div>
    <TextFieldName
      name="店名"
      label="ShopName"
      icon="mdi-store"
      v-model="name"
    ></TextFieldName>

    <BaseSelector
      :options="genreOptions"
      name="ジャンル"
      label="Genre"
      icon="mdi-silverware-fork-knife"
      v-model="genre"
    ></BaseSelector>

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

    <FormAddress
      v-bind="{
        shopPostCode: postalCode,
        shopMainAddress: mainAddress,
        shopOptionAddress: optionAddress,
      }"
      @setPostCode="postalCode = $event"
      @setMainAddress="mainAddress = $event"
      @setOptionAddress="optionAddress = $event"
      @auto-set-address="mainAddress = $event"
    ></FormAddress>

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
    shopGenreId: {
      type: Number,
    },
    shopOverview: {
      type: String,
    },
    shopPostalCode: {
      type: String,
      require: true,
    },
    shopMainAddress: {
      type: String,
      require: true,
    },
    shopOptionAddress: {
      type: String,
      require: true,
    },
  },

  data() {
    return {
      name: "",
      genre: null,
      overview: "",
      postalCode: "",
      mainAddress: "",
      optionAddress: "",
      genreOptions: config.genreOptions,
    };
  },

  created() {
    this.setUpdateData();
  },

  methods: {
    resetData() {
      this.name = "";
      this.genre = null;
      this.overview = "";
      this.postalCode = "";
      this.mainAddress = "";
      this.optionAddress = "";
    },

    setUpdateData() {
      this.name = this.shopName;
      this.genre = this.shopGenreId;
      this.overview = this.shopOverview;
      this.postalCode = this.shopPostalCode;
      this.mainAddress = this.shopMainAddress;
      this.optionAddress = this.shopOptionAddress;
    },

    sendUpdateData() {
      const sendData = this.createSendData();
      this.$emit("send-update-data", sendData);
    },

    sendCreateData() {
      const sendData = this.createSendData();
      this.$emit("send-create-data", sendData);
    },

    createSendData() {
      const sendData = {
        name: this.name,
        genre_id: this.genre,
        overview: this.overview,
        postal_code: this.postalCode,
        main_address: this.mainAddress,
        option_address: this.optionAddress,
      };
      return sendData;
    },
  },
};
</script>
