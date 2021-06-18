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
                          <td>
                            {{ $helpers.$_showArea(owner.shop.main_address) }}
                          </td>
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
                color="red white--text"
                @click="$refs.dialogWarning.openDialog()"
                >オーナー削除</v-btn
              >
              <v-btn
                color="amber white--text"
                :disabled="!owner.shop"
                @click="moveShopDetail"
                >店舗詳細</v-btn
              >
            </v-card-actions>
          </v-card>

          <DialogWarning
            ref="dialogWarning"
            @open-dialog="$refs.dialogConfirmDeletionOwner.openDialog()"
          >
            <template #message
              >オーナーを削除すると、オーナーが所有する店舗、その店舗に関連する全ての情報が削除されます。</template
            >
            <template #buttonText>オーナーを削除</template>
          </DialogWarning>

          <BaseDialog
            ref="dialogConfirmDeletionOwner"
            baseButtonText="キャンセル"
          >
            <template #title>本当にこのオーナーを削除しますか？</template>
            <template #leftButton>
              <v-btn color="red white--text" @click="deleteOwner">
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
            <template #title>オーナーを削除しました</template>
            <template #body>5秒後にも自動的にトップページへ戻ります</template>
            <template #baseButton>
              <v-btn color="amber white--text" @click="moveTopPage"
                >トップページへ戻る</v-btn
              >
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
      timeoutId: "",
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
      this.$refs.messageDialog.openDialog();
      this.$refs.dialogConfirmDeletionOwner.stopLoading();
      this.closeDeleteDialog();
      this.timeoutId = setTimeout(this.moveTopPage, 5000);
    },

    closeDeleteDialog() {
      this.$refs.dialogWarning.closeDialog();
      this.$refs.dialogConfirmDeletionOwner.closeDialog();
    },

    moveTopPage() {
      this.$router.push("/admin");
      clearTimeout(this.timeoutId);
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

<style scoped>
.theme--light.v-data-table
  > .v-data-table__wrapper
  > table
  > tbody
  > tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
  background-color: white;
}
</style>
