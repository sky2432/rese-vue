<template>
  <div>
    <div
      class="d-flex justify-center align-center"
      style="height: calc(100vh - 118px)"
      v-if="loading"
    >
      <v-progress-circular indeterminate color="amber"></v-progress-circular>
    </div>
    <div v-if="loaded">
      <v-row class="ma-0">
        <v-col cols="6" class="pl-0">
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
                      <v-btn
                        color="amber"
                        class="white--text"
                        @click="downloadImage"
                        >店舗画像をダウンロード</v-btn
                      >
                    </v-overlay>
                  </v-fade-transition>
                </v-card>
              </template>
            </v-hover>
          </v-card>
        </v-col>
        <v-col cols="6" class="pr-0">
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
                エリア：{{ shop.area.name }}<br />ジャンル：{{ shop.genre.name
                }}<br />住所：{{ shop.address }}
              </p>
              <p>
                {{ shop.overview }}
              </p>
            </v-card-text>
            <v-card-actions class="justify-center">
              <v-btn
                color="red"
                class="white--text"
                @click="$refs.dialogWarning.openDialog()"
                >店舗の削除</v-btn
              >
              <v-btn color="amber" class="white--text" @click="moveOwnerDetail"
                >オーナー詳細</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-card>
        <div ref="map" id="map" style="height:500px;width:100%;"></div>
      </v-card>
    </div>

    <DialogWarning
      ref="dialogWarning"
      @open-dialog="$refs.dialogConfirmDeletionShop.openDialog()"
    ></DialogWarning>

    <BaseDialog ref="dialogConfirmDeletionShop" baseButtonText="キャンセル">
      <template #title>本当に店舗を削除しますか？</template>
      <template #leftButton>
        <v-btn color="red lighten-1" class="white--text" @click="deleteShop">
          削除
        </v-btn>
      </template>
      <template #baseButton>
        <v-btn color="amber" class="white--text" @click="closeDeleteDialog">
          キャンセル
        </v-btn>
      </template>
    </BaseDialog>
  </div>
</template>

<script>
import shopsRepository from "../repositories/shopsRepository.js";
import DialogWarning from "../components/DialogWarning";

export default {
  components: {
    DialogWarning,
  },

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
    };
  },

  watch: {
    shop() {
      const geocoder = new google.maps.Geocoder();

      let timer = setInterval(() => {
        if (window.google) {
          clearInterval(timer);
          geocoder.geocode({ address: this.shop.address }, function(
            results,
            status
          ) {
            if (status === "OK" && results[0]) {
              const location = results[0].geometry.location;
              const map = new google.maps.Map(document.getElementById("map"), {
                center: location,
                zoom: 16,
              });
              const marker = new google.maps.Marker({
                position: location,
                map: map,
              });
              const infoWindow = new google.maps.InfoWindow({
                content: results[0].formatted_address,
                pixelOffset: new google.maps.Size(0, 5),
              });
              marker.addListener("click", function() {
                infoWindow.open(map, marker);
              });
            } else {
              alert("失敗しました。理由: " + status);
              return;
            }
          });
        }
      }, 500);
    },
  },

  created() {
    this.getShop();
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
      this.$refs.dialogConfirmDeletionShop.stopLoading();
      this.closeDeleteDialog();
      this.$router.push("/admin");
    },

    closeDeleteDialog() {
      this.$refs.dialogWarning.closeDialog();
      this.$refs.dialogConfirmDeletionShop.closeDialog();
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
.image {
  border-radius: 5px;
}
</style>
