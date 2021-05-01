/* eslint-disable @typescript-eslint/no-var-requires */
const Mock = require('mockjs')
const { asyncRoutes, constantRoutes } = require('./routes')
const { deepClone } = require('../utils')

const routes = deepClone([...constantRoutes, ...asyncRoutes])

const roles = [
  {
    key: 'admin',
    name: 'admin',
    description: 'Super Administrator. Have access to view all pages.',
    routes: routes
  },
  {
    key: 'editor',
    name: 'editor',
    description: 'Normal Editor. Can see all pages except permission page',
    routes: routes.filter(i => i.path !== '/permission') // just a mock
  },
  {
    key: 'visitor',
    name: 'visitor',
    description:
      'Just a visitor. Can only see the home page and the document page',
    routes: [
      {
        path: '',
        redirect: 'dashboard',
        children: [
          {
            path: 'dashboard',
            name: 'Dashboard',
            meta: { title: 'dashboard', icon: 'dashboard' }
          }
        ]
      }
    ]
  }
]

module.exports = [
  {
    url: '/vue-element-admin/roles',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: roles
      }
    }
  },
  {
    url: '/vue-element-admin/routes',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: routes
      }
    }
  },
  {
    url: '/vue-element-admin/role',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: {
          key: Mock.mock('@integer(300, 5000)')
        }
      }
    }
  },
  {
    url: '/vue-element-admin/role/[A-Za-z0-9]',
    type: 'put',
    response: _ => {
      console.log(_.body)
      return {
        code: 20000,
        data: {
          status: 'success'
        }
      }
    }
  },
  {
    url: '/vue-element-admin/role/[A-Za-z0-9]',
    type: 'delete',
    response: _ => {
      return {
        code: 20000,
        data: {
          status: 'success'
        }
      }
    }
  }
]
