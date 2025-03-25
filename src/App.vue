<script setup>
import ViewIndex from './views/index.vue'
import { RouterView } from 'vue-router'
import TopHeader from '@/components/immobilization/TopHeader/index.vue'
import FooterBotton from '@/components/immobilization/FooterBotton/index.vue'
import RightTools from '@/components/tools/Rigth/index.vue'
import TreeNode from './TreeNode.vue'

// const treeData = {
//   id: 1,
//   label: 'Root',
//   children: [
//     {
//       id: 2,
//       label: 'Child 1',
//       children: [],
//     },
//     {
//       id: 3,
//       label: 'Child 2',
//       children: [
//         {
//           id: 4,
//           label: 'Grandchild',
//           children: [
//             {
//               id: 5,
//               label: 'Grandchild',
//               children: [],
//             },
//           ],
//         },
//       ],
//     },
//   ],
// }
</script>

<template>
  <!-- <TreeNode :node="treeData" /> -->
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
    min-height: 900px;
  }
}

:deep(.el-card) {
  border: none;
  .el-card__body {
    padding: 0;
  }
}
</style>
