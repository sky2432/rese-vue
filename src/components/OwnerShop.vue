<template>
  <v-container class="py-4 px-6" fluid>
    <v-card v-if="existsShop">
      <v-card-title class="amber">店舗情報</v-card-title>
      <v-hover>
        <template #default="{ hover }">
          <v-card elevation="0" tile>
            <v-img :src="shopImageUrl" height="400px"></v-img>
            <v-fade-transition>
              <v-overlay color="#036358" absolute v-if="hover">
                <v-btn
                  color="amber"
                  class="white--text"
                  @click="showImageDialog"
                  >店舗画像の更新</v-btn
                >
              </v-overlay>
            </v-fade-transition>
          </v-card>
        </template>
      </v-hover>
      <v-simple-table>
        <template #default>
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
        <v-btn color="amber" class="white--text" @click="setShopData"
          >編集</v-btn
        >
      </v-card-actions>
    </v-card>

    <v-dialog max-width="700px" v-model="imageDialog">
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
              <FileInputImage
                :value="image"
                @setImage="setImage"
              ></FileInputImage>

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

    <v-dialog max-width="700px" v-model="updateDialog">
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
              <FormShopInfo
                v-bind="{
                  name: name,
                  area: area,
                  genre: genre,
                  overview: overview,
                }"
                @setName="name = $event"
                @setArea="area = $event"
                @setGenre="genre = $event"
                @setOverview="overview = $event"
              ></FormShopInfo>

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
            <FormShopInfo
              v-bind="{
                name: name,
                area: area,
                genre: genre,
                overview: overview,
              }"
              @setName="name = $event"
              @setArea="area = $event"
              @setGenre="genre = $event"
              @setOverview="overview = $event"
            ></FormShopInfo>

            <FileInputImage
              :value="image"
              @setImage="setImage"
            ></FileInputImage>

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
import "../plugins/veeValidate.js";
import { mapGetters } from "vuex";
import config from "../config/const.js";
import shopsRepository from "../repositories/shopsRepository.js";
import FileInputImage from "../components/FileInputImage";
import FormShopInfo from "../components/FormShopInfo";

export default {
  components: {
    FileInputImage,
    FormShopInfo,
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
      area: null,
      genre: null,
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
      this.area = null;
      this.genre = null;
      this.overview = "";
      this.image = null;
      this.imageUrl = "";
    },

    showImageDialog() {
      this.imageDialog = true;
      if (this.image) {
        this.image = null;
        this.imageUrl = "";
        this.$refs.editImageObserver.reset();
      }
    },

    setImage(event) {
      this.image = event;
      this.showImagePreview();
    },

    showImagePreview() {
      if (this.image) {
        this.imageUrl = URL.createObjectURL(this.image);
      }
      if (!this.image) {
        this.imageUrl = "";
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

    setShopData() {
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
