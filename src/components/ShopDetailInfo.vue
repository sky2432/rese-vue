<template>
  <div>
    <v-card tile height="400px">
      <div
        class="d-flex justify-center align-center"
        style="height: 100%"
        v-if="loading"
      >
        <v-progress-circular indeterminate color="amber"></v-progress-circular>
      </div>
      <v-row class="ma-0" v-if="loaded">
        <v-col cols="6">
          <v-img :src="shop.image_url" height="370"></v-img>
        </v-col>
        <v-col cols="6">
          <v-card elevation="0" tile>
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
                エリア：{{ shop.area.name }}<br />ジャンル：{{
                  shop.genre.name
                }}
              </p>
              <p>
                {{ shop.overview }}
              </p>
            </v-card-text>
            <v-card-actions class="justify-center">
              <v-btn color="red" class="white--text" @click="warnDialog = true"
                >店舗の削除</v-btn
              >
              <v-btn color="amber" class="white--text" @click="moveOwnerDetail"
                >オーナー詳細</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-card>

    <v-dialog width="500px" v-model="warnDialog">
      <v-card>
        <v-card-title class="amber"
          >※注意事項
          <v-spacer></v-spacer>
          <v-btn icon @click="warnDialog = false"
            ><v-icon>mdi-window-close</v-icon></v-btn
          >
        </v-card-title>
        <v-card-text class="mt-4">
          <v-alert class="text-center mb-0" type="error" prominent text>
            <h3>必ずご確認ください</h3>
            <p>
              店舗を削除すると、店舗に関係する全ての情報が削除されます。
            </p>
            <v-btn
              class="mt-2"
              color="red lighten-1"
              @click="$refs.dialogConfirmDeletionShop.openDialog()"
              >店舗を削除</v-btn
            >
          </v-alert>
        </v-card-text>
      </v-card>
    </v-dialog>

    <BaseDialog ref="dialogConfirmDeletionShop" baseButtonText="キャンセル">
      <template #message>本当に店舗を削除しますか？</template>
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

export default {
  components: {},

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
      this.$refs.dialogConfirmDeletionShop.closeDialog();
      this.warnDialog = false;
      this.$router.push("/admin");
    },

    closeDeleteDialog() {
      this.warnDialog = false;
      this.$refs.dialogConfirmDeletionShop.closeDialog();
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

<style></style>
