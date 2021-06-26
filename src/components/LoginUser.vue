<template>
  <FormLogin
    ref="formLogin"
    titleClass="amber"
    @login="login"
    @guest-login="guestUserLogin"
  >
    <template #title>UserLogin</template>
  </FormLogin>
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
        .login("user", sendData)
        .then((response) => {
          this.$store.dispatch("login", response.data);
          this.stopLoginLoading();
        })
        .catch((e) => {
          this.$refs.formLogin.$refs.observer.setErrors(e.response.data.errors);
          this.stopLoginLoading();
        });
    },

    guestUserLogin() {
      const sendData = {
        email: "guest@user.com",
        password: 1234,
      };
      authRepository.login("user", sendData).then((response) => {
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
