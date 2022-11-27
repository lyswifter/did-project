<script lang="ts">
import { defineComponent } from "vue";

import { ElMessage } from 'element-plus'
import { CopyDocument } from '@element-plus/icons-vue'

import axios from "axios";
import Domain from "../router/domain.js";
import user from "../db/user.js";

export default defineComponent({
    name: "Mnemonic",
    components: {
        CopyDocument,
    },
    data() {
        return {
            did: localStorage.getItem("userdid"),
            isBackupVisiable: false,
            single: 3,
            originWords: "",
            mnemonicWords: [],
        }
    },
    mounted() {
        // window.addEventListener('beforeunload', (event) => {
        //     alert("close")
        //     // event.preventDefault();
        // })

        let that = this;
        user.queryUser(this.did).then(val => {
            that.originWords = val[0].mnemonic;
            that.constructMnemonic(that.originWords);
        });
    },
    watch: {
    },
    methods: {
        reloadPage() {
            location.reload()
        },
        constructMnemonic(origin) {
            let splitWords = origin.split(" ");
            let group = splitWords.length / this.single;
            for (let i = 0; i < group; i++) {
                let innerArr = []
                for (let j = this.single * i; j < this.single * (i + 1); j++) {
                    let oneWord = {
                        word: splitWords[j],
                        state: 0,
                    }
                    innerArr.push(oneWord)
                }
                this.mnemonicWords.push(innerArr);
            }
        },
        confirmAction() {
            this.isBackupVisiable = true;
        },
        backAction() {
            this.$router.go(-1);
        },
        copyMnemonicAction() {
            navigator.clipboard.writeText(this.originWords).then(() => {
                ElMessage({
                    message: "Copied",
                    type: "success",
                });
            })
        },
        cancelAction() {
            this.isBackupVisiable = false;
        },
        ensureAction() {
            this.$router.push({ name: "confirm" });
        }
    }
})
</script>

<template>
    <el-container class="dm-container">
        <el-header>
            <el-row class="dm-row" justify="space-between">
                <el-col :span="3">
                    <a href="javascript:void(0)" @click="reloadPage">
                        <img src="../assets/img/logo_Dmaster.svg" alt="">
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
                    <span>Backup Mnemonic Phrase</span>
                </div>

                <div class="content-view">
                    <h4 class="subtitle">Please write the mnemonic down in order to ensure the backup is correct.</h4>
                    <h4 class="notice">* Anyone who has the mnemonic can take control your DID account.</h4>
                    <h4 class="notice">* Used to restore your DID account.</h4>
                    <br>
                    <div class="mnemonic-view">
                        <el-row v-for="(outer, i) in mnemonicWords" :gutter="10" class="word-row-view">
                            <el-col v-for="(inner, j) in outer" :span="8" class="word-col-view">
                                <div class="word-view"> <span>{{ i * 3 + j + 1 }}</span> {{ inner.word }} </div>
                            </el-col>
                        </el-row>

                        <div class="line"></div>

                        <el-row justify="end">
                            <el-col :span="4">
                                <a class="copy-btn" href="javascript:void(0)" style="text-decoration: none;"
                                    @click="copyMnemonicAction"><img style="width: 16px;height: 16px;"
                                        src="../assets/img/16px_icon_copy.svg" alt="">Copy</a>
                            </el-col>
                        </el-row>
                    </div>
                </div>

                <div class="btn-view">
                    <a class="confirm-btn" style="text-decoration: none;" href="javascript:void(0)"
                        @click="confirmAction">Confirmed backup</a>
                </div>
            </div>
        </el-main>

        <el-dialog v-model="isBackupVisiable" :show-close="false" :width="540">
            <template #header="{ close }">
                <div class="dia-title-view">
                    <img style="width: 32px;height: 32px;vertical-align: middle;" src="../assets/img/32px_warn.svg"
                        alt="">
                    <span style="margin-left: 20px;">Have you backed up mnemonics?</span>
                </div>
            </template>

            <div class="dia-content-view">Please be sure to keep the account mnemonics, which will not be retrieved if
                lost.</div>

            <template #footer>
                <div class="dia-footer-view"></div>
                <el-row :gutter="10" justify="center">
                    <el-col :span="10">
                        <a href="javascript:void(0)" class="dia-cancel-btn" @click="cancelAction">Check it again</a>
                    </el-col>
                    <el-col :span="10">
                        <a href="javascript:void(0)" class="dia-ensure-btn" @click="ensureAction">Yes, I have backed it
                            up</a>
                    </el-col>
                </el-row>
            </template>
        </el-dialog>

        <img style="width: 69px;height: 72px;position: absolute;right: 60px;bottom: 60px;"
            src="../assets/img/LOGO_D.svg" alt="">
    </el-container>
</template>

<style scoped>
.w-color {
    color: #FFFFFF;
}

.b-color {
    color: #1E5CEF;
}

.lb-color {
    color: #1672F0;
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
    background: linear-gradient(180deg, #F8F9FC 0%, #EEF1F8 100%);
}
</style>

<style scoped>
.did-main {
    margin: 0 auto;
    width: 670px;
    background: #FFFFFF;
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
    color: #1D2129;
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
    font-weight: 400;
    color: #1D2129;
    line-height: 21px;
    margin-bottom: 10px;
}

.notice {
    width: 550px;
    height: 20px;
    font-size: 14px;
    font-weight: 600;
    color: #1D2129;
    line-height: 21px;
}

.mnemonic-view {
    padding: 0 10px;
    width: 550px;
    height: 314px;
    background: #FFFFFF;
    border-radius: 8px;
    /* border: 1px solid #E5E6EB; */
}

.word-row-view {
    margin-top: 10px;
}

.work-col-view {
    text-align: center;
}

.word-view {
    width: 170px;
    height: 48px;
    background: #F0F5FF;
    border-radius: 4px;
    text-align: start;
    font-size: 14px;
    font-weight: 400;
    color: #1672F0;
    line-height: 48px;
}

.word-view span {
    display: inline-block;
    height: 48px;
    width: 20px;
    font-size: 12px;
    font-weight: 400;
    color: #86909C;
    line-height: 48px;
    margin-right: 5px;
    text-align: right;
}

.line {
    margin-top: 10px;
    width: 100%;
    height: 1px;
    border-top: 1px solid #E5E6EB;
}

.copy-btn {
    display: block;
    width: 82px;
    height: 32px;
    background: #F2F3F5;
    border-radius: 16px;
    text-align: center;
    line-height: 32px;
    margin-top: 19px;
    color: #6B7785;
    font-size: 14px;
    font-weight: 400;
}

.copy-btn img {
    vertical-align: middle;
}

.btn-view {
    width: 670px;
    height: 99px;
    margin: 0 auto;
    border-top: 1px solid #E5E6EB;
}

.confirm-btn {
    margin: 28px auto;
    display: block;
    width: 400px;
    height: 44px;
    background: #1E5CEF;
    border-radius: 24px;
    line-height: 44px;
    color: white;
}

h4 {
    height: 20px;
    font-size: 14px;
    font-weight: 600;
    color: #1D2129;
    line-height: 21px;
    margin-bottom: 4px;
}
</style>

<style scoped>
.dia-title-view {
    width: 448px;
    height: 28px;
    font-size: 20px;
    font-weight: 600;
    color: #1D2129;
    line-height: 30px;
}

.dia-content-view {
    width: 448px;
    font-size: 16px;
    font-weight: 400;
    color: #86909C;
    line-height: 25px;
}

.dia-footer-view {
    
}

.dia-cancel-btn {
    display: block;
    width: 200px;
    height: 44px;
    border-radius: 24px;
    border: 1px solid #1D2129;
    text-decoration: none;
    line-height: 44px;
    text-align: center;
    color: #1D2129;
}

.dia-ensure-btn {
    display: block;
    width: 200px;
    height: 44px;
    background: #1D2129;
    border-radius: 24px;
    text-decoration: none;
    line-height: 44px;
    text-align: center;
    color: #FFFFFF;
}
</style>