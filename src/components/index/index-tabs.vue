<template>
  <div class="tabs">
    <el-tabs v-model="tab.editableTabsValue" type="card" class="demo-tabs" closable @tab-remove="removeTab" @tab-change="changeTab">
 
      <el-tab-pane  v-for="item in tab.editableTabs" :key="item.name" :label="item.title" :name="item.name">
      </el-tab-pane>
      <div style="background: #fff;width:100%;height: 100%;"> 
        <keep-alive><router-view   ></router-view></keep-alive> 
      </div>
      
    </el-tabs>
    
  </div>
  
</template>
<script lang="ts" setup>
import { ref} from 'vue'
import { useRouter,useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
import { tabsStore } from '@/stores/tabs.js'
const tab = tabsStore()

const removeTab = (targetName: string) => {
  if (targetName !== 'home') {//判断点击是否为工作台
    if (tab.editableTabsValue === targetName) {
      tab.editableTabs.forEach((tabs, index) => {
        if (tabs.name === targetName) {
          const nextTab = tab.editableTabs[index + 1] || tab.editableTabs[index - 1]
          if (nextTab) {
            router.push(nextTab.name)
          }
        }
      })
    }
    //过滤掉当前点击的tab标签
    tab.editableTabs = tab.editableTabs.filter((tab) => tab.name !== targetName)
  }

}
const changeTab = (targetName: string)=>{
  router.push(targetName)
}


</script>
<style scoped lang="scss">
@import '@/assets/css/base.scss';
.demo-tabs>.el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.el-tabs {
  position: fixed;
  top: 50px;
  left: 110px;
  right: 0;
  z-index: 999;
  height: 40px;
  line-height: 40px;
  padding: 0 80px 0 40px;
  background-color: #fff;
  box-sizing: border-box;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .1);
  :deep(.el-tabs__content){
    position: inherit;
    left: 232px;
    right: 0;
    padding: 10px;
    top: 92px;
    bottom: 0;
    z-index: 900;
    width: auto;
    box-sizing: border-box;
  
  }
  :deep(.el-tabs__nav) {

    .el-tabs__item:hover {
      color: #000;
      background: $color-ebf4ff;
      height: 39px;
    }

    .el-tabs__item.is-active {
      color: #3a91fb;
      background: $color-ebf4ff;
      border-bottom: none;
      height: 39px;
    }

  }
}
</style>
