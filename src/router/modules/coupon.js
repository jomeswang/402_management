/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const couponRouter = {
  path: '/coupon',
  component: Layout,
  redirect: '/coupon/couponList',
  name: 'coupon',
  meta: {
    title: 'coupon',
    icon: 'coupon'
  },
  children: [
    {
      path: 'couponRule',
      name: 'CouponRule',
      component: () => import('@/views/coupon/couponRule'),
      meta: { title: 'couponRule' }
    },
    {
      path: 'couponList',
      name: 'CouponList',
      component: () => import('@/views/coupon/couponList'),
      meta: { title: 'couponList' }
    },
    {
      path: 'userCoupon',
      name: 'UserCoupon',
      component: () => import('@/views/coupon/userCoupon'),
      meta: { title: 'userCoupon' }
    }
  ]
}

export default couponRouter
