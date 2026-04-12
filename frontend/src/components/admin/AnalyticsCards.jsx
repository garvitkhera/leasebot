import { MessageSquare, Users, BarChart3, Clock } from 'lucide-react';

export default function AnalyticsCards({ analytics }) {
  if (!analytics) return null;

  const cards = [
    {
      label: 'Total Conversations',
      value: analytics.total_conversations,
      icon: Users,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Total Messages',
      value: analytics.total_messages,
      icon: MessageSquare,
      color: 'text-brand-600 bg-brand-50',
    },
    {
      label: 'Avg Messages / Chat',
      value: analytics.avg_messages_per_conversation,
      icon: BarChart3,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      label: 'Status',
      value: 'Online',
      icon: Clock,
      color: 'text-green-600 bg-green-50',
      dot: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-surface-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${card.color}`}>
                <Icon size={18} />
              </div>
              {card.dot && (
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 pulse-glow" />
              )}
            </div>
            <p className="text-2xl font-semibold text-surface-900">{card.value}</p>
            <p className="text-xs text-surface-300 mt-0.5">{card.label}</p>
          </div>
        );
      })}
    </div>
  );
}
