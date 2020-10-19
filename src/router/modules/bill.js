/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const billRouter = {
  path: '/bill',
  component: Layout,
  redirect: '/bill/verification',
  name: 'bill',
  meta: {
    title: 'billO',
    icon: 'order_form'
  },
  children: [
    {
      path: 'verification',
      name: 'Verification',
      component: () => import('@/views/bill/verification'),
      meta: { title: 'verification' }
    },
    {
      path: 'invoice',
      name: 'Invoice',
      component: () => import('@/views/bill/invoice'),
      meta: { title: 'billI' }
    }

  ]
}

export default billRouter

