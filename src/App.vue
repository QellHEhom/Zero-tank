<script setup>
import ViewIndex from './views/index.vue'
import { RouterView } from 'vue-router'
import TopHeader from '@/components/immobilization/TopHeader/index.vue'
import FooterBotton from '@/components/immobilization/FooterBotton/index.vue'
import RightTools from '@/components/tools/RightTools.vue'
</script>

<template>
  <top-header />
  <!-- <footer-botton /> -->
  <RightTools />
  <div class="main-container">
    <main class="main-content">
      <ViewIndex />
    </main>
  </div>
</template>

<style scoped lang="less">
.main-container {
  margin: 0;
  padding: 0;
  font-family: font;
  box-sizing: border-box;
  padding-top: 70px;
  .main-content {
    width: 100%;
    min-height: 1000px;
  }
}

:deep(.el-card) {
  border: none;
  .el-card__body {
    padding: 0;
  }
}
</style>
