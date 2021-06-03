<template>
  <v-main>
    <v-container class="py-4 px-6" fluid>
      <DataTable
        ref="dataTable"
        label="ID・名前・メールアドレスで検索"
        v-bind="{
          tableData: admins,
          headers: headers,
          loading: loading,
        }"
      >
        <template #title>
          管理者リスト
        </template>
        <template #addButton>
          <v-btn @click="registerDialog = true">
            管理者登録
          </v-btn>
        </template>
        <template #noData>管理者はいません</template>
        <template #noResults>検索条件に当てはまる管理者はいません</template>
      </DataTable>

      <v-dialog max-width="600" persistent v-model="registerDialog">
        <FormRegister ref="formRegister" @confirm="confirm">
          <template #title>AdminRegistration</template>
          <template #closeIcon>
            <v-spacer></v-spacer>
            <v-btn icon @click="closeRegisterDialog"
              ><v-icon>mdi-window-close</v-icon></v-btn
            ></template
          >
        </FormRegister>
      </v-dialog>

      <DialogConfirm
        ref="dialogConfirm"
        :tableData="confirmDialogData"
        cancellButtonText="修正"
      >
        <template #title>登録内容の確認</template>
        <template #actionButton
          ><v-btn color="amber" class="white--text" @click="register"
            >登録</v-btn
          ></template
        >
      </DialogConfirm>

      <BaseDialog ref="baseDialog">
        <template #message>管理者を登録しました</template>
      </BaseDialog>
    </v-container>
  </v-main>
</template>

<script>
import adminsRepository from "../repositories/adminsRepository";
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
      admins: [],
      registerDialog: false,
      loading: true,
      headers: [
        { text: "管理者ID", value: "id" },
        { text: "名前", value: "name" },
        { text: "メールアドレス", value: "email" },
      ],
      confirmDialogData: [],
      registerData: "",
    };
  },

  computed: {},

  created() {
    this.getAdmins();
  },

  methods: {
    async getAdmins() {
      const resData = await adminsRepository.getAdmins();
      this.admins = resData.data.data;
      this.loading = false;
    },

    closeRegisterDialog() {
      this.registerDialog = false;
      this.$refs.formRegister.resetData();
    },

    confirm(sendData) {
      adminsRepository
        .confirmAdmin(sendData)
        .then(() => {
          this.registerData = sendData;
          this.$refs.dialogConfirm.openDialog();
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
      this.$refs.dialogConfirm.startLoading();
      await adminsRepository.createAdmin(this.registerData);
      this.$refs.baseDialog.openDialog();
      this.getAdmins();
      this.$refs.dialogConfirm.closeDialog();
      this.registerDialog = false;
      this.$refs.dialogConfirm.stopLoading();
    },
  },
};
</script>
