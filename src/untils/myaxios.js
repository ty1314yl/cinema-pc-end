import axios from 'axios'
const baseurl =import.meta.env.VITE__APP_SERVICE_URL+import.meta.env.VITE__APP_BASE_API
const myaxios = axios.create({
  baseURL:baseurl,
  timeout:5000,
  headers: { // 配置OAuth 2.0的认证头
    'Content-Type': 'application/json;charset=utf-8'
  },
  // withCredentials:true
})
myaxios.interceptors.request.use(config=>{
  return config
},err=>{
  console.log(err)
  return err
})

myaxios.interceptors.response.use(res=>{
  return res
},err=>{
  console.log(err.response.data.error);
})

export  {myaxios,baseurl}
