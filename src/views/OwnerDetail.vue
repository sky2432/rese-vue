<template>
  <div>
    <TheHeader></TheHeader>
    <div class="wrapper">
      <v-progress-circular indeterminate color="amber" v-if="loading"></v-progress-circular>
      <v-main v-if="loaded">
        <v-container>
          <v-card>
            <v-card-text v-if="owner">
              <v-row>
                <v-col>
                  <v-subheader>オーナー情報</v-subheader>
                  <v-simple-table>
                    <template v-slot:default>
                      <tbody>
                        <tr>
                          <th>ID</th>
                          <td>{{ owner.id }}</td>
                        </tr>
                        <tr>
                          <th>名前</th>
                          <td>{{ owner.name }}</td>
                        </tr>
                        <tr>
                          <th>メールアドレス</th>
                          <td>{{ owner.email }}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-col>
                <v-col>
                  <v-subheader>店舗情報</v-subheader>
                  <v-simple-table v-if="owner.shop">
                    <template v-slot:default>
                      <tbody>
                        <tr>
                          <th>店舗ID</th>
                          <td>{{ owner.shop.id }}</td>
                        </tr>
                        <tr>
                          <th>店舗名</th>
                          <td>{{ owner.shop.name }}</td>
                        </tr>
                        <tr>
                          <th>エリア</th>
                          <td>{{ owner.shop.area.name }}</td>
                        </tr>
                        <tr>
                          <th>ジャンル</th>
                          <td>{{ owner.shop.genre.name }}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                  <div
                    v-if="!owner.shop"
                    style="height: 100%"
                    class="d-flex justify-center align-center"
                  >
                    店舗はありません
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions class="justify-center">
              <v-btn color="red" dark @click="warnDialog = true"
                >オーナー削除</v-btn
              >
              <v-btn
                color="amber"
                dark
                :disabled="!owner.shop"
                @click="moveShopDetail"
                >店舗詳細へ</v-btn
              >
            </v-card-actions>
          </v-card>

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
                    オーナーを削除すると、オーナーが所有する店舗、店舗関連情報全てが削除されます
                  </p>
                  <v-btn
                    color="red lighten-1"
                    class="mt-2"
                    @click="dialogConfirmDeletionShop = true"
                    >オーナーを削除</v-btn
                  >
                </v-alert>
              </v-card-text>
            </v-card>
          </v-dialog>

          <v-dialog v-model="dialogConfirmDeletionShop" max-width="500px">
            <v-card :loading="deleteLoading">
              <v-card-title class="justify-center">
                本当にオーナーを削除しますか？
              </v-card-title>
              <v-card-actions class="justify-center">
                <v-btn color="red lighten-1" dark @click="deleteOwner">
                  削除
                </v-btn>
                <v-btn color="amber" dark @click="closeDeleteDialog">
                  キャンセル
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-container>
      </v-main>
    </div>
  </div>
</template>

<script>
import ownersRepository from "../repositories/ownersRepository.js";

export default {
  components: {},

  props: {
    ownerId: {
      type: Number,
      require: true,
    },
  },

  data() {
    return {
      owner: "",
      warnDialog: false,
      dialogConfirmDeletionShop: false,
      deleteLoading: false,
      loading: true,
      loaded: false,
    };
  },

  created() {
    this.getOwner();
  },

  methods: {
    async getOwner() {
      const resData = await ownersRepository.getOwner(this.ownerId);
      this.owner = resData.data.data;
      this.loading = false;
      this.loaded = true;
    },

    async deleteOwner() {
      this.deleteLoading = true;
      await ownersRepository.deleteOwner(this.ownerId);
      this.deleteLoading = false;
      this.dialogConfirmDeletionShop = false;
      this.warnDialog = false;
      this.$router.push("/admin");
    },

    closeDeleteDialog() {
      this.warnDialog = false;
      this.dialogConfirmDeletionShop = false;
    },

    moveShopDetail() {
      this.$helpers.$_movePageWithPram(
        "ShopDetail",
        "shopId",
        this.owner.shop.id
      );
    },
  },
};
</script>
