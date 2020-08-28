<template>
  <div class="app-container">
    <div class="block">
      <el-carousel height="600px" style="margin: 0 auto; width: 80%">
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
      img: ['https://dimg12.c-ctrip.com/images/200514000000wfgqlD7D0_R_550_412.jpg', 'https://dimg10.c-ctrip.com/images/200f14000000w136y3282_R_550_412.jpg', 'https://images4.c-ctrip.com/target/2A0u10000000paqzm214E.jpg', 'https://dimg10.c-ctrip.com/images/200o1a0000018zmdb2197_R_550_412.png']
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
