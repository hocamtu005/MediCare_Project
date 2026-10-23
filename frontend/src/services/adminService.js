import axios from 'axios';
const API_URL = 'http://localhost:8080'; // Thay bằng domain cấu hình của bạn

export const getStaffList = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/admin/staff`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const toggleUserStatus = async (userId) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/admin/staff/${userId}/toggle-status`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Thêm vào dưới cùng file adminService.js
export const createStaff = async (data) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/admin/staff`, data, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const updateStaff = async (userId, data) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/admin/staff/${userId}`, data, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// ================= API CHUYÊN KHOA =================
export const getSpecialties = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/admin/specialties`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const createSpecialty = async (data) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/admin/specialties`, data, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const updateSpecialty = async (id, data) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/admin/specialties/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const toggleSpecialtyStatus = async (id) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/admin/specialties/${id}/toggle-status`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const deleteSpecialty = async (id) => {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_URL}/admin/specialties/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// ================= API CƠ SỞ (CLINIC) =================
export const getClinics = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/admin/clinics`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const createClinic = async (data) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/admin/clinics`, data, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const updateClinic = async (id, data) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/admin/clinics/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const toggleClinicStatus = async (id) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/admin/clinics/${id}/toggle-status`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// ================= API PHÒNG KHÁM (ROOM) =================
export const getRooms = async (clinicId) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/admin/clinics/${clinicId}/rooms`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const createRoom = async (clinicId, data) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/admin/clinics/${clinicId}/rooms`, data, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const deleteRoom = async (clinicId, roomId) => {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_URL}/admin/clinics/${clinicId}/rooms/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const updateRoom = async (clinicId, roomId, data) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/admin/clinics/${clinicId}/rooms/${roomId}`, data, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// ================= API LỊCH LÀM VIỆC (SCHEDULE) =================
export const getAllSchedules = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/admin/schedules`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const createSchedule = async (data) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/admin/schedules`, data, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const deleteSchedule = async (id) => {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_URL}/admin/schedules/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const getAdminPatients = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/admin/records/patients`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const getAdminAppointments = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/admin/records/appointments`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const getAdminDashboardStats = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/admin/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Thêm vào cuối file adminService.js

export const getPatientEMR = async (patientId) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/admin/records/patients/${patientId}/emr`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const updateAppointmentStatus = async (appointmentId, status) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/admin/records/appointments/${appointmentId}/status?status=${status}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const deleteStaff = async (userId) => {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_URL}/admin/staff/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};