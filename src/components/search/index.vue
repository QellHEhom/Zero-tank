<script setup>
import { computed, ref } from 'vue'
import { CloseBold, View } from '@element-plus/icons-vue'
import { getSearch } from '@/api/article'
import router from '@/router'
const emit = defineEmits(['openSearch'])
const showSearch = (event) => {
  event.stopPropagation() // 阻止冒泡
  emit('openSearch')
}
// 输入框
const searchInput = ref(null)
// 加载中
const loading = ref(false)

// 搜索完的数据
const searchResults = ref([])
const handleSearch = async () => {
  if (!searchInput.value.trim()) return
  loading.value = true
  searchResults.value = (await getSearch(searchInput.value.trim())).data
  loading.value = false
}

const onArticle = (id) => {
  router.push(`/article/${id}`)
  emit('openSearch')
}
// 关键词高亮显示
const highlightKeyword = (text) => {
  if (!searchInput.value.trim() || !text) return text
  const keywords = searchInput.value
    .trim()
    .split(/\s+/)
    .filter((k) => k)
  let highlightedText = text
  keywords.forEach((keyword) => {
    const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    highlightedText = highlightedText.replace(regex, '<mark>$1</mark>')
  })
  return highlightedText
}
</script>

<template>
  <div class="BackDrop" @click="showSearch"></div>
  <div class="search-dialog" width="650px">
    <div class="search-header">
      <div class="search-header-left">搜索</div>
      <el-icon class="active" @click="showSearch"><CloseBold /></el-icon>
    </div>
    <div class="search-input-wrapper" :class="{ loading }">
      <input
        v-model="searchInput"
        type="text"
        class="search-input"
        placeholder="输入关键词搜索文章..."
        @keyup.enter="handleSearch"
      />
      <div class="clear-btn" v-show="searchInput" @click="searchInput = ''">
        <el-icon><CloseBold /></el-icon>
      </div>
      <span class="enter-tip">
        <svg-icon name="enter" />
        按回车搜索
      </span>
    </div>

    <div class="search-results">
      <div
        class="search-result-item"
        v-for="item in searchResults"
        :key="item.id"
        @click="onArticle(item.id)"
      >
        <div class="result-header">
          <h3 v-html="highlightKeyword(item.title)"></h3>
          <span class="result-date"> {{ item.create_time }} </span>
        </div>
        <p v-html="highlightKeyword(item.summary)"></p>
        <div class="result-footer">
          <span class="result-category">
            <svg-icon name="folder" />
            {{ item.category }}
          </span>
          <span class="result-views">
            <el-icon><View /></el-icon>
            {{ item.quantity }} 阅读
          </span>
        </div>
      </div>

      <!-- <div class="pagination-box">
        <el-pagination background layout="prev, pager, next" :total="total"> </el-pagination>
      </div> -->
    </div>

    <el-empty description="输入关键词搜索文章.." v-show="searchResults.length === 0" />
  </div>
</template>

<style lang="less">
.search-dialog {
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
  .search-header {
    display: flex;
    justify-content: space-between;
    font-size: 20px;
    padding: 0 0 20px 0;
    color: #666;
    .active {
      transition: all 0.3s ease;

      &:hover {
        cursor: pointer;
        color: #409eff;
        transform: scale(1.2);
      }
    }
  }
  .search-input-wrapper {
    display: flex;
    align-items: center;
    width: 100%;
    border: 2px solid #606266;
    border-radius: 8px;
    padding: 12px 15px;
    margin-bottom: 20px;
    position: relative;
    transition: all 0.3s ease;
    background-color: #e4e7ed;

    &:focus-within {
      border-color: #409eff;
      box-shadow: 0 0 0 3px rgba(202, 90, 210, 0.1);
    }

    .search-icon {
      color: #909399;
      font-size: 18px;
      margin-right: 10px;
    }

    .clear-btn {
      cursor: pointer;
      padding: 4px;
      color: #909399;
      transition: all 0.3s ease;
      display: flex;
      &:hover {
        color: red;
        transform: scale(1.2);
      }
    }

    &.loading::after {
      content: '';
      position: absolute;
      right: 15px;
      width: 20px;
      height: 20px;
      border: 2px solid #dcdfe6;
      border-top-color: #909399;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    .enter-tip {
      position: absolute;
      right: 15px;
      color: #909399;
      font-size: 15px;
      display: flex;
      align-items: center;
      opacity: 0.6;
      pointer-events: none;
      i {
        font-size: 14px;
        margin-right: 4px;
      }
    }

    .clear-btn + .enter-tip {
      right: 40px;
    }

    &.loading .enter-tip {
      display: none;
    }

    &:focus-within .enter-tip {
      opacity: 0;
      transform: translateX(10px);
      transition: all 0.3s ease;
    }
  }

  .search-input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 16px;
    padding: 5px;
    width: 100%;
    background: transparent;
    color: #666;
  }

  .hot-searches {
    margin-top: 30px;

    h4 {
      margin: 0 0 15px;
      color: #606266;
      font-size: 16px;
      display: flex;
      align-items: center;

      i {
        color: #ff9800;
        margin-right: 8px;
      }
    }
  }

  .search-results {
    max-height: 60vh;
    overflow-y: auto;
    padding-right: 10px;
    margin-top: 10px;
    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #e4e7ed;
      border-radius: 3px;

      &:hover {
        background-color: #c0c4cc;
      }
    }
  }

  .search-result-item {
    padding: 15px;
    cursor: pointer;
    border-radius: 8px;
    margin: 3px 0 10px 0;
    transition: all 0.3s ease;
    border: 1px solid #606266;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      border-color: #f56c6c;
    }

    .result-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;

      h3 {
        margin: 0;
        font-size: 20px;
        color: #409eff;
        flex: 1;
      }

      .result-date {
        font-size: 14px;
        color: #909399;
        margin-left: 10px;
      }
    }

    p {
      margin: 0 0 10px;
      font-size: 16px;
      color: #606266;
      line-height: 1.6;
    }

    .result-footer {
      display: flex;
      gap: 15px;
      font-size: 14px;
      color: #909399;

      i {
        margin-right: 4px;
      }

      .result-category,
      .result-views {
        display: flex;
        align-items: center;
      }
    }
  }

  .hot-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .hot-tag {
    padding: 6px 12px;
    background-color: #f4f4f5;
    border-radius: 20px;
    font-size: 13px;
    color: #606266;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    &:hover {
      color: #fff;
      background-color: #409eff;
      transform: translateY(-2px);
    }
  }

  :deep(mark) {
    background-color: rgba(202, 90, 210, 0.2);
    padding: 0 2px;
    border-radius: 2px;
    color: #f56c6c;
    font-weight: 500;
    transition: all 0.3s ease;

    &:hover {
      background-color: rgba(202, 90, 210, 0.4);
    }
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
}
</style>
