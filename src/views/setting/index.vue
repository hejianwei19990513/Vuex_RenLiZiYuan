<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height:60px">
              <el-button icon="el-icon-plus" size="small" type="primary" @click="dialogVisible = true">新增角色</el-button>
            </el-row>
            <!-- 表格 -->
            <el-table border="" :data="roleList">
              <el-table-column align="center" type="index" label="序号" width="120" />
              <el-table-column align="center" prop="name" label="角色名称" width="240" />
              <el-table-column align="center" prop="description" label="描述" />
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <el-button size="small" type="success" @click="assignPerm(scope.row.id)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="edit(scope.row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="del(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="height: 60px">
              <!-- 分页组件 -->
              <el-pagination :current-page="queryInfo.page" :page-size="queryInfo.pagesize" layout="prev,pager,next" :total="total" @current-change="handleCurrentChange" />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改" type="info" show-icon :closable="false" />
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input v-model="companyData.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="companyData.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="companyData.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="companyData.remarks" type="textarea" :rows="3" disabled style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- @close在点击确定按钮的时候也会触发 -->
    <el-dialog :title="roleForm.id?'编辑角色':'新增角色'" :visible.sync="dialogVisible" width="30%" @close="btnCancel">
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 分配权限弹出框 -->
    <el-dialog title="分配权限" :visible="showPermDialog" @close="btnPermCancel">
      <!-- 权限是一颗树 -->
      <!-- 将数据绑定到组件上 -->
      <!-- check-strictly 如果为true 那表示父子勾选时  不互相关联 如果为false就互相关联 -->
      <!-- id作为唯一标识 -->
      <el-tree
        ref="permTree"
        :data="permData"
        :props="defaultProps"
        :show-checkbox="true"
        :check-strictly="true"
        :default-expand-all="true"
        :default-checked-keys="selectCheck"
        node-key="id"
      />
      <!-- 确定 取消 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnPermOK">确定</el-button>
          <el-button size="small" @click="btnPermCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { getRoleInfo, getCompanyInfo, delRole, getRoleDetail, editRole, addRole, assignPerm } from '@/api/setting.js'
import { mapGetters } from 'vuex'
import { tranListToTreeData } from '@/utils'
import { getPermissionList } from '@/api/permission'
export default {
  data: function() {
    return {
      activeName: 0,
      queryInfo: {
        page: 1,
        pagesize: 10
      },
      total: 0,
      roleList: [],
      companyData: {},
      dialogVisible: false,
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      },
      showPermDialog: false,
      defaultProps: {
        label: 'name'
      },
      permData: [],
      selectCheck: [],
      roleId: null
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.getRoleList()
    this.getCompanyData()
  },
  methods: {
    async getRoleList() {
      const res = await getRoleInfo(this.queryInfo)
      // console.log(res)
      this.total = res.total
      this.roleList = res.rows
    },
    async getCompanyData() {
      const res = await getCompanyInfo(this.companyId)
      this.companyData = res
    },
    handleCurrentChange(val) {
      this.queryInfo.page = val
      this.getRoleList()
    },
    async del(id) {
      try {
        await this.$confirm('确认删除该角色吗')
        await delRole(id)
        this.getRoleList()
        this.$message.success('删除角色成功')
      } catch (error) {
        console.log(error)
      }
    },
    async edit(id) {
      this.roleForm = await getRoleDetail(id)
      console.log(this.roleForm)
      this.dialogVisible = true
    },
    btnCancel() {
      this.roleForm = {
        name: '',
        description: ''
      }
      this.$refs.roleForm.resetFields()
      this.dialogVisible = false
    },
    async btnOK() {
      try {
        await this.$refs.roleForm.validate() // 只有校验情况下 才会执行await的下方内容
        if (this.roleForm.id) {
          // 编辑角色功能
          await editRole(this.roleForm)
        } else {
          // 新增角色功能
          await addRole(this.roleForm)
        }
        this.getRoleList()
        this.$message.success('操作成功')
        this.dialogVisible = false
      } catch (error) {
        console.log(error)
      }
    },
    btnPermCancel() {
      this.selectCheck = []
      this.showPermDialog = false
    },
    async btnPermOK() {
      try {
        await assignPerm({ permIds: this.$refs.permTree.getCheckedKeys(), id: this.roleId })
        this.$message.success('分配权限成功')
        this.showPermDialog = false
      } catch (error) {
        console.log(error)
      }
    },
    async assignPerm(id) {
      this.permData = tranListToTreeData(await getPermissionList(), '0')
      this.roleId = id
      const { permIds } = await getRoleDetail(id)
      this.selectCheck = permIds // 将当前角色所拥有的权限id赋值
      this.showPermDialog = true
    }
  }
}
</script>
<style lang="less" scoped>
</style>

