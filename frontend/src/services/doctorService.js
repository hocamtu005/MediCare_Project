import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1';

export const getDoctorSchedule = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/doctor/schedule`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Gọi chuẩn API tạo MedicalRecord của bạn
export const createMedicalRecord = async (recordData) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/medical-records/create`, recordData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Cập nhật trạng thái lịch khám (Gọi bệnh nhân, Bỏ qua...)
export const updateAppointmentStatus = async (id, status) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/doctor/appointments/${id}/status?status=${status}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Gọi API Tải PDF
export const downloadPrescriptionPdf = async (appointmentId) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/medical-records/appointment/${appointmentId}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob' // Thuộc tính cực kỳ quan trọng để tải file
    });
    return response.data;
};

// Gọi API Lấy lịch sử EMR của bệnh nhân
export const getPatientMedicalRecords = async (patientId) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/medical-records/patient/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Thiết lập ca làm việc mới
export const createSchedule = async (scheduleData) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/doctor/schedules/create`, scheduleData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Lấy danh sách ca làm việc đã đăng ký
export const getMySchedules = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/doctor/schedules/my-schedules`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const getPendingAppointments = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/doctor/appointments/pending`, { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
};
export const getDoctorProfile = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/doctor/profile`, { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
};
export const updateDoctorProfile = async (phone, bio, file, currentAvatarUrl) => {
    const token = localStorage.getItem('token');
    
    // Gói dữ liệu vào FormData
    const formData = new FormData();
    formData.append('phone', phone);
    formData.append('bio', bio);
    if (file) formData.append('file', file);
    if (currentAvatarUrl) formData.append('avatarUrl', currentAvatarUrl);

    // XÓA dòng 'Content-Type' đi, để Axios tự động sinh Header + Boundary
    const response = await axios.post(`${API_URL}/doctor/profile/update`, formData, { 
        headers: { 
            Authorization: `Bearer ${token}` 
        } 
    });
    return response.data;
};

export const getDashboardStats = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/doctor/dashboard/stats`, { 
        headers: { Authorization: `Bearer ${token}` } 
    });
    return response.data;
};