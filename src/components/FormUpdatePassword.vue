<template>
  <div>
    <v-card tile class="setting-card">
      <div class="setting-content">
        <validation-observer
          ref="observer"
          v-slot="{ invalid }"
          style="width: 80%;"
        >
          <v-form v-model="formValid">
            <validation-provider
              v-slot="{ errors }"
              name="現在のパスワード"
              rules="required"
              vid="password"
            >
              <v-text-field
                v-model="password"
                :error-messages="errors"
                label="Current Password"
                :type="showPassword ? 'text' : 'password'"
                :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append="showPassword = !showPassword"
                prepend-icon="mdi-key"
                required
              ></v-text-field>
            </validation-provider>

            <validation-provider
              v-slot="{ errors }"
              name="新しいパスワード"
              rules="required|min:4"
              vid="new_password"
            >
              <v-text-field
                v-model="newPassword"
                :error-messages="errors"
                label="New Password"
                :type="showNewPassword ? 'text' : 'password'"
                :append-icon="showNewPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append="showNewPassword = !showNewPassword"
                prepend-icon="mdi-key"
                required
              ></v-text-field>
            </validation-provider>

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

export default {
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
