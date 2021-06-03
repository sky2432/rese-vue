<template>
  <div>
    <v-card class="setting-card" tile>
      <div class="setting-content">
        <validation-observer
          ref="observer"
          v-slot="{ invalid }"
          style="width: 80%;"
        >
          <v-form v-model="formValid">
            <TextFieldPassword
              name="現在のパスワード"
              label="Current Password"
              v-model="password"
            ></TextFieldPassword>

            <TextFieldPassword
              name="新しいパスワード"
              label="New Password"
              vid="new_password"
              v-model="newPassword"
            ></TextFieldPassword>

            <v-card-actions class="justify-center">
              <v-btn color="amber" :disabled="invalid" @click="updatePassword">
                更新
              </v-btn>
            </v-card-actions>
          </v-form>
        </validation-observer>

        <BaseDialog ref="baseDialog">
          <template #message>パスワードを更新しました</template>
        </BaseDialog>
      </div>
    </v-card>
  </div>
</template>

<script>
import "../plugins/veeValidate.js";
import { mapGetters } from "vuex";
import usersRepository from "../repositories/usersRepository";
import ownersRepository from "../repositories/ownersRepository";
import adminsRepository from "../repositories/adminsRepository";
import TextFieldPassword from "../components/TextFieldPassword";

export default {
  components: {
    TextFieldPassword,
  },

  data() {
    return {
      password: "",
      newPassword: "",
      formValid: false,
      showPassword: false,
      showNewPassword: false,
    };
  },

  computed: {
    ...mapGetters(["user", "role"]),
  },

  methods: {
    updatePassword() {
      const sendData = {
        password: this.password,
        new_password: this.newPassword,
      };
      if (this.role === "user") {
        usersRepository
          .updatePassword(this.user.id, sendData)
          .then(() => {
            this.response();
          })
          .catch((e) => {
            this.error(e);
          });
      }
      if (this.role === "owner") {
        ownersRepository
          .updatePassword(this.user.id, sendData)
          .then(() => {
            this.response();
          })
          .catch((e) => {
            this.error(e);
          });
      }
      if (this.role === "admin") {
        adminsRepository
          .updatePassword(this.user.id, sendData)
          .then(() => {
            this.response();
          })
          .catch((e) => {
            this.error(e);
          });
      }
    },

    response() {
      this.resetPasswordForm();
      this.$refs.observer.reset();
      this.$refs.baseDialog.openDialog();
    },

    error(e) {
      this.$refs.observer.setErrors(e.response.data.errors);
    },

    resetPasswordForm() {
      this.password = "";
      this.newPassword = "";
    },
  },
};
</script>
