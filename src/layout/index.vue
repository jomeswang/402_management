<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div :class="{hasTagsView:needTagsView}" class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
      <right-panel v-if="showSettings">
        <settings />
      </right-panel>
    </div>
  </div>
</template>

<script>
import RightPanel from '@/components/RightPanel'
import { AppMain, Navbar, Settings, Sidebar, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'
// import axios from 'axios'
import { Notification } from 'element-ui'

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    RightPanel,
    Settings,
    Sidebar,
    TagsView
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  created() {
    this.WebSocketTest()
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    WebSocketTest() {
      if ('WebSocket' in window) {
        // alert('您的浏览器支持 WebSocket!')

        // 打开一个 web socket
        var ws = new WebSocket('ws://ht1.jomeswang.top:9998')

        ws.onopen = function() {
          // Web Socket 已连接上，使用 send() 方法发送数据
          ws.send('发送数据')
          setInterval(() => {
            ws.send('发送数据')
          }, 50000)
          console.log('连接成功')
          // alert('数据发送中...')
        }

        ws.onmessage = (evt) => {
          var received_msg = evt.data
          const obj = JSON.parse(received_msg)
          // console.log(obj.status)
          if (obj.status === '待确认') {
            // console.log('123')
            // this.$notify({
            //   title: '成功',
            //   message: '这是一条成功的提示消息',
            //   type: 'success'
            // })
            const msg = '嘀嘀嘀！！你有一个  ' + obj.order_room_type + '  的新订单来啦 快来处理吧！'
            Notification({
              title: '消息',
              message: msg,
              type: 'success',
              duration: 0
            })

            if (this.$route.fullPath.indexOf('orderManagement') !== -1) {
              this.$router.go(0)
            }
          }
          if (obj.status === '已取消') {
            const msg1 = '你有一个  ' + obj.order_room_type + '  的订单被用户在小程序端取消啦'
            Notification({
              title: '消息',
              message: msg1,
              type: 'info',
              duration: 0
            })
          }
          if (obj.status === '已取消' && this.$route.fullPath.indexOf('orderManagement') !== -1) {
            this.$router.go(0)
          }
          // console.log(this.$route)
          // obj.status = '待入住'
          // // console.log('13')
          // axios.post('https://ht1.jomeswang.top/api/order/update', obj)
          //   .then(res => { console.log(res) })
          //   .catch(err => console.log(err))
          // alert('数据已接收...')
        }

        ws.onclose = function() {
          // 关闭 websocket
          // alert('连接已关闭...')
          console.log('连接已关闭')
          setTimeout(() => {
            ws.onopen = function() {
              // Web Socket 已连接上，使用 send() 方法发送数据
              ws.send('发送数据')
              setInterval(() => {
                ws.send('发送数据')
              }, 50000)
              console.log('连接成功')
              // alert('数据发送中...')
            }
          }, 2000)
        }
      } else {
        // 浏览器不支持 WebSocket
        alert('您的浏览器不支持 WebSocket!')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
