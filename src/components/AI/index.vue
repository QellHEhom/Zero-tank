<script setup>
import { reactive, ref, onMounted } from 'vue'
// const inpValue = ref('Please write me a story')
const inpValue = ref('hello?')
// const APIPassword = 'Bearer UcYnCAbFfcztSsIgpLYB:QMSYeomKHohpGtfEjSXU' // 2
// const url = 'https://spark-api-open.xf-yun.com/v1/chat/completions'

const records = reactive({
  id: 9001,
  content: [],
})

const emit = defineEmits(['openchat'])

const scrollContainer = ref(null)

function add(data) {
  const currentDelayBase = cumulativeDelay // 当前调用的基准延时
  for (let i in data) {
    const delay = currentDelayBase + i * 1000 // 每个元素的延时 = 基准延时 + 索引 * 1秒
    setTimeout(() => {
      content += data[i]
    }, delay)
  }
  // 更新全局累计延时：当前基准延时 + 最后一个元素的延时（索引为 data.length - 1）
  cumulativeDelay = currentDelayBase + (data.length - 1) * 1000
}
const handleEnter = async (event) => {
  event.preventDefault()
  records.content.push({ role: 'user', content: inpValue.value.trim() })
  records.content.push({ role: 'assistant', content: '' })
  const value = inpValue.value.trim()
  inpValue.value = ''
  const response = await fetch('https://localhost:3030/server/api/Ai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content: value }),
  })

  const reader = response.body.getReader() // 开启读取流
  const textDecoder = new TextDecoder() // 创建解码器

  // 全局累计延时
  let cumulativeDelay = 0
  while (true) {
    // 进行读取数据
    const { done, value } = await reader.read() // done: 是否读取完成  value: 每次读取到的数据  -----迭代器

    // value在这里的是 类型化数组
    if (done) {
      break
    }
    const str = JSON.parse(textDecoder.decode(value).split('data:')[1].trim())
    const content = str.choices[0].delta.content
    console.log(content)

    const currentDelayBase = cumulativeDelay // 当前调用的基准延时
    for (let i in content) {
      const delay = currentDelayBase + i * 50 // 每个元素的延时 = 基准延时 + 索引 * 1秒
      setTimeout(() => {
        records.content[records.content.length - 1].content += content[i]
      }, delay)
    }
    // 更新全局累计延时：当前基准延时 + 最后一个元素的延时（索引为 data.length - 1）
    cumulativeDelay = currentDelayBase + (content.length - 1) * 50
  }
}

const showChat = (event) => {
  event.stopPropagation() // 阻止冒泡
  emit('openchat')
}
onMounted(() => {
  // 等待组件加载完成后滚动到底部
  if (scrollContainer.value[0]) {
    scrollContainer.value[0].scrollTo({
      top: scrollContainer.value[0].scrollHeight,
      behavior: 'smooth', // 平滑滚动
    })
  }
})
</script>
<template>
  <div class="BackDrop" @click="showChat"></div>
  <div class="Ai-box">
    <div class="box-content">
      <div class="content-chat" ref="scrollContainer">
        <div class="content-item" v-for="items in records.content" :key="items.content">
          <div class="user-item" v-if="items.role === 'user'">
            <span class="userquestion">{{ items.content }}</span>
            <el-avatar :size="50" src="src/assets/images/1.jpg" />
          </div>
          <div class="chat-item" v-else="items.role === 'assistant'">
            <svg-icon name="ai"></svg-icon>
            <span>{{ items.content }}</span>
          </div>
        </div>
      </div>
      <div class="content-btm">
        <el-input
          v-model="inpValue"
          class="userInput"
          @keydown.enter="handleEnter"
          autosize
          type="textarea"
          placeholder="Please input"
          resize="none"
        />
      </div>
    </div>
  </div>
</template>

<style lang="less">
.BackDrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  z-index: 100;
}
.Ai-box {
  width: 40%;
  height: 85%;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #ffffff;
  border-radius: 20px;
  padding: 30px;
  z-index: 1000;
  .box-content {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    border-radius: 10px;
    .content-chat {
      padding: 10px;
      font-size: 20px;
      height: 580px;
      white-space: normal; /* 允许换行 */
      word-break: break-word; /*支持长单词换行 */
      word-wrap: break-word; /* 在必要时强制换行 */
      overflow: auto;
      &::-webkit-scrollbar {
        width: 5px;
        height: 2px;
      }
      .content-item {
        width: 100%;
        .user-item {
          display: flex;
          justify-content: right;
          .userquestion {
            max-width: 538px;
            padding: 10px;
            margin-right: 10px;
            background-color: #f4f4f4;
            border-radius: 15px;
          }
        }
        .chat-item {
          display: flex;
          svg {
            margin-top: 10px;
            margin-right: 10px;
            font-size: 33px;
          }
          span {
            width: 100%;
            padding: 10px;
            border-radius: 10px;
          }
        }
      }
      div {
        margin-bottom: 10px;
      }
    }
    .content-btm {
      .el-textarea__inner {
        width: 100% !important;
        height: 100% !important;
        border-radius: 20px;
        border: 0;
        background-color: #f4f4f4;
        padding: 20px;
        outline: none;
        overflow-y: scroll;
        text-align: left;
        font-size: 20px;
      }
    }
  }
}
</style>
