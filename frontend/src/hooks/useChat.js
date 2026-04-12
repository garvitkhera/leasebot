import { useState, useCallback, useRef } from 'react';
import { sendMessage } from '../lib/api';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [error, setError] = useState(null);
  const abortRef = useRef(false);

  const send = useCallback(async (text) => {
    if (!text.trim() || isLoading) return;

    setError(null);
    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const data = await sendMessage(text, sessionId);

      if (!sessionId) setSessionId(data.session_id);

      const botMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.reply,
        tool_calls: data.tool_calls || [],
        sources: data.sources || [],
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send message. Is the backend running?');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, sessionId]);

  const reset = useCallback(() => {
    setMessages([]);
    setSessionId(null);
    setError(null);
  }, []);

  return { messages, isLoading, error, send, reset, sessionId };
}
