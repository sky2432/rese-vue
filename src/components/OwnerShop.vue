<template>
  <div>
    <div class="wrapper" v-if="loading">
      <v-progress-circular color="amber" indeterminate></v-progress-circular>
    </div>
    <v-container class="py-4 px-6" fluid v-show="loaded">
      <v-card v-if="existsShop">
        <v-card-title class="amber">店舗情報</v-card-title>
        <v-hover>
          <template #default="{ hover }">
            <v-card elevation="0" tile>
              <v-img :src="shopImageUrl" height="400px"></v-img>
              <v-fade-transition>
                <v-overlay color="#036358" absolute v-if="hover">
                  <v-btn
                    color="amber white--text"
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
                <td class="table-data">{{ showArea }}</td>
              </tr>
              <tr>
                <th>ジャンル</th>
                <td class="table-data">{{ genreName }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <v-divider class="my-2"></v-divider>
        <v-subheader class="black--text">店舗概要</v-subheader>
        <v-card-text class="py-0">
          <p>{{ shopOverview }}</p>
        </v-card-text>
        <v-divider class="my-2"></v-divider>
        <v-subheader class="black--text">住所</v-subheader>
        <v-card-text class="py-0 mb-2">
          {{ showAddress }}
        </v-card-text>
        <div id="map" style="height:400px;width:100%;"></div>
        <v-card-actions class="justify-center">
          <v-btn color="amber white--text" @click="setShopData"
            >編集</v-btn
          >
        </v-card-actions>
      </v-card>

      <v-card v-if="!existsShop">
        <v-card-title class="amber">店舗情報の登録</v-card-title>
        <v-card-text class="mt-4">
          <validation-observer ref="addObserver" v-slot="{ invalid }">
            <v-form v-model="formValid">
              <FormShopInfo
                ref="createFormShopInfo"
                @send-create-data="openConfirmDialog"
              >
                <template #file
                  ><FileInputImage
                    :value="image"
                    @setImage="setImage"
                  ></FileInputImage>
                  <div v-if="imageUrl" class="text-center">
                    <v-subheader>プレビュー</v-subheader>
                    <img :src="imageUrl" width="50%" />
                  </div>
                </template>
              </FormShopInfo>

              <v-card-actions class="justify-center">
                <v-btn color="amber white--text" :disabled="invalid" @click="getCreateData">
                  確認
                </v-btn>
              </v-card-actions>
            </v-form>
          </validation-observer>
        </v-card-text>
      </v-card>
    </v-container>

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
      <template #title>店舗画像を変更しました</template>
    </BaseDialog>

    <v-dialog max-width="700px" v-model="updateDialog" persistent>
      <v-card :loading="updateLoading">
        <v-card-title class="amber">
          店舗情報の更新
          <v-spacer></v-spacer>
          <v-btn icon @click="closeUpdateDialog"
            ><v-icon>mdi-window-close</v-icon></v-btn
          >
        </v-card-title>
        <v-card-text class="mt-4">
          <validation-observer ref="editObserver" v-slot="{ invalid }">
            <v-form v-model="formValid">
              <FormShopInfo
                ref="updateFormShopInfo"
                v-bind="{
                  shopName: shopName,
                  shopGenreId: shopGenreId,
                  shopOverview: shopOverview,
                  shopPostalCode: shopPostalCode,
                  shopMainAddress: shopMainAddress,
                  shopOptionAddress: shopOptionAddress,
                }"
                @send-update-data="updateShop"
              ></FormShopInfo>
              <v-card-actions class="justify-center">
                <v-btn color="amber white--text" :disabled="invalid" @click="getUpdateData">
                  更新
                </v-btn>
              </v-card-actions>
            </v-form>
          </validation-observer>
        </v-card-text>
      </v-card>
    </v-dialog>

    <BaseDialog ref="updateBaseDialog">
      <template #title>店舗情報を変更しました</template>
    </BaseDialog>

    <DialogConfirm
      ref="dialogConfirm"
      :tableData="confirmDialogData"
      color="color: rgba(0, 0, 0, 0.6);"
      maxWidth="800px"
    >
      <template #title>店舗登録内容の確認</template>
      <template #additional>
        <v-divider class="my-2"></v-divider>
        <v-subheader class="black--text">店舗概要</v-subheader>
        <v-card-text class="py-0">
          {{ shopData.overview }}
        </v-card-text>
        <v-divider class="my-2"></v-divider>
        <v-subheader class="black--text">住所</v-subheader>
        <v-card-text class="py-0">
          {{ showConfirmAddress }}
        </v-card-text>
        <v-divider class="my-2"></v-divider>
        <div v-if="imageUrl" class="text-center">
          <v-subheader class="black--text">画像</v-subheader>
          <img :src="imageUrl" width="50%" />
        </div>
      </template>
      <template #actionButton
        ><v-btn color="amber white--text" @click="createShop"
          >登録</v-btn
        ></template
      >
    </DialogConfirm>

    <BaseDialog ref="addShopMessageDialog">
      <template #title>店舗を登録しました</template>
    </BaseDialog>
  </div>
</template>

<script>
import "../plugins/veeValidate.js";
import config from "../config/const.js";
import shopsRepository from "../repositories/shopsRepository.js";
import googleMapMixin from "../mixins/googleMapMixin.js";
import FileInputImage from "../components/FileInputImage";
import FormShopInfo from "../components/FormShopInfo";
import DialogConfirm from "../components/DialogConfirm";

export default {
  components: {
    FormShopInfo,
    FileInputImage,
    DialogConfirm,
  },

  mixins: [googleMapMixin],

  props: {
    shopId: {
      type: Number,
      require: true,
    },
    shopGenreId: {
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
    existsShop: {
      type: Boolean,
    },
    loading: {
      type: Boolean,
    },
    loaded: {
      type: Boolean,
    },
  },

  data() {
    return {
      image: null,
      imageUrl: "",
      formValid: false,
      updateDialog: false,
      imageDialog: false,
      updateLoading: false,
      imageLoading: false,
      genreOptions: config.genreOptions,
      confirmDialogData: [],
      shopData: "",
    };
  },

  //タブ切り替えの際に発火
  mounted() {
    let timer = setInterval(() => {
      if (window.google) {
        clearInterval(timer);
        if (this.existsShop === true && this.shopMainAddress) {
          //googleMapMixinのメソッド
          this.showGoogleMap();
        }
      }
    }, 500);
  },

  computed: {
    showArea() {
      if (this.shopMainAddress) {
        return this.shopMainAddress.substr(0, 3);
      }
      return "";
    },

    showAddress() {
      if (this.shopMainAddress) {
        const postalCode = this.$helpers.$_stringInsert(
          this.shopPostalCode,
          3,
          "-"
        );
        if (this.shopOptionAddress === null) {
          return `〒${postalCode} ${this.shopMainAddress}`;
        }
        return `〒${postalCode} ${this.shopMainAddress} ${this.shopOptionAddress}`;
      }
      return "";
    },

    showConfirmAddress() {
      if (
        this.shopData.option_address === undefined ||
        this.shopData.option_address === "none"
      ) {
        return this.shopData.postal_code + this.shopData.main_address;
      }
      return (
        this.shopData.postal_code +
        this.shopData.main_address +
        this.shopData.option_address
      );
    },

    //住所監視用のメソッド
    watchAddress() {
      return [
        this.shopPostalCode,
        this.shopMainAddress,
        this.shopOptionAddress,
      ];
    },
  },

  //住所が変更された際に発火
  watch: {
    watchAddress() {
      //googleMapMixinのメソッド
      this.showGoogleMap();
    },
  },

  methods: {
    openConfirmDialog(sendData) {
      this.shopData = sendData;
      this.createConfirmDialogData();
      this.$refs.dialogConfirm.openDialog();
    },

    createConfirmDialogData() {
      this.confirmDialogData = [
        {
          header: "店舗名",
          data: this.shopData.name,
        },
        {
          header: "ジャンル",
          data: config.genreOptions[this.shopData.genre_id - 1].state,
        },
      ];
    },

    getCreateData() {
      this.$refs.createFormShopInfo.sendCreateData();
    },

    async createShop() {
      this.$refs.dialogConfirm.startLoading();
      const formData = this.createFormData();
      await shopsRepository.createShop(formData);
      this.resetShopData();
      this.$emit("reload");
      this.$refs.dialogConfirm.stopLoading();
      this.$refs.addShopMessageDialog.openDialog();
      this.$refs.dialogConfirm.closeDialog();
    },

    createFormData() {
      const formData = new FormData();
      this.shopData["owner_id"] = this.$store.getters.user.id;
      if (this.shopData.option_address === undefined) {
        this.shopData.option_address = "none";
      }
      const data = JSON.stringify(this.shopData);

      formData.append("sendData", data);
      formData.append("image", this.image);

      return formData;
    },

    resetShopData() {
      this.image = null;
      this.imageUrl = "";
      this.$refs.addObserver.reset();
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
      let timer = setInterval(() => {
        if (this.$refs.updateFormShopInfo) {
          clearInterval(timer);
          this.$refs.updateFormShopInfo.setUpdateData();
        }
      }, 100);
    },

    getUpdateData() {
      this.$refs.updateFormShopInfo.sendUpdateData();
    },

    async updateShop(sendData) {
      this.updateLoading = true;
      await shopsRepository.updateShop(this.shopId, sendData);
      this.$emit("reload");
      this.updateDialog = false;
      this.updateLoading = false;
      this.$refs.updateBaseDialog.openDialog();
    },

    closeUpdateDialog() {
      this.updateDialog = false;
      this.postCode = this.mainAddress = this.optionAddress = "";
      this.$refs.editObserver.reset();
    },
  },
};
</script>

<style scoped>
.table-data {
  color: rgba(0, 0, 0, 0.6);
}
</style>
