import {
  Home,
  Calendar,
  Wrench,
  UserPlus,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

const TOOL_META = {
  check_availability: {
    label: 'Unit Search',
    icon: Home,
    color: 'text-blue-600 bg-blue-50 border-blue-200',
  },
  schedule_viewing: {
    label: 'Viewing Booked',
    icon: Calendar,
    color: 'text-brand-600 bg-brand-50 border-brand-200',
  },
  submit_maintenance: {
    label: 'Maintenance Ticket',
    icon: Wrench,
    color: 'text-amber-600 bg-amber-50 border-amber-200',
  },
  collect_prospect_info: {
    label: 'Lead Captured',
    icon: UserPlus,
    color: 'text-purple-600 bg-purple-50 border-purple-200',
  },
};

export default function ToolResultCard({ tool, result }) {
  const meta = TOOL_META[tool] || {
    label: tool,
    icon: CheckCircle,
    color: 'text-gray-600 bg-gray-50 border-gray-200',
  };
  const Icon = meta.icon;
  const success = result?.success;

  if (tool === 'check_availability' && success && Array.isArray(result.data)) {
    return (
      <div className={`rounded-lg border p-3 mt-2 ${meta.color}`}>
        <div className="flex items-center gap-2 mb-2">
          <Icon size={16} />
          <span className="text-sm font-semibold">{meta.label}</span>
          <span className="text-xs opacity-70">
            {result.data.length} unit{result.data.length !== 1 ? 's' : ''} found
          </span>
        </div>
        <div className="space-y-2">
          {result.data.map((unit) => (
            <div
              key={unit.unit_id}
              className="bg-white/60 rounded-md p-2 text-xs grid grid-cols-2 gap-1"
            >
              <span className="font-semibold">Unit {unit.unit_id}</span>
              <span>${unit.rent}/mo</span>
              <span>{unit.bedrooms === 0 ? 'Studio' : `${unit.bedrooms} BR`} / {unit.bathrooms} BA</span>
              <span>{unit.sqft} sqft</span>
              <span className="col-span-2 text-[11px] opacity-70">
                Available: {unit.available_date} · Floor {unit.floor}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border p-3 mt-2 ${meta.color}`}>
      <div className="flex items-center gap-2">
        {success ? <Icon size={16} /> : <AlertCircle size={16} />}
        <span className="text-sm font-semibold">{meta.label}</span>
        {success && (
          <CheckCircle size={14} className="text-green-500 ml-auto" />
        )}
      </div>
      {success && result.data && (
        <div className="mt-2 text-xs space-y-0.5 opacity-80">
          {Object.entries(result.data)
            .filter(([k]) => !['created_at'].includes(k))
            .map(([key, val]) => (
              <div key={key}>
                <span className="font-medium">{key.replace(/_/g, ' ')}:</span>{' '}
                {String(val)}
              </div>
            ))}
        </div>
      )}
      {!success && result?.error && (
        <p className="mt-1 text-xs text-red-600">{result.error}</p>
      )}
    </div>
  );
}
