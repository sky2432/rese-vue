<template>
  <v-main>
    <v-container class="py-4 px-6" fluid>
      <v-card>
        <v-card-title class="amber">
          オーナーリスト
          <v-spacer></v-spacer>
          <v-text-field
            class="pt-0 mr-4"
            v-model="search"
            append-icon="mdi-magnify"
            label="ID・名前・メールアドレス・店舗名で検索"
            single-line
            hide-details

          ></v-text-field>
          <v-btn @click="openRegisterDialog">
            オーナー登録
          </v-btn>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="owners"
          :search="search"
          :loading="loading"
          item-key="id"
          loading-text="ロード中です"
        >
          <template v-slot:[`item.detail`]="{ item }">
            <v-btn color="amber" dark outlined @click="moveOwnerDetail(item.id)"
              >詳細</v-btn
            >
          </template>
          <template v-slot:no-data>
            店舗代表者はいません
          </template>
          <template v-slot:no-results>
            検索条件に当てはまる店舗代表者はいません
          </template>
        </v-data-table>
      </v-card>

      <v-dialog v-model="registerDialog" max-width="600" persistent>
        <v-card class="white pa-5" elevation="2" outlined shaped tile>
          <v-card-title>
            OwnerRegistration
            <v-spacer></v-spacer>
            <v-btn icon @click="registerDialog = false"
              ><v-icon>mdi-window-close</v-icon></v-btn
            >
          </v-card-title>
          <v-card-text>
            <validation-observer ref="observer" v-slot="{ invalid }">
              <v-form v-model="formValid">
                <validation-provider
                  v-slot="{ errors }"
                  name="名前"
                  rules="required|max:10"
                  vid="name"
                >
                  <v-text-field
                    v-model="name"
                    :counter="10"
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

                <validation-provider
                  v-slot="{ errors }"
                  name="パスワード"
                  rules="required|min:4"
                  vid="password"
                >
                  <v-text-field
                    v-model="password"
                    :error-messages="errors"
                    label="Password"
                    :type="showPassword ? 'text' : 'password'"
                    :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append="showPassword = !showPassword"
                    prepend-icon="mdi-key"
                    required
                  ></v-text-field>
                </validation-provider>

                <v-card-actions class="justify-center">
                  <v-btn color="amber" :disabled="invalid" @click="confirm">
                    確認
                  </v-btn>
                </v-card-actions>
              </v-form>
            </validation-observer>
          </v-card-text>
        </v-card>
      </v-dialog>

      <v-dialog v-model="confirmDialog" width="500" persistent>
        <v-card :loading="registerLoading">
          <v-card-title class="amber">
            登録内容の確認
          </v-card-title>
          <v-card-text class="pt-5 pb-0">
            <v-simple-table>
              <template v-slot:default>
                <tbody>
                  <tr class="table-line">
                    <th class="text-left">
                      Name
                    </th>
                    <td class="text-left">
                      {{ name }}
                    </td>
                  </tr>
                  <tr class="table-line">
                    <th class="text-left">
                      E-mail
                    </th>
                    <td class="text-left">
                      {{ email }}
                    </td>
                  </tr>
                  <tr class="table-line">
                    <th class="text-left">
                      Password
                    </th>
                    <td class="text-left">
                      表示されません
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions class="pb-6 justify-center">
            <v-btn color="amber" dark @click="confirmDialog = false"
              >修正</v-btn
            >
            <v-btn color="amber" dark @click="register">登録</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <MessageDialog ref="messageDialog">
        <template #message>店舗代表者を登録しました</template>
      </MessageDialog>
    </v-container>
  </v-main>
</template>

<script>
import ownersRepository from "../repositories/ownersRepository.js";
import MessageDialog from "../components/MessageDialog";

export default {
  components: {
    MessageDialog,
  },

  data() {
    return {
      owners: [],
      search: "",
      name: "",
      email: "",
      password: "",
      loading: true,
      registerDialog: false,
      confirmDialog: false,
      formValid: false,
      showPassword: false,
      registerLoading: false,
      headers: [
        { text: "オーナーID", value: "id" },
        { text: "名前", value: "name" },
        { text: "メールアドレス", value: "email" },
        { text: "店舗名", value: "shop.name" },
        { text: "", value: "detail" },
      ],
    };
  },

  computed: {},

  created() {
    this.getOwners();
  },

  methods: {
    async getOwners() {
      const resData = await ownersRepository.getOwners();
      this.owners = resData.data.data;
      this.loading = false;
    },

    openRegisterDialog() {
      this.registerDialog = true;
      this.resetData();
    },

    resetData() {
      this.name = "";
      this.email = "";
      this.password = "";
      this.$refs.observer.reset();
    },

    confirm() {
      const sendData = {
        name: this.name,
        email: this.email,
        password: this.password,
      };
      ownersRepository
        .confirmOwner(sendData)
        .then(() => {
          this.confirmDialog = true;
        })
        .catch((e) => {
          this.$refs.observer.setErrors(e.response.data.errors);
        });
    },

    async register() {
      this.registerLoading = true;
      const sendData = {
        name: this.name,
        email: this.email,
        password: this.password,
      };
      await ownersRepository.createOwner(sendData);
      this.$refs.messageDialog.openMessageDialog();
      this.getOwners();
      this.confirmDialog = false;
      this.registerDialog = false;
      this.registerLoading = false;
    },

    moveOwnerDetail(ownerId) {
      this.$helpers.$_movePageWithPram("OwnerDetail", "ownerId", ownerId);
    },
  },
};
</script>
