<template>
  <div>
    <div
      class="wrapper"
      v-if="loading"
    >
      <v-progress-circular indeterminate color="amber"></v-progress-circular>
    </div>
    <div v-if="loaded">
      <v-row class="ma-0">
        <v-col cols="12" md="6" class="pl-0 pr-0 pr-md-3">
          <v-card>
            <v-hover>
              <template #default="{ hover }">
                <v-card elevation="0">
                  <v-img
                    class="image"
                    :src="shop.image_url"
                    height="370"
                  ></v-img>
                  <v-fade-transition>
                    <v-overlay color="#036358" absolute v-if="hover">
                      <v-btn color="amber white--text" @click="downloadImage"
                        >店舗画像をダウンロード</v-btn
                      >
                    </v-overlay>
                  </v-fade-transition>
                </v-card>
              </template>
            </v-hover>
          </v-card>
        </v-col>
        <v-col cols="12" md="6" class="pr-0 pl-0 pl-md-3">
          <v-card>
            <v-card-title class="amber">{{ shop.name }}</v-card-title>
            <v-card-text>
              <v-row class="mx-0 mt-5" align="center">
                <v-rating
                  :value="shop.evaluation"
                  color="amber"
                  size="14"
                  dense
                  half-increments
                  readonly
                ></v-rating>

                <div class="ml-1">
                  {{ shop.evaluation
                  }}<span class="grey--text ml-2"
                    >({{ shop.evaluation_count }}件)</span
                  >
                </div>
              </v-row>
              <p class="mt-5" v-if="shop">
                オーナー：{{ shop.owner.name }}<br />
                エリア：{{ $helpers.$_showArea(shop.main_address)
                }}<br />ジャンル：{{ shop.genre.name }}<br />住所：{{
                  showAddress
                }}
              </p>
              <p>
                {{ shop.overview }}
              </p>
            </v-card-text>
            <v-card-actions class="justify-center">
              <v-btn
                color="red white--text"
                @click="$refs.dialogWarning.openDialog()"
                >店舗削除</v-btn
              >
              <v-btn color="amber white--text" @click="moveOwnerDetail"
                >オーナー詳細</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-card>
        <div id="map"></div>
      </v-card>
    </div>

    <DialogWarning
      ref="dialogWarning"
      @open-dialog="$refs.dialogConfirmDeletionShop.openDialog()"
    ></DialogWarning>

    <BaseDialog ref="dialogConfirmDeletionShop" baseButtonText="キャンセル">
      <template #title>本当にこの店舗を削除しますか？</template>
      <template #leftButton>
        <v-btn color="red white--text" :disabled="isGuest" @click="deleteShop">
          削除
        </v-btn>
      </template>
      <template #baseButton>
        <v-btn color="amber white--text" @click="closeDeleteDialog">
          キャンセル
        </v-btn>
      </template>
    </BaseDialog>

    <BaseDialog
      ref="messageDialog"
      v-bind="{ body: true, persistent: true }"
      textClass="text-center"
    >
      <template #title>店舗を削除しました</template>
      <template #body>5秒後にも自動的にトップページへ戻ります</template>
      <template #baseButton>
        <v-btn color="amber white--text" @click="moveTopPage"
          >トップページへ戻る</v-btn
        >
      </template>
    </BaseDialog>
  </div>
</template>

<script>
import shopsRepository from "../repositories/shopsRepository.js";
import DialogWarning from "../components/DialogWarning";
import googleMapMixin from "../mixins/googleMapMixin.js";
import { mapGetters } from "vuex";

export default {
  components: {
    DialogWarning,
  },

  mixins: [googleMapMixin],

  props: {
    shopId: {
      type: Number,
    },
  },

  data() {
    return {
      shop: "",
      loading: true,
      loaded: false,
      warnDialog: false,
      timeoutId: "",
    };
  },

  computed: {
    ...mapGetters(["user", "role"]),

    isGuest() {
      return this.$helpers.$_isGuest(this.role);
    },

    showAddress() {
      if (this.shop) {
        const postalCode = this.$helpers.$_stringInsert(
          this.shop.postal_code,
          3,
          "-"
        );
        if (this.shop.option_address === null) {
          return `〒${postalCode} ${this.shop.main_address}`;
        }
        return `〒${postalCode} ${this.shop.main_address} ${this.shop.option_address}`;
      }
      return "";
    },
  },

  watch: {
    shop() {
      //googleMapMixinのメソッド
      this.showGoogleMap();
    },
  },

  created() {
    this.getShop();
  },

  activated() {
    if (this.shop.main_address) {
      this.showGoogleMap();
    }
  },

  methods: {
    async getShop() {
      const resData = await shopsRepository.getShop(this.shopId);
      this.shop = resData.data.data;
      this.loading = false;
      this.loaded = true;
    },

    async deleteShop() {
      this.$refs.dialogConfirmDeletionShop.startLoading();
      await shopsRepository.deleteShop(this.shopId);
      this.$refs.messageDialog.openDialog();
      this.$refs.dialogConfirmDeletionShop.stopLoading();
      this.closeDeleteDialog();
      this.timeoutId = setTimeout(this.moveTopPage, 5000);
    },

    closeDeleteDialog() {
      this.$refs.dialogWarning.closeDialog();
      this.$refs.dialogConfirmDeletionShop.closeDialog();
    },

    moveTopPage() {
      clearTimeout(this.timeoutId);
      this.$router.push("/admin");
    },

    async downloadImage() {
      const resData = await shopsRepository.downloadImage(this.shopId);
      if (resData.status === 200) {
        const fileURL = window.URL.createObjectURL(resData.data);
        const fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute("download", this.shop.name);
        document.body.appendChild(fileLink);
        fileLink.click();
      }
      if (resData.status === 204) {
        alert("こちらの店舗画像はダウンロードできません");
      }
    },

    moveOwnerDetail() {
      this.$helpers.$_movePageWithPram(
        "OwnerDetail",
        "ownerId",
        this.shop.owner.id
      );
    },
  },
};
</script>

<style scoped>
.wrapper {
  height: calc(var(--vh) * 100 - 136px);
}

.image {
  border-radius: 5px;
}

</style>
