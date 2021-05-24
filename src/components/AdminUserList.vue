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
          <template v-slot:no-data>
            ユーザーはいません
          </template>
          <template v-slot:no-results>
            検索条件に当てはまるユーザーはいません
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </v-main>
</template>

<script>
import usersRepository from "../repositories/usersRepository";

export default {
  data() {
    return {
      users: [],
      search: "",
      loading: true,
      headers: [
        { text: "ユーザーID", value: "id" },
        { text: "名前", value: "name" },
        { text: "メールアドレス", value: "email" },
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
  },
};
</script>
