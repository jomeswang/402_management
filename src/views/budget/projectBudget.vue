<template>
  <div>
    <div class="container">

      <div class="filter-container">
        <el-input
          v-model="listQuery.project_name"
          style="width: 300px;"
          class="filter-item"
          clearable
          placeholder="请输入要查找的项目名称"
          @clear="handleFilter"
        />
        <el-input
          v-model="listQuery.handler"
          style="width: 300px"
          class="filter-item"
          clearable
          placeholder="请输入要查找的负责人名称"
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

        <el-button class="pan-btn green-btn" style="height:37px;font-size:medium" @click="addProject">新增项目记录</el-button>

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
              <span v-if="item.name !== 'status'&& item.name !== 'rest_budget'">
                {{ row[item.name] }}
              </span>
              <el-tag v-else-if="item.name==='status'" :type="row.status | statusFilter">
                {{ row.status }}
              </el-tag>
              <span v-else-if="item.name==='rest_budget'">
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
                经费核销
              </el-button>
              <!-- <el-button type="success" size="mini" @click="checkForm">
              查看
            </el-button> -->
              <el-button type="danger" size="mini" @click="confirmProject(row)">
                项目完成确认
              </el-button>
            </template>
          </el-table-column>

        </el-table>
      </div>
      <el-dialog
        title="项目增加"
        :visible.sync="addVisible"
        width="40%"
      >
        <el-form :model="listForm">
          <el-form-item label="项目负责人" label-width="100px">
            <el-input
              v-model="listForm.handler"
              style="width: 300px"
              class="filter-item"
              clearable
            />
          </el-form-item>
          <el-form-item label="项目名称" label-width="100px">
            <el-input
              v-model="listForm.project_name"
              style="width: 300px"
              class="filter-item"
              clearable
            />
          </el-form-item>
          <el-form-item label="项目经费" label-width="100px">
            <el-input
              v-model="listForm.rest_budget"
              style="width: 300px"
              class="filter-item"
              clearable
            />
          </el-form-item>
          <el-form-item label="项目开始时间" label-width="100px">
            <el-tooltip content="格式如： 2020/02/09" placement="right" effect="light">
              <el-input
                v-model="listForm.project_start_date"
                style="width: 300px"
                class="filter-item"
                clearable
              />
            </el-tooltip>

          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="cancelCreate">取 消</el-button>
          <el-button type="primary" @click="createForm">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog
        title=""
        :visible.sync="checkVisible"
        width="50%"
      >
        <el-form :model="row1">
          <el-form-item label="经费核销" label-width="100px">
            <el-input v-model="row1.rest_budget" clearable />
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="cancelCheck">取 消</el-button>
          <el-button type="primary" @click="confirmBudget">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { parseTime } from '@/utils'

export default {
  name: 'ProjectBudget',
  filters: {
    statusFilter(status) {
      const statusMap = {
        '完成中': '',
        '已完成': 'success'
      }
      // console.log(statusMap[stauts])
      return statusMap[status]
    }
  },
  data() {
    return {
      row1: {
        id: '',
        handler: '',
        project_name: '',
        project_start_date: '',
        project_end_date: '',
        status: '',
        rest_budget: ''
      },
      checkVisible: false,
      addVisible: false,
      downloadLoading: false,
      loading: false,
      tableKey: 0,
      listQuery: {
        handler: '',
        status: '',
        project_name: ''
      },
      listForm: {
        id: '',
        handler: '',
        project_name: '',
        project_start_date: '',
        project_end_date: '',
        status: '',
        rest_budget: ''
      },
      statusOptions: ['完成中', '已完成'],
      sumlist: [
        { name: 'id', label: '编号', width: '100px', sort: true },
        { name: 'handler', label: '负责人', width: '150px' },
        { name: 'project_name', label: '项目名称', width: '130px' },
        { name: 'rest_budget', label: '剩余经费', width: '150px' },
        { name: 'project_start_date', label: '项目开始日期', width: '200px', sort: true },
        { name: 'project_end_date', label: '项目结束日期', width: '200px', sort: true },
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
    cancelCheck() {
      this.checkVisible = false
      Object.keys(this.row1).forEach(item => {
        this.row1[item] = ''
      })
    },
    cancelCreate() {
      this.addVisible = false
      Object.keys(this.listForm).forEach(item => {
        this.listForm[item] = ''
      })
    },
    createForm() {
      this.$api.budget.newBudget(this.listForm)
        .then(res => {
          this.getList()
          this.$message({
            type: 'success',
            message: '增加成功!'
          })
          this.addVisible = false
          Object.keys(this.listForm).forEach(item => {
            this.listForm[item] = ''
          })
          // console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },
    getList() {
      this.$api.budget.getBudget()
        .then(res => {
          this.list = JSON.parse(JSON.stringify(res.data.data))
          // console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },
    editForm(row) {
      this.row1 = JSON.parse(JSON.stringify(row))
      this.checkVisible = true
    },
    confirmBudget(row) {
      this.$api.budget.updateBudget(this.row1)
        .then(res => {
          this.checkVisible = false
          this.getList()
          this.$message({
            type: 'success',
            message: '经费核销完成!'
          })
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },
    confirmProject(row) {
      this.$confirm('此操作确认项目，项目确认完成?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        row.status = '已完成'
        row.project_end_date = parseTime(new Date(), '{y}-{m}-{d}')

        this.$api.budget.updateBudget(row)
          .then(res => {
            // console.log(res)
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
          message: '已取消确认'
        })
      })
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
          filename: '项目经费管理' + parseTime(new Date(), '{y}-{m}-{d}')
        })
        this.loading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'project_start_date' || j === 'project_end_date' || j === 'verify_date') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    addProject() {
      this.addVisible = true
      this.listForm.status = '完成中'
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
