<template>
  <div style="height: 734px width: 1200px">
    <el-auto-resizer>
      <template #default="{ height, width }">
        <el-table-v2
          :columns="columns"
          :data="data"
          :width="width"
          :height="height"
          fixed
        />
      </template>
    </el-auto-resizer>
  </div>
</template>

<script>
import { ref, unref } from 'vue'
import { ElCheckbox } from 'element-plus'

// import type { FunctionalComponent } from 'vue'
// import type { CheckboxValueType, Column } from 'element-plus'

export default {
    name: "Vctable",
    data() {
        return {
            data: []
        }
    },
    created() {

    },
    mounted() {

    },
    mounted: {

    }
}
</script>

<style>

</style>