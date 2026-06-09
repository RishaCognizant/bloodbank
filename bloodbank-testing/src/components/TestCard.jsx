import { useState } from 'react';

const statusConfig = {
  PASS: { bg: '#052e16', border: '#166534', text: '#4ade80', dot: '#22c55e', label: 'PASS' },
  FAIL: { bg: '#2d0a0a', border: '#7f1d1d', text: '#f87171', dot: '#ef4444', label: 'FAIL' },
  SKIP: { bg: '#1c1400', border: '#713f12', text: '#fbbf24', dot: '#f59e0b', label: 'SKIP' },
};

export default function TestCard({ test, showCode = true }) {
  const [expanded, setExpanded] = useState(false);
  const s = statusConfig[test.status] || statusConfig.PASS;

  return (
    <div style={{
      background: '#1a1a27', border: '1px solid #252535',
      borderRadius: 8, marginBottom: 10, overflow: 'hidden',
      transition: 'border-color 0.15s',
    }}>
      <div
        style={{
          padding: '12px 16px', display: 'flex', alignItems: 'flex-start',
          gap: 12, cursor: showCode && test.code ? 'pointer' : 'default'
        }}
        onClick={() => showCode && test.code && setExpanded(e => !e)}
      >
        <div style={{
          marginTop: 3, width: 8, height: 8, borderRadius: '50%',
          background: s.dot, flexShrink: 0
        }} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
              color: '#e2e8f0', fontWeight: 500, wordBreak: 'break-all'
            }}>
              {test.name}
            </span>
            {test.id && (
              <span style={{
                fontSize: 10, color: '#475569', background: '#0f0f1a',
                padding: '1px 6px', borderRadius: 3, fontFamily: 'monospace'
              }}>{test.id}</span>
            )}
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4, lineHeight: 1.5 }}>
            {test.description}
          </div>
          {test.assertions && (
            <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {test.assertions.map((a, i) => (
                <span key={i} style={{
                  fontSize: 10, background: '#0f0f1a', color: '#94a3b8',
                  padding: '2px 7px', borderRadius: 3, border: '1px solid #1e1e2e'
                }}>✓ {a}</span>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <span style={{
            fontSize: 10, fontWeight: 600, letterSpacing: '0.05em',
            padding: '3px 8px', borderRadius: 4,
            background: s.bg, border: `1px solid ${s.border}`, color: s.text
          }}>{s.label}</span>
          {showCode && test.code && (
            <span style={{ color: '#475569', fontSize: 12 }}>{expanded ? '▲' : '▼'}</span>
          )}
        </div>
      </div>

      {expanded && test.code && (
        <div style={{ borderTop: '1px solid #1e1e2e' }}>
          <div style={{
            background: '#0d0d18', padding: '14px 16px',
            overflowX: 'auto', maxHeight: 400, overflowY: 'auto'
          }}>
            <pre style={{
              margin: 0, fontFamily: 'JetBrains Mono, monospace',
              fontSize: 12, lineHeight: 1.7, color: '#e2e8f0',
              whiteSpace: 'pre', tabSize: 4
            }}>
              <code dangerouslySetInnerHTML={{ __html: highlight(test.code) }} />
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

function highlight(code) {
  const escHtml = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  let s = escHtml(code);

  // keywords
  s = s.replace(/\b(void|class|public|private|new|return|static|final|import|extends|implements|interface|throws|throw|if|else|for|while|true|false|null|this|super)\b/g,
    '<span style="color:#c792ea">$1</span>');
  // annotations
  s = s.replace(/(@\w+)/g, '<span style="color:#f78c6c">$1</span>');
  // strings
  s = s.replace(/(&quot;|&#x27;)(.*?)(&quot;|&#x27;)/g,
    '<span style="color:#c3e88d">$1$2$3</span>');
  // comments
  s = s.replace(/(\/\/.*)/g, '<span style="color:#546e7a">$1</span>');
  // numbers
  s = s.replace(/\b(\d+)\b/g, '<span style="color:#f78c6c">$1</span>');
  // method calls
  s = s.replace(/(\w+)(\()/g, '<span style="color:#82aaff">$1</span>$2');

  return s;
}
