import base from './base'
import axios from '@/api/http'
import { Promise } from 'jszip/lib/external'

const bill = {
  // 获得核销表的数据以及增删改查
  getAllList(params) {
    return new Promise((resolve, reject) => {
      axios.get(`${base.api1}/verify/verification/read`, { params: params })
        .then(res => {
          // console.log(res)
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  newForm(data) {
    return new Promise((resolve, reject) => {
      // data = JSON.stringify(data)
      axios.post(`${base.api1}/verify/verification/create`,
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
  updateForm(data) {
    return new Promise((resolve, reject) => {
      axios.post(`${base.api1}/verify/verification/update`,
        {
          data: data
        })
        .then(res => { resolve(res) })
        .catch(err => { reject(err) })
    })
  },

  // 这里是发票表的数据以及增删改查
  getInvoiceList(params) {
    return new Promise((resolve, reject) => {
      axios.get(`${base.api1}/verify/invoice/read`, { params: params })
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  newInvoice(data) {
    return new Promise((resolve, reject) => {
      // data = JSON.stringify(data)
      axios.post(`${base.api1}/verify/invoice/create`,
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
  updateInvoice(data) {
    return new Promise((resolve, reject) => {
      axios.post(`${base.api1}/verify/invoice/update`,
        {
          data: data
        })
        .then(res => { resolve(res) })
        .catch(err => { reject(err) })
    })
  }
}

export default bill
