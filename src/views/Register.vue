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

        <ConfirmDialog
          ref="confirmDialog"
          :tableData="confirmDialogData"
          cancellButtonText="修正"
        >
          <template #title>登録内容の確認</template>
          <template #actionButton
            ><v-btn color="amber" dark @click="register">登録</v-btn></template
          >
        </ConfirmDialog>
      </div>
    </v-main>
  </div>
</template>

<script>
import usersRepository from "../repositories/usersRepository.js";
import "../plugins/veeValidate.js";
import ConfirmDialog from "../components/ConfirmDialog";

export default {
  components: {
    ConfirmDialog,
  },

  data() {
    return {
      name: "",
      email: "",
      password: "",
      formValid: false,
      showPassword: false,
      confirmDialogData: [],
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
          this.$refs.confirmDialog.openDialog();
          this.createConfirmDialogData();
        })
        .catch((e) => {
          this.$refs.observer.setErrors(e.response.data.errors);
        });
    },

    createConfirmDialogData() {
      this.confirmDialogData = [
        { header: "Name", data: this.name },
        { header: "E-mail", data: this.email },
        { header: "Password", data: this.password },
      ];
    },

    async register() {
      this.$refs.confirmDialog.startLoading();
      const sendData = {
        name: this.name,
        email: this.email,
        password: this.password,
      };
      await usersRepository.createUser(sendData);
      this.$router.replace("/thanks");
    },
  },
};
</script>
