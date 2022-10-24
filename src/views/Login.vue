<template>
  <div>
    <div id="left">
      <img
        id="logo"
        src="../assets/img/sign_decorate@2x.png"
        alt=""
        srcset=""
      />
      <h3 id="welcome-title">Welcome to DID+</h3>
      <br />

      <h4 id="email-title">Email</h4>
      <el-input
        class="email-input"
        v-model="emailcontent"
        placeholder="Please input"
      />

      <br />
      <br />

      <h4 id="email-vc">Email verification code</h4>
      <div>
        <el-input
          class="email-vc-input"
          v-model="emailvccontent"
          placeholder="Please input"
        />
        <el-button class="email-vc-btn">Send</el-button>
      </div>

      <br />
      <br />
      <br />

      <el-button class="continue-btn" @click="continueAction"
        >Continue</el-button
      >
    </div>

    <div id="right">
      <img id="right-pic" src="../assets/img/sign_pic@2x.png" alt="" />
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "LoginView",
  data() {
    return {
      emailcontent: "xxx",
      emailvccontent: "yyy",
    };
  },
  async created() {
    try {
      const res = await axios.get(`http://localhost:3000/items`);
      this.items = res.data;
    } catch (error) {
      console.log(error);
    }
  },
  mounted() {},
  methods: {
    async addItem() {
      const res = await axios.post(`http://localhost:3000/items`, {
        name: this.itemName,
      });
      this.items = [...this.items, res.data];
      this.itemName = "";
    },
    continueAction() {
        this.$router.push({name: 'personInfo'});
    }
  },
};
</script>

<style scoped>
#left {
  width: 680px;
  height: 868px;
  background: #ffffff;
  box-shadow: 2px 0px 15px 0px rgba(30, 92, 239, 0.12);
  float: left;
}

#logo {
  width: 33px;
  height: 33px;
  margin-left: 91px;
  margin-top: 136px;
}

#welcome-title {
  margin-left: 105px;
  margin-top: 65px;
  width: 245px;
  height: 39px;
  font-size: 28px;
  font-family: Poppins-Bold, Poppins;
  font-weight: bold;
  color: #1d2129;
  line-height: 42px;
}

#email-title {
  margin-left: 105px;
  width: 40px;
  height: 20px;
  font-size: 14px;
  font-family: Poppins-SemiBold, Poppins;
  font-weight: 600;
  color: #1d2129;
  line-height: 21px;
}

.email-input {
  margin-left: 105px;
  width: 430px;
  height: 48px;
  background: #f2f3f5;
}

#email-vc {
  margin-left: 105px;
  width: 163px;
  height: 20px;
  font-size: 14px;
  font-family: Poppins-SemiBold, Poppins;
  font-weight: 600;
  color: #1d2129;
  line-height: 21px;
}

.email-vc-input {
  margin-left: 105px;
  width: 320px;
  height: 48px;
  background: #f2f3f5;
}

.email-vc-btn {
  width: 110px;
  height: 48px;
  background: #1d2129;
  border-radius: 4px;
  color: white;
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

<style scoped>
#right {
  height: 868px;
  background: #f5f7fd;
  margin-left: 680px;
}

#right-pic {
  margin-top: 142px;
  margin-left: 105px;
  width: 565px;
  height: 549px;
}
</style>