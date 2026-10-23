import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1';

export const getMyRecords = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/patient/records`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const downloadRecordPdf = async (recordId) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/api/v1/medical-records/${recordId}/pdf`, { // URL MỚI, không có /doctor/
    headers: { Authorization: `Bearer ${token}` },
    responseType: 'blob',
  });
  return response.data;
};