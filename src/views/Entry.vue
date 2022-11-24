<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "Entry",
    components: {},
    data() {
        return {}
    },
    mounted() {

    },
    methods: {
        reloadPage() {
            location.reload()
        },
        createAction() {
            this.$router.push({ name: "create" });
        },
        recoveryAction() {
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
                    <a href="javascript:void(0)" @click="createAction" style="text-decoration: none;">
                        <div class="create-btn">
                            <div class="w-color f-24-500">Create a DID</div>
                            <div class="w-color f-18-400 op-50">Create a new DID</div>
                        </div>
                    </a>
                    <br>
                    <h3>OR</h3>
                    <br>
                    <a href="javascript:void(0)" @click="recoveryAction" style="text-decoration: none;">
                        <div class="recovery-btn">
                        <div class="f-24-500 lb-color">Recover DID</div>
                        <div class="f-18-400 lb-color op-50">Recover existing DID</div>
                    </div>
                    </a>
                </div>

                <img style="width: 64px;height: 64px;margin-top: 30px;" src="../assets/img/编组_3.svg" alt="">
            </div>

            <img style="width: 69px;height: 72px;position: absolute;right: 60px;bottom: 60px;" src="../assets/img/LOGO_D.svg" alt="">
        </el-main>
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
    height: 696px;
    padding-bottom: 150px;
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

.content-view {
    margin: 0 auto;
    margin-top: 130px;
    padding-top: 60px;
    width: 550px;
    height: 365px;
    background: #F7F8FA;
    border-radius: 8px;
}

.create-btn {
    padding: 15px 0;
    margin: 0 auto;
    width: 360px;
    height: 90px;
    background: #1E5CEF;
    border-radius: 60px;
}

.create-btn:hover {
    width: 360px;
    height: 90px;
    background: #3471FF;
    box-shadow: 0px 7px 20px 0px rgba(22, 114, 240, 0.2);
    border-radius: 60px;
}

.recovery-btn {
    padding: 15px 0;
    margin: 0 auto;
    width: 360px;
    height: 90px;
    background: #FFFFFF;
    border-radius: 60px;
    border: 2px solid #1E5CEF;
}

.recovery-btn:hover {
    width: 360px;
    height: 90px;
    background: #F7F8FA;
    box-shadow: 0px 7px 20px 0px rgba(22, 114, 240, 0.2);
    border-radius: 60px;
    border: 2px solid #1E5CEF;
}
</style>