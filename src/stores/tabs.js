import { defineStore } from  'pinia'
import {ref} from 'vue'
export const tabsStore = defineStore('tabs',()=>{
  const editableTabsValue =ref('home')
  const editableTabs = ref([
    {
      title: '工作台',
      name: 'home',
    },
  ])

  return {editableTabs,editableTabsValue}
})