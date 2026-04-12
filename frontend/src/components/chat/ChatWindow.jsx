import { useState, useRef, useEffect } from 'react';
import { Send, RotateCcw } from 'lucide-react';
import MessageBubble from './MessageBubble';

export default function ChatWindow({ messages, isLoading, error, onSend, onReset }) {
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input.trim());
    setInput('');
  };

  const suggestions = [
    'What units do you have available?',
    'What is the pet policy?',
    'I need to submit a maintenance request',
    'Tell me about the amenities',
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-brand-100 flex items-center justify-center mb-4">
              <span className="text-3xl">🏠</span>
            </div>
            <h2 className="font-display text-2xl text-surface-900 mb-2">
              Welcome to Greenfield
            </h2>
            <p className="text-surface-300 text-sm mb-6 max-w-sm">
              I'm your AI leasing assistant. Ask me about available units, lease terms,
              amenities, or schedule a viewing.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => onSend(s)}
                  className="text-left text-xs px-3 py-2.5 rounded-xl border border-surface-200 
                    bg-white hover:bg-brand-50 hover:border-brand-300 
                    text-surface-800 transition-all duration-200"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex gap-3 message-enter">
            <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
              <span className="text-sm">🤖</span>
            </div>
            <div className="bg-white border border-surface-200 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-brand-400 typing-dot" />
                <div className="w-2 h-2 rounded-full bg-brand-400 typing-dot" />
                <div className="w-2 h-2 rounded-full bg-brand-400 typing-dot" />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mx-auto max-w-md bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm message-enter">
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-surface-200 bg-white p-3">
        <form onSubmit={handleSubmit} className="flex gap-2 items-center">
          {messages.length > 0 && (
            <button
              type="button"
              onClick={onReset}
              className="p-2 rounded-xl text-surface-300 hover:text-surface-800 hover:bg-surface-100 transition-colors"
              title="New conversation"
            >
              <RotateCcw size={18} />
            </button>
          )}
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about units, policies, or schedule a viewing..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-surface-100 border border-transparent 
              focus:border-brand-400 focus:bg-white focus:outline-none 
              text-sm transition-all placeholder:text-surface-300"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-xl bg-brand-600 text-white 
              hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed 
              transition-all active:scale-95"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
