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
        <v-card>
          <v-card-title>
            予約一覧
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="reservations"
            item-key="reservaiton.id"
            :search="search"
            :loading="loading"
            loading-text="予約を取得中です"
          >
            <template v-slot:[`item.reservation.status`]="{ item }">
              <v-chip :color="getStatusColor(item.reservation.status)" dark>
                {{ item.reservation.status }}
              </v-chip>
            </template>
            <template v-slot:no-data>
              予約がありません
            </template>

            <template v-slot:no-results>
              検索条件に当てはまる予約はありません
            </template>
          </v-data-table>
        </v-card>
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
      search: "",
      loading: true,
      shop: "",
      reservations: [],
      headers: [
        {
          text: "予約ID",
          align: "start",
          value: "reservation.id",
        },
        { text: "予約状況", value: "reservation.status" },
        { text: "予約者名", value: "name" },
        { text: "来店人数", value: "reservation.number_of_visiters" },
        { text: "来店日時", value: "reservation.visited_on" },
      ],
    };
  },

  computed: {
    ...mapGetters(["user"]),

    getStatusColor() {
      return function(status) {
        if (status === "予約中") {
          return "green";
        }
        if (status === "来店済み") {
          return "amber";
        }
        if (status === "キャンセル") {
          return "red";
        }
      };
    },
  },

  async created() {
    await this.getOwnerShop();
    this.getShopReservations();
  },

  methods: {
    async getOwnerShop() {
      const resData = await ownersRepository.getOwnerShop(this.user.id);
      this.shop = resData.data.data;
    },

    async getShopReservations() {
      const resData = await reservationsRepository.getShopReservations(
        this.shop.id
      );
      this.reservations = this.convetReservationStatus(resData.data.data);
      this.loading = false;
    },

    convetReservationStatus(data) {
      for (let i in data) {
        if (data[i].reservation.status === "reserving") {
          data[i].reservation.status = "予約中";
        }
        if (data[i].reservation.status === "visited") {
          data[i].reservation.status = "来店済み";
        }
        if (data[i].reservation.status === "cancelled") {
          data[i].reservation.status = "キャンセル";
        }
      }
      return data;
    },

    logout() {
      this.$store.dispatch("logout");
    },
  },
};
</script>
