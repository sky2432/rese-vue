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
          <v-btn @click="registerDialog = true">
            オーナー登録
          </v-btn>
        </template>
        <template #noData>オーナーはいません</template>
        <template #noResults>検索条件に当てはまるオーナーはいません</template>
      </DataTable>

      <v-dialog max-width="600" persistent v-model="registerDialog">
        <FormRegister ref="formRegister" @confirm="confirm">
          <template #title>OwnerRegistration</template>
          <template #closeIcon>
            <v-spacer></v-spacer>
            <v-btn icon @click="closeRegisterDialog"
              ><v-icon>mdi-window-close</v-icon></v-btn
            ></template
          >
        </FormRegister>
      </v-dialog>

      <DialogConfirm
        ref="DialogConfirm"
        :tableData="confirmDialogData"
        cancellButtonText="修正"
      >
        <template #title>登録内容の確認</template>
        <template #actionButton
          ><v-btn color="amber" dark @click="register">登録</v-btn></template
        >
      </DialogConfirm>

      <BaseDialog ref="baseDialog">
        <template #message>店舗代表者を登録しました</template>
      </BaseDialog>
    </v-container>
  </v-main>
</template>

<script>
import ownersRepository from "../repositories/ownersRepository.js";
import DataTable from "../components/DataTable";
import DialogConfirm from "../components/DialogConfirm";
import FormRegister from "../components/FormRegister";

export default {
  components: {
    DataTable,
    DialogConfirm,
    FormRegister,
  },

  data() {
    return {
      owners: [],
      registerDialog: false,
      loading: true,
      headers: [
        { text: "オーナーID", value: "id" },
        { text: "名前", value: "name" },
        { text: "メールアドレス", value: "email" },
        { text: "店舗名", value: "shop.name" },
        { text: "", value: "detail", sortable: false },
      ],
      confirmDialogData: [],
      registerData: "",
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

    closeRegisterDialog() {
      this.registerDialog = false;
      this.$refs.formRegister.resetData();
    },

    confirm(sendData) {
      ownersRepository
        .confirmOwner(sendData)
        .then(() => {
          this.registerData = sendData;
          this.$refs.DialogConfirm.openDialog();
          this.createConfirmDialogData();
        })
        .catch((e) => {
          this.$refs.formRegister.$refs.observer.setErrors(
            e.response.data.errors
          );
        });
    },

    createConfirmDialogData() {
      this.confirmDialogData = this.$helpers.$_createDataConfirmRegistration(
        this.registerData.name,
        this.registerData.email
      );
    },

    async register() {
      this.$refs.DialogConfirm.startLoading();
      await ownersRepository.createOwner(this.registerData);
      this.$refs.baseDialog.openDialog();
      this.getOwners();
      this.$refs.DialogConfirm.closeDialog();
      this.registerDialog = false;
      this.$refs.DialogConfirm.stopLoading();
    },

    moveOwnerDetail(ownerId) {
      this.$helpers.$_movePageWithPram("OwnerDetail", "ownerId", ownerId);
    },
  },
};
</script>
