import request from '@/utils/request'

export function getRoleInfo(params) {
  return request({
    url: '/sys/role',
    method: 'get',
    params
  })
}

export function getCompanyInfo(id) {
  return request({
    url: `/company/${id}`,
    method: 'get'
  })
}

export function delRole(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}

export function getRoleDetail(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'get'
  })
}

export function editRole(data) {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'put',
    data
  })
}

export function addRole(data) {
  return request({
    url: `/sys/role`,
    method: 'post',
    data
  })
}

export function assignPerm(data) {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}
