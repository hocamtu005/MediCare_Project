import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/booking';

export const getSpecialties = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/specialties`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const getDoctorsBySpecialty = async (specialtyId) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/doctors?specialtyId=${specialtyId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// HÀM MỚI: Lấy slot TRỐNG thực tế từ Database
export const getAvailableSlots = async (doctorId, date) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/available-slots?doctorId=${doctorId}&date=${date}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// HÀM ĐƯỢC CẬP NHẬT CHỐNG TRÙNG LỊCH: Gửi timeSlotId
export const bookAppointment = async (doctorId, timeSlotId, reason) => {
    const token = localStorage.getItem('token');
    
    // Đóng gói Payload theo cấu trúc Database mới
    const payload = {
        doctorId: doctorId,
        timeSlotId: timeSlotId, // Gửi ID của Slot
        reason: reason
    };

    const response = await axios.post(`${API_URL}/create`, payload, {
        headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};

export const cancelAppointment = async (appointmentId) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/cancel/${appointmentId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};