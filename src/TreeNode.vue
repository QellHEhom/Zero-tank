<script setup>
import { computed } from 'vue'
const props = defineProps({
  node: {
    type: Object,
    required: true,
  },
})
const hasChildren = computed(() => {
  return props.node.children && props.node.children.length > 0
})
</script>

<template>
  <div class="tree-node">
    <!-- 当前节点内容 -->
    <div>{{ node.label }}</div>
    <!-- 递归子节点 -->
    <div v-if="hasChildren" class="children">
      <TreeNode v-for="child in node.children" :key="child.id" :node="child" />
    </div>
  </div>
</template>

<style scoped lang="less"></style>
