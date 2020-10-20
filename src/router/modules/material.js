/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const materialRouter = {
  path: '/material',
  component: Layout,
  redirect: '/material/own',
  name: 'material',
  meta: {
    title: 'materialM',
    icon: 'material'
  },
  children: [
    {
      path: 'own',
      name: 'Own',
      component: () => import('@/views/material/own'),
      meta: { title: 'materialOwn' }
    },
    {
      path: 'reserve',
      name: 'Reserve',
      component: () => import('@/views/material/reserve'),
      meta: { title: 'materialReserve' }
    },
    {
      path: 'lend',
      name: 'Lend',
      component: () => import('@/views/material/lend'),
      meta: { title: 'materialLend' }
    }

  ]
}

export default materialRouter

