import axios from "axios"
import { Message } from '@arco-design/web-vue'

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 5000,
})

instance.interceptors.request.use(
    config => {
        const token = window.localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = token
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

instance.interceptors.response.use(
    response => {
        return response.data
    },
    error => {
        Message.error(error.response.data.detail)
        return Promise.resolve(error.response)
    }
)

export default instance