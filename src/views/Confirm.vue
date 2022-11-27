<script lang="ts">
import { defineComponent, toRaw } from "vue";
import { ElMessage } from 'element-plus'

import { CopyDocument } from '@element-plus/icons-vue'

import axios from "axios";
import Domain from "../router/domain.js";

import user from "../db/user.js";

export default defineComponent({
    name: "Confirm",
    components: {
        CopyDocument,
    },
    data() {
        return {
            did: localStorage.getItem("userdid"),
            single: 3,
            checkRandoms: [],
            originWords: [],
            mnemonicWords: [],
            checkWords: [],

            isBackupVisiable: false,
            backFunc: null,
        }
    },
    created() {
        let prev = 0;
        for (let i = 0; i < 10; i++) {
            let rand = this.randomNum(1, 12);

            if (rand == prev) {
                continue
            }

            prev = rand;

            this.checkRandoms.push({
                item: rand,
                filled: false
            });

            if (this.checkRandoms.length == 2) {
                break
            }
        }

        this.checkRandoms.sort(function (a, b) {
            return a.item - b.item
        })
    },
    mounted() {
        let that = this;
        user.queryUser(this.did).then(val => {
            that.originWords = val[0].mnemonic.split(" ");

            // Random locate original words
            let newWords = that.randomLocate()

            that.constructMnemonic(newWords);
        });
    },
    watch: {
    },
    methods: {
        randomLocate() {
            let outer: number[] = []
            for (let i = 0; i < 12; i++) {
                let prev = 0;
                for (let j = 0; j < 1000; j++) {
                    let rand = this.randomNum(0, 11);

                    if (rand === prev) {
                        continue
                    }

                    if (outer.indexOf(rand) != -1) {
                        continue
                    }

                    prev = rand;
                    break
                }

                outer.push(prev)

                if (outer.length == 12) {
                    break
                }
            }

            let randomWords: string[] = []
            for (let i = 0; i < this.originWords.length; i++) {
                const index = outer[i]
                const element = this.originWords[index];
                randomWords.push(element)
            }

            return randomWords
        },
        randomNum(minNum, maxNum) {
            switch (arguments.length) {
                case 1:
                    // return parseInt(Math.random() * minNum + 1, 10);
                    break;
                case 2:
                    return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
                    break;
                default:
                    return 0;
                    break;
            }
        },
        reloadPage() {
            location.reload()
        },
        constructMnemonic(wordList) {
            for (let i = 0; i < wordList.length / this.single; i++) {
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
                        word: "",
                        state: state,
                    }
                    innerArr.push(oneWord)
                }
                this.mnemonicWords.push(innerArr);
            }

            wordList.forEach(ele => {
                let oneWord = {
                    word: ele,
                    checked: false,
                }
                this.checkWords.push(oneWord);
            });
        },
        confirmedAction() {
            let checkArr = []
            for (let i = 0; i < this.checkWords.length; i++) {
                const element = this.checkWords[i];
                if (element.checked) {
                    checkArr.push(element)
                }
            }

            //ensure mnemonic is correct
            for (let i = 0; i < this.checkRandoms.length; i++) {
                const element = this.checkRandoms[i];

                if (!element.filled) {
                    ElMessage({
                        message: 'Comfirm mnemonic words incorrect, please retry.',
                        type: 'error',
                    })
                    return
                }

                const specifyWord = this.originWords[element.item]
                const checkElement = checkArr[i];

                console.log(specifyWord)
                console.log(checkElement)

                if (!checkElement.checked) {
                    ElMessage({
                        message: 'Comfirm mnemonic words incorrect, please retry.',
                        type: 'error',
                    })
                    return
                }

                if (specifyWord != checkElement.word) {
                    ElMessage({
                        message: 'Comfirm mnemonic words incorrect, please retry.',
                        type: 'error',
                    })
                    return
                }
            }

            this.$router.push({ name: "home" });
        },
        backAction() {
            this.$router.go(-1);
            
            // this.isBackupVisiable = true;

            // this.backFunc = function () {
            //     this.$router.go(-1);   
            // }
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
        },
        clearAction(i: number, j: number) {
            let idx = i * this.single + j;
            let word = this.mnemonicWords[i][j].word;
            for (let k = 0; k < this.checkWords.length; k++) {
                if (this.checkWords[k].word == word) {
                    this.checkWords[k].checked = false;
                    break
                }
            }

            this.mnemonicWords[i][j].word = "";
            this.mnemonicWords[i][j].state = 1;

            for (let i = 0; i < this.checkRandoms.length; i++) {
                const element = this.checkRandoms[i];
                if (element.item == idx + 1) {
                    this.checkRandoms[i].filled = false;
                    break
                }
            }
        },
        cancelAction() {
            this.isBackupVisiable = false;

            this.backFunc = null
        },
        ensureAction() {
            if (this.backFunc) {
                this.backFunc()
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
                    <h4 class="subtitle">Please select the <span>{{ checkRandoms[0].item }}th</span> and
                        <span>{{ checkRandoms[1].item }}th</span> mnemonics.
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
                                }}</span> {{ inner.word }} <img src="../assets/img/24px_close_black.svg" alt=""
                                        @click="clearAction(i, j)"></div>
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
    /* border: 1px solid #E5E6EB; */
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
    position: relative;
    background: #FFFFFF;
    border: 1px solid #1672F0;
    width: 170px;
    height: 48px;
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
    font-size: 14px;
    font-weight: 400;
    color: #1672F0;
    line-height: 48px;
    margin-right: 5px;
    text-align: right;
}

.word-state-view img {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 24px;
    height: 24px;
    vertical-align: middle;
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