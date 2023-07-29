<template>
  <el-dialog v-model="props.showflag" :close-on-click-modal="false" :show-close="false">
    <template #header="{ close, titleClass }">
      <div class="my-header">
        <h4 :class="titleClass">上传图片</h4>
        <el-button type="danger" @click="cshowflag">
          关闭
        </el-button>
      </div>
    </template>
    <div class="uploadimg">
      <div class="uploadimg__left">
        <el-tree :data="options" :props="defaultProps" @node-click="handleNodeClick" :default-expand-all="true">
          <template #default="{ data }">
            <div class="custom-tree-node coverparent" style="width: 100%;text-align: left;">
              <span>{{ data.label }}</span>
              <span class="cover" >
                <el-icon style="margin-left: 10px;"><Edit /></el-icon>
                <el-icon style="margin-left: 5px;" @click="remove(data)"><Delete /></el-icon>
              </span>
            </div>
          </template>
        </el-tree> 
      </div>
      <div class="uploadimg__right">
        <div class="uploadimg__right__header">
          <el-button :icon="CirclePlus" type="primary" @click="showtype = true">添加分类</el-button>
          <el-upload v-model:file-list="fileList" class="upload-demo" :action="baseurl + 'uploadcinemaimg'"
            :show-file-list="false" multiple  :on-remove="handleRemove" :on-success="successImg"
            :before-remove="beforeRemove" :limit="20" >
            <el-button :icon="Upload" type="primary">上传图片</el-button>
          </el-upload>
          <el-button :icon="Edit" type="warning">移动分类</el-button>
          <el-button :icon="Delete" type="danger" @click="delcinemaimg">删除文件</el-button>
        </div>

        <div class="uploadimg__right__box">
          <div class="imagebox " v-for="(item, index) in urls" :key="index" @click="addactive(index)">
            <el-image :src="item.image" lazy />
            <div class="text">{{ item.name }}</div>
          </div>
        </div>
        <div class="uploadimg__right__bottom">
          <el-button :icon="CirclePlus" type="primary" @click="showimgs">使用选中文件</el-button>
          <el-pagination class="mt-4"  background prev-text="上一页" next-text="下一页" layout="prev, pager, next" 
            @current-change="changeImage"
           v-model:current-page="paginaton.page" :total="paginaton.total" :page-size="paginaton.limit"/>
        </div>

        <el-dialog v-model="showtype" title="新增分类" :close-on-click-modal="false"
          style="width:400px;height: 400px;text-align: center;left:50%;top:50%;transform: translate(-50%,-50%);">

          <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px"  style="background:#fff;padding: 10px;border:1px solid #ddd"
            :size="formSize" status-icon>
            <el-form-item label="上级分类：" >
              <el-cascader :props="props1" ref="cascader" :options="options" v-model="optionscascader" :show-all-levels="false"  />
            </el-form-item>
            <el-form-item label="分类名称：" prop="name">
              <el-input v-model="ruleForm.name"  />
            </el-form-item>
            <el-form-item label="排序：" prop="sort">
              <el-input-number v-model="ruleForm.sort" :min="1" :max="99"  />
            </el-form-item>
          </el-form>

          <template #footer>
            <span class="dialog-footer">
              <el-button type="primary"   @click="submitForm(ruleFormRef)">
                确定
              </el-button>
              <el-button @click="showtype = false">取消</el-button>
            </span>
          </template>
        </el-dialog>
        
      </div>
    </div>

  </el-dialog>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, nextTick, onMounted, reactive, ref, watch } from 'vue'

import { baseurl } from "@/untils/myaxios";
import { Delete, Edit, CirclePlus, Upload } from '@element-plus/icons-vue'
import { uploadcinemaimg } from '../../api/upload'
import { findCinemaType,createCinemaType,addcinemaImg,findCinemaImg,findCinemaImglength,delCinemaType,delCinemaImg} from '../../api/cinematype'
import { dayjs } from 'element-plus'
const showtype = ref(false)
const cascader = ref()//分类选择ref值
const optionscascader= ref('顶级分类')
const props1 = {
  checkStrictly: true,
}
const options = ref([
  {
    value: '顶级分类', label: '顶级分类', pid: 0, level: 0
  }
])
// 分类操作--start
interface RuleForm{
  name:String|Number,
  sort:Number,
  createtime:String,
  pid:String,
  level:Number,
}
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  name:'',
  sort:1,
  createtime:null,
  pid:'',
  level:1,
})
const rules = reactive<FormRules<RuleForm>>({
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' }
  ],
})
const submitForm = async (formEl: FormInstance | undefined) => {//添加分类
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      let currentVal = cascader.value.getCheckedNodes()[0]//级联分类选择值
      ruleForm.level=currentVal.level
      if(currentVal.level==1){
				ruleForm.pid=null
			}else{
				ruleForm.pid=currentVal.data._id	
			}
      createtype()//创建分类
    } else {
      console.log('提交失败!', fields)
    }
  })
}
const createtype = async()=>{//创建分类
  try{
    ruleForm.createtime=dayjs().format('YYYY-MM-DD')
    const res = await createCinemaType(ruleForm)
    if(res.data.data.status==200){
      ElMessage.success({
        message: '创建成功',
        offset: window.innerHeight / 2,
        duration:800
      })
      showtype.value=false
      find()
    }
  }catch(err){
    console.log(err)
  }
}
const buildHierarchy = (data, parentId = null) =>//数组重构
data
	.filter(node => node.pid === parentId)
	.map(node => ({ ...node, children: buildHierarchy(data, node._id),value:node.name,label:node.name}))
const find = async()=>{//查找全部分类
  try{
    const res = await findCinemaType()
    if(res.data.data.status==200){
      const rend = res.data.data.data
      const result = buildHierarchy(rend);
      options.value = [
				{
					value: '顶级分类', label: '顶级分类', pid: 0, level: 0, children:result
				}
			]
      options.value.filter(item=>{
        if( item.children!==[]){
          item.children.filter(item=>{
            if(item.children!==[]){
              item.children.filter(item=>{
                item.children=[]
              })
            }
          })
        }
      })
    }
  }catch(err){
    console.log(err)
  }
}
onMounted(()=>{
  find()
  findcinemaImg()
  findcinemaImglength()
})
const handleNodeClick = (node:({level:number,_id:string}))=>{//点击分类节点切换分类图片
  cinemaImg.type_level = node.level
  cinemaImg.type_id = node._id
  paginaton.id = node._id
  //重新获取图片
  findcinemaImg()
  findcinemaImglength()
}
const remove = ( data) => {//删除分类
  console.log(data)
  if(data.children.length>0){
    ElMessage.error({
      message: '该分类下存在子分类禁止删除',
      type: 'error',
      offset: window.innerHeight / 2,
      duration:800
    })
  }else{
    ElMessageBox.confirm(
    `确定要删除 ${data.label} 吗?`,
    '删除分类',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
      .then(async() => {
        if(paginaton.total>0){
        ElMessage.error({
          message: '该分类下存在文件禁止删除',
          type: 'error',
          offset: window.innerHeight / 2,
          duration:800
        })
      }else{
        if(data._id){
          const res = await delCinemaType(data)
          if(res.data.data.status==200){
            ElMessage.success({
              message: '删除成功',
              offset: window.innerHeight / 2,
              duration:800
            })
          }
          find()
        }
      }
      })
      .catch(() => {
      })
  }
 
  
}
// 分类操作--end

// 父子传参
const emit = defineEmits(['cshowflag','showimgs'])
const props = defineProps({
  showflag: ({
    type: Boolean
  })
})
const cshowflag = () => {
  emit('cshowflag', false)
}
const showimgs = () => {
  if(activeArray.value.length==0){
      ElMessage.error({
        message: '请选择文件',
        type: 'error',
        offset: window.innerHeight / 2,
        duration:800
      })
    }else{
      let array =[]
      activeArray.value.forEach(key=>{
        array.push(urls.value[key])
      })
      emit('showimgs',array)
    }
 
}
//选择图片
const urls = ref([])//图片渲染桌面数据
interface cinemaImgts {
  name:String,
  image:String,
  type_id:String,
  type_level:Number,
  create_time:String
}
const cinemaImg = reactive<cinemaImgts>({
  name:'',
  image:'',
  type_id:'',
  type_level:0,
  create_time:''
})
const successImg = async(res:any,file:object)=>{//成功保存图片路径后的回调
  try{
    cinemaImg.create_time = dayjs().format('YYYY-MM-DD HH:mm:ss')
    cinemaImg.name=file.name
    cinemaImg.image=file.response.data.data
    const result = await addcinemaImg(cinemaImg)//保存图片
    if(result.data.data.status==200){
      ElMessage.success({
        message: '图片上传成功',
        type: 'success',
        offset: window.innerHeight / 2,
      })
      //重新获取图片
      findcinemaImg()
      findcinemaImglength()
    }

  }catch(err){
    console.log(err)
  }
}

const paginaton = reactive({//分页数据
  page:1,
  limit:20,
  total:0,
  id:''
})
const findcinemaImg = async()=>{//获取图片
  try{
    const res = await findCinemaImg(paginaton)
    if(res.data.data.status==200){
      urls.value=res.data.data.data
      urls.value.filter(item=>item.image=import.meta.env.VITE__APP_SERVICE_URL+item.image)
    }
  }catch(err){
    console.log(err)
  }
}
const findcinemaImglength  =async()=>{//获取总共图片数据长度
  try{
    const res = await findCinemaImglength(paginaton)
    if(res.data.data.status==200){
      paginaton.total=res.data.data.data
    }
  }catch(err){
    console.log(err)
  }
}
//图片操作
const activeArray = ref([])
const addactive = (index:number) => {
  document.querySelectorAll('.imagebox')[index].classList.toggle('active')
  const Aindex = activeArray.value.indexOf(index)
  Aindex == -1 ? activeArray.value.push(index) : activeArray.value.splice(Aindex, 1)
}
const delcinemaimg = async()=>{//删除图片
  try{
    if(activeArray.value.length==0){
      ElMessage.error({
        message: '请选择要操作的文件',
        type: 'error',
        offset: window.innerHeight / 2,
        duration:800
      })
    }else{
      let array =[]
      activeArray.value.forEach(key=>{
        array.push(urls.value[key]._id)
      })
      const res= await delCinemaImg(array)
      if(res.data.data.status==200){
        ElMessage.success({
          message: '删除成功',
          type: 'success',
          offset: window.innerHeight / 2,
          duration:800
        })
        activeArray.value=[]
        findcinemaImg()
        findcinemaImglength()
      }
    }
  }catch(err){
    console.log(err)
  }
}
const changeImage = async()=>{//传递父组件image
  try{
    findcinemaImg()
  }catch(err){
    console.log(err)
  }
}
</script>

<style scoped lang="scss">
:deep(.el-dialog__body) {
  padding: 0;
}

.uploadimg {
  position: relative;
  display: flex;
  background: #fff;
  height: 100%;

  &__left {
    width: 210px;
    border-right: 2px solid #ddd;
  }

  &__right {
    display: flex;
    flex-direction: column;
    flex: 1;
    text-align: left;

    &__header {
      border-bottom: 2px solid #ddd;
      padding: 5px 10px;

      .upload-demo {
        display: inline-flex;
        vertical-align: middle;
        margin: 0 12px;
      }
    }

    &__box {
      display: flex;
      flex: 1;
      flex-wrap: wrap;
      text-align: center;
      padding: 20px;

      .active {
        border: 2px solid #ddd;
        background: #f1f5fa;
      }

      .imagebox {
        position: relative;
        width: 125px;
        height: 125px;
        border-radius: 5px;
        border: 2px solid #ddd;
        margin: 5px 0 0 10px;

        &:hover {
          cursor: pointer;
          background: #f1f5fa;
        }

        .text {
          position: relative;
          top: -5px;
          height: 20px;
          line-height: 20px;
          padding: 0 5px;
          text-overflow: ellipsis;
          overflow: hidden;

          &:hover {
            color: #bbb;
          }
        }
      }

      .el-image {
        margin: 9px auto 0;
        width: 84px;
        height: 84px;
        background-repeat: no-repeat;
        overflow: hidden;
      }
    }

    &__bottom {
      bottom: 0;
      text-align: left;
      border-top: 2px solid #ddd;
      padding: 5px 10px;

      .el-pagination {
        display: inline-flex;
        margin-left: 20px;
      }
    }
  }
}
</style>