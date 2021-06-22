<template>
  <div>
    <v-card class="setting-card" tile>
      <div class="setting-content">
        <div>
          <v-alert
            class="text-center mx-auto mb-0"
            type="error"
            width="85%"
            text
          >
            <h3>必ずご確認ください</h3>
            <p class="mb-0 mt-1">
              アカウントを削除すると、これまでのデータはすべて削除されます。
            </p>
          </v-alert>
          <div class="text-center">
            <v-btn
              class="mt-2"
              color="red white--text"
              :disabled="disableButton"
              @click="$refs.baseDialog.openDialog()"
              >アカウントを削除</v-btn
            >
          </div>
        </div>
      </div>
      <BaseDialog ref="baseDialog" baseButtonText="キャンセル">
        <template #title>本当にアカウントを削除しますか？</template>
        <template #leftButton>
          <v-btn color="red white--text" @click="deleteUser">
            削除
          </v-btn>
        </template>
      </BaseDialog>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import usersRepository from "../repositories/usersRepository.js";

export default {
  computed: {
    ...mapGetters(["user", "role"]),

    disableButton() {
      return this.$helpers.$_disableButton(this.role);
    },
  },

  methods: {
    async deleteUser() {
      this.$refs.baseDialog.startLoading();
      await usersRepository.deleteUser(this.user.id);
      this.$refs.baseDialog.stopLoading();
      this.logout();
    },

    logout() {
      this.$store.dispatch("logout");
      this.$router.replace("/accountDelete");
    },
  },
};
</script>
