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

export default {
  components: {
    FormLogin,
  },

  methods: {
    login(sendData) {
      authRepository
        .login("user", sendData)
        .then((response) => {
          // console.log(response.data);
          this.$store.dispatch("login", response.data);
        })
        .catch((e) => {
          this.$refs.formLogin.$refs.observer.setErrors(e.response.data.errors);
        });
    },
  },
};
</script>
