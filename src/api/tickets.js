import axios from 'axios';

const API_URL = '/api/tickets';

const getTickets = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const getTicket = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

const createTicket = async (ticketData) => {
  const response = await axios.post(API_URL, ticketData);
  return response.data;
};

const updateTicket = async (id, ticketData) => {
  const response = await axios.put(`${API_URL}/${id}`, ticketData);
  return response.data;
};

const addReply = async (id, replyData) => {
  const response = await axios.post(`${API_URL}/${id}/replies`, replyData);
  return response.data;
};

export default {
  getTickets,
  getTicket,
  createTicket,
  updateTicket,
  addReply
};