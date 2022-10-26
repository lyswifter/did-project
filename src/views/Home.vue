<template>
  <div class="common-layout">
    <el-container>
      <el-header class="headerview">
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo did-menu"
          mode="horizontal"
          :ellipsis="false"
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
          <h2 class="name">{{userInfo.firstName + userInfo.lastname}}</h2>
          <h3 class="did">
            {{userInfo.did}}
          </h3>
          <div class="org">
            <img src="../assets/img/icon_company@2x.png" alt="" />
            <span>{{userInfo.company}}</span>
          </div>
        </div>

        <div class="content-view">
          <div class="credential-display">
            <div class="display-left">
              <h2 class="dis-title f-color">Credentials</h2>
              <h1 class="dis-count f-color">{{userInfo.credentialCount}}</h1>
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
                @click="toCreateVcAction"
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
              :max-height="600"
              :scroll-x="1000"
            />
          </div>

          <div v-else class="emptyView">
            <el-button
              color="#1E5CEF"
              class="verify-btn create-vc-btn"
              type="primary"
              @click="toCreateVcAction"
              round
              >Create Verifiable Credential</el-button
            >
          </div>
        </div>

        <div class="bottomLogo">
          <img src="../assets/img/LOGOblue@2x.png" alt="" />
        </div>
      </el-main>

      <!-- DRAWER -->

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
          <el-row>
            <el-col span="2">
              <el-button
                v-if="vcStep == 1"
                type="primary"
                class="step-btn"
                circle
                >{{ vcStep }}</el-button
              >
              <el-button
                v-else-if="vcStep == 2"
                type="primary"
                class="step-btn"
                circle
                >{{ vcStep }}</el-button
              >
              <el-button
                v-else-if="vcStep == 3"
                type="primary"
                class="step-btn"
                circle
                >{{ vcStep }}</el-button
              >
            </el-col>

            <el-col span="18">
              <div v-if="vcStep == 1">
                <h3 class="step-title">Select Schema</h3>
                <h4 class="step-subtitle"></h4>
              </div>
              <div v-else-if="vcStep == 2">
                <h3 v-if="!processing" class="step-title">Add Recipients</h3>
                <h3 v-else class="step-title">Issuing credential...</h3>

                <h4 v-if="!processing" class="step-subtitle"></h4>
                <h4 v-else class="step-subtitle">
                  Please don’t close this window.
                </h4>
              </div>
              <div v-else-if="vcStep == 3">
                <h3 v-if="createOk" class="step-title">
                  {{newVcNum}}
                </h3>
                <h3 v-else class="step-title">Issue failed</h3>

                <h4 v-if="createOk" class="step-subtitle">
                  The VC certificate has been successfully sent to the recipient
                  and has been backed up on the chain.
                </h4>
                <h4 v-else class="step-subtitle">
                  Description of the reason for the failure
                </h4>
              </div>
            </el-col>

            <el-col span="4" :offset="18">
              <div v-if="vcStep == 1">
                <el-button
                  type="primary"
                  class="continue-btn"
                  @click="toAddRecipient"
                  >Continue ></el-button
                >
              </div>

              <div v-else-if="vcStep == 2">
                <div v-if="!processing">
                  <el-button
                    type="plain"
                    class="back-btn"
                    @click="backAction"
                    round
                    >Back</el-button
                  >
                </div>
              </div>

              <div v-else-if="vcStep == 3">
                <div v-if="!createOk">
                  <el-button
                    type="plain"
                    class="back-btn"
                    @click="backAction"
                    round
                    >Back</el-button
                  >
                </div>
              </div>
            </el-col>
          </el-row>
        </div>

        <div v-if="vcStep == 1" class="select-schema-content">
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

        <div v-else-if="vcStep == 2">
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
              :columns="recipientTableColumns"
              :data="recipientTableData"
              :pagination="pagination"
              :max-height="600"
              :scroll-x="1000"
              :row-key="rowKey"
              v-model:checked-row-keys="recipientCheckedRowKeys"
            />

            <div v-if="processing" class="maskview">
              <el-progress
                class="progressView"
                type="circle"
                :percentage="percentageCount"
              />
            </div>
          </div>
        </div>

        <div v-else-if="vcStep == 3">
          <div v-if="createOk" class="okCreatedVc">
            <el-row>
              <el-col span="2" :offset="17">
                <el-button
                  type="plain"
                  class="manually-add-btn"
                  @click="toDownloadAction"
                  round
                  >Download Credential</el-button
                >
              </el-col>

              <el-col span="2" style="margin-left: 10px">
                <el-button
                  type="primary"
                  class="manually-add-btn"
                  color="#1E5CEF"
                  @click="toViewVcsAction(newVcId[0])"
                  round
                  >View Credential</el-button
                >
              </el-col>
            </el-row>
          </div>
        </div>
      </el-drawer>

      <!-- Verify Credential -->

      <el-drawer
        v-model="veriferVisible"
        :show-close="false"
        size="90%"
        :direction="direction"
      >
        <template #header="{ close }">
          <h4 class="drawer-title">Credential Verifier</h4>
          <img
            class="drawer-close"
            src="../assets/img/close_black@2x.png"
            @click="close"
            alt=""
          />
        </template>

        <div class="verifyContentView">
          <div class="verifyFile">
            <img
              style="width: 64px; height: 64px"
              src="../assets/img/file@2x.png"
              alt=""
            />
            <div class="addFileView">
              <h3>Drag & drop your file</h3>
              <el-button
                type="plain"
                class="import-btn"
                @click="chooseJsonFile"
                round
                >Choose JSON File</el-button
              >
            </div>
          </div>

          <div class="fileShowView">
            <el-row>
              <el-col span="18" :offset="1">
                <h3 class="filenamesView">xxxxx.json</h3>
              </el-col>
              <el-col span="6" :offset="18">
                <el-button round>Delete</el-button>
                <el-button type="primary" round>Verify</el-button>
              </el-col>
            </el-row>
          </div>

          <div class="verifyResultView">
            <div class="resTopView">
              <img
                style="width: 32px; height: 32px"
                src="../assets/img/success@2x.png"
                alt=""
              />
              <h2>Verified</h2>
            </div>

            <div class="resBotView">
              <h3>Alice Haynes issued to Lulu Reyes</h3>
              <h4>Issuer: Alice Haynes</h4>
              <h4>IssuerDid: xxxxx</h4>
              <h4>Type: ["VerifiaableCredential", "Membership Card"]</h4>
              <h4>Issue date: 2022-10-23T12:45:10.302Z</h4>
              <h4>Expire date: xxxx</h4>
              <h4>Holder: Lulu Reyes</h4>
              <h4>Holder did: YYYY</h4>
              <h4>Credential type:</h4>
              <h4>
                Proof:
                hfoiwefgoenfmosdnfsdofjsdofsodfshdifhsdohfsodfhsodhfsodhfo
              </h4>
            </div>
          </div>
        </div>
      </el-drawer>

      <!-- dialog input recipient information -->

      <el-dialog
        v-model="inputRecipientVisiable"
        :show-close="false"
        :direction="direction"
      >
        <template #header="{ close }">
          <h4 class="dialog-header-title">Add Recipients</h4>
          <img
            class="dialog-close"
            src="../assets/img/close_black@2x.png"
            @click="close"
            alt=""
          />
        </template>

        <div class="addRecipientContent">
          <div v-for="item in inputRecipientsData" :key="item.claimSort">
            <h3 class="dialog-title">{{item.claimName}}</h3>
            <el-input
              class="inputw"
              v-model="item.claimContent"
              placeholder="Please input"
            />
            <h4 class="dialog-subtitle">
              {{item.claimDesc}}
            </h4>
          </div>

          <div>
            <el-checkbox
              v-model="checked1"
              label=" Expire this credential"
              size="large"
            />
            <h4 class="dialog-subtitle">
              This option will expire the credential after the specified date.
            </h4>
          </div>

          <div>
            <el-row gutter="5">
              <el-col span="11">
                <h3 class="dialog-title">* Issue Date</h3>
                <el-date-picker
                  v-model="issueDate"
                  type="date"
                  placeholder="Pick a day"
                  format="YYYY/MM/DD"
                  value-format="YYYY-MM-DD"
                />
              </el-col>
              <el-col span="11" :offset="1">
                <h3 class="dialog-title">Expiration Date</h3>
                <el-date-picker
                  v-model="expireDate"
                  type="date"
                  placeholder="Pick a day"
                  format="YYYY/MM/DD"
                  value-format="YYYY-MM-DD"
                />
              </el-col>
            </el-row>
          </div>
        </div>

        <div class="addRecipientBotView">
          <el-button
            type="primary"
            size="large"
            class="add-recipient-info-btn"
            @click="addRecipientAction"
            round
            >Add Recipient
          </el-button>
        </div>
      </el-dialog>
    </el-container>
  </div>
</template>
  
<script>
import { ref, h } from "vue";

import axios from "axios";

import Domain from "../router/domain.js";
let getUserInfoUrl = Domain.domainUrl + "/tr/did-user/get-info";
let vcTableUrl = Domain.domainUrl + "/tr/did-document-credential/credential-list";
let getTemplListUrl = Domain.domainUrl + "/tr/did-document-credential/template-list";
let templateClaimUrl = Domain.domainUrl + "/tr/did-document-credential/template-claim";
let issueVcUrl = Domain.domainUrl + "/tr/did-document-credential/credential";
let singleDownloadUrl = Domain.domainUrl + "/tr/did-document-credential/credential-download/";
let batchDownloadUrl = Domain.domainUrl + "/tr/did-document-credential/credential-download";
let viewVcPicUrl = Domain.domainUrl + "/tr/did-document-credential/view-credential/";

import { ElMessage } from 'element-plus'

const createColumns = () => [
  {
    type: "selection",
    fixed: "left",
    width: 25,
  },
  {
    title: "Credential ID",
    key: "credentialId",
    width: 80,
  },
  {
    title: "Holder Did",
    key: "holderDid",
    width: 80,
  },
  {
    title: "Holder Name",
    key: "holderName",
    width: 50,
  },
  {
    title: "Type",
    key: "credentialType",
    width: 50,
  },
  {
    title: "Issue AT",
    key: "issueDate",
    width: 50,
  },
  {
    title: "Expires AT",
    key: "expireDate",
    width: 50,
  },
  {
    title: "State",
    key: "",
    width: 50,
    render(row, index) {
      return h("span", ["row ", index]);
    },
  },
  {
    title: "Operations",
    key: "",
    width: 50,
    render(row, index) {
      return h("span", ["row ", index]);
    },
  },
];

export default {
  name: "Home",
  components: {},
  data() {
    return {
      activeIndex: ref("1"),
      hasVc: true,
      userInfo: {},
      data: [],
      columns: createColumns(),
      pagination: { pageSize: 10 },
      width: 1200,
      height: 734,

      vcStep: 1,
      processing: ref(false),
      percentageCount: 0,
      percentageTotal: 100,
      timer: {},
      createOk: true,

      // schema
      schemaVisible: ref(false),
      schemaList: [],
      schemaType: "",
      schemaId: 0,
      direction: ref("btt"),
      hasSelectedOne: false,
      hasSelectedTwo: false,

      //recipient
      recipientVisiable: ref(false),
      isEmptyRecipient: true,
      recipientTableData: [],
      recipientTableColumns: [],
      recipientCheckedRowKeys: [],
      recipientIdx: 1,

      //input recipient
      inputRecipientVisiable: ref(false),
      inputRecipientsData: [],
      issueDate: null,
      expireDate: null,

      //credential
      newVcId: [],
      newVcNum: "",

      //verify crendentail
      veriferVisible: ref(false),
    };
  },
  created() {},
  mounted() {
    this.getUserInfo();
    this.getVcTableInfo();
  },
  methods: {
    async getUserInfo(){
      const res = await axios.post(getUserInfoUrl,{},{
        headers: {
          Authorization: localStorage.getItem("token"),
        }
      });

      if (res.data.code == 0) {
        this.userInfo = res.data.data;
      }
      else if(res.data.code == 100002) {
        this.$router.push({name: 'personInfo'});
      }
      else {
      }
    },
    async getVcTableInfo() {
      const res = await axios.post(vcTableUrl, {
          page: 1,
          size: 10,
        },{
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      console.log(res.data)

      if (res.data.code == 0) {
        this.data = res.data.data.records;

        if (this.data.length == 0) {
          this.hasVc = false;
        }
      }
    },
    backAction() {
      this.vcStep = this.vcStep - 1;
    },
    toVerifyAction() {
      this.veriferVisible = true;
    },
    async toCreateVcAction() {
      // 1.get template list
      const res = await axios.get(getTemplListUrl, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      if (res.data.code == 0) {
        this.schemaList = res.data.data;
        this.schemaVisible = true;
        this.vcStep = 1;
      }
    },
    selectedOne() {
      this.hasSelectedTwo = false;
      this.hasSelectedOne = !this.hasSelectedOne;

      if (this.hasSelectedOne) {
        this.schemaType = "Membership Card";
      } else {
        this.schemaType = "";
      }
    },
    selectedTwo() {
      this.hasSelectedOne = false;
      this.hasSelectedTwo = !this.hasSelectedTwo;

      if (this.hasSelectedTwo) {
        this.schemaType = "Activity Certificate";
      } else {
        this.schemaType = "";
      }
    },
    async toAddRecipient() {
      if (this.schemaType == "") {
        alert("Schema type must not be empty");
        return  
      }

      // get recipients list

      this.vcStep = 2;
      this.isEmptyRecipient = false;
      this.recipientIdx = 1;

      if (this.schemaType == "Membership Card") {
        this.schemaId = 1;
      } else if (this.schemaType == "Activity Certificate") {
        this.schemaId = 2;
      }

      // get template claim infornation
      const res = await axios.post(templateClaimUrl,{
        templateId: this.schemaId,
      },{
        headers: {
          Authorization: localStorage.getItem("token"),
        }
      });

      if (res.data.code == 0) {
        this.inputRecipientsData = res.data.data;
        this.createRecipientColumns(this.inputRecipientsData);
      }
      else {
      }
    },
    async addManualAction() {
      this.inputRecipientsData.forEach(element => {
        element.claimContent = null
      });
      this.inputRecipientVisiable = true;
    },
    addRecipientAction() {
      let obj = {}
      this.inputRecipientsData.forEach(element => {
        obj[element.claimCode] = element.claimContent;
      });
      obj["issueDate"] = this.issueDate;
      obj["expireDate"] = this.expireDate;
      obj["idx"] = this.recipientIdx;

      this.recipientTableData.push(obj);

      this.recipientIdx = this.recipientIdx + 1;
      this.inputRecipientVisiable = false;
    },
    importSheetAction() {
      alert("importSheetAction");
    },
    async toIssueCredentials() {
      console.log(this.recipientCheckedRowKeys);
      console.log(this.recipientTableData);
      this.processing = true;

      // let timer = setInterval(() => {

      // }, 500)

      let needClaims = []
      this.recipientCheckedRowKeys.forEach(checkKeys => {
        for (let i = 0; i < this.recipientTableData.length; i++) {
          const element = this.recipientTableData[i];
          if (checkKeys == element.idx) {
            let obj = {
              "issueDate": element.issueDate,
              "expireDate": element.expireDate,
              "expireFlag": 0,
            }

            let objCopy = element;
            delete objCopy.issueDate;
            delete objCopy.expireDate;
            delete objCopy.idx;

            obj["claimsStr"] = JSON.stringify(objCopy);

            needClaims.push(obj);
            break
          }
        }
      });

      if (needClaims.length == 0) {
        alert("need claim must not be empty");
        return
      }

      const res = await axios.post(issueVcUrl,{
        claims: needClaims,
        templateId: this.schemaId,
      },{
        headers: {
          Authorization: localStorage.getItem("token"),
        }
      });

      if (res.data.code == 0) {
        // clearInterval(timer);
        this.newVcId = res.data.data;
        this.newVcNum = "Issued " + this.newVcId.length + " Verifiable Credential";
        this.processing = false;
        this.vcStep = 3;
        this.createOk = true;
      } else {

      }
    },
    toDownloadAction() {
      if (this.newVcId.length > 1) {
        this.batchDownloadAction(this.newVcId);
      } else {
        this.singleDownloadAction(this.newVcId[0]);
      }
    },
    async toViewVcsAction(vcid) {
      const res = await axios.get(viewVcPicUrl+vcid,{
        headers: {
          Authorization: localStorage.getItem("token"),
        }
      });

      console.log(res.data);
    },

    createRecipientColumns(orign) {
      let cols = []
      let first = {
        type: "selection",
        fixed: "left",
        width: 25,
      }
      cols.push(first);

      orign.forEach(element => {
        let claimName = "";
        let isinclude = element.claimName.includes('* ');
        if (isinclude) {
          claimName = element.claimName.substring(1);
        } else {
          claimName = element.claimName;
        }

        let obj = {
          title: claimName,
          key: element.claimCode,
          width: 80,
        }

        cols.push(obj);
      });

      let issue = {
        title: "Issue AT",
        key: "issueDate",
        width: 80,
      }

      let expire = {
        title: "Expire AT",
        key: "expireDate",
        width: 80,
      }

      cols.push(issue);
      cols.push(expire);

      this.recipientTableColumns = cols;
    },
    rowKey: (row) => row.idx,
    async batchDownloadAction(ids) {
      const res = await axios.post(batchDownloadUrl,{
        credentialIds: ids,
      },{
        headers: {
          Authorization: localStorage.getItem("token"),
        }
      });

      console.localStorage(res.data);
    },
    async singleDownloadAction(id) {
      const res = await axios.get(singleDownloadUrl+id,{
        headers: {
          Authorization: localStorage.getItem("token"),
          Accept: "application/x-www-form-urlencoded",
        }
      });

      //
      console.log(res.data);
    },
  },
  unmounted() {
    this.timer = {};
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

.dialog-header-title {
  float: left;
  width: 95%;
  height: 39px;
  font-size: 28px;
  font-family: Poppins-Bold, Poppins;
  font-weight: bold;
  color: #1d2129;
  line-height: 42px;
}

.dialog-close {
  width: 33px;
  height: 33px;
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
  text-align: center;
}

.create-vc-btn {
  margin-top: 150px;
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
  padding-left: 20px;
  font-size: 22px;
  font-family: Poppins-Medium, Poppins;
  font-weight: 500;
  color: #1d2129;
}

.step-btn {
  margin-top: 20px;
  width: 32px;
  line-height: 25px;
  font-size: 16px;
  font-weight: 500;
  font-family: Poppins-Medium, Poppins;
  background: #1e5cef;
  color: #ffffff;
}

.step-title {
  margin-top: 10px;
  padding-left: 10px;
  height: 31px;
  font-size: 22px;
  font-family: Poppins-Medium, Poppins;
  font-weight: 500;
  color: #1d2129;
  line-height: 33px;
}

.step-subtitle {
  padding-left: 10px;
  height: 23px;
  font-size: 16px;
  font-family: Poppins-Regular, Poppins;
  font-weight: 400;
  color: #86909c;
  line-height: 25px;
}

.continue-btn {
  margin-top: 30px;
  height: 34px;
  background: #1e5cef;
  border-radius: 24px;
}

.card {
  width: 285px;
  height: 326px;
}

.select-schema-content {
  margin-top: 20px;
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

.maskview {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: #646973;
  opacity: 0.9;
  backdrop-filter: blur(5px);
  z-index: 100;
  text-align: center;
}

.progressView {
  margin-top: 100px;
}

.okCreatedVc {
  padding-top: 20px;
  margin-left: 100px;
  width: 1200px;
  height: 84px;
  background: #f7f8fa;
  border-radius: 8px;
}
</style>

<style scoped>
.dialog-title {
  height: 20px;
  font-size: 14px;
  font-family: Poppins-SemiBold, Poppins;
  font-weight: 600;
  color: #1d2129;
  line-height: 21px;
}

.dialog-subtitle {
  height: 17px;
  font-size: 12px;
  font-family: Poppins-Regular, Poppins;
  font-weight: 400;
  color: #86909c;
  line-height: 18px;
}

.inputw {
  width: 640px;
  height: 48px;
  background: #f2f3f5;
  border-radius: 4px;
}

.addRecipientBotView {
  text-align: center;
  padding: 20px;
}

.add-recipient-info-btn {
  width: 400px;
  height: 44px;
  background: #c9cdd4;
  border-radius: 24px;
}
</style>

<!-- Verify -->

<style scoped>
.verifyContentView {
  margin-left: 100px;
}

.verifyFile {
  width: 1200px;
  height: 200px;
  background: #f2f3f5;
  border-radius: 8px;
  border: 2px solid #272e3b;
  /* text-align: center; */
}

.fileShowView {
  width: 1200px;
  height: 84px;
  background: #f7f8fa;
  border-radius: 8px;
  line-height: 84px;
}

.verifyResultView {
  margin-top: 20px;
  width: 1200px;
  height: 340px;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #a9aeb8;
}

.verifyFile img {
  float: left;
  margin-top: 40px;
  margin-left: 35%;
  margin-right: 10px;
}

.addFileView {
  margin-top: 40px;
  padding-left: 10px;
}

.addFileView h3 {
  height: 31px;
  font-size: 22px;
  font-family: Poppins-Medium, Poppins;
  font-weight: 500;
  color: #1d2129;
  line-height: 33px;
}

.filenamesView {
  height: 20px;
  font-size: 14px;
  font-family: Poppins-Regular, Poppins;
  font-weight: 400;
  color: #1d2129;
}

.resTopView {
  width: 1200px;
  height: 72px;
  padding-left: 20px;
  background: #f2f3f5;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  line-height: 72px;
}

.resTopView img {
  margin-top: 20px;
  float: left;
  margin-right: 5px;
}

.resTopView h2 {
  font-size: 18px;
  font-family: Poppins-Bold, Poppins;
  font-weight: bold;
  color: #1d2129;
}

.resBotView {
  padding-left: 20px;
}

.verifyResultView h3 {
  font-size: 12px;
  font-family: Poppins-Regular, Poppins;
  font-weight: 400;
  color: #1d2129;
  line-height: 18px;
}

.verifyResultView h4 {
  font-size: 12px;
  font-family: Poppins-Regular, Poppins;
  font-weight: 400;
  color: #1d2129;
  line-height: 18px;
}
</style>