<template>
  <el-dialog :title="isEdit?'编辑部门':'新增部门'" :visible.sync="dialogVisible" :before-close="handleClose">
    <el-form ref="formRef" :model="formData" label-width="120px" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" style="width:80%" placeholder="请选择" @focus="getEmployeesData">
          <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="cancel">取 消</el-button>
        <el-button size="small" type="primary" @click="submit">确 定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import { getDepartmentInfo, addDepartment, editDepartment, getDepartmentDetail } from '@/api/department.js'
import { getEmployeesSimple } from '@/api/employees.js'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      required: true
    },
    treeNode: {
      type: Object,
      default: null
    },
    isEdit: {
      type: Boolean,
      required: true
    }
  },
  data: function() {
    var checkName = async(rule, value, callback) => {
      const { depts } = await getDepartmentInfo()
      let isRepeat = false
      if (this.isEdit) {
        isRepeat = depts.filter(item => item.id !== this.formData.id && item.pid === this.treeNode.pid).some(item => item.name === value)
      } else {
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }
      isRepeat ? callback(new Error(`同级部门下已经有${value}的部门了`)) : callback()
    }
    var checkCode = async(rule, value, callback) => {
      const { depts } = await getDepartmentInfo()
      let isRepeat = false
      if (this.isEdit) {
        isRepeat = depts.some(item => item.id !== this.formData.id && item.code === value && value)
      } else {
        isRepeat = depts.some(item => item.code === value && value)
      }
      isRepeat ? callback(new Error(`组织架构中已经有部门使用${value}编码`)) : callback()
    }
    return {
      formData: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      rules: {
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' },
          { trigger: 'blur', validator: checkName }],
        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' },
          { trigger: 'blur', validator: checkCode }],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { trigger: 'blur', min: 1, max: 300, message: '部门介绍要求1-50个字符' }]
      },
      peoples: []
    }
  },
  methods: {
    handleClose() {
      this.$emit('closeAdd')
      this.$refs.formRef.resetFields()
    },
    resetData() {
      this.formData = { name: '', code: '', manager: '', introduce: '' }
    },
    async getEditData(id) {
      this.formData = await getDepartmentDetail(id)
      // props传值是异步的，所以这里的id不能写this.treeNode.id
    },
    async getEmployeesData() {
      this.peoples = await getEmployeesSimple()
    },
    submit() {
      this.$refs.formRef.validate(async valid => {
        if (valid) {
          if (this.isEdit) {
            await editDepartment(this.formData)
          } else {
            await addDepartment({ ...this.formData, pid: this.treeNode.id })
          }
          this.$emit('addDepts')
          this.$emit('closeDialog')
        }
      })
    },
    cancel() {
      this.$refs.formRef.resetFields()
      this.$emit('closeDialog')
    }
  }
}
</script>
<style lang="">
</style>
