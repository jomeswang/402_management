<template>
  <div>
    <div class="container">

      <div class="filter-container">
        <el-input
          v-model="listQuery.invoice_no_li"
          style="width: 300px;"
          class="filter-item"
          clearable
          placeholder="请输入要查找的发票号码"
          @clear="handleFilter"
        />
        <el-input
          v-model="listQuery.handler"
          style="width: 300px"
          class="filter-item"
          clearable
          placeholder="请输入要查找的经手人名称"
          @clear="handleFilter"
        />

        <el-select
          v-model="listQuery.status"

          placeholder="状态"
          clearable
          class="filter-item"
          style="width: 130px"
          @change="handleFilter"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>

        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
        >
          搜索
        </el-button>
        <el-button
          class="filter-item"
          type="primary"
          :loading="loading"
          icon="el-icon-download"
          @click="handleDownload"
        >
          导出
        </el-button>

        <el-button class="pan-btn green-btn" style="height:37px;font-size:medium" @click="addverification">新增核销单</el-button>

      </div>

      <div class="body-container">
        <el-table
          :key="tableKey"
          v-loading="loading"
          :data="list"
          border
          fit
          highlight-current-row
          style="width: 100%"
        >

          <el-table-column
            v-for="(item,index) in sumlist"
            :key="index"
            :label="item.label"
            align="center"
            :width="item.width"
            :sortable="item.sort"
            sort-by="id"
          >
            <template slot-scope="{row}">
              <span v-if="item.name !== 'status'&& item.name !== 'total_money'">
                {{ row[item.name] }}
              </span>
              <el-tag v-else-if="item.name==='status'" :type="row.status | statusFilter">
                {{ row.status }}
              </el-tag>
              <span v-else-if="item.name==='total_money'">
                ￥ {{ row[item.name] }}
              </span>
            </template>

          </el-table-column>

          <el-table-column
            header-align="center"
            align="center"
            label="操作"
            width="250px"
          >
            <template slot-scope="{row}">

              <el-button type="primary" size="mini" @click="editForm(row)">
                编辑
              </el-button>
              <el-button type="success" size="mini" @click="checkForm(row)">
                查看
              </el-button>
              <el-button type="danger" size="mini" @click="deleteForm(row)">
                删除
              </el-button>
            </template>
          </el-table-column>

        </el-table>
      </div>

    </div>
  </div>
</template>

<script>
import { parseTime } from '@/utils'

export default {
  name: 'Own',
  filters: {
    statusFilter(status) {
      const statusMap = {
        '上报中': '',
        '已完成': 'success'
      }
      // console.log(statusMap[stauts])
      return statusMap[status]
    }
  },
  data() {
    return {
      downloadLoading: false,
      loading: false,
      tableKey: 0,
      listQuery: {
        invoice_no_li: '',
        handler: ''
      },
      statusOptions: ['上报中', '已完成'],
      sumlist: [
        { name: 'id', label: '编号', width: '100px', sort: true },
        { name: 'invoice_no_li', label: '发票号码', width: '150px' },
        { name: 'create_data', label: '开具日期', width: '130px', sort: true },
        { name: 'asset', label: '资产名称', width: '150px' },
        { name: 'amount_li', label: '总份数', width: '100px' },
        { name: 'money_li', label: '金额', width: '100px' },
        { name: 'seller', label: '销售方', width: '100px' },
        { name: 'handler', label: '经手人', width: '100px' },
        { name: 'report_data', label: '上报日期', width: '130px', sort: true },
        { name: 'verify_date', label: '核销日期', width: '130px', sort: true },
        { name: 'status', label: '状态', width: '100px' }
      ],
      list: [
        {
          id: 1,
          invoice_no_li: '123sd',
          create_data: '2020/01/02',
          asset: '13',
          amount_li: '465',
          money_li: '465',
          total_money: '46',
          seller: '46',
          handler: '46',
          report_data: '40',
          verify_date: '456',
          status: '上报中'
        },
        {
          id: 2,
          invoice_no_li: '123',
          create_data: '2020/01/01',
          asset: '13',
          amount_li: '465',
          money_li: '465',
          total_money: '46',
          seller: '46',
          handler: '46',
          report_data: '46',
          verify_date: '456',
          status: '已完成'
        }
      ]
    }
  },
  mounted() {
    this.getList()
  },
  activated() {
    this.getList()
  },
  methods: {
    getList() {

    },
    editForm() {

    },
    checkForm() {

    },
    deleteForm() {

    },
    handleFilter() {

    },
    handleDownload() {
      this.loading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = this.sumlist.map(item => {
          return item.label
        })
        const filterVal = this.sumlist.map(item => {
          return item.name
        })
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '核销管理' + parseTime(new Date(), '{y}-{m}-{d}')
        })
        this.loading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'create_data' || j === 'report_data' || j === 'verify_date') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    addverification() {

    }
  }
}
</script>

<style scoped lang='scss' >
.filter-container {
  padding-bottom: 0px;

  .filter-item {
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 5px;
  }
}
</style>
