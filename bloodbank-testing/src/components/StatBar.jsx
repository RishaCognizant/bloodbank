export default function StatBar({ total, passed, failed, skipped }) {
  const passW = total ? (passed / total) * 100 : 0;
  const failW = total ? (failed / total) * 100 : 0;
  const skipW = total ? (skipped / total) * 100 : 0;

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
        <Chip label="Total" value={total} color="#64748b" />
        <Chip label="Passed" value={passed} color="#22c55e" />
        <Chip label="Failed" value={failed} color="#ef4444" />
        <Chip label="Skipped" value={skipped} color="#f59e0b" />
      </div>
      <div style={{
        height: 6, borderRadius: 3, background: '#1e1e2e',
        display: 'flex', overflow: 'hidden'
      }}>
        <div style={{ width: `${passW}%`, background: '#22c55e', transition: 'width 0.5s' }} />
        <div style={{ width: `${failW}%`, background: '#ef4444', transition: 'width 0.5s' }} />
        <div style={{ width: `${skipW}%`, background: '#f59e0b', transition: 'width 0.5s' }} />
      </div>
    </div>
  );
}

function Chip({ label, value, color }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      background: '#1a1a27', border: '1px solid #252535',
      borderRadius: 6, padding: '5px 10px'
    }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block' }} />
      <span style={{ fontSize: 12, color: '#94a3b8' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color }}>{value}</span>
    </div>
  );
}
