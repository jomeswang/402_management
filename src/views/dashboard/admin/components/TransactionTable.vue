<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="订单编号" min-width="100">
      <template slot-scope="scope">
        {{ scope.row.order_id }}
      </template>
    </el-table-column>
    <el-table-column label="交易时间" width="150" align="center">
      <template slot-scope="scope">
        {{ scope.row.orderTime }}
      </template>
    </el-table-column>
    <el-table-column label="房间类型" width="150" align="center">
      <template slot-scope="scope">
        {{ scope.row.order_room_type }}
      </template>
    </el-table-column>
    <el-table-column label="金额" width="100" align="center">
      <template slot-scope="scope">
        ¥{{ scope.row.price | toThousandFilter }}
      </template>
    </el-table-column>
    <el-table-column label="状态" width="100" align="center">
      <template slot-scope="{row}">
        <el-tag :type="row.status | statusFilter">
          {{ row.status }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
// import { transactionList } from '@/api/remote-search'
import { mapState } from 'vuex'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        待入住: 'info',
        已入住: 'success',
        待确认: 'warning',
        已完成: '',
        已取消: 'danger'
      }
      return statusMap[status]
    },
    orderNoFilter(str) {
      return str.substring(0, 30)
    }
  },
  data() {
    return {
      // list: null
    }
  },
  computed: {
    ...mapState({
      list: state => state.order.unConfirmOrder
    })
  },
  created() {
    // this.fetchData()
  },

  methods: {
    fetchData() {
      // transactionList().then(response => {
      //   this.list = response.data.items.slice(0, 8)
      //   // console.log(this.list)
      // })
    }
  }
}
</script>
