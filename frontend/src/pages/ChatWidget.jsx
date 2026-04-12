import { useChat } from '../hooks/useChat';
import ChatWindow from '../components/chat/ChatWindow';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Building2 } from 'lucide-react';

export default function ChatWidget() {
  const { messages, isLoading, error, send, reset } = useChat();

  return (
    <div className="h-screen flex flex-col bg-surface-50">
      {/* Header */}
      <header className="bg-white border-b border-surface-200 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center">
            <Building2 size={18} className="text-white" />
          </div>
          <div>
            <h1 className="font-display text-lg leading-tight text-surface-900">
              Greenfield Apartments
            </h1>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 pulse-glow" />
              <span className="text-[11px] text-surface-300">AI Leasing Assistant</span>
            </div>
          </div>
        </div>

        <Link
          to="/admin"
          className="flex items-center gap-1.5 text-xs text-surface-300 hover:text-surface-800 
            px-3 py-1.5 rounded-lg hover:bg-surface-100 transition-colors"
        >
          <LayoutDashboard size={14} />
          Admin
        </Link>
      </header>

      {/* Chat */}
      <div className="flex-1 overflow-hidden">
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          error={error}
          onSend={send}
          onReset={reset}
        />
      </div>
    </div>
  );
}
