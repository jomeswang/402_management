/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const roomRouter = {
  path: '/room',
  component: Layout,
  redirect: '/room/room-list',
  name: 'Room',
  meta: {
    title: 'room_charge',
    icon: 'room_charge'
  },
  children: [
    {
      path: 'new-room',
      name: 'NewRoom',
      component: () => import('@/views/room/new-room'),
      meta: { title: 'newRoom' }
    },
    {
      path: 'room-list',
      name: 'RoomList',
      component: () => import('@/views/room/room-list'),
      meta: { title: 'roomList' }
    },
    {
      path: 'edit/:id',
      name: 'EditRoom',
      component: () => import('@/views/room/new-room'),
      meta: { title: 'editRoom' },
      hidden: true
    }

  ]
}

export default roomRouter
