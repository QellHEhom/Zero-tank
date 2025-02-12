import axios from 'axios'
/* axios({
//   url:'请求的路径
//   method:'请求的方式，默认是get'
//   params:{} //get请求方式:前端给后端传递的数据
//   data:{} //post请求方式:前端给后端传递的数据
//   headers:{}//自定义请求头
//   timeout:1000//如果请求时间超过timeout的值，则请求会被中断，
//   responseType:'默认是json格式数据"//响应的数据类型，
*/
const request = axios.create({
  baseURL: 'https://localhost:3030/server/api',
  responseType: 'json',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
})
// 请求拦截器
request.interceptors.request.use()

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const res = response
    if (res.status !== 200) {
      // 判断是否登入或TOKEN失效
      console.log('请求出错了')
    } else {
      return res.data
    }
  },
  (error) => {
    // 目前发现三种情况会进入这里：
    // 1. http状态码非2开头的都会进来这里，如404,500等
    // 2. 取消请求也会进入这里，CancelToken，可以用axios.isCancel(err)来判断是取消的请求
    // 3. 请求运行有异常也会进入这里，如故意将headers写错：axios.defaults.headers = '123',或者在request中有语法或解析错误也会进入这里
    // 进入这里意味着请求失败，axios会进入catch分支
    console.log('请求出错了')

    return Promise.reject(error)
  },
)

export default request
