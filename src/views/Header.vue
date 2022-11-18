<template>
    <!-- <el-menu class="el-menu-demo did-menu" mode="horizontal" :ellipsis="false">
        <el-menu-item index="0">
            <img class="logoview" src="../assets/img/logo_Dmaster.svg" alt="" />
        </el-menu-item>

        <el-menu-item index="1">
            <n-popover trigger="click" placement="bottom-start">
                <template #trigger>
                    <div class="profileView">
                        {{ profileName }}
                    </div>
                </template>

                <div>
                    <n-button text color="#ff69b4" @click="logoutAction">
                        <template #icon>
                            <n-icon>
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                    viewBox="0 0 24 24">
                                    <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round">
                                        <path
                                            d="M14 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-2">
                                        </path>
                                        <path d="M7 12h14l-3-3m0 6l3-3"></path>
                                    </g>
                                </svg>
                            </n-icon>
                        </template>
                        Sign out
                    </n-button>
                </div>
            </n-popover>
        </el-menu-item>
    </el-menu> -->

    <el-row class="dm-row">
        <el-col :span="3">
            <a href="javascript:void(0)" @click="reloadPage">
                <div class="logoview">
                    <img src="../assets/img/logo_Dmaster.svg" alt="">
                </div>
            </a>
        </el-col>

        <el-col :span="18">
            <el-row :gutter="40" justify="center">
                <el-col :span="3">
                    <a class="menu-title" href="javascript:void(0)"
                        @click="scrollIntoView('#highlightAnchor')">Highlights</a>
                </el-col>
                <el-col :span="3">
                    <a class="menu-title" href="javascript:void(0)"
                        @click="scrollIntoView('#featuresAnchor')">Features</a>
                </el-col>
                <el-col :span="3">
                    <a class="menu-title" href="javascript:void(0)"
                        @click="scrollIntoView('#architectureAnchor')">Technology</a>
                </el-col>
                <el-col :span="3">
                    <a class="menu-title" href="javascript:void(0)"
                        @click="scrollIntoView('#roadmapAnchor')">Roadmap</a>
                </el-col>
            </el-row>
        </el-col>

        <el-col :span="3">
            <a class="menu-btn" :href="issueUrl">Dmaster APP</a>
        </el-col>
    </el-row>
</template>

<script lang="js">
import { ref } from "vue";

export default {
    name: "HeaderView",
    data() {
        return {
            profileName: "liuyong",
        };
    },
    created() { },
    mounted() {
    },
    watch: {

    },
    methods: {
        logoutAction() {
            window.localStorage.removeItem("token");
            window.localStorage.removeItem("username");
            window.location.reload();
        }
    }
}
</script>

<style scoped>
.logoview {
    width: 84px;
    height: 25px;
}

.flex-grow {
    flex-grow: 1;
}

.profileView {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    color: white;
    font-size: 24px;
    font-weight: 600;
    line-height: 40px;
    background-image: url(../assets/img/avatar48px@2x.png);
    background-repeat: no-repeat;
    background-position: -1, -1;
    background-size: contain;
    text-align: center;
}

.dm-header {
    padding: 0;
    height: 80px;
}

.logo-dark img {
    width: 155px;
    height: 25px;
    vertical-align: middle;
}

.topAnchor {
    position: sticky;
    top: 0;
    z-index: 99;
    background-color: rgb(32, 40, 66, 1);
    /* backdrop-filter: blur(10); */
}

.headerscroll {
    /* opacity: 0.8; */
    /* background-color: rgb(32, 40, 66, 0.8); */
}

.dm-row {
    line-height: 80px;
}

.dm-empty {
    border: 1px solid transparent;
}

.menu-title {
    font-size: 16px;
}

.logoview img {
    width: 155px;
    height: 24px;
    vertical-align: middle;
}

.menu-btn {
    margin-top: 11%;
    display: block;
    text-align: center;
    width: 130px;
    height: 32px;
    background: #3670E8;
    border-radius: 20px;
    line-height: 32px;
    font-size: 16px;
}

.menu-btn:hover {
    color: white;
    opacity: 0.7;
}
</style>