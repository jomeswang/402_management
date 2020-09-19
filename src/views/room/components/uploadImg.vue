<template>
  <div>
    <!-- :class="{ disabled: uploadDisabled }" -->
    <!-- 上传数据空了 加headers 时  重构上传 -->
    <!--  这里的headers  需要测试 -->
    <el-upload
      action="https://ht1.jomeswang.top/api/room/pic"
      list-type="picture-card"
      :on-success="handleAvatarSuccess"
      :on-error="err"
      :before-upload="beforeAvatarUpload"
      :file-list="fileList"
      :limit="4"
      :on-exceed="outLimit"
      accept="image/jpeg,image/jpg,image/png"
    >
      <i slot="default" class="el-icon-plus" />
      <div slot="file" slot-scope="{file}">
        <img
          class="el-upload-list__item-thumbnail"
          :src="file.url"
          :alt="file.name"
        >
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <i class="el-icon-zoom-in" />
          </span>

          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleRemove2(file)"
          >
            <i class="el-icon-delete" />
          </span>
        </span>
      </div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      uploadDisabled: false,
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false
    }
  },
  computed: {
    ...mapState({
      fileList: state => state.room.imgUrl,
      headers: state => state.user.headers
    })

  },
  methods: {
    err(res) {
      console.log(res)
    },
    handleAvatarSuccess(response) {
      //  处理上传成功回调
      // window.console.log(response)
      const obj = { name: response.name, url: 'https://ht1.jomeswang.top/' + response.path }
      // console.log(obj)
      // const obj = { name: response.name, url: response.path }
      this.$store.dispatch('room/updateImg', obj)
      // this.closeLoading()
      this.$store.dispatch('room/closeLoading')
      this.$message({
        message: '成功上传一张照片',
        type: 'success'
      })
    },
    beforeAvatarUpload(file) {
      // console.log(this.$store.state.user)
      //  检查 图片类型和大小
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG && !isPNG) {
        this.$message.error('上传图片必须是JPG/PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      // console.log(isJPG, isPNG, isLt2M)
      if ((isJPG || isPNG) && isLt2M) {
        // console.log('123')
        this.$store.dispatch('room/openLoading')
      }
      return (isJPG || isPNG) && isLt2M
    },
    handleRemove2(file) {
      // console.log(file)
      // 删除靠name
      const index = this.fileList.findIndex(item => item.name === file.name)
      this.$store.dispatch('room/deleteImg', index)
      this.uploadDisabled = false
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    outLimit() {
      this.$message.error('最多上传四张图片')
    }

  }
}
</script>
<style scoped>
    .disabled .el-upload--picture-card {
        display: none !important;
    }
</style>
