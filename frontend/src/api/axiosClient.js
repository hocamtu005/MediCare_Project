import axios from 'axios';

// Thiết lập thông số mặc định cho mọi request
const axiosClient = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosClient.interceptors.request.use((config) => {
    // Chỉ đính kèm Token nếu URL không phải là auth
    if (!config.url.includes('/auth/')) {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosClient;