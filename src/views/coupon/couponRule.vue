<template>
  <div>
    <div class="filter-container">
      <el-input v-model="couponFilter.id" clearable placeholder="优惠券编号" style="width: 200px" class="filter-item" @clear="handleFilter" @keyup.enter.native="handleFilter" />
      <el-input v-model="couponFilter.name" clearable placeholder="优惠券名称" style="width: 200px;" class="filter-item" @clear="handleFilter" @keyup.enter.native="handleFilter" />

      <el-select v-model="couponFilter.type" placeholder="优惠券分类筛选" clearable class="filter-item" style="width: 150px" @change="handleFilter">
        <el-option v-for="item in calendarTypeOptions" :key="item" :label="item" :value="item" />
      </el-select>

      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button class="pan-btn green-btn" style="height:38px" @click="diagShow=true">新增优惠券规则</el-button>

    </div>

    <el-table
      v-loading="listLoading"
      :data="couponList"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column :label="$t('couponList.id')" prop="id" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('couponList.name')" prop="name" align="center" width="200">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('couponList.frequency_day')" prop="frequency_day" align="center" width="130">
        <template slot-scope="{row}">
          <span>{{ dayChange[row.frequency_day-1] }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('couponList.frequency_num')" prop="frequency_num" align="center" width="130">
        <template slot-scope="{row}">
          <span>{{ numChange[row.frequency_num-1] }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('couponList.classify')" prop="type" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('couponList.request')" prop="request" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.request }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('couponList.discount')" prop="id" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.discount }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('couponList.doorsill')" prop="doorsill" align="center" width="130">
        <template slot-scope="{row}">
          <span>{{ row.doorsill }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('couponList.validTime')" prop="validTime" align="center" width="130">
        <template slot-scope="{row}">
          <span>{{ row.validTime }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('couponList.moneysill')" prop="moneysill" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.moneysill }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.actions')" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleEdit(row)">
            {{ $t('couponList.edit') }}
          </el-button>
          <!-- <el-button size="mini" @click="createDiscountCode(row)">
            {{ $t('couponList.discountCode') }} -->
          <!-- </el-button> -->
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
            {{ $t('couponList.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="提示"
      :visible.sync="dialogDiscount"
      width="30%"
      :before-close="handleClose"
    >
      <el-form ref="code" :model="code" label-width="100px" class="demo-ruleForm">
        <el-form-item
          label="请输入需要的优惠码数量"
          prop="codeNum"
          :rules="[
            { type: 'number', message: '必须为数字值'}
          ]"
        >
          <el-input v-model.number="code.codeNum" type="codeNum" autocomplete="off" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="cancelCode">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :visible.sync="diagShow" title="优惠券" width="39%" @close="cancelForm">
      <el-form ref="form" :model="couponForm" label-width="130px">
        <el-form-item label="优惠券名称">
          <el-input v-model="couponForm.name" style="width: 300px" />
        </el-form-item>

        <el-form-item label="优惠券分类">
          <el-select v-model="couponForm.type" placeholder="请选择优惠券分类">
            <el-option label="餐饮券" value="餐饮券" />
            <el-option label="客房券" value="客房券" />
            <el-option label="棋牌券" value="棋牌券" />
          </el-select>
        </el-form-item>

        <el-form-item label="发放频率之天数">
          <el-tooltip class="item" effect="light" content="默认天数每一天 数量1 即住客住时每一天发一张" style="font-size: 14px" placement="right">

            <el-select v-model="couponForm.frequency_day" placeholder="请选择优惠券发放频率之天数">
              <el-option v-for="item in 10" :key="item" :label="dayChange[item-1]" :value="item" />
            </el-select>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="发放频率之数量">
          <el-tooltip class="item" effect="light" content="默认天数每一天 数量1 即住客住时每一天发一张" style="font-size: 14px" placement="right">

            <el-select v-model="couponForm.frequency_num" placeholder="请选择优惠券发放频率之数量">
              <el-option v-for="item in 10" :key="item" :label="numChange[item-1]" :value="item" />
            </el-select>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="优惠券发放要求">
          <el-select v-model="request" placeholder="请选择优惠券发放要求">
            <el-option label="全体用户" value="allPeople" />
            <el-option label="绑定房源" value="specificRoom" />
          </el-select>
        </el-form-item>

        <el-form-item v-if="requstShow" label="绑定房源类型">
          <el-input v-model="couponForm.request" style="width: 300px" />
        </el-form-item>

        <el-form-item label="优惠抵现方式">

          <el-tooltip class="item" effect="light" content="现金直接输入金额 如果是折扣最后输入%（类88%）" style="font-size: 14px" placement="right">
            <el-input v-model="couponForm.discount" style="width: 300px" />
          </el-tooltip>
        </el-form-item>

        <el-form-item label="优惠券现金门槛">

          <el-tooltip class="item" effect="light" content="如果没有 请输入 无" style="font-size: 14px" placement="right">
            <el-input v-model="couponForm.moneysill" style="width: 300px" />
          </el-tooltip>
        </el-form-item>

        <el-form-item label="优惠券活动时间">
          <el-tooltip class="item" effect="light" content="这里填的是优惠券规则的使用时间" style="font-size: 14px" placement="right">

            <el-select v-model="doorsill" placeholder="请选择优惠券活动时间">
              <el-option label="无" value="false" />
              <el-option label="时间段限制" value="true" />
            </el-select>
          </el-tooltip>
        </el-form-item>

        <el-form-item v-if="timeShow" label="活动时间">
          <div class="block">
            <el-date-picker
              v-model="couponForm.doorsill"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
            />
          </div>
        </el-form-item>

        <el-form-item label="优惠券有效时间">
          <el-tooltip class="item" effect="light" content="这里填的是一天内可以使用优惠券的时间" style="font-size: 14px" placement="right">
            <el-time-picker
              v-model="couponForm.validTime"
              is-range
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
              :picker-options="{
                selectableRange: '00:00:00 - 24:00:00'
              }"
            />

          </el-tooltip>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="confirmForm">{{ subbitName }}</el-button>
          <el-button @click="cancelForm">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'CouponRule',
  filters: {

  },
  data() {
    return {
      calendarTypeOptions: ['餐饮券', '客房券', '棋牌券'],
      dayChange: ['每一天', '每两天', '每三天', '每四天', '每五天', '每六天', '每七天', '每八天', '每九天', '每十天'],
      numChange: ['一张', '两张', '三张', '四张', '五张', '六张', '七张', '八张', '九张', '十张'],
      requstShow: false,
      subbitName: '立即提交',
      dialogDiscount: false,
      idPlus: 1,
      request: '',
      doorsill: '',
      listLoading: false,
      diagShow: false,
      timeShow: false,
      code: {
        codeNum: '',
        codeId: ''
      },
      discountCode: [],
      couponList: [
        { id: '0', type: '餐饮券', name: '123', request: '402', discount: '折扣', doorsill: '无', moneysill: 200, frequency_day: 1, frequency_num: 1, validTime: '06:23-20:00' },
        { id: '1', type: '客房券', name: '1', request: '402', discount: '折扣', doorsill: '无', moneysill: 200, frequency_day: 1, frequency_num: 1, validTime: '06:23-20:00' },
        { id: '2', type: '棋牌券', name: '456', request: '402', discount: '折扣', doorsill: '无', moneysill: 200, frequency_day: 1, frequency_num: 1, validTime: '06:23-20:00' }
      ],
      listCopy: [
        { id: '0', type: '餐饮券', name: '123', request: '402', discount: '折扣', doorsill: '无', moneysill: 200, frequency_day: 1, frequency_num: 1, validTime: '06:23-20:00' },
        { id: '1', type: '客房券', name: '1', request: '402', discount: '折扣', doorsill: '无', moneysill: 200, frequency_day: 1, frequency_num: 1, validTime: '06:23-20:00' },
        { id: '2', type: '棋牌券', name: '456', request: '402', discount: '折扣', doorsill: '无', moneysill: 200, frequency_day: 1, frequency_num: 1, validTime: '06:23-20:00' }
      ],
      couponFilter: {
        id: '',
        name: '',
        type: ''
      },
      couponForm: {
        id: 1,
        type: '',
        name: '',
        request: '',
        discount: '',
        doorsill: '',
        moneysill: '',
        frequency_day: 1,
        frequency_num: 1,
        validTime: ''
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  watch: {
    doorsill() {
      if (this.doorsill === 'true') {
        this.timeShow = true
      } else {
        this.timeShow = false
        this.couponForm.doorsill = '无'
      }
    },
    request() {
      if (this.request === 'allPeople') {
        this.requstShow = false
        this.couponForm.request = this.request
      } else {
        this.couponForm.request = ''
        this.requstShow = true
      }
    }
  },
  created() {
    //  获得数据 得到最后优惠券的编号 +1 变成 idPlus 和 couponForm.id
    //  获得数据在这里我用的是 listCopy  来模拟数据库的数据
    //  因此要为listCopy 同步数据 独立函数更新数据

    //  编辑 删除也需要同步数据库
  },
  methods: {
    handleEdit(row) {
      this.diagShow = true
      const obj2 = { ...row }
      this.couponForm = obj2
      this.subbitName = '编辑完成'
    },
    handleDelete(row, index) {
      this.couponList.splice(index, 1)
    },
    confirmForm() {
      this.diagShow = false

      // eslint-disable-next-line eqeqeq
      const index = this.couponList.findIndex(a => a.id == this.couponForm.id)
      // console.log(index)
      // console.log(this.couponForm)
      // console.log(index)
      if (index !== -1) {
        const obj2 = { ...this.couponForm }
        obj2.validTime = this.formatTime(obj2.validTime)
        // this.couponList[index] = obj2
        this.$set(this.couponList, index, obj2)
        this.$message({
          message: '成功编辑优惠券',
          type: 'success'
        })
        this.subbitName = '立即创建'
      } else {
        this.couponForm.id = this.idPlus
        const obj2 = { ...this.couponForm }
        obj2.validTime = this.formatTime(obj2.validTime)

        this.idPlus += 1
        this.couponList.push(obj2)
        this.$message({
          message: '成功创建优惠券',
          type: 'success'
        })
      }
      Object.keys(this.couponForm).forEach(key => { this.couponForm[key] = '' })
      this.couponForm.id = this.idPlus
      this.couponForm.frequency_day = 1
      this.couponForm.frequency_num = 1
    },
    formatTime(data) {
      let hours0 = data[0].getHours()
      let minutes0 = data[0].getMinutes()

      let hours1 = data[1].getHours()
      let minutes1 = data[1].getMinutes()
      if (hours0 < 10) {
        hours0 = '0' + hours0
      }
      if (hours1 < 10) {
        hours1 = '0' + hours1
      }
      if (minutes0 < 10) {
        minutes0 = '0' + minutes0
      }
      if (minutes1 < 10) {
        minutes1 = '0' + minutes1
      }
      return hours0 + ':' + minutes0 + '-' + hours1 + ':' + minutes1
    },
    cancelForm() {
      this.diagShow = false
      Object.keys(this.couponForm).forEach(key => { this.couponForm[key] = '' })
      this.couponForm.id = this.idPlus
      this.subbitName = '立即创建'
      this.couponForm.frequency_day = 1
      this.couponForm.frequency_num = 1
    },
    handleClose(done) {
      this.dialogDiscount = false
      this.code.codeNum = ''
      this.code.codeId = ''

      done()
    },
    createDiscountCode(row) {
      this.dialogDiscount = true
      this.code.codeId = row.id
      // console.log(row.id)
      //  纯数字 优惠码
      // parseInt(Math.random() * Date.now().toFixed(0) / 1000000)

      // 有字母的优惠码
      //  Math.random().toString(36).slice(2, 8)
    },
    submitForm() {
      // 之后请求服务器端保存这些优惠码然后清空数组
      for (let i = 0; i < this.code.codeNum; i++) {
        const code = Math.random().toString(36).slice(2, 8)
        const id = this.code.codeId
        this.discountCode.push({ code: code, id: id })
      }
      console.log(this.discountCode)
      this.dialogDiscount = false
      this.code.codeId = ''
      this.code.codeNum = ''
    },
    cancelCode(formName) {
      this.dialogDiscount = false
      this.code.codeId = ''
      this.code.codeNum = ''
    },
    handleFilter(value) {
      // console.log('123')
      if (this.couponFilter.name !== '' && this.couponFilter.id !== '' && typeof (this.couponFilter.id) !== undefined) {
        const arr1 = []
        this.listCopy.forEach(item => {
          if (item.name.indexOf(this.couponFilter.name) !== -1) { arr1.push(item) }
        })
        const arr2 = []
        arr1.forEach(item => {
          if (item.id.indexOf(this.couponFilter.id) !== -1) { arr2.push(item) }
        })
        if (this.couponFilter.type !== '' && typeof (this.couponFilter.type) !== undefined) {
          this.list = arr2.filter(item => {
          // console.log(item)
          // console.log()
            return item.type === this.couponFilter.type
          })
        } else {
          this.list = arr2
          // console.log(arr1)
        }
      } else if (this.couponFilter.name !== '' && this.couponFilter.id === '' && typeof (this.couponFilter.id) !== undefined) {
        const arr1 = []
        this.listCopy.forEach(item => {
          if (item.name.indexOf(this.couponFilter.name) !== -1) { arr1.push(item) }
        })
        if (this.couponFilter.type !== '' && typeof (this.couponFilter.type) !== undefined) {
          this.couponList = arr1.filter(item => {
          // console.log(item)
          // console.log()
            return item.type === this.couponFilter.type
          })
        } else {
          this.couponList = arr1
          // console.log(arr1)
        }
      } else if (this.couponFilter.name === '' && this.couponFilter.id !== '' && typeof (this.couponFilter.id) !== undefined) {
        const arr1 = []
        this.listCopy.forEach(item => {
          if (item.id.indexOf(this.couponFilter.id) !== -1) { arr1.push(item) }
        })
        if (this.couponFilter.type !== '' && typeof (this.couponFilter.type) !== undefined) {
          this.couponList = arr1.filter(item => {
          // console.log(item)
          // console.log()
            return item.type === this.couponFilter.type
          })
        } else {
          this.couponList = arr1
          // console.log(arr1)
        }
      } else if (this.couponFilter.name === '' && this.couponFilter.id === '' && this.couponFilter.type !== '') {
        const arr = this.listCopy.filter(item => {
          return item.type === this.couponFilter.type
        })
        this.couponList = arr
      } else {
        this.couponList = this.listCopy
      }
    }

  }
}
</script>

<style lang="scss" scoped>
.filter-container {
  padding-bottom: 10px;

  .filter-item {
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 10px;
  }
}
</style>
