import request from '@/utils/request'

export function getDepartmentInfo() {
  return request({
    url: '/company/department',
    method: 'get'
  })
}

export function delDepartment(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'DELETE'
  })
}

export function addDepartment(data) {
  return request({
    url: `/company/department`,
    method: 'POST',
    data
  })
}

export function editDepartment(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}

export function getDepartmentDetail(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'get'
  })
}
