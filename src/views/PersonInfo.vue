<template>
  <div class="common-layout">
    <el-container>
      <el-header class="headerview">
        <el-menu
          class="el-menu-demo did-menu"
          mode="horizontal"
          :ellipsis="false"
        >
          <el-menu-item index="0">
            <img class="logoview" src="../assets/img/LOGO@2x.png" alt="" />
          </el-menu-item>
          <div class="flex-grow" />
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                        viewBox="0 0 24 24"
                      >
                        <g
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path
                            d="M14 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-2"
                          ></path>
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
        </el-menu>
      </el-header>

      <el-main class="did-main">
        <div class="fill-view">
          <div class="fill-t-view">
            <h1 class="f-color tell-title">Tell us about yourself</h1>
            <h3 class="f-color tell-sub-title">
              We???ll help you get started based on your choices
            </h3>
          </div>

          <br />

          <div>
            <h3 class="f-color fill-title">* Company or Organization</h3>
            <el-input
              class="org-input h-48"
              v-model="orgcontent"
              placeholder="Please input"
            />
          </div>

          <br />

          <div>
            <el-row gutter="20" justify="center">
              <el-col span=12>
                <div class="name-left-v">
              <h3 class="f-color fill-title">* First name</h3>
              <el-input
                class="first-name-input h-48 w-310"
                v-model="firstnamecontent"
                placeholder="Please input"
              />
            </div>
              </el-col>
              <el-col span=12>
                <div class="name-right-v">
              <h3 class="f-color fill-title">* Last name</h3>
              <el-input
                class="last-name-input h-48 w-310"
                v-model="lastnamecontent"
                placeholder="Please input"
              />
            </div>
              </el-col>

            </el-row>
          </div>

          <br />

          <div>
            <h3 class="f-color fill-title">Which industry do you operate in</h3>

            <el-select
              v-model="industryName"
              class="m-2 industrySelect"
              placeholder="Select Industry"
              size="large"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>

          <br />
          <br />

          <el-button class="continue-btn" @click="continueAction"
            >Continue</el-button
          >
        </div>
      </el-main>

      <!-- <el-footer>Footer</el-footer> -->
    </el-container>
  </div>
</template>

<script>
import { ref } from "vue";
import axios from "axios";

import Domain from "../router/domain.js";
let addInfoUrl = Domain.domainUrl + "/api/did-user/additional-information";
let getUserInfoUrl = Domain.domainUrl + "/api/did-user/get-info";

import { ElMessage } from "element-plus";

export default {
  name: "PersonInfo",
  data() {
    return {
      orgcontent: "",
      firstnamecontent: "",
      lastnamecontent: "",
      industryName: "",

      profileName: "",

      options: [
        {
          label: "Blockchain",
          value: "Blockchain",
        },
        {
          label: "Information Technology",
          value: "Information Technology",
        },
        {
          label: "Software",
          value: "Software",
        },
      ],

      activeIndex: ref("1"),
    };
  },
  created() {},
  mounted() {
    this.getUserInfo();
  },
  methods: {
    async continueAction() {
      const res = await axios.post(
        addInfoUrl,
        {
          company: this.orgcontent,
          firstName: this.firstnamecontent,
          lastName: this.lastnamecontent,
          industry: this.industryName,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (res.data.code == 0) {
        localStorage.setItem("token", res.data.data.token);

        this.$router.push({ name: "home" });

        ElMessage({
          message: "Add addition information successed.",
          type: "success",
        });
      } else {
      }
    },
    async getUserInfo() {
      const res = await axios.get(getUserInfoUrl, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      if (res.data.code == 0) {
        if (res.data.data.firstName == undefined) {
          res.data.data.firstName = "";
        }
        if (res.data.data == undefined) {
          res.data.data.lastName = "";
        }
        this.profileName = res.data.data.firstName
          .substring(0, 1)
          .toUpperCase();
      } else {
        ElMessage({
          message: res.data.msg,
          type: "error",
        });
      }
    },
    logoutAction() {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("username");
      window.location.reload();
    },
  },
};
</script>

<style scoped>
.f-color {
  color: #1d2129;
}

.h-48 {
  height: 48px;
}

.w-310 {
  width: 310px;
  background: #F2F3F5;
border-radius: 4px;
}
</style>

<style scoped>
.headerview {
  padding: 0;
}

.logoview {
  width: 84px;
  height: 25px;
  margin-top: 15px;
}

.flex-grow {
  flex-grow: 1;
}

.did-menu {
  height: 60px;
}

.did-main {
  padding: 0;
  background: #f8f9fc;
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
</style>

<style scoped>
.fill-view {
  margin: 0 auto;
  width: 760px;
  height: 796px;
  padding-top: 40px;
  padding-left: 60px;
  padding-right: 60px;
  background: #ffffff;
}

.fill-title {
  height: 20px;
  font-size: 14px;
  font-weight: 600;
  color: #1d2129;
  line-height: 21px;
  margin-bottom: 5px;
}

.fill-t-view {
  background: #ffffff;
}

.tell-title {
  font-size: 28px;
  font-weight: bold;
  color: #1d2129;
  line-height: 42px;
}

.tell-sub-title {
  width: 292px;
  height: 17px;
  font-size: 12px;
  font-weight: 400;
  color: #a9aeb8;
  line-height: 18px;
}

.name-left-v {
  width: 50%;
}

.continue-btn {
  margin-left: 105px;
  width: 400px;
  height: 44px;
  background: #1e5cef;
  border-radius: 24px;
  color: white;
}

.industrySelect {
  width: 640px;
height: 48px;
background: #F2F3F5;
border-radius: 4px;
}
</style>