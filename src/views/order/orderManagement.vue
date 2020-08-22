<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.order_id" clearable :placeholder="$t('table.order_id')" style="width: 200px;" class="filter-item" @clear="handleFilter" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.order_name" clearable :placeholder="$t('table.order_name')" style="width: 200px;" class="filter-item" @clear="handleFilter" @keyup.enter.native="handleFilter" />

      <el-select v-model="listQuery.type" :placeholder="$t('table.type')" clearable class="filter-item" style="width: 130px" @change="handleFilter">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleSortId">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        {{ $t('table.export') }}
      </el-button>
      <el-checkbox v-model="showCreditId" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey>100?0:tableKey+1">
        {{ $t('table.credit_id') }}
      </el-checkbox>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column :label="$t('table.order_id')" prop="order_id" sortable align="center" width="120px">

        <template slot-scope="{row}">
          <span class="link-type" @click="showDetail(row.order_id)">{{ row.order_id }}</span>
        </template>

      </el-table-column>
      <el-table-column
        :sortable="true"
        :label="$t('table.order_begin_time')"
        width="130px"
        align="center"
        :sort-method="sortByDate"
      >
        <template slot-scope="{row}">
          <span>{{ row.order_begin_time | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :sortable="true"
        :label="$t('table.order_end_time')"
        width="130px"
        align="center"
        :sort-method="sortByDate2"
      >
        <template slot-scope="{row}">
          <span>{{ row.order_end_time | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.last_time')" width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.last_time }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :sortable="true"
        :label="$t('table.reachTime')"
        width="130px"
        align="center"
        :sort-method="sortByDate"
      >
        <template slot-scope="{row}">
          <span>{{ row.reachTime }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showCreditId" :label="$t('table.credit_id')" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.credit_id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.order_name')" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.order_name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.order_phone_number')" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.order_phone_number }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column v-if="showReviewer" :label="$t('table.reviewer')" width="110px" align="center">
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.reviewer }}</span>
        </template>
      </el-table-column> -->
      <el-table-column :label="$t('table.order_room_num')" align="center" width="95">
        <template slot-scope="{row}">
          <span>{{ row.order_room_num }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.status')" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.price')" width="70px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.price | formatPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.deposit')" width="70px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.deposit | formatPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="330" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="success" size="mini" @click="handleEdit(row, $index)">
            {{ $t('table.editRoom') }}
          </el-button>
          <el-button type="primary" size="mini" @click="handleConfirm(row, $index)">
            {{ $t('table.confirmOrder') }}
          </el-button>
          <el-button type="danger" size="mini" @click="handleCancel(row, $index)">
            {{ $t('table.cancelOrder') }}
          </el-button>
          <el-button size="mini" @click="showDetail(row.order_id)">
            {{ $t('table.detail') }}
          </el-button>

        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" />

    <el-dialog :visible.sync="dialogDetailVisible" title="订单详情">
      <el-table :data="order_detail" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="credit_id" label="身份证号码" />
        <el-table-column prop="phone_number" label="手机号码" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogDetailVisible = false">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="showHandleRoom" title="操作房间" width="30%">
      <div class="selectStatus">
        <span style="margin-right: 30px; margin-left:50px">房间状态</span>
        <el-select v-model="roomStatus" placeholder="请选择房间状态" style="width: 50%">
          <el-option
            v-for="item in statusOptions"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </div>
      <div v-if="showPrice" class="number" style="display: flex; margin-top: 30px">
        <span style="margin-left: 50px;margin-right: 30px;margin-top: 10px">退款金额</span><el-input v-model="handleRoomStatus.price" style="width: 50%" />
      </div>
      <div v-if="showDeposit" class="number" style="display: flex; margin-top: 30px">
        <span style="margin-left: 50px;margin-right: 30px;margin-top: 10px">退押金额</span><el-input v-model="handleRoomStatus.deposit" style="width: 50%" />
      </div>

      <div class="bottom" style="margin-left: 30%;margin-top: 30px">
        <el-button type="primary" @click="submitStatusForm">
          确认
        </el-button>
        <el-button type="danger" @click="cancelStatusForm">
          取消
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="取消订单"
      :visible.sync="showCancel"
      width="30%"
    >
      <div class="inputCustom" style="display: flex;">
        <span style="width: 100px; margin: auto;">退钱金额:</span>
        <el-input v-model="cancelPrice" clearable placeholder="请输入退钱金额" />
      </div>
      <div slot="footer">
        <el-button @click="cancelCancel">取 消</el-button>
        <el-button type="primary" @click="confirmCancel">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: '待入住', display_name: '待入住' },
  { key: '已入住', display_name: '已入住' },
  { key: '待确认', display_name: '待确认' },
  { key: '已完成', display_name: '已完成' },
  { key: '已取消', display_name: '已取消' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'OrderManagement',
  components: { Pagination },
  directives: { waves },
  filters: {
    formatPrice(value) {
      return '￥' + value
    },
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
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      showPrice: false,
      showDeposit: false,
      roomStatus: '',
      cancelPrice: '',
      cancelId: '',
      handleRoomStatus: {
        id: '',
        price: '',
        // deposit: '',
        status: ''
      },
      showHandleRoom: false,
      showCreditId: false,
      showCancel: false,
      tableKey: 0,
      list: [
        { order_id: '13213', order_begin_time: '2019-02-01', order_end_time: '2019-02-02', credit_id: '1321313', order_name: 'llw', order_phone_number: '1231233121', order_room_num: '123', status: '已入住', last_time: '一晚', price: '23', deposit: '12', reachTime: '06:30' },
        { order_id: '1321', order_begin_time: '2019-02-02', order_end_time: '2019-02-02', credit_id: '1321313', order_name: '123', order_phone_number: '1231233121', order_room_num: '123', status: '已入住', last_time: '一晚', price: '23', deposit: '12', reachTime: '06:32' },
        { order_id: '132', order_begin_time: '2019-02-03', order_end_time: '2019-02-02', credit_id: '1321313', order_name: '456', order_phone_number: '1231233121', order_room_num: '123', status: '已入住', last_time: '一晚', price: '23', deposit: '12', reachTime: '06:36' },
        { order_id: '132', order_begin_time: '2019-02-04', order_end_time: '2019-02-02', credit_id: '1321313', order_name: '789', order_phone_number: '1231233121', order_room_num: '123', status: '已入住', last_time: '一晚', price: '23', deposit: '12', reachTime: '06:35' },
        { order_id: '13', order_begin_time: '2019-02-04', order_end_time: '2019-02-02', credit_id: '1321313', order_name: '789', order_phone_number: '1231233121', order_room_num: '123', status: '已入住', last_time: '一晚', price: '23', deposit: '12', reachTime: '06:42' }
      ],
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        order_id: '',
        type: '',
        sort: '+id',
        order_name: ''
      },
      calendarTypeOptions,
      sortOptions: [{ label: '编号升序', key: '+id' }, { label: '编号降序', key: '-id' }],
      statusOptions: ['已入住', '已完成'],
      showReviewer: false,
      dialogStatus: '',
      order_detail: [
        { name: '132', credit_id: 132131, phone_number: '12313' }
      ],
      downloadLoading: false,
      dialogDetailVisible: false,
      listCopy: [
        { order_id: '13213', order_begin_time: '2019-02-01', order_end_time: '2019-02-02', credit_id: '1321313', order_name: 'llw', order_phone_number: '1231233121', order_room_num: '123', status: '已入住', last_time: '一晚', price: '23', deposit: '12', reachTime: '06:30' },
        { order_id: '1321', order_begin_time: '2019-02-02', order_end_time: '2019-02-02', credit_id: '1321313', order_name: '123', order_phone_number: '1231233121', order_room_num: '123', status: '已入住', last_time: '一晚', price: '23', deposit: '12', reachTime: '06:32' },
        { order_id: '132', order_begin_time: '2019-02-03', order_end_time: '2019-02-02', credit_id: '1321313', order_name: '456', order_phone_number: '1231233121', order_room_num: '123', status: '已入住', last_time: '一晚', price: '23', deposit: '12', reachTime: '06:36' },
        { order_id: '132', order_begin_time: '2019-02-04', order_end_time: '2019-02-02', credit_id: '1321313', order_name: '789', order_phone_number: '1231233121', order_room_num: '123', status: '已入住', last_time: '一晚', price: '23', deposit: '12', reachTime: '06:35' },
        { order_id: '13', order_begin_time: '2019-02-04', order_end_time: '2019-02-02', credit_id: '1321313', order_name: '789', order_phone_number: '1231233121', order_room_num: '123', status: '已入住', last_time: '一晚', price: '23', deposit: '12', reachTime: '06:42' }
      ] }
  },
  watch: {
    roomStatus() {
      if (this.roomStatus === '待确认') {
        // this.showDeposit = true
      } else if (this.roomStatus === '已取消') {
        this.showPrice = true
      } else {
        this.showPrice = false
        this.showDeposit = false
      }
    }
  },
  created() {
    // 在这里同步数据 检索记录为 total为list的总数
    //  为listCopy 和 list 赋值

    //  编辑状态需要同步数据库

    this.handleSortId()
  },
  methods: {
    sortByDate(obj1, obj2) {
      console.log(obj1)
      const val1 = obj1.order_begin_time
      const val2 = obj2.order_begin_time
      return val1 - val2
    },
    sortByDate2(obj1, obj2) {
      console.log(obj1)
      const val1 = obj1.order_end_time
      const val2 = obj2.order_end_time
      return val1 - val2
    },

    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },

    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['订单编号', '入住时间', '退房时间', '入住时长', '预计到达时间', '预定人姓名', '手机号码', '身份证号码', '房间数', '总金额', '押金', '状态']
        const filterVal = ['order_id', 'order_begin_time', 'order_end_time', 'last_time', 'reachTime', 'order_name', 'order_phone_number', 'credit_id', 'order_room_num', 'price', 'deposit', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '订单管理'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'order_begin_time' || j === 'order_end_time') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    showDetail(order_id) {
      // console.log(order_id)
      this.dialogDetailVisible = true
      //  我需要根据传进来的订单编号去查找订单的详情
    },
    handleSortId(value = '+id') {
      //  +id  表示升序
      if (value === '+id') {
        this.list.sort((a, b) => {
          return a['order_id'] - b['order_id']
        })
      } else {
        this.list.sort((a, b) => {
          return b['order_id'] - a['order_id']
        })
      }
    },
    handleFilter(value) {
      // console.log('123')
      if (this.listQuery.order_name !== '' && this.listQuery.order_id !== '' && typeof (this.listQuery.order_id) !== undefined) {
        const arr1 = []
        this.listCopy.forEach(item => {
          if (item.order_name.indexOf(this.listQuery.order_name) !== -1) { arr1.push(item) }
        })
        const arr2 = []
        arr1.forEach(item => {
          if (item.order_id.indexOf(this.listQuery.order_id) !== -1) { arr2.push(item) }
        })
        if (this.listQuery.type !== '' && typeof (this.listQuery.type) !== undefined) {
          this.list = arr2.filter(item => {
          // console.log(item)
          // console.log()
            return item.status === this.listQuery.type
          })
        } else {
          this.list = arr2
          // console.log(arr1)
        }
      } else if (this.listQuery.order_name !== '' && this.listQuery.order_id === '' && typeof (this.listQuery.order_id) !== undefined) {
        const arr1 = []
        this.listCopy.forEach(item => {
          if (item.order_name.indexOf(this.listQuery.order_name) !== -1) { arr1.push(item) }
        })
        if (this.listQuery.type !== '' && typeof (this.listQuery.type) !== undefined) {
          this.list = arr1.filter(item => {
          // console.log(item)
          // console.log()
            return item.status === this.listQuery.type
          })
        } else {
          this.list = arr1
          // console.log(arr1)
        }
      } else if (this.listQuery.order_name === '' && this.listQuery.order_id !== '' && typeof (this.listQuery.order_id) !== undefined) {
        const arr1 = []
        this.listCopy.forEach(item => {
          if (item.order_id.indexOf(this.listQuery.order_id) !== -1) { arr1.push(item) }
        })
        if (this.listQuery.type !== '' && typeof (this.listQuery.type) !== undefined) {
          this.list = arr1.filter(item => {
          // console.log(item)
          // console.log()
            return item.status === this.listQuery.type
          })
        } else {
          this.list = arr1
          // console.log(arr1)
        }
      } else if (this.listQuery.order_name === '' && this.listQuery.order_id === '' && this.listQuery.type !== '') {
        const arr = this.listCopy.filter(item => {
          return item.status === this.listQuery.type
        })
        this.list = arr
      } else {
        this.list = this.listCopy
      }
    },

    cancelCancel() {
      this.showCancel = false
      this.cancelPrice = ''
      this.cancelId = ''
    },

    confirmCancel() {
      this.showCancel = false
      const index = this.list.findIndex(item => item.order_id === this.cancelId)
      this.list[index].status = '已取消'
      this.cancelPrice = ''

      //  同步 cancelPrice
    },
    //  取消订单
    handleCancel(row, index) {
      if (row.status === '已取消') {
        this.$message({
          message: '警告，不可以重复点击',
          type: 'warning'
        })
        return
      }
      this.showCancel = true
      this.cancelId = row.order_id
      this.cancelPrice = row.price
      // row.status = '已取消'
    },
    //  确认订单
    handleConfirm(row, index) {
      row.status = '待入住'
    },
    // 房间操作
    handleEdit(row) {
      this.showHandleRoom = true
      this.roomStatus = row.status
      this.handleRoomStatus.price = row.price
      // this.handleRoomStatus.deposit = row.deposit
      this.handleRoomStatus.status = row.status
      this.handleRoomStatus.id = row.order_id
    },
    submitStatusForm() {
      //  可能是请求接口然后改值
      // eslint-disable-next-line eqeqeq
      const index = this.list.findIndex(item => item.order_id === this.handleRoomStatus.id)
      console.log(index)
      this.list[index].status = this.roomStatus
      if (this.roomStatus === '已取消') {
        this.list[index].price = this.handleRoomStatus.price
      }
      this.cancelStatusForm()
    },
    cancelStatusForm() {
      this.showHandleRoom = false
      this.showPrice = false
      // this.showDeposit = false
      Object.keys(this.handleRoomStatus).forEach(key => { this.handleRoomStatus[key] = '' })
      this.roomStatus = ''
    }
  }
}
</script>
