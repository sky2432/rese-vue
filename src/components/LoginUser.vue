<template>
  <FormLogin ref="formLogin" titleClass="amber" @login="login">
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
        })
        .catch((e) => {
          this.$refs.formLogin.$refs.observer.setErrors(e.response.data.errors);
        });
    },
  },
};
</script>
