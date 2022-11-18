<template>
  <div class="common-layout">
    <el-container class="dm-container">

      <!-- Header -->

      <el-header class="headerview">
        <el-menu class="el-menu-demo did-menu" mode="horizontal" :ellipsis="false">
          <el-menu-item index="0">
            <img class="logoview" src="../assets/img/logo_Dmaster.svg" alt="" />
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
                      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                        viewBox="0 0 24 24">
                        <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                          stroke-linejoin="round">
                          <path d="M14 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-2"></path>
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

      <!-- Main -->

      <div class="did-main">

        <el-row>
          <el-col :span="3" :offset="1">
            <img class="info-icon" src="../assets/img/avatardefault_128px@2x.png" alt="" />
          </el-col>
          <el-col :span="15">
            <div class="info-right">
              <h2 class="name">
                {{ userInfo.firstName + " " + userInfo.lastName }}
              </h2>
              <h3 class="did">
                {{ userInfo.did }}
              </h3>
              <div class="org">
                <img src="../assets/img/icon_company@2x.png" alt="" />
                <span>{{ userInfo.company }}</span>
              </div>
            </div>
          </el-col>
        </el-row>

        <div class="content-view">
          <div class="credential-display">
            <el-row :gutter="50" justify="center">
              <el-col :span="15">
                <div class="display-left">
                  <h2 class="dis-title f-color">Credentials</h2>
                  <h1 class="dis-count f-color">
                    {{ data.length }}
                    <!-- userInfo.credentialCount -->
                  </h1>
                </div>
              </el-col>
              <el-col :span="7">
                <div class="display-right">
                  <h2 class="w-color">Credential Verifier</h2>
                  <br />
                  <h3 @click="toVerifyAction">
                    <a class="w-color" href="javascript:void();" style="text-decoration: none">Easy Verify</a>
                  </h3>
                </div>
              </el-col>
            </el-row>
          </div>

          <div class="verify-entrance-view">
            <el-row :gutter="20" justify="space-between">
              <el-col :span="20">
                <div class="verify-left">
                  <h2 class="f-color">Verifiable Credentials</h2>
                  <h4 class="l-color">
                    Here are all the verifiable credentials you have issued. You can view, download or delete persistent
                    credentials in D-pass.
                  </h4>
                </div>
              </el-col>
              <el-col :span="4">
                <div class="verify-right">
                  <el-button color="#1E5CEF" class="verify-btn" type="primary" @click="toCreateVcAction" round>Create
                    Verifiable Credential</el-button>
                </div>
              </el-col>
            </el-row>
          </div>

          <div v-if="hasVc" class="vctable-view">
            <div class="vctableHeaderView">
              <el-row justify="end">
                <el-col :span="2">
                  <el-button class="batch-download-btn" type="default" :disabled="ableToDownload"
                    @click="tiggerBatchDownloadAction" round>Download</el-button>
                </el-col>
              </el-row>
            </div>

            <n-data-table :columns="columns" :data="data" :pagination="pagination" :max-height="600" :scroll-x="1000"
              :row-key="vcRowKey" @update:checked-row-keys="handleCheck" />
          </div>

          <div v-else class="emptyView">
            <el-button color="#1E5CEF" class="verify-btn create-vc-btn" type="primary" @click="toCreateVcAction" round>
              Create Verifiable Credential</el-button>
          </div>
        </div>
      </div>

      <div class="bottomLogo">
        <img src="../assets/img/logo_Dmaster.svg" alt="" />
      </div>

      <!-- DRAWER Create Verify Credential -->

      <el-drawer v-model="schemaVisible" :show-close="false" size="90%" :direction="direction"
        @close="createVcDrawerDismissAction">
        <template #header="{ close }">
          <h4 class="drawer-title">Create Verifiable Credential</h4>
          <img class="drawer-close" src="../assets/img/close_black@2x.png" @click="close" alt="" />
        </template>

        <div class="select-schema-step">
          <el-row>
            <el-col :span="1">
              <el-button v-if="vcStep == 1" type="primary" class="step-btn" circle>{{ vcStep }}</el-button>
              <el-button v-else-if="vcStep == 2" type="primary" class="step-btn" circle>{{ vcStep }}</el-button>
              <el-button v-else-if="vcStep == 3" type="primary" class="step-btn" circle>{{ vcStep }}</el-button>
            </el-col>

            <el-col :span="18">
              <div v-if="vcStep == 1">
                <h3 class="step-title">Select Schema</h3>
                <h4 class="step-subtitle">
                  Select the schema you want to issue an credenitial
                </h4>
              </div>
              <div v-else-if="vcStep == 2">
                <h3 v-if="!processing" class="step-title">Add Recipients</h3>
                <h3 v-else class="step-title">Issuing credential...</h3>

                <h4 v-if="!processing" class="step-subtitle">
                  You can add some more information according to the schema
                </h4>
                <h4 v-else class="step-subtitle">
                  Please don’t close this window.
                </h4>
              </div>
              <div v-else-if="vcStep == 3">
                <h3 v-if="createOk" class="step-title">
                  {{ newVcNum }}
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

            <el-col :span="2">
              <div v-if="vcStep == 1">
                <el-button type="primary" class="continue-btn" @click="toAddRecipient">Continue
                </el-button>
              </div>

              <div v-else-if="vcStep == 2">
                <div v-if="!processing">
                  <el-button type="default" class="back-btn" @click="backAction" round>Back</el-button>
                </div>
              </div>

              <div v-else-if="vcStep == 3">
                <div v-if="!createOk">
                  <el-button type="default" class="back-btn" @click="backAction" round>Back</el-button>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>

        <div v-if="vcStep == 1" class="select-schema-content">
          <el-row :gutter="40">
            <el-col :span="4">
              <div class="card" @click="selectedOne">
                <div class="card-top cardtopnormal" :class="{ cardtopselected: hasSelectedOne }">
                  <img style="width: 285px; height: 250px" src="../assets/img/schema_membership@2x.png" alt="" />
                </div>
                <div class="card-bot cardbotnormal" :class="{ cardbotselected: hasSelectedOne }">
                  Membership Card
                </div>
              </div>
            </el-col>

            <el-col :span="4">
              <div class="card" @click="selectedTwo">
                <div class="card-top cardtopnormal" :class="{ cardtopselected: hasSelectedTwo }">
                  <img style="width: 285px; height: 250px" src="../assets/img/schema_acticit_1y@2x.png" alt="" />
                </div>
                <div class="card-bot cardbotnormal" :class="{ cardbotselected: hasSelectedTwo }">
                  Activity Certificate
                </div>
              </div>
            </el-col>

            <el-col :span="4">
              <div class="card">
                <div class="card-top cardtopnormal">
                  <img style="width: 285px; height: 250px" src="../assets/img/schema_coming@2x.png" alt="" />
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
            <img style="width: 144px; height: 144px" src="../assets/img/add_recipients@2x.png" alt="" />
            <div class="mamualView">
              <el-button type="primary" class="manually-add-btn" color="#1D2129" @click="addManualAction" round>Add
                Manually</el-button>
              <el-button type="default" class="import-btn" @click="importSheetAction" round>Import Spreadsheet
              </el-button>
            </div>
          </div>

          <div v-else class="recipientTableView">
            <div class="recipientTopView">
              <el-row :gutter="5">
                <el-col :span="18">
                  <el-button type="primary" class="manually-add-btn" color="#1D2129" @click="addManualAction" round>Add
                    Manually</el-button>
                </el-col>

                <el-col :span="3">
                  <el-button type="default" class="import-btn" @click="importSheetAction" round>Import Spreadsheet
                  </el-button>
                </el-col>

                <el-col :span="3">
                  <el-button type="primary" class="issue-btn" :disabled="disableIssueVc" @click="toIssueCredentials">
                    Issue Credentials
                  </el-button>
                </el-col>
              </el-row>
            </div>

            <!-- table -->
            <n-data-table :columns="recipientTableColumns" :data="recipientTableData" :pagination="pagination"
              :max-height="600" :scroll-x="1000" :row-key="rowKey" @update:checked-row-keys="handleRecipientCheck" />

            <div v-if="processing" class="maskview" color="#FF427AFF" stroke-width="12">
              <el-progress class="progressView" type="circle" :percentage="percentageCount" />
            </div>
          </div>
        </div>

        <div v-else-if="vcStep == 3">
          <div v-if="createOk" class="okCreatedVc">
            <el-row>
              <el-col :span="2" :offset="17">
                <el-button type="default" class="manually-add-btn" @click="toDownloadAction" round>Download Credential
                </el-button>
              </el-col>

              <el-col :span="2" style="margin-left: 10px">
                <el-button type="primary" class="manually-add-btn" color="#1E5CEF" @click="toViewVcsAction(newVcId[0])"
                  round>View Credential</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-drawer>

      <!-- DRAWER Verify Credential -->

      <el-drawer v-model="veriferVisible" :show-close="false" size="90%" :direction="direction">
        <template #header="{ close }">
          <h4 class="drawer-title">Credential Verifier</h4>
          <img class="drawer-close" src="../assets/img/close_black@2x.png" @click="close" alt="" />
        </template>

        <div class="verifyContentView">
          <el-upload class="verifyFile" drag :limit="1" :auto-upload="false" v-model:file-list="fileList">
            <img style="width: 64px; height: 64px" src="../assets/img/file@2x.png" alt="" />
            <div class="el-upload__text">
              Drop json file here or <em>click to upload</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                jpg/png files with a size less than 500kb
              </div>
            </template>
          </el-upload>

          <div class="fileShowView">
            <el-row>
              <el-col :span="18" :offset="1">
                <!-- <h3 class="filenamesView">xxxxx.json</h3> -->
              </el-col>
              <el-col :span="6" :offset="20">
                <el-button size="large" type="primary" @click="verifyFileAction" round>Verify</el-button>
              </el-col>
            </el-row>
          </div>

          <div class="verifyResultView" v-if="verifyResultShow">
            <div class="resTopView">
              <img style="width: 32px; height: 32px" src="../assets/img/success@2x.png" alt="" />
              <h2>Verified</h2>
            </div>

            <div class="resBotView">
              <h3>
                <span>{{ vcVerifyRet.issueName }}</span> issued to
                <span>{{ vcVerifyRet.holderName }}</span>
              </h3>

              <h4>Issuer: {{ vcVerifyRet.issueName }}</h4>
              <h4>IssuerDid: {{ vcVerifyRet.issueDid }}</h4>
              <h4>Type: {{ vcVerifyRet.types[0] }}</h4>
              <h4>Issue date: {{ vcVerifyRet.issueDate }}</h4>
              <h4>Expire date: {{ vcVerifyRet.expireDate }}</h4>
              <h4>Holder: {{ vcVerifyRet.holderName }}</h4>
              <h4>Holder did: {{ vcVerifyRet.holderDid }}</h4>
              <!-- <h4>Credential type:</h4> -->
              <!-- <h4>
                Proof:
                hfoiwefgoenfmosdnfsdofjsdofsodfshdifhsdohfsodfhsodhfsodhfo
              </h4> -->
            </div>
          </div>
        </div>
      </el-drawer>

      <!-- Dialog Input recipient information -->

      <el-dialog v-model="inputRecipientVisiable" :show-close="false" :direction="direction" :width="680">
        <template #header="{ close }">
          <h4 class="dialog-header-title-recipient">Add Recipients</h4>
          <img class="dialog-close" src="../assets/img/close_black@2x.png" @click="close" alt="" />
        </template>

        <div class="addRecipientContent">
          <div v-for="item in inputRecipientsData" :key="item.claimSort">
            <h3 class="dialog-title">{{ item.claimName }}</h3>
            <el-input class="inputw" v-model="item.claimContent" placeholder="Please input" />
            <h4 class="dialog-subtitle">
              {{ item.claimDesc }}
            </h4>
          </div>

          <div>
            <!-- v-model="checked1" -->
            <el-checkbox label=" Expire this credential" size="large" />
            <h4 class="dialog-subtitle">
              This option will expire the credential after the specified date.
            </h4>
          </div>

          <div style="margin-top: 5px">
            <el-row :gutter="5">
              <el-col :span="11">
                <h3 class="dialog-title">* Issue Date</h3>
                <el-date-picker v-model="issueDate" type="date" placeholder="Pick a day" format="YYYY/MM/DD"
                  value-format="YYYY-MM-DD" />
              </el-col>
              <el-col :span="11" :offset="1">
                <h3 class="dialog-title">Expiration Date</h3>
                <el-date-picker v-model="expireDate" type="date" placeholder="Pick a day" format="YYYY/MM/DD"
                  value-format="YYYY-MM-DD" />
              </el-col>
            </el-row>
          </div>
        </div>

        <div class="addRecipientBotView">
          <el-button type="primary" size="large" class="add-recipient-info-btn" color="#1E5CEF"
            @click="addRecipientAction" round>Add Recipient
          </el-button>
        </div>
      </el-dialog>

      <!-- Dialog View vc image -->
      <el-dialog v-model="vcViewVisiable" :show-close="true" align-center="true" :width="680">
        <div style="text-align: center;">
          <!-- <img style="width: 600px; height: 842px" :src="vcViewLink" alt="" /> -->
          <div id="vc-image" class="vc-image-view">
            <h3 class="sub-title g-color">{{ viewVcRow.credentialType }}</h3>
            <h2 class="main-title b-color">{{ viewVcRow.credentialType }}</h2>
            <h1 class="hoder-name b-color">{{ viewVcRow.holderName }}</h1>
            <h3 class="holder-level g-color">Membership level <span class="b-color">{{ viewVcRow.credentialTitle
            }}</span></h3>
            <h3 class="holder-email g-color">{{ viewVcRow.holderEmail }}</h3>
            <h3 class="issuer-name g-color">Issue by <span class="b-color">{{ viewVcRow.holderName }}</span></h3>
            <h3 class="issue-time g-color">Issue AT <span class="b-color">{{ viewVcRow.issueDate }}</span></h3>
            <h3 class="expire-time g-color">Expires AT <span class="b-color">{{ viewVcRow.expireDate }}</span></h3>
            <!-- <vue-qrcode class="qr-code" :value="viewVcRow.jwt" @change="onDataUrlChange" /> -->
          </div>

          <br>

          <el-button type="primary" size="large" class="add-recipient-info-btn" color="#1E5CEF" @click="captureVcImage"
            round>Download</el-button>
        </div>
      </el-dialog>

      <!-- Dialog Import with vc files -->

      <el-dialog v-model="issuleMultiVCVisiable" :show-close="false" :width="540">
        <template #header="{ close }">
          <h4 class="dialog-header-title-m-credential">Issue multiple credentials</h4>
          <img class="dialog-close" src="../assets/img/close_black@2x.png" @click="close" alt="" />
        </template>

        <div class="multiVcView">
          <div>
            <h3>
              You can import a spreadsheet with your recipient information.
            </h3>
            <h3>
              <a :href="excelTempelUrl">Download this sample CSV template</a> to
              see an example of the format required.
            </h3>
            <br />
          </div>

          <el-upload class="multiVcUploadView" drag :limit="1" :auto-upload="false" v-model:file-list="multoVcFileList">
            <div class="el-upload__text">
              <em>Upload & drop your file</em>
            </div>
            <!-- <template #tip>
              <div class="el-upload__tip">
                jpg/png files with a size less than 500kb
              </div>
            </template> -->
          </el-upload>
        </div>

        <template #footer>
          <div class="multiFooterView">
            <el-row :gutter="10" justify="center">
              <el-col :span="12">
                <el-button class="multi-vc-btn" type="default" @click="multiVcCancelAction" round>Cancel</el-button>
              </el-col>
              <el-col :span="12">
                <el-button class="multi-vc-btn" type="default" color="black" @click="multiVcImportAction" round>Import
                </el-button>
              </el-col>
            </el-row>
          </div>
        </template>
      </el-dialog>

      <!-- Dialog View personal tags -->

      <el-dialog v-model="personalTagsVisiable" :show-close="false" :direction="direction" :width="540">
        <template #header="{ close }">
          <div>
            <div class="dialog-header-view">
              <h4 class="dialog-header-title">{{ personalTagTitle }}</h4>
              <h3>{{ personalTagDis }}</h3>
            </div>
            <img class="dialog-close" src="../assets/img/close_black@2x.png" @click="close" alt="" />
          </div>
        </template>

        <div class="tagsView">
          <el-tag v-for="(item, index) in personalTags" :key="item.label" :type="item.type" size="large" class="mx-1"
            effect="dark" @click="clickTagAction(index)" round>
            <a class="w-color" href="javascript:void();" style="text-decoration: none"># {{ item.tagName }}</a>
          </el-tag>
        </div>
      </el-dialog>

      <!-- Dialog View personal tags detail -->

      <el-dialog v-model="personalTagsDetailVisiable" :show-close="false" :direction="direction" :width="540">
        <template #header="{ close }">
          <h4 class="dialog-header-title-detail">
            {{ personalTagDetail.tagName }}
          </h4>
          <img class="dialog-close" src="../assets/img/close_black@2x.png" @click="close" alt="" />
        </template>

        <div class="tagsDetailView">
          <div class="tagDescView">{{ personalTagDetail.tagDesc }}</div>
          <br />
          <h4>Reference Link</h4>
          <h4 class="tagLink">{{ personalTagDetail.tagLink }}</h4>
        </div>
      </el-dialog>
    </el-container>
  </div>
</template>
  
<script>
import { ref, h, reactive } from "vue";
import axios from "axios";

import Domain from "../router/domain.js";
let getUserInfoUrl = Domain.domainUrl + "/api/did-user/get-info";
let vcTableUrl =
  Domain.domainUrl + "/api/did-document-credential/credential-list";
let getTemplListUrl =
  Domain.domainUrl + "/api/did-document-credential/template-list";
let templateClaimUrl =
  Domain.domainUrl + "/api/did-document-credential/template-claim";
let issueVcUrl = Domain.domainUrl + "/api/did-document-credential/credential";
let singleDownloadUrl =
  Domain.domainUrl + "/api/did-document-credential/credential-download/";
let batchDownloadUrl =
  Domain.domainUrl + "/api/did-document-credential/credential-download";
let viewVcPicUrl =
  Domain.domainUrl + "/api/did-document-credential/view-credential/";
let VerifyVcUrl =
  Domain.domainUrl + "/api/did-document-credential/verify-credential";
let delVcUrl =
  Domain.domainUrl + "/api/did-document-credential/credential-delete/";
let multiVcCreationUrl =
  Domain.domainUrl + "/api/did-document-credential/credential-parse/";
let personalTagsUrl = Domain.domainUrl + "/api/did-holder-tag/list/";

import { ElMessage } from "element-plus";
import { NButton, NIcon, NPopover } from "naive-ui";
import {
  DotsVertical,
  CircleCheck,
  Eye,
  Download,
  Trash,
} from "@vicons/tabler";

import VueQrcode from 'vue-qrcode'
import domtoimage from "dom-to-image";

import bip39 from "../crypto/bip39.js";
import vc from "../crypto/vc.js";
import did from "../crypto/did.js";
import ecdh from "../crypto/ecdh.js";

import tmpl from "../db/tmpl.js";
import claim from "../db/claim.js";
import dbvc from "../db/vc.js";
import user from "../db/user.js";

export default {
  name: "Home",
  components: {},
  data() {
    return {
      autoWidth: "",
      ableToDownload: true,
      disableIssueVc: true,

      profileName: "",
      activeIndex: ref("1"),

      hasVc: true,
      userInfo: {
        firstName: "",
        lastName: "",
        did: "",
      },
      data: [],
      columns: [],
      vcTableCheckRowKey: [],
      pagination: {},
      width: 1200,
      height: 734,
      popviewShow: false,

      vcStep: 1,
      processing: ref(false),
      percentageCount: 0,
      percentageTotal: 100,
      timer: {},
      createOk: true,

      //schema
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
      vcVerifyRet: {},
      verifyResultShow: false,

      //view credential image
      vcViewVisiable: false,
      vcViewLink: "",
      fileList: [],
      viewVcRow: {},
      jwtVal: "eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2cCI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVQcmVzZW50YXRpb24iXSwidmVyaWZpYWJsZUNyZWRlbnRpYWwiOlsiZXlKaGJHY2lPaUpGVXpJMU5rc2lMQ0owZVhBaU9pSktWMVFpZlEuZXlKMll5STZleUpBWTI5dWRHVjRkQ0k2V3lKb2RIUndjem92TDNkM2R5NTNNeTV2Y21jdk1qQXhPQzlqY21Wa1pXNTBhV0ZzY3k5Mk1TSmRMQ0owZVhCbElqcGJJbFpsY21sbWFXRmliR1ZEY21Wa1pXNTBhV0ZzSWwwc0ltTnlaV1JsYm5ScFlXeFRkV0pxWldOMElqcDdJbVJsWjNKbFpTSTZleUowZVhCbElqb2lRbUZqYUdWc2IzSkVaV2R5WldVaUxDSnVZVzFsSWpvaVFtRmpZMkZzWVhWeXc2bGhkQ0JsYmlCdGRYTnBjWFZsY3lCdWRXM0RxWEpwY1hWbGN5SjlmWDBzSW5OMVlpSTZJbVJwWkRwbGRHaHlPakI0WkRSRE4yRmtOR0V6TkRFME56YzNPREJqWVRZMlJETXdZVFV3WmpNd1EwTkdOVEptTkRrM1pTSXNJbTVpWmlJNk1UVTJNamsxTURJNE1pd2lhWE56SWpvaU1IaGtORU0zWVdRMFlUTTBNVFEzTnpjNE1HTmhOalpFTXpCaE5UQm1NekJEUTBZMU1tWTBPVGRsSW4wLkdsbUJnZ2pGRjhxUjgtMDlyMElzNjNlZnlObWgwQUhkOEc3ZWpOU1ZVQ0o4cTd5bGEyZzIzb19nMUM5MXRDTDFjbm9QT0VZVWVjU2V6anRqdjhXdXRRIl19LCJpc3MiOiIweGQ0QzdhZDRhMzQxNDc3NzgwY2E2NkQzMGE1MGYzMENDRjUyZjQ5N2UifQ.ADV4v1SSgNv9dL7mVxNlo23ri1OILaDBtCvA8_qh3n39RUjSdM5OesC-XFQ3ihY4yMo5sq5DV71Ms4nQboH5cQ",

      //issuleMultiVCVisiable
      issuleMultiVCVisiable: false,
      multoVcFileList: [],
      excelTempelUrl: "",

      //personalTagsVisiable
      personalTagsVisiable: false,
      personalTags: [],
      personalTagTitle: "",
      personalTagDis: "",

      personalTagsDetailVisiable: false,
      personalTagDetail: {},

      // did-wallet
      didWallet: {},
      shareKey: null,
    };
  },
  components: {
    VueQrcode,
  },
  created() { },
  watch: {},
  mounted() {
    let indexdb = localStorage.getItem("indexDB");
    if (indexdb == null || indexdb == undefined) {
      tmpl.createVcTemplate()
      claim.createClaims()
      localStorage.setItem("indexDB", "1")
    }

    this.queryBlockchain();

    this.autoWidth = window.outerWidth * 0.6;
    this.pagination = reactive({
      page: 1,
      pageSize: 5,
      showSizePicker: true,
      pageSizes: [3, 5, 7],
      onChange: (page) => {
        this.pagination.page = page;
      },
      onUpdatePageSize: (pageSize) => {
        this.pagination.pageSize = pageSize;
        this.pagination.page = 1;
      },
    });

    let that = this;
    this.columns = this.createColumns({
      moreOpsRow(row) {
        that.popviewShow = !that.popviewShow;
      },
      viewOpRow(row) {
        console.log(row);
        // that.toViewVcsAction(row.credentialId);
        // view vc with row

        that.viewVcRow = row;
        that.vcViewVisiable = true;
      },
      downloadOpRow(row) {
        that.singleDownloadAction(row.credentialId);
      },
      trashOpRow(row) {
        that.singleTrashAction(row.credentialId);
      },
      personalInfoRow(row) {
        that.personalTagTitle = row.holderName;
        that.personalTagsAction(row.holderDid);
      },
    });

    this.getUserInfoLocal();
    this.getVcTableInfoLocal();
    this.getVcTableInfo();
  },
  methods: {
    async queryBlockchain() {
      // ethr.queryBlockchain(ethr.providerEndpoint);
      // ethr.genWalletFromMnemonic();

      this.didWallet = await bip39.genWalletWithBip39();
      console.log("wallet " + this.didWallet.publicKey)
      console.log("wallet " + this.didWallet.privateKey)
      console.log("wallet address " + this.didWallet.address)

      // let didjwt = await did.createDidJwt(this.didWallet);

      let theirPub = "041c81282e3243781dbe69d983c4f2329c3c4f56fad48d94e0bcfdee41024e140105bbdcaea8f0f07130c921b79358022b373053eab5d5dd4f8aca78eafe1b7efb";

      let key = await ecdh.generateShareKey(this.didWallet, theirPub);
      console.log("encrypto key " + key);
      this.shareKey = key;

      // let otherMsg = '';
      // let otherRet = await ecdh.decryptWithString(otherMsg, key);
      // console.log('otherRet ' + otherRet);
    },
    createVcDrawerDismissAction() {
      this.data = []
      this.getUserInfoLocal();
      this.getVcTableInfoLocal();
      this.getVcTableInfo();
    },
    handleRecipientCheck(row) {
      this.recipientCheckedRowKeys = row;
      if (this.recipientCheckedRowKeys.length == 0) {
        this.disableIssueVc = true;
      } else {
        this.disableIssueVc = false;
      }
    },
    handleCheck(rows) {
      this.vcTableCheckRowKey = rows;
      if (this.vcTableCheckRowKey.length == 0) {
        this.ableToDownload = true;
      } else {
        this.ableToDownload = false;
      }
    },
    logoutAction() {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("username");
      window.location.reload();
    },
    createColumns({
      moreOpsRow,
      viewOpRow,
      downloadOpRow,
      trashOpRow,
      personalInfoRow,
    }) {
      return [
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
          render(row, index) {
            return h(
              "a",
              {
                href: "javascript:void(0)",
                onClick: () => personalInfoRow(row),
              },
              [row.holderName]
            );
          },
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
          width: 40,
          render(row, index) {
            let now = Date.now();
            let expireTiming = Date.parse(row.expireDate);
            if (expireTiming > now) {
              return h(
                NIcon,
                {
                  size: 33,
                  color: "#A9AEB8",
                },
                { default: () => h(CircleCheck) }
              );
            } else {
              return h("span", ["Expired"]);
            }
          },
        },
        {
          title: "Operations",
          key: "",
          width: 50,
          render(row, index) {
            return h(
              NPopover,
              {
                trigger: "click",
                placement: "left",
              },
              {
                trigger: () =>
                  h(
                    NButton,
                    {
                      style: {
                        width: "33px",
                        height: "33px",
                        bordered: "false",
                        circle: true,
                      },
                      onClick: () => moreOpsRow(row),
                    },
                    {
                      icon: () =>
                        h(NIcon, null, { default: () => h(DotsVertical) }),
                    }
                  ),

                default: () =>
                  h("div", { class: "popView" }, [
                    h("div", null, [
                      h(
                        NButton,
                        {
                          style: {
                            width: "120px",
                          },
                          onClick: () => viewOpRow(row),
                        },
                        {
                          icon: () => h(NIcon, null, { default: () => h(Eye) }),
                          default: () => h("span", ["view"]),
                        }
                      ),
                    ]),
                    h("div", null, [
                      h(
                        NButton,
                        {
                          style: {
                            width: "120px",
                          },
                          onClick: () => downloadOpRow(row),
                        },
                        {
                          icon: () =>
                            h(NIcon, null, { default: () => h(Download) }),
                          default: () => h("span", ["download"]),
                        }
                      ),
                    ]),
                    h("div", null, [
                      h(
                        NButton,
                        {
                          "text-color": "red",
                          style: {
                            width: "120px",
                          },
                          onClick: () => trashOpRow(row),
                        },
                        {
                          icon: () =>
                            h(NIcon, null, { default: () => h(Trash) }),
                          default: () => h("span", ["delete"]),
                        }
                      ),
                    ]),
                  ]),
              }
            );
          },
        },
      ];
    },
    async getUserInfoLocal() {
      let userinfo = null
      let localdid = localStorage.getItem("userdid");
      if (localdid == undefined) {
        userinfo = await this.getUserInfoOnline();
      } else {
        let val = await user.queryUser(localdid);
        if (val == undefined) {
          userinfo = await this.getUserInfoOnline();
        } else {
          userinfo = val;
        }
      }

      if (userinfo.firstName == undefined) {
        userinfo.firstName = "";
      }
      if (userinfo.lastName == undefined) {
        userinfo.lastName = "";
      }

      this.userInfo = userinfo;
      this.profileName = this.userInfo.firstName
        .substring(0, 1)
        .toUpperCase();
    },
    async getUserInfoOnline() {
      const res = await axios.get(getUserInfoUrl, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      if (res.data.code == 0) {
        let info = res.data.data;
        localStorage.setItem("userdid", info.did)
        user.createUser({
          firstName: info.firstName,
          lastName: info.lastName,
          userdid: info.did,
          usercompany: info.company,
          credentialcount: info.credentialCount,
          needAddInformation: info.needAddInformation,
        })
        return info;
      } else if (res.data.code == 100002) {
        this.$router.push({ name: "personInfo" });
      } else if (res.data.code == 40001) {
        this.logoutAction();
      } else {
        ElMessage({
          message: res.data.msg,
          type: "error",
        });
      }
    },
    async getVcTableInfoLocal() {
      let localVals = await dbvc.queryVcs();
      this.data.push(...localVals)

      // if (localVals.length == 0) {
        // this.getVcTableInfo()
      // } else {
      // }

      if (this.data.length == 0) {
        this.hasVc = false;
      } else {
        this.hasVc = true;
      }
    },
    async getVcTableInfo() {
      const res = await axios.post(
        vcTableUrl,
        {
          page: 1,
          size: 100,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (res.data.code == 0) {
        this.data.push(...res.data.data.records);
        if (this.data.length == 0) {
          this.hasVc = false;
        } else {
          this.hasVc = true;
        }
      } else if (res.data.code == 40001) {
        this.logoutAction();
      } else {
        ElMessage({
          message: res.data.msg,
          type: "error",
        });
      }
    },
    backAction() {
      this.vcStep = this.vcStep - 1;
    },
    toVerifyAction() {
      this.veriferVisible = true;
      this.fileList = [];
      this.verifyResultShow = false;
    },
    handleExceed() { },
    async verifyFileAction() {
      let formData = new FormData();
      formData.append("multipartFile", this.fileList[0].raw);

      const res = await axios.post(VerifyVcUrl, formData, {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.code == 0 && res.data.data.verify) {
        this.verifyResultShow = true;
        this.vcVerifyRet = res.data.data;
      } else if (res.data.code == 40001) {
        this.logoutAction();
      } else {
        ElMessage({
          message: res.data.msg,
          type: "error",
        });
      }
    },
    async toCreateVcAction() {
      this.schemaList = tmpl.queryVcTemplate();
      this.schemaVisible = true;
      this.vcStep = 1;
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
        return;
      }

      // get recipients list

      this.vcStep = 2;
      this.isEmptyRecipient = true;
      this.recipientTableData = [];
      this.recipientIdx = 1;

      if (this.schemaType == "Membership Card") {
        this.schemaId = 1;
      } else if (this.schemaType == "Activity Certificate") {
        this.schemaId = 2;
      }

      claim.queryCliamsWith(this.schemaId).then(
        (val) => {
          this.inputRecipientsData = val;
          this.createRecipientColumns(this.inputRecipientsData);
        }
      )
    },
    async addManualAction() {
      this.inputRecipientsData.forEach((element) => {
        element.claimContent = null;
      });
      this.issueDate = null;
      this.expireDate = null;
      this.inputRecipientVisiable = true;
    },
    addRecipientAction() {
      let obj = {};
      this.inputRecipientsData.forEach((element) => {
        obj[element.claimCode] = element.claimContent;
      });
      obj["issueDate"] = this.issueDate;
      obj["expireDate"] = this.expireDate;
      obj["idx"] = this.recipientIdx;
      this.recipientTableData.push(obj);

      this.recipientIdx = this.recipientIdx + 1;
      this.inputRecipientVisiable = false;
      this.isEmptyRecipient = false;
    },
    importSheetAction() {
      this.excelTempelUrl = this.schemaList[this.schemaId - 1].templateExcelUrl;
      this.issuleMultiVCVisiable = true;
    },
    async toIssueCredentials() {
      this.processing = true;

      let timer = setInterval(() => {
        this.percentageCount += 1;
        if (this.percentageCount > 100) {
          this.percentageCount = 100;
        }
      }, 30);

      let needClaims = [];
      this.recipientCheckedRowKeys.forEach((checkKey) => {
        let element = this.recipientTableData[checkKey - 1];

        let now = Date.now();
        let giving = Date.parse(element.expireDate);

        let obj = {
          issueDate: element.issueDate,
          expireDate: element.expireDate,
          expireFlag: giving > now ? 1 : 0,
        };

        let obj2 = {}
        let keys = Object.keys(element);
        keys.forEach(key => {
          if (key != "issueDate" && key != "expireDate" && key != "expireFlag" && key != "idx") {
            obj2[key] = element[key]
          }
        });

        obj["claimsStr"] = JSON.stringify(obj2);
        needClaims.push(obj);
      });

      if (needClaims.length == 0) {
        alert("need claim must not be empty");
        return;
      }

      vc.createVcTemplate(this.didWallet, needClaims, this.schemaId).then(
        (value) => {
          // get vcid
          console.log(value)

          // vc content

          // crypto vc
          // ecdh.encrypt(value, this.shareKey).then(val => {
          // console.log("encrypto ret " + val);
          // ecdh.decrypt(val, this.shareKey).then(val => {
          //   console.log("decrypto message " + origin);
          // });
          // }); 

          // addition actions
          clearInterval(timer);
          this.percentageCount += 100;
          if (this.percentageCount > 100) {
            this.percentageCount = 100;
          }

          this.newVcId = value;
          this.newVcNum = "Issued " + this.newVcId.length + " Verifiable Credential";
          this.processing = false;
          this.vcStep = 3;
          this.createOk = true;
        },
        (reason) => {
          clearInterval(timer);
          this.processing = false;
          this.createOk = false;
        }
      )
    },
    toDownloadAction() {
      if (this.newVcId.length > 1) {
        this.batchDownloadAction(this.newVcId);
      } else {
        this.singleDownloadAction(this.newVcId[0]);
      }
    },
    async toViewVcsAction(vcid) {
      dbvc.queryVc(vcid).then(val => {
        this.viewVcRow = val[0];
        this.vcViewVisiable = true;
      });
    },
    captureVcImage() {
      var node = document.getElementById("vc-image");
      domtoimage
        .toJpeg(node, { quality: 0.95 })
        .then(function (dataUrl) {
          var link = document.createElement("a");
          link.download = "vc.jpeg";
          link.href = dataUrl;
          link.click();
        });
    },
    createRecipientColumns(orign) {
      let cols = [];
      let first = {
        type: "selection",
        fixed: "left",
        width: 25,
      };
      cols.push(first);

      orign.forEach((element) => {
        let claimName = "";
        let isinclude = element.claimName.includes("* ");
        if (isinclude) {
          claimName = element.claimName.substring(1);
        } else {
          claimName = element.claimName;
        }

        let obj = {
          title: claimName,
          key: element.claimCode,
          width: 80,
        };

        cols.push(obj);
      });

      let issue = {
        title: "Issue AT",
        key: "issueDate",
        width: 80,
      };

      let expire = {
        title: "Expire AT",
        key: "expireDate",
        width: 80,
      };

      cols.push(issue);
      cols.push(expire);

      this.recipientTableColumns = cols;
    },
    tiggerBatchDownloadAction() {
      this.batchDownloadAction(this.vcTableCheckRowKey);
    },
    rowKey: (row) => row.idx,
    vcRowKey: (row) => row.credentialId,
    async batchDownloadAction(ids) {
      const res = await axios.post(
        batchDownloadUrl,
        {
          credentialIds: ids,
        },
        {
          responseType: "blob",
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      let zipfile = new Blob([res.data], { type: "application/zip" });
      let url = window.URL.createObjectURL(zipfile);
      let a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.setAttribute("download", "file.zip");
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(a.href);
      document.body.removeChild(a);
    },
    async singleDownloadAction(id) {
      const res = await axios.get(
        singleDownloadUrl + id,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        },
        {
          responseType: "blob",
        }
      );

      let url = window.URL.createObjectURL(new Blob([res.data]));
      let a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.setAttribute("download", "file.json");
      document.body.appendChild(a);
      a.click(); //执行下载
      window.URL.revokeObjectURL(a.href);
      document.body.removeChild(a);
    },
    async singleTrashAction(id) {
      const res = await axios.delete(delVcUrl + id, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      if (res.data.code == 0) {
        let index = -1;
        this.data.forEach((element) => {
          if (element.credentialId == id) {
            index = this.data.indexOf(element);
          }
        });

        if (index > -1) {
          this.data.splice(index, 1);
        }

        // reload total count
        this.getUserInfo();
      } else if (res.data.code == 40001) {
        this.logoutAction();
      } else {
        ElMessage({
          message: res.data.msg,
          type: "error",
        });
      }
    },
    async multiVcImportAction() {
      let formData = new FormData();
      formData.append("multipartFile", this.multoVcFileList[0].raw);

      const res = await axios.post(
        multiVcCreationUrl + this.schemaId,
        formData,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.code == 0) {
        res.data.data.claims.forEach((element) => {
          let claimObj = JSON.parse(element.claimsStr);

          claimObj["issueDate"] = element.issueDate;
          claimObj["expireDate"] = element.expireDate;
          claimObj["idx"] = this.recipientIdx;
          claimObj["claimsStr"] = element.claimsStr;

          this.recipientTableData.push(claimObj);

          // // increase index !IMPORTANT
          this.recipientIdx = this.recipientIdx + 1;
        });

        this.isEmptyRecipient = false;
        this.issuleMultiVCVisiable = false;
      } else if (res.data.code == 40001) {
        this.logoutAction();
      } else {
        ElMessage({
          message: res.data.msg,
          type: "error",
        });
      }
    },
    multiVcCancelAction() {
      this.excelTempelUrl = "";
      this.issuleMultiVCVisiable = false;
      this.multoVcFileList = [];
    },
    async personalTagsAction(holderDid) {
      const res = await axios.get(personalTagsUrl + holderDid, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      if (res.data.code == 0) {
        this.personalTagsVisiable = true;
        this.personalTags = res.data.data.list;
        this.personalTagDis = res.data.data.holderDid;
      } else if (res.data.code == 40001) {
        this.logoutAction();
      } else {
        ElMessage({
          message: res.data.msg,
          type: "error",
        });
      }
    },
    clickTagAction(idx) {
      this.personalTagDetail = this.personalTags[idx];
      this.personalTagsDetailVisiable = true;
    },
  },
  unmounted() {
    this.timer = {};
  },
};
</script>

<!-- common -->

<style scoped>
.b-color {
  color: #1D2129;
}

.g-color {
  color: #4E5969;
}

.w-color {
  color: #FFFFFF;
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
  width: 403px;
  height: 39px;
  font-size: 28px;
  font-weight: bold;
  color: #1d2129;
  line-height: 42px;
}

.dialog-header-view {
  float: left;
  width: 90%;
  height: 39px;
}

.dialog-header-title {
  font-size: 28px;
  font-weight: bold;
  color: #1d2129;
  line-height: 42px;
}

.dialog-header-title-recipient {
  float: left;
  width: 90%;
  font-size: 28px;
  font-weight: bold;
  color: #1d2129;
  line-height: 42px;
}

.dialog-header-title-m-credential {
  float: left;
  width: 90%;
  font-size: 28px;
  font-weight: bold;
  color: #1d2129;
  line-height: 42px;
}

.dialog-header-title-detail {
  font-size: 28px;
  font-weight: bold;
  color: #1d2129;
  line-height: 42px;
  float: left;
  width: 90%;
}

.dialog-header-view h3 {
  height: 17px;
  font-size: 12px;
  font-weight: 400;
  color: #a9aeb8;
  line-height: 18px;
}

.tagDescView {
  height: 54px;
  background: #f2f3f5;
  border-radius: 8px;
  line-height: 54px;
}

.tagLink {
  height: 17px;
  font-size: 12px;
  font-weight: 600;
  color: #1d2129;
  line-height: 18px;
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

.dm-container {
  width: 100%;
  background: linear-gradient(360deg, #eef1f8 0%, #d1dbf4 60%, #eef1f8 100%);
}

.did-main {
  width: 1440px;
  margin: 0 auto;
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
  margin-top: 40px;
  padding-top: 60px;
  padding-bottom: 60px;
}

.info-icon {
  width: 128px;
  height: 128px;
  margin-top: 40px;
}

.info-left {
  float: left;
}

.info-right {
  margin-top: 45px;
}

.name {
  height: 51px;
  font-size: 36px;
  font-weight: bold;
  color: #272e3b;
  line-height: 55px;
}

.did {
  width: 568px;
  height: 25px;
  font-size: 18px;
  font-weight: 400;
  color: #8998ba;
  line-height: 27px;
}

.org {
  margin-top: 5px;
  height: auto;
  width: auto;
  background-color: #c9d5f4;
  border-radius: 16px;
  inline-size: fit-content;
  padding-right: 10px;
  padding-left: 10px;
}

.org img {
  vertical-align: top;
  width: 24px;
  height: 24px;
}

.org span {
  color: #272e3b;
  font-size: 18px;
  font-weight: 400;
  line-height: 27px;
}

.credential-display {
  margin: 0 auto;
  width: 100%;
  height: 140px;
}

.display-left {
  padding-left: 20px;
  min-width: 790px;
  height: 140px;
  border-radius: 8px;
  border: 2px solid #272e3b;
  background-image: url(../assets/img/credential@2x.png);
  background-repeat: no-repeat;
  background-position: right;
}

.dis-title {
  margin-top: 20px;
  width: 133px;
  height: 31px;
  font-size: 22px;
  font-weight: bold;
  color: #1d2129;
  line-height: 33px;
}

.dis-count {
  margin-top: 12px;
  width: 89px;
  height: 67px;
  font-size: 48px;
  font-weight: 300;
  color: #222222;
  line-height: 72px;
}

.display-right {
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
  width: 94%;
  margin: 0 auto;
  height: 116px;
  margin-top: 30px;
  background: #ffffff;
}
</style>

<!-- content 2 -->

<style scoped>
.emptyView {
  margin: 0 auto;
  width: 95%;
  height: 326px;
  background: linear-gradient(270deg, #0b224f 0%, #1d2129 100%);
  border-radius: 8px;
  text-align: center;
}

.create-vc-btn {
  margin-top: 150px;
}

.vctable-view {
  width: 95%;
  margin: 0 auto;
  padding-bottom: 15px;
  border: 1px solid #a9aeb8;
  border-radius: 8px;
}

.bottomLogo img {
  widows: 85px;
  height: 25px;
  margin-left: 120px;
  margin-top: 20px;
}

.vctableHeaderView {
  padding: 10px;
}
</style>

<!-- schema step 1 -->

<style scoped>
.select-schema-step {
  margin: 0 auto;
  width: 95%;
  height: 100px;
  border-radius: 8px;
  border: 2px solid #272e3b;
  padding-left: 20px;
  font-size: 22px;
  font-weight: 500;
  color: #1d2129;
  line-height: 90px;
}

.step-btn {
  width: 32px;
  line-height: 25px;
  font-size: 16px;
  font-weight: 500;
  background: #1e5cef;
  color: #ffffff;
}

.step-title {
  margin-top: 10px;
  padding-left: 10px;
  height: 31px;
  font-size: 22px;
  font-weight: 500;
  color: #1d2129;
  line-height: 33px;
}

.step-subtitle {
  padding-left: 10px;
  height: 23px;
  font-size: 16px;
  font-weight: 400;
  color: #86909c;
  line-height: 25px;
}

.continue-btn {
  /* margin-top: 30px; */
  height: 34px;
  background: #1e5cef;
  border-radius: 24px;
}

.card {
  width: 285px;
  height: 326px;
}

.select-schema-content {
  margin: 20px auto;
  width: 95%;
}

.card-top {
  border-width: 1px;
}

.card-bot {
  text-align: center;
  height: 76px;
  font-size: 18px;
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
  margin: 10px auto;
  width: 95%;
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
  margin: 10px auto;
  width: 95%;
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
  margin: 5px auto;
  width: 95%;
  height: 84px;
  background: #f7f8fa;
  border-radius: 8px;
}
</style>

<!-- dialog -->

<style scoped>
.dialog-title {
  height: 20px;
  font-size: 14px;
  font-weight: 600;
  color: #1d2129;
  line-height: 21px;
}

.dialog-subtitle {
  height: 17px;
  font-size: 12px;
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
  border-radius: 24px;
}
</style>

<!-- Verify -->

<style scoped>
.verifyContentView {
  margin-left: 100px;
}

.verifyFile {
  width: 95%;
  background: #f2f3f5;
  border-radius: 8px;
  border: 2px solid #272e3b;
}

.fileShowView {
  width: 95%;
  height: 84px;
  background: #f7f8fa;
  border-radius: 8px;
  line-height: 84px;
}

.verifyResultView {
  margin-top: 20px;
  width: 95%;
  padding-bottom: 10px;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #a9aeb8;
}

.addFileView {
  margin-top: 40px;
  padding-left: 10px;
}

.addFileView h3 {
  height: 31px;
  font-size: 22px;
  font-weight: 500;
  color: #1d2129;
  line-height: 33px;
}

.filenamesView {
  height: 20px;
  font-size: 14px;
  font-weight: 400;
  color: #1d2129;
}

.resTopView {
  /* width: 95%; */
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
  font-weight: bold;
  color: #1d2129;
}

.resBotView {
  padding-left: 20px;
}

.resBotView h3 {
  padding-left: 5px;
  margin-top: 5px;
  width: 99%;
  height: 46px;
  font-size: 18px;
  background: #f2f3f5;
  border-radius: 8px;
  line-height: 46px;
}

.resBotView h3 span {
  height: 20px;
  font-size: 20px;
  font-weight: 600;
  color: #1d2129;
  line-height: 46px;
  border-radius: 8px;
}

.resBotView h4 {
  margin-top: 2px;
  font-size: 12px;
  font-weight: 400;
  color: #4e5969;
  line-height: 18px;
}

.verifyResultView h3 {
  font-size: 12px;
  font-weight: 400;
  color: #1d2129;
  line-height: 18px;
}

.verifyResultView h4 {
  font-size: 12px;
  font-weight: 400;
  color: #1d2129;
  line-height: 18px;
}
</style>

<!-- vc view image -->

<style scoped>
.multiVcView h3 {
  height: 17px;
  font-size: 14px;
  font-weight: 400;
  color: #a9aeb8;
  line-height: 18px;
}

.multiVcView a {
  height: 17px;
  font-size: 14px;
  font-weight: 400;
  color: #1d2129;
  line-height: 18px;
}

.vc-image-view {
  width: 600px;
  height: 842px;
  background-image: url(../assets/img/卡面2@2x.png);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}

.vc-image-view .sub-title {
  position: absolute;
  left: 30px;
  top: 30px;
  height: 28px;
  font-size: 20px;
  font-weight: 400;
  line-height: 30px;
}

.vc-image-view .main-title {
  position: absolute;
  left: 40px;
  top: 108px;
  height: 56px;
  font-size: 40px;
  font-weight: 500;
  line-height: 60px;
}

.hoder-name {
  position: absolute;
  left: 50px;
  top: 230px;
  height: 67px;
  font-size: 48px;
  font-weight: 500;
  line-height: 72px;
}

.holder-level {
  position: absolute;
  left: 50px;
  top: 307px;
  height: 33px;
  font-size: 24px;
  font-weight: 400;
  line-height: 35px;
}

.holder-level span {
  position: absolute;
  width: 150px;
  height: 33px;
  font-size: 24px;
  font-weight: bold;
  line-height: 35px;
}

.holder-email {
  position: absolute;
  left: 50px;
  top: 400px;
  height: 33px;
  font-size: 24px;
  font-weight: 400;
  line-height: 35px;
}

.issuer-name {
  position: absolute;
  left: 40px;
  top: 496px;
  height: 33px;
  font-size: 24px;
  font-weight: 400;
  line-height: 35px;
}

.issuer-name span {
  position: absolute;
  width: 150px;
  height: 33px;
  font-size: 24px;
  font-weight: bold;
  line-height: 35px;
}

.issue-time {
  position: absolute;
  left: 30px;
  top: 736px;
  height: 33px;
  font-size: 24px;
  font-weight: 400;
  line-height: 35px;
}

.issue-time span {
  position: absolute;
  width: 150px;
  height: 33px;
  font-size: 24px;
  font-weight: 400;
  line-height: 35px;
}

.expire-time {
  position: absolute;
  left: 30px;
  top: 779px;
  height: 33px;
  font-size: 24px;
  font-weight: 400;
  line-height: 35px;
}

.expire-time span {
  position: absolute;
  width: 150px;
  height: 33px;
  font-size: 24px;
  font-weight: 400;
  line-height: 35px;
}

.qr-code {
  position: absolute;
  width: 100px;
  height: 100px;
  right: 40px;
  bottom: 40px;
}
</style>