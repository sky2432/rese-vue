<template>
  <v-container class="py-4 px-6" fluid>
    <DataTable
      ref="dataTable"
      label="ID・名前・メールアドレス・権限で検索"
      v-bind="{
        tableData: admins,
        headers: headers,
        loading: loading,

        role: true,
        deletion: true,
      }"
      @open-delete-dialog="openDeleteDialog"
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
    >
      <template #title>登録内容の確認</template>
      <template #actionButton
        ><v-btn color="amber white--text" @click="register"
          >登録</v-btn
        ></template
      >
    </DialogConfirm>

    <BaseDialog ref="addMessageDialog">
      <template #title>管理者を登録しました</template>
    </BaseDialog>

    <BaseDialog ref="deleteDialog" baseButtonText="キャンセル">
      <template #title>この管理者を削除しますか？</template>
      <template #leftButton>
        <v-btn color="red white--text" @click="deleteAdmin">
          削除
        </v-btn>
      </template>
    </BaseDialog>

    <BaseDialog ref="baseDialog">
      <template #title>管理者を削除しました</template>
    </BaseDialog>
  </v-container>
</template>

<script>
import adminsRepository from "../repositories/adminsRepository";
import DataTable from "../components/DataTable";
import DialogConfirm from "../components/DialogConfirm";
import FormRegister from "../components/FormRegister";
import { mapGetters } from "vuex";

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
      deleteId: "",
      deleteDialog: false,
      deleteLoading: false,
      headers: [
        { text: "管理者ID", value: "id" },
        { text: "名前", value: "name" },
        { text: "メールアドレス", value: "email" },
        { text: "権限", value: "role" },
        { text: "", value: "delete", sortable: false },
      ],
      confirmDialogData: [],
      registerData: "",
    };
  },

  computed: {
    ...mapGetters(["user"]),
  },

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
      this.getAdmins();
      this.$refs.dialogConfirm.stopLoading();
      this.$refs.addMessageDialog.openDialog();
      this.$refs.dialogConfirm.closeDialog();
      this.registerDialog = false;
    },

    openDeleteDialog(adminId) {
      this.$refs.deleteDialog.openDialog();
      this.deleteId = adminId;
    },

    async deleteAdmin() {
      this.$refs.deleteDialog.startLoading();
      await adminsRepository.deleteAdmin(this.deleteId);
      this.getAdmins();
      this.$refs.baseDialog.openDialog();
      this.$refs.deleteDialog.stopLoading();
      this.$refs.deleteDialog.closeDialog();
    },
  },
};
</script>
