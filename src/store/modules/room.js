const state = {
  roomList: [
    { id: '123', status: '上线', name: '超级大豪房', description: 'fsdf', detail: 'fdsfs', detail2: 'fdsf', area: '123', bed: '465', peopleNum: '789', addBed: '123', morningTea: '456', window: '132', bathroom: '456', convenience: '1223', guestRoom: '456', introduction: 'sfsd', price: '12', deposit: '12', imgUrl: 'http://photo.jomeswang.top/20200819232134.png', read: '465', bookKnow: '465', roomNum: 100 }
  ],
  imgUrl: ''
}
// import axios from 'axios'

const actions = {
  getRoomList({ state }) {
    // axios.get('http://159.138.27.178:3000/api/room/')
    //   .then(res => {
    //     console.log(res)
    //   })
    //   .catch(error => {
    //     console.log(error)
    //   })
    // axios.post('http://159.138.27.178:3000/api/room/new')
    //   .then(res => {
    //     console.log(res)
    //   })
    //   .catch(err => { console.log(err) })
  }
}

export default {
  namespaced: true,
  state,
  actions
}
