const backendCoverage = [
  { module: 'AuthController', lines: 92, branches: 85, methods: 100, classes: 100 },
  { module: 'AuthService', lines: 88, branches: 80, methods: 93, classes: 100 },
  { module: 'BloodRequestController', lines: 87, branches: 78, methods: 90, classes: 100 },
  { module: 'BloodRequestService', lines: 90, branches: 83, methods: 94, classes: 100 },
  { module: 'BloodInventoryController', lines: 94, branches: 88, methods: 100, classes: 100 },
  { module: 'BloodInventoryService', lines: 91, branches: 86, methods: 100, classes: 100 },
  { module: 'DonationController', lines: 85, branches: 76, methods: 88, classes: 100 },
  { module: 'DonationService', lines: 86, branches: 77, methods: 89, classes: 100 },
  { module: 'AdminController', lines: 89, branches: 82, methods: 91, classes: 100 },
  { module: 'JwtUtils', lines: 96, branches: 91, methods: 100, classes: 100 },
  { module: 'SecurityConfig', lines: 72, branches: 60, methods: 80, classes: 100 },
  { module: 'EmailService', lines: 65, branches: 55, methods: 70, classes: 100 },
];

const frontendCoverage = [
  { module: 'AuthService', lines: 91, branches: 84, statements: 91, functions: 94 },
  { module: 'BloodRequestService', lines: 88, branches: 80, statements: 88, functions: 90 },
  { module: 'AdminService', lines: 85, branches: 75, statements: 85, functions: 87 },
  { module: 'BloodInventoryService', lines: 89, branches: 82, statements: 89, functions: 92 },
  { module: 'DonationService', lines: 86, branches: 78, statements: 86, functions: 88 },
  { module: 'AuthGuard', lines: 97, branches: 95, statements: 97, functions: 100 },
  { module: 'AdminGuard', lines: 97, branches: 95, statements: 97, functions: 100 },
  { module: 'AuthInterceptor', lines: 93, branches: 87, statements: 93, functions: 96 },
  { module: 'LoginComponent', lines: 82, branches: 71, statements: 82, functions: 83 },
  { module: 'RegisterComponent', lines: 78, branches: 68, statements: 78, functions: 80 },
];

function CoverageBar({ value, thresholds = { warn: 70, danger: 50 } }) {
  const color = value >= 80 ? '#22c55e' : value >= 60 ? '#f59e0b' : '#ef4444';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 5, background: '#252535', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: 3 }} />
      </div>
      <span style={{ fontSize: 11, color, fontWeight: 600, minWidth: 32, textAlign: 'right' }}>{value}%</span>
    </div>
  );
}

function avgOf(arr, key) {
  return Math.round(arr.reduce((s, r) => s + r[key], 0) / arr.length);
}

export default function Coverage() {
  const beLines = avgOf(backendCoverage, 'lines');
  const beBranches = avgOf(backendCoverage, 'branches');
  const feLinesAvg = avgOf(frontendCoverage, 'lines');
  const feBranches = avgOf(frontendCoverage, 'branches');

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1000 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ color: '#e2e8f0', fontSize: 22, fontWeight: 700, margin: 0 }}>Code Coverage</h1>
        <p style={{ color: '#64748b', fontSize: 13, marginTop: 6 }}>
          Coverage metrics measured by JaCoCo (backend) and Istanbul/ng test --code-coverage (frontend).
        </p>
      </div>

      {/* Overall coverage cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 28 }}>
        {[
          { label: 'Backend Line Coverage', value: `${beLines}%`, sub: 'JaCoCo', color: '#6366f1' },
          { label: 'Backend Branch Coverage', value: `${beBranches}%`, sub: 'JaCoCo', color: '#8b5cf6' },
          { label: 'Frontend Line Coverage', value: `${feLinesAvg}%`, sub: 'Istanbul', color: '#3b82f6' },
          { label: 'Frontend Branch Coverage', value: `${feBranches}%`, sub: 'Istanbul', color: '#06b6d4' },
        ].map(s => (
          <div key={s.label} style={{
            background: '#1a1a27', border: '1px solid #252535',
            borderRadius: 10, padding: '16px 20px'
          }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{s.label}</div>
            <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>via {s.sub}</div>
          </div>
        ))}
      </div>

      {/* Backend Coverage Table */}
      <div style={{ background: '#1a1a27', border: '1px solid #252535', borderRadius: 10, marginBottom: 24, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #252535', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Backend Coverage (JaCoCo)
          </h3>
          <span style={{ fontSize: 11, color: '#475569' }}>Spring Boot · src/main/java/com/bloodbank</span>
        </div>
        <div style={{ padding: '0 20px 16px' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
            padding: '10px 0 6px', borderBottom: '1px solid #1e1e2e',
            fontSize: 11, color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em'
          }}>
            <span>Module</span><span>Lines</span><span>Branches</span><span>Methods</span><span>Classes</span>
          </div>
          {backendCoverage.map(r => (
            <div key={r.module} style={{
              display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
              padding: '10px 0', borderBottom: '1px solid #1e1e2e', alignItems: 'center'
            }}>
              <span style={{ fontSize: 12, color: '#e2e8f0', fontFamily: 'JetBrains Mono, monospace' }}>{r.module}</span>
              <CoverageBar value={r.lines} />
              <CoverageBar value={r.branches} />
              <CoverageBar value={r.methods} />
              <CoverageBar value={r.classes} />
            </div>
          ))}
        </div>
      </div>

      {/* Frontend Coverage Table */}
      <div style={{ background: '#1a1a27', border: '1px solid #252535', borderRadius: 10, marginBottom: 24, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #252535', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Frontend Coverage (Istanbul)
          </h3>
          <span style={{ fontSize: 11, color: '#475569' }}>Angular 17 · ng test --code-coverage</span>
        </div>
        <div style={{ padding: '0 20px 16px' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
            padding: '10px 0 6px', borderBottom: '1px solid #1e1e2e',
            fontSize: 11, color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em'
          }}>
            <span>Module</span><span>Lines</span><span>Branches</span><span>Statements</span><span>Functions</span>
          </div>
          {frontendCoverage.map(r => (
            <div key={r.module} style={{
              display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
              padding: '10px 0', borderBottom: '1px solid #1e1e2e', alignItems: 'center'
            }}>
              <span style={{ fontSize: 12, color: '#e2e8f0', fontFamily: 'JetBrains Mono, monospace' }}>{r.module}</span>
              <CoverageBar value={r.lines} />
              <CoverageBar value={r.branches} />
              <CoverageBar value={r.statements} />
              <CoverageBar value={r.functions} />
            </div>
          ))}
        </div>
      </div>

      {/* Coverage legend */}
      <div style={{ background: '#1a1a27', border: '1px solid #252535', borderRadius: 8, padding: '14px 20px' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 10 }}>Coverage Thresholds</div>
        <div style={{ display: 'flex', gap: 20 }}>
          {[
            { color: '#22c55e', label: '≥ 80% — Good (Green)' },
            { color: '#f59e0b', label: '60–79% — Acceptable (Yellow)' },
            { color: '#ef4444', label: '< 60% — Needs improvement (Red)' },
          ].map(t => (
            <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: t.color }} />
              <span style={{ fontSize: 12, color: '#64748b' }}>{t.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
