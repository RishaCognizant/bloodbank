import { useState } from 'react';
import { integrationTests } from '../data/integrationTests';
import TestCard from '../components/TestCard';
import StatBar from '../components/StatBar';

const groups = ['All', 'Authentication API', 'Blood Request API', 'Inventory API', 'Donation API', 'Admin API'];

const methodColors = {
  GET: { bg: '#0c2a1a', border: '#166534', text: '#4ade80' },
  POST: { bg: '#0a1628', border: '#1e3a5f', text: '#60a5fa' },
  PUT: { bg: '#1c1400', border: '#713f12', text: '#fbbf24' },
  DELETE: { bg: '#2d0a0a', border: '#7f1d1d', text: '#f87171' },
};

export default function IntegrationTests() {
  const [filter, setFilter] = useState('All');

  const stats = {
    total: integrationTests.length,
    passed: integrationTests.filter(t => t.status === 'PASS').length,
    failed: integrationTests.filter(t => t.status === 'FAIL').length,
    skipped: integrationTests.filter(t => t.status === 'SKIP').length,
  };

  const filtered = filter === 'All' ? integrationTests : integrationTests.filter(t => t.group === filter);

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1000 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ color: '#e2e8f0', fontSize: 22, fontWeight: 700, margin: 0 }}>Integration Tests</h1>
        <p style={{ color: '#64748b', fontSize: 13, marginTop: 6 }}>
          API endpoint tests using Spring MockMvc with a real H2 in-memory database — verifying controller, service, and repository layers together.
        </p>
      </div>

      <StatBar {...stats} />

      {/* Setup info */}
      <div style={{
        background: '#0f0f1a', border: '1px solid #1e1e2e', borderRadius: 8,
        padding: '12px 16px', marginBottom: 20, display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr', gap: 12
      }}>
        {[
          { label: 'Test Context', value: '@SpringBootTest + @AutoConfigureMockMvc' },
          { label: 'Database', value: 'H2 In-Memory (test profile)' },
          { label: 'Auth', value: 'Real JWT tokens generated in @BeforeEach' },
        ].map(i => (
          <div key={i.label}>
            <div style={{ fontSize: 11, color: '#475569', marginBottom: 2 }}>{i.label}</div>
            <div style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'JetBrains Mono, monospace' }}>{i.value}</div>
          </div>
        ))}
      </div>

      {/* Group filter */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
        {groups.map(g => (
          <button key={g} onClick={() => setFilter(g)} style={{
            padding: '4px 12px', borderRadius: 20, border: '1px solid',
            borderColor: filter === g ? '#3b82f6' : '#252535',
            background: filter === g ? '#0a1628' : 'transparent',
            color: filter === g ? '#60a5fa' : '#64748b',
            fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, sans-serif'
          }}>{g}</button>
        ))}
      </div>

      {/* Tests with method badge */}
      <div>
        {filtered.map(test => (
          <div key={test.id} style={{
            background: '#1a1a27', border: '1px solid #252535',
            borderRadius: 8, marginBottom: 10, overflow: 'hidden'
          }}>
            <IntegrationTestCard test={test} />
          </div>
        ))}
      </div>

      {/* Bug note */}
      {(filter === 'All' || filter === 'Admin API') && (
        <div style={{
          marginTop: 16, background: '#2d0a0a', border: '1px solid #7f1d1d',
          borderRadius: 8, padding: '12px 16px'
        }}>
          <div style={{ fontSize: 12, color: '#f87171', fontWeight: 600, marginBottom: 4 }}>
            🐛 Known Bug — IT-12
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>
            <strong>Toggle User Status:</strong> After admin deactivates a user, the user can still successfully log in.
            The <code style={{ fontFamily: 'monospace', color: '#c792ea' }}>AuthService.login()</code> method
            does not check <code style={{ fontFamily: 'monospace', color: '#c792ea' }}>user.isActive()</code>.
            <br />
            <strong>Fix:</strong> Add active status check in AuthService before generating JWT token.
          </div>
        </div>
      )}
    </div>
  );
}

function IntegrationTestCard({ test }) {
  const [expanded, setExpanded] = useState(false);
  const mc = methodColors[test.method] || methodColors.GET;
  const sc = test.status === 'PASS'
    ? { bg: '#052e16', border: '#166534', text: '#4ade80', dot: '#22c55e' }
    : test.status === 'FAIL'
    ? { bg: '#2d0a0a', border: '#7f1d1d', text: '#f87171', dot: '#ef4444' }
    : { bg: '#1c1400', border: '#713f12', text: '#fbbf24', dot: '#f59e0b' };

  return (
    <>
      <div
        style={{ padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}
        onClick={() => setExpanded(e => !e)}
      >
        <div style={{ marginTop: 3, width: 8, height: 8, borderRadius: '50%', background: sc.dot, flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{
              fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 3,
              background: mc.bg, border: `1px solid ${mc.border}`, color: mc.text,
              fontFamily: 'monospace'
            }}>{test.method}</span>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
              color: '#94a3b8'
            }}>{test.endpoint}</span>
            <span style={{ fontSize: 10, color: '#475569', background: '#0f0f1a', padding: '1px 6px', borderRadius: 3, fontFamily: 'monospace' }}>{test.id}</span>
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{test.description}</div>
          <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {test.assertions.map((a, i) => (
              <span key={i} style={{
                fontSize: 10, background: '#0f0f1a', color: '#94a3b8',
                padding: '2px 7px', borderRadius: 3, border: '1px solid #1e1e2e'
              }}>✓ {a}</span>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <span style={{
            fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 4,
            background: sc.bg, border: `1px solid ${sc.border}`, color: sc.text
          }}>{test.status}</span>
          <span style={{ color: '#475569', fontSize: 12 }}>{expanded ? '▲' : '▼'}</span>
        </div>
      </div>
      {expanded && (
        <div style={{ borderTop: '1px solid #1e1e2e', background: '#0d0d18', padding: '14px 16px', overflowX: 'auto' }}>
          <pre style={{
            margin: 0, fontFamily: 'JetBrains Mono, monospace',
            fontSize: 12, lineHeight: 1.7, color: '#e2e8f0', whiteSpace: 'pre', tabSize: 4
          }}>{test.code}</pre>
        </div>
      )}
    </>
  );
}
