<template>
  <div>
    <div class="container">

      <div class="filter-container">
        <el-input
          v-model="listQuery.asset"
          style="width: 300px;"
          class="filter-item"
          clearable
          placeholder="请输入要查找的资产名称"
          @clear="handleFilter"
        />
        <!-- <el-input
          v-model="listQuery.handler"
          style="width: 300px"
          class="filter-item"
          clearable
          placeholder="请输入要查找的经手人名称"
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
        </el-select> -->

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

        <el-button class="pan-btn green-btn" style="height:37px;font-size:medium" @click="addverification">新增资产管理</el-button>
        <!-- <el-button class="pan-btn green-btn" style="height:37px;font-size:medium" @click="addverification">新增资产管理</el-button> -->

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
            width="300px"
          >
            <template slot-scope="{row}">
              <el-button type="primary" size="mini" @click="editForm(row)">
                编辑
              </el-button>
              <el-button type="success" size="mini" @click="lendForm(row)">
                出借
              </el-button>
              <el-button type="danger" size="mini" @click="deleteForm(row)">
                删除
              </el-button>
            </template>

          </el-table-column>

        </el-table>
      </div>
      <el-dialog
        title="出借耗材"
        :visible.sync="lendVisible"
        width="40%"
      >
        <el-form :model="lendQuery">
          <el-form-item label="出借物品名称" label-width="100px">
            <el-input
              v-model="lendQuery.item_name"
              style="width: 260px"
              class="filter-item"
              clearable
            />
          </el-form-item>
          <el-form-item label="借用人" label-width="100px">
            <el-input
              v-model="lendQuery.borrower"
              style="width: 260px"
              class="filter-item"
              clearable
            />
          </el-form-item>

          <el-form-item label="耗材编号" label-width="100px">
            <!-- <el-tooltip effect="light" content="如果有多个 请用空格隔开 " placement="right"> -->
            <el-select v-model="lendQuery.asset_no_li" multiple placeholder="耗材编号选择">
              <el-option
                v-for="item in lendAssetNo"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
            <!-- <el-input
                v-model="lendQuery.asset_no_li"
                style="width: 260px"
                class="filter-item"
                clearable
              /> -->
            <!-- </el-tooltip> -->

          </el-form-item>
          <!-- <el-form-item label="数量" label-width="100px">
            <el-input
              v-model="lendQuery.amount"
              style="width: 260px"
              class="filter-item"
              clearable
            />
          </el-form-item> -->
          <el-form-item label="经手人" label-width="100px">
            <el-input
              v-model="lendQuery.handler_status"
              style="width: 260px"
              class="filter-item"
              clearable
            />
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="cancelLendForm">取 消</el-button>
          <el-button type="primary" @click="confirmLendForm">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog
        title="耗材编辑"
        :visible.sync="checkVisible"
        width="50%"
      >

        <el-form class="checkBody" label-width="80px" :model="showForm" :inline="true">
          <el-form-item v-for="(item, index) in sumlist" v-show="item.name !== 'id'&&item.name!=='amount'" :key="index" :label="item.label">
            <el-tooltip v-if="item.name!=='asset_no_li'" effect="light" content="必填" placement="right">
              <el-input
                v-model="showForm[item.name]"
                style="width: 260px"
                class="filter-item"
                clearable
              />
            </el-tooltip>
            <el-tooltip v-else effect="light" content="如果有多个，请用空格隔开" placement="right">
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
          <el-button type="primary" @click="editConfirm">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog
        title="耗材增加"
        :visible.sync="newVisible"
        width="50%"
      >
        <el-form ref="form" :model="listForm" label-width="80px" :inline="true">
          <el-form-item label="商品名称">
            <el-input v-model="listForm.asset" style="width: 250px" />
          </el-form-item>
          <el-form-item label="生产商">
            <el-input v-model="listForm.producer" style="width: 250px" />
          </el-form-item>
          <el-form-item label="包装商">
            <el-input v-model="listForm.packer" style="width: 250px" />
          </el-form-item>
          <el-form-item label="供应商">
            <el-input v-model="listForm.supplier" style="width: 250px" />
          </el-form-item>
          <!-- <el-form-item label="数量">
            <el-input v-model="listForm.amount" style="width: 250px" />
          </el-form-item> -->
          <el-form-item label="耗材编号">
            <el-tooltip effect="light" content="如果有多个请用空格隔开" placement="right">
              <el-input v-model="listForm.asset_no_li" style="width: 250px" />
            </el-tooltip>
          </el-form-item>
          <el-form-item label="类别">
            <el-select v-model="listForm.category" placeholder="请选择耗材类别">
              <el-option v-for="(item,index) in category" :key="index" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="newVisible = false">取 消</el-button>
          <el-button type="primary" @click="addOwn">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
// import ItemVue from '@/layout/components/Sidebar/Item.vue'

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
      lendAssetNo: [],
      lendVisible: false,
      newVisible: false,
      dialogVisible: false,
      downloadLoading: false,
      checkVisible: false,
      loading: false,
      tableKey: 0,
      showForm: {

      },
      listQuery: {
        asset: ''
      },
      listForm: {
        asset: '',
        producer: '',
        packer: '',
        supplier: '',
        category: '',
        amount: '',
        asset_no_li: ''
      },
      lendQuery: {
        item_name: '',
        borrower: '',
        asset_no_li: '',
        amount: '',
        handler_status: '',
        item_no: '',
        lend_date: '',
        status: ''
      },
      category: ['办公用品', '资料费', '教学材料', '实验材料'],
      statusOptions: ['上报中', '已完成'],
      sumlist: [
        { name: 'id', label: '编号', width: '100px', sort: true },
        { name: 'asset', label: '资产名称', width: '150px' },
        { name: 'producer', label: '生产商 ', width: '150px' },
        { name: 'packer', label: '包装商', width: '150px' },
        { name: 'supplier', label: '供应商', width: '150px' },
        { name: 'category', label: '类别', width: '150px' },
        { name: 'asset_no_li', label: '耗材编号', width: '150px' },
        { name: 'amount', label: '数量', width: '150px' }

      ],
      list: [
        // {
        //   id: 3,
        //   asset: '123',
        //   producer: '46',
        //   packer: '456',
        //   supplier: '789',
        //   category: '789',
        //   amount: '789'
        // }
        // {
        //   id: 1,
        //   invoice_no_li: '123sd',
        //   create_data: '2020/01/02',
        //   asset: '13',
        //   amount_li: '465',
        //   money_li: '465',
        //   total_money: '46',
        //   seller: '46',
        //   handler: '46',
        //   report_data: '40',
        //   verify_date: '456',
        //   status: '上报中'
        // },
        // {
        //   id: 2,
        //   invoice_no_li: '123',
        //   create_data: '2020/01/01',
        //   asset: '13',
        //   amount_li: '465',
        //   money_li: '465',
        //   total_money: '46',
        //   seller: '46',
        //   handler: '46',
        //   report_data: '46',
        //   verify_date: '456',
        //   status: '已完成'
        // }
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
    lendForm(row) {
      const arr = []
      row.asset_no_li.split(' ').forEach(item => { if (item !== '')arr.push(item) })
      this.lendAssetNo = arr
      this.lendQuery.item_no = row.id
      this.lendQuery.item_name = row.asset
      this.lendQuery.lend_date = parseTime(new Date(), '{y}-{m}-{d}')
      this.lendQuery.status = '出借中'
      this.lendQuery.return_date = ''
      this.lendVisible = true
    },
    cancelLendForm() {
      Object.keys(this.lendQuery).forEach(item => {
        this.lendQuery[item] = ''
      })
      this.lendVisible = false
      this.$message('取消出借')
    },
    confirmLendForm() {
      this.lendQuery.asset_no_li = this.lendQuery.asset_no_li.join(' ')
      const arr = []
      this.lendQuery.asset_no_li.split(' ').forEach(item => {
        if (item !== '') arr.push(item)
      })
      this.lendQuery.amount = arr.length
      this.$api.material.newLend(this.lendQuery)
        .then(res => {
          console.log(res)
          this.$message({
            message: '恭喜你，出借耗材登记成功',
            type: 'success'
          })
          this.getList()
          Object.keys(this.lendQuery).forEach(item => {
            this.lendQuery[item] = ''
          })
          this.lendVisible = false
        })
        .catch(err => {
          console.log(err)
        })
    },
    addOwn() {
      let a = 1
      Object.keys(this.listForm).forEach(item => { if (this.listForm[item] === '' && item !== 'id' && item !== 'amount' && item !== 'verify_date') a = 0 })
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
      const arr = []
      this.listForm.asset_no_li.split(' ').forEach(item => {
        if (item !== '') arr.push(item)
      })
      this.listForm.amount = arr.length
      this.$api.material.newExist(this.listForm)
        .then(res => {
          // console.log(res)
          this.getList()
          this.newVisible = false
        })
    },
    editConfirm() {
      let a = 1
      Object.keys(this.showForm).forEach(item => { if (this.showForm[item] === '' && item !== 'id' && item !== 'amount' && item !== 'verify_date') a = 0 })
      // console.log(a, this.listForm)
      if (!a) {
        this.$message({
          message: '表单要填充完整才可以点确认哦',
          type: 'warning'
        })
        return 0
      } else {
        this.$message({
          message: '编辑成功',
          type: 'success'
        })
      }
      const arr = []
      this.showForm.asset_no_li.split(' ').forEach(item => {
        if (item !== '') arr.push(item)
      })
      this.showForm.amount = arr.length
      this.$api.material.editExist(this.showForm)
        .then(res => {
          // console.log(res)
          this.getList()

          this.checkVisible = false
        })
        .catch(err => {
          console.log(err)
        })
    },
    getList(params) {
      this.loading = true
      return new Promise((resolve, reject) => {
        this.$api.material.getExist(params)
          .then(res => {
            this.list = JSON.parse(JSON.stringify(res.data.data))
            // console.log(res)
            this.loading = false
          })
          .catch(err => {
            console.log(err)
          })
      })
    },
    editForm(row) {
      this.checkVisible = true
      this.showForm = JSON.parse(JSON.stringify(row))
    },
    checkForm(row) {
      this.checkVisible = true
      this.showForm = JSON.parse(JSON.stringify(row))
    },
    deleteForm(row) {
      this.$confirm('是否删除该条耗材记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //  在这里将数据post 上去改变数据
        this.$api.material.deleteExist(row)
          .then(res => {
            // console.log(res)
            this.getList()
          })
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch((err) => {
        console.log(err)
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleFilter() {
      // get数据获得数据
      // this.
      this.$api.material.getExist(this.listQuery)
        .then(res => {
          this.list = JSON.parse(JSON.stringify(res.data.data))
        })
        .catch(err => {
          console.log(err)
        })
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
          filename: '已有耗材管理' + parseTime(new Date(), '{y}-{m}-{d}')
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
      this.clearForm()
      this.newVisible = true
    },
    clearForm() {
      Object.keys(this.listForm).forEach(item => { this.listForm[item] = '' })
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
