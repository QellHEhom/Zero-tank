<script setup></script>

<template>
  <el-card class="Affiche" shadow="always" style="padding: 0">
    <div class="AfficheCar">
      <div class="Affiche-title">
        <svg-icon name="affiche"></svg-icon>
        <p>公告</p>
      </div>
      <el-divider />
      <div class="Affiche-content">
        <div class="Affiche-item">
          <svg-icon name="star"></svg-icon>
          <p class="WorDwrap">
            当前代阿斯顿解耦i阿三接到上级的爱睡觉的哦i啊睡觉的i哦爱睡觉的哦i啊十几栋
          </p>
        </div>
        <div class="Affiche-item active">
          <svg-icon name="star"></svg-icon>
          <p class="WorDwrap">
            当前代阿斯顿解耦i阿三接到上级的爱睡觉的哦i啊睡觉的i哦爱睡觉的哦i啊十几栋
          </p>
        </div>
        <div class="Affiche-item">
          <svg-icon name="star"></svg-icon>
          <p class="WorDwrap">
            当前代阿斯顿解耦i阿三接到上级的爱睡觉的哦i啊睡觉的i哦爱睡觉的哦i啊十几栋
          </p>
        </div>
      </div>
    </div>
  </el-card>
</template>

<style scoped lang="less">
.Affiche {
  background-color: var(--box-backgrd-color);
  height: 280px;
  border-radius: 10px;
  .AfficheCar {
    padding: 20px 24px;
    .Affiche-title {
      display: flex;
      align-items: center;
      font-size: 22px;
      color: #6366f1;
      padding: 5px 0;
      &::before {
        content: '';
        display: inline-block;
        width: 4px;
        height: 16px;
        background: linear-gradient(to bottom, #6366f1, #8b5cf6);
        margin-right: 8px;
        border-radius: 2px;
        vertical-align: middle;
        transform: translateY(-1px);
      }
      p {
        margin-left: 10px;
      }
    }
    .el-divider--horizontal {
      margin: 0;
      border-top: 2px var(--el-border-color) var(--el-border-style);
    }
    .Affiche-content {
      font-size: 18px;
      svg {
        width: 3rem;
        height: 2rem;
        color: #6366f1;
      }
      .Affiche-item {
        display: flex;
        padding: 10px 0;
        p {
          margin-left: 7px;
          padding: 2px;
          color: var(--text-color2);
        }
      }
      .active {
        border-top: 1px var(--el-border-color) var(--el-border-style);
        border-bottom: 1px var(--el-border-color) var(--el-border-style);
      }
    }
  }
}
</style>
