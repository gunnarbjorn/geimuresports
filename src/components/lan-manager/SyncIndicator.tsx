type Status = 'synced' | 'syncing' | 'offline';

const cfg: Record<Status, { color: string; label: string }> = {
  synced: { color: '#22c55e', label: 'Synced' },
  syncing: { color: '#f59e0b', label: 'Syncing…' },
  offline: { color: '#ef4444', label: 'Offline' },
};

export default function SyncIndicator({ status }: { status: Status }) {
  const c = cfg[status];
  return (
    <span className="flex items-center gap-1.5 text-xs font-bold" style={{ color: c.color }}>
      <span
        className={`inline-block w-2 h-2 rounded-full ${status === 'syncing' ? 'animate-pulse' : ''}`}
        style={{ background: c.color }}
      />
      {c.label}
    </span>
  );
}
