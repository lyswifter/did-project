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
              <img class="logoview" src="../assets/img/LOGO@2x.png" alt="">
            </el-menu-item>
            <div class="flex-grow" />
            <el-menu-item index="1">
              <div class="profileview">
                M
              </div>
            </el-menu-item>
          </el-menu>
        </el-header>
  
        <el-main>Main</el-main>
  
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
  
  .profileview {
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