<template>
  <el-row type="flex" justify="space-between" align="middle" style="height: 40px; width: 100%">
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <!-- 两个内容 -->
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <!-- 下拉菜单 element -->
          <el-dropdown @command="handleCommand">
            <span>
              操作<i class="el-icon-arrow-down" />
            </span>
            <!-- 下拉菜单 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add" :disabled="!checkPermission('add-dept')">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!treeNode.isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!treeNode.isRoot" command="del">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>
<script>
import { delDepartment } from '@/api/department.js'
export default {
  props: {
    treeNode: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleCommand(command) {
      if (command === 'add') {
        // 添加部门操作
        this.$emit('addDialog', this.treeNode)
      } else if (command === 'edit') {
        // 编辑部门操作
        this.$emit('editDialog', this.treeNode)
      } else {
        // 删除部门操作
        this.$confirm('您确定要删除这个组织部门吗').then(() => {
          return delDepartment(this.treeNode.id)
        }).then(() => {
          this.$emit('delDepaat')
          this.$message.success('删除部门成功')
        })
      }
    }
  }
}
</script>
<style lang="">
</style>
