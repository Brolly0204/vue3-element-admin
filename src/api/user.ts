import request from '@/utils/request'
import mockRequest from '@/utils/requestMock'
import { IUserInfo } from '@/store/modules/user'

export const login = (data: IUserInfo) => {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}
// export function login(data: IUserInfo) {
//   return mockRequest({
//     url: '/vue-element-admin/user/login',
//     method: 'post',
//     data
//   })
// }

export function getInfo(token: string) {
  return request({
    // url: '/vue-element-admin/user/info',
    url: '/auth/info',
    method: 'get'
  })
}

export function logout(token: string) {
  return mockRequest({
    url: '/vue-element-admin/user/logout',
    method: 'post',
    data: { token }
  })
}
