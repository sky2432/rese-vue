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
            <TextFieldName v-model="name"></TextFieldName>

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

        <BaseDialog ref="baseDialog">
          <template #message>名前・メールアドレスを更新しました</template>
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
import TextFieldName from "../components/TextFieldName";

export default {
  components: {
    TextFieldName,
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
    ...mapGetters(["user", "role"]),
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
      if (this.role === "user") {
        usersRepository
          .updateUser(this.user.id, sendData)
          .then((response) => {
            this.response(response);
          })
          .catch((e) => {
            this.error(e);
          });
      }
      if (this.role === "owner") {
        ownersRepository
          .updateOwner(this.user.id, sendData)
          .then((response) => {
            this.response(response);
          })
          .catch((e) => {
            this.error(e);
          });
      }
    },

    response(response) {
      this.$store.dispatch("updateUser", response.data.data);
      this.getUserData();
      this.$refs.baseDialog.openDialog();
    },

    error(e) {
      this.$refs.observer.setErrors(e.response.data.errors);
    },
  },
};
</script>
