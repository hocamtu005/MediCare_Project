import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/ai';

export const chatWithAI = async (message) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/chat`, { message }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};