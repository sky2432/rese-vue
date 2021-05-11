<template>
  <div>
    <v-card tile class="setting-card">
      <div class="setting-content">
        <validation-observer
          ref="observer"
          v-slot="{ invalid }"
          style="width: 80%;"
        >
          <v-form v-model="valid">
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

        <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title class="justify-center">
            名前・メールアドレスを更新しました
          </v-card-title>
          <v-card-actions class="justify-center">
            <v-btn color="amber" @click="dialog = false">
              閉じる
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      </div>
    </v-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
import "../plugins/veeValidate.js";
import usersRepository from "../repositories/usersRepository";

export default {
  data() {
    return {
      dialog: false,
      valid: false,
      showPassword: false,
      name: "",
      email: "",
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
          console.log(response);
          this.$store.commit("updateUser", response.data.data);
          this.getUserData();
          this.dialog = true;
        })
        .catch((e) => {
          console.log(e);
          this.$refs.observer.setErrors(e.response.data.errors);
        });
    },
  },
};
</script>

<style scoped></style>
