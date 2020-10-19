import base from './base'
import axios from '@/api/http'

const user = {
  editPassword(params) {
    return axios.post(`${base.api1}/user/chpwd`, params)
  },
  loginUser(params) {
    return axios.post(`${base.api1}/user/login`, params)
  },
  registerUser(params) {
    return axios.post(`${base.api1}/user/register`, params)
  }
}

export default user
