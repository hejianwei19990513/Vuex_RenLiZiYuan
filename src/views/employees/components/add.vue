<template>
  <!-- .sync双向绑定数据修饰符在正常的自定义事件子传父时只能与:before-close连用，或者去掉.sync把:before-close改成@close也行 -->
  <el-dialog title="新增员工" :visible.sync="dialogVisible" :before-close="close">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="120px">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="ruleForm.username" style="width:50%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="ruleForm.mobile" style="width:50%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="ruleForm.timeOfEntry" style="width:50%" placeholder="请选择日期" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="ruleForm.formOfEmployment" style="width:50%" placeholder="请选择">
          <el-option v-for="item in EmployeeEnum.hireType" :key="item.id" :label="item.value" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="ruleForm.workNumber" style="width:50%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input v-model="ruleForm.departmentName" style="width:50%" placeholder="请选择部门" @focus="getDepartmentInfo" />
        <el-tree
          v-if="showTree"
          v-loading="loading"
          :data="treeData"
          default-expand-all=""
          :props="{ label: 'name' }"
          @node-click="selectNode"
        />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="ruleForm.correctionTime" style="width:50%" placeholder="请选择日期" />
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="close">取消</el-button>
          <el-button type="primary" size="small" @click="add">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>
<script>
import { getDepartmentInfo } from '@/api/department.js'
import { tranListToTreeData } from '@/utils'
import EmployeeEnum from '@/api/constant/employees'
import { addEmployees } from '@/api/employees.js'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      EmployeeEnum,
      ruleForm: {
        username: '',
        mobile: '',
        timeOfEntry: '',
        mobformOfEmploymentile: '',
        workNumber: '',
        departmentName: '',
        correctionTime: ''
      },
      rules: {
        username: [{ required: true, message: '用户姓名不能为空', trigger: 'blur' }, {
          min: 1, max: 4, message: '用户姓名为1-4位'
        }],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }, {
          pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur'
        }],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }]
      },
      treeData: [],
      showTree: false,
      loading: false
    }
  },
  methods: {
    close() {
      this.ruleForm = {
        username: '',
        mobile: '',
        timeOfEntry: '',
        mobformOfEmploymentile: '',
        workNumber: '',
        departmentName: '',
        correctionTime: ''
      }
      this.$refs.ruleForm.resetFields() // 重置校验结果
      this.$emit('update:dialogVisible', false) // 这里是.sync双向绑定数据的用法
      // this.$emit('close')或者在父组件里面给add标签添加自定义事件@close="showDialog = false"两种用法都可以
    },
    async getDepartmentInfo() {
      this.showTree = true
      this.loading = true
      const { depts } = await getDepartmentInfo()
      // depts是数组 但不是树形
      this.treeData = tranListToTreeData(depts, '')
      this.loading = false
    },
    selectNode(node) {
      this.ruleForm.departmentName = node.name
      this.showTree = false
    },
    async add() {
      try {
        await this.$refs.ruleForm.validate()
        await addEmployees(this.ruleForm)
        // this.$parent 可以直接调用到父组件的实例 实际上就是父组件this
        this.$parent.getEmployeesData()
        this.$parent.showDialog = false
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
