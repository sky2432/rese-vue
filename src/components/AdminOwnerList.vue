<template>
  <v-main>
    <v-container class="py-4 px-6" fluid>
      <DataTable
        ref="dataTable"
        label="ID・名前・メールアドレス・店舗名で検索"
        v-bind="{
          tableData: owners,
          headers: headers,
          loading: loading,
          detail: true,
        }"
        @move-page="moveOwnerDetail"
      >
        <template #title>
          オーナーリスト
        </template>
        <template #addButton>
          <v-btn @click="openRegisterDialog">
            オーナー登録
          </v-btn>
        </template>
        <template #noData>オーナーはいません</template>
        <template #noResults>検索条件に当てはまるオーナーはいません</template>
      </DataTable>

      <v-dialog v-model="registerDialog" max-width="600" persistent>
        <v-card class="white pa-5" elevation="2" outlined shaped tile>
          <v-card-title>
            OwnerRegistration
            <v-spacer></v-spacer>
            <v-btn icon @click="registerDialog = false"
              ><v-icon>mdi-window-close</v-icon></v-btn
            >
          </v-card-title>
          <v-card-text>
            <validation-observer ref="observer" v-slot="{ invalid }">
              <v-form v-model="formValid">
                <validation-provider
                  v-slot="{ errors }"
                  name="名前"
                  rules="required|max:10"
                  vid="name"
                >
                  <v-text-field
                    v-model="name"
                    :counter="10"
                    :error-messages="errors"
                    label="Name"
                    prepend-icon="mdi-account"
                    required
                  ></v-text-field>
                </validation-provider>

                <validation-provider
                  v-slot="{ errors }"
                  name="メールアドレス"
                  rules="required|email"
                  vid="email"
                >
                  <v-text-field
                    v-model="email"
                    :error-messages="errors"
                    label="E-mail"
                    prepend-icon="mdi-email"
                    required
                  ></v-text-field>
                </validation-provider>

                <validation-provider
                  v-slot="{ errors }"
                  name="パスワード"
                  rules="required|min:4"
                  vid="password"
                >
                  <v-text-field
                    v-model="password"
                    :error-messages="errors"
                    label="Password"
                    :type="showPassword ? 'text' : 'password'"
                    :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append="showPassword = !showPassword"
                    prepend-icon="mdi-key"
                    required
                  ></v-text-field>
                </validation-provider>

                <v-card-actions class="justify-center">
                  <v-btn color="amber" :disabled="invalid" @click="confirm">
                    確認
                  </v-btn>
                </v-card-actions>
              </v-form>
            </validation-observer>
          </v-card-text>
        </v-card>
      </v-dialog>

      <ConfirmDialog
        ref="confirmDialog"
        :tableData="confirmDialogData"
        cancellButtonText="修正"
      >
        <template #title>登録内容の確認</template>
        <template #actionButton
          ><v-btn color="amber" dark @click="register">登録</v-btn></template
        >
      </ConfirmDialog>

      <MessageDialog ref="messageDialog">
        <template #message>店舗代表者を登録しました</template>
      </MessageDialog>
    </v-container>
  </v-main>
</template>

<script>
import ownersRepository from "../repositories/ownersRepository.js";
import MessageDialog from "../components/MessageDialog";
import DataTable from "../components/DataTable";
import ConfirmDialog from "../components/ConfirmDialog";

export default {
  components: {
    MessageDialog,
    DataTable,
    ConfirmDialog,
  },

  data() {
    return {
      owners: [],
      name: "",
      email: "",
      password: "",
      loading: true,
      registerDialog: false,
      formValid: false,
      showPassword: false,
      headers: [
        { text: "オーナーID", value: "id" },
        { text: "名前", value: "name" },
        { text: "メールアドレス", value: "email" },
        { text: "店舗名", value: "shop.name" },
        { text: "", value: "detail" },
      ],
      confirmDialogData: [],
    };
  },

  computed: {},

  created() {
    this.getOwners();
  },

  methods: {
    async getOwners() {
      const resData = await ownersRepository.getOwners();
      this.owners = resData.data.data;
      this.loading = false;
    },

    openRegisterDialog() {
      this.registerDialog = true;
      this.resetData();
    },

    resetData() {
      this.name = "";
      this.email = "";
      this.password = "";
      this.$refs.observer.reset();
    },

    confirm() {
      const sendData = {
        name: this.name,
        email: this.email,
        password: this.password,
      };
      ownersRepository
        .confirmOwner(sendData)
        .then(() => {
          this.$refs.confirmDialog.openDialog();
          this.createConfirmDialogData();
        })
        .catch((e) => {
          this.$refs.observer.setErrors(e.response.data.errors);
        });
    },

    createConfirmDialogData() {
      this.confirmDialogData = [
        { header: "Name", data: this.name },
        { header: "E-mail", data: this.email },
        { header: "Password", data: this.password },
      ];
    },

    async register() {
      this.$refs.confirmDialog.startLoading();

      const sendData = {
        name: this.name,
        email: this.email,
        password: this.password,
      };
      await ownersRepository.createOwner(sendData);
      this.$refs.messageDialog.openDialog();
      this.getOwners();
      this.$refs.confirmDialog.closeDialog();
      this.registerDialog = false;
      this.$refs.confirmDialog.stopLoading();
    },

    moveOwnerDetail(ownerId) {
      this.$helpers.$_movePageWithPram("OwnerDetail", "ownerId", ownerId);
    },
  },
};
</script>
