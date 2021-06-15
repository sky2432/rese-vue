<template>
  <div>
    <FormLogin ref="formLogin" titleClass="red lighten-1" @login="login">
      <template #title>OwnerLogin</template>
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
        .login("owner", sendData)
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
