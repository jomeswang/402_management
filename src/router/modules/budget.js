/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const budgetRouter = {
  path: '/budget',
  component: Layout,
  redirect: '/budget/ProjectBudget',
  name: 'budget',
  meta: {
    title: 'budget',
    icon: 'order_form'
  },
  children: [
    {
      path: 'projectBudget',
      name: 'ProjectBudget',
      component: () => import('@/views/budget/projectBudget'),
      meta: { title: 'projectBudget' }
    }

  ]
}

export default budgetRouter

