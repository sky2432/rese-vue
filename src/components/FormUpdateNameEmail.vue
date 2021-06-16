<template>
  <div>
    <v-card class="setting-card" tile>
      <div class="setting-content">
        <validation-observer
          style="width: 80%;"
          ref="observer"
          v-slot="{ invalid }"
        >
          <v-form v-model="formValid">
            <TextFieldName v-model="name"></TextFieldName>

            <TextFieldEmail v-model="email"></TextFieldEmail>

            <v-card-actions class="justify-center">
              <v-btn color="amber white--text" :disabled="invalid" @click="updateUser">

                更新
              </v-btn>
            </v-card-actions>
          </v-form>
        </validation-observer>

        <BaseDialog ref="baseDialog">
          <template #title>名前・メールアドレスを更新しました</template>
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
import TextFieldName from "../components/TextFieldName";
import TextFieldEmail from "../components/TextFieldEmail";

export default {
  components: {
    TextFieldEmail,
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
      if (this.role === "admin") {
        adminsRepository
          .updateAdmin(this.user.id, sendData)
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
