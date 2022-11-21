<script lang="ts">
import { defineComponent } from "vue";
import { ElMessage } from 'element-plus'

import { CopyDocument } from '@element-plus/icons-vue'

import axios from "axios";
import Domain from "../router/domain.js";

export default defineComponent({
    name: "Confirm",
    components: {
        CopyDocument,
    },
    data() {
        return {
            single: 3,
            randoms: [4, 8],
            checkRandoms: [],
            originWords: "coral dignity clutch idle shell wedding meat ethics doctor salute quantum poet".split(" "),
            mnemonicWords: [],
            checkWords: [],
        }
    },
    mounted() {
        for (let i = 0; i < this.randoms.length; i++) {
            let ibj = {
                item: this.randoms[i],
                filled: false
            }
            this.checkRandoms.push(ibj);
        }

        for (let i = 0; i < this.originWords.length / this.single; i++) {
            let innerArr = []
            for (let j = this.single * i; j < this.single * (i + 1); j++) {
                let state = 0;
                for (let k = 0; k < this.checkRandoms.length; k++) {
                    const ele = this.checkRandoms[k].item - 1;
                    if (ele == j) {
                        state = 1
                        break
                    }
                }
                let oneWord = {
                    word: this.originWords[j],
                    state: state,
                }
                innerArr.push(oneWord)
            }
            this.mnemonicWords.push(innerArr);
        }

        this.originWords.forEach(ele => {
            let oneWord = {
                word: ele,
                checked: false,
            }
            this.checkWords.push(oneWord);
        });
    },
    watch: {
    },
    methods: {
        reloadPage() {
            location.reload()
        },
        confirmedAction() {
            this.$router.push({ name: "home" });
        },
        backAction() {
            this.$router.go(-1);
        },
        toggleTagAction(index) {
            let checked = this.checkWords[index].checked;
            if (checked == true) {
                for (let i = this.checkRandoms.length - 1; i >= 0; i--) {
                    const element = this.checkRandoms[i];
                    if (element.filled == true) {
                        let idx = element.item - 1

                        let row = Math.floor(idx / this.single)
                        let col = Math.round(idx % this.single);

                        this.mnemonicWords[row][col].word = "";
                        this.mnemonicWords[row][col].state = 1;

                        this.checkWords[index].checked = false;
                        element.filled = false;
                        break
                    }
                }
            } else {
                for (let i = 0; i < this.checkRandoms.length; i++) {
                    const element = this.checkRandoms[i];
                    if (element.filled == false) {
                        let idx = element.item - 1

                        let row = Math.floor(idx / this.single)
                        let col = Math.round(idx % this.single);

                        this.mnemonicWords[row][col].word = this.checkWords[index].word;
                        this.mnemonicWords[row][col].state = 2;

                        this.checkWords[index].checked = true;
                        element.filled = true;

                        break
                    }
                }

            }
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
                    <h4 class="subtitle">Please select the <span>{{ randoms[0] }}th</span> and
                        <span>{{ randoms[1] }}th</span> mnemonics.
                    </h4>
                    <h4 class="notice">Click the mnemonic phrase below to ensure that the order is consistent with the
                        mnemonic phrase you backed up.</h4>
                    <br>
                    <div class="mnemonic-view">
                        <el-row v-for="(outer, i) in mnemonicWords" :gutter="10" class="word-row-view">
                            <el-col v-for="(inner, j) in outer" :span="8" class="word-col-view">
                                <div v-if="inner.state == 0" class="default-state-view">****</div>
                                <div v-else-if="inner.state == 1" class="select-state-view">Please select</div>
                                <div v-else-if="inner.state == 2" class="word-state-view"> <span>{{ i * 3 + j + 1
                                }}</span> {{ inner.word }} </div>
                            </el-col>
                        </el-row>

                        <div class="line"></div>

                        <div class="confirm-list-view">
                            <el-check-tag v-for="(item, index) in checkWords" :checked="item.checked"
                                class="confirm-tag-view" @change="toggleTagAction(index)">{{ item.word }}</el-check-tag>
                        </div>
                    </div>
                </div>

                <div class="btn-view">
                    <a class="confirm-btn" style="text-decoration: none;" href="javascript:void(0)"
                        @click="confirmedAction">Next</a>
                </div>
            </div>
        </el-main>

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
    font-weight: 600;
    color: #1D2129;
    line-height: 21px;
    margin-bottom: 10px;
}

.subtitle span {
    color: #1672F0;
    font-weight: 600;
}

.notice {
    width: 550px;
    height: 20px;
    font-size: 14px;
    font-weight: 400;
    color: #86909C;
    line-height: 21px;
}

.mnemonic-view {
    padding: 0 10px;
    width: 550px;
    background: #FFFFFF;
    border-radius: 8px;
    border: 1px solid #E5E6EB;
}

.word-row-view {
    margin-top: 10px;
}

.work-col-view {
    text-align: center;
}

.default-state-view {
    width: 170px;
    height: 48px;
    background: #F2F3F5;
    border-radius: 4px;
    text-align: start;
    font-size: 14px;
    font-weight: 400;
    color: #C9CDD4;
    line-height: 48px;
    padding-left: 32px;
}

.select-state-view {
    width: 170px;
    height: 48px;
    background: #FFFFFF;
    box-shadow: 0px 0px 15px 0px rgba(30, 92, 239, 0.12);
    border: 1px solid #1D2129;
    border-radius: 4px;
    text-align: start;
    font-size: 14px;
    font-weight: 400;
    color: #86909C;
    line-height: 48px;
    padding-left: 12px;
}

.word-state-view {
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

.word-state-view span {
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

.confirm-list-view {
    padding-bottom: 10px;
}

.confirm-tag-view {
    margin-right: 10px;
    margin-top: 10px;
    height: 32px;
    background: #E8EFFF;
    border-radius: 28px;
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