<template>
  <div>
    <TheHeader></TheHeader>
    <v-main>
      <div class="wrapper">
        <RegisterForm ref="registerForm" @confirm="confirm">
          <template #title>Registration</template>
        </RegisterForm>

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
      </div>
    </v-main>
  </div>
</template>

<script>
import usersRepository from "../repositories/usersRepository.js";
import "../plugins/veeValidate.js";
import ConfirmDialog from "../components/ConfirmDialog";
import RegisterForm from "../components/RegisterForm";

export default {
  components: {
    ConfirmDialog,
    RegisterForm,
  },

  data() {
    return {
      confirmDialogData: [],
      registerData: "",
    };
  },

  methods: {
    confirm(sendData) {
      usersRepository
        .confirmUser(sendData)
        .then(() => {
          this.registerData = sendData;
          this.$refs.confirmDialog.openDialog();
          this.createConfirmDialogData();
        })
        .catch((e) => {
          this.$refs.registerForm.$refs.observer.setErrors(
            e.response.data.errors
          );
        });
    },

    createConfirmDialogData() {
      this.confirmDialogData = [
        { header: "Name", data: this.registerData.name },
        { header: "E-mail", data: this.registerData.email },
        { header: "Password", data: this.registerData.password },
      ];
    },

    async register() {
      this.$refs.confirmDialog.startLoading();
      await usersRepository.createUser(this.registerData);
      this.$router.replace("/thanks");
    },
  },
};
</script>
