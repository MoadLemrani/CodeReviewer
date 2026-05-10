import axios from 'axios';

const BASE_URL = '/api';

export const submitReview = async (prUrl, context) => {
    const response = await axios.post(`${BASE_URL}/reviews`, {prUrl, context});
    return response.data;
};

export const getReview = async (id) => {
    const response = await axios.get(`${BASE_URL}/reviews/${id}`);
    return response.data;
}