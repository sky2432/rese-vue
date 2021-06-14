<template>
  <div>
    <v-card class="card">
      <v-card-title class="amber">
        <slot name="title"></slot>
      </v-card-title>
      <validation-observer ref="observer" v-slot="{ invalid }">
        <v-form v-model="formValid">
          <v-card-text class="mt-5 px-5">
            <v-menu
              :close-on-content-click="false"
              min-width="auto"
              :return-value.sync="visitsDate"
              ref="datePickerMenu"
              transition="scale-transition"
              offset-y
              v-model="showdatePickerMenu"
            >
              <template #activator="{ on }">
                <validation-provider
                  v-slot="{ errors }"
                  name="日付"
                  rules="selectRequired"
                  vid="date"
                >
                  <v-text-field
                    :error-messages="errors"
                    label="日付を選択"
                    prepend-icon="mdi-calendar"
                    v-on="on"
                    readonly
                    :value="visitsDate"
                  ></v-text-field>
                </validation-provider>
              </template>
              <v-date-picker
                :min="today"
                no-title
                scrollable
                v-model="visitsDate"
              >
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="showdatePickerMenu = false">
                  キャンセル
                </v-btn>
                <v-btn
                  color="primary"
                  text
                  @click="$refs.datePickerMenu.save(visitsDate)"
                >
                  選択
                </v-btn>
              </v-date-picker>
            </v-menu>

            <validation-provider
              v-slot="{ errors }"
              name="時刻"
              rules="selectRequired"
              vid="time"
            >
              <v-select
                :error-messages="errors"
                :items="timeOptions"
                label="時刻を選択"
                prepend-icon="mdi-clock-time-eight-outline"
                v-model="visitsTime"
              ></v-select>
            </validation-provider>

            <BaseSelector
              icon="mdi-account"
              label="人数を選択"
              name="人数"
              :options="numberOptions"
              v-model="visitsNumber"
            ></BaseSelector>
          </v-card-text>

          <v-card-actions class="justify-center pb-5">
            <slot name="leftButton"></slot>
            <v-btn
              color="amber"
              class="white--text"
              :disabled="invalid"
              @click="checkTime"
              >確認</v-btn
            >
          </v-card-actions>
        </v-form>
      </validation-observer>
    </v-card>
  </div>
</template>

<script>
import "../plugins/veeValidate.js";
import config from "../config/const.js";
import BaseSelector from "../components/BaseSelector";

export default {
  components: {
    BaseSelector,
  },

  data() {
    return {
      visitsDate: "",
      visitsTime: "",
      visitsNumber: null,
      formValid: false,
      showdatePickerMenu: false,
      today: config.today,
      timeOptions: config.timeOptions,
      numberOptions: config.numberOptions,
    };
  },

  methods: {
    setUpdateData(reservationData) {
      this.visitsDate = reservationData.visitsDate;
      this.visitsTime = reservationData.visitsTime;
      this.visitsNumber = reservationData.visitsNumber;
    },

    checkTime() {
      const sendData = {
        visitsDate: this.visitsDate,
        visitsTime: this.visitsTime,
        visitsNumber: this.visitsNumber,
      };
      this.$emit("check-time", sendData);
    },
  },
};
</script>
