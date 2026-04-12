import { Bot, User, X } from 'lucide-react';

export default function ConversationDetail({ conversation, onClose }) {
  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full text-surface-300 text-sm">
        Select a conversation to view details
      </div>
    );
  }

  const messages = conversation.messages || [];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-200">
        <div>
          <h3 className="font-semibold text-sm text-surface-900">
            Session: {conversation.session_id?.slice(0, 12)}
          </h3>
          <p className="text-xs text-surface-300">{messages.length} messages</p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-300 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => {
          const isUser = msg.role === 'user';
          const toolCalls = msg.tool_calls ? JSON.parse(msg.tool_calls) : [];

          return (
            <div key={i} className={`flex gap-2 ${isUser ? 'flex-row-reverse' : ''}`}>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs ${
                  isUser ? 'bg-surface-800 text-white' : 'bg-brand-100 text-brand-700'
                }`}
              >
                {isUser ? <User size={12} /> : <Bot size={12} />}
              </div>
              <div
                className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-surface-800 text-white rounded-tr-sm'
                    : 'bg-white border border-surface-200 rounded-tl-sm'
                }`}
              >
                {msg.content}
                {toolCalls.length > 0 && (
                  <div className="mt-1.5 pt-1.5 border-t border-surface-200/50">
                    {toolCalls.map((tc, j) => (
                      <span
                        key={j}
                        className="inline-block text-[10px] px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 mr-1"
                      >
                        🔧 {tc.tool}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
