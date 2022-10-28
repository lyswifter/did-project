<template>
  <div id="container">
    <div id="contentView">
      <div>
        <div class="titleView">Create Verifiable Credential</div>
        <img class="closeBtn" src="../assets/img/close_black@2x.png" alt="" />
      </div>

      <div class="schemaView"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "schema",
};
</script>

<style scoped>
#container {
  width: 100%;
  height: 100%;
}

.contentView {
  padding-left: 120px;
  padding-right: 120px;
  background: #FFFFFF;
border-radius: 80px 80px 0px 0px;
}

.titleView {
  float: left;
  width: 403px;
  height: 39px;
  font-size: 28px;
  font-weight: bold;
  color: #1d2129;
  line-height: 42px;
}

.closeBtn {
  width: 33px;
  height: 33px;
  margin-left: 90%;
}

.schemaView {
  width: 100%;
  height: 600px;
}
</style>