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
              ref="datePickerMenu"
              v-model="showdatePickerMenu"
              :return-value.sync="visitsDate"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template #activator="{ on }">
                <validation-provider
                  v-slot="{ errors }"
                  name="日付"
                  rules="selectRequired"
                  vid="date"
                >
                  <v-text-field
                    v-model="visitsDate"
                    label="日付を選択"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-on="on"
                    :error-messages="errors"
                  ></v-text-field>
                </validation-provider>
              </template>
              <v-date-picker
                v-model="visitsDate"
                no-title
                scrollable
                :min="today"
              >
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="showdatePickerMenu = false">
                  キャンセル
                </v-btn>
                <v-btn
                  text
                  color="primary"
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
                v-model="visitsTime"
                :items="timeOptions"
                label="時刻を選択"
                prepend-icon="mdi-clock-time-eight-outline"
                :error-messages="errors"
              ></v-select>
            </validation-provider>

            <BaseSelector
              v-model="visitsNumber"
              :options="numberOptions"
              name="人数"
              label="人数を選択"
              icon="mdi-account"
            ></BaseSelector>
          </v-card-text>

          <v-card-actions class="justify-center pb-5">
            <slot name="leftButton"></slot>
            <v-btn color="amber" dark @click="checkTime" :disabled="invalid"
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

  props: {
    date: {
      type: String,
    },
    time: {
      type: String,
    },
    number: {
      type: Number,
    },
  },

  data() {
    return {
      visitsDate: "",
      visitsTime: "",
      visitsNumber: "",
      formValid: false,
      showdatePickerMenu: false,
      today: config.today,
      timeOptions: config.timeOptions,
      numberOptions: config.numberOptions,
    };
  },

  created() {
    this.setUpdateData();
  },

  methods: {
    setUpdateData() {
      this.visitsDate = this.date;
      this.visitsTime = this.time;
      this.visitsNumber = this.number;
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
