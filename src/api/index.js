
/**
 * api接口的统一出口
 */
// 模块接口

import user from '@/api/user'
import bill from '@/api/bill'
import material from '@/api/material'
import budget from '@/api/budget'
// 其他模块的接口……

// 导出接口
export default {

  user,
  bill,
  material,
  budget

  // ……
}
