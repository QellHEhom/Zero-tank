<script setup>
const data = [
  {
    id: 1,
    name: '神秘用户',
    userimg: '',
    address: '牛逼',
    date: '2016-10-03',
  },
  {
    id: 2,
    name: '神秘用户',
    userimg: '',
    address: '牛逼',
    date: '2016-10-03',
  },
  {
    id: 3,
    name: '神秘用户',
    userimg: '',
    address: '牛逼',
    date: '2016-10-03',
  },
  {
    id: 4,
    name: '神秘用户',
    userimg: '',
    address: '牛逼',
    date: '2016-10-03',
  },
  {
    id: 5,
    name: '神秘用户',
    userimg: '',
    address: '牛逼',
    date: '2016-10-03',
  },
  {
    id: 6,
    name: '神秘用户',
    userimg: '',
    address: '牛逼',
    date: '2016-10-03',
  },
  {
    id: 7,
    name: '神秘用户',
    userimg: '',
    address: '牛逼',
    date: '2016-10-03',
  },
  {
    id: 8,
    name: '神秘用户',
    userimg: '',
    address: '牛逼',
    date: '2016-10-03',
  },
  {
    id: 9,
    name: '神秘用户',
    userimg: '',
    address: '牛逼',
    date: '2016-10-03',
  },
]


</script>

<template>
  <div class="message">
    <main>
      <div class="message-header">
        <h1>留言板</h1>
        <p>欢迎留下您的想法和建议</p>
        <button><SvgIcon name="home" /><span>写留言</span></button>
      </div>
      <div class="message-content">
        <div class="message-item" v-for="item in data" :key="item.id">
          <div class="item-header">
            <el-avatar :size="44" src="#" />
            <div class="item-info">
              <span class="info-name">{{ item.name }}</span>
              <span class="info-time">{{ item.date }}</span>
            </div>
          </div>
          <div class="item-content">
            <p>{{ item.address }}</p>
          </div>
        </div>
      </div>
      <div class="message-footer">
        <div class="example-pagination-block">
          <el-pagination layout="prev, pager, next" :total="1000" />
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped lang="less">
.message {
  margin: 0 auto;
  background-color: var(--box-backgrd-color);
  max-width: 1400px;
  main {
    padding: 24px;
    margin-bottom: 80px;
    .message-header {
      text-align: center;
      color: var(--title-color);
      h1 {
        font-size: 50px;
      }
      p {
        font-size: 23px;
      }
      button {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        margin-top: 20px;
        box-sizing: border-box;
        padding: 16px 32px;
        font-size: 17px;
        border-radius: 10px;
        border: none;
        cursor: pointer;
        background-color: #6366f1;
        color: #fff;
        transition: all 0.3s ease-in-out;
        span {
          margin-left: 5px;
        }
        &:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
        }
      }
    }
    .message-content {
      margin-top: 50px;
      display: grid;
      padding: 16px;
      gap: 32px;
      color: var(--text-color);
      grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
      .message-item {
        background-color: var(--backdrop-color);
        border: 1px solid var(--backdrop-color);
        box-shadow: 0 4px 6px rgba(99, 97, 97, 0.2);
        border-radius: 10px;
        .item-header {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 9px;
          .item-info {
            display: flex;
            flex-direction: column;
            justify-content: right;
            .info-name {
              font-size: 20px;
              font-weight: 600;
              line-height: 24px;
            }
            .info-time {
              font-size: 14px;
            }
          }
        }
        .item-content {
          padding: 12px;
          border-top: 1px solid #e2e8f0;
          min-height: 170px;
          p {
            font-size: 23px;
          }
        }
      }
    }
    .message-footer {
      margin-top: 30px;
      display: flex;
      justify-content: center;
      * {
        font-size: 17px !important;
      }
    }
  }
}
html[data-theme='dark'] .el-pagination {
  --el-pagination-bg-color: none;
  --el-pagination-button-disabled-bg-color: none;
  --el-pagination-button-color: #939599;
}
</style>
