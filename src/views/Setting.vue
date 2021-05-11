<template>
  <div>
    <theHeader></theHeader>
    <v-main>
      <div class="wrapper">
        <v-container>
          <v-row>
            <v-col cols="4">
              <v-card tile>
                <v-list>
                  <v-subheader>設定</v-subheader>
                  <v-list-item-group color="primary" v-model="selectedItem">
                    <v-list-item @click="currentComponent = 'SettingNameEmail'">
                      <v-list-item-content>
                        <v-list-item-title>名前・メールアドレス</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item @click="currentComponent = 'SettingPassword'">
                      <v-list-item-content>
                        <v-list-item-title>パスワード</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item @click="currentComponent = 'SettingDeleteUser'">
                      <v-list-item-content>
                        <v-list-item-title>アカウント削除</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-card>
            </v-col>

            <v-col cols="8">
              <component :is="currentComponent"></component>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-main>
  </div>
</template>

<script>
import SettingNameEmail from "../components/SettingNameEmail";
import SettingPassword from "../components/SettingPassword";
import SettingDeleteUser from "../components/SettingDeleteUser";

export default {
  components: {
    SettingNameEmail,
    SettingPassword,
    SettingDeleteUser,
  },

  data() {
    return {
      selectedItem: 0,
      currentComponent: SettingNameEmail,
    };
  },
};
</script>

<style></style>
