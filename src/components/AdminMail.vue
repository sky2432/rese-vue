<template>
  <v-main>
    <v-container class="py-4 px-6" fluid>
      <v-card>
        <v-card-title class="amber">
          メール送信
        </v-card-title>
        <v-card-text class="mt-4">
          <validation-observer ref="observer" v-slot="{ invalid }">
            <v-form v-model="formValid">
              <BaseSelector
                :options="areaOptions"
                name="エリア"
                label="Area"
                icon="mdi-map-marker"
                v-model="receiver"
              ></BaseSelector>

              <TextFieldName
                name="店名"
                label="Shop Name"
                icon="mdi-store"
                v-model="subject"
              ></TextFieldName>

              <validation-provider
                v-slot="{ errors }"
                name="店舗概要"
                rules="required|max:255"
              >
                <v-textarea
                  class="mt-4"
                  name="概要"
                  label="Overview"
                  counter="255"
                  :error-messages="errors"
                  prepend-icon="mdi-storefront"
                  outlined
                  v-model="content"
                ></v-textarea>
              </validation-provider>

              <v-card-actions class="justify-center">
                <v-btn color="amber" :disabled="invalid">
                  登録
                </v-btn>
              </v-card-actions>
            </v-form>
          </validation-observer>
        </v-card-text>
      </v-card>

      <v-dialog max-width="500px" v-model="deleteDialog">
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
      receiver: null,
      subject: "",
      content: "",
      users: [],
      formValid: false,
      loading: true,
      deleteDialog: false,
      deleteLoading: false,
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
  },
};
</script>
