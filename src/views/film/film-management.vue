<template>
  <div class="box">
    <el-form :inline="true" :model="formInline" class="box__form">
      <el-form-item label="商品名称">
        <el-input v-model="formInline.user" placeholder="" />
      </el-form-item>
      <el-form-item label="商品分类">
        <el-select v-model="formInline.region" placeholder="全部">
          <el-option label="1" value="1" />
          <el-option label="2" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">重置</el-button>
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>

    <el-tabs type="card" class="tab-form">
      <el-tab-pane v-for="item in tabname" :key="item.key" :label="item.title + '(' + item.num + ')'">
        <div class="box__btns">
          <el-button type="primary" @click="addcinema">新增影片</el-button>
          <el-button type="danger">影片上线</el-button>
          <el-button type="danger">停售</el-button>
        </div>
        <el-table :data="tableData" max-height="700" style="width: 100%" border
          :header-cell-style="{ background: '#e1e4e5', color: '#80878f' }">
          <el-table-column type="selection" fixed width="55" />
          <el-table-column prop="cover" fixed label="封面" width="180" />
          <el-table-column prop="name" label="名称" width="180" />
          <el-table-column prop="date" label="上映时间" width="180" />
          <el-table-column prop="type" label="类别" width="180" />
          <el-table-column prop="mv" label="上映影院" width="180" />
          <el-table-column prop="status" label="当前状态" />
          <el-table-column fixed="right" label="操作" width="200">
            <template #default="scope">
              <el-button type="primary" size="small" @click="editcinema(scope)">
                编辑
              </el-button>
              <el-button type="warning" size="small" @click.prevent="deleteRow(scope.$index)">
                停售
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <!-- 影片详细编辑 -->
    <el-dialog class="editdialog" v-model="visible" :show-close="false" :close-on-click-modal="false" > 
      <template #header="{ close, titleClass }">
        <div class="my-header">
          <h4 :class="titleClass">{{ ifedit ? '修改影片' : '新增影片' }}</h4>
          <el-button type="danger" @click="close">
            关闭
          </el-button>
        </div>
      </template>
      <el-tabs v-model="activeTab" type="card" class="datail" @tab-click="handleClick">
        <el-tab-pane label="基础设置" name="first">
          <el-form :model="tabledetail" label-width="120px">
            <el-form-item label="中文名称:">
              <el-input v-model="tabledetail.Cname" />
            </el-form-item>
            <el-form-item label="英文名称:">
              <el-input v-model="tabledetail.Ename" />
            </el-form-item>
            <el-form-item label="品类">
              <el-input v-model="tabledetail.type" />
            </el-form-item>
            <el-form-item label="上线时间地区:">
              <div class="datail-begin" v-for="(item, index) in tabledetail.begin" :key="index">
                <el-date-picker class="detail-picker" v-model="item.begindate" type="datetime" placeholder="请输入上线时间"
                  format="YYYY/MM/DD " value-format="YYYY-MM-DD hh:mm" />
                <el-input class="detail-address" v-model="item.beginaddress" />
                <el-button type="warning" @click="deldetaildate(index)">删除</el-button>
              </div>
              <el-button type="primary" ref="buttonRef" @click="adddetaildate">新增时间地区
                <el-popover ref="popoverRef" :virtual-ref="buttonRef" trigger="click" title="值不能为空" virtual-triggering>
                </el-popover>
              </el-button>
            </el-form-item>
            <el-form-item label="类型 :">
              <el-tag v-for="tag in tabledetail.tips" :key="tag" class="mx-1" closable :disable-transitions="false"
                @close="handleClosetips(tag)">
                {{ tag }}
              </el-tag>
              <el-input v-if="inputVisibletips" ref="InputReftips" v-model="inputValuetips" class="ml-1 w-20" size="small"
                @keyup.enter="handleInputConfirmtips" @blur="handleInputConfirmtips" />
              <el-button v-else class="button-new-tag ml-1" size="small" @click="showInputtips">
                + 添加类型
              </el-button>
            </el-form-item>
            <el-form-item label="版本 :">
              <el-tag v-for="tag in tabledetail.styles" :key="tag" class="mx-1" closable :disable-transitions="false"
                @close="handleClosestyles(tag)">
                {{ tag }}
              </el-tag>
              <el-input v-if="inputVisiblestyles" ref="InputRefstyles" v-model="inputValuestyles" class="ml-1 w-20"
                size="small" @keyup.enter="handleInputConfirmstyles" @blur="handleInputConfirmstyles" />
              <el-button v-else class="button-new-tag ml-1" size="small" @click="showInputstyles">
                + 添加版本
              </el-button>
            </el-form-item>
            <el-form-item label="语言 :">
              <el-tag v-for="tag in tabledetail.lange" :key="tag" class="mx-1" closable :disable-transitions="false"
                @close="handleCloselange(tag)">
                {{ tag }}
              </el-tag>
              <el-input v-if="inputVisiblelange" ref="InputReflange" v-model="inputValuelange" class="ml-1 w-20"
                size="small" @keyup.enter="handleInputConfirmlange" @blur="handleInputConfirmlange" />
              <el-button v-else class="button-new-tag ml-1" size="small" @click="showInputlange">
                + 添加语种
              </el-button>
            </el-form-item>
            <el-form-item label="片源地">
              <el-input v-model="tabledetail.location" />
            </el-form-item>
            <el-form-item label="时长">
              <el-input-number min="0" v-model="tabledetail.time" />
            </el-form-item>
            <el-form-item label="简介">
              <el-input min="0" v-model="tabledetail.detail" type="textarea" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="影片详情" name="second">
          <el-form :model="tabledetail" label-width="120px">
            <el-form-item label="演职人员:">


            </el-form-item>
            <el-form-item label="宣传封面:">
              <el-button type="primary" @click="uploadimgs" >上传</el-button>
            </el-form-item>
            <el-form-item label="视频:">
             
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="销售设置" name="third">
          <el-form :model="tabledetail" label-width="120px">
            <el-form-item label="虚拟观看:">
              <el-input-number min="0" v-model="tabledetail.wantlook" />
            </el-form-item>
            <el-form-item label="当前状态:">
              <el-radio-group v-model="tabledetail.status" class="ml-4">
                <el-radio :label="-1" size="large">下线</el-radio>
                <el-radio :label="0" size="large">待映</el-radio>
                <el-radio :label="1" size="large">热映</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <span class="my-footer">
          <el-button type="primary">确定</el-button>
          <el-button>取消</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 影片详细编辑--end -->
    
    <uploadimg v-if="showflag" :showflag="showflag" @cshowflag="cshowflag" @showimgs="showimgs"></uploadimg>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, unref, nextTick, onMounted } from 'vue'
import type { Ref } from 'vue'
//搜索框
const formInline: { user: string, region: string } = reactive({
  user: '',
  region: '',
})
//搜索框--end
//tabs索引
type tabsname = {
  key: number,
  title: string,
  num: number,
}
const tabname: Ref<tabsname[]> = ref([
  { key: 1, title: '全部', num: 0 },
  { key: 2, title: '正在热映', num: 0 },
  { key: 3, title: '待映影片', num: 0 },
  { key: 4, title: '停售', num: 0 },
])
//tabs索引--end
//详细影片的数据
interface tableTs {
  id: string | number,//索引
  cover: Array<string>,//宣传封面
  Cname: string,//中文影片名称
  Ename: string,//英文影片名称
  begin: Array<object>,
  type: string,//所属种类
  tips: Array<string>,//所属类型
  styles: Array<string>,//影片版本
  lange: Array<string>,//语言
  location: string,//片源地
  time: number,//时长
  mv: string,//上映的影院
  status: number,//当前状态
  // video?: Array<string>,//首页宣传片
  detail?: string,//简介
  detailpeople: Array<object>,//演员表
  detailimg?: Array<string>,//介绍图片
  detailvideo?: Array<string>,//花絮视频
  wantlook: number,
}
const tabledetail: tableTs = reactive({
  id: null,
  cover: [],
  Cname: null,
  Ename: null,
  begin: [
    { begindate: null, beginaddress: null }
  ],
  type: '电影',
  tips: [],
  styles: [],
  lange: ['国语', '英语'],
  location: null,
  time: 0,
  mv: null,
  status: -1,
  video: null,
  detail: null,
  detailpeople: [
    { id: null, cname: null, ename: null, avatar: null, cosavatar: null, cosname: null, tip: null }
  ],
  detailimg: [],
  dateilvideo: [],
  wantlook: 0
})
//详细影片的数据--end
//后台渲染到表格的数据
const tableData = [
  {
    id: 1,
    cover: [1, 2],
    date: '2016-05-03',
    name: 'Tom',
    type: '23',
    mv: 'da',
    status: 1
  },
]
//后台渲染到表格的数据--end
const visible: Ref<boolean> = ref(false)//遮罩层判断
const ifedit: Ref<boolean> = ref(false)//判断修改还是新增
const activeTab: Ref<string> = ref('first')//修改影片tab标签的默认值
const addcinema = () => {//添加影片
  ifedit.value = false
  visible.value = true
}
const editcinema = () => {//修改影片
  ifedit.value = true
  visible.value = true
}
//上线时间和地区
const ifempty: Ref<boolean> = ref(false)
const buttonRef = ref()
const popoverRef = ref()
const adddetaildate = () => {//添加时间和地区框
  tabledetail.begin.map(item => {//判断值是否为空
    if (item.beginaddress && item.begindate) {
      ifempty.value = true
    } else {
      ifempty.value = false
      unref(popoverRef).popperRef?.delayHide?.()//虚拟框值不能为空
    }
  })
  if (ifempty.value) {
    tabledetail.begin.push({ begindate: null, beginaddress: null })
  }
}
const deldetaildate = (index: number) => {//删除时间和地区框
  if (index !== 0) {
    tabledetail.begin.splice(index, 1)
  }
}
//上线时间和地区--end
// 添加类型
const inputValuetips = ref('')
const inputVisibletips = ref(false)
const InputReftips = ref()
const handleClosetips = (tag: string) => {
  tabledetail.tips.splice(tabledetail.tips.indexOf(tag), 1)
}
const showInputtips = () => {
  inputVisibletips.value = true
  nextTick(() => {
    InputReftips.value!.input!.focus()
  })
}
const handleInputConfirmtips = () => {
  if (inputValuetips.value) {
    tabledetail.tips.push(inputValuetips.value)
  }
  inputVisibletips.value = false
  inputValuetips.value = ''
}
// 添加类型--end
// 添加版本
const inputValuestyles = ref('')
const inputVisiblestyles = ref(false)
const InputRefstyles = ref()
const handleClosestyles = (tag: string) => {
  tabledetail.styles.splice(tabledetail.styles.indexOf(tag), 1)
}
const showInputstyles = () => {
  inputVisiblestyles.value = true 
  nextTick(() => {
    InputRefstyles.value!.input!.focus()
  })
}
const handleInputConfirmstyles = () => {
  if (inputValuestyles.value) {
    tabledetail.styles.push(inputValuestyles.value)
  }
  inputVisiblestyles.value = false
  inputValuestyles.value = ''
}
// 添加版本--end
// 添加语言
const inputValuelange = ref('')
const inputVisiblelange = ref(false)
const InputReflange = ref()
const handleCloselange = (tag: string) => {
  tabledetail.lange.splice(tabledetail.lange.indexOf(tag), 1)
}
const showInputlange = () => {
  inputVisiblelange.value = true
  nextTick(() => {
    InputReflange.value!.input!.focus()
  })
}
const handleInputConfirmlange = () => {
  if (inputValuelange.value) {
    tabledetail.lange.push(inputValuelange.value)
  }
  inputVisiblelange.value = false
  inputValuelange.value = ''
}
// 添加语言--end


//添加人员
  //1.弹出人员传送框批量添加，并获取到数组包括人员的头像，中英文名，id
  //2.点击人员tag标签，弹出框，输入人员的职位，饰演角色和头像
//添加人员--end
//添加封面
  const showflag = ref(false)
  const uploadimgs =  ()=>{
    showflag.value=true
  }
  const cshowflag = (valey)=>{
    showflag.value=valey
    console.log(valey)
  }
  const showimgs = (val)=>{
    console.log(val)
  }
  //1.点击上传，显示出图片库，选择图片
  //2.渲染到页面，给一个tag分类
//添加封面--end
//添加宣传片
  //1.点击上传，显示出视频库，选择视频
  //2.渲染到页面，给一个tag分类
//添加宣传片--end
const aa= [1,2]
</script>

<style scoped lang="scss">

.box {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  &__form {
    position: relative;
    padding: 10px 15px;
    line-height: 24px;
    margin-bottom: 15px;
  }

  .el-tabs {
    :deep(.el-tabs__content) {
      height: calc(100% - 55px);
      box-sizing: border-box;

      .el-tab-pane {
        height: 100%;

        .box__btns {
          text-align: left;
          height: 40px;
          line-height: 40px;
        }

        .el-table {
          margin-top: 10px;
        }
      }
    }
  }

  // 遮罩层
  :deep(.el-overlay) {
    position: absolute;

    .el-overlay-dialog {
      position: inherit;
      padding: 40px;
    }
  }

  :deep(.el-dialog) {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background: #f8f8f8;
    border-radius: 10px;
    overflow: hidden;
    margin: 0;

    .el-dialog__header {
      height: 50px;
      line-height: 50px;
      padding: 0;
      margin: 0;
      background: #fff;

      .my-header {
        display: flex;

        h4 {
          flex: 1;
          text-align: left;
          padding: 10px;
          margin: 0;
        }

        .el-button {
          margin: 10px;
        }
      }
    }

    .el-dialog__footer {
      background: #fff;
      padding: 10px;
    }

    .el-dialog__body {
      flex: 1;

      .datail {
        &-begin {
          display: flex;
          width: 800px;
          margin: 0 10px;
        }

        &-picker {
          width: 200px;
        }
      }
    }
  }
}
</style>