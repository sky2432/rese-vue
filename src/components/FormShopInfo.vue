<template>
  <div>
    <TextFieldName
      name="店名"
      label="Shop Name"
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
  </div>
</template>

<script>
import "../plugins/veeValidate.js";
import config from "../config/const.js";
import TextFieldName from "../components/TextFieldName";
import BaseSelector from "../components/BaseSelector";
import BaseTextArea from "../components/BaseTextArea";

export default {
  components: {
    BaseSelector,
    TextFieldName,
    BaseTextArea,
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
  },

  data() {
    return {
      areaOptions: config.areaOptions,
      genreOptions: config.genreOptions,
    };
  },
};
</script>
