import { useState } from 'react';

const testingTypes = [
  {
    name: 'Unit Testing',
    category: 'Functional',
    icon: '⬡',
    color: '#6366f1',
    definition: 'Testing individual functions, methods, or components in isolation from the rest of the application. All dependencies are mocked.',
    whenToUse: 'During development, whenever a method or function is written or changed.',
    bloodBankExample: 'Testing AuthService.login() in isolation — mock UserRepository and JwtUtils to verify only the login logic works correctly.',
    tools: 'JUnit 5, Mockito, Jasmine, Karma',
    positiveCase: 'login("valid@test.com", "pass123") → returns JWT token',
    negativeCase: 'login("valid@test.com", "wrongpass") → throws RuntimeException',
  },
  {
    name: 'Integration Testing',
    category: 'Functional',
    icon: '⬢',
    color: '#3b82f6',
    definition: 'Testing the interaction between multiple components or layers (Controller → Service → Repository → Database) working together.',
    whenToUse: 'After unit tests pass, to verify components communicate correctly.',
    bloodBankExample: 'POST /api/requests endpoint test — verifies the request flows from Controller through BloodRequestService to the H2 database and returns PENDING status.',
    tools: 'Spring MockMvc, @SpringBootTest, H2 In-Memory DB',
    positiveCase: 'POST /api/requests with valid JWT → 201 Created with status=PENDING',
    negativeCase: 'POST /api/requests without JWT → 401 Unauthorized',
  },
  {
    name: 'System Testing',
    category: 'Functional',
    icon: '◈',
    color: '#8b5cf6',
    definition: 'Testing the complete, integrated system against the specified requirements. Covers all modules end-to-end on a fully deployed environment.',
    whenToUse: 'After integration testing, on a staging environment that mirrors production.',
    bloodBankExample: 'Full blood request lifecycle: User registers → logs in → submits request → Admin approves via smart-approve → Inventory decremented → User sees APPROVED status.',
    tools: 'Cypress, Selenium, Postman Collection Runs',
    positiveCase: 'Full donor registration + donation scheduling + admin completion flow',
    negativeCase: 'System correctly rejects expired JWT tokens across all 15 protected endpoints',
  },
  {
    name: 'Regression Testing',
    category: 'Functional',
    icon: '↺',
    color: '#f59e0b',
    definition: 'Re-executing previously passed test cases after code changes (bug fixes, new features) to ensure existing functionality is not broken.',
    whenToUse: 'After every code change, bug fix, or new feature addition before release.',
    bloodBankExample: 'After adding the Smart Approve feature, re-run all 42 existing test cases — especially BloodInventoryService and BloodRequestService tests — to ensure deduction logic was not broken.',
    tools: 'JUnit 5 test suite, Cypress regression suite, CI/CD pipeline (GitHub Actions)',
    positiveCase: 'All 41 previously-passing tests continue to pass after smart-approve addition',
    negativeCase: 'Test detects that new smart-approve code accidentally changed manual-approve deduction logic',
  },
  {
    name: 'Smoke Testing',
    category: 'Functional',
    icon: '💨',
    color: '#10b981',
    definition: 'A preliminary test to check whether the most critical functions work. A shallow, wide test to decide if a build is stable enough for further testing. Also called "Build Verification Test".',
    whenToUse: 'Immediately after a new build or deployment, before running the full test suite.',
    bloodBankExample: 'Before running 42 full tests on a new build: (1) Can the app load? (2) Can admin login? (3) Can user login? (4) Does the blood request page render? (5) Does the inventory page load? — If any of these 5 fail, reject the build.',
    tools: 'Cypress smoke suite (5 critical tests), Postman health-check collection',
    positiveCase: '5/5 smoke tests pass → proceed with full regression suite',
    negativeCase: 'Login endpoint returns 500 → build rejected, full regression skipped',
  },
  {
    name: 'Sanity Testing',
    category: 'Functional',
    icon: '🔍',
    color: '#06b6d4',
    definition: 'Narrow, focused regression testing performed after a bug fix or minor change to verify that the specific fix works correctly. A subset of regression testing.',
    whenToUse: 'After receiving a bug-fixed build for a specific defect, before doing full regression.',
    bloodBankExample: 'After the dev team fixes the "deactivated user can still login" bug (IT-12): run ONLY the 4 auth-related tests — login, logout, toggle-status, and deactivated-user-login. No need to re-test inventory or donations.',
    tools: 'JUnit @Tag("sanity"), Cypress --spec option for targeted spec files',
    positiveCase: 'Deactivated user now correctly receives 401 after fix is applied',
    negativeCase: 'Bug fix introduced a side-effect — active admin users are also blocked',
  },
  {
    name: 'Functional Testing',
    category: 'Functional',
    icon: '⚙',
    color: '#84cc16',
    definition: 'Black-box testing that validates the software system against its functional requirements. Tests WHAT the system does, not how it does it.',
    whenToUse: 'Throughout testing — verifying features match business requirements.',
    bloodBankExample: 'Verify: Admin can approve a blood request only if inventory >= requested units. Test with inventory=5, request=6 (should reject) and inventory=5, request=4 (should approve).',
    tools: 'MockMvc, Cypress, Postman',
    positiveCase: 'Admin approves request for 4 units when stock is 5 → APPROVED, stock becomes 1',
    negativeCase: 'Admin tries to approve request for 6 units when stock is 5 → system blocks with error',
  },
  {
    name: 'Non-Functional Testing',
    category: 'Non-Functional',
    icon: '📊',
    color: '#f97316',
    definition: 'Testing non-functional aspects of the application: performance, security, usability, scalability, reliability. Tests HOW WELL the system works, not what it does.',
    whenToUse: 'Performance: Before production release. Security: Every sprint. Usability: During UAT.',
    bloodBankExample: 'Performance: Blood inventory page should load within 2 seconds. Security: JWT tokens must expire in 24h and cannot be tampered. Usability: Blood group dropdown must be accessible on mobile.',
    tools: 'JMeter (performance), OWASP ZAP (security), Lighthouse (usability)',
    positiveCase: 'API responds in < 200ms for 100 concurrent users on /api/inventory',
    negativeCase: 'Modified JWT token with fake ADMIN role is correctly rejected by SecurityConfig',
  },
  {
    name: 'Performance Testing',
    category: 'Non-Functional',
    icon: '⚡',
    color: '#eab308',
    definition: 'Evaluates the speed, responsiveness, and stability of a system under a particular workload. Includes Load, Stress, and Spike testing.',
    whenToUse: 'Before major releases, especially when expecting high traffic.',
    bloodBankExample: 'JMeter test: Simulate 200 concurrent users hitting POST /api/auth/login simultaneously. Measure response time, throughput, and error rate. Acceptable: p95 < 500ms, error rate < 1%.',
    tools: 'Apache JMeter, Gatling, k6',
    positiveCase: '200 concurrent logins: avg 180ms, p95 420ms, 0% errors → PASS',
    negativeCase: '200 concurrent users: 15% requests timeout after 5s → performance issue in JWT generation',
  },
  {
    name: 'Security Testing',
    category: 'Non-Functional',
    icon: '🔒',
    color: '#ef4444',
    definition: 'Testing to identify vulnerabilities, threats, and risks in the software. Ensures the system protects data and maintains functionality as intended.',
    whenToUse: 'Every sprint, and mandatory before production deployment.',
    bloodBankExample: 'OWASP Top 10 checks: SQL injection on /api/auth/login, JWT tampering to escalate to ADMIN role, accessing /api/admin/dashboard without token (should return 401), testing CORS headers.',
    tools: 'OWASP ZAP, Burp Suite, Spring Security test utilities',
    positiveCase: 'GET /api/admin/dashboard without token → 401 Unauthorized (Spring Security blocks)',
    negativeCase: 'Modified JWT payload (role: ADMIN) is correctly rejected — signature validation fails',
  },
  {
    name: 'UAT (User Acceptance Testing)',
    category: 'Functional',
    icon: '👤',
    color: '#a78bfa',
    definition: 'Final testing performed by end users or business stakeholders to validate that the system meets business requirements before go-live.',
    whenToUse: 'After system testing, just before production deployment.',
    bloodBankExample: 'Hospital staff tests: Can I request blood and see its status? Blood bank admin tests: Can I see all pending requests and approve them? Does the email notification arrive after approval?',
    tools: 'Manual testing, test scripts in plain language, Zephyr test management',
    positiveCase: 'Admin user confirms: Smart Approve correctly selects compatible blood and sends email',
    negativeCase: 'User reports: Date picker in donation scheduling does not allow past dates selection on Safari',
  },
  {
    name: 'Exploratory Testing',
    category: 'Functional',
    icon: '🗺',
    color: '#34d399',
    definition: 'Simultaneous learning, test design, and test execution. Tester explores the application without predefined test cases, using experience and intuition to find defects.',
    whenToUse: 'When the application is new or poorly documented, or to supplement scripted tests.',
    bloodBankExample: 'Tester explores the Admin panel without a script: tries approving a request when inventory is 0, tries rejecting an already-approved request, navigates rapidly between pages to test state management.',
    tools: 'Session-based testing, mind mapping, bug tracking (Jira)',
    positiveCase: 'Discovers: Approving a request for 0 inventory shows confusing error — should be a clear validation message',
    negativeCase: 'Finds bug: After smart-approve, navigating back and refreshing sometimes shows old PENDING status (caching issue)',
  },
];

const designTechniques = [
  {
    name: 'Equivalence Partitioning (EP)',
    color: '#6366f1',
    definition: 'Divides input data into valid and invalid partitions. The assumption is that all values within a partition behave the same way, so testing one value per partition is sufficient.',
    bloodBankExample: {
      field: 'Blood Units field in Blood Request form',
      partitions: [
        { type: 'Invalid (below min)', range: '≤ 0', example: '-1, 0', expected: 'Validation error: units must be > 0' },
        { type: 'Valid', range: '1 – 10', example: '1, 5, 10', expected: 'Request created successfully' },
        { type: 'Invalid (above max)', range: '> 10', example: '11, 100', expected: 'Validation error: max 10 units per request' },
      ]
    }
  },
  {
    name: 'Boundary Value Analysis (BVA)',
    color: '#f59e0b',
    definition: 'Tests values at the boundaries of equivalence partitions. Errors tend to cluster at boundaries. Tests: min-1, min, min+1, max-1, max, max+1.',
    bloodBankExample: {
      field: 'Blood Units field — valid range is 1 to 10',
      partitions: [
        { type: 'Below boundary', range: 'min - 1', example: '0', expected: 'FAIL — Validation error' },
        { type: 'At lower boundary', range: 'min', example: '1', expected: 'PASS — Request created' },
        { type: 'Just above lower', range: 'min + 1', example: '2', expected: 'PASS — Request created' },
        { type: 'Just below upper', range: 'max - 1', example: '9', expected: 'PASS — Request created' },
        { type: 'At upper boundary', range: 'max', example: '10', expected: 'PASS — Request created' },
        { type: 'Above boundary', range: 'max + 1', example: '11', expected: 'FAIL — Validation error' },
      ]
    }
  },
  {
    name: 'Decision Table Testing',
    color: '#3b82f6',
    definition: 'Tests combinations of inputs and conditions. Particularly useful when multiple conditions result in different actions. Each column is a test case.',
    bloodBankExample: {
      field: 'Admin Smart Approve logic — conditions: Stock Available, Blood Compatible, Request is PENDING',
      partitions: [
        { type: 'All conditions true', range: 'Stock ✓, Compatible ✓, PENDING ✓', example: 'O+ stock=5, request O+, status=PENDING', expected: 'APPROVED, inventory decremented' },
        { type: 'No stock', range: 'Stock ✗, Compatible ✓, PENDING ✓', example: 'O+ stock=0, request O+', expected: 'Error: insufficient stock' },
        { type: 'Incompatible blood', range: 'Stock ✓, Compatible ✗, PENDING ✓', example: 'A+ stock=5, request O+', expected: 'Error: no compatible stock' },
        { type: 'Already approved', range: 'Stock ✓, Compatible ✓, PENDING ✗', example: 'Request already APPROVED', expected: 'Error: request not in PENDING state' },
      ]
    }
  },
  {
    name: 'State Transition Testing',
    color: '#10b981',
    definition: 'Tests how the system transitions between states. Useful for workflows where an entity goes through multiple states with defined transitions.',
    bloodBankExample: {
      field: 'BloodRequest Status Lifecycle',
      partitions: [
        { type: 'Valid: PENDING → APPROVED', range: 'Admin approves pending request', example: 'Admin calls /api/requests/1/smart-approve', expected: 'Status = APPROVED, inventory decremented' },
        { type: 'Valid: PENDING → REJECTED', range: 'Admin rejects pending request', example: 'Admin calls PUT /action with REJECTED', expected: 'Status = REJECTED, adminMessage saved' },
        { type: 'Invalid: APPROVED → APPROVED', range: 'Cannot approve twice', example: 'Admin tries to approve already-approved request', expected: 'Error: invalid state transition' },
        { type: 'Invalid: REJECTED → APPROVED', range: 'Cannot approve rejected request', example: 'Admin tries to approve rejected request', expected: 'Error: cannot approve a rejected request' },
      ]
    }
  },
  {
    name: 'Error Guessing',
    color: '#ec4899',
    definition: 'Tester uses experience and intuition to guess likely error-prone areas and write test cases for those specific scenarios. Based on past bugs and domain knowledge.',
    bloodBankExample: {
      field: 'Common error-prone areas identified in Blood Bank project',
      partitions: [
        { type: 'Race condition', range: 'Concurrent requests', example: 'Two users request last 1 unit of O+ simultaneously', expected: 'Only one request approved — no negative inventory' },
        { type: 'Edge case: empty fields', range: 'Submit with empty optional fields', example: 'Submit request with empty adminMessage', expected: 'Request saved with null adminMessage — no NullPointerException' },
        { type: 'Special characters', range: 'Input validation', example: 'Patient name: "Ravi <script>alert(1)</script>"', expected: 'Input sanitized — XSS prevented' },
        { type: 'Token expiry boundary', range: 'JWT at exact expiry', example: 'Make API call at exactly token expiry time (86400000ms)', expected: 'Request correctly rejected with 401' },
      ]
    }
  },
];

const testingPrinciples = [
  {
    number: '01',
    title: 'Testing shows presence of defects',
    definition: 'Testing can show defects are present, but cannot prove there are no defects. Even if no bugs are found, it does not mean the software is bug-free.',
    bloodBankExample: 'Our 42 test cases passing does not guarantee the blood bank app is bug-free — just that the tested scenarios work correctly.',
    color: '#6366f1'
  },
  {
    number: '02',
    title: 'Exhaustive testing is not possible',
    definition: 'Testing everything (all combinations of inputs, preconditions, and paths) is not feasible except for trivial cases. Risk analysis and priorities are used to focus testing.',
    bloodBankExample: 'We cannot test every possible blood group combination × units × hospital × emergency flag — we use Equivalence Partitioning and BVA to cover representative cases.',
    color: '#3b82f6'
  },
  {
    number: '03',
    title: 'Early testing saves time and money',
    definition: 'Testing activities should start as early as possible in the software development lifecycle. Fixing a bug in requirements costs much less than fixing it after deployment.',
    bloodBankExample: 'Writing unit tests for BloodRequestService while coding (TDD) caught the "negative inventory" edge case before it reached the integration testing phase.',
    color: '#10b981'
  },
  {
    number: '04',
    title: 'Defect clustering',
    definition: 'A small number of modules contain most of the defects. Testing effort should be focused on these areas. Also known as the Pareto principle (80% of bugs in 20% of code).',
    bloodBankExample: 'BloodRequestService (smart-approve + inventory deduction) and AuthService (JWT + OTP) are the most complex modules — they receive the most test cases and closest scrutiny.',
    color: '#f59e0b'
  },
  {
    number: '05',
    title: 'Pesticide paradox',
    definition: 'If the same tests are repeated over and over, they will no longer find new bugs. Tests need to be regularly reviewed and updated.',
    bloodBankExample: 'After running the same 42 tests for 3 sprints, we add new edge-case tests: concurrent request approval, expired OTP, and SQL injection attempts on login.',
    color: '#f97316'
  },
  {
    number: '06',
    title: 'Testing is context dependent',
    definition: 'Testing is done differently in different contexts. A blood bank management system requires strict data accuracy testing; a gaming app prioritizes performance and UX testing.',
    bloodBankExample: 'Our blood bank app prioritizes: (1) Data integrity — inventory counts must be exact; (2) Security — patient data and JWT tokens; (3) Reliability — email notifications must not fail silently.',
    color: '#8b5cf6'
  },
  {
    number: '07',
    title: 'Absence of errors fallacy',
    definition: 'Finding and fixing defects does not help if the system is unusable or does not meet users\' needs and expectations.',
    bloodBankExample: 'Even if all 42 tests pass, the system fails if: blood group compatibility rules are wrong, or the OTP email lands in spam, or the mobile UI is unusable for hospital staff.',
    color: '#ec4899'
  },
];

const defectLifecycle = [
  { step: 'New', desc: 'Tester logs a new defect with steps to reproduce, expected vs actual, severity, and screenshots.', color: '#6366f1', example: 'IT-12: Toggle-status deactivated user can still login' },
  { step: 'Assigned', desc: 'Test lead assigns the defect to the responsible developer for investigation.', color: '#3b82f6', example: 'Assigned to backend dev — AuthService.login() needs active status check' },
  { step: 'Open', desc: 'Developer acknowledges and starts working on the fix.', color: '#f59e0b', example: 'Dev adds user.isActive() check in AuthService before JWT generation' },
  { step: 'Fixed', desc: 'Developer marks it Fixed and creates a new build for the tester.', color: '#10b981', example: 'Fix deployed — AuthService now throws exception for inactive users' },
  { step: 'Retest', desc: 'Tester re-runs the exact steps from the original defect report to verify the fix.', color: '#06b6d4', example: 'Tester retests IT-12: deactivated user login → now correctly returns 401' },
  { step: 'Closed', desc: 'Tester confirms the fix works and closes the defect.', color: '#22c55e', example: 'IT-12 closed. Regression suite re-run confirms no side effects.' },
  { step: 'Reopened', desc: 'If the fix did not work or caused a regression, tester reopens the defect.', color: '#ef4444', example: 'E2E-10: Fix broke admin user login — reopened for further investigation' },
];

export default function TestingConcepts() {
  const [tab, setTab] = useState('types');

  const tabs = [
    { id: 'types', label: 'Testing Types' },
    { id: 'techniques', label: 'Design Techniques' },
    { id: 'principles', label: 'Testing Principles' },
    { id: 'defect', label: 'Defect Lifecycle' },
  ];

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1000 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ color: '#e2e8f0', fontSize: 22, fontWeight: 700, margin: 0 }}>Testing Concepts</h1>
        <p style={{ color: '#64748b', fontSize: 13, marginTop: 6 }}>
          Testing definitions, techniques, ISTQB principles, and defect lifecycle — all mapped to the Blood Bank project.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #252535', marginBottom: 24 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '9px 18px', border: 'none', background: 'transparent',
            color: tab === t.id ? '#e2e8f0' : '#64748b',
            fontWeight: tab === t.id ? 600 : 400,
            fontSize: 13, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            borderBottom: tab === t.id ? '2px solid #dc2626' : '2px solid transparent',
            marginBottom: -1
          }}>{t.label}</button>
        ))}
      </div>

      {/* Testing Types */}
      {tab === 'types' && (
        <div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
            {['Functional', 'Non-Functional'].map(cat => (
              <span key={cat} style={{
                fontSize: 11, padding: '3px 10px', borderRadius: 20,
                background: '#1a1a27', border: '1px solid #252535', color: '#94a3b8'
              }}>
                {cat}: {testingTypes.filter(t => t.category === cat).length} types
              </span>
            ))}
          </div>
          {testingTypes.map(t => (
            <TestTypeCard key={t.name} type={t} />
          ))}
        </div>
      )}

      {/* Design Techniques */}
      {tab === 'techniques' && (
        <div>
          {designTechniques.map(tech => (
            <TechniqueCard key={tech.name} tech={tech} />
          ))}
        </div>
      )}

      {/* Testing Principles */}
      {tab === 'principles' && (
        <div>
          <div style={{
            background: '#0f0f1a', border: '1px solid #1e1e2e', borderRadius: 8,
            padding: '12px 16px', marginBottom: 20, fontSize: 12, color: '#64748b', lineHeight: 1.6
          }}>
            <span style={{ color: '#94a3b8', fontWeight: 600 }}>ISTQB 7 Testing Principles</span> — These are the foundational principles of software testing recognized globally by the International Software Testing Qualifications Board.
          </div>
          {testingPrinciples.map(p => (
            <PrincipleCard key={p.number} p={p} />
          ))}
        </div>
      )}

      {/* Defect Lifecycle */}
      {tab === 'defect' && (
        <div>
          <div style={{
            background: '#0f0f1a', border: '1px solid #1e1e2e', borderRadius: 8,
            padding: '12px 16px', marginBottom: 20, fontSize: 12, color: '#64748b', lineHeight: 1.6
          }}>
            <span style={{ color: '#94a3b8', fontWeight: 600 }}>Defect Lifecycle</span> — Also called Bug Life Cycle. Tracks a defect from discovery to closure. Illustrated below using the real IT-12 bug found in our project.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {defectLifecycle.map((step, i) => (
              <div key={step.step} style={{ display: 'flex', gap: 0 }}>
                {/* Connector */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: 16 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: step.color + '22', border: `2px solid ${step.color}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: step.color, fontWeight: 700, fontSize: 13, flexShrink: 0
                  }}>{i + 1}</div>
                  {i < defectLifecycle.length - 1 && (
                    <div style={{ width: 2, flex: 1, background: '#1e1e2e', minHeight: 20, margin: '3px 0' }} />
                  )}
                </div>
                <div style={{
                  flex: 1, background: '#1a1a27', border: '1px solid #252535',
                  borderRadius: 8, padding: '12px 16px', marginBottom: 8
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                    <span style={{ fontWeight: 700, color: step.color, fontSize: 14 }}>{step.step}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6, marginBottom: 6 }}>{step.desc}</div>
                  <div style={{
                    fontSize: 11, color: '#64748b', background: '#0f0f1a',
                    padding: '5px 10px', borderRadius: 4, borderLeft: `3px solid ${step.color}`,
                    fontFamily: 'JetBrains Mono, monospace'
                  }}>📌 {step.example}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Severity vs Priority */}
          <div style={{ marginTop: 20, background: '#1a1a27', border: '1px solid #252535', borderRadius: 10, padding: '16px 20px' }}>
            <h3 style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600, margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Severity vs Priority
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { title: 'High Severity, High Priority', desc: 'Login is completely broken — no user can access the system.', color: '#ef4444', bbExample: 'POST /api/auth/login returns 500 for all users' },
                { title: 'High Severity, Low Priority', desc: 'Admin dashboard chart crashes on IE11 — affects < 1% of users.', color: '#f97316', bbExample: 'Chart.js incompatibility on legacy browser' },
                { title: 'Low Severity, High Priority', desc: 'Logo is missing on the home page — visually important for a demo tomorrow.', color: '#f59e0b', bbExample: 'Blood drop icon missing in navbar before hospital demo' },
                { title: 'Low Severity, Low Priority', desc: 'Typo in success message: "Reqest submitted" instead of "Request submitted".', color: '#22c55e', bbExample: 'Minor text error in snackbar success notification' },
              ].map(item => (
                <div key={item.title} style={{
                  background: '#0f0f1a', border: `1px solid ${item.color}44`,
                  borderRadius: 6, padding: '10px 12px'
                }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: item.color, marginBottom: 4 }}>{item.title}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 5, lineHeight: 1.5 }}>{item.desc}</div>
                  <div style={{ fontSize: 10, color: '#64748b', fontFamily: 'monospace' }}>🩸 {item.bbExample}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TestTypeCard({ type: t }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{
      background: '#1a1a27', border: '1px solid #252535', borderRadius: 8,
      marginBottom: 10, overflow: 'hidden'
    }}>
      <div
        style={{ padding: '12px 16px', cursor: 'pointer', display: 'flex', gap: 12, alignItems: 'flex-start' }}
        onClick={() => setExpanded(e => !e)}
      >
        <div style={{
          width: 32, height: 32, borderRadius: 6, background: t.color + '22',
          border: `1px solid ${t.color}55`, display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 16, flexShrink: 0, marginTop: 1
        }}>{t.icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>{t.name}</span>
            <span style={{
              fontSize: 10, padding: '2px 8px', borderRadius: 3,
              background: t.color + '22', border: `1px solid ${t.color}44`, color: t.color
            }}>{t.category}</span>
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4, lineHeight: 1.5 }}>{t.definition}</div>
        </div>
        <span style={{ color: '#475569', fontSize: 12, flexShrink: 0 }}>{expanded ? '▲' : '▼'}</span>
      </div>

      {expanded && (
        <div style={{ borderTop: '1px solid #1e1e2e', padding: '14px 16px', background: '#15151f' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 14 }}>
            <InfoBlock label="When to Use" value={t.whenToUse} color={t.color} />
            <InfoBlock label="Tools Used" value={t.tools} color={t.color} />
          </div>
          <div style={{
            background: '#0f0f1a', borderRadius: 6, padding: '12px 14px',
            borderLeft: `3px solid ${t.color}`, marginBottom: 12
          }}>
            <div style={{ fontSize: 11, color: '#475569', marginBottom: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              🩸 Blood Bank Example
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>{t.bloodBankExample}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ background: '#052e16', border: '1px solid #166534', borderRadius: 6, padding: '8px 12px' }}>
              <div style={{ fontSize: 10, color: '#4ade80', fontWeight: 600, marginBottom: 3 }}>✓ POSITIVE CASE</div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>{t.positiveCase}</div>
            </div>
            <div style={{ background: '#2d0a0a', border: '1px solid #7f1d1d', borderRadius: 6, padding: '8px 12px' }}>
              <div style={{ fontSize: 10, color: '#f87171', fontWeight: 600, marginBottom: 3 }}>✗ NEGATIVE CASE</div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>{t.negativeCase}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TechniqueCard({ tech }) {
  return (
    <div style={{
      background: '#1a1a27', border: '1px solid #252535', borderRadius: 8,
      marginBottom: 16, overflow: 'hidden'
    }}>
      <div style={{ padding: '14px 16px', borderBottom: '1px solid #1e1e2e' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{ width: 4, height: 20, background: tech.color, borderRadius: 2 }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>{tech.name}</span>
        </div>
        <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>{tech.definition}</div>
      </div>
      <div style={{ padding: '14px 16px', background: '#15151f' }}>
        <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>
          🩸 Blood Bank Example — {tech.bloodBankExample.field}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, borderRadius: 6, overflow: 'hidden', border: '1px solid #1e1e2e' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr 2fr',
            background: '#0f0f1a', padding: '7px 12px',
            fontSize: 10, color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em'
          }}>
            <span>Partition / Condition</span><span>Range</span><span>Test Value</span><span>Expected Result</span>
          </div>
          {tech.bloodBankExample.partitions.map((p, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr 2fr',
              padding: '8px 12px', fontSize: 12,
              background: i % 2 === 0 ? '#1a1a27' : '#15151f',
              borderTop: '1px solid #1e1e2e'
            }}>
              <span style={{ color: tech.color, fontWeight: 500 }}>{p.type}</span>
              <span style={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: 11 }}>{p.range}</span>
              <span style={{ color: '#e2e8f0', fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>{p.example}</span>
              <span style={{ color: '#64748b', fontSize: 11 }}>{p.expected}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PrincipleCard({ p }) {
  return (
    <div style={{
      background: '#1a1a27', border: '1px solid #252535', borderRadius: 8,
      marginBottom: 10, padding: '14px 16px', display: 'flex', gap: 14
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 8, background: p.color + '22',
        border: `1px solid ${p.color}55`, display: 'flex', alignItems: 'center',
        justifyContent: 'center', color: p.color, fontWeight: 800, fontSize: 14,
        flexShrink: 0, fontFamily: 'JetBrains Mono, monospace'
      }}>{p.number}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', marginBottom: 5 }}>{p.title}</div>
        <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6, marginBottom: 8 }}>{p.definition}</div>
        <div style={{
          fontSize: 11, color: '#64748b', background: '#0f0f1a',
          padding: '7px 12px', borderRadius: 4, borderLeft: `3px solid ${p.color}`,
          lineHeight: 1.6
        }}>🩸 {p.bloodBankExample}</div>
      </div>
    </div>
  );
}

function InfoBlock({ label, value, color }) {
  return (
    <div>
      <div style={{ fontSize: 10, color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>{value}</div>
    </div>
  );
}
