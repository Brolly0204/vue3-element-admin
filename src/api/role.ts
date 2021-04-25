import request from '@/utils/request'
import { IResponseDataType } from './type'

export const getRoles = () => {
  return new Promise<IResponseDataType>(resolve => {
    request({
      url: '/vue-element-admin/roles',
      method: 'get'
    }).then((res) => {
      // @ts-ignore
      return resolve(res)
    })
  })
}

export const getRoutes = () => {
  return new Promise(resolve => {
    request({
      url: '/vue-element-admin/routes',
      method: 'get'
    }).then(res => {
      resolve(res)
    })
  })
}

export const addRole = (data: object) => {
  return new Promise(resolve => {
    request({
      url: '/vue-element-admin/role',
      method: 'post',
      data
    }).then(res => {
      resolve(res)
    })
  })
}
