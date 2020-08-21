<template>
  <div>

    <el-upload
      action=""
      list-type="picture-card"
      :class="{ disabled: uploadDisabled }"
      :limit="1"
      :on-success="handleAvatarSuccess"
      :on-change="handleChange"
      :on-remove="handleRemove"
      :before-upload="beforeAvatarUpload"
      accept="image/jpeg,image/jpg,image/png,image/bmp"
    >
      <i slot="default" class="el-icon-plus" />
      <div slot="file" slot-scope="{file}">
        <img
          class="el-upload-list__item-thumbnail"
          :src="file.url"
          alt=""
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
            @click="handleDownload(file)"
          >
            <i class="el-icon-download" />
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
export default {
  data() {
    return {
      uploadDisabled: false,
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false
    }
  },
  methods: {
    handleChange(file, fileList) {
      if (fileList.length >= 1) {
        this.uploadDisabled = true
      }
    },
    handleAvatarSuccess(response) {
      window.console.log(response)
    },
    handleRemove(file) {
      // imgDelete.post({pic_name : file.response.pic_name}).then();
      this.uploadDisabled = false
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isBMP = file.type === 'image/bmp'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG && !isPNG && !isBMP) {
        this.common.errorTip('上传图片必须是JPG/PNG/BMP 格式!')
      }
      if (!isLt2M) {
        this.common.errorTip('上传图片大小不能超过 2MB!')
      }
      return (isJPG || isBMP || isPNG) && isLt2M
    },
    handleRemove2(file) {
      console.log(file)
      this.uploadDisabled = false
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleDownload(file) {
      console.log(file)
    }
  }
}
</script>
<style scoped>
    .disabled .el-upload--picture-card {
        display: none !important;
    }
</style>
