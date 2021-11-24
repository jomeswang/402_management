<template>
  <div>
    <div class="container">

      <div class="filter-container">
        <el-input
          v-model="listQuery.invoice_no"
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

        <el-button class="pan-btn green-btn" style="height:37px;font-size:medium" @click="addverification">新增发票单</el-button>
        <el-button class="pan-btn tiffany-btn" style="height:37px;font-size:medium" @click="chooseBest">最佳发票选择</el-button>

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
              <span v-if="item.name !== 'status'&& item.name !== 'total_price'">
                {{ row[item.name] }}
              </span>
              <el-tag v-else-if="item.name==='status'" :type="row.status | statusFilter">
                {{ row.status }}
              </el-tag>
              <span v-else-if="item.name==='total_price'">
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
        title="发票单据增加"
        :visible.sync="dialogVisible"
        width="50%"
      >
        <el-form
          :model="listForm"
          :inline="true"
        >
          <el-form-item label="发票号码" label-width="70px">
            <el-input v-model="listForm.invoice_no" style="width: 280px" />
          </el-form-item>
          <el-tooltip effect="light" content="输入格式类 2020-02-22" placement="right">
            <el-form-item label="开具日期" label-width="70px">
              <el-input v-model="listForm.create_date" style="width: 280px" />
            </el-form-item>
          </el-tooltip>
          <el-form-item label="资产名称" label-width="70px">
            <el-input v-model="listForm.asset" style="width: 280px" />
          </el-form-item>
          <el-form-item label="单价" label-width="70px">
            <el-input v-model="listForm.unit_price" style="width: 280px" />
          </el-form-item>
          <el-form-item label="数量" label-width="70px">
            <el-input v-model="listForm.amount" style="width: 280px" />
          </el-form-item>
          <el-form-item label="单位" label-width="70px">
            <el-input v-model="listForm.unit" style="width: 280px" />
          </el-form-item>
          <el-form-item label="金额" label-width="70px">
            <el-input v-model="listForm.total_price" style="width: 280px" />
          </el-form-item>
          <el-form-item label="销售方" label-width="70px">
            <el-input v-model="listForm.seller" style="width: 280px" />
          </el-form-item>
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
      title="发票详情 "
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

    <el-dialog
      title="经费报销最优方案选择"
      :visible.sync="chooseVisible"
      width="40%"
      @close="cancelChoose"
    >
      <el-form inline :model="chooseInput">
        <el-form-item label="核销经费金额" label-width="100px">
          <el-input
            v-model="chooseInput.input"
            style="width: 300px"
            class="filter-item"
            clearable
            @clear="clearChoose"
          />
        </el-form-item>
        <el-button type="primary" @click="searchBest">查询</el-button>
      </el-form>
      <div v-if="chooseTable.length==0" style="margin: 0 auto">
        没有匹配到合适的发票（请重新输入核销金额）
      </div>
      <el-table
        v-if="chooseTable.length !=0"
        :data="chooseTable"
        style="width: 100%"
      >
        <el-table-column
          header-align="center"
          align="center"
          prop="id"
          label="编号"
        />
        <el-table-column
          header-align="center"
          align="center"
          prop="invoice_no"
          label="发票号码"
        />
        <el-table-column
          header-align="center"
          align="center"
          prop="total_price"
          label="金额"
        />
        <el-table-column
          header-align="center"
          align="center"
          prop="status"
          label="状态"
        >
          <template slot-scope="{row}">
            <el-tag :type="row.status | statusFilter">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>

      </el-table>
      <div
        v-if="chooseTable.length !=0"
        class="sum"
        style="font-size: 15px"
      >
        <span>
          剩余未核销金额： {{ chooseInput.min_diff }}
        </span>
        <span style="margin-left: 80px">
          已核销金额： {{ chooseInput.used_diff }}
        </span>
      </div>
      <div slot="footer">
        <el-button @click="cancelChoose">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { parseTime } from '@/utils'
import permission from '@/directive/permission/index.js' // 权限判断指令

export default {
  name: 'Invoice',
  directives: { permission },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '未核销': '',
        '已核销': 'success',
        '已取消': 'info'
      }
      // console.log(statusMap[stauts])
      return statusMap[status]
    }
  },
  data() {
    return {
      chooseTable: [],
      chooseInput: {
        input: '',
        min_diff: '',
        used_diff: ''
      },
      chooseVisible: true,
      dialogVisible: false,
      checkVisible: false,
      test: '',
      downloadLoading: false,
      loading: false,
      tableKey: 0,
      listQuery: {
        invoice_no: '',
        handler: '',
        status: ''
      },
      listForm: {
        id: '',
        invoice_no: '',
        create_date: '',
        amount: '',
        unit_price: '',
        unit: '',
        total_price: '',
        asset: '',
        seller: '',
        handler: '',
        report_date: '',
        verify_date: '',
        status: ''
      },
      showForm: {

      },
      statusOptions: ['已核销', '未核销', '已取消'],
      sumlist: [
        { name: 'id', label: '编号', width: '100px', sort: true },
        { name: 'invoice_no', label: '发票号码', width: '150px' },
        { name: 'create_date', label: '开具日期', width: '130px', sort: true },
        { name: 'asset', label: '资产名称', width: '150px' },
        { name: 'amount', label: '数量', width: '100px' },
        { name: 'unit', label: '单位', width: '100px' },
        { name: 'unit_price', label: '单价 ', width: '100px' },
        { name: 'total_price', label: '金额 ', width: '100px' },
        { name: 'seller', label: '销售方', width: '100px' },
        { name: 'handler', label: '经手人', width: '100px' },
        { name: 'report_date', label: '上报日期', width: '130px', sort: true },
        { name: 'verify_date', label: '核销日期', width: '130px', sort: true },
        { name: 'status', label: '状态', width: '100px' }
      ],
      list: [
        {
          id: 1,
          invoice_no: '123sd',
          create_date: '2020/01/02',
          asset: '13',
          amount: '465',
          unit_price: '465',
          unit: '克',
          total_price: '46',
          seller: '46',
          handler: '46',
          report_date: '40',
          verify_date: '456',
          status: '上报中'
        },
        {
          id: 2,
          invoice_no: '123',
          create_date: '2020/01/01',
          asset: '13',
          amount: '465',
          unit_price: '465',
          unit: '克',
          total_price: '46',
          seller: '46',
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
    chooseBest() {
      this.chooseVisible = true
    },
    searchBest() {
      this.$api.bill.getMatchBill(this.chooseInput.input)
        .then(res => {
          this.chooseTable = JSON.parse(JSON.stringify(res.data.data))
          this.chooseInput.min_diff = res.data.min_diff
          this.chooseInput.used_diff = 0
          this.chooseTable.forEach(item => {
            this.chooseInput.used_diff += item.total_price
          })
          // console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },
    cancelChoose() {
      this.chooseVisible = false
      Object.keys(this.chooseInput).forEach(item => {
        // console.log(res)
        this.chooseInput[item] = ''
      })
      this.chooseTable.length = 0
    },
    clearChoose() {
      Object.keys(this.chooseInput).forEach(item => {
        // console.log(res)
        this.chooseInput[item] = ''
      })
      this.chooseTable.length = 0
    },
    getList(params) {
      return new Promise((resolve, reject) => {
        this.$api.bill.getInvoiceList(params)
          .then(res => {
            // console.log(res)
            this.list = JSON.parse(JSON.stringify(res.data.data))
            // console.log(this.list)
            resolve(res)
          })
          .catch(err => {
            console.log(err)
            reject(err)
          })
      })
    },
    cancelForm() {
      this.dialogVisible = false
      this.clearForm()
    },
    confirmForm() {
      // 检索数据 获得 最大的Id 然后加1
      //  之后将数据post 上去
      // this.listForm.report_date = new Date()
      // if()
      this.listForm.report_date = parseTime(new Date(), '{y}-{m}-{d}')
      // console.log(this.listForm.report_date)
      this.listForm.status = '未核销'
      let a = 1
      Object.keys(this.listForm).forEach(item => { if (this.listForm[item] === '' && item !== 'id' && item !== 'verify_date') a = 0 })
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

      this.$api.bill.newInvoice(this.listForm)
        .then(res => {
          // console.log(res)
          this.getList()
          this.dialogVisible = false
        })
        .catch(err => {
          console.log(err)
        })
    },
    editForm(row) {
      // 同时 将数据的核销日期要加上去
      this.$confirm('是否确认更改该核销单状态为 已核销, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (row.status === '已核销') {
          this.$message({
            message: '不可以重复编辑核销状态哦',
            type: 'warning'
          })
          return 0
        }
        //  在这里将数据post 上去改变数据
        row.verify_date = parseTime(new Date(), '{y}-{m}-{d}')
        row.status = '已核销'
        this.$api.bill.updateInvoice(row)
          .then(res => {
            console.log(row, res)
            this.getList()
          })
          .catch(err => {
            console.log(err)
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
        if (row.status === '已取消') {
          this.$message({
            message: '不可以重复编辑核销状态哦',
            type: 'warning'
          })
          return 0
        }
        row.status = '已取消'
        //  在这里将数据post 上去改变数据
        this.$api.bill.updateInvoice(row)
          .then(res => {
            // console.log(err)
            this.getList()
          })
          .catch(err => {
            console.log(err)
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
      this.getList(this.listQuery)
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
          filename: '发票管理' + parseTime(new Date(), '{y}-{m}-{d}')
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
