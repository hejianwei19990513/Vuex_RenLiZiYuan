<template>
  <div v-loading="loading" class="departerments-container">
    <div class="app-container">
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <tree-tools :tree-node="company" @addDialog="addDep" />
        <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
          <tree-tools slot-scope="{ data }" :tree-node="data" @delDepaat="getDepartmentData" @addDialog="addDep" @editDialog="editDep" />
        </el-tree>
      </el-card>
    </div>
    <add ref="addDept" :dialog-visible="showAddDialog" :tree-node="node" :is-edit="isEdit" @closeAdd="showAddDialog = false" @addDepts="getDepartmentData" @closeDialog="showAddDialog = false" />
  </div>
</template>
<script>
import treeTools from './components/tree-tools.vue'
import { getDepartmentInfo } from '@/api/department.js'
import { tranListToTreeData } from '@/utils/index.js'
import add from './components/add'
export default {
  components: { treeTools, add },
  data: function() {
    return {
      company: {
        name: '',
        manager: '负责人',
        isRoot: true,
        id: ''
      },
      departs: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      showAddDialog: false,
      node: null, // 记录当前点击的node节点
      isEdit: false,
      loading: false
    }
  },
  created() {
    this.getDepartmentData()
  },
  methods: {
    async getDepartmentData() {
      this.loading = true
      const res = await getDepartmentInfo()
      this.company.name = res.companyName
      this.departs = tranListToTreeData(res.depts, '') // 把后台传送的列表型数据转化为树形结构数据
      this.loading = false
    },
    addDep(node) {
      this.showAddDialog = true
      this.isEdit = false
      this.node = node
      this.$refs.addDept.resetData()
    },
    editDep(node) {
      this.showAddDialog = true
      this.isEdit = true
      this.node = node
      this.$refs.addDept.getEditData(node.id)
    }
  }
}
</script>
<style scoped>
.tree-card {
  padding: 30px  140px;
  font-size:14px;
}
</style>
