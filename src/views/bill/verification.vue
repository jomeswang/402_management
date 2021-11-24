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
              <el-button
                v-permission="['admin']"
                type="primary"
                size="mini"
                @click="editForm(row)"
              >
                核销完成
              </el-button>
              <el-button type="success" size="mini" @click="checkForm(row)">
                查看
              </el-button>
              <el-button
                v-permission="['admin']"
                type="danger"
                size="mini"
                @click="deleteForm(row)"
              >
                删除
              </el-button>
            </template>

          </el-table-column>

        </el-table>
      </div>

      <el-dialog
        title="核销单据增加"
        :visible.sync="dialogVisible"
        width="50%"
      >
        <el-form
          :model="listForm"
          :inline="true"
        >
          <el-tooltip effect="light" content="如果有多个请用空格隔开" placement="right">
            <el-form-item label="发票号码" label-width="70px">
              <el-input v-model="listForm.invoice_no_li" style="width: 280px" />
            </el-form-item>
          </el-tooltip>

          <el-form-item label="总份数" label-width="70px">
            <el-input v-model="listForm.amount_li" style="width: 280px" />
          </el-form-item>

          <el-tooltip effect="light" content="如果有多个请用空格隔开" placement="right">
            <el-form-item label="金额" label-width="70px">
              <el-input v-model="listForm.money_li" style="width: 280px" />
            </el-form-item>
          </el-tooltip>

          <el-form-item label="核销金额" label-width="70px">
            <el-input v-model="listForm.total_money" style="width: 280px" />
          </el-form-item>
          <el-tooltip effect="light" content="如果有多个请用空格隔开" placement="right">
            <el-form-item label="开票日期" label-width="70px">
              <el-input v-model="listForm.create_date_li" style="width: 280px" />
            </el-form-item>
          </el-tooltip>

          <el-tooltip effect="light" content="如果有多个请用空格隔开" placement="right">
            <el-form-item label="资产名称" label-width="70px">
              <el-input v-model="listForm.asset_li" style="width: 280px" />
            </el-form-item>
          </el-tooltip>
          <el-tooltip effect="light" content="如果有多个请用空格隔开" placement="right">
            <el-form-item label="销售方" label-width="70px">
              <el-input v-model="listForm.seller_li" style="width: 280px" />
            </el-form-item>
          </el-tooltip>

          <el-form-item label="经手人" label-width="70px">
            <el-input v-model="listForm.handler" style="width: 280px" />
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="cancelForm">取 消</el-button>
          <el-button type="primary" @click="confirmForm">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <el-dialog
      title="核销单详情 "
      :visible.sync="checkVisible"
      width="50%"
    >

      <el-form class="checkBody" label-width="80px" :model="showForm" :inline="true">
        <el-form-item v-for="(item, index) in sumlist" :key="index" :label="item.label">
          <el-tooltip effect="light" content="这里只是展示，无法修改数据" placement="right">
            <el-input
              v-model="showForm[item.name]"
              style="width: 260px"
              class="filter-item"
              clearable
            />
          </el-tooltip>
        </el-form-item>

      </el-form>
      <!-- <div class="checkBody">
        <div v-for="(item, index) in sumlist" :key="index">{{ item.label }}: {{ showForm[item.name] }}</div>
      </div> -->

      <div slot="footer">
        <el-button @click="checkVisible = false">取 消</el-button>
        <el-button type="primary" @click="checkVisible = false">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { parseTime } from '@/utils'
// ImageBitmap
import permission from '@/directive/permission/index.js' // 权限判断指令

export default {
  name: 'Verification',
  directives: { permission },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '上报中': '',
        '已完成': 'success',
        '已取消': 'info'
      }
      // console.log(statusMap[stauts])
      return statusMap[status]
    }
  },
  data() {
    return {
      dialogVisible: false,
      checkVisible: false,
      test: '',
      downloadLoading: false,
      loading: false,
      tableKey: 0,
      listQuery: {
        invoice_no_li: '',
        handler: '',
        status: ''
      },
      listForm: {
        id: '',
        invoice_no_li: '',
        amount_li: '',
        money_li: '',
        create_date_li: '',
        asset_li: '',
        seller_li: '',
        handler: '',
        report_date: '',
        status: '',
        total_money: ''
      },
      showForm: {

      },
      statusOptions: ['上报中', '已完成', '已取消'],
      sumlist: [
        { name: 'id', label: '编号', width: '100px', sort: true },
        { name: 'invoice_no_li', label: '发票号码', width: '150px' },
        { name: 'create_date_li', label: '开具日期', width: '130px', sort: true },
        { name: 'asset_li', label: '资产名称', width: '150px' },
        { name: 'amount_li', label: '总份数', width: '100px' },
        { name: 'money_li', label: '金额', width: '100px' },
        { name: 'total_money', label: '总金额', width: '100px' },
        { name: 'seller_li', label: '销售方', width: '100px' },
        { name: 'handler', label: '经手人', width: '100px' },
        { name: 'report_date', label: '上报日期', width: '130px', sort: true },
        { name: 'verify_date', label: '核销日期', width: '130px', sort: true },
        { name: 'status', label: '状态', width: '100px' }
      ],
      list: [
        {
          id: 1,
          invoice_no_li: '123sd',
          create_date_li: '2020/01/02',
          asset_li: '13',
          amount_li: '465',
          money_li: '465',
          total_money: '46',
          seller_li: '46',
          handler: '46',
          report_date: '40',
          verify_date: '456',
          status: '上报中'
        },
        {
          id: 2,
          invoice_no_li: '123',
          create_date_li: '2020/01/01',
          asset_li: '13',
          amount_li: '465',
          money_li: '465',
          total_money: '46',
          seller_li: '46',
          handler: '46',
          report_date: '46',
          verify_date: '456',
          status: '已完成'
        }
      ]
    }
  },
  mounted() {
    // this.getList()
  },
  activated() {
    // this.getList()
  },
  methods: {
    getList(params) {
      this.loading = true
      // console.log('fds')
      this.$api.bill.getAllList(params)
        .then(res => {
          this.loading = false
          const data = res.data.data
          this.list = JSON.parse(JSON.stringify(data))
          // console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },
    cancelForm() {
      this.dialogVisible = false
      this.clearForm()
    },
    confirmForm() {
      //  之后将数据post 上去
      // this.listForm.report_date = new Date()
      this.listForm.report_date = parseTime(new Date(), '{y}-{m}-{d}')
      // if()
      // this.getList()
      // console.log(this.listForm.report_date)
      this.listForm.status = '上报中'
      let a = 1
      Object.keys(this.listForm).forEach(item => { if (this.listForm[item] === '' && item !== 'id') a = 0 })
      // console.log(a, this.listForm)
      if (!a) {
        this.$message({
          message: '表单要填充完整才可以点确认哦',
          type: 'warning'
        })
        return 0
      } else {
        this.$message({
          message: '创建成功',
          type: 'success'
        })
      }
      // console.log(this.listForm)
      this.$api.bill.newForm(this.listForm)
        .then(res => {
          this.dialogVisible = false
          this.getList()
          // console.log(res)
        })
    },
    editForm(row) {
      // 同时 将数据的核销日期要加上去
      this.$confirm('是否确认更改该核销单状态为 已完成, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //  在这里将数据post 上去改变数据
        if (row.status === '已完成') {
          this.$message({
            type: 'info',
            message: '不可以重复编辑'
          })
          return 0
        }
        row.status = '已完成'
        row.verify_date = parseTime(new Date(), '{y}-{m}-{d}')
        this.$api.bill.updateForm(row)
          .then(res => {
            // console.log(row)
            this.getList()
          })
        this.$message({
          type: 'success',
          message: '编辑成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消编辑'
        })
      })
    },
    checkForm(row) {
      this.checkVisible = true
      this.showForm = JSON.parse(JSON.stringify(row))
      // console.log(row)
      // console.log(this.showForm)
    },
    deleteForm(row) {
      //  更改状态为 已取消 为删除该条记录
      this.$confirm('是否删除该条核销单记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //  在这里将数据post 上去改变数据
        if (row.status === '已取消') {
          this.$message({
            type: 'info',
            message: '不可以重复删除'
          })
          return 0
        }
        row.status = '已取消'
        this.$api.bill.updateForm(row)
          .then(res => {
            // console.log(res)
            this.getList()
          })
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleFilter() {
      // 查数据
      // this.axios.get('http://47.115.2.135:4399/verify/verification/read', { params: this.listQuery })
      //   .then(res => {
      //     this.list = JSON.parse(JSON.stringify(res.data.data))
      //     console.log(res)
      //   })
      this.getList(this.listQuery)
      // console.log('13')
    },
    clearForm() {
      Object.keys(this.listForm).forEach(key => {
        this.listForm[key] = ''
      })
    },
    addverification() {
      //  新增表单
      this.dialogVisible = true
      this.clearForm()
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
        if (j === 'report_date' || j === 'verify_date') {
          return parseTime(v[j], '{y}-{m}-{d}')
        } else {
          return v[j]
        }
      }))
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
.checkBody{
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  // margin: 0 auto;
}
</style>
