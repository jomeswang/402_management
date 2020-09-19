import base from './base'
import axios from '@/api/http'

const room = {
  getRoomList() {
    return axios.get(`${base.api}/room`)
  },
  deleteOneRoom(params) {
    return axios.post(`${base.api}/room/delete`, JSON.stringify(params))
  },
  createRoom(params) {
    return axios.post(`${base.api}/room/new`, JSON.stringify(params))
  },
  fixRoom(params) {
    return axios.post(`${base.api}/room/fix`, JSON.stringify(params))
  }

}

export default room
