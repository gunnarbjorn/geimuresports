import type { ActivityLogEntry } from '@/hooks/useTournamentRealtime';

interface Props {
  entries: ActivityLogEntry[];
  isOpen: boolean;
  onToggle: () => void;
}

export default function ActivityLog({ entries, isOpen, onToggle }: Props) {
  if (!isOpen) return null;
  return (
    <div
      className="fixed right-0 top-12 bottom-0 w-80 z-30 overflow-auto p-4 flex flex-col gap-2"
      style={{ background: '#0d0d0fee', borderLeft: '1px solid #2a2a30' }}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-sm" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
          📋 AÐGERÐASKRÁ
        </h3>
        <button onClick={onToggle} className="text-gray-500 hover:text-white text-lg">
          ✕
        </button>
      </div>

      {entries.length === 0 && <p className="text-xs text-gray-600">Engar aðgerðir enn.</p>}

      {entries.map(e => (
        <div key={e.id} className="text-xs p-2 rounded" style={{ background: '#1a1a1f' }}>
          <div className="flex items-center gap-1">
            <span className="font-bold text-gray-400">{e.admin_email.split('@')[0]}</span>
            <span className="text-gray-600">·</span>
            <span className="text-gray-300">{e.description}</span>
          </div>
          <p className="text-gray-600 mt-0.5">
            {new Date(e.created_at).toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
        </div>
      ))}
    </div>
  );
}
