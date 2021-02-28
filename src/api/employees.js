import request from '@/utils/request'

export function getEmployeesSimple() {
  return request({
    url: '/sys/user/simple',
    method: 'get'
  })
}

export function getEmployeesList(params) {
  return request({
    url: '/sys/user',
    method: 'get',
    params
  })
}

export function delEmployees(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'delete'
  })
}

export function addEmployees(data) {
  return request({
    url: `/sys/user`,
    method: 'post',
    data
  })
}

export function importEmployees(data) {
  return request({
    url: `/sys/user/batch`,
    method: 'post',
    data
  })
}

export function saveUserDetailById(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put',
    data
  })
}

export function getUserPersonalInfo(id) {
  return request({
    url: `/employees/${id}/personalInfo`,
    method: 'get'
  })
}

export function saveUserPersonalInfo(data) {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'put',
    data
  })
}

export function getUserJobInfo(id) {
  return request({
    url: `/employees/${id}/jobs`,
    method: 'get'
  })
}

export function saveUserJobInfo(data) {
  return request({
    url: `/employees/${data.userId}/jobs`,
    method: 'put',
    data
  })
}

export function saveUserRole(data) {
  return request({
    url: `/sys/user/assignRoles`,
    method: 'put',
    data
  })
}
