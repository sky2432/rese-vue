<template>
  <v-container class="py-4 px-6" fluid>
    <v-card v-if="existsShop">
      <v-card-title class="amber">店舗情報</v-card-title>
      <v-hover>
        <template v-slot:default="{ hover }">
          <v-card tile elevation="0">
            <v-img :src="shopImageUrl" height="400px"></v-img>
            <v-fade-transition>
              <v-overlay v-if="hover" absol ute color="#036358">
                <v-btn color="amber" dark @click="showImageDialog"
                  >店舗画像の更新</v-btn
                >
              </v-overlay>
            </v-fade-transition>
          </v-card>
        </template>
      </v-hover>
      <v-simple-table>
        <template v-slot:default>
          <tbody>
            <tr>
              <th>店名</th>
              <td class="table-data">{{ shopName }}</td>
            </tr>
            <tr>
              <th>エリア</th>
              <td class="table-data">{{ areaName }}</td>
            </tr>
            <tr>
              <th>ジャンル</th>
              <td class="table-data">{{ genreName }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <v-subheader class="black--text">店舗概要</v-subheader>
      <v-card-text class="py-0">
        {{ shopOverview }}
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn color="amber" dark @click="insertShopData">編集</v-btn>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="imageDialog" max-width="700px">
      <v-card :loading="imageLoading">
        <v-card-title class="amber">
          店舗画像の更新
          <v-spacer></v-spacer>
          <v-btn icon @click="imageDialog = false"
            ><v-icon>mdi-window-close</v-icon></v-btn
          >
        </v-card-title>
        <v-card-text>
          <validation-observer ref="editImageObserver" v-slot="{ invalid }">
            <v-form>
              <validation-provider
                v-slot="{ errors }"
                ref="fileProvider"
                name="店舗画像"
                rules="selectRequired|image"
              >
                <v-file-input
                  v-model="image"
                  accept="image/*"
                  label="店舗画像を選択"
                  @change="showImagePreview"
                  :error-messages="errors"
                  chips
                ></v-file-input>
              </validation-provider>
              <div v-if="imageUrl" class="text-center">
                <v-subheader>プレビュー</v-subheader>
                <img :src="imageUrl" width="50%" />
              </div>
              <v-card-actions class="justify-center">
                <v-btn color="amber" :disabled="invalid" @click="updateImage">
                  更新
                </v-btn>
              </v-card-actions>
            </v-form>
          </validation-observer>
        </v-card-text>
      </v-card>
    </v-dialog>

    <BaseDialog ref="imageBaseDialog">
      <template #message>店舗画像を変更しました</template>
    </BaseDialog>

    <v-dialog v-model="updateDialog" max-width="700px">
      <v-card :loading="updateLoading">
        <v-card-title class="amber">
          店舗情報の更新
          <v-spacer></v-spacer>
          <v-btn icon @click="updateDialog = false"
            ><v-icon>mdi-window-close</v-icon></v-btn
          >
        </v-card-title>
        <v-card-text class="mt-4">
          <validation-observer ref="editObserver" v-slot="{ invalid }">
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
                  prepend-icon="mdi-store"
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
                  prepend-icon="mdi-map-marker"
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
                  prepend-icon="mdi-silverware-fork-knife"
                  required
                ></v-select>
              </validation-provider>

              <validation-provider
                v-slot="{ errors }"
                name="店舗概要"
                rules="required|max:255"
              >
                <v-textarea
                  class="mt-4"
                  v-model="overview"
                  name="概要"
                  label="店舗概要"
                  counter="255"
                  :error-messages="errors"
                  prepend-icon="mdi-storefront"
                  outlined
                ></v-textarea>
              </validation-provider>

              <v-card-actions class="justify-center">
                <v-btn color="amber" :disabled="invalid" @click="updateShop">
                  更新
                </v-btn>
              </v-card-actions>
            </v-form>
          </validation-observer>
        </v-card-text>
      </v-card>
    </v-dialog>

    <BaseDialog ref="updateBaseDialog">
      <template #message>店舗情報を変更しました</template>
    </BaseDialog>

    <v-card v-if="!existsShop">
      <v-card-title class="amber">
        店舗情報の登録
      </v-card-title>
      <v-card-text class="mt-4">
        <validation-observer ref="addObserver" v-slot="{ invalid }">
          <v-form v-model="formValid">
            <TextFieldName
              v-model="name"
              name="店名"
              label="Shop Name"
            ></TextFieldName>

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
                label="Area"
                prepend-icon="mdi-map-marker"
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
                label="Genre"
                prepend-icon="mdi-silverware-fork-knife"
                required
              ></v-select>
            </validation-provider>

            <validation-provider
              v-slot="{ errors }"
              name="店舗概要"
              rules="required|max:255"
            >
              <v-textarea
                class="mt-4"
                v-model="overview"
                name="概要"
                label="Overview"
                counter="255"
                :error-messages="errors"
                prepend-icon="mdi-storefront"
                outlined
              ></v-textarea>
            </validation-provider>

            <validation-provider
              v-slot="{ errors }"
              ref="fileProvider"
              name="店舗画像"
              rules="selectRequired|image"
            >
              <v-file-input
                v-model="image"
                accept="image/*"
                label="Select Image"
                @change="showImagePreview"
                :error-messages="errors"
                chips
              ></v-file-input>
            </validation-provider>

            <div v-if="imageUrl" class="text-center">
              <v-subheader>プレビュー</v-subheader>
              <img :src="imageUrl" width="50%" />
            </div>

            <v-card-actions class="justify-center">
              <v-btn color="amber" :disabled="invalid" @click="createShop">
                登録
              </v-btn>
            </v-card-actions>
          </v-form>
        </validation-observer>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import config from "../config/const.js";
import shopsRepository from "../repositories/shopsRepository.js";
import TextFieldName from "../components/TextFieldName";

export default {
  components: {
    TextFieldName,
  },

  props: {
    shopId: {
      type: Number,
      require: true,
    },
    areaId: {
      type: Number,
      require: true,
    },
    genreId: {
      type: Number,
      require: true,
    },
    shopName: {
      type: String,
      require: true,
    },
    areaName: {
      type: String,
      require: true,
    },
    genreName: {
      type: String,
      require: true,
    },
    shopOverview: {
      type: String,
      require: true,
    },
    shopImageUrl: {
      type: String,
      require: true,
    },
    existsShop: {
      type: Boolean,
      require: true,
    },
  },

  data() {
    return {
      name: "",
      area: "",
      genre: "",
      overview: "",
      image: null,
      imageUrl: "",
      formValid: false,
      updateDialog: false,
      imageDialog: false,
      updateLoading: false,
      imageLoading: false,
      areaOptions: config.areaOptions,
      genreOptions: config.genreOptions,
    };
  },

  computed: {
    ...mapGetters(["user"]),
  },

  methods: {
    async createShop() {
      const formData = new FormData();
      formData.append("image", this.image);
      const sendData = {
        name: this.name,
        owner_id: this.user.id,
        area_id: this.area,
        genre_id: this.genre,
        overview: this.overview,
      };
      const data = JSON.stringify(sendData);
      formData.append("sendData", data);
      await shopsRepository.createShop(formData);
      this.$emit("reload");
      this.resetShopData();
      this.$refs.addObserver.reset();
    },

    resetShopData() {
      this.name = "";
      this.area = "";
      this.genre = "";
      this.overview = "";
      this.image = null;
      this.imageUrl = "";
    },

    showImagePreview() {
      this.imageUrl = URL.createObjectURL(this.image);
    },

    showImageDialog() {
      this.imageDialog = true;
      if (this.image) {
        this.image = null;
        this.imageUrl = "";
        this.$refs.editImageObserver.reset();
      }
    },

    async updateImage() {
      this.imageLoading = true;
      const formData = new FormData();
      formData.append("image", this.image);
      await shopsRepository.updateImage(this.shopId, formData);
      this.$emit("reload");
      this.imageDialog = false;
      this.imageLoading = false;
      this.$refs.imageBaseDialog.openDialog();
    },

    insertShopData() {
      this.updateDialog = true;
      this.name = this.shopName;
      this.area = this.areaId;
      this.genre = this.genreId;
      this.overview = this.shopOverview;
    },

    async updateShop() {
      this.updateLoading = true;
      const sendData = {
        name: this.name,
        area_id: this.area,
        genre_id: this.genre,
        overview: this.overview,
      };
      await shopsRepository.updateShop(this.shopId, sendData);
      this.$emit("reload");
      this.updateDialog = false;
      this.updateLoading = false;
      this.$refs.updateBaseDialog.openDialog();
    },
  },
};
</script>

<style scoped>
.table-data {
  color: rgba(0, 0, 0, 0.6);
}
</style>
