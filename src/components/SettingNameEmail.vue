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
              name="名前"
              rules="required|min:2"
              vid="name"
            >
              <v-text-field
                v-model="name"
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

            <v-card-actions class="justify-center">
              <v-btn color="amber" :disabled="invalid" @click="updateUser">
                更新
              </v-btn>
            </v-card-actions>
          </v-form>
        </validation-observer>

        <MessageDialog ref="messageDialog">
          <template #message>名前・メールアドレスを更新しました</template>
        </MessageDialog>
      </div>
    </v-card>
  </div>
</template>

<script>
import MessageDialog from "../components/MessageDialog";
import { mapState } from "vuex";
import "../plugins/veeValidate.js";
import usersRepository from "../repositories/usersRepository";

export default {
  components: {
    MessageDialog,
  },

  data() {
    return {
      name: "",
      email: "",
      formValid: false,
      showPassword: false,
    };
  },

  computed: {
    ...mapState(["user"]),
  },

  created() {
    this.getUserData();
  },

  methods: {
    getUserData() {
      this.name = this.user.name;
      this.email = this.user.email;
    },

    updateUser() {
      const sendData = {
        name: this.name,
        email: this.email,
      };
      usersRepository
        .updateUser(this.user.id, sendData)
        .then((response) => {
          this.$store.commit("updateUser", response.data.data);
          this.getUserData();
          this.$refs.messageDialog.changeShowMessageDialog();
        })
        .catch((e) => {
          this.$refs.observer.setErrors(e.response.data.errors);
        });
    },
  },
};
</script>

