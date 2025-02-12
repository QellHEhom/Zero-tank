<script setup name="BloggerCar">
// import { getBlogger } from '@/api/home'
import { onMounted, ref } from 'vue'
import { getWebConfig } from '@/api/article'
import { useWebDataStore } from '@/stores/index'
import { storeToRefs } from 'pinia'

const Store = useWebDataStore()
const { webConfig } = storeToRefs(Store)
</script>
<template>
  <el-card class="BloggerCar" shadow="always" style="padding: 0">
    <div class="BloggerCar">
      <div class="cart-img" v-if="webConfig.avatar">
        <!-- <el-image style="width: 100%; height: 140px" src="src/public/images/1.jpg" fit="fill" /> -->
        <el-image class="blog-img" :src="webConfig.avatar" fit="cover" />
      </div>
      <div class="blog-card">
        <div class="blog-card-name">{{ webConfig.name }}</div>
        <div class="blog-card-content WorDwrap">
          {{ webConfig.intro }}
        </div>
        <p style="color: var(--text-color2)">求职不易，请大佬别攻击</p>
      </div>
    </div>
  </el-card>
</template>
<style scoped lang="less">
.BloggerCar {
  height: 280px;
  display: grid;
  grid-template-rows: 140px 1fr;
  background-color: var(--box-backgrd-color);
  position: relative;
  margin-bottom: 45px;
  border-radius: 10px;
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 140px;
    background-image: url('@/assets/images/beijing.jpg');
    background-size: cover;
    background-position: center;
  }
  .cart-img {
    height: 140px;
    position: relative;
    .blog-img {
      border-radius: 50%;
      width: 92px;
      height: 92px;
      position: absolute;
      top: 60%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 2;
    }
  }
  .blog-card {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
    padding: 10px;
    text-align: center;
    .blog-card-name {
      font-size: 23px;
      font-weight: 700;
      color: #6366f1;
    }
    .blog-card-content {
      font-size: 20px;
      color: var(--text-color2);
      margin-bottom: 10px;
    }
  }
}
</style>
