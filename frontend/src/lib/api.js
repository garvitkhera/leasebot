import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// ── Chat ──
export const sendMessage = async (message, sessionId = null) => {
  const { data } = await api.post('/chat', {
    message,
    session_id: sessionId,
  });
  return data;
};

// ── Documents ──
export const uploadDocument = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const getDocuments = async () => {
  const { data } = await api.get('/documents/');
  return data;
};

export const deleteDocument = async (docId) => {
  const { data } = await api.delete(`/documents/${docId}`);
  return data;
};

// ── Conversations ──
export const getConversations = async (limit = 50) => {
  const { data } = await api.get(`/conversations/?limit=${limit}`);
  return data;
};

export const getConversation = async (sessionId) => {
  const { data } = await api.get(`/conversations/${sessionId}`);
  return data;
};

// ── Analytics ──
export const getAnalytics = async () => {
  const { data } = await api.get('/analytics/');
  return data;
};

export default api;
