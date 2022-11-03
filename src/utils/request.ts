import axios from 'axios'

const service = axios.create({
  baseURL: 'https://book.youbaobao.xyz:18082',
  timeout: 5000
})

service.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response) => {
    const res = response.data

    if (response.status === 200) {
      if (res.name && res.message) {
        return Promise.reject(new Error(res.message))
      }
      return res
    } else {
      const errMsg = res.msg || '请求失败'
      return Promise.reject(new Error(errMsg))
    }
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default service
