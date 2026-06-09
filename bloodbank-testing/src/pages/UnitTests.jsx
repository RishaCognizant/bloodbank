import { useState } from 'react';
import { backendUnitTests, frontendUnitTests } from '../data/unitTests';
import TestCard from '../components/TestCard';
import StatBar from '../components/StatBar';

const backendFilters = ['All', 'AuthService', 'BloodRequestService', 'BloodInventoryService', 'DonationService', 'JwtUtils'];
const frontendFilters = ['All', 'AuthService', 'BloodRequestService', 'AuthGuard', 'AdminGuard', 'LoginComponent', 'AuthInterceptor'];

function countStats(tests) {
  return {
    total: tests.length,
    passed: tests.filter(t => t.status === 'PASS').length,
    failed: tests.filter(t => t.status === 'FAIL').length,
    skipped: tests.filter(t => t.status === 'SKIP').length,
  };
}

export default function UnitTests() {
  const [tab, setTab] = useState('backend');
  const [beFilter, setBeFilter] = useState('All');
  const [feFilter, setFeFilter] = useState('All');

  const backStats = countStats(backendUnitTests);
  const frontStats = countStats(frontendUnitTests);
  const combined = {
    total: backStats.total + frontStats.total,
    passed: backStats.passed + frontStats.passed,
    failed: backStats.failed + frontStats.failed,
    skipped: backStats.skipped + frontStats.skipped,
  };

  const filteredBe = beFilter === 'All' ? backendUnitTests : backendUnitTests.filter(t => t.service === beFilter);
  const filteredFe = feFilter === 'All' ? frontendUnitTests : frontendUnitTests.filter(t => t.service === feFilter);

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1000 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ color: '#e2e8f0', fontSize: 22, fontWeight: 700, margin: 0 }}>Unit Tests</h1>
        <p style={{ color: '#64748b', fontSize: 13, marginTop: 6 }}>
          Isolated tests for individual methods using Mockito (Java) and Jasmine (TypeScript) with all dependencies mocked.
        </p>
      </div>

      <StatBar {...combined} />

      {/* Pattern explanation */}
      <div style={{
        background: '#0f0f1a', border: '1px solid #1e1e2e', borderRadius: 8,
        padding: '12px 16px', marginBottom: 20, display: 'flex', gap: 20
      }}>
        <div style={{ fontSize: 12, color: '#64748b' }}>
          <span style={{ color: '#94a3b8', fontWeight: 600 }}>Pattern: </span>
          AAA (Arrange → Act → Assert)
        </div>
        <div style={{ fontSize: 12, color: '#64748b' }}>
          <span style={{ color: '#94a3b8', fontWeight: 600 }}>Isolation: </span>
          All external dependencies mocked via <code style={{ color: '#c792ea' }}>@Mock</code> / <code style={{ color: '#c792ea' }}>@InjectMocks</code>
        </div>
        <div style={{ fontSize: 12, color: '#64748b' }}>
          <span style={{ color: '#94a3b8', fontWeight: 600 }}>Runner: </span>
          JUnit 5 · MockitoExtension · Karma
        </div>
      </div>

      {/* Backend / Frontend Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 20, borderBottom: '1px solid #252535' }}>
        {[
          { id: 'backend', label: `Backend (Java) — ${backStats.total} tests` },
          { id: 'frontend', label: `Frontend (TypeScript) — ${frontStats.total} tests` },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '9px 18px', border: 'none', background: 'transparent',
            color: tab === t.id ? '#e2e8f0' : '#64748b', fontWeight: tab === t.id ? 600 : 400,
            fontSize: 13, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            borderBottom: tab === t.id ? '2px solid #dc2626' : '2px solid transparent',
            marginBottom: -1
          }}>{t.label}</button>
        ))}
      </div>

      {tab === 'backend' && (
        <>
          <FilterBar filters={backendFilters} active={beFilter} onChange={setBeFilter} />
          <div style={{ marginTop: 12 }}>
            {filteredBe.map(test => <TestCard key={test.id} test={test} />)}
          </div>
        </>
      )}

      {tab === 'frontend' && (
        <>
          <FilterBar filters={frontendFilters} active={feFilter} onChange={setFeFilter} />
          <div style={{ marginTop: 12 }}>
            {filteredFe.map(test => <TestCard key={test.id} test={test} />)}
          </div>
        </>
      )}
    </div>
  );
}

function FilterBar({ filters, active, onChange }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {filters.map(f => (
        <button key={f} onClick={() => onChange(f)} style={{
          padding: '4px 12px', borderRadius: 20, border: '1px solid',
          borderColor: active === f ? '#dc2626' : '#252535',
          background: active === f ? '#2d0a0a' : 'transparent',
          color: active === f ? '#f87171' : '#64748b',
          fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, sans-serif'
        }}>{f}</button>
      ))}
    </div>
  );
}
