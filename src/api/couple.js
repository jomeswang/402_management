import base from './base'
import axios from '@/api/http'

const couple = {
  getUserCouple() {
    return axios.get(`${base.api}/event`)
  },
  getCoupleList() {
    return axios.get(`${base.api}/orderForm/`)
  },
  getCoupleRule() {
    return axios.get(`${base.api}/coupons`)
  },
  createCoupleRule(params) {
    return axios.post(`${base.api}/coupons/new/`, JSON.stringify(params))
  },
  fixCoupleRule(params) {
    return axios.post(`${base.api}/coupons/fix`, JSON.stringify(params))
  },
  deleteCoupleRule(params) {
    return axios.post(`${base.api}/coupons/delete`, JSON.stringify(params))
  },
  deleteCoupleRuleAll(params) {
    return axios.post(`${base.api}/event/delete`, params)
  }

}

export default couple
