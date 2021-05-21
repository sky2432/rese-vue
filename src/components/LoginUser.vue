<template>
  <div>
    <LoginForm ref="loginForm" @login="login">
      <template #title>UserLogin</template>
    </LoginForm>
  </div>
</template>

<script>
import authRepository from "../repositories/authRepository";
import LoginForm from "../components/LoginForm";

export default {
  components: {
    LoginForm,
  },

  methods: {
    login(sendData) {
      authRepository
        .login('user', sendData)
        .then((response) => {
          this.$store.dispatch("login", response.data);
        })
        .catch((e) => {
          this.$refs.loginForm.$refs.observer.setErrors(e.response.data.errors);
        });
    },
  },
};
</script>
