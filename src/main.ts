import { createApp } from 'vue'
import { createPinia } from 'pinia'


import '@/assets/css/base.scss';
import './style.css'
import router from './router'
import App from './App.vue'

createApp(App).use(createPinia()).use(router).mount('#app')
