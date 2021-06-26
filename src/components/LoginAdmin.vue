<template>
  <div>
    <FormLogin
      ref="formLogin"
      titleClass="purple lighten-2"
      @login="login"
      @guest-login="guestAdminLogin"
    >
      <template #title>AdminLogin</template>
    </FormLogin>
  </div>
</template>

<script>
import authRepository from "../repositories/authRepository";
import FormLogin from "../components/FormLogin";

export default {
  components: {
    FormLogin,
  },

  methods: {
    login(sendData) {
      authRepository
        .login("admin", sendData)
        .then((response) => {
          this.$store.dispatch("login", response.data);
          this.stopLoginLoading();
        })
        .catch((e) => {
          this.$refs.formLogin.$refs.observer.setErrors(e.response.data.errors);
          this.stopLoginLoading();
        });
    },

    guestAdminLogin() {
      const sendData = {
        email: "guest@admin.com",
        password: 1234,
      };
      authRepository.login("admin", sendData).then((response) => {
        this.$store.dispatch("login", response.data);
        this.stopLoginLoading();
      });
    },

    stopLoginLoading() {
      this.$refs.formLogin.stopLoading();
    },
  },
};
</script>
