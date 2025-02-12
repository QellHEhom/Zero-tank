<script setup>
import { onMounted, reactive, ref } from 'vue'
import BlogArticleItem from '@/components/home/BlogArticleItem.vue'
import BloggerCar from '@/components/car/BlogCar.vue'
import Affiche from '@/components/car/Affiche.vue'
import router from '@/router'
// api
import { getBanner } from '@/api/article'
import CanvasImg from '@/components/CanvasImg.vue'

let articleData = reactive([])
// 标签选择
const tabsValue = ref('最新')
const BannerList = ref()
// 获取banner数据
const getBannerData = async () => {
  const res = await getBanner()
  BannerList.value = res.data
}
onMounted(() => {
  getBannerData()
})
</script>

<template>
  <div class="content-layout">
    <main class="home-main-content">
      <div class="banner">
        <el-carousel height="380px" motion-blur>
          <el-carousel-item v-for="item in BannerList" :key="item.relevance">
            <CanvasImg :Data="item.slice" width="100%" height="100%" />
            <div class="slide-content">
              <h3>{{ item.title }}</h3>
              <button @click="router.push(`/article/${item.relevance}`)">
                阅读更多
                <svg-icon name="rigth"></svg-icon>
              </button>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="hot_category">
        <BlogArticleItem :articleData="articleData" :tabsValue="tabsValue" />
      </div>
    </main>
    <aside class="sidebar">
      <div class="rigth-box">
        <BloggerCar />
        <Affiche />
      </div>
    </aside>
  </div>
</template>

<style scoped lang="less">
.content-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  padding: 0 20px;
  gap: 48px;
  padding: 0 32px;
}
.home-main-content {
  max-width: 920px;
  display: flex;
  flex-direction: column;
  .banner {
    border-radius: 10px;
    overflow: hidden;
    background-size: cover;
    background-position: center;
    position: relative;
    .slide-content {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      padding: 32px;
      background: linear-gradient(transparent, #0003 20%, #000c);
      h3 {
        color: #fff;
        font-size: 2.3em;
        padding: 15px 0;
      }
      button {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 24px;
        background: #409eff;
        color: #fff;
        border: none;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
        &:hover {
          background: #3a8ee6;
          transform: translateX(3px);
        }
      }
    }
  }
  .hot_category {
    margin-top: 20px;
    min-height: 1000px;
    .el-tabs__nav-scroll span {
      font-size: 16px;
    }
    .custom-tabs-label {
      display: flex;
      align-items: center;
    }
  }
}
.sidebar {
  .rigth-box {
    position: sticky;
    top: 80px;
  }
}

:deep(.el-tabs__item) {
  color: var(--text-color3);
  opacity: 1;
}

:deep(.el-tabs__item.is-active) {
  color: var(--hover-color);
  color: var();
  opacity: 1;
}
:deep(.el-tabs__item:hover) {
  color: var(--hover-color);
  opacity: 1;
}
:deep(.el-tabs__active-bar) {
  background-color: var(--hover-color);
}
</style>
