<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const slices = ref([]) // 切片 URL 列表
const canvasWidth = ref(0)
const canvasHeight = ref(0)
const progress = ref(0) // 加载进度
const socket = ref(null) // WebSocket 连接
const canvas = ref(null)

const initWebSocket = () => {
  socket.value = new WebSocket('ws://localhost:8080')

  // 接收服务端消息
  socket.value.onmessage = (event) => {
    const data = JSON.parse(event.data)
    if (data.type === 'progress') {
      progress.value = data.progress // 更新加载进度
    } else if (data.type === 'done') {
      console.log(data.message) // 打印完成消息
    }
  }
}

const drawSlices = async (sliceWidth, sliceHeight) => {
  const ctx = canvas.value.getContext('2d')

  for (let i = 0; i < slices.value.length; i++) {
    const img = new Image()
    img.src = slices.value[i]

    await new Promise((resolve) => {
      img.onload = () => {
        const x = (i % (canvasWidth.value / sliceWidth)) * sliceWidth
        const y = Math.floor(i / (canvasWidth.value / sliceWidth)) * sliceHeight
        ctx.drawImage(img, x, y, sliceWidth, sliceHeight)
        resolve()
      }
    })
  }
}

onMounted(async () => {
  // 初始化 WebSocket
  initWebSocket()

  // 获取切片列表
  const { data } = await axios.get('https://localhost:3000/slices')
  slices.value = data

  // 设置画布大小（假设切片为 100x100 像素，正方形拼接）
  const sliceSize = 100
  const rows = Math.sqrt(slices.value.length)
  canvasWidth.value = sliceSize * rows
  canvasHeight.value = sliceSize * rows

  // 绘制切片
  drawSlices(sliceSize, sliceSize)
})
</script>

<template>
  <div>
    <canvas
      ref="canvas"
      :width="canvasWidth"
      :height="canvasHeight"
      style="border: 1px solid #000"
    ></canvas>
    <p>加载进度：{{ progress }}%</p>
  </div>
</template>
