<script lang="ts">
import { defineComponent } from "vue";
import { ElMessage } from 'element-plus'

import bip39 from '../crypto/bip39.js';
import user from "../db/user.js";
import didc from "../crypto/did.js";

import axios from "axios";
import Domain from "../router/domain.js";

let sendCodeUrl = Domain.domainUrl + "/api/did-user/send"
let loginUrl = Domain.domainUrl + "/api/did-user/login"

export default defineComponent({
    name: "Create",
    components: {},
    data() {
        return {
            sendDisable: false,
            sendString: "Send",
            sendCount: 60,
            countLimit: 60,
            emailcontent: "ly70835@163.com",
            vcodecontent: "",
            companycontent: "Tianru",
        }
    },
    mounted() {
        this.sendCount = this.countLimit;
    },
    watch: {
        sendCount(newVal, oldVal) {
            if (newVal <= 0 || newVal == this.countLimit) {
                this.sendDisable = false;
                this.sendString = "Send";
            } else {
                this.sendDisable = true;
                this.sendString = newVal + "(S)";
            }
        }
    },
    methods: {
        reloadPage() {
            location.reload()
        },
        async sendVcodeAction() {
            const res = await axios.post(sendCodeUrl, {
                email: this.emailcontent,
            });

            if (res.data.code == 0) {
                ElMessage({
                    message: 'Send auth code to your email successed.',
                    type: 'success',
                })

                let ttimer = setInterval(() => {
                    this.sendCount = this.sendCount - 1;
                    if (this.sendCount <= 0) {
                        this.sendCount = this.countLimit;
                        clearInterval(ttimer);
                    }
                }, 1000);
            } else {
                ElMessage({
                    message: 'Send auth code to your email error, please retry',
                    type: 'error',
                })
            }
        },
        async createDidAction() {
            let ret = await this.createDid()

            localStorage.setItem("userdid", ret.didStr)

            // this.$router.push({ name: "mnemonic" });

            const res = await axios.post(loginUrl, {
                email: this.emailcontent,
                code: this.vcodecontent,
                company: this.companycontent,
                didAddress: ret.didStr,
                singer: ret.didJwt,
            });

            if (res.data.code == 0) {
                window.localStorage.setItem("token", res.data.data.token);

                // Create did

                ElMessage({
                    message: 'Login successed.',
                    type: 'success',
                })

                this.$router.push({ name: "mnemonic" });
            } else {
                ElMessage({
                    message: res.data.msg,
                    type: 'error',
                })
            }
        },
        async createDid() {
            let mnemonic = await bip39.genBip39Mnemonic();
            let wallet = await bip39.genWalletWithMnemonic(mnemonic);

            let did = "did:dmaster:" + wallet.address;

            // save userinfo
            user.createUser({
                email: this.emailcontent,
                did: did,
                address: wallet.address,
                company: this.companycontent,
                privateKey: wallet.privateKey,
                publicKey: wallet.publicKey,
                mnemonic: mnemonic,
            })

            let document = {
                "@context": [
                    "https://www.w3.org/ns/did/v1",
                ],
                "id": did,
                "verificationMethod": [
                    {
                        "type": "EcdsaSecp256k1VerificationKey2019",
                        "id": did + "#key-1",
                        "controller": did,
                        "publicKeyBase58": wallet.publicKey,
                    }
                ],
                "authentication": [
                    did + "#key-1",
                ],
                "assertionMethod": [
                    did  + "#key-1",
                ],
                "keyAgreement": [
                    did  + "#key-1",
                ],
                "capabilityInvocation": [
                    did  + "#key-1",
                ],
                "capabilityDelegation": [
                    did  + "#key-1",
                ]
            }

            let didJwt = await didc.createDidJwt(wallet, document);

            return {
                didStr: did,
                didJwt: didJwt,
            };
        },
        recoverFromDidAction() {
            this.$router.push({ name: "recovery" });
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
                    <span>Welcome to </span><img style="width: 182px;height: 28px;"
                        src="../assets/img/logo_Dmaster-black.svg" alt="">
                </div>

                <div class="content-view">
                    <h4>* Email</h4>
                    <el-input class="email-input" v-model="emailcontent" placeholder="Enter your email" />
                    <br>
                    <br>
                    <h4>* Email verification code</h4>
                    <div class="vcode-view">
                        <el-input class="vcode-input" v-model="vcodecontent"
                            placeholder="Enter email verification code" />
                        <a class="vcode-a" style="text-decoration: none;" href="javascript:void(0)"
                            @click="sendVcodeAction">{{ sendString }}</a>
                    </div>
                    <br>
                    <a class="recover-a" href="javascript:void(0)" @click="recoverFromDidAction">Recover existing
                        DID</a>

                    <div class="line"></div>

                    <h4>* Company or Organization</h4>
                    <el-input class="company-input" v-model="companycontent"
                        placeholder="Enter your company or organization name" />
                </div>

                <div class="btn-view">
                    <a class="continue-btn" style="text-decoration: none;" href="javascript:void(0)"
                        @click="createDidAction">Continue</a>
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
    /* height: 696px; */
    background: #FFFFFF;
    box-shadow: 0px 0px 15px 0px rgba(30, 92, 239, 0.12);
    border-radius: 20px;
    text-align: center;
}

.title-view {
    padding-top: 80px;
    height: 51px;
}

.title-view span {
    font-size: 36px;
    font-weight: bold;
    color: #1D2129;
    line-height: 55px;
}
</style>

<style scoped>
.content-view {
    margin: 0 auto;
    width: 550px;
    margin-top: 100px;
    padding-bottom: 85px;
    text-align: start;
}

.email-input {
    width: 550px;
    height: 48px;
    border-radius: 4px;
}

.vcode-view {
    width: 550px;
    position: relative;
}

.vcode-input {
    width: 100%;
    height: 48px;
    border-radius: 4px;
}

.vcode-a {
    position: absolute;
    display: block;
    right: 4px;
    top: 4px;
    width: 110px;
    height: 40px;
    background: #1D2129;
    border-radius: 4px;
    text-align: center;
    line-height: 40px;
    color: white;
    font-size: 14px;
    font-weight: 500;
}

.recover-a {
    height: 20px;
    font-size: 14px;
    font-weight: 600;
    color: #1672F0;
    line-height: 21px;
}

.line {
    margin-top: 40px;
    margin-bottom: 29px;
    width: 550px;
    height: 1px;
    border-bottom: 1px solid #E5E6EB;
}

.company-input {
    width: 550px;
    height: 48px;
    border-radius: 4px;
}

.btn-view {
    width: 670px;
    height: 99px;
    margin: 0 auto;
    border-top: 1px solid #E5E6EB;
}

.continue-btn {
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