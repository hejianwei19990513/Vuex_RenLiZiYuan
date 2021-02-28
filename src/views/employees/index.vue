<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <span slot="before">共{{ total }}条记录</span>
        <template slot="after">
          <el-button size="small" type="warning" @click="$router.push('/import')">导入</el-button>
          <el-button size="small" type="danger" @click="exportData">导出</el-button>
          <el-button :disabled="!checkPermission('POINT-USER-ADD')" size="small" type="primary" @click="addEmp">新增员工</el-button>
        </template>
      </page-tools>
      <!-- 放置表格和分页 -->
      <el-card v-loading="loading">
        <el-table border :data="list">
          <el-table-column label="序号" sortable="" type="index" />
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="头像" align="center">
            <template slot-scope="{row}">
              <img
                slot="reference"
                v-imageerror="require('@/assets/common/bigUserHeader.png')"
                :src="row.staffPhoto "
                style="border-radius: 50%; width: 100px; height: 100px; padding: 10px"
                alt=""
                @click="showQrCode(row.staffPhoto)"
              >
            </template>
          </el-table-column>
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column label="聘用形式" sortable="" :formatter="formatEmployment" prop="formOfEmployment" />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间" sortable="" align="center">
            <template slot-scope="{ row }">
              {{
                row.timeOfEntry | formatDate
              }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" align="center" sortable="" prop="enableState">
            <template slot-scope="{ row }">
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template slot-scope="{ row }">
              <el-button :disabled="!checkPermission('POINT-USER-UPDATE')" type="text" size="small" @click="toDetail(row.id)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="editRole(row.id)">角色</el-button>
              <el-button type="text" size="small" @click="del(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination layout="prev, pager, next" :page-size="queryInfo.size" :current-page="queryInfo.page" :total="total" @current-change="changePage" />
        </el-row>
      </el-card>
    </div>
    <add :dialog-visible.sync="showDialog" @closeDialog="showDialog = false" />
    <el-dialog title="二维码" :visible.sync="showCodeDialog">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
    <assign-role ref="assignRole" :show-role-dialog="showRoleDialog" :user-id="userId" @closeDialog="showRoleDialog=false" />
  </div>
</template>
<script>
import { getEmployeesList, delEmployees } from '@/api/employees.js'
import EmployeeEnum from '@/api/constant/employees'
import add from './components/add.vue'
import { formatDate } from '@/filters/index.js'
import QrCode from 'qrcode'
import assignRole from './components/assign-role.vue'
export default {
  components: {
    add,
    assignRole
  },
  data: function() {
    return {
      loading: false,
      list: [],
      queryInfo: {
        page: 1,
        size: 10
      },
      total: 0,
      showDialog: false,
      showCodeDialog: false,
      showRoleDialog: false,
      userId: null
    }
  },
  created() {
    this.getEmployeesData()
  },
  methods: {
    changePage(newPage) {
      this.queryInfo.page = newPage
      this.getEmployeesData()
    },
    async getEmployeesData() {
      this.loading = true
      const res = await getEmployeesList(this.queryInfo)
      this.list = res.rows
      this.total = res.total
      this.loading = false
    },
    formatEmployment(row, column, cellValue, index) {
      // 要去找 1所对应的值
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    async del(id) {
      try {
        await this.$confirm('您确定删除该员工吗')
        await delEmployees(id)
        this.getEmployeesData()
        this.$message.success('删除员工成功')
      } catch (error) {
        console.log(error)
      }
    },
    addEmp() {
      this.showDialog = true
    },
    exportData() {
      // 表头对应关系
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 懒加载
      import('@/vendor/Export2Excel').then(async excel => {
        const { rows } = await getEmployeesList({ page: 1, size: this.total })
        console.log(rows)
        const data = this.formatJson(headers, rows)
        // 复杂表头需要加multiHeader和merges
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data,
          filename: '员工信息表',
          autoWidth: true,
          bookType: 'xlsx',
          multiHeader,
          merges
        })
      })
    },
    formatJson(headers, rows) {
      // 首先遍历数组
      // [{ username: '张三'},{},{}]  => [[’张三'],[],[]]
      return rows.map(item => {
        return Object.keys(headers).map(key => {
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            return formatDate(item[headers[key]]) // 返回格式化之前的时间
          } else if (headers[key] === 'formOfEmployment') {
            var en = EmployeeEnum.hireType.find(obj => obj.id === item[headers[key]])
            return en ? en.value : '未知'
          }
          return item[headers[key]]
        }) // => ["张三", "13811"，"2018","1", "2018", "10002"]
      })
    },
    toDetail(id) {
      this.$router.push(`/employees/detail/${id}`)
    },
    showQrCode(url) {
      console.log(url)
      if (url) {
        this.showCodeDialog = true
        // 将这个图片地址转化为二维码链接
        this.$nextTick(() => {
          QrCode.toCanvas(this.$refs.myCanvas, url)
        })
      } else {
        this.$message.warning('该用户还未上传头像')
      }
    },
    async editRole(id) {
      this.userId = id
      await this.$refs.assignRole.getUserDetailById(id) // 父组件调用子组件方法
      this.showRoleDialog = true
    }
  }
}
</script>
<style lang="less" scoped>
</style>
