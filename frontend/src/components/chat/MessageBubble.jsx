import ReactMarkdown from 'react-markdown';
import { Bot, User } from 'lucide-react';
import ToolResultCard from './ToolResultCard';

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 message-enter ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${
          isUser
            ? 'bg-surface-800 text-white'
            : 'bg-brand-100 text-brand-700'
        }`}
      >
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      {/* Bubble */}
      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? 'bg-surface-800 text-white rounded-tr-md'
              : 'bg-white border border-surface-200 text-surface-900 rounded-tl-md shadow-sm'
          }`}
        >
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
              strong: ({ children }) => (
                <strong className="font-semibold">{children}</strong>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside mb-1 space-y-0.5">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside mb-1 space-y-0.5">{children}</ol>
              ),
              code: ({ children }) => (
                <code className="bg-black/10 rounded px-1 py-0.5 text-xs font-mono">
                  {children}
                </code>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {/* Tool call results */}
        {message.tool_calls?.length > 0 && (
          <div className="mt-1 space-y-1">
            {message.tool_calls.map((tc, i) => (
              <ToolResultCard key={i} tool={tc.tool} result={tc.result} />
            ))}
          </div>
        )}

        {/* Sources */}
        {message.sources?.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {message.sources.map((src, i) => (
              <span
                key={i}
                className="inline-flex items-center text-[10px] px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200"
              >
                📄 {src}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
