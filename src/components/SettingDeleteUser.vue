<template>
  <div>
    <v-card tile class="setting-card">
      <div class="setting-content">
        <v-alert
          prominent
          type="error"
          text
          class="text-center mx-auto mb-0"
          width="85%"
        >
          <h3>必ずご確認ください</h3>
          <p>アカウントを削除すると、これまでのデータはすべて削除されます。</p>
          <v-btn
            color="red lighten-1"
            class="mt-2"
            @click="showDialogConfirmDeletionUser = true"
            >アカウントを削除</v-btn
          >
        </v-alert>

        <v-dialog v-model="showDialogConfirmDeletionUser" max-width="500px">
          <v-card>
            <v-card-title class="justify-center">
              本当にアカウントを削除しますか？
            </v-card-title>
            <v-card-actions class="justify-center">
              <v-btn color="red lighten-1" dark @click="deleteUser">
                削除
              </v-btn>
              <v-btn
                color="amber"
                dark
                @click="showDialogConfirmDeletionUser = false"
              >
                キャンセル
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import usersRepository from "../repositories/usersRepository.js";

export default {
  data() {
    return {
      showDialogConfirmDeletionUser: false,
    };
  },

  computed: {
    ...mapGetters(["user"]),
  },

  methods: {
    async deleteUser() {
      await usersRepository.deleteUser(this.user.id);
      this.logout();
    },

    logout() {
      this.$store.dispatch("logout");
    },
  },
};
</script>
