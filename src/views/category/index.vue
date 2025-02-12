<script setup>
import { onMounted, ref } from 'vue'
import BloggerCar from '@/components/car/BlogCar.vue'
import Affiche from '@/components/car/Affiche.vue'
import { getCategory } from '@/api/article'
import router from '@/router'

// 分类列表
const categories = ref([
  {
    lable: '前端开发',
    data: [
      { id: '2133', createtime: '2023-3-0', title: 'Vue项目进行Seo优化' },
      { id: '2123', createtime: '2023-3-0', title: 'Spring Boot使用Jsoup抓取文章' },
    ],
  },
  {
    lable: '资源软件',
    data: [
      { id: '2153', createtime: '2023-3-0', title: 'Vue项目进行Seo优化' },
      { id: '213', createtime: '2023-3-0', title: 'Spring Boot使用Jsoup抓取文章' },
    ],
  },
  {
    lable: '后端开发',
    data: [
      { id: '253', createtime: '2023-3-0', title: 'Vue项目进行Seo优化' },
      { id: '2533', createtime: '2023-3-0', title: 'Spring Boot使用Jsoup抓取文章' },
    ],
  },
])

const skewHeight = ref()
const skew = ref(null)
onMounted(async () => {
  skew.value = skewHeight.value.clientHeight
  categories.value = (await getCategory()).data
})
</script>

<template>
  <div class="content-layout">
    <main class="categories-main-content">
      <div ref="skewHeight" class="categoriesList">
        <el-anchor :offset="170 + skew" direction="horizontal">
          <el-anchor-link
            v-for="(item, index) in categories"
            :href="`#${item.name}`"
            :key="item.id"
          >
            <svg-icon name="folder-open-fill" />
            <span>{{ item.name }}</span>
          </el-anchor-link>
        </el-anchor>
      </div>
      <div class="categories">
        <div class="categories-item" v-for="item in categories" :key="item.id" :id="item.name">
          <div class="categories-item-title">
            <svg-icon name="folder-open-fill" />
            <span>{{ item.name }}</span>
          </div>
          <div class="post-List">
            <div
              class="post-item"
              v-for="fruit in item.posts"
              :key="fruit.id"
              @click="router.push(`/article/${fruit.id}`)"
            >
              <el-image style="width: 150px; height: 80px" :src="fruit.avatar" fit="cover" />
              <span>{{ fruit.title }}</span>
            </div>
          </div>
        </div>
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
.categories-main-content {
  width: 920px;
  background-color: var(--box-backgrd-color);
  border-radius: 20px;
  padding: 24px;
  .categoriesList {
    position: sticky;
    top: 80px;
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    background-color: var(--box-backgrd-color);
    border-bottom: 1px solid var(--bordder-color);
    z-index: 50;
    padding: 10px 0;
    * {
      flex-wrap: wrap;
    }
    .el-anchor {
      background-color: var(--box-backgrd-color);
    }
    :deep(.el-anchor__item) {
      margin: 5px;
      padding: 0;
      .el-anchor__link {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 19px !important;
        padding: 4px 16px;
        border-radius: 10px;
        background: rgba(99, 102, 241, 0.1);
        color: var(--text-secondary);
        cursor: pointer;
        gap: 4px;
      }
      .is-active {
        background: var(--botton-backcolor);
        color: #fff;
      }
      &:hover {
        transform: translateY(-2px);
        transition: all 0.3s ease;
      }
    }
    :deep(.el-anchor__marker) {
      display: none;
    }
  }
  .categories {
    margin-top: 20px;
    .categories-item {
      margin-bottom: 60px;
      .categories-item-title {
        font-size: 30px;
        display: flex;
        align-items: center;
        color: var(--title-color);
        position: relative;
        svg {
          color: var(--botton-backcolor);
        }
        span {
          margin-left: 5px;
        }
        border-bottom: 1px solid var(--bordder-color);
        &::after {
          position: absolute;
          content: '';
          width: 50px;
          height: 2px;
          bottom: -1px;
          background-color: var(--botton-backcolor);
          margin-top: 10px;
        }
      }
      .post-List {
        margin-top: 20px;
        .post-item {
          font-size: 19px;
          display: flex;
          align-items: center;
          gap: 32px;
          padding: 15px 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          color: var(--text-color2);
          &:hover {
            background-color: #f5f5f5;
            color: #6366f1;
            transform: translateY(-3px);
          }
        }
      }
    }
  }
}
.sidebar {
  .rigth-box {
    position: sticky;
    top: 80px;
  }
}
</style>
