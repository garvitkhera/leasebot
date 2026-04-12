import { MessageSquare, ChevronRight } from 'lucide-react';

export default function ConversationList({ conversations, selectedId, onSelect }) {
  if (!conversations?.length) {
    return (
      <div className="text-center py-8 text-surface-300 text-sm">
        No conversations yet. Start chatting to see them here.
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {conversations.map((convo) => {
        const isSelected = convo.session_id === selectedId;
        const date = convo.updated_at
          ? new Date(convo.updated_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
          : '';

        return (
          <button
            key={convo.session_id}
            onClick={() => onSelect(convo.session_id)}
            className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 transition-all ${
              isSelected
                ? 'bg-brand-50 border border-brand-200 text-brand-800'
                : 'hover:bg-surface-100 text-surface-800'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                isSelected ? 'bg-brand-100' : 'bg-surface-100'
              }`}
            >
              <MessageSquare size={14} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {convo.session_id.slice(0, 12)}
              </p>
              <p className="text-[11px] text-surface-300">{date}</p>
            </div>
            <ChevronRight size={14} className="text-surface-300 shrink-0" />
          </button>
        );
      })}
    </div>
  );
}
