<script setup>
import { View, ChatDotRound, Calendar } from '@element-plus/icons-vue'
import { reactive, ref, onMounted, watch } from 'vue'
import Catalogue from '@/components/car/Catalogue/index.vue'
import { useRoute } from 'vue-router'
import { getArticle } from '@/api/article'
// 高亮
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'

//
import { useWebDataStore } from '@/stores/index'
import { storeToRefs } from 'pinia'
const Store = useWebDataStore()
// 路由参数
const route = useRoute()
const id = ref(route.params.id)

// 监听路由参数变化
watch(
  () => route.params.id,
  (newId) => {
    id.value = newId
    getArticleMsg()
  },
)
// 文章数据
const ArticlesData = ref('')
// 获取文章数据
const getArticleMsg = async () => {
  const data = await getArticle(id.value)
  ArticlesData.value = data.data[0]
}

// 发表评论内容
let articleInput = ref('')
// 显示回复按钮
let replybtnShow = ref(false)
// 回复框显示
let replyInputShow = ref(null)
// 按钮操作
let replyInputbtn = (id) => {
  if (!replyInputShow.value) {
    replyInputShow.value = id
  } else if (!(replyInputShow.value === id)) {
    replyInputShow.value = id
  } else {
    replyInputShow.value = null
  }
}
// 回复框内容
let replyInputData = ref('')
// 目录
const tocItems = ref([])
// webConfig
const { webConfig } = storeToRefs(Store)
// 生成目录
const generateToc = () => {
  const headings = document.querySelectorAll(
    '.article-content h1,.article-content h2,.article-content h3,.article-content h4,.article-content h5,.article-content h6',
  )
  tocItems.value = Array.from(headings).map((heading, index) => {
    const id = `heading-${index}`
    heading.id = id
    return {
      id,
      text: heading.textContent,
      level: parseInt(heading.tagName.charAt(1)),
    }
  })
}
// 复制代码块
const addCopyButtons = () => {
  const codeBlocks = document.querySelectorAll('.article-content pre')
  if (!codeBlocks.length) return

  codeBlocks.forEach((pre) => {
    // 检查是否已经添加过复制按钮
    if (pre.querySelector('.code-header')) return

    // 创建复制按钮容器
    const buttonWrapper = document.createElement('div')
    buttonWrapper.className = 'code-header'

    // 创建复制按钮
    const copyButton = document.createElement('button')
    copyButton.className = 'copy-button'
    copyButton.innerHTML = '<i class="fas fa-copy"></i> 复制'
    copyButton.title = '复制代码'

    // 添加点击事件
    copyButton.addEventListener('click', async () => {
      try {
        const code = pre.querySelector('code')
        await navigator.clipboard.writeText(code.textContent)
        copyButton.innerHTML = '<i class="fas fa-check"></i> 已复制'
        copyButton.classList.add('copied')
        setTimeout(() => {
          copyButton.innerHTML = '<i class="fas fa-copy"></i> 复制'
          copyButton.classList.remove('copied')
        }, 2000)
        // this.$message.success('复制成功')
      } catch (err) {
        // this.$message.error('复制失败，请手动复制')
      }
    })

    // 将按钮添加到代码块
    buttonWrapper.appendChild(copyButton)
    pre.appendChild(buttonWrapper)
  })
}
// 添加行号
const addLineNumbers = () => {
  const codeBlocks = document.querySelectorAll('.article-content pre code')
  codeBlocks.forEach((code) => {
    const pre = code.parentElement
    // 检查是否已添加行号
    if (!pre.querySelector('.line-numbers')) {
      const lines = code.textContent.split('\n').length
      const lineNumbers = document.createElement('div')
      lineNumbers.className = 'line-numbers'
      for (let i = 1; i <= lines; i++) {
        const span = document.createElement('span')
        span.textContent = i
        lineNumbers.appendChild(span)
      }
      pre.insertBefore(lineNumbers, code)
    }
  })
}

// hljs
const hljsStyle = () => {
  document.querySelectorAll('pre code').forEach((block) => {
    hljs.highlightElement(block)
  })
  hljs.configure({
    ignoreUnescapedHTML: true,
  })
}
onMounted(async () => {
  await getArticleMsg()
  generateToc()
  addCopyButtons()
  addLineNumbers()
  hljsStyle()
  console.log(webConfig.value)
})
</script>

<template>
  <div class="content-layout">
    <main class="article-main-content">
      <header>
        <h1 class="article-title">
          {{ ArticlesData.title }}
        </h1>
        <div class="article-bloggerdata">
          <el-avatar :size="50" :src="webConfig.avatar" />
          <div class="bloggerdata-content">
            <div class="bloggerdata-name">{{ webConfig.name }}</div>
            <div class="bloggerdata-msg">
              <div class="bloggerdata-msgitem">
                <el-icon><Calendar /></el-icon><span>{{ ArticlesData.create_time }}</span>
              </div>
              <div class="bloggerdata-msgitem">
                <el-icon><View /></el-icon><span>阅读{{ ArticlesData.quantity }}</span>
              </div>
              <div class="bloggerdata-msgitem">
                <el-icon><ChatDotRound /></el-icon><span>评论{{ ArticlesData.commentnum }}</span>
              </div>
              <div class="bloggerdata-msgitem">
                <svg-icon name="like"></svg-icon><span>点赞{{ ArticlesData.recommend }}</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      <el-divider />
      <!-- 渲染文章 -->
      <article v-html="ArticlesData.contents" class="article-content"></article>
      <!-- 文章标签 -->
      <footer>
        <div class="artcle-classification">
          <el-tooltip
            v-for="(nac, index) in ArticlesData.tag"
            class="box-item"
            effect="dark"
            :content="nac"
            placement="top"
            :key="nac"
          >
            <el-tag
              size="large"
              :type="index % 2 === 0 ? 'warning' : 'primary'"
              @click="atgtap(nac)"
            >
              {{ nac }}
            </el-tag>
          </el-tooltip>
        </div>
        <!-- <div class="article-comment">
        <svg-icon name="message" style="width: 20px; height: 20px"></svg-icon>
        <span class="comment-title">评论</span>
      </div> -->
        <!-- <div class="article-text">
        <el-avatar
          :size="40"
          src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
        />
        <div class="text-box">
          <el-input
            v-model="articleInput"
            type="textarea"
            style="height: 142px; border: none"
            placeholder="说点什么呢"
            :rows="5"
            class="inputDeep"
          />
          <div class="text-btn">
            <el-button type="primary" size="default">发表评论</el-button>
          </div>
        </div>
      </div> -->
        <!--
      <div id="commentwrap" class="commentwrap">
        <div style="font-size: 23px; margin: 20px 0">全部评论 (0)</div>
        <div class="comment-wrp">
          <li class="comment-item">
            <div class="li-item">
              <div
                class="item-box"
                @mouseenter="replybtnShow = 1"
                @mouseleave="replybtnShow = null"
              >
                <div class="commeta-box">
                  <el-avatar :size="40" :src="circleUrl" />
                  <div class="comment">
                    <div class="comment-name">无聊</div>
                    <div class="comment-time">2021-06-07</div>
                  </div>
                  <div
                    class="comment-reply"
                    v-if="replybtnShow == 1 ? true : false"
                    @click="replyInputbtn(1)"
                  >
                    回复
                  </div>
                </div>
                <div class="comment-content">
                  <p>adasdasdasd</p>
                </div>
                <div class="comment-main" v-if="replyInputShow == 1 ? true : false">
                  <el-avatar :size="40" :src="circleUrl" />
                  <div class="text-box">
                    <el-input
                      v-model="replyInputData"
                      type="textarea"
                      style="height: 142px; border: none"
                      placeholder="说点什么呢"
                      :rows="5"
                      class="inputDeep"
                    />
                    <div class="text-btn">
                      <el-button type="info" size="default" @click="replyInputbtn(1)"
                        >取消</el-button
                      >
                      <el-button type="primary" size="default">提交</el-button>
                    </div>
                  </div>
                </div>
              </div>
              <ul>
                <li>
                  <div
                    class="li-item"
                    @mouseenter="replybtnShow = 3"
                    @mouseleave="replybtnShow = null"
                  >
                    <div class="commeta-box">
                      <el-avatar :size="40" :src="circleUrl" />
                      <div class="comment">
                        <div class="comment-name">无聊</div>
                        <div class="comment-time">2021-06-07</div>
                      </div>
                      <div
                        class="comment-reply"
                        v-if="replybtnShow == 3 ? true : false"
                        @click="replyInputbtn(3)"
                      >
                        回复
                      </div>
                    </div>
                    <div class="comment-content">
                      <p class="mention">@啊是大飒飒</p>
                      <p>adasdasdasd</p>
                    </div>
                  </div>
                  <div class="comment-main" v-if="replyInputShow == 3 ? true : false">
                    <el-avatar :size="40" :src="circleUrl" />
                    <div class="text-box">
                      <el-input
                        v-model="replyInputData"
                        type="textarea"
                        style="height: 142px; border: none"
                        placeholder="说点什么呢"
                        :rows="5"
                        class="inputDeep"
                      />
                      <div class="text-btn">
                        <el-button type="info" size="default" @click="replyInputbtn(2)"
                          >取消</el-button
                        >
                        <el-button type="primary" size="default">提交</el-button>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div
                    class="li-item"
                    @mouseenter="replybtnShow = 2"
                    @mouseleave="replybtnShow = null"
                  >
                    <div class="commeta-box">
                      <el-avatar :size="40" :src="circleUrl" />
                      <div class="comment">
                        <div class="comment-name">无聊</div>
                        <div class="comment-time">2021-06-07</div>
                      </div>
                      <div
                        class="comment-reply"
                        v-if="replybtnShow == 2 ? true : false"
                        @click="replyInputbtn(2)"
                      >
                        回复
                      </div>
                    </div>
                    <div class="comment-content">
                      <p class="mention">@啊是大飒飒</p>
                      <p>adasdasdasd</p>
                    </div>
                  </div>
                  <div class="comment-main" v-if="replyInputShow == 2 ? true : false">
                    <el-avatar :size="40" :src="circleUrl" />
                    <div class="text-box">
                      <el-input
                        v-model="replyInputData"
                        type="textarea"
                        style="height: 142px; border: none"
                        placeholder="说点什么呢"
                        :rows="5"
                        class="inputDeep"
                      />
                      <div class="text-btn">
                        <el-button type="info" size="default" @click="replyInputbtn(2)"
                          >取消</el-button
                        >
                        <el-button type="primary" size="default">提交</el-button>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </li>
          <li class="comment-item">
            <div class="li-item">
              <div
                class="item-box"
                @mouseenter="replybtnShow = 1"
                @mouseleave="replybtnShow = null"
              >
                <div class="commeta-box">
                  <el-avatar :size="40" :src="circleUrl" />
                  <div class="comment">
                    <div class="comment-name">无聊</div>
                    <div class="comment-time">2021-06-07</div>
                  </div>
                  <div
                    class="comment-reply"
                    v-if="replybtnShow == 1 ? true : false"
                    @click="replyInputbtn(1)"
                  >
                    回复
                  </div>
                </div>
                <div class="comment-content">
                  <p>adasdasdasd</p>
                </div>
                <div class="comment-main" v-if="replyInputShow == 1 ? true : false">
                  <el-avatar :size="40" :src="circleUrl" />
                  <div class="text-box">
                    <el-input
                      v-model="replyInputData"
                      type="textarea"
                      style="height: 142px; border: none"
                      placeholder="说点什么呢"
                      :rows="5"
                      class="inputDeep"
                    />
                    <div class="text-btn">
                      <el-button type="info" size="default" @click="replyInputbtn(1)"
                        >取消</el-button
                      >
                      <el-button type="primary" size="default">提交</el-button>
                    </div>
                  </div>
                </div>
              </div>
              <ul>
                <li>
                  <div
                    class="li-item"
                    @mouseenter="replybtnShow = 3"
                    @mouseleave="replybtnShow = null"
                  >
                    <div class="commeta-box">
                      <el-avatar :size="40" :src="circleUrl" />
                      <div class="comment">
                        <div class="comment-name">无聊</div>
                        <div class="comment-time">2021-06-07</div>
                      </div>
                      <div
                        class="comment-reply"
                        v-if="replybtnShow == 3 ? true : false"
                        @click="replyInputbtn(3)"
                      >
                        回复
                      </div>
                    </div>
                    <div class="comment-content">
                      <p class="mention">@啊是大飒飒</p>
                      <p>adasdasdasd</p>
                    </div>
                  </div>
                  <div class="comment-main" v-if="replyInputShow == 3 ? true : false">

                    <el-avatar :size="40" :src="circleUrl" />
                    <div class="text-box">
                      <el-input
                        v-model="replyInputData"
                        type="textarea"
                        style="height: 142px; border: none"
                        placeholder="说点什么呢"
                        :rows="5"
                        class="inputDeep"
                      />
                      <div class="text-btn">
                        <el-button type="info" size="default" @click="replyInputbtn(2)"
                          >取消</el-button
                        >
                        <el-button type="primary" size="default">提交</el-button>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div
                    class="li-item"
                    @mouseenter="replybtnShow = 2"
                    @mouseleave="replybtnShow = null"
                  >
                    <div class="commeta-box">
                      <el-avatar :size="40" :src="circleUrl" />
                      <div class="comment">
                        <div class="comment-name">无聊</div>
                        <div class="comment-time">2021-06-07</div>
                      </div>
                      <div
                        class="comment-reply"
                        v-if="replybtnShow == 2 ? true : false"
                        @click="replyInputbtn(2)"
                      >
                        回复
                      </div>
                    </div>
                    <div class="comment-content">
                      <p class="mention">@啊是大飒飒</p>
                      <p>adasdasdasd</p>
                    </div>
                  </div>
                  <div class="comment-main" v-if="replyInputShow == 2 ? true : false">
                    <el-avatar :size="40" :src="circleUrl" />
                    <div class="text-box">
                      <el-input
                        v-model="replyInputData"
                        type="textarea"
                        style="height: 142px; border: none"
                        placeholder="说点什么呢"
                        :rows="5"
                        class="inputDeep"
                      />
                      <div class="text-btn">
                        <el-button type="info" size="default" @click="replyInputbtn(2)"
                          >取消</el-button
                        >
                        <el-button type="primary" size="default">提交</el-button>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </li>
        </div>
      </div>
 -->
        <el-divider class="tips" content-position="center">
          <span class="tips-text">我也是有底线的</span>
        </el-divider>
      </footer>
    </main>

    <!-- 目录导航 -->
    <aside class="sidebar">
      <div class="rigth-box">
        <Catalogue :tocItems="tocItems" />
      </div>
    </aside>
  </div>
</template>

<style scoped lang="less">
.content-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  padding: 0 20px;
  gap: 48px;
  padding: 0 32px;
}
.article-main-content {
  background-color: var(--box-backgrd-color);
  padding: 20px;
  border-radius: 15px;
  min-height: 1000px;
  header {
    .article-title {
      margin: 40px 0 50px 0;
      text-align: center;
      color: var(--title-color);
    }
    .article-bloggerdata {
      display: flex;
      align-items: center;
      justify-content: start;
      margin-bottom: 20px;
      .bloggerdata-content {
        margin-left: 10px;
        font-size: 16px;
        .bloggerdata-name {
          font-size: 22px;
          color: var(--theme-color);
          height: 23px;
        }
        .bloggerdata-msg {
          display: flex;
          align-items: center;
          .bloggerdata-msgitem {
            display: flex;
            align-items: center;
            color: #909399;
            span {
              margin-left: 4px;
            }
            &::after {
              content: '·';
              margin: 5px;
            }
            &:last-child::after {
              content: '';
            }
          }
        }
      }
    }
  }
  .article-content {
    padding: 16px 24px;
    line-height: 1.8;
    color: var(--title-color);
    font-size: 1.2em;
    :deep(h2) {
      font-size: 1.8em;
      margin: 32px 0 16px;
      padding-bottom: 8px;
      border-bottom: 2px solid rgba(#409eff, 0.1);
      position: relative;
      color: var(--title-color);

      &::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 50px;
        height: 2px;
        background: #409eff;
      }
    }

    :deep(h3) {
      font-size: 1.5em;
      margin: 16px 0;
      color: var(--title-color);
      position: relative;
      padding-left: 16px;
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 20px;
        background: #409eff;
        border-radius: 4px;
      }
    }
    :deep(h4) {
      font-size: 1.1em;
      margin: 16px 0;
      color: var(--title-color);
      position: relative;
    }

    :deep(p) {
      margin: 12px 0;
      color: var(--text-secondary);
      line-height: 1.8;
    }

    :deep(a) {
      color: #409eff;
      text-decoration: none;
      border-bottom: 1px dashed #409eff;
      transition: all 0.3s ease;

      &:hover {
        color: var(--primary-dark);
        border-bottom-style: solid;
      }
    }

    :deep(blockquote) {
      margin: 16px 0;
      padding: 12px 16px;
      background: var(--catalogue-backcolor);
      border-left: 4px solid #409eff;
      border-radius: 4px;
      color: var(--text-secondary);
      font-style: italic;

      p {
        margin: 0;
      }
    }

    :deep(ul),
    :deep(ol) {
      margin: 12px 0;
      padding-left: 32px;
      color: var(--text-secondary);

      li {
        margin-bottom: 8px;
        position: relative;

        &::marker {
          color: #409eff;
        }
      }
    }

    :deep(pre) {
      margin: 1em 0;
      position: relative;
      background: #282c34;
      border-radius: 6px;
      padding-top: 2.5em;
      overflow: hidden;
      // max-height: 2000px;
      transition: max-height 0.4s ease-in-out;

      &.collapsed {
        // max-height: 300px;
        // &::after {
        //   content: '';
        //   position: absolute;
        //   bottom: 0;
        //   left: 0;
        //   right: 0;
        //   height: 60px;
        //   background: linear-gradient(transparent, #282c34);
        //   pointer-events: none;
        //   z-index: 2;
        // }

        .expand-button {
          display: flex !important;
        }
      }

      .expand-button {
        position: absolute;
        bottom: 15px;
        left: 50%;
        transform: translateX(-50%);
        padding: 6px 16px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 4px;
        color: #abb2bf;
        cursor: pointer;
        z-index: 3;
        font-size: 0.9em;
        align-items: center;
        gap: 6px;
        transition: all 0.2s ease;

        &:hover {
          background: rgba(255, 255, 255, 0.2);
          color: #fff;
          transform: translateX(-50%) translateY(-2px);
        }

        i {
          font-size: 14px;
        }
      }

      /* 添加行号容器样式 */
      .line-numbers {
        position: absolute;
        left: 0;
        top: 2.5em;
        bottom: 0;
        font-size: 14px;
        padding: 1em 0;
        text-align: right;
        color: #666;
        border-right: 1px solid #404040;
        background: #2d323b;
        user-select: none;
        z-index: 1;

        span {
          display: block;
          padding: 0 0.5em;
          min-width: 2.5em;
          line-height: 1.5;
        }
      }

      /* 调整代码内容的样式 */
      code {
        display: block;
        padding: 1em;
        padding-left: 4em;
        /* 增加左侧padding */
        margin-left: 0;
        /* 移除margin */
        overflow-x: auto;
        font-family: 'Fira Code', monospace;
        font-size: 14px;
        line-height: 1.5;
        position: relative;
        color: #abb2bf;
        /* 添加相对定位 */

        /* 添加水平滚动条样式 */
        &::-webkit-scrollbar {
          height: 8px;
        }

        &::-webkit-scrollbar-track {
          background: #2d323b !important;
        }

        &::-webkit-scrollbar-thumb {
          background: #454c59 !important;
          border-radius: 4px;

          &:hover {
            background: #5a6273;
          }
        }
      }

      /* 添加仿 macOS 风格的按钮 */
      &::before {
        content: '';
        position: absolute;
        top: 12px;
        left: 12px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #ff5f56;
        box-shadow:
          20px 0 0 #ffbd2e,
          40px 0 0 #27c93f;
      }

      /* 复制按钮容器 */
      .code-header {
        position: absolute;
        top: 8px;
        right: 12px;
        z-index: 2;
        opacity: 0;
        transition: opacity 0.2s ease;
      }

      /* 显示复制按钮 */
      &:hover .code-header {
        opacity: 1;
      }

      /* 复制按钮样式 */
      .copy-button {
        padding: 4px 8px;
        background: rgba(255, 255, 255, 0.1);
        border: none;
        border-radius: 4px;
        color: #abb2bf;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 4px;

        i {
          font-size: 14px;
        }

        &:hover {
          background: rgba(255, 255, 255, 0.2);
          color: #fff;
        }

        &.copied {
          background: #98c379;
          color: #fff;
        }
      }
    }

    :deep(img.lazy-image) {
      opacity: 0;
      transition: opacity 0.3s ease-in-out;

      &.loaded {
        opacity: 1;
      }

      &.error {
        opacity: 0.5;
      }
    }

    :deep(img) {
      max-width: 100%;
      border-radius: 12px;
      margin: 16px 0;
      transition: all 0.3s ease;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      cursor: zoom-in;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
      }
    }

    :deep(table) {
      width: 100%;
      margin: 16px 0;
      border-collapse: collapse;
      border-radius: 12px;
      overflow: hidden;

      th,
      td {
        padding: 8px 12px;
        border: 1px solid var(--border-color);
      }

      th {
        background: var(--catalogue-backcolor);
        color: var(--title-color);
        font-weight: 500;
        text-align: left;
      }

      tr:nth-child(even) {
        background: var(--catalogue-backcolor);
      }
    }

    :deep(hr) {
      margin: 32px 0;
      border: none;
      height: 1px;
      background: var(--border-color);
      position: relative;

      &::before {
        content: '§';
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background: var(--card-bg);
        padding: 0 16px;
        color: var(--text-secondary);
        font-size: 1.2em;
      }
    }
  }
  footer {
    .artcle-classification {
      text-align: right;
      span {
        margin-right: 10px;
        cursor: pointer;
      }
    }
    .article-comment {
      display: flex;
      align-items: center;
      margin-top: 30px;
      font-size: 29px;
      svg {
        width: 25px !important;
        height: 25px !important;
      }
      .comment-title {
        margin-left: 5px;
        color: var(--theme-color);
      }
    }
    .article-text {
      border: 1px solid rgba(144, 147, 153, 0.31);
      display: flex;
      padding: 20px 10px;
      border-radius: 5px;
      .text-box {
        margin-left: 10px;
        flex: 1;
        .inputDeep {
          font-size: 17px;
          :deep(.el-textarea__inner) {
            box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color)) inset;
            resize: none;
            cursor: default;
          }
        }
        .text-btn {
          text-align: right;
          button {
            margin-right: 10px;
          }
        }
      }
    }
    .commentwrap {
      margin-top: 20px;
      margin: 20px 0 40px 0;
      .comment-item {
        margin: 0 0 50px 0;
      }
      .li-item {
        color: #82848a;
        font-size: 18px;

        .commeta-box {
          display: flex;
          align-items: center;
          position: relative;
          margin-bottom: 5px;
          .comment {
            margin-left: 10px;
            font-size: 14px;
            .comment-name {
              font-size: 18px;
              height: 25px;
              color: var(--botton-backcolor);
            }
          }
          .comment-reply {
            position: absolute;
            bottom: 2px;
            right: 20px;
            background-color: var(--botton-backcolor);
            padding: 0 6px;
            line-height: 20px;
            border-radius: 5px;
            color: #fff;
            cursor: pointer;
          }
        }
        .comment-content {
          background-color: var(--comcon-color);
          border-radius: 7px;
          padding: 10px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          .mention {
            margin-right: 5px;
            color: #6366f1;
          }
        }
      }
    }
    .comment-main {
      flex: 1;
      height: 215px;
      padding: 20px 10px;
      display: flex;
      margin: 20px 0 20px 40px;
      border: 1px solid rgba(144, 147, 153, 0.31);
      border-radius: 5px;
      .text-box {
        margin-left: 10px;
        flex: 1;
        .inputDeep {
          font-size: 17px;
          :deep(.el-textarea__inner) {
            box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color)) inset;
            resize: none;
            cursor: default;
          }
        }
        .text-btn {
          text-align: right;
          button {
            margin-right: 10px;
          }
        }
      }
    }
    .tips {
      .tips-text {
        font-size: 18px !important;
      }
    }
    .el-divider--horizontal {
      margin: 5px 0;
    }
  }
}
.sidebar {
  position: relative;
  width: 310px;
  .rigth-box {
    position: sticky;
    top: 80px;
  }
}
:deep(.el-textarea__inner) {
  background-color: var(--box-backgrd-color);
}
</style>
