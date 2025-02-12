<script setup>
import { Timer } from '@element-plus/icons-vue'
</script>

<template>
  <div class="say">
    <main>
      <header>
        <el-image
          style="width: 100%; height: 580px"
          class="say-img"
          src="src/assets/images/1.jpg"
          fit="cover"
        />
      </header>
      <div class="content">
        <div class="say-item">
          <el-avatar
            :size="40"
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          />
          <div class="sayitem-content">
            <div class="blog-name">博主姓名</div>
            <div class="blog-content WorDwrap">
              <div class="blog-imgbox">
                <el-image
                  style="width: 250px; height: 250px"
                  src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
                  fit="cover"
                />
              </div>
              阿松i的骄傲司机滴哦撒娇滴哦撒娇哦i的ia
              <a href="#">阿松i的骄傲司机滴哦撒娇滴哦撒娇哦i的ia</a>
            </div>
            <div class="blog-time">
              <el-icon><Timer /></el-icon>
              <span>2022-02-02</span>
            </div>
          </div>
        </div>
        <div class="say-item">
          <el-avatar
            :size="40"
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          />
          <div class="sayitem-content">
            <div class="blog-name">博主姓名</div>
            <div class="blog-content">
              阿松i的骄傲司机滴哦撒娇滴哦as啊实打实的阿斯顿阿三打算打算打
              算打算打算打算打算阿萨打算撒娇哦i的ia实打实的阿斯顿阿三打算打算打算打算实
              打实的阿斯顿阿三打算打算打算打算实打实的阿斯顿阿三打算打算打算打算实打
              实的阿斯顿阿三打算打算打算打算实打实的阿斯顿阿三打算打算打算打算
              阿松i的骄傲司机滴哦撒娇滴哦as啊实打实的阿斯顿阿三打算打算打
              算打算打算打算打算阿萨打算撒娇哦i的ia实打实的阿斯顿阿三打算打算打算打算实
              打实的阿斯顿阿三打算打算打算打算实打实的阿斯顿阿三打算打算打算打算实打
              实的阿斯顿阿三打算打算打算打算实打实的阿斯顿阿三打算打算打算打算阿松i的骄傲司机滴哦撒娇滴哦as啊实打实的阿斯顿阿三打算打算打
              算打算打算打算打算阿萨打算撒娇哦i的ia实打实的阿斯顿阿三打算打算打算打算实
              打实的阿斯顿阿三打算打算打算打算实打实的阿斯顿阿三打算打算打算打算实打
              实的阿斯顿阿三打算打算打算打算实打实的阿斯顿阿三打算打算打算打算阿松i的骄傲司机滴哦撒娇滴哦as啊实打实的阿斯顿阿三打算打算打
              算打算打算打算打算阿萨打算撒娇哦i的ia实打实的阿斯顿阿三打算打算打算打算实
              打实的阿斯顿阿三打算打算打算打算实打实的阿斯顿阿三打算打算打算打算实打
              实的阿斯顿阿三打算打算打算打算实打实的阿斯顿阿三打算打算打算打算阿松i的骄傲司机滴哦撒娇滴哦as啊实打实的阿斯顿阿三打算打算打
              算打算打算打算打算阿萨打算撒娇哦i的ia实打实的阿斯顿阿三打算打算打算打算实
              打实的阿斯顿阿三打算打算打算打算实打实的阿斯顿阿三打算打算打算打算实打
              实的阿斯顿阿三打算打算打算打算实打实的阿斯顿阿三打算打算打算打算阿松i的骄傲司机滴哦撒娇滴哦as啊实打实的阿斯顿阿三打算打算打
              算打算打算打算打算阿萨打算撒娇哦i的ia实打实的阿斯顿阿三打算打算打算打算实
              打实的阿斯顿阿三打算打算打算打算实打实的阿斯顿阿三打算打算打算打算实打
              实的阿斯顿阿三打算打算打算打算实打实的阿斯顿阿三打算打算打算打算
            </div>
            <div class="blog-time">
              <el-icon><Timer /></el-icon>
              <span>2022-02-02</span>
            </div>
          </div>
        </div>
        <div class="say-item">
          <el-avatar
            :size="40"
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          />
          <div class="sayitem-content">
            <div class="blog-name">博主姓名</div>
            <div class="blog-content WorDwrap">阿松i的骄傲司机滴哦撒娇滴哦撒娇哦i的ia</div>
            <div class="blog-time">
              <el-icon><Timer /></el-icon>
              <span>2022-02-02</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped lang="less">
.say {
  width: 62%;
  margin: 0 auto;
  .say-img {
    border-radius: 10px;
  }
  .content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
    margin-top: 20px;
    .say-item {
      display: flex;
      background-color: var(--box-backgrd-color);
      padding: 10px;
      border-radius: 5px;
      .sayitem-content {
        margin-left: 10px;
        flex: 1;
        color: var(--text-color);
        font-size: 19px;
        padding: 0 20px 0 10px;
        .blog-name {
          color: var(--theme-color);
          font-size: 22px;
          line-height: 40px;
          height: 40px;
        }
        .blog-time {
          display: flex;
          align-items: center;
          font-size: 16px;
          margin-top: 10px;
        }
        .blog-imgbox {
          width: 250px;
          height: 250px;
        }
        .WorDwrap {
          -webkit-line-clamp: none;
          line-clamp: none;
        }
      }
    }
    a {
      color: #551a8b;
      text-decoration: underline;
    }
  }
}
</style>
