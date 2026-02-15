import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    withCredentials: true, //by adding this field browser will send cookies to the server automatically with every request
})

export default axiosInstance
