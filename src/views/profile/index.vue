<template>
  <div class="app-container">
    <div class="block">
      <el-carousel height="600px">
        <el-carousel-item v-for="(item,index) in img" :key="index">
          <img :src="item" alt="图片链接失效了" style="height: 800px">
        </el-carousel-item>
      </el-carousel>
    </div>
    <mallki class-name="mallki-text title" text="后端管理系统" />

  </div>
</template>

<script>
import Mallki from '@/components/TextHoverEffect/Mallki'

export default {
  name: 'Profile',
  components: {
    Mallki
  },
  data() {
    return {
      user: {},
      img: [
        'https://api.dujin.org/bing/1920.php', ' https://api.ixiaowai.cn/api/api.php', 'https://uploadbeta.com/api/pictures/random/?key=BingEverydayWallpaperPicture', ' https://api.ixiaowai.cn/mcapi/mcapi.php']
    }
  },
  computed: {

  },
  created() {
  },
  methods: {

  }
}
</script>

<style scoped>
.title{
  /* margin: 0 auto; */
  margin-left: 40%;
  margin-top: 20px;
  text-align: center;
  font-size: 40px;
  font-weight: 700;
}
</style>
