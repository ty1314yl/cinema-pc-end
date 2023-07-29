import { createRouter, createWebHistory } from 'vue-router'
  const routes = [
    {path:'/',name:'index',redirect:'home',component:()=>import('@/views/index/index.vue'),children:[
      {path:'home',name:'home',component:()=>import('@/views/index/home.vue'),meta:{title:'工作台'}},
      {path:'film-management',name:'film-management',component:()=>import('@/views/film/film-management.vue'),meta:{title:'影片管理'}},
      {path:'film-types',name:'film-types',component:()=>import('@/views/film/film-types.vue'),meta:{title:'影片分类'}},
      {path:'cinema-management',name:'cinema-management',component:()=>import('@/views/cinema/cinema-management.vue'),meta:{title:'影院管理'}},
      {path:'user-management',name:'user-management',component:()=>import('@/views/user/user-management.vue'),meta:{title:'用户管理'}},
    ]},
  ]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
