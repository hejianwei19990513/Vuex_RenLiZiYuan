import request from '@/utils/request'

export function getPermissionList() {
  return request({
    url: '/sys/permission',
    method: 'get'
  })
}

export function addPermission(data) {
  return request({
    url: '/sys/permission',
    method: 'post',
    data
  })
}

export function delPermission(id) {
  return request({
    url: `/sys/permission/${id}`,
    method: 'delete'
  })
}

export function editPermission(data) {
  return request({
    url: `/sys/permission/${data.id}`,
    method: 'put',
    data
  })
}

export function getPermissionById(id) {
  return request({
    url: `/sys/permission/${id}`,
    method: 'get'
  })
}
