<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右的按钮 -->
      <page-tools>
        <template v-slot:after>
          <el-button type="primary" size="small" @click="addPermission(1, '0')">添加权限</el-button>
        </template>
      </page-tools>
      <!-- 表格 -->
      <el-table :data="permissionList" border="" row-key="id">
        <el-table-column label="名称" prop="name" />
        <el-table-column label="标识" prop="code" align="center" />
        <el-table-column label="描述" prop="description" align="center" />
        <el-table-column label="操作" align="center">
          <template slot-scope="{ row }">
            <el-button v-if="row.type === 1" type="text" @click="addPermission(2, row.id)">添加</el-button>
            <el-button type="text" @click="editPermission(row.id)">编辑</el-button>
            <el-button type="text" @click="delPermission(row.id)"> 删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 放置一个弹层 用来编辑新增节点 -->
    <el-dialog :title="`${showText}权限点`" :visible="showDialog" @close="btnCancel">
      <!-- 表单 -->
      <el-form ref="perForm" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" style="width:90%" />
        </el-form-item>
        <el-form-item label="开启">
          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { getPermissionList, addPermission, delPermission, editPermission, getPermissionById } from '@/api/permission'
import { tranListToTreeData } from '@/utils'
export default {
  data() {
    return {
      permissionList: [],
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      },
      showDialog: false,
      showText: ''
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList() {
      this.permissionList = tranListToTreeData(await getPermissionList(), '0')
    },
    addPermission(type, pid) {
      this.formData.pid = pid
      this.formData.type = type
      this.showDialog = true
      this.showText = '新增'
    },
    async editPermission(id) {
      this.formData = await getPermissionById(id)
      this.showDialog = true
    },
    async delPermission(id) {
      try {
        await this.$confirm('确定要删除该数据吗')
        await delPermission(id)
        this.getPermissionList()
        this.$message.success('删除成功')
      } catch (error) {
        console.log(error)
      }
    },
    btnOK() {
      this.$refs.perForm.validate().then(() => {
        if (this.formData.id) {
          return editPermission(this.formData)
        }
        return addPermission(this.formData)
      }).then(() => {
        //  提示消息
        this.$message.success('操作成功')
        this.getPermissionList()
        this.showDialog = false
      })
    },
    btnCancel() {
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      this.$refs.perForm.resetFields()
      this.showDialog = false
    }
  }
}
</script>
<style lang="less" scoped>
</style>
