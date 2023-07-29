<template>
  <div class="sidebar">
    <!-- logo -->
    <div class="sidebar__logo">logo</div>
    <!-- logo--end -->
    <!-- 侧边导航 -->
    <el-menu class="el-menu-vertical-demo" :default-active="Eindex" unique-opened router>
      <el-sub-menu index="1">
        <template #title>
          <el-icon>
            <location />
          </el-icon>
          <span>影片</span>
        </template>
        <el-menu-item-group title="影片">
          <el-menu-item  index="film-management" name="影片管理">影片管理</el-menu-item>
          <el-menu-item  index="film-types">影片分类</el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>

      <el-sub-menu index="2">
        <template #title>
          <el-icon>
            <location />
          </el-icon>
          <span>影院</span>
        </template>
        <el-menu-item-group title="影院">
          <el-menu-item index="cinema-management">影院管理</el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>

      <el-sub-menu index="3">
        <template #title>
          <el-icon>
            <location />
          </el-icon>
          <span>用户</span>
        </template>
        <el-menu-item-group title="用户">
          <el-menu-item index="user-management">用户管理</el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
    </el-menu>
    <!-- 侧边导航--end -->
  </div>
</template>

<script setup lang="ts">
import {useRouter,useRoute} from 'vue-router'
const router = useRouter()
const route = useRoute()
import {watch,ref, onMounted} from 'vue'
import { tabsStore } from '@/stores/tabs.js'
const tab = tabsStore()
const Eindex = ref()
onMounted(()=>{
  
  if(route.name!=='home'){
    tab.editableTabs.push({
      title: route.meta.title,
      name: route.name,
    })
    tab.editableTabsValue = route.name
    Eindex.value=route.name
  }
})
watch(route,()=>{
  const arr =[]
  tab.editableTabs.forEach(item => {
    arr.push(item.title)
  });
  const res = arr.indexOf(route.meta.title)
  if(res==-1){
      tab.editableTabs.push({
      title: route.meta.title,
      name: route.name,
    })
  }
  tab.editableTabsValue = route.name
  Eindex.value=route.name
})
</script>

<style scoped lang="scss">
@import '@/assets/css/base.scss';

.sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 2000;
  width: 110px;
  height: 100%;
  overflow: auto;
  box-shadow: 1px 0px 5px rgb(0 0 0 / 5%);
  background-color: #fff;

  &__logo {
    height: 50px;
    line-height: 50px;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 5%);
    border-bottom: 1px solid rgb(0 0 0 / 5%);
  }

  :deep(.el-menu) {
    height: calc(100% - 51px);

    .el-sub-menu__title {
      padding: 0 10px;

      .el-sub-menu__icon-arrow {
        display: none;
      }
    }

    .is-opened {
      background: $color-ebf4ff;
    }

    .el-menu-item {
      padding: 0 10px;
    }

    .el-menu-item-group {
      overflow-y: auto;
      position: fixed;
      top: 92px;
      left: 111px;
      bottom: 0;
      z-index: 40;
      width: 120px;
      background: #FFFFFF;

      .el-menu-item-group__title {
        text-align: center;
        padding: 0;
        height: 51px;
        line-height: 51px;
        font-weight: 800;
        font-size: 16px;
        color: #000;
        border-bottom: 1px solid #eee;
      }
    }
  }
}</style>