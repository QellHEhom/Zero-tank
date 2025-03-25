<script setup>
import { ref, onMounted } from 'vue'
const props = defineProps({
  width: { type: String, default: '500px' },
  height: { type: String, default: '500px' },
  Data: { type: Array, default: [] },
})
// 获取 canvas
const canvas = ref(null)

const { Data } = props
/**
 * 根据图片 URL 从文件名中解析出坐标。
 * 这里使用正则匹配形如 -x_y. 的模式
 */
function parseCoordinates(url) {
  // 匹配 -数字_数字.（注意：\d+ 表示一个或多个数字）
  const regex = /-(\d+)_(\d+)\./
  const match = url.match(regex)
  if (match) {
    return {
      x: parseInt(match[1], 10),
      y: parseInt(match[2], 10),
    }
  }
  // 默认返回 (0,0)
  return { x: 0, y: 0 }
}

onMounted(() => {
  let maxRight = 920 // 最大 x + width
  let maxBottom = 380 // 最大 y + height
  for (let i = 0; i < Data.length; i++) {
    const img = new Image()
    img.src = Data[i]
    const { x, y } = parseCoordinates(Data[i])
    const right = x + img.width
    const bottom = y + img.height
    // if (right > maxRight) maxRight = right
    // if (bottom > maxBottom) maxBottom = bottom
    canvas.value.width = maxRight
    canvas.value.height = maxBottom
    const ctx = canvas.value.getContext('2d')
    new Promise((resolve) => {
      img.onload = () => {
        ctx.drawImage(img, x, y)
        resolve()
      }
    })
  }
})
</script>
<template>
  <div>
    <canvas ref="canvas"></canvas>
  </div>
</template>
