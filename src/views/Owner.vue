<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app>
      <v-sheet color="amber" class="pa-8">
        <v-row class="align-center">
          <v-avatar color="grey darken-1" size="64">
            <img :src="shop.image_url" alt="" />
          </v-avatar>
          <div class="pl-4">{{ shop.name }}</div>
        </v-row>
      </v-sheet>

      <v-divider></v-divider>

      <v-list>
        <v-list-item-group color="amber" v-model="selectedItem">
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-inbox-arrow-down</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>予約一覧</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-inbox-arrow-down</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>店舗情報</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>アカウント</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item @click="logout">
            <v-list-item-icon>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>ログアウト</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container class="py-8 px-6" fluid>
        <v-data-table
          :headers="headers"
          :items="reservations"
          :items-per-page="5"
          class="elevation-1"
        ></v-data-table>
        <!-- <v-row>
          <v-col>
            <v-card>
              <v-subheader>予約一覧</v-subheader>

              <v-list two-line>
                <template v-for="n in 6">
                  <v-list-item :key="n">
                    <v-list-item-avatar color="grey darken-1">
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title>Message {{ n }}</v-list-item-title>

                      <v-list-item-subtitle>
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Nihil repellendus distinctio similique
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                  <v-divider
                    v-if="n !== 6"
                    :key="`divider-${n}`"
                    inset
                  ></v-divider>
                </template>
              </v-list>
            </v-card>
          </v-col>
        </v-row> -->
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";
import ownersRepository from "../repositories/ownersRepository.js";
import reservationsRepository from "../repositories/reservationsRepository";

export default {
  data() {
    return {
      drawer: null,
      selectedItem: 0,
      shop: "",
      reservations: [],
      headers: [
        {
          text: "予約ID",
          align: "start",
          sortable: false,
          value: "reservation.id",
        },
        { text: "状態", value: "reservation.status" },
        { text: "名前", value: "name" },
        { text: "来店人数", value: "reservation.number_of_visiters" },
        { text: "来店日時", value: "reservation.visited_on" },
      ],
    };
  },

  computed: {
    ...mapGetters(["user"]),
  },

  async created() {
    await this.getOwnerShop();
    this.getShopReservations();
  },

  methods: {
    async getOwnerShop() {
      const resData = await ownersRepository.getOwnerShop(this.user.id);
      this.shop = resData.data.data;
      // console.log(resData);
    },

    async getShopReservations() {
      const resData = await reservationsRepository.getShopReservations(
        this.shop.id
      );
      this.reservations = resData.data.data;
      console.log(resData);
    },

    logout() {
      this.$store.dispatch("logout");
    },
  },
};
</script>
