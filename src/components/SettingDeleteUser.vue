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
            @click="$refs.baseDialog.openDialog()"
            >アカウントを削除</v-btn
          >
        </v-alert>

        <BaseDialog ref="baseDialog">
          <template #message>本当にアカウントを削除しますか？</template>
          <template #leftButton>
            <v-btn color="red lighten-1" dark @click="deleteUser">
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
      await usersRepository.deleteUser(this.user.id);
      this.logout();
    },

    logout() {
      this.$store.dispatch("logout");
    },
  },
};
</script>
