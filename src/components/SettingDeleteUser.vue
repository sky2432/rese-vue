<template>
  <div>
    <v-card class="setting-card" tile>
      <div class="setting-content">
        <v-alert
          class="text-center mx-auto mb-0"
          type="error"
          width="85%"
          prominent
          text
        >
          <h3>必ずご確認ください</h3>
          <p>アカウントを削除すると、これまでのデータはすべて削除されます。</p>
          <v-btn
            class="mt-2"
            color="red lighten-1"
            @click="$refs.baseDialog.openDialog()"
            >アカウントを削除</v-btn
          >
        </v-alert>

        <BaseDialog ref="baseDialog" baseButtonText="キャンセル">
          <template #title>本当にアカウントを削除しますか？</template>
          <template #leftButton>
            <v-btn
              color="red lighten-1"
              class="white--text"
              @click="deleteUser"
            >
              削除
            </v-btn>
          </template>
        </BaseDialog>
      </div>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import usersRepository from "../repositories/usersRepository.js";

export default {
  computed: {
    ...mapGetters(["user"]),
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
