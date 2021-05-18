<template>
  <div>
    <v-card>
      <v-card-title> 店舗情報 </v-card-title>
      <v-img :src="shop.image_url" height="400px"></v-img>
      <v-simple-table>
        <template v-slot:default>
          <tbody>
            <tr>
              <th>店名</th>
              <td class="table-data">{{ shop.name }}</td>
            </tr>
            <tr>
              <th>エリア</th>
              <td class="table-data">{{ shop.area.name }}</td>
            </tr>
            <tr>
              <th>ジャンル</th>
              <td class="table-data">{{ shop.genre.name }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <v-subheader class="black--text">店舗概要</v-subheader>
      <v-card-text>
        {{ shop.overview }}
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn color="amber" dark @click="dialog = true">編集</v-btn>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="dialog" max-width="700px">
      <v-card>
        <v-card-title>
          店舗情報の編集
        </v-card-title>
        <v-card-text>
          <validation-observer ref="observer" v-slot="{ invalid }">
            <v-form v-model="formValid">
              <validation-provider
                v-slot="{ errors }"
                name="店名"
                rules="required|max:10"
              >
                <v-text-field
                  v-model="name"
                  :counter="10"
                  :error-messages="errors"
                  label="店名"
                  prepend-icon="mdi-account"
                  required
                ></v-text-field>
              </validation-provider>

              <validation-provider
                v-slot="{ errors }"
                name="エリア"
                rules="required|email"
              >
                <v-text-field
                  v-model="area"
                  :error-messages="errors"
                  label="エリア"
                  prepend-icon="mdi-email"
                  required
                ></v-text-field>
              </validation-provider>

              <validation-provider
                v-slot="{ errors }"
                name="ジャンル"
                rules="required"
              >
                <v-text-field
                  v-model="genre"
                  :error-messages="errors"
                  label="ジャンル"
                  prepend-icon="mdi-key"
                  required
                ></v-text-field>
              </validation-provider>

              <v-textarea
                v-model="overview"
                name="概要"
                label="店舗概要"
              ></v-textarea>

              <v-file-input
                accept="image/*"
                label="File input"
                chips
              ></v-file-input>

              <v-card-actions class="justify-center">
                <v-btn color="amber" :disabled="invalid">
                  確認
                </v-btn>
              </v-card-actions>
            </v-form>
          </validation-observer>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    shopId: {
      type: Number,
      require: true,
    },
  },

  data() {
    return {
      formValid: false,
      dialog: false,
      name: "",
      area: "",
      genre: "",
      overview: "",
    };
  },

  computed: {
    ...mapGetters(["shop"]),
  },

  created() {
    this.getShopData();
  },

  methods: {
    getShopData() {
      this.name = this.shop.name;
      this.area = this.shop.area.name;
      this.genre = this.shop.genre.name;
      this.overview = this.shop.overview;
    },
  },
};
</script>

<style scoped>
.table-data {
  color: rgba(0, 0, 0, 0.6);
}
</style>
