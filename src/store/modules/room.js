const state = {
  roomList: [
    // { id: '123', status: '上线', name: '超级大豪房', description: 'fsdf', detail: 'fdsfs', detail2: 'fdsf', area: '123', bed: '465', peopleNum: '789', addBed: '123', morningTea: '456', window: '132', bathroom: '456', convenience: '1223', guestRoom: '456', introduction: 'sfsd', price: '12', deposit: '12', imgUrl: 'http://photo.jomeswang.top/20200819232134.png', read: '465', bookKnow: '465', roomNum: 100 }
  ],
  idPlus: '',
  imgUrl: [],
  loading: false,
  findUrl: 'http://159.138.27.178:3000/api/room',
  createUrl: 'http://159.138.27.178:3000/api/room/new',
  fixUrl: 'http://159.138.27.178:3000/api/room/fix',
  deleteUrl: 'http://159.138.27.178:3000/api/room/deleteAll',
  deleteOneUrl: 'http://159.138.27.178:3000/api/room/delete'
}
import axios from 'axios'
import user from './user'

const actions = {
  getRoomList({ state }) {
    return new Promise((resolve, reject) => {
      // console.log(this.$store, '123')
      axios.get(state.findUrl, { headers: user.state.headers })
        .then(res => {
          state.roomList.length = 0

          res.data.forEach(item => {
            state.roomList.push(JSON.parse(item))
          })
          resolve(res)
        // console.log(state.roomList, 'success')
        // console.log(res)
        // state.roomList = [...res.data]
        })
        .catch(err => reject(err))
    })
    // console.log('inside')
  },
  updateImg({ state }, res) {
    // console.log(state.imgUrl)
    state.imgUrl.push(res)
  },
  deleteImg({ state }, index) {
    // console.log('123')

    state.imgUrl.splice(index, 1)
  },
  emptyImg({ state }) {
    state.imgUrl.length = 0
    state.imgUrl = []
  },
  updateIdPlus({ state }) {
    let max = ''
    state.roomList.forEach(item => {
      if (max - item.id < 0) {
        max = item.id
      }
    })
    // console.log(max)
    state.idPlus = String(Number(max) + 1)
  },
  isShowImg({ state }, obj) {
    state.imgUrl = JSON.parse(JSON.stringify(obj))
  },
  openLoading({ state }) {
    state.loading = true
  },
  closeLoading({ state }) {
    state.loading = false
  }

}

export default {
  namespaced: true,
  state,
  actions
}
