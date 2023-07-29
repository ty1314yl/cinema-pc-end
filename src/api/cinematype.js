import {myaxios} from "../untils/myaxios";
export const addcinemaImg = (data)=>{
  return myaxios({
    method:'post',
    url:'/addcinemaImg',
    data
  })
}
export  const findCinemaType =  ()=>{//查找影片图片分类
  return myaxios({
    method:'get',
    url:'/findCinemaType'
  })
}
export  const createCinemaType =  (data)=>{//创建影片图片分类
  return myaxios({
    method:'post',
    url:'/createCinemaType',
    data
  })
}
export  const findCinemaImg = (data)=>{//创建影片图片分类
  return myaxios({
    method:'get',
    url:'/findCinemaImg',
    params:data
  })
}
export  const findCinemaImglength = (data)=>{//创建影片图片分类
  return myaxios({
    method:'get',
    url:'/findCinemaImglength',
    params:data
  })
}
export  const delCinemaType = (data)=>{//删除分类
  return myaxios({
    method:'get',
    url:'/delCinemaType',
    params:data
  })
}
export  const delCinemaImg = (data)=>{//删除图片
  return myaxios({
    method:'post',
    url:'/delCinemaImg',
    data
  })
}