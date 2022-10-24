<template>
  <div class="common-layout">
    <el-container>
      <el-header class="headerview">
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
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

      <el-main>
        <div class="fill-view">
          <div class="fill-t-view">
            <h1>Tell us about yourself</h1>
            <h3>We’ll help you get started based on your choices</h3>
          </div>

          <br />

          <h3>* Company or Organization</h3>
          <el-input
            class="org-input"
            v-model="orgcontent"
            placeholder="Please input"
          />

          <br>

          <div>
            <div class="name-left">
              <h3>* First name</h3>
            </div>
            <div class="name-right">
              <h3>* Last name</h3>
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

const activeIndex = ref("1");
// const handleSelect = (key: string, keyPath: string[]) => {
//   console.log(key, keyPath)
// }
</script>

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
  background: #ffffff;
}

.fill-t-view {
  width: 760px;
  height: 136px;
  background: #ffffff;
}
</style>