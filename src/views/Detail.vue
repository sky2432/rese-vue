<template>
  <div>
    <TheHomeHeader></TheHomeHeader>
    <v-main>
      <div class="wrapper" v-if="loading">
        <v-progress-circular color="amber" indeterminate></v-progress-circular>
      </div>
      <v-container class="mt-5" v-if="loaded">
        <v-row>
          <v-col cols="6">
            <div class="d-flex">
              <v-btn @click="$router.go(-1)">
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
              <h1 class="ml-5">{{ shop.name }}</h1>
            </div>
            <v-img class="mt-5" :src="shop.image_url"> </v-img>
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
              エリア：{{ shop.area.name }}<br />ジャンル：{{ shop.genre.name }}
            </p>
            <p>
              {{ shop.overview }}
            </p>
          </v-col>

          <v-col cols="6" class="reservation-form">
            <FormReservation ref="formReservation" @check-time="checkTime">
              <template #title>予約</template>
            </FormReservation>

            <DialogConfirm ref="confirmDialog" :tableData="confirmDialogData">
              <template #title>予約内容の確認</template>
              <template #actionButton
                ><v-btn color="amber" dark @click="createReservation"
                  >予約</v-btn
                ></template
              >
            </DialogConfirm>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </div>
</template>

<script>
import "../plugins/veeValidate.js";
import { mapGetters } from "vuex";
import shopsRepository from "../repositories/shopsRepository.js";
import reservationsRepository from "../repositories/reservationsRepository";
import DialogConfirm from "../components/DialogConfirm";
import FormReservation from "../components/FormReservation";

export default {
  components: {
    FormReservation,
    DialogConfirm,
  },

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
  },

  created() {
    this.getShop();
  },

  methods: {
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
        this.$refs.confirmDialog.openDialog();
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
      this.$refs.confirmDialog.startLoading();
      const sendData = {
        user_id: this.user.id,
        shop_id: this.shop.id,
        visited_on: `${this.reservationData.visitsDate} ${this.reservationData.visitsTime}`,
        number_of_visiters: this.reservationData.visitsNumber,
      };
      await reservationsRepository.createReservation(sendData);
      this.$router.push("/done");
    },

    async getShop() {
      const resData = await shopsRepository.getShop(this.shopId);
      this.shop = resData.data.data;
      this.loading = false;
      this.loaded = true;
    },
  },
};
</script>

<style scoped>
.reservation-form {
  padding-top: 80px;
}
</style>
