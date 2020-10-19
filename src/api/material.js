import base from './base'
import axios from '@/api/http'
import { Promise } from 'jszip/lib/external'

const material = {
  // 现有耗材管理
  getExist(params) {
    return new Promise((resolve, reject) => {
      axios.get(`${base.api1}/asset/exist_asset/read`, { params: params })
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  newExist(data) {
    return new Promise((resolve, reject) => {
      // data = JSON.stringify(data)
      axios.post(`${base.api1}/asset/exist_asset/create`,
        { data: data,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }})
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  editExist(data) {
    return new Promise((resolve, reject) => {
      // data = JSON.stringify(data)
      axios.post(`${base.api1}/asset/exist_asset/update`,
        { data: data,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }})
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  deleteExist(data) {
    return new Promise((resolve, reject) => {
      // data = JSON.stringify(data)
      axios.post(`${base.api1}/asset/exist_asset/delete`,
        { data: data,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }})
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  getReserve(params) {
    return new Promise((resolve, reject) => {
      axios.get(`${base.api1}/asset/reserve_asset/read`, { params: params })
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  newReserve(data) {
    return new Promise((resolve, reject) => {
      // data = JSON.stringify(data)
      axios.post(`${base.api1}/asset/reserve_asset/create`,
        { data: data,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }})
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  editReserve(data) {
    return new Promise((resolve, reject) => {
      // data = JSON.stringify(data)
      axios.post(`${base.api1}/asset/reserve_asset/update`,
        { data: data,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }})
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  deleteReserve(data) {
    return new Promise((resolve, reject) => {
      // data = JSON.stringify(data)
      axios.post(`${base.api1}/asset/reserve_asset/delete`,
        { data: data,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }})
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}

export default material
