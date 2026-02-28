interface Props {
  admins: { email: string; online_at: string }[];
}

export default function ActiveAdmins({ admins }: Props) {
  if (admins.length === 0) return null;
  return (
    <div className="flex items-center gap-1.5 text-xs text-gray-400">
      <span>👥</span>
      {admins.map(a => (
        <span
          key={a.email}
          className="px-2 py-0.5 rounded-full font-bold"
          style={{ background: '#1a1a1f', border: '1px solid #2a2a30' }}
        >
          {a.email.split('@')[0]}
        </span>
      ))}
    </div>
  );
}
