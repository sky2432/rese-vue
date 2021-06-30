<template>
  <div>
    <TheHomeHeader></TheHomeHeader>
    <v-main>
      <div class="wrapper" v-if="loading">
        <v-progress-circular color="amber" indeterminate></v-progress-circular>
      </div>
      <v-container class="mt-5" v-show="loaded">
        <v-row>
          <v-col cols="12" sm="6">
            <div class="d-flex">
              <v-btn @click="$router.go(-1)">
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
              <h1 class="ml-5">{{ shop.name }}</h1>
            </div>
            <v-card elevation="5">
              <v-img class="mt-5" :src="shop.image_url"> </v-img>
            </v-card>
            <v-row class="mx-0 mt-5" align="center">
              <v-rating
                color="amber"
                :value="shop.evaluation"
                size="14"
                dense
                half-increments
                readonly
              ></v-rating>

              <div class="ml-1">
                {{ shop.evaluation
                }}<span class="grey--text ml-2"
                  >({{ shop.evaluation_count }}件)</span
                >
              </div>
            </v-row>
            <p class="mt-5" v-if="shop">
              エリア：{{ $helpers.$_showArea(shop.main_address)
              }}<br />ジャンル：{{ shop.genre.name }}
            </p>
            <p>
              {{ shop.overview }}
            </p>
          </v-col>

          <v-col cols="12" sm="6" class="reservation-form">
            <FormReservation ref="formReservation" @check-time="checkTime">
              <template #title>予約</template>
            </FormReservation>

            <DialogConfirm ref="dialogConfirm" :tableData="confirmDialogData">
              <template #title>予約内容の確認</template>
              <template #actionButton
                ><v-btn color="amber white--text" @click="createReservation"
                  >予約</v-btn
                ></template
              >
            </DialogConfirm>
          </v-col>
        </v-row>
        <p>住所：{{ showAddress }}</p>
        <v-card>
          <div id="map" ></div>
        </v-card>
      </v-container>
    </v-main>
  </div>
</template>

<script>
import "../plugins/veeValidate.js";
import { mapGetters } from "vuex";
import shopsRepository from "../repositories/shopsRepository.js";
import reservationsRepository from "../repositories/reservationsRepository";
import googleMapMixin from "../mixins/googleMapMixin.js";
import DialogConfirm from "../components/DialogConfirm";
import FormReservation from "../components/FormReservation";

export default {
  components: {
    FormReservation,
    DialogConfirm,
  },

  mixins: [googleMapMixin],

  props: {
    shopId: {
      type: Number,
      require: true,
    },
  },

  data() {
    return {
      shop: "",
      loading: true,
      loaded: false,
      reservationData: "",
      confirmDialogData: [],
    };
  },

  computed: {
    ...mapGetters(["user"]),

    showAddress() {
      if (this.shop) {
        const postalCode = this.$helpers.$_stringInsert(
          this.shop.postal_code,
          3,
          "-"
        );
        if (this.shop.option_address === null) {
          return `〒${postalCode} ${this.shop.main_address}`;
        }
        return `〒${postalCode} ${this.shop.main_address} ${this.shop.option_address}`;
      }
      return "";
    },
  },

  watch: {
    shop() {
      //googleMapMixinのメソッド
      this.showGoogleMap();
    },
  },

  created() {
    this.getShop();
  },

  methods: {
    async getShop() {
      const resData = await shopsRepository.getShop(this.shopId);
      this.shop = resData.data.data;
      this.loading = false;
      this.loaded = true;
    },

    checkTime(sendData) {
      const dateTime = `${sendData.visitsDate} ${sendData.visitsTime}`;
      const result = this.$helpers.$_isBeforeThanNow(dateTime);
      if (result) {
        this.$refs.formReservation.$refs.observer.setErrors({
          time: ["現在時刻よりも後の時刻を選択してください"],
        });
      }
      if (!result) {
        this.reservationData = sendData;
        this.$refs.dialogConfirm.openDialog();
        this.createConfirmDialogData(sendData);
      }
    },

    createConfirmDialogData(sendData) {
      this.confirmDialogData = this.$helpers.$_createDataConfirmReservation(
        this.shop.name,
        sendData.visitsDate,
        sendData.visitsTime,
        sendData.visitsNumber
      );
    },

    async createReservation() {
      this.$refs.dialogConfirm.startLoading();
      const sendData = {
        user_id: this.user.id,
        shop_id: this.shop.id,
        visited_on: `${this.reservationData.visitsDate} ${this.reservationData.visitsTime}`,
        number_of_visiters: this.reservationData.visitsNumber,
      };
      await reservationsRepository.createReservation(sendData);
      this.$router.push("/done");
    },
  },
};
</script>

<style scoped>
.reservation-form {
  padding-top: 80px;
}

/* #map {
  width: 100%;
  height: 500px;
} */

@media screen and (max-width: 600px) {
  .reservation-form {
    padding-top: 0px;
    padding-bottom: 28px;
  }

  /* #map {
    height: 300px;
  } */
}
</style>
