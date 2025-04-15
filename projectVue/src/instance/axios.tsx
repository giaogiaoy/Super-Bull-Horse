import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const http: AxiosInstance = axios.create({
  baseURL: "http://localhost:3000",   // 默认路由前缀
  timeout: 50000, // 设置超时时间
  headers: {
    'Content-Type': 'application/json' // 设置默认请求头
  }
});

// 添加请求拦截器
http.interceptors.request.use((config: AxiosRequestConfig) => {
<<<<<<< HEAD
    // 对token进行处理
    const accessToken = localStorage.getItem('AccessToken');
    const refreshToken = localStorage.getItem('RefreshToken');
    if (accessToken) {
        config.headers!.AccessToken = accessToken;
    }
    if (refreshToken) {
        config.headers!.RefreshToken = refreshToken;
    }
=======
  // 对token进行处理
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  if (accessToken) {
    config.headers!.Authorization = accessToken;
  }
  if (refreshToken) {
    config.headers!.pass = refreshToken;
  }
>>>>>>> 03126b5cc5539eb4f66d2d109870c31fc22ea5b1

  // 在发送请求之前做些什么
  console.log(config);

  return config;
}, (error: AxiosError) => {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
http.interceptors.response.use((response: AxiosResponse) => {
<<<<<<< HEAD
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response;
=======
  console.log(response.data);

  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  return response.data;
>>>>>>> 03126b5cc5539eb4f66d2d109870c31fc22ea5b1
}, async (error: AxiosError) => {
  console.log(error.response);

  const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    try {
      // 假设后端返回的 token 在 data 中
      const { accessToken, refreshToken } = error.response.data as { accessToken: string, refreshToken: string };
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

<<<<<<< HEAD
            originalRequest.headers!.Authorization = accessToken;
            originalRequest.headers!.RefreshToken = refreshToken;
            return http(originalRequest);
        } catch (error) {
            console.log('请重新登录'); // 打印提示信息
            window.location.href = '/login'; // 跳转到登录页面
            return Promise.reject(error);
        }
=======
      originalRequest.headers!.Authorization = accessToken;
      originalRequest.headers!.pass = refreshToken;
      return http(originalRequest);
    } catch (error) {
      console.log('请重新登录'); // 打印提示信息
      window.location.href = '/login'; // 跳转到登录页面
      return Promise.reject(error);
>>>>>>> 03126b5cc5539eb4f66d2d109870c31fc22ea5b1
    }
  }
  console.log(error);
  window.location.href = '/login';
  return Promise.reject(error);
});

export default http;
