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
        订单交易时间
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
          <span class="link-type" @click="showDetail(row, row.order_id)">{{ row.order_id }}</span>
        </template>

      </el-table-column>
      <el-table-column v-if="showCreditId" label="交易时间" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.orderTime }}</span>
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
      <el-table-column :label="$t('table.order_room_type')" align="center" width="95">
        <template slot-scope="{row}">
          <span>{{ row.order_room_type }}</span>
        </template>
      </el-table-column>
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
          <el-button v-if="row.status==='待确认'?false:row.status==='已取消'?false:true" type="success" size="mini" @click="handleEdit(row, $index)">
            {{ $t('table.editRoom') }}
          </el-button>
          <el-button v-if="row.status==='待确认'?true:false" type="primary" size="mini" @click="handleConfirm(row, $index)">
            {{ $t('table.confirmOrder') }}
          </el-button>
          <el-button v-if="row.status==='待确认'?true:false" type="danger" size="mini" @click="handleCancel(row, $index)">
            {{ $t('table.cancelOrder') }}
          </el-button>
          <el-button size="mini" @click="showDetail(row, row.order_id)">
            {{ $t('table.detail') }}
          </el-button>

        </template>
      </el-table-column>
    </el-table>

    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" /> -->

    <el-dialog :visible.sync="dialogDetailVisible" title="订单人身份证照片">
      <div class="creditImg">
        <img v-for="item in creditUrl" :key="item" :src="item" alt="身份证Id">
      </div>
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
// import Pagination from '@/components/Pagination' // secondary package based on el-pagination

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
  // components: { Pagination },
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
      postUrl: 'https://ht1.jomeswang.top/api/order/update',
      findUrl: 'https://ht1.jomeswang.top/api/order/',
      listLoading: false,
      detailIndex: '',
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
        // { order_id: '13213',
        //   order_begin_time: '2019-02-01',
        //   order_end_time: '2019-02-02',
        //   credit_id: '1321313',
        //   order_name: 'llw',
        //   order_phone_number: '1231233121',
        //   order_room_type: '超级大房',
        //   order_room_num: '123',
        //   status: '已入住',
        //   last_time: '一晚',
        //   price: '23',
        //   deposit: '12',
        //   reachTime: '06:30',
        //   creditUrl: ['https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3539210107,4231520605&fm=26&gp=0.jpg', 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1598163002792&di=e5d3f6c71a5d1ae16b27339f8dd5ad34&imgtype=0&src=http%3A%2F%2Fd.hiphotos.baidu.com%2Fzhidao%2Fpic%2Fitem%2F6159252dd42a2834d7a36c905ab5c9ea15cebf20.jpg'] },
        // // { order_id: '1321', order_begin_time: '2019-02-02', order_end_time: '2019-02-02', credit_id: '1321313', order_name: '123', order_phone_number: '1231233121', order_room_type: '豪华大房', order_room_num: '123', status: '已入住', last_time: '一晚', price: '23', deposit: '12', reachTime: '06:32', creditUrl: ['https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3539210107,4231520605&fm=26&gp=0.jpg', 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1598163002792&di=e5d3f6c71a5d1ae16b27339f8dd5ad34&imgtype=0&src=http%3A%2F%2Fd.hiphotos.baidu.com%2Fzhidao%2Fpic%2Fitem%2F6159252dd42a2834d7a36c905ab5c9ea15cebf20.jpg'] },
        // // { order_id: '132', order_begin_time: '2019-02-03', order_end_time: '2019-02-02', credit_id: '1321313', order_name: '456', order_phone_number: '1231233121', order_room_type: '大房', order_room_num: '123', status: '已入住', last_time: '一晚', price: '23', deposit: '12', reachTime: '06:36', creditUrl: ['https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3539210107,4231520605&fm=26&gp=0.jpg', 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1598163002792&di=e5d3f6c71a5d1ae16b27339f8dd5ad34&imgtype=0&src=http%3A%2F%2Fd.hiphotos.baidu.com%2Fzhidao%2Fpic%2Fitem%2F6159252dd42a2834d7a36c905ab5c9ea15cebf20.jpg'] },
        // { order_id: '132', order_begin_time: '2019-02-04', order_end_time: '2019-02-02', credit_id: '1321313', order_name: '789', order_phone_number: '1231233121', order_room_type: '超级小房', order_room_num: '123', status: '已入住', last_time: '一晚', price: '23', deposit: '12', reachTime: '06:35', creditUrl: ['https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3539210107,4231520605&fm=26&gp=0.jpg', 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1598163002792&di=e5d3f6c71a5d1ae16b27339f8dd5ad34&imgtype=0&src=http%3A%2F%2Fd.hiphotos.baidu.com%2Fzhidao%2Fpic%2Fitem%2F6159252dd42a2834d7a36c905ab5c9ea15cebf20.jpg'] },
        // { order_id: '13', order_begin_time: '2019-02-04', order_end_time: '2019-02-02', credit_id: '1321313', order_name: '789', order_phone_number: '1231233121', order_room_type: '小房', order_room_num: '123', status: '已入住', last_time: '一晚', price: '23', deposit: '12', reachTime: '06:42', creditUrl: ['https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3539210107,4231520605&fm=26&gp=0.jpg', 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1598163002792&di=e5d3f6c71a5d1ae16b27339f8dd5ad34&imgtype=0&src=http%3A%2F%2Fd.hiphotos.baidu.com%2Fzhidao%2Fpic%2Fitem%2F6159252dd42a2834d7a36c905ab5c9ea15cebf20.jpg'] }
      ],
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        order_id: '',
        type: '',
        sort: '-id',
        order_name: ''
      },
      calendarTypeOptions,
      sortOptions: [{ label: '编号升序', key: '+id' }, { label: '编号降序', key: '-id' }],
      statusOptions: ['已入住', '已完成'],
      showReviewer: false,
      dialogStatus: '',
      creditUrl: [],
      downloadLoading: false,
      dialogDetailVisible: false,
      listCopy: [
        // { order_id: '13213', order_begin_time: '2019-02-01', order_end_time: '2019-02-02', credit_id: '1321313', order_name: 'llw', order_phone_number: '1231233121', order_room_type: '超级大房', order_room_num: '123', status: '已入住', last_time: '一晚', price: '23', deposit: '12', reachTime: '06:30', creditUrl: ['https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3539210107,4231520605&fm=26&gp=0.jpg', 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1598163002792&di=e5d3f6c71a5d1ae16b27339f8dd5ad34&imgtype=0&src=http%3A%2F%2Fd.hiphotos.baidu.com%2Fzhidao%2Fpic%2Fitem%2F6159252dd42a2834d7a36c905ab5c9ea15cebf20.jpg'] },
        // { order_id: '1321', order_begin_time: '2019-02-02', order_end_time: '2019-02-02', credit_id: '1321313', order_name: '123', order_phone_number: '1231233121', order_room_type: '豪华大房', order_room_num: '123', status: '已入住', last_time: '一晚', price: '23', deposit: '12', reachTime: '06:32', creditUrl: ['https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3539210107,4231520605&fm=26&gp=0.jpg', 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1598163002792&di=e5d3f6c71a5d1ae16b27339f8dd5ad34&imgtype=0&src=http%3A%2F%2Fd.hiphotos.baidu.com%2Fzhidao%2Fpic%2Fitem%2F6159252dd42a2834d7a36c905ab5c9ea15cebf20.jpg'] },
        // { order_id: '132', order_begin_time: '2019-02-03', order_end_time: '2019-02-02', credit_id: '1321313', order_name: '456', order_phone_number: '1231233121', order_room_type: '大房', order_room_num: '123', status: '已入住', last_time: '一晚', price: '23', deposit: '12', reachTime: '06:36', creditUrl: ['https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3539210107,4231520605&fm=26&gp=0.jpg', 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1598163002792&di=e5d3f6c71a5d1ae16b27339f8dd5ad34&imgtype=0&src=http%3A%2F%2Fd.hiphotos.baidu.com%2Fzhidao%2Fpic%2Fitem%2F6159252dd42a2834d7a36c905ab5c9ea15cebf20.jpg'] },
        // { order_id: '132', order_begin_time: '2019-02-04', order_end_time: '2019-02-02', credit_id: '1321313', order_name: '789', order_phone_number: '1231233121', order_room_type: '超级小房', order_room_num: '123', status: '已入住', last_time: '一晚', price: '23', deposit: '12', reachTime: '06:35', creditUrl: ['https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3539210107,4231520605&fm=26&gp=0.jpg', 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1598163002792&di=e5d3f6c71a5d1ae16b27339f8dd5ad34&imgtype=0&src=http%3A%2F%2Fd.hiphotos.baidu.com%2Fzhidao%2Fpic%2Fitem%2F6159252dd42a2834d7a36c905ab5c9ea15cebf20.jpg'] },
        // { order_id: '13', order_begin_time: '2019-02-04', order_end_time: '2019-02-02', credit_id: '1321313', order_name: '789', order_phone_number: '1231233121', order_room_type: '小房', order_room_num: '123', status: '已入住', last_time: '一晚', price: '23', deposit: '12', reachTime: '06:42', creditUrl: ['https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3539210107,4231520605&fm=26&gp=0.jpg', 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1598163002792&di=e5d3f6c71a5d1ae16b27339f8dd5ad34&imgtype=0&src=http%3A%2F%2Fd.hiphotos.baidu.com%2Fzhidao%2Fpic%2Fitem%2F6159252dd42a2834d7a36c905ab5c9ea15cebf20.jpg'] }
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
  mounted() {
    this.getList()
      .then(() => {
        this.handleSortId()
        // console.log(this.list)
      })
    //  编辑状态需要同步数据库
  },
  activated() {
    // 在这里同步数据 检索记录为 total为list的总数
    //  为listCopy 和 list 赋值
    this.getList()
      .then(() => {
        this.handleSortId()
        // console.log(this.list)
      })
  },
  methods: {
    sortByDate(obj1, obj2) {
      // console.log(obj1)
      const val1 = obj1.order_begin_time
      const val2 = obj2.order_begin_time
      return val1 - val2
    },
    sortByDate2(obj1, obj2) {
      // console.log(obj1)
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
        const tHeader = ['订单编号', '入住时间', '退房时间', '入住时长', '预计到达时间', '预定人姓名', '手机号码', '交易时间', '房间类型', '房间数', '总金额', '押金', '状态']
        const filterVal = ['order_id', 'order_begin_time', 'order_end_time', 'last_time', 'reachTime', 'order_name', 'order_phone_number', 'orderTime', 'order_room_type', 'order_room_num', 'price', 'deposit', 'status']
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
    showDetail(row, order_id) {
      // console.log(order_id)
      this.dialogDetailVisible = true
      //  我需要根据传进来的订单编号去查找订单的详情
      this.detailIndex = order_id
      this.creditUrl = row.creditUrl
    },

    handleSortId(value = '-id') {
      //  +id  表示升序
      if (value === '+id') {
        this.list.sort((a, b) => {
          // return b['order_id'] - a['order_id']

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
      this.getListCopy()
        .then(() => {
          // console.log(this.listQuery)
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
          this.handleSortId()
        })
    },

    cancelCancel() {
      this.showCancel = false
      this.cancelPrice = ''
      this.cancelId = ''
    },

    //  确认取消订单
    confirmCancel() {
      this.showCancel = false
      this.cancelPrice = ''
      const index = this.list.findIndex(item => item.order_id === this.cancelId)

      this.list[index].status = '已取消'
      this.postStatus(this.list[index])

      //  同步 cancelPrice
    },
    //  取消订单  打开取消订单弹窗 输入退款金额
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
      this.$confirm('点击确定表示确认订单', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        row.status = '待入住'
        this.postStatus(row)
          .then(() => {
            this.$message({
              type: 'success',
              message: '订单确认成功'
            })
          })
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // });
      })
    },

    // 订单操作
    handleEdit(row) {
      this.showHandleRoom = true
      // this.roomStatus = row.status
      this.handleRoomStatus.price = row.price
      // this.handleRoomStatus.deposit = row.deposit
      this.handleRoomStatus.status = row.status
      this.handleRoomStatus.id = row.order_id
    },
    //  确认对订单 进行已入住和已完成的操作
    submitStatusForm() {
    //  可能是请求接口然后改值
    // eslint-disable-next-line eqeqeq
      if (this.roomStatus === '') {
        this.$message({
          message: '请选择订单状态',
          type: 'warning'
        })
        return 0
      }
      const index = this.list.findIndex(item => item.order_id === this.handleRoomStatus.id)
      // console.log(index)
      this.list[index].status = this.roomStatus
      if (this.roomStatus === '已取消') {
        this.list[index].price = this.handleRoomStatus.price
      }
      this.postStatus(this.list[index]).then(() => {

      })

      this.cancelStatusForm()
    },
    cancelStatusForm() {
      this.showHandleRoom = false
      this.showPrice = false
      // this.showDeposit = false
      Object.keys(this.handleRoomStatus).forEach(key => { this.handleRoomStatus[key] = '' })
      this.roomStatus = ''
    },
    getList() {
      return new Promise((resolve, reject) => {
        this.listLoading = true
        this.axios.get(this.findUrl, { headers: this.$store.state.user.headers })
          .then((res) => {
          // console.log('123')
            this.list.length = 0
            // console.log(res)
            res.data.forEach((item) => {
              const obj = JSON.parse(item)
              const obj1 = {}
              obj1.order_id = String(obj.counters)
              obj1.order_begin_time = obj.order_begin_time
              obj1.order_end_time = obj.order_end_time
              // obj1.credit_id = obj.id
              obj1.order_name = obj.form.order_name
              obj1.order_phone_number = obj.form.order_phone_number
              obj1.order_room_type = obj.order_room_type
              obj1.order_room_num = obj.form.order_room_num
              obj1.status = obj.status
              obj1.last_time = obj.id
              obj1.price = obj.price
              obj1.deposit = obj.deposit
              obj1.reachTime = obj.reachTime
              obj1.creditUrl = obj.pic_List
              obj1.orderTime = obj.currentTime
              this.list.push(obj1)
            })
            // console.log(this.list)
            this.listLoading = false
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    getListCopy() {
      return new Promise((resolve, reject) => {
        this.listLoading = true
        this.axios.get(this.findUrl, { headers: this.$store.state.user.headers })
          .then((res) => {
            this.listCopy.length = 0

            // console.log(JSON.parse(res.data[0]))
            res.data.forEach((item) => {
              const obj = JSON.parse(item)
              const obj1 = {}
              obj1.order_id = String(obj.counters)
              obj1.order_begin_time = obj.order_begin_time
              obj1.order_end_time = obj.order_end_time
              // obj1.credit_id = obj.id
              obj1.order_name = obj.form.order_name
              obj1.order_phone_number = obj.form.order_phone_number
              obj1.order_room_type = obj.order_room_type
              obj1.order_room_num = obj.form.order_room_num
              obj1.status = obj.status
              obj1.last_time = obj.id
              obj1.price = obj.price
              obj1.deposit = obj.deposit
              obj1.reachTime = obj.reachTime
              obj1.creditUrl = obj.pic_List
              obj1.orderTime = obj.currentTime

              this.listCopy.push(obj1)
            })
            // console.log(this.list)
            this.listLoading = false
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    postStatus(obj) {
    // const obj1 = JSON.parse(JSON.stringify(obj1))
      return new Promise((resolve, reject) => {
        this.listLoading = true

        if (obj.status === '已取消') {
          obj.own = 0
        }
        this.axios.post(this.postUrl, obj, { headers: this.$store.state.user.headers })
          .then(res => {
            console.log('订单状态修改成功')
            this.getList().then(() => {
              this.handleSortId()
              // console.log(this.list)
            })
            // console.log('789')
            this.listLoading = false
            resolve(res)
          })
          .catch(err => console.log(err))
      })
    }
  }
}
</script>
