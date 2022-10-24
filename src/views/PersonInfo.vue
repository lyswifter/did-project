<template>
  <div class="common-layout">
    <el-container>
      <el-header class="headerview">
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo did-menu"
          mode="horizontal"
          :ellipsis="false"
          @select="handleSelect"
        >
          <el-menu-item index="0">
            <img class="logoview" src="../assets/img/LOGO@2x.png" alt="" />
          </el-menu-item>
          <div class="flex-grow" />
          <el-menu-item index="1">
            <div class="profileview">M</div>
          </el-menu-item>
        </el-menu>
      </el-header>

      <el-main class="did-main">
        <div class="fill-view">
          <div class="fill-t-view">
            <h1 class="f-color tell-title">Tell us about yourself</h1>
            <h3 class="f-color tell-sub-title">
              We’ll help you get started based on your choices
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
            <div class="name-left-v">
              <h3 class="f-color fill-title">* First name</h3>
              <el-input
                class="first-name-input h-48"
                v-model="firstnamecontent"
                placeholder="Please input"
              />
            </div>
            <div class="name-right-v">
              <h3 class="f-color fill-title">* Last name</h3>
              <el-input
                class="last-name-input h-48"
                v-model="lastnamecontent"
                placeholder="Please input"
              />
            </div>
          </div>

          <br />

          <div>
            <h3 class="f-color fill-title">Which industry do you operate in</h3>
            <el-input
              v-model="input3"
              placeholder="Please input"
              class="input-with-select"
            >
              <template #append>
                <el-select class=""
                  v-model="select"
                  placeholder="Select"
                  style="width: 115px"
                >
                  <el-option label="Restaurant" value="1" />
                  <el-option label="Order No." value="2" />
                  <el-option label="Tel" value="3" />
                </el-select>
              </template>
            </el-input>
          </div>

          <br>
          <br>

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

export default {
  name: "PersonInfo",
  data() {
    return {
      firstnamecontent: "xxx",
      lastnamecontent: "YYy",
      activeIndex: ref("1"),
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    continueAction() {
        this.$router.push({name: 'home'});
    }
  }
};
</script>

<style scoped>
.f-color {
  color: #1d2129;
}

.h-48 {
  height: 48px;
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

.profile-view {
  margin-top: 10px;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: blue;
  color: white;
  font-size: 24px;
  font-weight: 600;
  line-height: 40px;
  padding-left: 10px;
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
font-family: Poppins-SemiBold, Poppins;
font-weight: 600;
color: #1D2129;
line-height: 21px;
}

.fill-t-view {
  background: #ffffff;
}

.tell-title {
  font-size: 28px;
  font-family: Poppins-Bold, Poppins;
  font-weight: bold;
  color: #1d2129;
  line-height: 42px;
}

.tell-sub-title {
  width: 292px;
height: 17px;
font-size: 12px;
font-family: Poppins-Regular, Poppins;
font-weight: 400;
color: #A9AEB8;
line-height: 18px;
}

.name-left-v {
  float: left;
}

.name-right-v {
  margin-left: 310px;
}

.continue-btn {
  margin-left: 105px;
  width: 400px;
  height: 44px;
  background: #1e5cef;
  border-radius: 24px;
  color: white;
} 
</style>