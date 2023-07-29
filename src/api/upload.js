import {myaxios} from "../untils/myaxios";
export  const uploadcinemaimg =  ()=>{//写入图片到文件夹
  return myaxios({
    method:'post',
    url:'/uploadcinemaimg'
  })
}
export  const delcinemaimg =  ()=>{
  return myaxios({
    method:'get',
    url:'/delcinemaimg'
  })
}