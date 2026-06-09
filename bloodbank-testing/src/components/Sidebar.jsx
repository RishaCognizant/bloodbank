const navItems = [
  { id: 'overview', label: 'Overview', icon: '◈' },
  { id: 'concepts', label: 'Testing Concepts', icon: '📖' },
  { id: 'unit', label: 'Unit Tests', icon: '⬡' },
  { id: 'integration', label: 'Integration Tests', icon: '⬢' },
  { id: 'e2e', label: 'E2E Tests', icon: '◉' },
  { id: 'coverage', label: 'Coverage', icon: '◎' },
];

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside style={{
      width: '220px', minHeight: '100vh', background: '#111118',
      borderRight: '1px solid #1e1e2e', display: 'flex',
      flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 0
    }}>
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid #1e1e2e' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>🩸</span>
          <div>
            <div style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 13, lineHeight: 1.2 }}>Blood Bank</div>
            <div style={{ color: '#94a3b8', fontSize: 11 }}>Test Suite v1.0</div>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '12px 8px' }}>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              width: '100%', textAlign: 'left', padding: '9px 12px',
              borderRadius: 6, border: 'none', cursor: 'pointer',
              marginBottom: 2, display: 'flex', alignItems: 'center', gap: 10,
              background: activePage === item.id ? '#1e2035' : 'transparent',
              color: activePage === item.id ? '#e2e8f0' : '#64748b',
              borderLeft: activePage === item.id ? '2px solid #dc2626' : '2px solid transparent',
              fontSize: 13, fontWeight: activePage === item.id ? 600 : 400,
              transition: 'all 0.15s', fontFamily: 'Inter, sans-serif'
            }}
          >
            <span style={{ fontSize: 14 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div style={{ padding: '12px 16px', borderTop: '1px solid #1e1e2e' }}>
        <div style={{ fontSize: 11, color: '#475569', marginBottom: 2 }}>Framework</div>
        <div style={{ fontSize: 11, color: '#64748b' }}>JUnit 5 · Mockito · Cypress</div>
        <div style={{ fontSize: 11, color: '#64748b' }}>Jasmine · Karma · MockMvc</div>
      </div>
    </aside>
  );
}
