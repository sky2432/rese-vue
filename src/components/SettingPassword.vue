
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

        <MessageDialog ref="messageDialog">
          <template #message>パスワードを更新しました</template>
        </MessageDialog>
      </div>
    </v-card>
  </div>
</template>

<script>
import MessageDialog from "../components/MessageDialog";
import { mapGetters } from "vuex";
import "../plugins/veeValidate.js";
import usersRepository from "../repositories/usersRepository";

export default {
  components: {
    MessageDialog,
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
    ...mapGetters(["user"]),
  },

  methods: {
    updatePassword() {
      const sendData = {
        password: this.password,
        new_password: this.newPassword,
      };
      usersRepository
        .updatePassword(this.user.id, sendData)
        .then(() => {
          this.resetPasswordForm();
          this.$refs.observer.reset();
          this.$refs.messageDialog.changeShowMessageDialog();
        })
        .catch((e) => {
          this.$refs.observer.setErrors(e.response.data.errors);
        });
    },

    resetPasswordForm() {
      this.password = "";
      this.newPassword = "";
    },
  },
};
</script>
