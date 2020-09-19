<template>
  <div>
    <div class="filter-container">
      <el-input v-model="couponFilter.userName" clearable placeholder="用户名称" style="width: 200px" class="filter-item" @clear="handleFilter" @keyup.enter.native="handleFilter" />
      <el-input v-model="couponFilter.couponName" clearable placeholder="优惠券名称" style="width: 200px;" class="filter-item" @clear="handleFilter" @keyup.enter.native="handleFilter" />

      <el-select v-model="couponFilter.type" placeholder="优惠券分类筛选" clearable class="filter-item" style="width: 150px" @change="handleFilter">
        <el-option v-for="item in calendarTypeOptions" :key="item" :label="item" :value="item" />
      </el-select>

      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
    </div>

    <el-table v-loading="listLoading" :data="couponShow" border fit highlight-current-row style="width: 100%;">
      <el-table-column :label="$t('couponShow.id')" prop="id" align="center" width="200">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('couponShow.userName')" prop="userName" align="center" width="200">
        <template slot-scope="{row}">
          <span>{{ row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('couponShow.couponName')" prop="couponName" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.couponName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('couponShow.type')" prop="type" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('couponShow.orignPrice')" prop="orignPrice" align="center" width="200">
        <template slot-scope="{row}">
          <span>{{ row.orignPrice }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('couponShow.realPrice')" prop="realPrice" align="center" width="200">
        <template slot-scope="{row}">
          <span>{{ row.realPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('couponShow.discount')" prop="discount" align="center" width="200">
        <template slot-scope="{row}">
          <span>{{ row.discount }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :sortable="true"
        :label="$t('couponShow.tradingTime')"
        prop="tradingTime"
        align="center"
        width="200"
        :sort-method="sortTime"
      >
        <template slot-scope="{row}">
          <span>{{ row.tradingTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'CouponList',
  data() {
    return {
      // findUrl: 'https://ht1.jomeswang.top/api/orderForm/',
      listLoading: false,
      calendarTypeOptions: ['餐饮券', '客房券', '棋牌券'],
      couponShow: [
        // {
        //   id: '132',
        //   userName: '132',
        //   orignPrice: 213,
        //   realPrice: 200,
        //   couponName: '大的',
        //   tradingTime: '2019-01-01 09:01',
        //   discount: '20%',
        //   type: '餐饮券'
        // },
        // {
        //   id: '133',
        //   userName: '45',
        //   orignPrice: 213,
        //   realPrice: 200,
        //   couponName: '的',
        //   tradingTime: '2019-01-01 09:01',
        //   discount: '20%',
        //   type: '餐饮券'
        // },
        // {
        //   id: '134',
        //   userName: '1332',
        //   orignPrice: 213,
        //   realPrice: 200,
        //   couponName: '大',
        //   tradingTime: '2019-01-01 09:01',
        //   discount: '20%',
        //   type: '客房券'
        // }
      ],
      listCopy: [
        // {
        //   id: '132',
        //   userName: '132',
        //   orignPrice: 213,
        //   realPrice: 200,
        //   couponName: '大的',
        //   tradingTime: '2019-01-01 09:01',
        //   discount: '20%',
        //   type: '餐饮券'
        // },
        // {
        //   id: '133',
        //   userName: '45',
        //   orignPrice: 213,
        //   realPrice: 200,
        //   couponName: '的',
        //   tradingTime: '2019-01-01 09:01',
        //   discount: '20%',
        //   type: '餐饮券'
        // },
        // {
        //   id: '134',
        //   userName: '1332',
        //   orignPrice: 213,
        //   realPrice: 200,
        //   couponName: '大',
        //   tradingTime: '2019-01-01 09:01',
        //   discount: '20%',
        //   type: '客房券'
        // }
      ],
      couponFilter: {
        userName: '',
        couponName: '',
        type: ''
      }
    }
  },
  // created() {
  //   //  同步couponShow  和listCopy
  //   // 查询的时候   请求数据同步
  //   // console.log('couponLIst')
  //   this.updateCouponShow()
  //   // this.updateListCopy()
  // },
  activated() {
    // 切换路由处理更新放这里
    this.updateCouponShow()
    // this.updateListCopy()
  },
  mounted() {
    this.updateCouponShow()
  },
  methods: {
    updateCouponShow() {
      this.listLoading = true

      // this.axios.get(this.findUrl, { headers: this.$store.state.user.headers })
      this.$api.couple.getCoupleList()
        .then(res => {
          this.couponShow.length = 0

          // console.log(res)
          res.data.forEach((item) => {
            const obj = JSON.parse(item)
            const obj1 = {}
            obj1.id = obj.id.slice(0, 12)
            obj1.userName = obj.user
            obj1.orignPrice = obj.oriPay
            obj1.realPrice = obj.actPay
            obj1.couponName = obj.disName
            obj1.tradingTime = obj.time
            obj1.discount = obj.disType === 'money' ? obj.disNum : obj.disNum + '%'
            obj1.type = obj.couponType
            this.couponShow.push(obj1)
          })
          // console.log(arr)
          this.sortTime2()
          this.listLoading = false
        })
        .catch(err => console.log(err))
    },
    updateListCopy() {
      return new Promise((resolve, reject) => {
        this.listLoading = true

        // this.axios.get(this.findUrl, { headers: this.$store.state.user.headers })
        this.$api.couple.getCoupleList()
          .then(res => {
            this.listCopy.length = 0

            res.data.forEach((item) => {
              const obj = JSON.parse(item)
              const obj1 = {}
              obj1.id = obj.id.slice(0, 12)
              obj1.userName = obj.user
              obj1.orignPrice = obj.oriPay
              obj1.realPrice = obj.actPay
              obj1.couponName = obj.disName
              obj1.tradingTime = obj.time
              obj1.discount = obj.disType === 'money' ? obj.disNum : obj.disNum + '%'
              obj1.type = obj.couponType
              this.listCopy.push(obj1)
            })
            resolve(true)
            this.listLoading = false

          // console.log(arr[0].actPay, arr)
          })
          .catch(err => { reject(err) })
      })
    },

    handleFilter(value) {
      //   请求listcopy 的数据 然后把逻辑写在回调之中
      // console.log('123')
      this.updateListCopy()
        .then(res => {
          // console.log(res);
          if (this.couponFilter.couponName !== '' && this.couponFilter.userName !== '' && typeof (this.couponFilter.userName) !== undefined) {
            const arr1 = []
            this.listCopy.forEach(item => {
              if (item.couponName.indexOf(this.couponFilter.couponName) !== -1) {
                arr1.push(item)
              }
            })
            const arr2 = []
            arr1.forEach(item => {
              if (item.userName.indexOf(this.couponFilter.userName) !== -1) {
                arr2.push(item)
              }
            })
            if (this.couponFilter.type !== '' && typeof (this.couponFilter.type) !== undefined) {
              this.couponShow = arr2.filter(item => {
                // console.log(item)
                // console.log()
                return item.type === this.couponFilter.type
              })
            } else {
              this.couponShow = arr2
              // console.log(arr1)
            }
          } else if (this.couponFilter.couponName !== '' && this.couponFilter.userName === '' && typeof (this.couponFilter.userName) !== undefined) {
            const arr1 = []
            this.listCopy.forEach(item => {
              if (item.couponName.indexOf(this.couponFilter.couponName) !== -1) {
                arr1.push(item)
              }
            })
            if (this.couponFilter.type !== '' && typeof (this.couponFilter.type) !== undefined) {
              this.couponShow = arr1.filter(item => {
                // console.log(item)
                // console.log(item.type === this.couponFilter.type)
                // console.log()

                return item.type === this.couponFilter.type
              })
            } else {
              this.couponShow = arr1
              // console.log(arr1)
            }
          } else if (this.couponFilter.couponName === '' && this.couponFilter.userName !== '' && typeof (this.couponFilter.userName) !== undefined) {
            const arr1 = []
            this.listCopy.forEach(item => {
              if (item.userName.indexOf(this.couponFilter.userName) !== -1) {
                arr1.push(item)
              }
            })
            if (this.couponFilter.type !== '' && typeof (this.couponFilter.type) !== undefined) {
              this.couponShow = arr1.filter(item => {
                // console.log(item)
                // console.log()
                return item.type === this.couponFilter.type
              })
            } else {
              this.couponShow = arr1
              // console.log(arr1)
            }
          } else if (this.couponFilter.couponName === '' && this.couponFilter.userName === '' && this.couponFilter.type !== '') {
            const arr = this.listCopy.filter(item => {
              return item.type === this.couponFilter.type
            })
            this.couponShow = arr
          } else if (this.couponFilter.couponName === '' && this.couponFilter.userName === '' && this.couponFilter.type === '') {
            this.couponShow = this.listCopy
          }
          this.sortTime2()
        })
    },
    //  这个是管列表的自选择排序
    sortTime(obj1, obj2) {
      const val1 = obj1.tradingTime
      const val2 = obj2.tradingTime
      return val1 - val2
    },
    //  这里是默认排序 默认降序
    sortTime2() {
      this.couponShow.sort((a, b) => {
        return b['tradingTime'] - a['tradingTime']
      })
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
