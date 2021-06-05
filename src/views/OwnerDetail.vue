<template>
  <div>
    <TheHeader type="admin"></TheHeader>
    <div class="wrapper">
      <v-progress-circular
        color="amber"
        indeterminate
        v-if="loading"
      ></v-progress-circular>
      <v-main v-if="loaded">
        <v-container>
          <v-card>
            <v-card-text v-if="owner">
              <v-row>
                <v-col>
                  <v-subheader>オーナー情報</v-subheader>
                  <v-simple-table>
                    <template #default>
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
                    <template #default>
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
                    class="d-flex justify-center align-center"
                    style="height: 100%"
                    v-if="!owner.shop"
                  >
                    店舗はありません
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions class="justify-center">
              <v-btn
                color="red"
                class="white--text"
                @click="$refs.dialogWarning.openDialog()"
                >オーナー削除</v-btn
              >
              <v-btn
                color="amber"
                class="white--text"
                :disabled="!owner.shop"
                @click="moveShopDetail"
                >店舗詳細へ</v-btn
              >
            </v-card-actions>
          </v-card>

          <DialogWarning
            ref="dialogWarning"
            @open-dialog="$refs.dialogConfirmDeletionOwner.openDialog()"
          ></DialogWarning>

          <BaseDialog
            ref="dialogConfirmDeletionOwner"
            baseButtonText="キャンセル"
          >
            <template #title>本当にオーナーを削除しますか？</template>
            <template #leftButton>
              <v-btn
                color="red lighten-1"
                class="white--text"
                @click="deleteOwner"
              >
                削除
              </v-btn>
            </template>
            <template #baseButton>
              <v-btn
                color="amber"
                class="white--text"
                @click="closeDeleteDialog"
              >
                キャンセル
              </v-btn>
            </template>
          </BaseDialog>
        </v-container>
      </v-main>
    </div>
  </div>
</template>

<script>
import ownersRepository from "../repositories/ownersRepository.js";
import DialogWarning from "../components/DialogWarning";

export default {
  components: {
    DialogWarning,
  },

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
      this.$refs.dialogConfirmDeletionOwner.startLoading();
      await ownersRepository.deleteOwner(this.ownerId);
      this.$refs.dialogConfirmDeletionOwner.stopLoading();
      this.closeDeleteDialog();
      this.$router.push("/admin");
    },

    closeDeleteDialog() {
      this.$refs.dialogWarning.closeDialog();
      this.$refs.dialogConfirmDeletionOwner.closeDialog();
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
