<template>
  <div>
    <FormLogin ref="formLogin" @login="login">
      <template #title>UserLogin</template>
    </FormLogin>
  </div>
</template>

<script>
import authRepository from "../repositories/authRepository";
import FormLogin from "../components/FormLogin";
import Repository from "../repositories/Repository";

export default {
  components: {
    FormLogin,
  },

  methods: {
    login(sendData) {
      authRepository
        .login("user", sendData)
        .then((response) => {
          const resData = response.data;
          Repository.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${resData.token}`;
          this.$store.dispatch("login", resData);
        })
        .catch((e) => {
          this.$refs.formLogin.$refs.observer.setErrors(e.response.data.errors);
        });
    },
  },
};
</script>
