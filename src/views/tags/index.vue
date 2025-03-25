<script setup>
import { onMounted, ref } from 'vue'
import BloggerCar from '@/components/car/AuthorCar/index.vue'
import Affiche from '@/components/car/Affiche/index.vue'
import { getTags, getRecommends } from '@/api/article'

// 分类列表
const tagsList = ref([
  'Java Script',
  'Vue',
  'Linux',
  'MySQL',
  'Css',
  '宝塔',
  'Java',
  '资源',
  'React',
  '异步',
  '服务器',
  '博客',
  'websoket',
])
const tagData = ref([])

// 当前点击的标签
const active = ref(tagsList.value[0])
const getTagList = async () => {
  tagsList.value = (await getTags()).data
}

const selectArticle = async (id, tag) => {
  active.value = tag
  tagData.value = (await getRecommends(id)).data
  console.log(tagData.value)
}
onMounted(async () => {
  await getTagList()
  await selectArticle(tagsList.value[0].id, tagsList.value[0].name)
})
</script>

<template>
  <div class="content-layout">
    <main class="tags-main-content">
      <div class="categoriesList">
        <div
          class="tagList-Item"
          v-for="item in tagsList"
          :key="item.id"
          @click="selectArticle(item.id, item.name)"
          :class="{ 'is-active': active === item.name }"
        >
          <svg-icon name="mini-tag" />
          <span>{{ item.name }}</span>
        </div>
      </div>
      <div class="categories">
        <div class="tag-title">
          <svg-icon name="big-tag" />
          <span>{{ active }}</span>
        </div>
        <div class="post-List">
          <div class="post-item" v-for="item in tagData" :key="item.id">
            <el-image style="width: 200px; height: 112px" :src="item.avatar" fit="cover" />
            <span>{{ item.title }}</span>
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
.tags-main-content {
  width: 920px;
  background-color: var(--box-backgrd-color);
  border-radius: 20px;
  padding: 24px;
  .categoriesList {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    padding: 20px 0;
    background-color: var(--box-backgrd-color);
    border-bottom: 2px solid var(--bordder-color);
    .tagList-Item {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      padding: 6px 16px;
      border-radius: 5px;
      background: rgba(99, 102, 241, 0.1);
      color: var(--text-secondary);
      cursor: pointer;
      border: 1px solid transparent;
      svg {
        margin-right: 10px;
      }
      &:hover {
        transform: translateY(-2px);
        transition: all 0.3s ease;
        border: 1px solid var(--botton-backcolor);
      }
    }
    .is-active {
      background: var(--botton-backcolor);
      color: #fff;
    }
  }
  .categories {
    margin-top: 20px;
    .tag-title {
      font-size: 30px;
      display: flex;
      align-items: center;
      color: var(--title-color);
      position: relative;
      padding: 10px 0;
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
        color: var(--text-secondary);
        font-size: 22px;
        display: flex;
        align-items: center;
        gap: 32px;
        padding: 10px 12px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        &:hover {
          background-color: var(--bordder-color);
          color: #6366f1;
          transform: translateY(-3px);
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
