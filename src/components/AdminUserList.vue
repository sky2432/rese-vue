<template>
  <v-main>
    <v-container class="py-4 px-6" fluid>
      <v-card>
        <v-card-title class="amber">
          ユーザー一覧
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="ID・名前・メールアドレスで検索"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="users"
          :search="search"
          :loading="loading"
          item-key="id"
          loading-text="ロード中です"
        >
          <template v-slot:[`item.delete`]="{ item }">
            <v-icon @click="openDeleteDialog(item.id)">mdi-delete</v-icon>
          </template>
          <template v-slot:no-data>
            ユーザーはいません
          </template>
          <template v-slot:no-results>
            検索条件に当てはまるユーザーはいません
          </template>
        </v-data-table>
      </v-card>

      <v-dialog v-model="deleteDialog" max-width="500px">
        <v-card :loading="deleteLoading">
          <v-card-title class="justify-center">
            このユーザーを削除しますか？
          </v-card-title>
          <v-card-actions class="justify-center">
            <v-btn color="red lighten-1" dark @click="deleteUser">
              削除
            </v-btn>
            <v-btn color="amber" dark @click="deleteDialog = false">
              キャンセル
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <MessageDialog ref="messageDialog">
        <template #message>ユーザーを削除しました</template>
      </MessageDialog>
    </v-container>
  </v-main>
</template>

<script>
import usersRepository from "../repositories/usersRepository";
import MessageDialog from "../components/MessageDialog";

export default {
  components: {
    MessageDialog,
  },

  data() {
    return {
      users: [],
      search: "",
      deleteId: "",
      loading: true,
      deleteDialog: false,
      deleteLoading: false,
      headers: [
        { text: "ユーザーID", value: "id" },
        { text: "名前", value: "name" },
        { text: "メールアドレス", value: "email" },
        { text: "", value: "delete" },
      ],
    };
  },

  computed: {},

  created() {
    this.getUsers();
  },

  methods: {
    async getUsers() {
      const resData = await usersRepository.getUsers();
      this.users = resData.data.data;
      this.loading = false;
    },

    openDeleteDialog(userId) {
      this.deleteDialog = true;
      this.deleteId = userId;
    },

    async deleteUser() {
      this.deleteLoading = true;
      await usersRepository.deleteUser(this.deleteId);
      this.$refs.messageDialog.openMessageDialog();
      this.getUsers();
      this.deleteDialog = false;
      this.deleteLoading = false;
    },
  },
};
</script>
