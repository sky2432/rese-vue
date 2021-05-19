<template>
  <div>
    <v-card>
      <v-card-title class="amber">店舗情報</v-card-title>
      <v-img :src="shop.image_url" height="400px"></v-img>
      <v-simple-table>
        <template v-slot:default>
          <tbody>
            <tr>
              <th>店名</th>
              <td class="table-data">{{ shop.name }}</td>
            </tr>
            <tr>
              <th>エリア</th>
              <td class="table-data">{{ shop.area.name }}</td>
            </tr>
            <tr>
              <th>ジャンル</th>
              <td class="table-data">{{ shop.genre.name }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <v-subheader class="black--text">店舗概要</v-subheader>
      <v-card-text class="py-0">
        {{ shop.overview }}
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn color="amber" dark @click="dialog = true">編集</v-btn>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="dialog" max-width="700px">
      <v-card>
        <v-card-title class="amber">
          店舗情報の更新
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false"
            ><v-icon>mdi-window-close</v-icon></v-btn
          >
        </v-card-title>
        <v-card-text class="mt-4">
          <validation-observer ref="observer" v-slot="{ invalid }">
            <v-form v-model="formValid">
              <validation-provider
                v-slot="{ errors }"
                name="店名"
                rules="required|max:10"
              >
                <v-text-field
                  v-model="name"
                  :counter="10"
                  :error-messages="errors"
                  label="店名"
                  prepend-icon="mdi-account"
                  required
                ></v-text-field>
              </validation-provider>

              <validation-provider
                v-slot="{ errors }"
                name="エリア"
                rules="selectRequired"
              >
                <v-select
                  v-model="area"
                  :items="areaOptions"
                  item-text="state"
                  item-value="abbr"
                  :error-messages="errors"
                  label="エリア"
                  prepend-icon="mdi-email"
                  required
                ></v-select>
              </validation-provider>

              <validation-provider
                v-slot="{ errors }"
                name="ジャンル"
                rules="selectRequired"
              >
                <v-select
                  v-model="genre"
                  :items="genreOptions"
                  item-text="state"
                  item-value="abbr"
                  :error-messages="errors"
                  label="ジャンル"
                  prepend-icon="mdi-key"
                  required
                ></v-select>
              </validation-provider>

              <validation-provider
                v-slot="{ errors }"
                name="ジャンル"
                rules="required|max:255"
              >
                <v-textarea
                class="mt-4"
                  v-model="overview"
                  name="概要"
                  label="店舗概要"
                  counter="255"
                  :error-messages="errors"
                  outlined
                ></v-textarea>
              </validation-provider>

              <v-file-input
                accept="image/*"
                label="File input"
                chips
              ></v-file-input>

              <v-card-actions class="justify-center">
                <v-btn color="amber" :disabled="invalid">
                  更新
                </v-btn>
              </v-card-actions>
            </v-form>
          </validation-observer>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import config from "../config/const.js";

export default {
  props: {
    shopId: {
      type: Number,
      require: true,
    },
  },

  data() {
    return {
      formValid: false,
      dialog: false,
      name: "",
      area: "",
      genre: "",
      overview: "",
      areaOptions: config.areaOptions,
      genreOptions: config.genreOptions,
    };
  },

  computed: {
    ...mapGetters(["shop"]),
  },

  created() {
    this.getShopData();
  },

  methods: {
    getShopData() {
      this.name = this.shop.name;
      this.area = this.shop.area_id;
      this.genre = this.shop.genre_id;
      this.overview = this.shop.overview;
    },
  },
};
</script>

<style scoped>
.table-data {
  color: rgba(0, 0, 0, 0.6);
}
</style>
