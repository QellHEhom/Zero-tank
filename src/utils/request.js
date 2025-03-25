import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://localhost:3030/server/admin",
});
// 请求拦截器
axiosInstance.interceptors.request
  .use
  //   (config) => {
  //     // 可以在这里添加 Token 或其他请求配置
  //     const token = localStorage.getItem("token");
  //     if (token) {
  //       config.headers.Authorization = `Bearer ${token}`;
  //     }
  //     return config;
  //   },
  //   (error) => Promise.reject(error)
  ();

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    const res = response;
    if (res.status !== 200) {
      // 判断是否登入或TOKEN失效
      console.log("请求出错了");
    } else {
      return res;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);
const request = {
  get: (url, params, headers = {}) => {
    return axiosInstance.get(url, { params, headers });
  },
  post: (url, data, headers = {}) => {
    return axiosInstance.post(url, data, { headers });
  },
  put: (url, data, headers = {}) => {
    return axiosInstance.put(url, data, { headers });
  },
  delete: (url, params, headers = {}) => {
    return axiosInstance.delete(url, { params, headers });
  },
};

export default request;
