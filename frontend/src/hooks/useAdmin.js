import { useState, useEffect, useCallback } from 'react';
import {
  getConversations,
  getConversation,
  getAnalytics,
  getDocuments,
  uploadDocument,
  deleteDocument,
} from '../lib/api';

export function useAdmin() {
  const [conversations, setConversations] = useState([]);
  const [selectedConvo, setSelectedConvo] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [convos, stats, docs] = await Promise.all([
        getConversations(),
        getAnalytics(),
        getDocuments(),
      ]);
      setConversations(convos);
      setAnalytics(stats);
      setDocuments(docs);
    } catch (err) {
      setError('Failed to load dashboard data. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const selectConversation = useCallback(async (sessionId) => {
    try {
      const data = await getConversation(sessionId);
      setSelectedConvo(data);
    } catch {
      setError('Failed to load conversation');
    }
  }, []);

  const handleUpload = useCallback(async (file) => {
    try {
      const result = await uploadDocument(file);
      setDocuments((prev) => [result, ...prev]);
      return result;
    } catch (err) {
      throw new Error(err.response?.data?.detail || 'Upload failed');
    }
  }, []);

  const handleDelete = useCallback(async (docId) => {
    try {
      await deleteDocument(docId);
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
    } catch {
      setError('Failed to delete document');
    }
  }, []);

  return {
    conversations,
    selectedConvo,
    selectConversation,
    analytics,
    documents,
    loading,
    error,
    refresh,
    handleUpload,
    handleDelete,
    setSelectedConvo,
  };
}
