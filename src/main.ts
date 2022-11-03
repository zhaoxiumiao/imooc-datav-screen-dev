import { createApp } from 'vue'
import { pinia } from './store/index'
import './style.css'
import App from './App.vue'
import { router } from './router/index'
import countTo from 'vue3-count-to'
import FoolUi from 'fool-ui-plus' // 本地测试时，可以把打包后的dist复制到node_modules中并改名为fool-ui-plus。组件库正式上线npm后, 也可直接直接引入

createApp(App).use(FoolUi).use(router).use(pinia).use(countTo).mount('#app')
