
/**
 * api接口的统一出口
 */
// 文章模块接口
import order from '@/api/order'
import couple from '@/api/couple'
import room from '@/api/room'
import user from '@/api/user'
// 其他模块的接口……

// 导出接口
export default {
  order,
  couple,
  room,
  user
  // ……
}
