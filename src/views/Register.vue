<template>
  <div>
    <TheHeader></TheHeader>
    <v-main>
      <div class="wrapper">
        <FormRegister ref="formRegister" @confirm="confirm">
          <template #title>Registration</template>
        </FormRegister>

        <DialogConfirm
          ref="DialogConfirm"
          :tableData="confirmDialogData"
          cancellButtonText="修正"
        >
          <template #title>登録内容の確認</template>
          <template #actionButton
            ><v-btn color="amber" class="white--text" @click="register">登録</v-btn></template
          >
        </DialogConfirm>
      </div>
    </v-main>
  </div>
</template>

<script>
import usersRepository from "../repositories/usersRepository.js";
import "../plugins/veeValidate.js";
import DialogConfirm from "../components/DialogConfirm";
import FormRegister from "../components/FormRegister";

export default {
  components: {
    DialogConfirm,
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
      await usersRepository.createUser(this.registerData);
      this.$router.replace("/thanks");
    },
  },
};
</script>
