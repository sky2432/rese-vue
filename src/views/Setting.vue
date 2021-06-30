<template>
  <div>
    <TheHomeHeader></TheHomeHeader>

    <v-main>
      <div class="wrapper">
        <v-container>
          <v-row>
            <v-col cols="12" sm="4">
              <v-card tile>
                <v-list>
                  <v-subheader>設定</v-subheader>
                  <v-list-item-group color="primary" v-model="selectedItem">
                    <v-list-item
                      @click="currentComponent = 'FormUpdateNameEmail'"
                    >
                      <v-list-item-content>
                        <v-list-item-title
                          >名前・メールアドレス</v-list-item-title
                        >
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                      @click="currentComponent = 'FormUpdatePassword'"
                    >
                      <v-list-item-content>
                        <v-list-item-title>パスワード</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                      @click="currentComponent = 'SettingDeleteUser'"
                    >
                      <v-list-item-content>
                        <v-list-item-title>アカウント削除</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-card>
            </v-col>

            <v-col cols="12" sm="8">
              <component :is="currentComponent"></component>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-main>
  </div>
</template>

<script>
import FormUpdateNameEmail from "../components/FormUpdateNameEmail";
import FormUpdatePassword from "../components/FormUpdatePassword";
import SettingDeleteUser from "../components/SettingDeleteUser";

export default {
  components: {
    FormUpdateNameEmail,
    FormUpdatePassword,
    SettingDeleteUser,
  },

  data() {
    return {
      selectedItem: 0,
      currentComponent: FormUpdateNameEmail,
    };
  },
};
</script>
