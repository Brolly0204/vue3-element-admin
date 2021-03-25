import request from '@/utils/request'
import { IUserInfo } from '@/store/modules/user'

export function login(data: IUserInfo) {
  return request({
    url: '/vue-element-admin/user/login',
    method: 'post',
    data
  })
}
