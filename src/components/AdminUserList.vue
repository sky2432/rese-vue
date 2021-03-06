<template>
  <v-container class="py-4 px-6" fluid>
    <DataTable
      ref="dataTable"
      label="ID・名前・メールアドレスで検索"
      v-bind="{
        tableData: users,
        headers: headers,
        loading: loading,
        name: isGuest,
        userName: isGuest,
        email: isGuest,
        deletion: true,
      }"
      @open-delete-dialog="openDeleteDialog"
    >
      <template #title>
        <span class="data-table-header">ユーザーリスト</span>
      </template>
      <template #addButton>
        <v-btn class="data-table-header ml-2" @click="getUsers">
          <v-icon>mdi-autorenew</v-icon>
        </v-btn>
      </template>
      <template #noData>ユーザーはいません</template>
      <template #noResults>検索条件に当てはまるユーザーはいません</template>
    </DataTable>

    <DialogWarning
      ref="dialogWarning"
      @open-dialog="$refs.deleteDialog.openDialog()"
    >
      <template #message
        >ユーザーを削除すると、そのユーザーに関連する全ての情報が削除されます。</template
      >
      <template #buttonText>ユーザーを削除</template>
    </DialogWarning>

    <BaseDialog ref="deleteDialog" baseButtonText="キャンセル">
      <template #title>本当にこのユーザーを削除しますか？</template>
      <template #leftButton>
        <v-btn color="red white--text" :disabled="isGuest" @click="deleteUser">
          削除
        </v-btn>
      </template>
      <template #baseButton>
        <v-btn color="amber white--text" @click="closeDeleteDialog">
          キャンセル
        </v-btn>
      </template>
    </BaseDialog>

    <BaseDialog ref="baseDialog">
      <template #title>ユーザーを削除しました</template>
    </BaseDialog>
  </v-container>
</template>

<script>
import usersRepository from "../repositories/usersRepository";
import DataTable from "../components/DataTable";
import DialogWarning from "../components/DialogWarning";
import { mapGetters } from "vuex";

export default {
  components: {
    DataTable,
    DialogWarning,
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
        { text: "", value: "delete", sortable: false, filterable: false },
      ],
    };
  },

  computed: {
    ...mapGetters(["role"]),

    isGuest() {
      return this.$helpers.$_isGuest(this.role);
    },
  },

  created() {
    this.getUsers();
  },

  methods: {
    async getUsers() {
      this.loading = true;
      const resData = await usersRepository.getUsers();
      this.users = resData.data.data;
      this.loading = false;
    },

    openDeleteDialog(userId) {
      this.$refs.dialogWarning.openDialog();
      this.deleteId = userId;
    },

    async deleteUser() {
      this.$refs.deleteDialog.startLoading();
      await usersRepository.deleteUser(this.deleteId);
      this.getUsers();
      this.$refs.baseDialog.openDialog();
      this.$refs.deleteDialog.stopLoading();
      this.closeDeleteDialog();
    },

    closeDeleteDialog() {
      this.$refs.dialogWarning.closeDialog();
      this.$refs.deleteDialog.closeDialog();
    },
  },
};
</script>
