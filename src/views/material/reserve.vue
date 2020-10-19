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
        <el-input
          v-model="listQuery.handler"
          style="width: 300px"
          class="filter-item"
          clearable
          placeholder="请输入要查找的上报人名称"
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

        <el-button class="pan-btn green-btn" style="height:37px;font-size:medium" @click="addverification">新增预定耗材</el-button>

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
              <span v-if="item.name !== 'status'&& item.name !== 'total_money'&&item.name!=='url'&&item.name!=='total_price_aftertax'&&item.name!=='total_price_pretax'">
                {{ row[item.name] }}
              </span>
              <el-tag v-else-if="item.name==='status'" :type="row.status | statusFilter">
                {{ row.status }}
              </el-tag>
              <span v-else-if="item.name==='total_money' ||item.name==='total_price_aftertax' || item.name==='total_price_pretax' || item.name==='unit_price_pretax'||item.name==='total_price_aftertax'">
                ￥ {{ row[item.name] }}
              </span>
              <span v-else-if="item.name==='url'">
                <el-link :href="row[item.name]" target="_blank">{{ row[item.name] }}</el-link>
                <!-- <a :href="row[item.name]"> {{ row[item.name] }} </a> -->
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
              <el-button
                v-permission="['admin']"
                type="success"
                size="mini"
                @click="changeForm(row)"
              >
                核销完成
              </el-button>
              <el-button type="danger" size="mini" @click="deleteForm(row)">
                删除
              </el-button>
            </template>

          </el-table-column>

        </el-table>
      </div>

      <el-dialog
        title="耗材编辑"
        :visible.sync="checkVisible"
        width="50%"
      >

        <el-form class="checkBody" label-width="80px" :model="showForm" :inline="true">
          <el-form-item v-for="(item, index) in sumlist" v-show="item.name !== 'id'&&item.name!=='report_date'&&item.name!=='verify_date'&&item.name!=='category'&&item.name!=='status'" :key="index" :label="item.label">
            <el-tooltip effect="light" content="必填" placement="right">
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
        title="预定耗材增加"
        :visible.sync="newVisible"
        width="50%"
      >
        <el-form ref="form" :model="listForm" label-width="80px" :inline="true">
          <el-form-item v-for="(item,index) in sumlist" v-show="item.name!=='id'&&item.name!=='report_date'&&item.name!=='verify_date'&&item.name!=='status'&&item.name!=='category'" :key="index" :label="item.label">
            <el-input v-model="listForm[item.name]" style="width: 250px" />
          </el-form-item>

          <el-form-item label="类别">
            <el-select v-model="listForm.category" placeholder="请选择耗材类别">
              <el-option v-for="(item,index) in category" :key="index" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="newVisible = false">取 消</el-button>
          <el-button type="primary" @click="addReserve">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import permission from '@/directive/permission/index.js' // 权限判断指令

export default {
  name: 'Reserve',
  directives: { permission },

  filters: {
    statusFilter(status) {
      const statusMap = {
        '成功': 'success',
        '申请中': ''
      }
      // console.log(statusMap[stauts])
      return statusMap[status]
    }
  },
  data() {
    return {
      newVisible: false,
      dialogVisible: false,
      downloadLoading: false,
      checkVisible: false,
      loading: false,
      tableKey: 0,
      showForm: {

      },
      listQuery: {
        asset: '',
        handler: '',
        status: ''
      },
      listForm: {
        url: '',
        asset: '',
        category: '',
        option: '',
        unit_price_pretax: '',
        unit_price_aftertax: '',
        amount: '',
        total_price_pretax: '',
        total_price_aftertax: '',
        producer: '',
        packer: '',
        supplier: '',
        handler: '',
        note: ''
      },
      category: ['办公用品', '资料费', '教学材料', '实验材料'],
      statusOptions: ['成功', '申请中'],
      sumlist: [
        { name: 'id', label: '编号', width: '100px', sort: true },
        { name: 'asset', label: '资产名称', width: '150px' },
        { name: 'url', label: '链接', width: '150px' },
        { name: 'category', label: '类别', width: '150px' },
        { name: 'option', label: '选项', width: '150px' },
        { name: 'unit_price_pretax', label: '单价(税前)', width: '150px' },
        { name: 'unit_price_aftertax', label: '单价(税后)', width: '150px' },
        { name: 'amount', label: '数量', width: '150px' },
        { name: 'total_price_pretax', label: '总价(税前)', width: '150px' },
        { name: 'total_price_aftertax', label: '总价(税后)', width: '150px' },
        { name: 'producer', label: '生产商 ', width: '150px' },
        { name: 'packer', label: '包装商', width: '150px' },
        { name: 'supplier', label: '供应商', width: '150px' },
        { name: 'report_date', label: '上报日期', width: '150px' },
        { name: 'verify_date', label: '核销日期', width: '150px' },
        { name: 'note', label: '备注', width: '150px' },
        { name: 'handler', label: '上报人', width: '150px' },
        { name: 'status', label: '状态', width: '150px' }
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
    changeForm(row) {
      this.$confirm('是否确认更改该预定耗材状态为 成功, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //  在这里将数据post 上去改变数据
        if (row.status === '成功') {
          this.$message({
            type: 'info',
            message: '不可以重复编辑'
          })
          return 0
        }
        row.status = '成功'
        row.verify_date = parseTime(new Date(), '{y}-{m}-{d}')
        this.$api.material.editReserve(row)
          .then(res => {
            // console.log(res)
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
    addReserve() {
      this.listForm.status = '申请中'
      this.listForm.report_date = parseTime(new Date(), '{y}-{m}-{d}')
      let a = 1
      // this.listForm['verify_date'] = '132'
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
      this.$api.material.newReserve(this.listForm)
        .then(res => {
          // console.log(res)
          this.getList()
          this.newVisible = false
        })
    },
    editConfirm() {
      let a = 1
      Object.keys(this.showForm).forEach(item => { if (this.showForm[item] === '' && item !== 'id' && item !== 'verify_date') a = 0 })
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
      this.$api.material.editReserve(this.showForm)
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
        this.$api.material.getReserve(params)
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
        this.$api.material.deleteReserve(row)
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
      this.$api.material.getReserve(this.listQuery)
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
          filename: '预定耗材管理' + parseTime(new Date(), '{y}-{m}-{d}')
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
      this.newVisible = true
      Object.keys(this.listForm).forEach(item => {
        this.listForm[item] = ''
      })
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
