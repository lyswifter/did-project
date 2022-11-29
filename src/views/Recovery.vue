<script lang="ts">
import { defineComponent } from "vue";
import { ElMessage } from "element-plus";

import { CopyDocument } from "@element-plus/icons-vue";

import axios from "axios";
import Domain from "../router/domain.js";

let loginWithMnemonicUrl = Domain.domainUrl + "/api/did-user/login-v2";

import wallet from "../crypto/wallet.js";
import user from "../db/user.js";

export default defineComponent({
  name: "Recovery",
  components: {
    CopyDocument,
  },
  data() {
    return {
      single: 3,
      mnemonicWords: [],
      mnemonicStr: "",
    };
  },
  mounted() {
    localStorage.removeItem("token");
    localStorage.removeItem("userdid");

    for (let i = 0; i < 4; i++) {
      let innerArr = [];
      for (let j = 0; j < 3; j++) {
        let ibj = {
          row: i,
          col: j,
          word: "",
          place: (i * 3 + j + 1).toString(),
          state: 1,
        };
        innerArr.push(ibj);
      }
      this.mnemonicWords.push(innerArr);
    }
  },
  watch: {},
  methods: {
    reloadPage() {
      location.reload();
    },
    async confirmedAction() {
      for (let i = 0; i < this.mnemonicWords.length; i++) {
        const outer = this.mnemonicWords[i];
        for (let j = 0; j < outer.length; j++) {
          const inner = outer[j];
          if (inner.word == "") {
            ElMessage({
              message: "Mnemonic must not be empty",
              type: "error",
            });
            return;
          }
          this.mnemonicStr = this.mnemonicStr + inner.word + " ";
        }
      }
      this.mnemonicStr = this.mnemonicStr.trimEnd();

      let out = await wallet.signWith(this.mnemonicStr);
      if (out == undefined) {
        ElMessage({
          message: "Mnemonic words are invaild",
          type: "error",
        });
        return;
      }

      const res = await axios.post(loginWithMnemonicUrl, {
        singer: out.sign,
      });

      if (res.data.code == 0) {
        localStorage.setItem("userdid", out.did);
        localStorage.setItem("token", res.data.data.token);

        let userinfo = await user.queryUser(out.did);
        if (userinfo.length == 0) {
          // insert user info to indexDB

          let company = res.data.data.company;
          let email = res.data.data.email;

          user.createUser({
            email: email,
            did: out.did,
            company: company,
            address: out.address,
            privateKey: out.privateKey,
            publicKey: out.publicKey,
            mnemonic: out.mnemonic,
          });
        }

        this.$router.push({ name: "home" });
      }
    },
    backAction() {
      this.$router.go(-1);
    },
    newInput(newValue) {
      let allWords = newValue.split(" ");
      if (allWords.length > 0 && allWords.length == 12) {
        for (let i = 0; i < allWords.length; i++) {
          const element = allWords[i];
          let row = Math.floor(i / this.single);
          let col = Math.round(i % this.single);
          this.mnemonicWords[row][col].word = element;
          this.mnemonicWords[row][col].state = 2;
        }
      }
    },
  },
});
</script>

<template>
  <el-container class="dm-container">
    <el-header>
      <el-row class="dm-row" justify="space-between">
        <el-col :span="3">
          <a href="javascript:void(0)" @click="reloadPage">
            <img src="../assets/img/logo_Dmaster.svg" alt="" />
          </a>
        </el-col>
      </el-row>
    </el-header>

    <el-main>
      <div class="did-main">
        <div class="title-view">
          <a href="javascript:void(0)" @click="backAction">
            <div class="back-view"></div>
          </a>
          <span>Recover your DID</span>
        </div>

        <div class="content-view">
          <h4 class="subtitle">Mnemonic(12 phrases)</h4>
          <h4 class="notice">
            Enter the backup mnemonic phrases associated with the account.
          </h4>
          <br />
          <div class="mnemonic-view">
            <el-row
              v-for="(outer, i) in mnemonicWords"
              :gutter="10"
              class="word-row-view"
            >
              <el-col
                v-for="(inner, j) in outer"
                :span="8"
                class="word-col-view"
              >
                <el-input
                  class="word-input"
                  :placeholder="inner.place"
                  :clearable="true"
                  v-model="inner.word"
                  @input="newInput"
                ></el-input>
              </el-col>
            </el-row>
          </div>
        </div>

        <div class="btn-view">
          <a
            class="confirm-btn"
            style="text-decoration: none"
            href="javascript:void(0)"
            @click="confirmedAction"
            >Next</a
          >
        </div>
      </div>
    </el-main>

    <img
      style="
        width: 69px;
        height: 72px;
        position: absolute;
        right: 60px;
        bottom: 60px;
      "
      src="../assets/img/LOGO_D.svg"
      alt=""
    />
  </el-container>
</template>

<style scoped>
.w-color {
  color: #ffffff;
}

.b-color {
  color: #1e5cef;
}

.lb-color {
  color: #1672f0;
}

.f-24-500 {
  font-size: 24px;
  font-weight: 500px;
  line-height: 35px;
}

.f-18-400 {
  font-size: 18px;
  font-weight: 400px;
  line-height: 27px;
}

.op-50 {
  opacity: 50%;
}
</style>

<style scoped>
.dm-header {
  height: 72px;
}

.topAnchor {
  position: sticky;
  top: 0;
  z-index: 99;
}

.dm-row {
  height: 72px;
  line-height: 72px;
}

.dm-row img {
  vertical-align: middle;
}

.dm-empty {
  border: 1px solid transparent;
}

.dm-container {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #f8f9fc 0%, #eef1f8 100%);
}
</style>

<style scoped>
.did-main {
  margin: 0 auto;
  width: 670px;
  background: #ffffff;
  box-shadow: 0px 0px 15px 0px rgba(30, 92, 239, 0.12);
  border-radius: 20px;
  text-align: center;
}

.back-view {
  float: left;
  width: 32px;
  height: 32px;
  margin-left: 20px;
  background-image: url(../assets/img/32px_back_black.svg);
  background-repeat: no-repeat;
}

.title-view {
  padding-top: 34px;
  height: 51px;
}

.title-view span {
  height: 33px;
  font-size: 24px;
  font-weight: bold;
  color: #1d2129;
  line-height: 35px;
}
</style>

<style scoped>
.content-view {
  margin: 0 auto;
  width: 550px;
  margin-top: 70px;
  padding-bottom: 75px;
  text-align: start;
}

.subtitle {
  width: 550px;
  height: 20px;
  font-size: 14px;
  font-weight: 600;
  color: #1d2129;
  line-height: 21px;
  margin-bottom: 10px;
}

.subtitle span {
  color: #1672f0;
  font-weight: 600;
}

.notice {
  width: 550px;
  height: 20px;
  font-size: 14px;
  font-weight: 400;
  color: #86909c;
  line-height: 21px;
}

.mnemonic-view {
  padding: 0 10px;
  padding-bottom: 10px;
  width: 550px;
  background: #ffffff;
  border-radius: 8px;
  /* border: 1px solid #E5E6EB; */
}

.word-input {
  width: 170px;
  height: 48px;
  border-radius: 4px;
}

.word-row-view {
  margin-top: 10px;
}

.work-col-view {
  text-align: center;
}

.btn-view {
  width: 670px;
  height: 99px;
  margin: 0 auto;
  border-top: 1px solid #e5e6eb;
}

.confirm-btn {
  margin: 28px auto;
  display: block;
  width: 400px;
  height: 44px;
  background: #1e5cef;
  border-radius: 24px;
  line-height: 44px;
  color: white;
}

h4 {
  height: 20px;
  font-size: 14px;
  font-weight: 600;
  color: #1d2129;
  line-height: 21px;
  margin-bottom: 4px;
}
</style>