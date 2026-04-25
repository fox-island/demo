import { createRouter, createWebHistory } from 'vue-router'
import WelcomeHome from '../views/welcome_home.vue'
import Search from '../views/search.vue'
import Knowledge from '../views/knowledge.vue'
import Login from '../views/login.vue'

const routes=[
    {
        path:'/',
        name:'Home',
        component:WelcomeHome
    },
    {
    path: '/welcome_home',
    name: 'WelcomeHome',
    component: WelcomeHome
  },
  {
    path: '/search',
    name: 'search',
    component: Search
  },
  {
    path: '/knowledge',
    name: 'Knowledge',
    component: Knowledge
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
]

const router=createRouter({
    history:createWebHistory(),
    routes
}
)

export default router