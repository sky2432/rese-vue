<template>
  <div>
    <TheHeader></TheHeader>
    <v-main>
      <div class="wrapper">
        <FormRegister ref="formRegister" @confirm="confirm">
          <template #title>Registration</template>
        </FormRegister>

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
import FormRegister from "../components/FormRegister";

export default {
  components: {
    ConfirmDialog,
    FormRegister,
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
      this.$refs.confirmDialog.startLoading();
      await usersRepository.createUser(this.registerData);
      this.$router.replace("/thanks");
    },
  },
};
</script>
