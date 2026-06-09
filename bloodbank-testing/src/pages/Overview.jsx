const techStack = [
  { layer: 'Backend Unit Tests', tools: 'JUnit 5, Mockito, AssertJ', color: '#6366f1' },
  { layer: 'Frontend Unit Tests', tools: 'Jasmine, Karma, Angular TestBed', color: '#8b5cf6' },
  { layer: 'Integration Tests', tools: 'Spring MockMvc, RestAssured, H2 DB', color: '#3b82f6' },
  { layer: 'E2E Tests', tools: 'Cypress 13, Custom Commands, Fixtures', color: '#06b6d4' },
  { layer: 'API Contract Tests', tools: 'Spring Boot Test, ObjectMapper', color: '#10b981' },
];

const summary = [
  { label: 'Unit Tests (Backend)', total: 12, pass: 12, fail: 0, skip: 0, color: '#6366f1' },
  { label: 'Unit Tests (Frontend)', total: 7, pass: 7, fail: 0, skip: 0, color: '#8b5cf6' },
  { label: 'Integration Tests', total: 13, pass: 12, fail: 1, skip: 0, color: '#3b82f6' },
  { label: 'E2E Tests', total: 10, pass: 8, fail: 0, skip: 1, color: '#06b6d4' },
];

const pyramidLayers = [
  { label: 'E2E Tests', count: '10 tests', cost: 'Slow · High Cost', color: '#dc2626', w: 60 },
  { label: 'Integration Tests', count: '13 tests', cost: 'Medium Speed', color: '#f59e0b', w: 75 },
  { label: 'Unit Tests', count: '19 tests', cost: 'Fast · Low Cost', color: '#22c55e', w: 100 },
];

export default function Overview() {
  const totals = summary.reduce((a, s) => ({
    total: a.total + s.total, pass: a.pass + s.pass,
    fail: a.fail + s.fail, skip: a.skip + s.skip
  }), { total: 0, pass: 0, fail: 0, skip: 0 });

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1000 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ color: '#e2e8f0', fontSize: 22, fontWeight: 700, margin: 0 }}>
          Test Suite Overview
        </h1>
        <p style={{ color: '#64748b', fontSize: 13, marginTop: 6 }}>
          Blood Bank Management System — Full Stack Testing Strategy (Spring Boot + Angular)
        </p>
      </div>

      {/* Overall Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 32 }}>
        {[
          { label: 'Total Test Cases', value: totals.total, color: '#6366f1', icon: '⬡' },
          { label: 'Tests Passing', value: totals.pass, color: '#22c55e', icon: '✓' },
          { label: 'Tests Failing', value: totals.fail, color: '#ef4444', icon: '✗' },
          { label: 'Tests Skipped', value: totals.skip, color: '#f59e0b', icon: '⊘' },
        ].map(s => (
          <div key={s.label} style={{
            background: '#1a1a27', border: '1px solid #252535',
            borderRadius: 10, padding: '16px 20px'
          }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 28 }}>
        {/* Testing Pyramid */}
        <div style={{ background: '#1a1a27', border: '1px solid #252535', borderRadius: 10, padding: '20px 24px' }}>
          <h3 style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600, margin: '0 0 20px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Testing Pyramid
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            {pyramidLayers.map((layer, i) => (
              <div key={i} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  width: `${layer.w}%`, padding: '8px 12px',
                  background: layer.color + '22', border: `1px solid ${layer.color}55`,
                  borderRadius: 4, textAlign: 'center'
                }}>
                  <div style={{ color: layer.color, fontWeight: 600, fontSize: 13 }}>{layer.label}</div>
                  <div style={{ color: '#64748b', fontSize: 11 }}>{layer.count} · {layer.cost}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Test Distribution */}
        <div style={{ background: '#1a1a27', border: '1px solid #252535', borderRadius: 10, padding: '20px 24px' }}>
          <h3 style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600, margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Suite Breakdown
          </h3>
          {summary.map(s => {
            const passRate = Math.round((s.pass / s.total) * 100);
            return (
              <div key={s.label} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>{s.label}</span>
                  <span style={{ fontSize: 12, color: s.color, fontWeight: 600 }}>
                    {s.pass}/{s.total} · {passRate}%
                  </span>
                </div>
                <div style={{ height: 5, background: '#252535', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${passRate}%`, background: s.color, borderRadius: 3 }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Technology Stack */}
      <div style={{ background: '#1a1a27', border: '1px solid #252535', borderRadius: 10, padding: '20px 24px', marginBottom: 28 }}>
        <h3 style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600, margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Testing Technology Stack
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {techStack.map(t => (
            <div key={t.layer} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '9px 12px', background: '#0f0f1a', borderRadius: 6,
              border: '1px solid #1e1e2e'
            }}>
              <div style={{ width: 3, height: 32, background: t.color, borderRadius: 2 }} />
              <div>
                <div style={{ fontSize: 13, color: '#e2e8f0', fontWeight: 500 }}>{t.layer}</div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 1 }}>{t.tools}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Test Scenario Coverage */}
      <div style={{ background: '#1a1a27', border: '1px solid #252535', borderRadius: 10, padding: '20px 24px' }}>
        <h3 style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600, margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Business Scenario Coverage
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
          {[
            { scenario: 'User Registration & OTP', covered: true },
            { scenario: 'JWT Authentication & Guards', covered: true },
            { scenario: 'Blood Request Submission', covered: true },
            { scenario: 'Admin Smart Approve', covered: true },
            { scenario: 'Blood Inventory Management', covered: true },
            { scenario: 'Donation Scheduling & Completion', covered: true },
            { scenario: 'Admin Dashboard Statistics', covered: true },
            { scenario: 'Role-Based Access Control', covered: true },
            { scenario: 'Email OTP Notification', covered: true },
            { scenario: 'Compatible Blood Group Lookup', covered: true },
            { scenario: 'User Account Deactivation', covered: false },
            { scenario: 'Donor Email Notifications', covered: false },
          ].map(sc => (
            <div key={sc.scenario} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              fontSize: 12, color: sc.covered ? '#94a3b8' : '#475569',
              padding: '5px 0'
            }}>
              <span style={{ color: sc.covered ? '#22c55e' : '#475569', fontSize: 13 }}>
                {sc.covered ? '✓' : '○'}
              </span>
              {sc.scenario}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
