<template>
  <div>
    <el-table
      v-loading="listLoading"
      :data="roomList"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column :label="$t('room.id')" prop="id" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('room.status')" prop="status" align="center" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>        </template>
      </el-table-column>
      <el-table-column :label="$t('room.name')" prop="name" align="center" width="200">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('room.description')" prop="description" align="center" width="220">
        <template slot-scope="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('room.introduction')" prop="introduction" align="center" width="220">
        <template slot-scope="{row}">
          <span>{{ row.introduction }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('room.price')" prop="price" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('room.deposit')" prop="deposit" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.deposit }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('room.roomNum')" prop="roomNum" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.roomNum }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleEdit(row)">
            {{ $t('room.edit') }}
          </el-button>
          <el-button size="mini" @click="showDetail(row.id)">
            {{ $t('table.detail') }}
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
            {{ $t('room.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog class="detailRoom" :visible.sync="dialogDetailVisible" width="40%" :title="currentRoom.name">
      <el-carousel height="200px">
        <el-carousel-item v-for="(item,index) in currentRoom.imgUrl" :key="index">
          <img :src="item.url" :alt="item.name" style=" height: 260px">
        </el-carousel-item>
      </el-carousel>
      <!-- <img :src="currentRoom.imgUrl" alt="房间图片" width="90%"> -->
      <div class="roomDetail">
        <h1>房型信息</h1>
        <el-row :gutter="10">
          <el-col :span="6">房间面积</el-col>
          <el-col :span="6">{{ currentRoom.area }}</el-col>
          <el-col :span="6">床型</el-col>
          <el-col :span="6">{{ currentRoom.bed }}</el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">可住人数</el-col>
          <el-col :span="6">{{ currentRoom.peopleNum }}</el-col>
          <el-col :span="6">能否加床</el-col>
          <el-col :span="6">{{ currentRoom.addBed }}</el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">是否含早</el-col>
          <el-col :span="6">{{ currentRoom.morningTea }}</el-col>
          <el-col :span="6">是否有窗</el-col>
          <el-col :span="6">{{ currentRoom.window }}</el-col>
        </el-row>
      </div>

      <div class="roomDetail2">
        <h1>配套设施</h1>
        <div>浴室设施： {{ currentRoom.bathroom }}</div>
        <div>便利设施： {{ currentRoom.convenience }}</div>
        <div>客房设施： {{ currentRoom.guestRoom }}</div>
      </div>

      <div class="know">
        <h1>预定须知</h1>
        <div>{{ currentRoom.read }}</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogDetailVisible = false">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'RoomList',
  filters: {
    statusFilter(status) {
      const statusMap = {
        上线: 'success',
        下线: 'info'
      }
      return statusMap[status]
    }

  },
  data() {
    return {
      currentRoom: {},
      currentId: '',
      // roomList: [
      // { id: '123', status: '上线', name: 'jkl', description: 'fsdf', detail: 'fdsfs', detail2: 'fdsf', area: '123', bed: '465', peopleNum: '789', addBed: '123', morningTea: '456', window: '132', bathroom: '456', convenience: '1223', guestRoom: '456', introduction: 'sfsd', price: '12', deposit: '12', imgUrl: '12', read: '465', bookKnow: '465', roomNum: 100 }
      // ],
      listLoading: true,
      dialogDetailVisible: false

    }
  },

  computed: {
    ...mapState({
      roomList: state => state.room.roomList,
      deleteOneUrl: state => state.room.deleteOneUrl

    }),
    ...mapActions('room', [
      'getRoomList'
    ])
  },
  watch: {
    currentId() {
      this.currentRoom = this.roomList.find(item => item.id === this.currentId)
      // console.log(this.currentRoom)
    }
  },
  activated() {
    this.handleGet()
  },
  mounted() {
    this.handleGet()
  },
  // created() {
  //   // console.log(this.$store)
  //   //  同步Roomlist  在 state 中
  //   // this.getRoomList
  //   this.handleGet()
  // },
  methods: {
    handleGet() {
      this.listLoading = true
      // console.log('123')
      this.$store.dispatch('room/getRoomList')
        .then((res) => { this.listLoading = false })
        .catch(err => { console.log(err) })
    },
    handleEdit(row) {
      const id = row.id
      this.$router.push({ name: 'EditRoom', params: { id: id }})
    },
    showDetail(id) {
      this.dialogDetailVisible = true
      this.currentId = id
      // console.log(id)
    },
    handleDelete(row, index) {
      this.listLoading = true
      this.$message({
        message: '成功删掉一个房间',
        type: 'success'
      })
      // console.log(row)
      this.axios.post(this.deleteOneUrl, JSON.stringify(row), { headers: this.$store.state.user.headers })
        .then(
          res => {
            console.log('Delete success!!'); this.handleGet(); this.listLoading = false
          }
        )
        .catch(err => { console.log(err) })
      row.status = '下线'
      // this.listLoading = true
      // this.getRoomList

      // console.log('123')
      // setTimeout(() => { this.$store.dispatch('room/getRoomList'); setTimeout(() => { this.listLoading = false }, 1000) }, 1000)
    }
  }
}
</script>

<style lang="scss" >
.detailRoom{
  .el-dialog__title{
  font-size: 30px;
  font-weight: 1000;
}
}
</style>
<style lang="scss" scoped>

.roomDetail{
  div{
    font-size: 15px;
    font-weight: 600;
    margin: 0 auto;
    margin-top: 5px
  }
}
.roomDetail2{
  div{
    font-size: 15px;
    font-weight: 600;
    margin: 0 auto;
    margin-top:15px
  }
}
.know{
  div{
    font-size: 15px;
    font-weight: 600;
  }
}
</style>
