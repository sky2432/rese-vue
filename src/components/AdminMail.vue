<template>
  <v-main>
    <v-container class="py-4 px-6" fluid>
      <v-card>
        <v-card-title class="amber">
          メール送信
        </v-card-title>
        <v-card-text class="mt-4">
          <validation-observer ref="observer" v-slot="{ invalid }">
            <v-form v-model="formValid">
              <BaseSelector
                name="宛先"
                label="destination"
                :options="destinationOptions"
                v-model="destination"
              ></BaseSelector>

              <BaseTextField name="件名" label="subject" v-model="subject">
              </BaseTextField>

              <div class="mt-4">
                <BaseTextArea
                  :clearable="true"
                  name="本文"
                  label="content"
                  vid="content"
                  v-model="content"
                ></BaseTextArea>
              </div>

              <v-card-actions class="justify-center">
                <v-btn
                  color="amber"
                  class="white--text"
                  :disabled="invalid"
                  @click="confirmMailContent"
                >
                  確認
                </v-btn>
              </v-card-actions>
            </v-form>
          </validation-observer>
        </v-card-text>
      </v-card>

      <DialogConfirm
        ref="DialogConfirm"
        cancellButtonText="修正"
        :tableData="confirmDialogData"
      >
        <template #title>メール内容の確認</template>
        <template #additional>
          <v-subheader class="black--text">本文</v-subheader>
          <v-card-text class="py-0">
            {{ content }}
          </v-card-text>
        </template>
        <template #actionButton
          ><v-btn color="amber" dark @click="sendMail">送信</v-btn></template
        >
      </DialogConfirm>

      <BaseDialog ref="baseDialog">
        <template #message>メールを送信しました</template>
      </BaseDialog>
    </v-container>
  </v-main>
</template>

<script>
import config from "../config/const.js";
import mailsRepository from "../repositories/mailsRepository.js";
import BaseTextField from "../components/BaseTextField";
import BaseTextArea from "../components/BaseTextArea";
import BaseSelector from "../components/BaseSelector";
import DialogConfirm from "../components/DialogConfirm";

export default {
  components: {
    BaseTextField,
    BaseTextArea,
    BaseSelector,
    DialogConfirm,
  },

  data() {
    return {
      destination: null,
      subject: "",
      content: "",
      formValid: false,
      destinationOptions: config.destinationOptions,
      confirmDialogData: [],
    };
  },

  methods: {
    confirmMailContent() {
      this.$refs.DialogConfirm.openDialog();
      this.createConfirmDialogData();
    },

    createConfirmDialogData() {
      this.confirmDialogData = [
        {
          header: "宛先",
          data: config.destinationOptions[this.destination].state,
        },
        { header: "件名", data: this.subject },
      ];
    },

    sendMail() {
      const sendData = {
        role: this.$store.getters.role,
        subject: this.subject,
        content: this.content,
      };
      if (this.destination === 0) {
        mailsRepository.sendMailForAll(sendData);
      }
      if (this.destination === 1) {
        mailsRepository.sendMailForUsers(sendData);
      }
      if (this.destination === 2) {
        mailsRepository.sendMailForOwners(sendData);
      }
      this.$refs.DialogConfirm.closeDialog();
      this.$refs.baseDialog.openDialog();
    },

    resetData() {
      this.destination = null;
      this.subject = "";
      this.content = "";
      this.$refs.observer.reset();
    },
  },
};
</script>
