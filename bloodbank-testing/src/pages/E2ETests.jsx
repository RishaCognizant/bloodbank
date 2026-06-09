import { useState } from 'react';
import { e2eTests } from '../data/e2eTests';
import StatBar from '../components/StatBar';

const categories = ['All', 'Authentication', 'User Flow', 'Admin Flow', 'Security'];

const statusConfig = {
  PASS: { bg: '#052e16', border: '#166534', text: '#4ade80', dot: '#22c55e' },
  FAIL: { bg: '#2d0a0a', border: '#7f1d1d', text: '#f87171', dot: '#ef4444' },
  SKIP: { bg: '#1c1400', border: '#713f12', text: '#fbbf24', dot: '#f59e0b' },
};

export default function E2ETests() {
  const [filter, setFilter] = useState('All');
  const [expanded, setExpanded] = useState(null);

  const stats = {
    total: e2eTests.length,
    passed: e2eTests.filter(t => t.status === 'PASS').length,
    failed: e2eTests.filter(t => t.status === 'FAIL').length,
    skipped: e2eTests.filter(t => t.status === 'SKIP').length,
  };

  const filtered = filter === 'All' ? e2eTests : e2eTests.filter(t => t.category === filter);

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1000 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ color: '#e2e8f0', fontSize: 22, fontWeight: 700, margin: 0 }}>End-to-End Tests</h1>
        <p style={{ color: '#64748b', fontSize: 13, marginTop: 6 }}>
          Full browser automation tests using Cypress 13 — simulating real user journeys from login to completing core blood bank workflows.
        </p>
      </div>

      <StatBar {...stats} />

      {/* Cypress setup info */}
      <div style={{
        background: '#0f0f1a', border: '1px solid #1e1e2e', borderRadius: 8,
        padding: '14px 16px', marginBottom: 20, display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12
      }}>
        {[
          { label: 'Framework', value: 'Cypress 13.x' },
          { label: 'Browser', value: 'Chrome (headless CI)' },
          { label: 'Base URL', value: 'http://localhost:4200' },
          { label: 'Custom Commands', value: 'cy.login(), cy.adminLogin(), cy.logout()' },
        ].map(i => (
          <div key={i.label}>
            <div style={{ fontSize: 11, color: '#475569', marginBottom: 2 }}>{i.label}</div>
            <div style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'JetBrains Mono, monospace', wordBreak: 'break-all' }}>{i.value}</div>
          </div>
        ))}
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
        {categories.map(c => (
          <button key={c} onClick={() => setFilter(c)} style={{
            padding: '4px 12px', borderRadius: 20, border: '1px solid',
            borderColor: filter === c ? '#06b6d4' : '#252535',
            background: filter === c ? '#061c24' : 'transparent',
            color: filter === c ? '#22d3ee' : '#64748b',
            fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, sans-serif'
          }}>{c}</button>
        ))}
      </div>

      {/* Test cards */}
      {filtered.map(test => {
        const sc = statusConfig[test.status];
        const isOpen = expanded === test.id;
        return (
          <div key={test.id} style={{
            background: '#1a1a27', border: '1px solid #252535',
            borderRadius: 8, marginBottom: 10, overflow: 'hidden'
          }}>
            <div
              style={{ padding: '14px 16px', cursor: 'pointer', display: 'flex', gap: 12 }}
              onClick={() => setExpanded(isOpen ? null : test.id)}
            >
              <div style={{ marginTop: 5, width: 8, height: 8, borderRadius: '50%', background: sc.dot, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: '#e2e8f0', fontWeight: 500 }}>{test.name}</span>
                  <span style={{ fontSize: 10, background: '#061c24', color: '#22d3ee', padding: '1px 7px', borderRadius: 3, border: '1px solid #0e4f5f' }}>
                    {test.category}
                  </span>
                  <span style={{ fontSize: 10, color: '#475569', fontFamily: 'monospace', background: '#0f0f1a', padding: '1px 6px', borderRadius: 3 }}>
                    {test.id}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>{test.description}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <span style={{
                  fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 4,
                  background: sc.bg, border: `1px solid ${sc.border}`, color: sc.text
                }}>{test.status}</span>
                <span style={{ color: '#475569', fontSize: 12 }}>{isOpen ? '▲' : '▼'}</span>
              </div>
            </div>

            {isOpen && (
              <div style={{ borderTop: '1px solid #1e1e2e' }}>
                {/* Test Steps */}
                <div style={{ padding: '12px 16px 0', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {test.steps.map((step, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'flex-start', gap: 6,
                      fontSize: 11, color: '#94a3b8', width: '100%',
                      padding: '3px 0'
                    }}>
                      <span style={{
                        minWidth: 20, height: 20, borderRadius: '50%',
                        background: '#252535', color: '#64748b', fontSize: 10,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 600, flexShrink: 0
                      }}>{i + 1}</span>
                      {step}
                    </div>
                  ))}
                </div>
                {/* Cypress Code */}
                <div style={{ background: '#0d0d18', margin: '12px 0 0', padding: '14px 16px', overflowX: 'auto', maxHeight: 380, overflowY: 'auto' }}>
                  <div style={{ fontSize: 10, color: '#475569', marginBottom: 8, fontFamily: 'monospace' }}>
                    cypress/e2e/{test.id.toLowerCase()}.cy.js
                  </div>
                  <pre style={{
                    margin: 0, fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 12, lineHeight: 1.7, color: '#e2e8f0',
                    whiteSpace: 'pre', tabSize: 2
                  }}>{test.code}</pre>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Cypress custom commands section */}
      <div style={{
        marginTop: 20, background: '#1a1a27', border: '1px solid #252535',
        borderRadius: 8, padding: '16px 20px'
      }}>
        <h3 style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Cypress Custom Commands (cypress/support/commands.js)
        </h3>
        <pre style={{
          margin: 0, fontFamily: 'JetBrains Mono, monospace',
          fontSize: 12, lineHeight: 1.7, color: '#e2e8f0', background: '#0d0d18',
          padding: '14px', borderRadius: 6, overflowX: 'auto'
        }}>{`// Login as regular user via API (bypasses UI for speed)
Cypress.Commands.add('login', (email, password) => {
  cy.request('POST', '/api/auth/login', { email, password })
    .then(({ body }) => {
      localStorage.setItem('token', body.data.token);
      localStorage.setItem('user', JSON.stringify(body.data));
    });
});

// Login as admin
Cypress.Commands.add('adminLogin', () => {
  cy.login('admin@bloodbank.com', 'adminpass');
});

// Clear auth state
Cypress.Commands.add('logout', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
});`}</pre>
      </div>
    </div>
  );
}
