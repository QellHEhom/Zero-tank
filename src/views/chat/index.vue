<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { getRecords } from '@/api/chat'

// 滚动
const messageContainer = ref(null)
// 是否连接成功
const succeed = ref(false)

// 输入的消息
const messageText = ref('')
// websocket 实例
const socket = ref()
// 数据
const messages = ref([])
// 心跳计时器
let heartbeatTimer = null
// 心跳间隔
const heartbeatInterval = 5000 //30000
// 是否需要重连
const shouldReconnect = true
// 重连次数
let reconnectAttempts = 0
// 最大重连次数
const maxreconnectAttempts = 5
// getRecords
const Records = async () => {
  const records = (await getRecords()).data
  messages.value = records
  nextTick(() => {
    scrollToBottom()
  })
}
// 连接 websocket
const connectWebsokect = () => {
  socket.value = new WebSocket('wss://localhost:3030/server/ws')
  socket.value.onopen = () => {
    reconnectAttempts = 0
    succeed.value = true
    // 开始心跳
    startHeartbeat()
  }
  // 接收消息
  socket.value.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)
      if (data.type === 'pong') {
        return
      }
      // const content = JSON.parse(event.data)
      messages.value.push(data)
    } catch (error) {
      console.log(error)
    }
  }

  socket.value.onclose = () => {
    console.log('WebSocket 已断开')
    succeed.value = false
    reconnect() // 尝试重连
    stopHeartbeat() // 停止心跳
  }

  socket.value.onerror = (error) => {
    console.error('WebSocket 错误:', error)
    stopHeartbeat() // 停止心跳
  }
}

// 发送消息的函数
const sendMessage = async () => {
  if (!messageText.value.trim()) return
  if (socket.value && socket.value.readyState === WebSocket.OPEN) {
    const message = {
      userId: 1,
      type: 'text',
      content: messageText.value.trim(),
      name: '作者',
      avatar: 'https://localhost:3030/server/user/user_1738806936454.webp',
    }
    messages.value.push(message)
    // 发送 JSON 格式数据
    const JSONData = JSON.stringify(message)
    socket.value.send(JSONData)
    messageText.value = ''
    // await sendMsg(message)
    nextTick(() => {
      scrollToBottom()
    })
  } else {
    console.error('WebSocket 未连接，无法发送消息')
  }
}
// 心跳
const startHeartbeat = () => {
  stopHeartbeat()
  heartbeatTimer = setInterval(() => {
    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
      socket.value.send(
        JSON.stringify({
          type: 'ping',
          timestamp: new Date().getTime(),
        }),
      )
    } else {
      stopHeartbeat()
      reconnect()
      // 重连
    }
  }, heartbeatInterval)
}

// 停止心跳
const stopHeartbeat = () => {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer)
    heartbeatTimer = null
  }
}

// 重连
const reconnect = () => {
  // 如果不需要重连，直接返回
  if (!shouldReconnect) {
    return
  }
  if (reconnectAttempts >= maxReconnectAttempts) {
    console.log('达到最大重连次数，停止重连')
    // this.$message.error('网络连接异常，请刷新页面重试')
    return
  }
  reconnectAttempts++
  console.log(`第 ${reconnectAttempts} 次尝试重连...`)
  // 使用指数退避算法计算重连延迟
  const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000)
  setTimeout(() => {
    // 再次检查是否需要重连
    if (shouldReconnect && this.$store.state.userInfo) {
      connectWebsokect()
    }
  }, delay)
}

// 滚动到底部
const scrollToBottom = async () => {
  const container = messageContainer.value
  if (container) {
    console.log(container)
    // container.scrollTop = container.scrollHeight
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' })
  }
}
onMounted(() => {
  connectWebsokect()
  Records()
})

onBeforeUnmount(() => {
  // 清理心跳定时器
  stopHeartbeat()
  // 关闭websocket
  socket.value.close()
})

const aaa = () => {
  console.log(messageContainer.value.scrollTop)
}
</script>

<template>
  <div class="chat-container">
    <div class="chat-main">
      <div class="chat-header">
        <div class="user-info">
          <h3>聊天室</h3>
          <span class="status-text" :class="succeed && 'succeed'">在线</span>
        </div>
      </div>
      <div class="messages" ref="messageContainer" @scroll="aaa">
        <div
          class="message"
          v-for="msg in messages"
          :key="msg.id"
          :class="msg.userId === 1 && 'message-self'"
        >
          <div class="message-content">
            <div class="avatar">
              <img :src="msg.avatar" alt="avatar" />
            </div>
            <div class="message-header">
              <div class="sender-name">
                {{ msg.name }}
                <span class="author-tag" v-if="msg.userId === 1">作者</span>
              </div>
              <div class="message-text">{{ msg.content }}</div>
              <div class="message-time">3天前</div>
            </div>
          </div>
        </div>
      </div>

      <div class="chat-input">
        <!-- <div class="input-toolbar">
          <mj-emoji size="1.1rem" class="emoji-picker" />

          <label class="toolbar-btn" for="image-upload">
            <i class="fas fa-image"></i>
          </label>
          <input id="image-upload" type="file" accept="image/*" style="display: none" />
        </div> -->

        <textarea
          ref="messageTextarea"
          v-model="messageText"
          @keyup.enter.prevent="sendMessage"
          @input="handleInput"
          @keydown="handleMentionKeydown"
          placeholder="输入消息..."
        ></textarea>

        <button @click="sendMessage">
          <!-- <template> countdown </template> -->
          <svg-icon name="send" />
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.chat-container {
  max-width: 900px;
  margin: 0 auto;
  height: calc(100vh - 140px);
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.chat-header {
  padding: 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);

  h3 {
    font-size: 1.5em;
    margin: 0;
  }
}
.chat-main {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  overflow: hidden;

  .chat-header {
    height: 70px;
    flex: none;
    background: var(--card-bg);
    z-index: 10;
    .user-info {
      display: flex;
      align-items: center;
      gap: 16px;

      .status-text {
        color: var(--text-secondary);
        font-size: 0.9em;
      }
      .succeed {
        color: #32c206cf;
      }
    }
  }
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  padding-bottom: 120px;
  display: flex;
  flex-direction: column;
  .message {
    .message-content {
      display: flex;
      gap: 16px;
      margin: 16px 0;
      .avatar {
        width: 40px;
        height: 40px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }
      }
      .message-header {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .sender-name {
        display: flex;
        align-items: center;
        font-size: 1em;
        margin-bottom: 2px;
      }
    }
    .message-system {
      text-align: center;
      padding: 12px;
    }
  }
}

// 作者
.message-self {
  .message-content {
    flex-direction: row-reverse;
    align-items: flex-end;
    display: flex;
    align-items: start;
    .message-text {
      background: #409eff;
      color: white;
      border-radius: 16px 16px 4px 16px;
      max-width: 700px;
    }

    .sender-name {
      display: flex;
      text-align: right;
      gap: 4px;
      flex-direction: row-reverse;
    }
    .message-time {
      text-align: right;
    }
  }
}

.chat-input {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  background: #ffffff;
  display: flex;
  gap: 16px;
  z-index: 10;

  textarea {
    flex: 1;
    border-radius: 8px;
    padding: 16px;
    resize: none;
    height: 60px;
    &:focus {
      outline: none;
      border-color: #409eff;
    }
  }

  button {
    width: 60px;
    border: none;
    border-radius: 8px;
    background: #409eff;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 1em;

    &:hover:not(:disabled) {
      background: darken(#409eff, 10%);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}

.message-text {
  background: rgba(64, 158, 255, 0.1);
  padding: 16px 24px;
  border-radius: 16px 16px 16px 4px;
  color: #1f2937;
  max-width: 700px;
}

.message-time {
  font-size: 0.8em;
  color: var(--text-secondary);
}

.author-tag {
  background: #409eff;
  color: white;
  font-size: 12px;
  padding: 1px 6px;
  border-radius: 4px;
  margin-left: 4px;
}

// 对于自己发送的消息，修改@样式的颜色
.message-self {
  .message-text {
    :deep(mention) {
      color: white;
      font-weight: 600;
    }
  }
}
</style>
