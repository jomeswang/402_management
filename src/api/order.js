import base from './base'
import axios from '@/api/http'

const order = {
  //  获得order 数据
  getOrderList() {
    return axios.get(`${base.api}/order/`)
  },
  //  改变订单状态
  postList(params) {
    return axios.post(`${base.api}/order/update`, params)
  }
}

export default order
