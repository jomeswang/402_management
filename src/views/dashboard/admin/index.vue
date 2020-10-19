<template>

  <div v-loading="loading" class="dashboard-editor-container">
    <!-- <github-corner class="github-corner" /> -->

    <!-- 首页的四个汇总数据  -->
    <panel-group />

    <!-- 一个描点图表形式的来展示数据情况 -->
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>

    <el-row :gutter="10">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <transaction-table />
      </el-col>

      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <div class="chart-wrapper">
          <bar-chart :daily-money="dailyMoney" />
        </div>
      </el-col>    </el-row>

  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import BarChart from './components/BarChart'
import TransactionTable from './components/TransactionTable'

// const order =
import { mapState } from 'vuex'

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart,

    BarChart,
    TransactionTable

  },
  data() {
    return {
      loading: false,
      lineChartData: {
        roomData: [],
        orderData: [],
        dayData: []
      },
      dailyMoney: {
        orderTime: [],
        price: []
      }
    }
  },
  computed: {
    ...mapState({
      list: state => state.order.orderRoomDetail,
      earnings: state => state.order.earnings

    })
  },
  mounted() {
    this.loading = true
    this.$store.dispatch('order/getList')
      .then(() => {
        this.filterData()
        let max = 0
        this.initOrder()
        this.list.forEach((item) => {
          if (max - item.id < 0) {
            max = Number(item.id)
          }
        })
        for (let i = max; i >= 0; i--) {
          let orderNum = 0
          let roomNum = 0
          let orderTime = ''
          this.list.forEach((item) => {
            if (i - item.id === 0) {
              orderNum += 1
              roomNum += Number(item.roomNum)
              orderTime = item.orderTime
            }
          })
          if (orderTime !== '' && orderTime !== undefined) {
            this.lineChartData.roomData.push(roomNum)
            this.lineChartData.orderData.push(orderNum)
            this.lineChartData.dayData.push(orderTime)
          }
        }
        this.loading = false
      })
  },
  activated() {
    this.loading = true
    this.$store.dispatch('order/getList')
      .then(() => {
        this.filterData()
        let max = 0
        this.initOrder()
        this.list.forEach((item) => {
          if (max - item.id < 0) {
            max = Number(item.id)
          }
        })
        for (let i = max; i >= 0; i--) {
          let orderNum = 0
          let roomNum = 0
          let orderTime = ''
          this.list.forEach((item) => {
            if (i - item.id === 0) {
              orderNum += 1
              roomNum += Number(item.roomNum)
              orderTime = item.orderTime
            }
          })
          if (orderTime !== '' && orderTime !== undefined) {
            this.lineChartData.roomData.push(roomNum)
            this.lineChartData.orderData.push(orderNum)
            this.lineChartData.dayData.push(orderTime)
          }
        }
        this.loading = false
      })
  },
  methods: {
    initOrder() {
      this.lineChartData.roomData.length = 0
      this.lineChartData.orderData.length = 0
      this.lineChartData.dayData.length = 0
    },
    filterData() {
      this.dailyMoney.orderTime.length = 0
      this.dailyMoney.price.length = 0
      //  找 id 最大值
      let max = 0
      this.earnings.forEach((item) => {
        if (max - item.id < 0) {
          max = Number(item.id)
        }
      })
      //  遍历找出符合条件的数据
      for (let i = max; i >= 0; i--) {
        let price = 0
        let orderTime = ''
        this.earnings.forEach((item) => {
          if (i - item.id === 0) {
            orderTime = item.orderTime
            price += Number(item.money)
          }
        })
        if (orderTime !== '' && orderTime !== undefined) {
          this.dailyMoney.orderTime.push(orderTime)
          this.dailyMoney.price.push(price)
        }
      }
      // console.log(this.dailyMoney)
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
