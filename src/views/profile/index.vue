<template>
  <div class="app-container">
    <div class="block">
      <el-carousel height="800px" style="margin: 0 auto; width: 100%">
        <el-carousel-item v-for="(item,index) in img" :key="index">
          <img :src="item" alt="图片链接失效了" style="width: 100%;height: 800px">
        </el-carousel-item>
      </el-carousel>
    </div>
    <mallki class-name="mallki-text title" text="402后端管理系统" />
    <span style="float: right">权限: {{ role }} </span>

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
        'http://photo.jomeswang.top/20200923123002.png',
        'http://photo.jomeswang.top/20200923123059.png',
        'http://photo.jomeswang.top/20200923123126.png',
        'http://photo.jomeswang.top/20200923123158.png'
      ]
    }
  },
  computed: {
    role() {
      if (this.$store.state.user.roles.join() === 'admin') return '管理员'; else return '普通用户'
    }
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
