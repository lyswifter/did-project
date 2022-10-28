<template>
  <div>
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
                  <span style="margin-right: 13px"></span>{{ profileName }}
                </div>
              </template>

              <div>
                <n-button text color="#ff69b4" @click="logoutAction">
                  <template #icon>
                    <n-icon>
                      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-2"></path><path d="M7 12h14l-3-3m0 6l3-3"></path></g></svg>
                    </n-icon>
                  </template>
                  Sign out
                </n-button>
              </div>
            </n-popover>
          </el-menu-item>
        </el-menu>
      </el-header>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>