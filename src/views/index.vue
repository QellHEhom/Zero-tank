<script setup lang="ts">
import { ref } from 'vue'

// 数据类型：Map<string[], number>
let map503: Map<string[], number> = new Map()
// 数据类型：string[]
let arr504 = ['a', 'b', 'c']
map503.set(arr504, 1)
console.log(map503.get(arr504))
</script>

<template>
  <div class="main-content">
    <router-view v-slot="{ Component }">
      <transition name="scale" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style scoped lang="less">
.main-content {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

.scale-enter-active,
.scale-leave-active {
  transition: all 0.3s ease;
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
