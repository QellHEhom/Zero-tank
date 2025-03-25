<script setup>
import { BellFilled, Search } from '@element-plus/icons-vue'
import { ref, watch, computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { routerList } from '@/routes/index'
import search from '@/components/search/index.vue'
// 搜索
let inputText = ref('')
// 路由
const route = useRoute()
const router = useRouter()
const currentPath = ref(route.path)

watch(
  () => route.path,
  (newPath) => {
    currentPath.value = newPath
  },
)
// 警铃
const handleCommand = (command) => {
  console.log(command)
}

const navTable = computed(() => {
  const arr = []
  routerList.forEach((item) => {
    if (!item.meta || !item.meta.nav) return
    if (item.name === 'home') {
      arr.push({
        label: item.meta.label,
        path: '/',
        icon: item.meta.icon,
      })
      return
    }
    arr.push({
      label: item.meta.label,
      path: item.path,
      icon: item.meta.icon,
    })
  })
  return arr
})

const showSearch = ref(false)
</script>

<template>
  <header>
    <div class="header">
      <div class="header-left">
        <el-image
          style="width: 133px; height: 60px"
          src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
          fit="cover"
        />
        <div class="headerLft-nav">
          <div
            v-for="item in navTable"
            :key="item.label"
            @click="router.push({ path: item.path, replace: true })"
            :class="{ active: item.path === currentPath }"
          >
            <svg-icon :name="item.icon"></svg-icon>
            <span>{{ item.label }}</span>
          </div>
        </div>
      </div>
      <div class="header-right">
        <div class="top-search">
          <el-button
            style="height: 35px; margin-right: 20px; border-radius: 20px"
            :icon="Search"
            @click="showSearch = true"
            >搜索文章</el-button
          >
        </div>
        <!-- <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            <el-icon><BellFilled /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="a">Action 1</el-dropdown-item>
              <el-dropdown-item command="b">Action 2</el-dropdown-item>
              <el-dropdown-item command="c">Action 3</el-dropdown-item>
              <el-dropdown-item command="d" disabled>Action 4</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown> -->
        <img
          src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
          @click="router.push('/login')"
        />
      </div>
    </div>
  </header>
  <search v-if="showSearch" @openSearch="showSearch = !showSearch" />
</template>

<style scoped lang="less">
header {
  width: 100%;
  height: 60px;
  background-image: var(--header-back-color);
  box-shadow: 2px 2px 20px 2px var(--box-shadow);
  position: fixed;
  z-index: 100;
  opacity: 0.9;
  top: 0;
  .header {
    width: 1500px;
    margin: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .header-left {
      display: flex;
      justify-content: start;
      align-items: center;
      .headerLft-nav {
        display: flex;
        margin-left: 30px;
        font-size: 19px;
        div {
          height: 40px;
          padding: 0 15px;
          border: none;
          color: var(--text-color3);
          display: inline-block;
          vertical-align: baseline;
          &:hover {
            color: var(--hover-color);
            cursor: pointer;
          }
          span {
            margin-left: 5px;
            line-height: 40px;
          }
        }
        svg {
          display: inline-block;
          vertical-align: baseline;
        }
      }
    }
    .header-right {
      display: flex;
      justify-content: start;
      align-items: center;
      margin-right: 100px;
      .el-dropdown {
        font-size: 20px;
        margin-right: 25px;
        color: var(--text-select-color);
        cursor: pointer;
      }
      img {
        border-radius: 50%;
        width: 45px;
        height: 45px;
      }
    }
  }
  // margin-bottom: 20px;
}
.active {
  color: var(--hover-color) !important;
}
#app > header > div > div.header-right > div.el-dropdown > div > button:nth-child(1) {
  display: none;
}
</style>
