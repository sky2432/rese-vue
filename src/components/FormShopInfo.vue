<template>
  <div>
    <TextFieldName
      name="店名"
      label="ShopName"
      icon="mdi-store"
      :value="name"
      @input="$emit('setName', $event)"
    ></TextFieldName>

    <BaseSelector
      :options="areaOptions"
      name="エリア"
      label="Area"
      icon="mdi-map-marker"
      :value="area"
      @input="$emit('setArea', $event)"
    ></BaseSelector>

    <BaseSelector
      :options="genreOptions"
      name="ジャンル"
      label="Genre"
      icon="mdi-silverware-fork-knife"
      :value="genre"
      @input="$emit('setGenre', $event)"
    ></BaseSelector>

    <div class="mt-4">
      <BaseTextArea
        name="店舗概要"
        rules="required|max:255"
        vid="overview"
        :counter="255"
        label="Overview"
        icon="mdi-storefront"
        :value="overview"
        @input="$emit('setOverview', $event)"
      ></BaseTextArea>
    </div>

    <slot name="file"></slot>

    <p class="mb-0 mt-6" style="font-size: 16px">
      <v-icon>mdi-map-marker</v-icon>address
    </p>

    <v-row class="ma-0 align-center">
      <v-col cols="3" class="pl-0">
        <BaseTextField
          name="郵便番号"
          rules="required|postCodeRegex:^[0-9]*$"
          label="PostCode"
          :value="postCode"
          @input="$emit('setPostCode', $event)"
        ></BaseTextField>
      </v-col>
      <v-col cols="9">
        <v-btn @click="$emit('search-address')">郵便番号から住所を検索</v-btn>
      </v-col>
    </v-row>

    <BaseTextField
      name="都道府県・市区町村・番地"
      rules="required"
      label="Prefectures/Municipality/HouseNumber"
      :value="mainAddress"
      @input="$emit('setPrefectures', $event)"
    ></BaseTextField>

    <BaseTextField
      name="建物・号室"
      label="Building/RoomNumber"
      :value="optionAddress"
      @input="$emit('setBuilding', $event)"
    ></BaseTextField>
  </div>
</template>

<script>
import "../plugins/veeValidate.js";
import config from "../config/const.js";
import TextFieldName from "../components/TextFieldName";
import BaseSelector from "../components/BaseSelector";
import BaseTextArea from "../components/BaseTextArea";
import BaseTextField from "../components/BaseTextField";

export default {
  components: {
    BaseSelector,
    TextFieldName,
    BaseTextArea,
    BaseTextField,
  },

  props: {
    name: {
      type: String,
    },
    area: {
      type: Number,
    },
    genre: {
      type: Number,
    },
    overview: {
      type: String,
    },
    postCode: {
      type: String,
    },
    mainAddress: {
      type: String,
    },
    optionAddress: {
      type: String,
    },
  },

  data() {
    return {
      areaOptions: config.areaOptions,
      genreOptions: config.genreOptions,
    };
  },
};
</script>
