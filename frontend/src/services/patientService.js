import axios from 'axios';

// Thay đổi cổng và domain tùy theo cấu hình của bạn (mặc định là 8080)
const API_URL = 'http://localhost:8080/api/v1';

export const getPatientProfile = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/patient/profile`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const updatePatientProfile = async (data, file) => {
    const token = localStorage.getItem('token');
    
    const formData = new FormData();
    // Đảm bảo không gửi giá trị undefined/null để tránh lỗi Spring Boot
    formData.append('fullName', data.fullName || '');
    formData.append('phone', data.phone || '');
    formData.append('gender', data.gender || '');
    formData.append('dob', data.dateOfBirth || '');
    formData.append('idNumber', data.idNumber || '');
    formData.append('address', data.address || '');
    formData.append('bloodType', data.bloodType || '');
    formData.append('allergies', data.allergies || '');
    formData.append('chronicConditions', data.chronicConditions || '');
    
    if (file) formData.append('file', file);
    if (data.avatarUrl) formData.append('avatarUrl', data.avatarUrl);

    const response = await axios.post(`${API_URL}/patient/profile/update`, formData, { 
        headers: { Authorization: `Bearer ${token}` } 
    });
    return response.data;
};

export const getDoctorsList = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/patient/doctors`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const bookAppointment = async (doctorId, date, time, reason) => {
    const token = localStorage.getItem('token');
    // Mã hóa tham số reason để tránh lỗi font chữ tiếng Việt trên URL
    const response = await axios.post(`${API_URL}/patient/book?doctorId=${doctorId}&date=${date}&time=${time}&reason=${encodeURIComponent(reason)}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};