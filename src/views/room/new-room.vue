<template>
  <div class="room">

    <el-row :gutter="5">
      <el-col :span="6">
        <div class="inputCustom" style="display: flex;  ">
          <span style="width: 100px; margin: auto; ">房间类型</span>
          <el-input v-model="room.name" clearable placeholder="请输入房间类型" />
        </div>
      </el-col>
      <el-col :span="15">
        <div class="inputCustom" style="display: flex; margin-left: 60px ">
          <span style="width: 100px; margin: auto; font-size: 14px; font-weight: 700">房间简述</span>
          <el-input v-model="room.description" clearable placeholder="请输入房间简述" />
        </div>
      </el-col>
    </el-row>

    <div class="roomDetail">
      <div class="detailName" style="margin-top: 20px; font-size: 25px">
        房型信息
      </div>
      <el-row :gutter="2" style="margin-top: 20px">
        <el-col :span="6">
          <div class="inputCustom" style="display: flex;  ">
            <span style="width: 100px; margin: auto; ">房间面积</span>
            <el-input v-model="room.area" clearable placeholder="请输入房间面积" />
          </div>
        </el-col>

        <el-col :span="7">
          <div class="inputCustom" style="display: flex; margin-left: 60px ">
            <span style="width: 100px; margin: auto; ">床型</span>
            <el-input v-model="room.bed" clearable placeholder="请输入房间床型" />
          </div>
        </el-col>

        <el-col :span="8">
          <div class="inputCustom" style="display: flex; margin-left: 60px ">
            <span style="width: 100px; margin: auto; ">可住人数</span>
            <el-input v-model="room.peopleNum" clearable placeholder="请输入房间可住人数" />
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="2" style="margin-top: 20px">
        <el-col :span="6">
          <div class="inputCustom" style="display: flex;  ">
            <span style="width: 100px; margin: auto; ">能否加床</span>
            <el-input v-model="room.addBed" clearable placeholder="请输入能否加床" />
          </div>
        </el-col>

        <el-col :span="7">
          <div class="inputCustom" style="display: flex; margin-left: 60px ">
            <span style="width: 100px; margin: auto; ">是否含早</span>
            <el-input v-model="room.morningTea" clearable placeholder="请输入是否含早" />
          </div>
        </el-col>

        <el-col :span="8">
          <div class="inputCustom" style="display: flex; margin-left: 60px ">
            <span style="width: 100px; margin: auto; ">是否有窗</span>
            <el-input v-model="room.window" clearable placeholder="请输入是否有窗" />
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="roomDetail2">
      <div class="detailName" style="margin-top: 20px; font-size: 25px">
        配套设施
      </div>
      <el-row :gutter="2" style="margin-top: 20px">
        <el-col :span="6">
          <div class="inputCustom" style="display: flex;  ">
            <span style="width: 100px; margin: auto; ">浴室设施</span>
            <el-input v-model="room.bathroom" clearable placeholder="请输入浴室设施" />
          </div>
        </el-col>

        <el-col :span="7">
          <div class="inputCustom" style="display: flex; margin-left: 60px ">
            <span style="width: 100px; margin: auto; ">便利设施</span>
            <el-input v-model="room.convenience" clearable placeholder="请输入便利设施" />
          </div>
        </el-col>

        <el-col :span="8">
          <div class="inputCustom" style="display: flex; margin-left: 60px ">
            <span style="width: 100px; margin: auto; ">客房设施</span>
            <el-input v-model="room.guestRoom" clearable placeholder="请输入房间客房设施" />
          </div>
        </el-col>
      </el-row>

    </div>

    <el-row :gutter="2" style="margin-top: 40px">
      <el-col :span="6">
        <div class="inputCustom" style="display: flex;  ">
          <span style="width: 100px; margin: auto; ">房间介绍</span>
          <el-input v-model="room.introduction" clearable placeholder="请输入房间介绍" />
        </div>
      </el-col>

      <el-col :span="7">
        <div class="inputCustom" style="display: flex; margin-left: 60px ">
          <span style="width: 100px; margin: auto; ">房间价格</span>
          <el-input v-model="room.price" clearable placeholder="请输入房间价格" />
        </div>
      </el-col>

      <el-col :span="8">
        <div class="inputCustom" style="display: flex; margin-left: 60px ">
          <span style="width: 100px; margin: auto; ">房间押金</span>
          <el-input v-model="room.deposit" clearable placeholder="请输入房间押金" />
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="2" style="margin-top: 40px">
      <el-col :span="6">
        <div class="inputCustom" style="display: flex;  ">
          <span style="width: 100px; margin: auto; ">订房必读</span>
          <el-input v-model="room.read" clearable placeholder="请输入订房必读" />
        </div>
      </el-col>

      <el-col :span="7">
        <div class="inputCustom" style="display: flex; margin-left: 60px ">
          <span style="width: 100px; margin: auto; ">预定须知</span>
          <el-input v-model="room.bookKnow" clearable placeholder="请输入预定须知" />
        </div>
      </el-col>

      <el-col :span="7">
        <div class="inputCustom" style="display: flex; margin-left: 60px ">
          <span style="width: 100px; margin: auto; ">房间数量</span>
          <el-input v-model="room.roomNum" clearable placeholder="请输入房间数量" />
        </div>
      </el-col>

    </el-row>

    <div class="upload" style="margin-top: 30px">
      <span style="font-size: 30px">请上传房间详情图</span> <upload-img style="margin-top: 20px" />
    </div>

    <div class="bottom">
      <el-button type="primary" @click="submitForm">{{ btnName }}</el-button>
      <el-button v-if="showReset" style="margin-left: 15vw" @click="resetForm">重置</el-button>
    </div>
    <!-- </el-form> -->
  </div>
</template>

<script>
import { mapState } from 'vuex'

import uploadImg from '@/views/room/components/uploadImg'
export default {
  name: 'NewRoom',
  components: { uploadImg },
  data() {
    return {
      idPlus: 1,
      btnName: '立即创建',
      showReset: true,
      room: {
        id: '',
        name: '',
        status: '上线',
        description: '',
        area: '',
        bed: '',
        peopleNum: '',
        addBed: '',
        morningTea: '',
        window: '',
        bathroom: '',
        convenience: '',
        guestRoom: '',
        introduction: '',
        price: '',
        deposit: '',
        imgUrl: '',
        read: '',
        bookKnow: '',
        roomNum: ''
      },
      rules: {
      }
    }
  },
  computed: {
    ...mapState({
      roomList: state => state.room.roomList
    })
  },
  created() {
    // 进来检测是否传值  如果有值那么根据这一个Id去 查找值最后更新数据
    // console.log(this.$route.params.id === undefined)
    if (this.$route.params.id !== undefined) {
      // eslint-disable-next-line eqeqeq
      const index = this.roomList.findIndex(item => item.id == this.$route.params.id)
      // console.log(index)
      this.btnName = '编辑完成'
      this.showReset = false
      this.room = { ...this.roomList[index] }
    } else {
      this.showReset = true

      this.btnName = '立即创建'
    }

    //  之后要做的一件事情是数据的post
  },
  methods: {
    submitForm() {
      this.room.status = '上线'

      if (this.$route.params.id === undefined) {
        //  在这里意味着创建房间
        this.$message({
          message: '恭喜你，成功创建一个房间',
          type: 'success'
        })
        //  这里发出Post请求  将room数据发上去

        this.idPlus += 1
      } else {
        this.$message({
          message: '恭喜你，成功编辑一个房间',
          type: 'success'
        })
        //  发出post请求编辑
      }

      Object.keys(this.room).forEach(key => { this.room[key] = '' })
      this.room.id = this.idPlus

      this.$router.push({ name: 'RoomList' })
    },
    resetForm() {
      Object.keys(this.room).forEach(key => { this.room[key] = '' })
      this.room.id = this.idPlus
    }
  }
}
</script>

<style lang="scss" scoped>
.room{
  margin-left: 10vw;
  margin-top: 50px;
  font-size: 14px;
  font-weight: 700
}
.bottom{
    // text-align: center;
  margin-left: 20vw;

}
</style>
