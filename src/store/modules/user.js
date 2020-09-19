// import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken, getAccessToken, setAccessToken, removeAccessToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
// import axios from 'axios'
import api from '@/api'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  headers: getAccessToken()
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_HEADERS: (state, headers) => {
    state.headers = headers
  }
}
const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}
const actions = {
  // user login
  // this.users[]
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    // const setUrl = 'https://ht1.jomeswang.top/api/user/set'
    // const loginUrl = 'https://ht1.jomeswang.top/api/user/login'
    // const signupUrl = 'https://ht1.jomeswang.top/api/user/signup'
    // axios.post(loginUrl, { username: username.trim(), password: password })
    // axios.post(setUrl, { username: username.trim(), password: password })
    //   .then(res => console.log(res))
    //   .catch(err => console.log(err))

    return new Promise((resolve, reject) => {
      // login({ username: username.trim(), password: password }).then(response => {
      //   const { data } = response
      //   commit('SET_TOKEN', data.token)
      //   setToken(data.token)
      //   resolve()
      // }).catch(error => {
      //   reject(error)
      // })
      // axios.post(loginUrl, { username: username.trim(), password: password })
      api.user.loginUser({ username: username.trim(), password: password })
        .then(res => {
          // console.log(res.headers)
          const headers = { 'Content-Type': res.headers['content-type'], 'X-Access-Token': res.headers['x-access-token'] }
          commit('SET_HEADERS', headers)
          setAccessToken(headers)
          const data = tokens[res.data.username]
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          resolve()
        })
        .catch(err => { reject(err) })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // getInfo(state.token).then(response => {
      const data = users[state.token]
      // console.log(data)
      if (!data) {
        reject('Verification failed, please Login again.')
      }

      const { roles, name, avatar, introduction } = data

      // roles must be a non-empty array
      if (!roles || roles.length <= 0) {
        reject('getInfo: roles must be a non-null array!')
      }

      commit('SET_ROLES', roles)
      commit('SET_NAME', name)
      commit('SET_AVATAR', avatar)
      commit('SET_INTRODUCTION', introduction)
      resolve(data)
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeAccessToken()
      removeToken()
      resetRouter()

      // reset visited views and cached views
      // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
