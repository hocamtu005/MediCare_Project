import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/receptionist';

export const getTodaysAppointments = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/appointments/today`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const checkInPatient = async (id, note) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/appointments/${id}/check-in`, { note }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const processPayment = async (id) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/appointments/${id}/pay`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const savePatientVitals = async (id, vitalsData) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/appointments/${id}/vitals`, vitalsData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const createWalkInAppointment = async (bookingData) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/appointments/walk-in`, bookingData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Gọi API xuất file PDF Biên lai thu tiền
export const downloadReceiptPdf = async (appointmentId) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/appointments/${appointmentId}/receipt`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob' 
    });
    return response.data;
};

// ĐÃ CẬP NHẬT: Thêm tham số date để lọc dữ liệu theo ngày
export const getDashboardStats = async (date) => {
    const token = localStorage.getItem('token');
    const url = date ? `${API_URL}/dashboard/stats?date=${date}` : `${API_URL}/dashboard/stats`;
    const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const getTodaysDoctorSchedules = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/doctors/today`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};