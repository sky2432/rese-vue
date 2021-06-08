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
        <v-divider class="my-2"></v-divider>
        <v-subheader class="black--text">店舗概要</v-subheader>
        <v-card-text class="py-0">
          <p>{{ shopOverview }}</p>
        </v-card-text>
        <v-divider class="my-2"></v-divider>
        <v-card-actions class="justify-center">
          <v-btn color="amber" class="white--text" @click="setShopData"
            >編集</v-btn
          >
        </v-card-actions>
        <v-subheader class="black--text">住所</v-subheader>
        <v-card-text class="py-0 mb-2">
          {{ shopAddress }}
        </v-card-text>
        <div id="map" style="height:400px;width:100%;"></div>
        <v-card-actions class="justify-center mt-2">
          <v-btn
            color="amber"
            class="white--text"
            @click="$refs.updateAddressDialog.openDialog()"
            >住所の編集</v-btn
          >
        </v-card-actions>
      </v-card>

      <v-card v-if="!existsShop">
        <v-card-title class="amber">
          店舗情報の登録
        </v-card-title>
        <v-card-text class="mt-4">
          <validation-observer ref="addObserver" v-slot="{ invalid }">
            <v-form v-model="formValid">
              <FormShopInfo
                ref="createFormShopInfo"
                v-bind="{
                  shopName: name,
                  shopArea: area,
                  shopGenre: genre,
                  shopOverview: overview,
                  formAddress: true,
                }"
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
                <v-btn color="amber" :disabled="invalid" @click="getCreateData">
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
                  shopName: name,
                  shopArea: area,
                  shopGenre: genre,
                  shopOverview: overview,
                }"
                @send-update-data="updateShop"
              ></FormShopInfo>
              <v-card-actions class="justify-center">
                <v-btn color="amber" :disabled="invalid" @click="getUpdateData">
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

    <BaseDialog
      ref="updateAddressDialog"
      v-bind="{ body: true, persistent: true, closeIcon: true, button: false }"
      maxWidht="700px"
      titleClass="amber"
    >
      <template #title>店舗住所の更新</template>
      <template #closeIcon
        ><v-btn icon @click="closeUpdateAddressDialog"
          ><v-icon>mdi-window-close</v-icon></v-btn
        ></template
      >
      <template #body>
        <validation-observer ref="addressObserver" v-slot="{ invalid }">
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
          <v-card-actions class="justify-center">
            <v-btn
              class="white--text"
              color="amber"
              :disabled="invalid"
              @click="updateAddress"
              >更新</v-btn
            >
          </v-card-actions>
        </validation-observer>
      </template>
    </BaseDialog>

    <BaseDialog ref="messageUpdateAddressDialog">
      <template #title>店舗住所を変更しました</template>
    </BaseDialog>

    <DialogConfirm
      ref="dialogConfirm"
      cancellButtonText="修正"
      :tableData="confirmDialogData"
      color="color: rgba(0, 0, 0, 0.6);"
      maxWidth="800px"
    >
      <template #title>店舗登録内容の確認</template>
      <template #additional>
        <v-divider class="my-2"></v-divider>
        <v-subheader class="black--text">住所</v-subheader>
        <v-card-text class="py-0">
          {{ shopData.address }}
        </v-card-text>
        <v-divider class="my-2"></v-divider>
        <v-subheader class="black--text">店舗概要</v-subheader>
        <v-card-text class="py-0">
          {{ shopData.overview }}
        </v-card-text>
        <v-divider class="my-2"></v-divider>
        <div v-if="imageUrl" class="text-center">
          <v-subheader class="black--text">画像</v-subheader>
          <img :src="imageUrl" width="50%" />
        </div>
      </template>
      <template #actionButton
        ><v-btn color="amber" class="white--text" @click="createShop"
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
import { mapGetters } from "vuex";
import config from "../config/const.js";
import shopsRepository from "../repositories/shopsRepository.js";
import googleMapMixin from "../mixins/googleMapMixin.js";
import FileInputImage from "../components/FileInputImage";
import FormShopInfo from "../components/FormShopInfo";
import DialogConfirm from "../components/DialogConfirm";
import FormAddress from "../components/FormAddress";

export default {
  components: {
    FormShopInfo,
    FormAddress,
    FileInputImage,
    DialogConfirm,
  },

  mixins: [googleMapMixin],

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
    shopAddress: {
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
      name: "",
      area: null,
      genre: null,
      overview: "",
      postCode: "",
      mainAddress: "",
      optionAddress: "",
      image: null,
      imageUrl: "",
      formValid: false,
      updateDialog: false,
      imageDialog: false,
      updateLoading: false,
      imageLoading: false,
      areaOptions: config.areaOptions,
      genreOptions: config.genreOptions,
      confirmDialogData: [],
      shopData: "",
    };
  },

  computed: {
    ...mapGetters(["user"]),
  },

  //タブ移動の際に発火
  mounted() {
    let timer = setInterval(() => {
      if (window.google) {
        clearInterval(timer);
        if (this.existsShop === true) {
          //googleMapMixinのメソッド
          this.showGoogleMap();
        }
      }
    }, 500);
  },

  //住所が変更された際に発火
  watch: {
    shopAddress() {
      //googleMapMixinのメソッド
      this.showGoogleMap();
    },
  },

  methods: {
    closeUpdateAddressDialog() {
      this.$refs.updateAddressDialog.closeDialog();
      this.postCode = this.mainAddress = this.optionAddress = "";
      this.$refs.addressObserver.reset();
    },

    async updateAddress() {
      this.$refs.updateAddressDialog.startLoading();
      const sendData = {
        address: this.mainAddress + this.optionAddress,
      };
      await shopsRepository.updateAddress(this.shopId, sendData);
      this.$emit("reload");
      this.$refs.updateAddressDialog.stopLoading();
      this.$refs.updateAddressDialog.closeDialog();
      this.$refs.messageUpdateAddressDialog.openDialog();
    },

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
          header: "エリア",
          data: config.areaOptions[this.shopData.area_id - 1].state,
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
      const formData = new FormData();
      formData.append("image", this.image);
      this.shopData["owner_id"] = this.user.id;
      const data = JSON.stringify(this.shopData);
      formData.append("sendData", data);
      await shopsRepository.createShop(formData);
      this.resetShopData();
      this.$emit("reload");
      this.$refs.dialogConfirm.stopLoading();
      this.$refs.addShopMessageDialog.openDialog();
      this.$refs.dialogConfirm.closeDialog();
    },

    resetShopData() {
      this.name = "";
      this.area = null;
      this.genre = null;
      this.overview = "";
      this.image = null;
      this.imageUrl = "";
      this.postCode = "";
      this.mainAddress = "";
      this.optionAddress = "";
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
      this.name = this.shopName;
      this.area = this.areaId;
      this.genre = this.genreId;
      this.overview = this.shopOverview;
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
