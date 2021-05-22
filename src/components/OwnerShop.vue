<template>
  <v-main>
    <v-container class="py-4 px-6" fluid>
      <v-card v-if="existsShop">
        <v-card-title class="amber">店舗情報</v-card-title>
        <v-hover>
          <template v-slot:default="{ hover }">
            <v-card tile elevation="0">
              <v-img :src="shopImageUrl" height="400px"></v-img>
              <v-fade-transition>
                <v-overlay v-if="hover" absolute color="#036358">
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
          <v-btn color="red" dark @click="warnDialog = true">削除</v-btn>
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

      <MessageDialog ref="imageMessageDialog">
        <template #message>店舗画像を変更しました</template>
      </MessageDialog>

      <v-dialog v-model="editDialog" max-width="700px">
        <v-card :loading="updateLoading">
          <v-card-title class="amber">
            店舗情報の更新
            <v-spacer></v-spacer>
            <v-btn icon @click="editDialog = false"
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

      <MessageDialog ref="updateMessageDialog">
        <template #message>店舗情報を変更しました</template>
      </MessageDialog>

      <v-dialog v-model="warnDialog" width="500px">
        <v-card>
          <v-card-title class="amber"
            >※注意事項
            <v-spacer></v-spacer>
            <v-btn icon @click="warnDialog = false"
              ><v-icon>mdi-window-close</v-icon></v-btn
            >
          </v-card-title>
          <v-card-text class="mt-4">
            <v-alert prominent type="error" text class="text-center mb-0">
              <h3>必ずご確認ください</h3>
              <p>
                店舗を削除すると、これまでのデータはすべて削除されます。
              </p>
              <v-btn
                color="red lighten-1"
                class="mt-2"
                @click="showDialogConfirmDeletionShop = true"
                >店舗を削除</v-btn
              >
            </v-alert>
          </v-card-text>
        </v-card>
      </v-dialog>

      <v-dialog v-model="showDialogConfirmDeletionShop" max-width="500px">
        <v-card :loading="deleteLoading">
          <v-card-title class="justify-center">
            本当に店舗を削除しますか？
          </v-card-title>
          <v-card-actions class="justify-center">
            <v-btn color="red lighten-1" dark @click="deleteShop">
              削除
            </v-btn>
            <v-btn color="amber" dark @click="closeDeleteDialog">
              キャンセル
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <MessageDialog ref="deleteMessageDialog">
        <template #message>店舗を削除しました</template>
      </MessageDialog>

      <v-card v-if="!existsShop">
        <v-card-title class="amber">
          店舗情報の登録
        </v-card-title>
        <v-card-text class="mt-4">
          <validation-observer ref="addObserver" v-slot="{ invalid }">
            <v-form v-model="formValid">
              <validation-provider
                v-slot="{ errors }"
                name="店名"
                rules="required|min:2|max:10"
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
                <v-btn color="amber" :disabled="invalid" @click="createShop">
                  登録
                </v-btn>
              </v-card-actions>
            </v-form>
          </validation-observer>
        </v-card-text>
      </v-card>
    </v-container>
  </v-main>
</template>

<script>
import { mapGetters } from "vuex";
import config from "../config/const.js";
import shopsRepository from "../repositories/shopsRepository.js";
import MessageDialog from "../components/MessageDialog";

export default {
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

  components: {
    MessageDialog,
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
      editDialog: false,
      imageDialog: false,
      warnDialog: false,
      updateLoading: false,
      deleteLoading: false,
      imageLoading: false,
      showDialogConfirmDeletionShop: false,
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
      this.resetData();
      this.$refs.addObserver.reset();
    },

    resetData() {
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
      this.$refs.imageMessageDialog.changeShowMessageDialog();
    },

    insertShopData() {
      this.editDialog = true;
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
      this.editDialog = false;
      this.updateLoading = false;
      this.$refs.updateMessageDialog.changeShowMessageDialog();
    },

    async deleteShop() {
      this.deleteLoading = true;
      await shopsRepository.deleteShop(this.shopId);
      this.resetData();
      this.$emit("reload");
      this.$refs.deleteMessageDialog.changeShowMessageDialog();
      this.deleteLoading = false;
      this.showDialogConfirmDeletionShop = false;
      this.warnDialog = false;
    },

    closeDeleteDialog() {
      this.warnDialog = false;
      this.showDialogConfirmDeletionShop = false;
    },
  },
};
</script>

<style scoped>
.table-data {
  color: rgba(0, 0, 0, 0.6);
}
</style>
