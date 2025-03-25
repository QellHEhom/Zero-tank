<script setup>
import { ArrowUpBold } from '@element-plus/icons-vue'
import AiChat from '@/components/AI/index.vue'
import { computed, ref } from 'vue'

let showBtn = ref(false)
// 滚动条的滚动距离，就是滚动条距离容器顶部的距离
let scrollTop = ref(null)
// 元素的可视高度
let clientHeight = ref(document.documentElement.clientHeight)
// 容器实际内容的高度，包括超出视窗的部分
let scrollHeight = ref(null)

// 滑动百分比
let scrollPercent = computed(() => {
  return Math.round((scrollTop.value / (scrollHeight.value - clientHeight.value)) * 100) + '%'
})

const showtopback = ref(true)
window.addEventListener('scroll', () => {
  scrollTop.value = document.documentElement.scrollTop
  scrollHeight.value = document.documentElement.scrollHeight
  showBtn.value = scrollTop.value > 50
})
const BacktoTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
const theme = ref('light')
// 黑白切换
const addblack = () => {
  const htmlElement = document.documentElement
  const currentTheme = htmlElement.getAttribute('data-theme')

  if (currentTheme === 'light') {
    htmlElement.setAttribute('data-theme', 'dark')
    theme.value = 'dark'
  } else {
    htmlElement.setAttribute('data-theme', 'light')
    theme.value = 'light'
  }
}

const chat = ref(false)
</script>

<template>
  <div class="tools">
    <div class="tools-content">
      <el-tooltip class="box-item" effect="dark" content="AI" placement="left">
        <div @click="chat = !chat">
          <svg-icon name="ai" style="font-size: 20px" />
        </div>
        <!-- <el-icon><ArrowUpBold /></el-icon> -->
      </el-tooltip>
      <!-- 网页变黑 -->
      <el-tooltip class="box-item" effect="dark" content="切换主题" placement="left">
        <div @click="addblack">
          <svg-icon :name="`${theme === 'light' ? 'dark' : 'light'}`" style="font-size: 20px" />
        </div>
        <!-- <el-icon><ArrowUpBold /></el-icon> -->
      </el-tooltip>

      <!-- 回到顶部 -->
      <el-tooltip class="box-item" effect="dark" content="回到顶部" placement="left">
        <div
          :class="`backtop ${showBtn ? 'is-active' : ''}`"
          @mouseover="showtopback = !showtopback"
          @mouseout="showtopback = !showtopback"
          @click="BacktoTop"
        >
          <div v-if="showtopback" class="backtop-content">{{ scrollPercent }}</div>
          <el-icon style="" size="20" v-else><ArrowUpBold /></el-icon>
        </div>
        <!-- <el-icon><ArrowUpBold /></el-icon> -->
      </el-tooltip>
    </div>
  </div>
  <AiChat v-if="chat" @openchat="chat = !chat" />
</template>

<style scoped lang="less">
.tools {
  position: fixed;
  bottom: 90px;
  right: 17px;
  color: #fff;
  text-align: center;
  .tools-content {
    position: relative;
    div {
      background-color: var(--botton-backcolor);
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      margin: 10px 0;
      position: relative;
      z-index: 2;
      div,
      i {
        pointer-events: none;
      }
      &:hover {
        cursor: pointer;
      }
    }
    .backtop {
      z-index: 1;
      opacity: 0;
      transition: all 0.3s ease-in-out;
      transform: translateY(-50px);
    }
    .is-active {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
</style>
