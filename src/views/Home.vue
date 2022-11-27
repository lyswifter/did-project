<template>
  <el-container class="dm-container">

    <el-header class="dm-header">
      <el-row class="dm-row" justify="space-between">
        <el-col :span="3">
          <a href="javascript:void(0)" @click="reloadPage">
            <img src="../assets/img/logo_Dmaster.svg" alt="">
          </a>
        </el-col>

        <el-col :span="1">
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
                        <path d="M14 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-2">
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
        </el-col>
      </el-row>
    </el-header>

    <!-- Main view -->

    <el-main class="dm-main">
      <div class="did-main">
        <el-row>
          <el-col :span="3" :offset="1">
            <img class="info-icon" src="../assets/img/avatardefault_128px@2x.png" alt="" />
          </el-col>
          <el-col :span="15">
            <div class="info-right">
              <h2 class="name">
                {{ userInfo.email }}
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
                    credentials in Dmaster.
                  </h4>
                </div>
              </el-col>
              <el-col :span="4">
                <div class="verify-right">
                  <el-button color="#1E5CEF" v-if="hasVc" class="verify-btn" type="primary" @click="toCreateVcAction"
                    round>Create
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

            <n-data-table :columns="columns" :data="data" :pagination="pagination" :scroll-x="1000" :row-key="vcRowKey"
              @update:checked-row-keys="handleCheck" />
          </div>

          <div v-else class="emptyView">
            <el-button color="#1E5CEF" class="verify-btn create-vc-btn" type="primary" @click="toCreateVcAction" round>
              Create Verifiable Credential</el-button>
          </div>
        </div>
      </div>
    </el-main>

    <!-- DRAWER Create Verify Credential -->

    <el-drawer v-model="schemaVisible" :show-close="false" size="90%" :direction="direction"
      :before-close="handleVcDrawerClose" @close="createVcDrawerDismissAction">
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
                Please don't close this window.
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
        <el-row :gutter="80">
          <el-col :lg="5" :xl="4">
            <div class="card" @click="selectedOne" @dblclick="dbclickOneAction">
              <div class="card-top cardtopnormal" :class="{ cardtopselected: hasSelectedOne }">
                <img style="width: 285px; height: 250px" src="../assets/img/schema_membership@2x.png" alt="" />
              </div>
              <div class="card-bot cardbotnormal" :class="{ cardbotselected: hasSelectedOne }">
                Membership Card
              </div>
            </div>
          </el-col>

          <el-col :lg="5" :xl="4">
            <div class="card" @click="selectedTwo" @dblclick="dbclickTwoAction">
              <div class="card-top cardtopnormal" :class="{ cardtopselected: hasSelectedTwo }">
                <img style="width: 285px; height: 250px" src="../assets/img/schema_acticit_1y@2x.png" alt="" />
              </div>
              <div class="card-bot cardbotnormal" :class="{ cardbotselected: hasSelectedTwo }">
                Activity Certificate
              </div>
            </div>
          </el-col>

          <el-col :lg="5" :xl="4">
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
        <div v-if="createOk && ableDownload" class="okCreatedVc">
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
              files with a size less than 500kb
            </div>
          </template>
        </el-upload>

        <div class="fileShowView">
          <el-row>
            <el-col :span="18" :offset="1">
              <!-- <h3 class="filenamesView">xxxxx.json</h3> -->
            </el-col>
            <el-col :span="6" :offset="20">
              <el-button size="large" type="primary" @click="verifyFileAction"
                :disabled="fileList.length == 0 ? true : false" round>Verify</el-button>
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

    <!-- Dialog View Verify Credential image -->
    <el-dialog v-model="vcViewVisiable" :show-close="true" align-center="true" :width="680">
      <div style="text-align: center;">
        <div id="vc-image" class="vc-image-view" :class="viewVcRow.template">
          <h3 class="sub-title" :class="viewVcRow.color">{{ viewVcRow.credentialType }}</h3>
          <h2 class="main-title" :class="viewVcRow.color">{{ viewVcRow.credentialType }}</h2>
          <h1 class="hoder-name" :class="viewVcRow.color">{{ viewVcRow.holderName }}</h1>
          <h3 class="holder-email" :class="viewVcRow.color">{{ viewVcRow.holderEmail }}</h3>
          <h3 class="holder-did" :class="viewVcRow.color">{{ viewVcRow.holderDid }} </h3>

          <h3 class="custom-title g-color">Custom title</h3>
          <span class="custom-title-content" :class="viewVcRow.color">{{ viewVcRow.credentialTitle }}</span>
          <h3 class="issue-name g-color">Issue by</h3>
          <span class="issue-name-content" :class="viewVcRow.color">{{ userInfo.company }}</span>
          <h3 class="issue-time g-color">Issue AT</h3>
          <span class="issue-time-content" :class="viewVcRow.color">{{ viewVcRow.issueDate }}</span>
          <h3 class="expire-time g-color">Expires AT</h3>
          <span class="expire-time-content" :class="viewVcRow.color">{{ viewVcRow.expireDate }}</span>

          <vue-qrcode class="qr-code" :value="viewVcRow.jwt" @change="onDataUrlChange" />
        </div>
        <br>
        <el-button type="primary" size="large" class="add-recipient-info-btn" color="#1E5CEF" @click="captureVcImage"
          round>Download</el-button>
      </div>
    </el-dialog>

    <!-- Dialog View Processing View -->
    <el-dialog v-model="vcStateVisiable" :show-close="false" :width="540">
      <template #header="{ close }">
        <h4 class="dialog-header-title-m-credential">State</h4>
        <img class="dialog-close" src="../assets/img/close_black@2x.png" @click="close" alt="" />
      </template>

      <div>
        <el-timeline>
          <el-timeline-item hide-timestamp=true placement="bottom">
            <template #dot>
              <div class="dot-normal">1</div>
            </template>
            <h4 class="timeline-title-view">The issuer sends the VC to the user's mailbox</h4>
          </el-timeline-item>

          <el-timeline-item hide-timestamp=true placement="bottom">
            <template #dot>
              <div class="dot-select">2</div>
            </template>

            <h4 class="timeline-title-view">Holder creates DID through mailbox</h4>
            <div class="step2-desc-view">The holder has not created a DID via email, you can contact him offline to
              create it as soon as
              possible.</div>
          </el-timeline-item>

          <el-timeline-item hide-timestamp=true placement="bottom">
            <template #dot>
              <div class="dot-normal">3</div>
            </template>
            <h4 class="timeline-title-view">Holder receives VC and sends it successfully</h4>
          </el-timeline-item>
        </el-timeline>
      </div>

      <template #footer>
        <div class="dialogFooterView">
          <el-button class="vc-process-ensure-btn" type="default" @click="ensureVcProcessAction" round>Ok</el-button>
        </div>
      </template>
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
            <el-col :span="5" style="text-align: center;">
              <el-button class="multi-vc-btn" type="default" @click="multiVcCancelAction" round>Cancel</el-button>
            </el-col>
            <el-col :span="5" style="text-align: center;">
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

    <!-- Footer view -->

    <el-footer>
      <div class="bottomLogo">
        <img src="../assets/img/logo_Dmaster.svg" alt="" />
      </div>
    </el-footer>
  </el-container>
</template>
  
<script>
import { ref, h, reactive, toRaw, isProxy } from "vue";
import { useRequest } from 'vue-request';

import axios from "axios";
import Domain from "../router/domain.js";

let getUserInfoUrl = Domain.domainUrl + "/api/did-user/get-info";
let delVcUrl = Domain.domainUrl + "/api/did-document-credential/credential-delete/";
let personalTagsUrl = Domain.domainUrl + "/api/did-holder-tag/list/";
let queryDidUrl = Domain.domainUrl + "/api/did-user/did";
let queryDidDocUrl = Domain.domainUrl + "/api/did-document/read/";
let backupVcsUrl = Domain.domainUrl + "/api/did-document-credential/credential";
let bindingVcUrl = Domain.domainUrl + "/api/did-document-credential/bind-credential";
let newRelationUrl = Domain.domainUrl + "/api/did-document-credential/new-user-relation";
let queryRemoteVcsUrl = Domain.domainUrl + "/api/did-document-credential/credential-list";

import Header from "./Header.vue";

import { ElMessage, ElButton, ElTooltip } from "element-plus";
import { NButton, NIcon, NPopover } from "naive-ui";
import {
  DotsVertical,
  CircleCheck,
} from "@vicons/tabler";

import VueQrcode from 'vue-qrcode'
import domtoimage from "dom-to-image";
import { read, utils } from "xlsx";
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';

import vc from "../crypto/vc.js";
import ecdh from "../crypto/ecdh.js";

import tmpl from "../db/tmpl.js";
import claim from "../db/claim.js";
import dbvc from "../db/vc.js";
import user from "../db/user.js";

export default {
  name: "Home",
  components: {
    Header,
  },
  data() {
    return {
      ableToDownload: true,
      disableIssueVc: true,

      profileName: "",
      activeIndex: ref("1"),

      hasVc: true,
      userInfo: {},
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
      ableDownload: false,

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
      vcStateVisiable: false,
      vcViewLink: "",
      fileList: [],
      viewVcRow: {},

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

      didWallet: {},
    };
  },
  components: {
    VueQrcode,
  },
  created() {
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
  },
  watch: {},
  mounted() {
    let indexdb = localStorage.getItem("indexDB");
    if (indexdb == null || indexdb == undefined) {
      tmpl.createVcTemplate()
      claim.createClaims()
      localStorage.setItem("indexDB", "1")
    }

    let that = this;
    this.columns = this.createColumns({
      viewStateRow(row) {
        that.vcStateVisiable = true;
      },
      moreOpsRow(row) {
        that.popviewShow = !that.popviewShow;
      },
      viewOpRow(row) {
        that.viewVcRow = row;
        that.viewVcRow.template = "vc-bg-tmpl-" + row.templateId;
        that.viewVcRow.color = "vc-color-tmpl-" + + row.templateId;
        that.vcViewVisiable = true;
      },
      downloadOpRow(row) {
        that.singleDownloadAction(row);
      },
      // trashOpRow(row) {
      //   that.singleTrashAction(row.credentialId);
      // },
      personalInfoRow(row) {
        that.personalTagTitle = row.holderName;
        that.personalTagsAction(row.holderDid);
      },
    });

    this.getUserInfoLocal();
    this.getVcTableInfoLocal();
    this.syncVcsFromRemote();

    // queryNewRelationship
    useRequest(this.queryNewRelationship, {
      pollingInterval: 10000,
      pollingWhenHidden: true,
      onSuccess: data => {

        console.log(data.data)
        for (let i = 0; i < data.data.data.length; i++) {
          const element = data.data.data[i];
          this.queryVcNoProof(element).then(val => {
            this.queryVcWithProof(element).then(val1 => {
            })
          })
        }
      }
    });
  },
  methods: {
    handleVcDrawerClose(done) {
      alert("drawer close")
      done()
    },
    async queryVcNoProof(releation) {
      let noProofVcs = await dbvc.queryNoFilledVc(releation.credentialId);

      if (noProofVcs.length > 0) {
        for (let i = 0; i < noProofVcs.length; i++) {
          let ele = noProofVcs[i];

          ele.holderDid = releation.holderDid;
          await vc.createVcJwt(ele, this.userInfo.privateKey);
        }
      } else {
        console.log("There is no unfilled vc to operate")
      }
    },
    async queryVcWithProof(releation) {
      let proofVcs = await dbvc.queryNoBackupedVc(releation.credentialId);

      if (proofVcs.length > 0) {
        let backupObjs = {
          list: []
        }

        for (let i = 0; i < proofVcs.length; i++) {
          const element = proofVcs[i];

          let myPublicKey = this.userInfo.publicKey;

          // generate my own share secret
          let myShareSecret = ecdh.generateShareKey(this.userInfo.privateKey, myPublicKey);
          let myEncryptJwt = await ecdh.encrypt(element.jwt, myShareSecret);

          let holderDoc = await this.queryDidDocmentWith(element.holderDid);
          let holderPublicKey = holderDoc.verificationMethod[0].publicKeyBase58;

          // generate our share secret
          let shareSecret = ecdh.generateShareKey(this.userInfo.privateKey, holderPublicKey);
          let encryptJwt = await ecdh.encrypt(element.jwt, shareSecret);

          let obj = {
            credentialId: element.credentialId,
            holderDid: element.holderDid,
            ownerList: [{
              owner: element.issuerDid,
              vc: myEncryptJwt
            },
            {
              owner: element.holderDid,
              vc: encryptJwt
            }],
            templateId: element.templateId
          }

          backupObjs.list.push(obj);
        }

        // backup encrypt message to remote service
        if (backupObjs.list.length > 0) {
          let isbackup = await this.uploadVcsToRemoteService(backupObjs)
          if (isbackup == true) {
            proofVcs.forEach(element => {
              dbvc.updateVcBackup(element.id, 1)
            });
          }
        }
      } else {
        console.log("There is no backup vc to operate")
      }
    },
    async uploadVcsToRemoteService(backupObjs) {
      const res = await axios.post(backupVcsUrl, backupObjs, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      if (res.data.code == 0) {
        return true
      } else if (res.data.code == 40001) {
        this.logoutAction();
      } else {
        ElMessage({
          message: res.data.msg,
          type: "error",
        });
      }
    },
    async queryDidDocmentWith(did) {
      //queryDidDocUrl
      const res = await axios.get(queryDidDocUrl + did, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      console.log(res)

      if (res.data.code == 0) {
        return res.data.data
      }
    },
    queryHolderDidWithEmail(email) {
      return axios.post(queryDidUrl, {
        email: email,
      }, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
    },
    async queryNewRelationship() {
      return axios.post(newRelationUrl, {}, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
    },
    async bindingHolderAndVCid(bindingObj) {
      const res = await axios.post(bindingVcUrl, bindingObj, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      if (res.data.code == 0) {
        console.log("Binding ok for new vc template")
      } else if (res.data.code == 40001) {
        this.logoutAction();
      } else {
        ElMessage({
          message: res.data.msg,
          type: "error",
        });
      }
    },
    createVcDrawerDismissAction() {
      this.data = []
      this.getUserInfoLocal();
      this.getVcTableInfoLocal();
      // this.getVcTableInfo();
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
      window.localStorage.removeItem("userdid");
      window.localStorage.removeItem("username");
      window.location.reload();
    },
    createColumns({
      moreOpsRow,
      viewOpRow,
      downloadOpRow,
      viewStateRow,
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
          width: 70,
          render(row, index) {
            return h(ElTooltip, {
              placement: 'top',
              content: row.credentialId,
            }, [
              h("div", {
              }, [row.credentialId.substring(0, 16) + "..."])
            ])
          }
        },
        {
          title: "Holder Did",
          key: "holderDid",
          width: 80,
          render(row, index) {
            let holderdid = row.holderDid
            if (holderdid) {
              return h(ElTooltip, {
                placement: 'top',
                content: row.holderDid,
              }, [
                h("div", {
                }, [holderdid.substring(0, 16) + "..."])
              ])
            } else {
              return h()
            }
          }
        },
        {
          title: "Holder Email",
          key: "holderEmail",
          width: 60,
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
          width: 60,
        },
        {
          title: "Issue AT",
          key: "issueDate",
          width: 40,
        },
        {
          title: "Expires AT",
          key: "expireDate",
          width: 40,
        },
        {
          title: "State",
          key: "",
          width: 50,
          render(row, index) {
            if (row.filled == 0) {
              return h(
                "div", {
                style: {
                  color: "#1E5CEF",
                },
                onClick: () => viewStateRow(row),
              }, [
                h("img", {
                  style: {
                    'width': "18px",
                    'height': "18px",
                    'vertical-align': "middle",
                  },
                  src: "https://dmaster.com/dcommon/img/loading.svg",
                }), "Waiting"]
              )
            } else {
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
                    h("a", {
                      href: "javascript:void(0)",
                      class: "view-vc-pop-btn",
                      onClick: () => viewOpRow(row),
                    }, [
                      h(
                        "img", {
                        style: {
                          width: '18px',
                          height: '18px',
                          'margin-left': '10px',
                          'vertical-align': "middle",
                        },
                        src: "https://dmaster.com/dcommon/img/16px_view_sel.svg"
                      }
                      ), h("span", {
                        style: {
                          'margin-left': '5px',
                        }
                      }, ["view"]),
                    ]),
                    h("a", {
                      href: "javascript:void(0)",
                      class: "view-vc-pop-btn",
                      onClick: () => downloadOpRow(row),
                    }, [
                      h(
                        "img", {
                        style: {
                          width: '18px',
                          height: '18px',
                          'margin-left': '10px',
                          'vertical-align': "middle",
                        },
                        src: "https://dmaster.com/dcommon/img/16px_download_sel.svg"
                      }
                      ), h("span", {
                        style: {
                          'margin-left': '5px',
                        }
                      }, ["download"]),
                    ])

                    //onClick: () => trashOpRow(row),
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
        if (val.length > 0) {
          userinfo = val[0];
        } else {
          userinfo = await this.getUserInfoOnline();
        }
      }

      this.userInfo = userinfo;
      this.profileName = this.userInfo.email
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

      this.data = []
      this.data.push(...localVals)

      if (this.data.length == 0) {
        this.hasVc = false;
      } else {
        this.hasVc = true;
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
      let vcFile = this.fileList[0].raw;
      if (vcFile.name.indexOf(".json") == -1) {
        ElMessage({
          message: "File selected must be .json format",
          type: "err",
        });
        return
      }

      var reader = new FileReader();
      reader.onload = function (e) {
        var contents = e.target.result;

        vc.verifyVcJwt(contents).then(val => {
          console.log("verify result " + val)

          this.fileList = []
          if (val.verify == true) {
            this.vcVerifyRet = val.payload;
            this.verifyResultShow = true;

            ElMessage({
              message: "Verify result " + val.verify,
              type: "success",
            });
          } else {
            ElMessage({
              message: "Verify result " + val.verify,
              type: "err",
            });
          }
        })
      };

      reader.readAsText(vcFile);
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
    dbclickOneAction() {
      this.hasSelectedTwo = false;
      this.hasSelectedOne = !this.hasSelectedOne;

      if (this.hasSelectedOne) {
        this.schemaType = "Membership Card";
      } else {
        this.schemaType = "";
      }
      this.toAddRecipient();
    },
    dbclickTwoAction() {
      this.hasSelectedOne = false;
      this.hasSelectedTwo = !this.hasSelectedTwo;

      if (this.hasSelectedTwo) {
        this.schemaType = "Activity Certificate";
      } else {
        this.schemaType = "";
      }
      this.toAddRecipient();
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

      let value = await vc.createVcTemplate(this.userInfo.did, needClaims, this.schemaId, this.userInfo.privateKey);

      console.log(value)

      let newids = []
      let bindingObj = {
        list: []
      };

      for (let i = 0; i < value.length; i++) {
        const element = value[i];

        newids.push(element.credentialId)
        bindingObj.list.push({
          credentialId: element.vcid,
          holder: element.holder,
          templateId: this.schemaId,
        })
      }

      // addition actions
      clearInterval(timer);
      this.percentageCount += 100;
      if (this.percentageCount > 100) {
        this.percentageCount = 100;
      }

      this.vcStep = 3;
      this.newVcId = newids;
      this.newVcNum = "Issued " + this.newVcId.length + " Verifiable Credential";
      this.processing = false;
      this.createOk = true;
      if (value[0].holder.indexOf("did:dmaster") != -1) {
        this.ableDownload = true;
      }

      // bindingVcUrl
      this.bindingHolderAndVCid(bindingObj)
    },
    toDownloadAction() {
      // if (this.newVcId.length > 1) {
      //   this.batchDownloadAction(this.newVcId);
      // } else {
      //   this.singleDownloadAction(this.newVcId[0]);
      // }
    },
    async toViewVcsAction(vcid) {
      dbvc.queryVc(vcid).then(val => {
        this.viewVcRow = val[0];
        this.vcViewVisiable = true;
      });
    },
    ensureVcProcessAction() {
      this.vcStateVisiable = false;
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
    vcRowKey: (row) => row.id,
    async batchDownloadAction(rowIds) {
      let rawDataIds = {};
      if (isProxy(rowIds)) {
        rawDataIds = toRaw(rowIds)
      }

      let rets = await dbvc.queryVcsWithIds(rawDataIds);

      var zip = new JSZip();
      for (let i = 0; i < rets.length; i++) {
        const element = rets[i];
        let filename = "file_" + rawDataIds[i] + ".json";
        zip.file(filename, element.jwt);
      }

      zip.generateAsync({ type: "blob" }).then(function (content) {
        saveAs(content, "jwt.zip");
      });
    },
    async singleDownloadAction(rowData) {
      let url = window.URL.createObjectURL(new Blob([rowData.jwt]));
      let a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.setAttribute("download", "file.json");
      document.body.appendChild(a);
      a.click();
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
      let xlsxFile = this.multoVcFileList[0].raw;
      if (xlsxFile.name.indexOf(".xlsx") == -1) {
        ElMessage({
          message: "File selected must be .xlsx format",
          type: "err",
        });
        return
      }

      let data = await file.arrayBuffer()
      let workbook = read(data);
      let jsa = utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { rawNumbers: false, raw: false });

      jsa.forEach((outer) => {
        let claimObj = {}
        this.inputRecipientsData.forEach(inner => {
          let claimName = inner['claimName'].substring(2);
          let claimCode = inner['claimCode'];
          let claimContent = outer[claimName];
          claimObj[claimCode] = claimContent;
        });

        claimObj["issueDate"] = outer['Issue Date'];
        claimObj["expireDate"] = outer['Expiration Date'];
        claimObj["idx"] = this.recipientIdx;
        this.recipientTableData.push(claimObj);
        this.recipientIdx = this.recipientIdx + 1;
      });

      this.isEmptyRecipient = false;
      this.issuleMultiVCVisiable = false;
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
    async syncVcsFromRemote() {
      // // retrieve vc info remote remote
      let localvcs = await dbvc.queryVcs();

      const res = await axios.post(queryRemoteVcsUrl, {
        detail: 0,
        size: 1,
        page: 0,
      }, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      if (res.data.code == 0) {
        let remoteTotal = res.data.data.total
        let localTotal = localvcs.length

        if (remoteTotal === localTotal) {
          console.log("Local vcs %d is equal remote vcs %d, no need to sync", localTotal, remoteTotal);
        } else {
          console.log("Local vcs %d is not equal remote vcs %d, need to sync", localTotal, remoteTotal);
          let size = 100;
          let pageNum = (remoteTotal % size == 0) ? remoteTotal / size : Math.floor(remoteTotal / size) + 1;

          for (let i = 0; i < pageNum; i++) {
            const fetchDatas = await axios.post(queryRemoteVcsUrl, {
              detail: 1,
              size: size,
              page: i,
            }, {
              headers: {
                Authorization: localStorage.getItem("token"),
              },
            });

            //
            let records = fetchDatas.data.data.records;
            if (records.length > 0) {
              for (let i = 0; i < records.length; i++) {
                const element = records[i];

                let state = element.state;
                let credentialId = element.credentialId;
                let holderDid = element.holderDid;

                let holderDoc = await this.queryDidDocmentWith(holderDid);
                let holderPublicKey = holderDoc.verificationMethod[0].publicKeyBase58;
                let myPrivateKey = this.userInfo.privateKey;

                let shareSecret = ecdh.generateShareKey(myPrivateKey, holderPublicKey);
                let decryptJwt = await ecdh.decryptFromString(element.vc, shareSecret);

                let payload = await vc.decodeJwt(decryptJwt);

                let tempId = 0;
                if (payload.vc.type[0] == "Membership Card") {
                  tempId = 1
                } else if (payload.vc.type[0] == "Activity Certificate") {
                  tempId = 2
                }

                dbvc.addVc({
                  credentialId: credentialId,
                  templateId: tempId,
                  credentialType: payload.vc.type[0],
                  issuerDid: payload.iss,
                  holderEmail: payload.vc.credentialSubject.email,
                  holderName: payload.vc.credentialSubject.holderName,
                  holderDid: payload.vc.credentialSubject.id,
                  credentialTitle: payload.vc.credentialSubject.credentialTitle,
                  expireFlag: state,
                  issueDate: payload.vc.issuanceDate,
                  expireDate: payload.vc.expirationDate,
                  filled: 1,
                  jwt: decryptJwt,
                  backuped: 1,
                })
              }
            }
          }

          console.log("Sync all vcs from remote to local finished.")

          this.getVcTableInfoLocal();
        }
      } else if (res.data.code == 40001) {
        this.logoutAction();
      } else {
        ElMessage({
          message: res.data.msg,
          type: "error",
        });
      }
    }
  },
  unmounted() {
    this.timer = {};
  },
};
</script>

<style scope>
.view-vc-pop-btn {
  width: 120px;
  height: 40px;
  border-radius: 4px;
  line-height: 40px;
  text-decoration: none;
  text-align: left;
  display: block;
  color: #272E3B;
}

.view-vc-pop-btn:hover {
  background: rgb(243, 246, 253);
}

.dot-normal {
  width: 24px;
  height: 24px;
  border: 2px solid #4E5969;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  color: #ffffff;
  line-height: 20px;
  text-align: center;
  background-color: #4E5969;
  margin-left: -6px;
}

.dot-select {
  width: 24px;
  height: 24px;
  border: 2px solid #1672F0;
  border-radius: 12px;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  color: #ffffff;
  line-height: 20px;
  background-color: #1672F0;
  margin-left: -6px;
}

.timeline-title-view {
  font-size: 14px;
  font-weight: 400;
  color: #4E5969;
  line-height: 21px;
}

.step2-desc-view {
  background: #F2F3F5;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #86909C;
  line-height: 18px;
  padding: 10px;
  word-wrap: normal;
}
</style>

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

.dialogFooterView {
  text-align: center;
}

.vc-process-ensure-btn {
  width: 200px;
  height: 44px;
  background: #1D2129;
  border-radius: 24px;
  color: #FFFFFF;
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

<!-- header view -->

<style scoped>
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
  margin-top: 18%;
  margin-left: 18px;
}

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
</style>

<style scoped>
.dm-container {
  width: 100%;
  background: linear-gradient(360deg, #eef1f8 0%, #d1dbf4 60%, #eef1f8 100%);
}

.dm-main {
  padding: 0px !important;
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
  width: 85px;
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
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}

.vc-bg-tmpl-2 {
  background-image: url(../assets/img/卡面2@2x.png);
}

.vc-bg-tmpl-1 {
  background-image: url(../assets/img/卡面@2x.png);
}

.vc-color-tmpl-1 {
  color: #ffffff;
}

.vc-color-tmpl-2 {
  color: #1D2129;
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

.vc-image-view .hoder-name {
  position: absolute;
  left: 40px;
  top: 286px;
  height: 43px;
  font-size: 30px;
  font-weight: 600;
  line-height: 46px;
}

.vc-image-view .holder-did {
  position: absolute;
  left: 40px;
  top: 426px;
  width: 520px;
  height: 56px;
  font-size: 20px;
  font-weight: 400;
  color: #86909C;
  line-height: 30px;
  text-align: left;
}

.vc-image-view .holder-email {
  position: absolute;
  left: 40px;
  top: 359px;
  height: 33px;
  font-size: 24px;
  font-weight: 600;
  line-height: 35px;
}

.vc-image-view .custom-title {
  position: absolute;
  left: 30px;
  top: 669px;
  height: 28px;
  font-size: 20px;
  font-weight: 400;
  color: #86909C;
  line-height: 30px;
}

.vc-image-view .custom-title-content {
  position: absolute;
  left: 227px;
  top: 669px;
  height: 28px;
  font-size: 20px;
  font-weight: 400;
  line-height: 30px;
}

.vc-image-view .issue-name {
  position: absolute;
  left: 30px;
  top: 707px;
  height: 28px;
  font-size: 20px;
  font-weight: 400;
  color: #86909C;
  line-height: 30px;
}

.vc-image-view .issue-name-content {
  position: absolute;
  left: 227px;
  top: 707px;
  height: 33px;
  height: 28px;
  font-size: 20px;
  font-weight: 400;
  line-height: 30px;
}

.vc-image-view .issue-time {
  position: absolute;
  left: 30px;
  top: 745px;
  height: 28px;
  font-size: 20px;
  font-weight: 400;
  color: #86909C;
  line-height: 30px;
}

.vc-image-view .issue-time-content {
  position: absolute;
  left: 227px;
  top: 745px;
  height: 28px;
  font-size: 20px;
  font-weight: 400;
  line-height: 30px;
}

.vc-image-view .expire-time {
  position: absolute;
  left: 30px;
  top: 783px;
  height: 28px;
  font-size: 20px;
  font-weight: 400;
  color: #86909C;
  line-height: 30px;
}

.vc-image-view .expire-time-content {
  position: absolute;
  left: 227px;
  top: 783px;
  height: 28px;
  font-size: 20px;
  font-weight: 400;
  line-height: 30px;
}

.qr-code {
  position: absolute;
  width: 100px;
  height: 100px;
  right: 40px;
  bottom: 40px;
}
</style>