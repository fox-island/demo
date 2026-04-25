import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css' // 必须引入样式
import router from './router'


const app=createApp(App)
app.use(router)
app.use(ElementPlus)

app.mount('#app')
