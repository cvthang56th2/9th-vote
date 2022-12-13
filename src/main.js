import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import Home from './pages/Home.vue'
import Manage from './pages/Manage.vue'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

const routes = [
  { path: '/', component: Home },
  { path: '/manage', component: Manage },
]
const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHashHistory(),
  routes, // short for `routes: routes`
})

app.use(router)

app.mount('#app')

