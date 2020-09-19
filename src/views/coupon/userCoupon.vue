<template>
  <div>
    <div class="filter-container">
      <el-input v-model="couponFilter.couponName" clearable placeholder="优惠券名称" style="width: 200px;" class="filter-item" @clear="handleFilter" @keyup.enter.native="handleFilter" />
      <el-input v-model="couponFilter.userName" clearable placeholder="用户名称" style="width: 200px" class="filter-item" @clear="handleFilter" @keyup.enter.native="handleFilter" />
      <el-select v-model="couponFilter.type" placeholder="优惠券分类筛选" clearable class="filter-item" style="width: 150px" @change="handleFilter">
        <el-option v-for="item in calendarTypeOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="couponFilter.status" placeholder="优惠券状态筛选" clearable class="filter-item" style="width: 150px" @change="handleFilter">
        <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
      </el-select>

      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t("table.search") }}</el-button>
    </div>

    <el-table v-loading="listLoading" :data="userCoupon" border fit highlight-current-row style="width: 100%;">
      <el-table-column :label="$t('userCoupon.couponId')" prop="couponId" align="center" width="200">
        <template slot-scope="{ row }">
          <span>{{ row.couponId }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('userCoupon.couponName')" prop="couponName" align="center" width="200">
        <template slot-scope="{ row }">
          <span>{{ row.couponName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('userCoupon.userName')" prop="userName" align="center" width="150">
        <template slot-scope="{ row }">
          <span>{{ row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('userCoupon.type')" prop="type" align="center" width="100">
        <template slot-scope="{ row }">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('userCoupon.status')" prop="status" align="center" width="100">
        <template slot-scope="{ row }">
          <el-tag :type="row.status | statusFilter">{{ row.status }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column :label="$t('userCoupon.moneySill')" prop="moneySill" align="center" width="100">
        <template slot-scope="{ row }">
          <span>{{ row.moneySill }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('userCoupon.discount')" prop="discount" align="center" width="100">
        <template slot-scope="{ row }">
          <span>{{ row.discount }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('userCoupon.timeBegin')" prop="timeBegin" align="center" width="150">
        <template slot-scope="{ row }">
          <span>{{ row.timeBegin }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('userCoupon.timeEnd')" prop="timeEnd" align="center" width="150">
        <template slot-scope="{ row }">
          <span>{{ row.timeEnd }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('userCoupon.validTime')" prop="validTime" align="center" width="150">
        <template slot-scope="{ row }">
          <span>{{ row.validTime }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column :label="$t('userCoupon.couponNum')" prop="couponNum" align="center" width="100">
        <template slot-scope="{ row }">
          <span>{{ row.couponNum }}</span>
        </template>
      </el-table-column> -->
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'UserCoupon',
  filters: {
    statusFilter(status) {
      const statusMap = {
        可使用: 'success',
        已使用: 'info',
        已过期: ''
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      // findUrl: 'https://ht1.jomeswang.top/api/event',
      listLoading: false,
      calendarTypeOptions: ['餐饮券', '客房券', '棋牌券'],
      userCoupon: [
        // {
        //   couponId: '123',
        //   couponName: '超级大房',
        //   userName: '456',
        //   type: '餐饮券',
        //   status: '已过期',
        //   moneySill: '20',
        //   discount: '50',
        //   timeBegin: '2019-06-02',
        //   timeEnd: '2019-06-08',
        //   validTime: '6:00 - 8:00',
        //   couponNum: 12
        // },
        // {
        //   couponId: '546',
        //   couponName: '超级大房1',
        //   userName: '4567',
        //   type: '餐饮券',
        //   status: '已使用',
        //   moneySill: '20',
        //   discount: '50',
        //   timeBegin: '2019-06-02',
        //   timeEnd: '2019-06-08',
        //   validTime: '6:00 - 8:00',
        //   couponNum: 12
        // },
        // {
        //   couponId: '79',
        //   couponName: '超级大房2',
        //   userName: '13',
        //   type: '餐饮券',
        //   status: '可使用',
        //   moneySill: '20',
        //   discount: '50',
        //   timeBegin: '2019-06-02',
        //   timeEnd: '2019-06-08',
        //   validTime: '6:00 - 8:00',
        //   couponNum: 12
        // }
      ],
      listCopy: [
        // {
        //   couponId: '123',
        //   couponName: '超级大房',
        //   userName: '456',
        //   type: '餐饮券',
        //   status: '已过期',
        //   discount: '50',
        //   timeBegin: '2019-06-02',
        //   timeEnd: '2019-06-08',
        //   validTime: '6:00 - 8:00',
        //   couponNum: 12
        // },
        // {
        //   couponId: '546',
        //   couponName: '超级大房1',
        //   userName: '4567',
        //   type: '餐饮券',
        //   status: '已使用',
        //   discount: '50',
        //   timeBegin: '2019-06-02',
        //   timeEnd: '2019-06-08',
        //   validTime: '6:00 - 8:00',
        //   couponNum: 12
        // },
        // {
        //   couponId: '79',
        //   couponName: '超级大房2',
        //   userName: '13',
        //   type: '餐饮券',
        //   status: '可使用',
        //   discount: '50',
        //   timeBegin: '2019-06-02',
        //   timeEnd: '2019-06-08',
        //   validTime: '6:00 - 8:00',
        //   couponNum: 12
        // }
      ],
      couponFilter: {
        userName: '',
        couponName: '',
        type: '',
        status: ''
      },
      statusOptions: ['已使用', '可使用', '已过期']
    }
  },
  // created() {
  //   //  记得加一个listloading
  //   //  同步 userCoupon  和listCopy
  //   // 查询的时候   请求数据同步
  //   // console.log('couponLIst')
  //   // this.updateUserCoupon()
  //   // console.log('created')
  //   // this.updateListCopy()
  // },
  activated() {
    // 切换路由处理更新放这里
    this.updateUserCoupon()
    // console.log('activated')

    // this.updateListCopy()
  },
  mounted() {
    this.updateUserCoupon()
  },
  methods: {
    handleFilter(value) {
      //  记得加一个listloading

      //   请求listcopy 的数据 然后把逻辑写在回调之中

      // console.log('123')
      this.updateListCopy()
        .then(() => {
          if (
            this.couponFilter.couponName !== '' &&
        this.couponFilter.userName !== '' &&
        typeof this.couponFilter.userName !== undefined
          ) {
            const arr1 = []
            this.listCopy.forEach((item) => {
              if (item.couponName.indexOf(this.couponFilter.couponName) !== -1) {
                arr1.push(item)
              }
            })
            const arr2 = []
            arr1.forEach((item) => {
              if (item.userName.indexOf(this.couponFilter.userName) !== -1) {
                arr2.push(item)
              }
            })
            let arr3 = []
            if (
              this.couponFilter.status !== '' &&
          typeof this.couponFilter.status !== undefined
            ) {
              arr3 = arr2.filter((item) => {
                return item.status === this.couponFilter.status
              })
            } else {
              arr3 = arr2
            }
            if (
              this.couponFilter.type !== '' &&
          typeof this.couponFilter.type !== undefined
            ) {
              this.userCoupon = arr3.filter((item) => {
                // console.log(item)
                // console.log()
                return item.type === this.couponFilter.type
              })
            } else {
              this.userCoupon = arr3
              // console.log(arr1)
            }
          } else if (
            this.couponFilter.couponName !== '' &&
        this.couponFilter.userName === '' &&
        typeof this.couponFilter.userName !== undefined
          ) {
            const arr1 = []
            this.listCopy.forEach((item) => {
              if (item.couponName.indexOf(this.couponFilter.couponName) !== -1) {
                arr1.push(item)
              }
            })
            let arr2 = []
            if (
              this.couponFilter.status !== '' &&
          typeof this.couponFilter.status !== undefined
            ) {
              arr2 = arr1.filter((item) => {
                return item.status === this.couponFilter.status
              })
            } else {
              arr2 = arr1
            }
            if (
              this.couponFilter.type !== '' &&
          typeof this.couponFilter.type !== undefined
            ) {
              this.userCoupon = arr2.filter((item) => {
                // console.log(item)
                // console.log(item.type === this.couponFilter.type)
                // console.log()

                return item.type === this.couponFilter.type
              })
            } else {
              this.userCoupon = arr2
              // console.log(arr1)
            }
          } else if (
            this.couponFilter.couponName === '' &&
        this.couponFilter.userName !== '' &&
        typeof this.couponFilter.userName !== undefined
          ) {
            const arr1 = []
            this.listCopy.forEach((item) => {
              if (item.userName.indexOf(this.couponFilter.userName) !== -1) {
                arr1.push(item)
              }
            })
            let arr2 = []
            if (
              this.couponFilter.status !== '' &&
          typeof this.couponFilter.status !== undefined
            ) {
              arr2 = arr1.filter((item) => {
                return item.status === this.couponFilter.status
              })
            } else {
              arr2 = arr1
            }
            if (
              this.couponFilter.type !== '' &&
          typeof this.couponFilter.type !== undefined
            ) {
              this.userCoupon = arr2.filter((item) => {
                // console.log(item)
                // console.log()
                return item.type === this.couponFilter.type
              })
            } else {
              this.userCoupon = arr2
              // console.log(arr1)
            }
          } else if (
            this.couponFilter.couponName === '' &&
        this.couponFilter.userName === '' &&
        this.couponFilter.type !== ''
          ) {
            const arr = this.listCopy.filter((item) => {
              return item.type === this.couponFilter.type
            })
            let arr1 = []
            if (
              this.couponFilter.status !== '' &&
          typeof this.couponFilter.status !== undefined
            ) {
              arr1 = arr.filter((item) => {
                return item.status === this.couponFilter.status
              })
            } else {
              arr1 = arr
            }
            this.userCoupon = arr1
          } else if (
            this.couponFilter.couponName === '' &&
        this.couponFilter.userName === '' &&
        this.couponFilter.type === ''
          ) {
            let arr = []
            if (
              this.couponFilter.status !== '' &&
          typeof this.couponFilter.status !== undefined
            ) {
              arr = this.listCopy.filter((item) => {
                return item.status === this.couponFilter.status
              })
            } else {
              arr = this.listCopy
            }
            this.userCoupon = arr
          }
        })
    },

    updateUserCoupon() {
      this.listLoading = true
      // this.axios.get(this.findUrl, { headers: this.$store.state.user.headers })
      this.$api.couple.getUserCouple()
        .then(res => {
          this.userCoupon.length = 0

          // const arr = []
          res.data.forEach((item) => {
            const obj = JSON.parse(item)
            const obj1 = {}
            obj1.couponId = obj.id
            obj1.couponName = obj.title
            obj1.userName = obj.user
            obj1.type = obj.type
            obj1.status = obj.status
            obj1.moneySill = obj.message.condition === 0 ? '无门槛' : '满' + obj.message.condition + '元'
            obj1.discount = obj.message.type === 'money' ? obj.message.num : obj.message.num + '%'
            obj1.timeBegin = obj.startDate
            obj1.timeEnd = obj.endDate
            obj1.validTime = obj.startTime + '-' + obj.endTime
            this.userCoupon.push(obj1)
            // arr.push(JSON.parse(item))
          })
          // console.log(arr)
          this.listLoading = false
        })
        .catch(err => console.log(err))
    },

    updateListCopy() {
      return new Promise((resolve, reject) => {
        this.listLoading = true
        // this.axios.get(this.findUrl, { headers: this.$store.state.user.headers })
        this.$api.couple.getUserCouple()
          .then(res => {
            this.listCopy.length = 0

            // const arr = []
            res.data.forEach((item) => {
              const obj = JSON.parse(item)
              const obj1 = {}
              obj1.couponId = obj.id
              obj1.couponName = obj.title
              obj1.userName = obj.user
              obj1.type = obj.type
              obj1.status = obj.status
              obj1.moneySill = obj.message.condition === 0 ? '无门槛' : '满' + obj.message.condition + '元'
              obj1.discount = obj.message.type === 'money' ? obj.message.num : obj.message.num + '%'
              obj1.timeBegin = obj.startDate
              obj1.timeEnd = obj.endDate
              obj1.validTime = obj.startTime + '-' + obj.endTime
              this.listCopy.push(obj1)
            // arr.push(JSON.parse(item))
            })
            // console.log(arr)
            this.listLoading = false
            resolve(true)
          })
          .catch(err => reject(err))
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
