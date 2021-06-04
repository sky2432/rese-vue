<template>
  <v-container class="py-4 px-6" fluid>
    <DataTable
      ref="dataTable"
      label="ID・名前・メールアドレスで検索"
      v-bind="{
        tableData: admins,
        headers: headers,
        loading: loading,
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

    <v-dialog max-width="500px" v-model="deleteDialog">
      <v-card :loading="deleteLoading">
        <v-card-title class="justify-center">
          この管理者を削除しますか？
        </v-card-title>
        <v-card-actions class="justify-center">
          <v-btn color="red lighten-1" class="white--text" @click="deleteUser">
            削除
          </v-btn>
          <v-btn
            color="amber"
            class="white--text"
            @click="deleteDialog = false"
          >
            キャンセル
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <BaseDialog ref="baseDialog">
      <template #message>管理者を削除しました</template>
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
      this.$refs.baseDialog.openDialog();
      this.getAdmins();
      this.$refs.dialogConfirm.closeDialog();
      this.registerDialog = false;
      this.$refs.dialogConfirm.stopLoading();
    },

    openDeleteDialog(adminId) {
      this.deleteDialog = true;
      this.deleteId = adminId;
    },

    async deleteUser() {
      this.deleteLoading = true;
      await adminsRepository.deleteAdmin(this.deleteId);
      this.$refs.baseDialog.openDialog();
      this.getAdmins();
      this.deleteDialog = false;
      this.deleteLoading = false;
    },
  },
};
</script>
