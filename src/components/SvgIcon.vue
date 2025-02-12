<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: '',
  },
  mr: {
    type: Number,
    default: 0,
  },
})

const iconName = computed(() => `#icon-${props.name}`)
const mr = computed(() => `#icon-${props.mr}`)
const svgClass = computed(() => {
  if (props.name) {
    return `svg-icon icon-${props.name}`
  }
  return 'svg-icon'
})
</script>
<template>
  <svg :class="svgClass" aria-hidden="true" :style="{ marginRight: `${mr}px` }">
    <use :xlink:href="iconName" />
  </svg>
</template>

<style lang="less">
.svg-icon {
  width: 1em;
  height: 1em;
  fill: currentColor;
  vertical-align: middle;
}
</style>
