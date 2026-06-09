import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Overview from './pages/Overview';
import TestingConcepts from './pages/TestingConcepts';
import UnitTests from './pages/UnitTests';
import IntegrationTests from './pages/IntegrationTests';
import E2ETests from './pages/E2ETests';
import Coverage from './pages/Coverage';

const pages = {
  overview: Overview,
  concepts: TestingConcepts,
  unit: UnitTests,
  integration: IntegrationTests,
  e2e: E2ETests,
  coverage: Coverage,
};

export default function App() {
  const [activePage, setActivePage] = useState('overview');
  const Page = pages[activePage] || Overview;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0f', fontFamily: 'Inter, sans-serif' }}>
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <main style={{ flex: 1, overflowY: 'auto', minWidth: 0 }}>
        <Page />
      </main>
    </div>
  );
}
