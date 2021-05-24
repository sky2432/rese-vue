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
              <v-form v-model="formValid">
                <validation-provider
                  v-slot="{ errors }"
                  name="名前"
                  rules="required|max:10"
                  vid="name"
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
                  name="メールアドレス"
                  rules="required|email"
                  vid="email"
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
                  name="パスワード"
                  rules="required|min:4"
                  vid="password"
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

                <v-card-actions class="justify-center">
                  <v-btn color="amber" :disabled="invalid" @click="confirm">
                    確認
                  </v-btn>
                </v-card-actions>
              </v-form>
            </validation-observer>
          </v-card-text>
        </v-card>

        <v-dialog
          v-model="showDialogConfirmRegistration"
          width="500"
          persistent
        >
          <v-card :loading="registerLoading">
            <v-card-title class="amber">
              登録内容の確認
            </v-card-title>
            <v-card-text class="pt-5 pb-0">
              <v-simple-table>
                <template v-slot:default>
                  <tbody>
                    <tr class="table-line">
                      <th class="text-left">
                        Name
                      </th>
                      <td class="text-left">
                        {{ name }}
                      </td>
                    </tr>
                    <tr class="table-line">
                      <th class="text-left">
                        E-mail
                      </th>
                      <td class="text-left">
                        {{ email }}
                      </td>
                    </tr>
                    <tr class="table-line">
                      <th class="text-left">
                        Password
                      </th>
                      <td class="text-left">
                        表示されません
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions class="pb-6 justify-center">
              <v-btn
                color="amber"
                dark
                @click="showDialogConfirmRegistration = false"
                >修正</v-btn
              >
              <v-btn color="amber" dark @click="register">登録</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
      name: "",
      email: "",
      password: "",
      formValid: false,
      showPassword: false,
      showDialogConfirmRegistration: false,
      registerLoading: false,
    };
  },

  methods: {
    confirm() {
      const sendData = {
        name: this.name,
        email: this.email,
        password: this.password,
      };
      usersRepository
        .confirmUser(sendData)
        .then(() => {
          this.showDialogConfirmRegistration = true;
        })
        .catch((e) => {
          this.$refs.observer.setErrors(e.response.data.errors);
        });
    },

    async register() {
      this.registerLoading = true;
      const sendData = {
        name: this.name,
        email: this.email,
        password: this.password,
      };
      await usersRepository.createUser(sendData);
      this.$router.replace("/thanks");
      this.registerLoading = false;
    },
  },
};
</script>
