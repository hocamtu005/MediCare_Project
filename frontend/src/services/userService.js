import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1';

// Gọi API lấy lịch khám (Để lát nữa gắn vào trang Tổng quan)
export const getMyAppointments = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/appointments/my-appointments`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Gọi API lấy và cập nhật Profile
export const getUserProfile = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/users/profile`, { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
};

export const updateUserProfile = async (data) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/users/profile`, data, { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
};

export const changePassword = async (data) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/users/change-password`, data, { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
};

export const cancelAppointment = async (id) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/appointments/${id}/cancel`, {}, { 
        headers: { Authorization: `Bearer ${token}` } 
    });
    return response.data;
};