import request from '@/utils/request'
import { IUserInfo } from '@/store/modules/user'

export function login(data: IUserInfo) {
  return request({
    url: '/vue-element-admin/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token: string) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout(token: string) {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post',
    data: { token }
  })
}
