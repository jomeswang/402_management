import base from './base'
import axios from '@/api/http'

const user = {
  editPassword(params) {
    return axios.post(`${base.api}/user/signup`, params)
  },
  loginUser(params) {
    return axios.post(`${base.api}/user/login`, params)
  }
}

export default user
