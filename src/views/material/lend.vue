<template>
  <div>
    <div class="container">

      <div class="filter-container">
        <el-input
          v-model="listQuery.item_name"
          style="width: 300px;"
          class="filter-item"
          clearable
          placeholder="请输入要查找的出借物品名称"
          @clear="handleFilter"
        />
        <el-input
          v-model="listQuery.borrower"
          style="width: 300px"
          class="filter-item"
          clearable
          placeholder="请输入要查找的借用人名称"
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

        <!-- <el-button class="pan-btn green-btn" style="height:37px;font-size:medium" @click="addverification">新增出借记录</el-button> -->

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

              <el-button v-if="row.status!='已归还'" type="primary" size="mini" @click="editForm(row)">
                确认归还
              </el-button>
              <!-- <el-button type="success" size="mini" @click="checkForm">
              查看
            </el-button> -->
              <!-- <el-button type="danger" size="mini" @click="deleteForm">
              删除
            </el-button> -->
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
  name: 'Lend',
  filters: {
    statusFilter(status) {
      const statusMap = {
        '出借中': '',
        '已归还': 'success'
      }
      // console.log(statusMap[stauts])
      return statusMap[status]
    }
  },
  data() {
    return {

      newVisible: false,
      downloadLoading: false,
      loading: false,
      tableKey: 0,
      listQuery: {
        item_name: '',
        borrower: '',
        status: ''
      },
      statusOptions: ['出借中', '已归还'],
      sumlist: [
        { name: 'id', label: '编号', width: '100px', sort: true },
        { name: 'item_name', label: '出借物品名称', width: '150px' },
        { name: 'borrower', label: '借用人', width: '150px' },
        { name: 'item_no', label: '出借物品编号', width: '130px' },
        { name: 'asset_no_li', label: '耗材编号', width: '130px' },
        { name: 'amount', label: '数量', width: '130px' },
        { name: 'handler_status', label: '经手人', width: '100px' },
        { name: 'lend_date', label: '出借日期', width: '200px', sort: true },
        { name: 'return_date', label: '归还日期', width: '200px', sort: true },
        { name: 'status', label: '状态', width: '100px' }
      ],
      list: [

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
      this.$api.material.getLend()
        .then(res => {
          this.list = JSON.parse(JSON.stringify(res.data.data))
          // console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },
    editForm(row) {
      this.$confirm('此操作将确认归还耗材', '确认归还', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        row.status = '已归还'
        row.return_date = parseTime(new Date(), '{y}-{m}-{d}')
        this.$api.material.editLend(row)
          .then(res => {
            console.log(res)
          })
          .catch(err => {
            console.log(err)
          })
        this.$message({
          type: 'success',
          message: '确认成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    checkForm() {

    },
    deleteForm() {

    },
    handleFilter() {
      this.$api.material.getLend(this.listQuery)
        .then(res => {
          this.list = JSON.parse(JSON.stringify(res.data.data))

          console.log(res)
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
          filename: '出借耗材管理' + parseTime(new Date(), '{y}-{m}-{d}')
        })
        this.loading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'lend_date' || j === 'return_date' || j === 'verify_date') {
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
