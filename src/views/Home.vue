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
            <img
              class="avatarbg"
              src="../assets/img/avatar48px@2x.png"
              alt=""
            />
            <div class="profileview">M</div>
          </el-menu-item>
        </el-menu>
      </el-header>

      <el-main class="did-main">
        <div class="info-left">
          <img
            class="info-icon"
            src="../assets/img/avatardefault_128px@2x.png"
            alt=""
          />
        </div>

        <div class="info-right">
          <h2 class="name">Mona Brewer</h2>
          <h3 class="did">
            did:did:z6MkjeNFyRtJzSnBjLKBkMWUyhDSw3hTrRWCoasrjE8UjLq9
          </h3>
          <div class="org">
            <img src="../assets/img/icon_company@2x.png" alt="" />
            <span>Tianru network technology</span>
          </div>
        </div>

        <div class="content-view">
          <div class="credential-display">
            <div class="display-left">
              <h2 class="dis-title f-color">Credentials</h2>
              <h1 class="dis-count f-color">500</h1>
            </div>
            <div class="display-right"></div>
          </div>

          <div class="verify-entrance-view">
          <div class="verify-left">
            <h2 class="f-color">Verifiable Credentials</h2>
            <h4 class="l-color">
              Here are all the credentials you issued. You can revoke/unrevoke
              credentials and view persistent credentials stored in Dock Certs.
            </h4>
          </div>
          <div class="verify-right">
            <el-button color="#1E5CEF" class="verify-btn" type="primary" @click="toVerifyAction" round
              >Create Verifiable Credential</el-button
            >
          </div>
        </div>

        </div>
      </el-main>

      <!-- <el-footer>Footer</el-footer> -->
    </el-container>
  </div>
</template>
  
  <script>
import { ref } from "vue";

export default {
  name: "Home",
  data() {
    return {
      activeIndex: ref("1"),
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    toVerifyAction() {
        this.$router.push({name: 'personInfo'});
    }
  }
}
</script>

<style scoped>
.f-color {
  color: #1d2129;
}

.l-color {
  color: #A9AEB8;
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

.profileview {
  margin-top: 10px;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  color: white;
  font-size: 24px;
  font-weight: 600;
  line-height: 40px;
}

.avatarbg {
  margin-top: 10px;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  position: absolute;
  top: 0;
  left: 10px;
}

.did-menu {
  height: 60px;
  background: #eef1f8;
}

.did-main {
  padding: 0;
  width: 100%;
  height: 868px;
  background: linear-gradient(360deg, #eef1f8 0%, #d1dbf4 60%, #eef1f8 100%);
}

.did-footer {
  background: #f5f7fd;
}
</style>

<style scoped>
.content-view {
  background: #ffffff;
  border-radius: 80px;
  margin-top: 100px;
  padding-top: 60px;
  padding-left: 120px;
}

.info-icon {
  width: 128px;
  height: 128px;
  margin-left: 120px;
  margin-top: 40px;
}

.info-left {
  float: left;
}

.info-right {
  margin-top: 45px;
  margin-left: 268px;
}

.name {
  width: 243px;
  height: 51px;
  font-size: 36px;
  font-family: Poppins-Bold, Poppins;
  font-weight: bold;
  color: #272e3b;
  line-height: 55px;
}

.did {
  width: 568px;
  height: 25px;
  font-size: 18px;
  font-family: Poppins-Regular, Poppins;
  font-weight: 400;
  color: #8998ba;
  line-height: 27px;
}

.org {
  margin-top: 5px;
  height: 25px;
  width: auto;
  background-color: #f5f7fd;
  border-radius: 16px;
  inline-size: fit-content;
  padding-right: 5px;
  padding-left: 5px;
}

.org img {
  vertical-align: top;
  width: 24px;
  height: 24px;
}

.org span {
  color: #272e3b;
  font-size: 18px;
  font-family: Poppins-Regular, Poppins;
  font-weight: 400;
  line-height: 27px;
}

.credential-display {
  height: 140px;
}

.display-left {
  float: left;
  padding-left: 20px;
  width: 790px;
  height: 140px;
  border-radius: 8px;
  border: 2px solid #272e3b;
  background-image: url(../assets/img/credential@2x.png);
  background-repeat: no-repeat;
  background-position: 0;
}

.dis-title {
  margin-top: 20px;
  width: 133px;
  height: 31px;
  font-size: 22px;
  font-family: Poppins-Bold, Poppins;
  font-weight: bold;
  color: #1d2129;
  line-height: 33px;
}

.dis-count {
  margin-top: 12px;
  width: 89px;
  height: 67px;
  font-size: 48px;
  font-family: Poppins-Light, Poppins;
  font-weight: 300;
  color: #222222;
  line-height: 72px;
}

.display-right {
  margin-left: 930px;
}

.verify-entrance-view {
  width: 1200px;
  height: 116px;
  margin-top: 30px;
  background: #ffffff;
}

.verify-left {
  float: left;
}

.verify-right {
  margin-left: 1080px;
}
</style>