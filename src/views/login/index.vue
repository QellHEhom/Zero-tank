<script setup>
// import { ElMessage } from 'element-plus'
import { ref, onMounted, reactive, watch } from 'vue'
import { Login, register } from '../../api/login'
import router from '@/routes'
import { useWebDataStore } from '@/stores/index'
import { storeToRefs } from 'pinia'
const WebDataStore = useWebDataStore()

const formLabelAlign = reactive({
  username: '',
  nickname: '',
  password: '',
})
const rules = reactive({
  username: [
    {
      required: true,
      message: '请输入用户名',
    },
  ],
  nickname: [
    {
      required: true,
      message: '请输入名称',
    },
  ],
  password: [{ required: true, message: '请输入密码' }],
})

const behavior = ref(false)
// 加密密码
async function hashPassword(password) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}
const formRef = ref()
// 侦听注册还是登入
watch(
  () => behavior.value,
  () => {
    formRef.value.resetFields()
  },
)
const submitForm = async (formEl) => {
  let close = null
  try {
    if (!formEl) return
    const validate = await formEl.validate()
    if (!validate) return
    const regex = /^[A-Za-z0-9@._-]+$/
    if (!regex.test(formLabelAlign.username)) {
      ElMessage({
        dangerouslyUseHTMLString: true,
        message: `<h3>用户名只能包含字母数字以及@._-</h3>`,
        type: 'error',
        offset: 100,
      })
      return
    }
    if (behavior.value) {
      // 注册
      close = ElMessage({
        dangerouslyUseHTMLString: true,
        message: '<h3 >注册中...</h3>',
        type: 'warning',
        offset: 100,
      })
      const message = (
        await register({
          username: formLabelAlign.username,
          nickname: formLabelAlign.nickname,
          password: await hashPassword(formLabelAlign.password),
        })
      ).data
      if (message === '注册成功') {
        close.close()
        ElMessage({
          dangerouslyUseHTMLString: true,
          message: '<h3>注册成功，请登入</h3>',
          type: 'success',
          offset: 100,
        })
        formEl.resetFields()
        behavior.value = false
      }
    } else {
      // 登入
      close = ElMessage({
        dangerouslyUseHTMLString: true,
        message: '<h3 >登录中...</h3>',
        type: 'warning',
        offset: 100,
      })
      const token = await Login({
        username: formLabelAlign.username,
        password: await hashPassword(formLabelAlign.password),
      })
      if (token.data) {
        close.close()
        ElMessage({
          dangerouslyUseHTMLString: true,
          message: '<h3>登入成功</h3>',
          type: 'success',
          offset: 100,
        })
        WebDataStore.$patch({
          token: token.data,
        })
        router.push({ path: '/', replace: true })
      }
    }
  } catch (error) {
    close.close()
    ElMessage({
      dangerouslyUseHTMLString: true,
      message: `<h3>登录失败！${error.response.data.data}</h3>`,
      type: 'error',
      offset: 100,
    })
  }
}
</script>
<template>
  <div class="login">
    <main class="login-content">
      <div class="box-content">
        <h1 class="title">{{ behavior ? '注册' : '登入' }}</h1>
        <el-form ref="formRef" :model="formLabelAlign" class="el-form" :rules="rules" size="large">
          <el-form-item prop="username">
            <el-input v-model="formLabelAlign.username" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item prop="nickname" v-if="behavior">
            <el-input v-model="formLabelAlign.nickname" placeholder="请输入用户昵称" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="formLabelAlign.password"
              placeholder="请输入密码"
              type="password"
              show-password
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="large"
              style="width: 35%; margin: 0 auto"
              @click="submitForm(formRef)"
            >
              {{ behavior ? '注册' : '登入' }}
            </el-button>
          </el-form-item>
        </el-form>
        <div class="btn" style="text-align: right">
          <span>{{ behavior ? '已有账号？' : '没有账号？' }}</span>
          <span class="onBtn" @click="behavior = !behavior">
            {{ behavior ? '马上登入' : '快速注册' }}
          </span>
        </div>
      </div>
    </main>
    <!-- <aside></aside> -->
  </div>
</template>

<style lang="less" scoped>
.login {
  width: 35%;
  // height: 50%;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #ffffff;
  border-radius: 20px;
  padding: 30px;
  z-index: 1000;
  .box-content {
    text-align: center;
    h1 {
      padding: 20px;
      text-align: center;
    }
    .el-form {
      max-width: 500px;
      padding: 20px;
      margin: 0 auto;
    }
    .btn {
      font-size: 18px;
      margin: 20px 10px 0 0;
      .onBtn {
        color: #5a52e7;
        cursor: pointer;

        &:hover {
          color: #8a85f0;
        }
      }
    }
  }
}
.el-form-item--large {
  --font-size: 20px !important;
  padding: 5px 0;
}
:deep(.el-form-item__error) {
  font-size: 15px !important;
}
</style>
