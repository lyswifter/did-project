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
            <div class="display-right">
              <h2 class="w-color">Credential Verifier</h2>
              <br />
              <h3 class="w-color" @click="toVerifyAction">Easy Verify</h3>
              >
            </div>
          </div>

          <div class="verify-entrance-view">
            <div class="verify-left">
              <h2 class="f-color">Verifiable Credentials</h2>
              <h4 class="l-color">
                Here are all the credentials you issued. You can revoke/unrevoke
                credentials and view persistent credentials stored in Dock
                Certs.
              </h4>
            </div>
            <div class="verify-right">
              <el-button
                color="#1E5CEF"
                class="verify-btn"
                type="primary"
                @click="toCreateAction"
                round
                >Create Verifiable Credential</el-button
              >
            </div>
          </div>

          <div v-if="hasVc" class="vctable-view">
            <n-data-table
              :columns="columns"
              :data="data"
              :pagination="pagination"
              :max-height="250"
              :scroll-x="1800"
            />
          </div>

          <div v-else class="emptyView">
            <el-button
              color="#1E5CEF"
              class="verify-btn create-vc-btn"
              type="primary"
              @click="toCreateAction"
              round
              >Create Verifiable Credential</el-button
            >
          </div>
        </div>

        <div class="bottomLogo">
          <img src="../assets/img/LOGOblue@2x.png" alt="" />
        </div>
      </el-main>

      <!-- SCHEMA DRAWER -->
      <el-drawer
        v-model="schemaVisible"
        :show-close="false"
        size="90%"
        :direction="direction"
      >
        <template #header="{ close }">
          <h4 class="drawer-title">Create Verifiable Credential</h4>
          <img
            class="drawer-close"
            src="../assets/img/close_black@2x.png"
            @click="close"
            alt=""
          />
        </template>

        <div class="select-schema-step">
          <el-button type="primary" class="step-btn" circle>1</el-button>
          Select Schema
          <el-button type="primary" class="continue-btn" @click="toAddRecipient"
            >Continue >
          </el-button>
        </div>

        <br />

        <div class="select-schema-content">
          <el-row :gutter="5">
            <el-col :span="6">
              <div class="card" @click="selectedOne">
                <div
                  class="card-top cardtopnormal"
                  :class="{ cardtopselected: hasSelectedOne }"
                >
                  <img
                    style="width: 285px; height: 250px"
                    src="../assets/img/schema_membership@2x.png"
                    alt=""
                  />
                </div>
                <div
                  class="card-bot cardbotnormal"
                  :class="{ cardbotselected: hasSelectedOne }"
                >
                  Membership Card
                </div>
              </div>
            </el-col>

            <el-col :span="6">
              <div class="card" @click="selectedTwo">
                <div
                  class="card-top cardtopnormal"
                  :class="{ cardtopselected: hasSelectedTwo }"
                >
                  <img
                    style="width: 285px; height: 250px"
                    src="../assets/img/schema_acticit_1y@2x.png"
                    alt=""
                  />
                </div>
                <div
                  class="card-bot cardbotnormal"
                  :class="{ cardbotselected: hasSelectedTwo }"
                >
                  Activity Certificate
                </div>
              </div>
            </el-col>

            <el-col :span="6">
              <div class="card">
                <div class="card-top cardtopnormal">
                  <img
                    style="width: 285px; height: 250px"
                    src="../assets/img/schema_coming@2x.png"
                    alt=""
                  />
                </div>
                <div class="card-bot cardbotnormal">
                  More schema coming soon…
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-drawer>

      <!-- RECIPIENT DRAWER -->
      <el-drawer
        v-model="recipientVisiable"
        :show-close="false"
        size="90%"
        :direction="direction"
      >
        <template #header="{ close }">
          <h4 class="drawer-title">Create Verifiable Credential</h4>
          <img
            class="drawer-close"
            src="../assets/img/close_black@2x.png"
            @click="close"
            alt=""
          />
        </template>

        <div class="select-schema-step">
          <el-button type="primary" class="step-btn" circle>2</el-button>
          Add Recipients
          <el-button type="plain" class="back-btn" round>Back</el-button>
        </div>

        <div v-if="isEmptyRecipient" class="emptyRecipient">
          <img
            style="width: 144px; height: 144px"
            src="../assets/img/add recipients@2x.png"
            alt=""
          />
          <div class="mamualView">
            <el-button
              type="primary"
              class="manually-add-btn"
              color="#1D2129"
              @click="addManualAction"
              round
              >Add Manually</el-button
            >
            <el-button
              type="plain"
              class="import-btn"
              @click="importSheetAction"
              round
              >Import Spreadsheet</el-button
            >
          </div>
        </div>

        <div v-else class="recipientTableView">
          <div class="recipientTopView">
            <el-row gutter="5">
              <el-col span="4">
                <el-button
                  type="primary"
                  class="manually-add-btn"
                  color="#1D2129"
                  @click="addManualAction"
                  round
                  >Add Manually</el-button
                >
              </el-col>

              <el-col span="4">
                <el-button
                  type="plain"
                  class="import-btn"
                  @click="importSheetAction"
                  round
                  >Import Spreadsheet</el-button
                >
              </el-col>

              <el-col span="4" :offset="15">
                <el-button
                  type="primary"
                  class="issue-btn"
                  @click="toIssueCredentials"
                  >Issue Credentials
                </el-button>
              </el-col>
            </el-row>
          </div>

          <!-- table -->
          <n-data-table
            :columns="columns"
            :data="data"
            :pagination="pagination"
            :max-height="734"
            :scroll-x="1800"
          />
        </div>
      </el-drawer>

      <!-- input recipient information -->
      <el-drawer
        v-model="addInfoVisiable"
        :show-close="false"
        size="90%"
        :direction="direction"
      >
        <template #header="{ close }">
          <h4 class="drawer-title">Create Verifiable Credential</h4>
          <img
            class="drawer-close"
            src="../assets/img/close_black@2x.png"
            @click="close"
            alt=""
          />
        </template>
      </el-drawer>
    </el-container>
  </div>
</template>
  
<script>
import { ref, h } from "vue";

const createColumns = () => [
  {
    type: "selection",
    fixed: "left",
  },
  {
    title: "Name",
    key: "name",
    width: 200,
    fixed: "left",
  },
  {
    title: "Age",
    key: "age",
    width: 100,
    fixed: "left",
  },
  {
    title: "Row",
    key: "row",
    render(row, index) {
      return h("span", ["row ", index]);
    },
  },
  {
    title: "Row1",
    key: "row1",
    render(row, index) {
      return h("span", ["row ", index]);
    },
  },
  {
    title: "Row2",
    key: "row2",
    render(row, index) {
      return h("span", ["row ", index]);
    },
    width: 100,
    fixed: "right",
  },
  {
    title: "Address",
    key: "address",
    width: 200,
    fixed: "right",
  },
];

export default {
  name: "Home",
  components: {},
  data() {
    return {
      activeIndex: ref("1"),
      hasVc: true,
      data: Array.from({ length: 46 }).map((_, index) => ({
        key: index,
        name: `Edward King ${index}`,
        age: 32,
        address: `London, Park Lane no. ${index}`,
      })),
      columns: createColumns(),
      pagination: { pageSize: 10 },
      width: 1200,
      height: 734,

      // schema
      schemaVisible: ref(false),
      direction: ref("btt"),
      hasSelectedOne: false,
      hasSelectedTwo: false,

      //recipient
      recipientVisiable: ref(false),
      isEmptyRecipient: true,
    };
  },
  created() {},
  mounted() {
    this.isEmptyRecipient = false;
  },
  methods: {
    toVerifyAction() {
      // this.$router.push({ name: "personInfo" });
      alert("TO VERIFY ACTION");
    },
    toCreateAction() {
      this.schemaVisible = true;
      this.recipientVisiable = false;
    },
    selectedOne() {
      this.hasSelectedTwo = false;
      this.hasSelectedOne = !this.hasSelectedOne;
    },
    selectedTwo() {
      this.hasSelectedOne = false;
      this.hasSelectedTwo = !this.hasSelectedTwo;
    },
    toAddRecipient() {
      this.schemaVisible = false;
      this.recipientVisiable = true;
    },
    addManualAction() {
      alert("addManualAction");
    },
    importSheetAction() {
      alert("importSheetAction");
    },
    toIssueCredentials() {
      alert("toIssueCredentials");
    },
  },
};
</script>

<!-- common -->

<style scoped>
.w-color {
  color: white;
}

.f-color {
  color: #1d2129;
}

.l-color {
  color: #a9aeb8;
}

.round-drawer {
  border-radius: 80px 80px 0px 0px;
}

.drawer-close {
  width: 33px;
  height: 33px;
}

.drawer-title {
  padding-left: 100px;
  width: 403px;
  height: 39px;
  font-size: 28px;
  font-family: Poppins-Bold, Poppins;
  font-weight: bold;
  color: #1d2129;
  line-height: 42px;
}
</style>
  
<!-- layout -->

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
  width: 100%;
  background: linear-gradient(360deg, #eef1f8 0%, #d1dbf4 60%, #eef1f8 100%);
  overflow-y: hidden;
}

.did-footer {
  background: #f5f7fd;
}
</style>

<!-- content 1 -->

<style scoped>
.content-view {
  background: #ffffff;
  border-radius: 80px;
  margin-top: 100px;
  padding-top: 60px;
  padding-left: 120px;
  padding-bottom: 20px;
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
  margin-left: 63%;
  width: 390px;
  height: 140px;
  background-image: url(../assets/img/verify@2x.png);
  background-repeat: no-repeat;
  background-position: 0;
  background-size: contain;
}

.display-right h2 {
  margin-left: 20px;
  padding-top: 20px;
  width: 208px;
  height: 31px;
  font-size: 22px;
  font-family: Poppins-Bold, Poppins;
  font-weight: bold;
  color: #ffffff;
  line-height: 33px;
}

.display-right h3 {
  margin-left: 20px;
  margin-top: 20px;
  width: 160px;
  height: 44px;
  background: #1d2129;
  border-radius: 24px;
  padding: 10px;
  text-align: center;
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
  margin-left: 84%;
}
</style>

<!-- content 2 -->

<style scoped>
.emptyView {
  width: 1200px;
  height: 326px;
  background: linear-gradient(270deg, #0b224f 0%, #1d2129 100%);
  border-radius: 8px;
}

.create-vc-btn {
  margin-top: 222px;
  margin-left: 140px;
}

.vctable-view {
  width: 1200px;
}

.bottomLogo img {
  widows: 85px;
  height: 25px;
  margin-left: 120px;
  margin-top: 20px;
}
</style>

<!-- schema step 1 -->

<style scoped>
.select-schema-step {
  margin: 0 auto;
  width: 1200px;
  height: 100px;
  border-radius: 8px;
  border: 2px solid #272e3b;
  line-height: 100px;
  padding-left: 20px;
  font-size: 22px;
  font-family: Poppins-Medium, Poppins;
  font-weight: 500;
  color: #1d2129;
}

.step-btn {
  width: 32px;
  line-height: 25px;
  font-size: 16px;
  font-weight: 500;
  font-family: Poppins-Medium, Poppins;
  background: #1e5cef;
  color: #ffffff;
}

.continue-btn {
  margin-left: 75% !important;
  height: 34px;
  background: #1e5cef;
  border-radius: 24px;
}

.card {
  width: 285px;
  height: 326px;
}

.select-schema-content {
  padding-left: 100px;
}

.card-top {
  border-width: 1px;
}

.card-bot {
  text-align: center;
  width: 285px;
  height: 76px;
  font-size: 20px;
  font-family: Poppins-Medium, Poppins;
  font-weight: 500;
  color: #1d2129;
  line-height: 76px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

.cardtopnormal {
  border-color: #a9aeb8;
  border-style: dashed;
}

.cardtopselected {
  border-color: #1e5cef;
  border-style: solid;
}

.cardbotnormal {
  border-left: 1px solid #a9aeb8;
  border-right: 1px solid #a9aeb8;
  border-bottom: 1px solid #a9aeb8;
}

.cardbotselected {
  border-left: 1px solid #1e5cef;
  border-right: 1px solid #1e5cef;
  border-bottom: 1px solid #1e5cef;
}
</style>

<!-- recipient step 2 -->
<style scoped>
.back-btn {
  margin-left: 65% !important;
}

.issue-btn {
  background-color: #1e5cef;
}

.emptyRecipient {
  margin-top: 10px;
  margin-left: 100px;
  width: 1200px;
  height: 351px;
  border-radius: 8px;
  border: 1px solid #a9aeb8;
  text-align: center;
}

.emptyRecipient img {
  margin: 0 auto;
  margin-top: 48px;
}

.recipientTableView {
  padding-bottom: 20px;
  margin-left: 100px;
  margin-top: 20px;
  width: 1200px;
  border-radius: 8px;
  border: 1px solid #a9aeb8;
}

.recipientTopView {
  padding: 16px;
}
</style>