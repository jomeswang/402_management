const state = {
  orderNum: 0,
  dayOrderNum: 0,
  dayEarnings: 0,
  roomUsed: 0,
  orderRoomDetail: [
  ],
  unConfirmOrder: [],
  earnings: [0, 0, 0, 0, 0, 0, 0],
  list: []
}
import axios from 'axios'
import user from './user'

const mutations = {

}

const actions = {
  getList({ state, commit }) {
    return new Promise((resolve, reject) => {
      state.orderNum = 0
      state.dayOrderNum = 0
      state.dayEarnings = 0
      state.roomUsed = 0
      state.orderRoomDetail.length = 0
      state.unConfirmOrder.length = 0
      state.earnings.length = 0
      state.list.length = 0
      const findUrl = 'https://ht1.jomeswang.top/api/order/'
      // console.log(use, '456')
      // console.log(user)

      axios.get(findUrl, { headers: user.state.headers })
        .then((res) => {
          res.data.forEach((item) => {
            const obj = JSON.parse(item)
            const obj1 = {}
            obj1.order_id = obj.counters
            obj1.order_begin_time = obj.order_begin_time
            obj1.order_end_time = obj.order_end_time
            // obj1.credit_id = obj.id
            obj1.order_name = obj.form.order_name
            obj1.order_phone_number = obj.form.order_phone_number
            obj1.order_room_type = obj.order_room_type
            obj1.order_room_num = obj.form.order_room_num
            obj1.status = obj.status
            obj1.last_time = obj.id
            obj1.price = obj.price
            obj1.deposit = obj.deposit
            obj1.reachTime = obj.reachTime
            obj1.creditUrl = obj.pic_List
            obj1.orderTime = obj.currentTime
            state.list.push(obj1)
            // console.log(obj)
            // console.log(commit('judgeToday', obj1.orderTime))
            //  获取当天订单数  日总收益  使用房间数
            const today = new Date()
            const judgeDay = new Date(obj1.orderTime)
            if (today.getFullYear() === judgeDay.getFullYear() &&
            today.getMonth() === judgeDay.getMonth() &&
            today.getDate() === judgeDay.getDate()) {
              // console.log('123')
              state.dayOrderNum += 1
              state.dayEarnings += Number(obj1.price)
              if (obj1.status === '已入住') {
                state.roomUsed += Number(obj1.order_room_num)
              }
            }

            // if (new Date().getTime() - new Date(obj1.orderTime).getTime() < 86400000) {
            for (let i = 0; i < 7; i++) {
              const today = new Date()
              const judgeDay = new Date(obj1.orderTime)
              if (today.getFullYear() === judgeDay.getFullYear() &&
              today.getMonth() === judgeDay.getMonth() &&
              today.getDate() - i === judgeDay.getDate()) {
                // console.log('123')
                // state.orderRoomDetail[i].orderNum += 1
                // state.orderRoomDetail[i].roomNum += obj1.order_room_num
                // state.earnings[i] += obj1.price
                //  处理订单数和房间数
                state.orderRoomDetail.push({ id: i, roomNum: obj1.order_room_num, orderTime: judgeDay.getMonth() + 1 + '/' + judgeDay.getDate() })

                state.earnings.push({ id: i, money: obj1.price, orderTime: judgeDay.getMonth() + 1 + '/' + judgeDay.getDate() })
                // console.log(state.earnings)
              }
            }

            //  获得未确认的订单
            if (obj1.status === '待确认') {
              state.unConfirmOrder.push(obj1)
            }
            // }
          })
          //  获得订单总数
          state.orderNum = state.list.length

          resolve(res)
          // console.log(state)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },

  getDayEarnings({ state }) {

  },
  getRoomUsed({ state }) {

  },
  getOrderRoomDetail({ state }) {

  },
  getUnConfirmOrder({ state }) {

  },
  getEarnings({ state }) {

  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
