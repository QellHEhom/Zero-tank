import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)
// 引入svg
import SvgIcon from '@/components/SvgIcon.vue' // svg component
app.component('svg-icon', SvgIcon)

//高亮
import 'highlight.js/styles/atom-one-dark.css'

app.use(createPinia())
app.use(router)

app.mount('#app')
