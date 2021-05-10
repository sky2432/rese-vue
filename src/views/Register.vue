<template>
  <div>
    <TheHeader></TheHeader>

    <v-main>
      <div class="wrapper">
        <v-card
          class="white pa-5"
          elevation="2"
          outlined
          shaped
          tile
          width="600px"
        >
          <v-card-title>
            Registration
          </v-card-title>
          <v-card-text>
            <validation-observer ref="observer" v-slot="{ invalid }">
              <v-form v-model="valid">
                <validation-provider
                  v-slot="{ errors }"
                  name="Name"
                  rules="required|max:10"
                >
                  <v-text-field
                    v-model="name"
                    :counter="10"
                    :error-messages="errors"
                    label="Name"
                    prepend-icon="mdi-account"
                    required
                  ></v-text-field>
                </validation-provider>

                <validation-provider
                  v-slot="{ errors }"
                  name="E-mail"
                  rules="required|email"
                >
                  <v-text-field
                    v-model="email"
                    :error-messages="errors"
                    label="E-mail"
                    prepend-icon="mdi-email"
                    required
                  ></v-text-field>
                </validation-provider>

                <validation-provider
                  v-slot="{ errors }"
                  name="Password"
                  rules="required|min:4"
                >
                  <v-text-field
                    v-model="password"
                    :error-messages="errors"
                    label="Password"
                    :type="showPassword ? 'text' : 'password'"
                    :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append="showPassword = !showPassword"
                    prepend-icon="mdi-key"
                    required
                  ></v-text-field>
                </validation-provider>

                <div style="text-align: center">
                  <v-btn color="amber" :disabled="invalid" @click="register">
                    登録
                  </v-btn>
                </div>
              </v-form>
            </validation-observer>
          </v-card-text>
        </v-card>
      </div>
    </v-main>
  </div>
</template>

<script>
import usersRepository from "../repositories/usersRepository.js";
import "../plugins/veeValidate.js";

export default {
  data() {
    return {
      valid: false,
      name: "",
      email: "",
      password: "",
      showPassword: false,
    };
  },

  methods: {
    async register() {
      const sendData = {
        name: this.name,
        email: this.email,
        password: this.password,
        role: "user",
      };
      const resData = await usersRepository.createUser(sendData);
      console.log(resData);

      this.$router.replace("/thanks");
    },
  },
};
</script>
