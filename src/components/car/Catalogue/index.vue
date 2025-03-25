<script setup>
import { computed, nextTick, onMounted } from 'vue'
const { tocItems } = defineProps({ tocItems: Array })
const handleChange = (href) => {
  // console.log(`catalogue change: ${href}`)
  console.log(href)
}

// const scrollToHeading = (id) => {
//   const element = document.getElementById(id)
//   if (element) {
//     const header = document.querySelector('.site-header')
//     const headerHeight = header ? header.offsetHeight : 0
//     const targetPosition = element.offsetTop - headerHeight - 20
//     window.scrollTo({
//       top: targetPosition,
//       behavior: 'smooth',
//     })
//   }
// }
</script>

<template>
  <el-card class="Catalogue">
    <div>
      <div class="Catalogue-title">
        <svg-icon name="catalogue"></svg-icon>
        <span>文章目录</span>
      </div>
      <el-anchor :offset="80" @click="handleChange">
        <el-anchor-link v-for="item in tocItems" :key="item.id" :href="`#${item.id}`">
          {{ item.text }}
        </el-anchor-link>
      </el-anchor>
    </div>
  </el-card>
</template>

<style scoped lang="less">
.Catalogue {
  font-size: 20px;
  border-radius: 10px;
  .Catalogue-title {
    width: 100%;
    height: 68px;
    padding: 20px;
    display: flex;
    align-items: center;
    span {
      margin-left: 10px;
      color: var(--text-secondary);
    }
    svg {
      color: #409eff;
    }
    background-color: var(--catalogue-backcolor);
  }
  :deep(.el-anchor__marker) {
    height: 27px;
  }
  :deep(.el-anchor__list) {
    padding: 10px 20px;
    background-color: var(--box-backgrd-color);
    a {
      font-size: 20px;
      margin: 3px 10px;
      display: block;
      padding: 6px 12px;
      padding-left: 40px;
      border-radius: 10px;
      &:hover {
        color: #409eff;
        background-color: var(--catalogue-backcolor);
      }
    }
    .is-active {
      background-color: var(--catalogue-backcolor);
    }
  }
}
</style>
