import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/patient';

export const getMyHealthProfile = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/health-profile`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const updateMyHealthProfile = async (data) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/health-profile`, data, {
        headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};