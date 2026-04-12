import { useAdmin } from '../hooks/useAdmin';
import AnalyticsCards from '../components/admin/AnalyticsCards';
import ConversationList from '../components/admin/ConversationList';
import ConversationDetail from '../components/admin/ConversationDetail';
import DocumentManager from '../components/admin/DocumentManager';
import { Link } from 'react-router-dom';
import {
  MessageCircle,
  RefreshCcw,
  Loader2,
  Building2,
  AlertCircle,
} from 'lucide-react';

export default function AdminDashboard() {
  const {
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
  } = useAdmin();

  return (
    <div className="h-screen flex flex-col bg-surface-50">
      {/* Header */}
      <header className="bg-white border-b border-surface-200 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-surface-900 flex items-center justify-center">
            <Building2 size={18} className="text-white" />
          </div>
          <div>
            <h1 className="font-display text-lg leading-tight text-surface-900">
              LeaseBot Admin
            </h1>
            <span className="text-[11px] text-surface-300">Property Management Dashboard</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={refresh}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs text-surface-300 hover:text-surface-800 
              px-3 py-1.5 rounded-lg hover:bg-surface-100 transition-colors disabled:opacity-40"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCcw size={14} />}
            Refresh
          </button>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs bg-brand-600 text-white 
              px-3 py-1.5 rounded-lg hover:bg-brand-700 transition-colors"
          >
            <MessageCircle size={14} />
            Open Chat
          </Link>
        </div>
      </header>

      {/* Error banner */}
      {error && (
        <div className="mx-6 mt-4 flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Dashboard content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Analytics */}
        <AnalyticsCards analytics={analytics} />

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Conversations panel */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-surface-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-surface-200">
                <h3 className="font-semibold text-sm text-surface-900">
                  Conversations
                </h3>
              </div>
              <div className="p-2 max-h-[400px] overflow-y-auto">
                <ConversationList
                  conversations={conversations}
                  selectedId={selectedConvo?.session_id}
                  onSelect={selectConversation}
                />
              </div>
            </div>
          </div>

          {/* Conversation detail */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-xl border border-surface-200 h-[460px] overflow-hidden">
              <ConversationDetail
                conversation={selectedConvo}
                onClose={() => setSelectedConvo(null)}
              />
            </div>
          </div>

          {/* Documents */}
          <div className="lg:col-span-4">
            <DocumentManager
              documents={documents}
              onUpload={handleUpload}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
