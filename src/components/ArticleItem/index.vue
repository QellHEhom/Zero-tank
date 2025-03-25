<script setup>
import router from '@/routes'
import { View, ChatDotRound, Calendar } from '@element-plus/icons-vue'
import { ref, onMounted } from 'vue'
// api
import { getArticleList } from '@/api/article'

// const props = defineProps({
//   tabsValue: {
//     type: String,
//   },
// })

// 点击标签
const onTag = (nac) => {
  console.log(nac)
}

// 数据列表
let articleData = ref([])
const pagination = ref(1)
// 获取文章列表
const getData = async (page = 1) => {
  const List = await getArticleList(page)
  pagination.value = List.data.pagination
  articleData.value = List.data.data
}
// 分页切换
const getcurrentpage = (currentPage) => {
  getData(currentPage)
}
// 页面加载时获取数据
onMounted(async () => {
  getData()
})
</script>

<template>
  <div class="ArticleItem">
    <div class="container" style="overflow: auto">
      <ul class="list">
        <li
          v-for="item in articleData"
          :key="item.id"
          @click="router.push(`/article/${item.id}`)"
          class="content-item"
        >
          <div class="item-left">
            <div class="left-layout">
              <div class="item-title WorDwrap">
                <span class="Pinned">置顶</span>
                <span>{{ item.title }} </span>
              </div>
              <div class="item-introduce WorDwrap">{{ item.summary }}</div>
            </div>
            <div class="common-bottom">
              <p class="common-bottom-item">
                <el-icon><View /></el-icon>
                <span>阅读</span>{{ item.quantity }}
              </p>
              <p class="common-bottom-item">
                <el-icon><ChatDotRound /></el-icon>
                <span>评论</span>{{ item.commentnum }}
              </p>
              <p class="common-bottom-item">
                <svg-icon name="like"></svg-icon>
                <span>点赞</span>{{ item.recommend }}
              </p>
              <p class="common-bottom-item">
                <el-icon><Calendar /></el-icon>
                {{ item.create_time }}
              </p>
            </div>
          </div>
          <div class="item-rigth">
            <el-image style="width: 380px; height: 240px" :src="item.avatar" fit="cover" />
            <!-- <CanvasImg width="600px" height="100%" /> -->
            <div class="tag">
              <el-tooltip
                v-for="nac in item.tag"
                class="box-item"
                effect="dark"
                :content="nac"
                placement="top"
                :key="nac"
              >
                <el-tag @click="onTag(nac)">{{ nac }}</el-tag>
              </el-tooltip>
            </div>
          </div>
        </li>
      </ul>
      <el-pagination
        v-if="articleData.length > 0"
        class="pagination"
        :background="true"
        layout="prev, pager, next"
        size="large"
        :total="pagination"
        :current-page="1"
        @current-change="getcurrentpage"
      />
    </div>
  </div>
</template>

<style scoped lang="less">
.ArticleItem {
  width: 100%;
  .container {
    .content-item {
      background-color: var(--box-backgrd-color);
      max-width: 920px;
      height: 240px;
      border-radius: 20px;
      overflow: hidden;
      display: flex;
      transition: all 0.3s ease;
      box-shadow: 0 4px 6px #0000001a;
      cursor: pointer;
      margin: 30px 0;
      .item-left {
        max-width: 540px;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .item-title {
          display: inline-flex;
          font-size: 25px;
          font-weight: 900;
          color: var(--text-color);
          line-height: 33px;
          .Pinned {
            display: inline-block;
            background-color: #a855f7;
            width: 50px;
            text-align: center;
            height: 27px;
            line-height: 28px;
            font-size: 16px;
            color: #fff;
            border-radius: 7px;
            margin-right: 4px;
          }
        }
        .item-introduce {
          margin-top: 10px;
          font-size: 18px;
          -webkit-line-clamp: 3;
          line-clamp: 3;
          color: var(--text-color2);
        }
        .common-bottom {
          display: flex;
          justify-content: start;
          align-items: center;
          color: var(--text-color);
          .tag span {
            margin: 0 5px;
            &:hover {
              cursor: pointer;
            }
          }
          .common-bottom-item {
            margin-left: 5px;
            display: flex;
            align-items: center;
            margin-right: 7px;
            font-size: 16px;
            svg {
              margin-right: 1px;
              font-size: 16px;
            }
            span {
              font-size: 17px;
            }
          }
        }
      }
      .item-rigth {
        transform: scale(1.08);
        width: 380px;
        clip-path: polygon(15% 0, 100% 0, 100% 100%, 0 100%);
        transition: all 0.3s ease;
        position: relative;
        .tag {
          position: absolute;
          top: 20px;
          right: 25px;
          z-index: 100;
          span {
            background-color: #5b5edd;
            border: 0;
            border-radius: 10px;
            overflow: hidden;
            color: #fff;
            margin-left: 5px;
          }
        }
      }
      &:nth-child(odd) {
        .item-left {
          order: 2;
          padding: 24px 32px 24px 44px;
        }
        .item-rigth {
          order: 1;
          clip-path: polygon(0 0, 100% 0, 85% 100%, 0 100%);
        }
      }
      &:nth-child(even) {
        .item-left {
          order: 1;
          padding: 24px 44px 24px 32px;
        }
        .item-rigth {
          order: 2;
          clip-path: polygon(15% 0, 100% 0, 100% 100%, 0 100%);
        }
      }
      i,
      svg {
        color: #6366f1;
      }
      &:hover {
        box-shadow: 0 4px 6px #0000003a;
        transform: translate(0, -5px);
        .item-title {
          color: #6366f1;
        }
        .item-rigth {
          transform: translate(0, -5px);
          transform: scale(1.1);
        }
      }
    }
  }
  .pagination {
    margin: 50px auto 100px auto;
    justify-content: center;
    font-size: 20px;
    :deep(button) {
      background-color: #fff !important;
    }
    :deep(li) {
      background-color: #fff !important;
    }
    :deep(.is-active) {
      background-color: #409eff !important;
    }
  }

  // .add-item {
  //   width: 120px;
  //   height: 30px;
  //   line-height: 30px;
  //   font-size: 21px;
  //   text-align: center;
  //   // background-color: #fff;
  //   // border: 1px solid #e4e7ed;
  //   // border-radius: 50px;
  //   margin: 50px auto 100px auto;
  //   // cursor: pointer;
  //   // &:hover {
  //   // background-color: #f5f7fa;
  //   // transition: all 0.7s;
  //   // }
  // }
  // .BlogArticleItem {
  //   margin-bottom: 100px;
  // }
}
</style>
