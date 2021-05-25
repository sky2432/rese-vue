<template>
  <v-main>
    <v-container class="py-4 px-6" fluid>
      <DataTable
        ref="dataTable"
        label="ID・名前・メールアドレスで検索"
        v-bind="{
          tableData: users,
          headers: headers,
          loading: loading,
          deletion: true,
        }"
        @open-delete-dialog="openDeleteDialog"
      >
        <template #title>
          ユーザーリスト
        </template>
        <template #noData>ユーザーはいません</template>
        <template #noResults>検索条件に当てはまるユーザーはいません</template>
      </DataTable>

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

      <BaseDialog ref="baseDialog">
        <template #message>ユーザーを削除しました</template>
      </BaseDialog>
    </v-container>
  </v-main>
</template>

<script>
import usersRepository from "../repositories/usersRepository";
import DataTable from "../components/DataTable";

export default {
  components: {
    DataTable,
  },

  data() {
    return {
      users: [],
      deleteId: "",
      loading: true,
      deleteDialog: false,
      deleteLoading: false,
      headers: [
        { text: "ユーザーID", value: "id" },
        { text: "名前", value: "name" },
        { text: "メールアドレス", value: "email" },
        { text: "", value: "delete", sortable: false },
      ],
    };
  },

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
      this.$refs.baseDialog.openDialog();
      this.getUsers();
      this.deleteDialog = false;
      this.deleteLoading = false;
    },
  },
};
</script>
