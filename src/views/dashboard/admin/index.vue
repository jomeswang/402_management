<template>
  <div class="dashboard-editor-container">
    <!-- <github-corner class="github-corner" /> -->

    <!-- 首页的四个汇总数据  -->
    <panel-group @handleSetLineChartData="handleSetLineChartData" />

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
          <bar-chart />
        </div>
      </el-col>    </el-row>

  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import BarChart from './components/BarChart'
import TransactionTable from './components/TransactionTable'

const lineChartData = {
  order: {
    roomData: [200, 192, 120, 144, 160, 130, 140],
    orderData: [120, 82, 91, 154, 162, 140, 145]
  },
  user: {
    roomData: [200, 192, 120, 144, 160, 130, 140],
    orderData: [180, 160, 151, 106, 145, 150, 130]
  },
  money: {
    roomData: [80, 100, 121, 104, 105, 90, 100],
    orderData: [120, 90, 100, 138, 142, 130, 130]
  },
  rooms: {
    roomData: [130, 140, 141, 142, 145, 150, 160],
    orderData: [120, 82, 91, 154, 162, 140, 130]
  }
}

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
      lineChartData: lineChartData.order
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
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
