import base from './base'
import axios from '@/api/http'
import { Promise } from 'jszip/lib/external'

const budget = {
  getBudget(params) {
    return new Promise((resolve, reject) => {
      axios.get(`${base.api1}/verify/budget/read`, { params: params })
        .then(res => {
          // console.log(res)
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  newBudget(data) {
    return new Promise((resolve, reject) => {
      // data = JSON.stringify(data)
      axios.post(`${base.api1}/verify/budget/create`,
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
  updateBudget(data) {
    return new Promise((resolve, reject) => {
      axios.post(`${base.api1}/verify/budget/update`,
        {
          data: data
        })
        .then(res => { resolve(res) })
        .catch(err => { reject(err) })
    })
  }
}

export default budget
