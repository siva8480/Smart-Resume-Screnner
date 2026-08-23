import React, { useState } from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, Eye, Code, Search, PlusCircle, Copy } from 'lucide-react';
import { useToast } from './Toast';

export const ATSKeywordHighlighter = ({ resumeText, result, onInjectSkill }) => {
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('highlighted'); // 'highlighted' | 'raw_ats'

  const matchedSkillNames = new Set(result.skills.matched.map(s => s.name.toLowerCase()));

  // Render text with matched keywords highlighted
  const renderHighlightedResume = () => {
    if (!resumeText) return null;

    const lines = resumeText.split('\n');

    return lines.map((line, lineIdx) => {
      if (!line.trim()) {
        return <div key={lineIdx} style={{ height: '0.8rem' }} />;
      }

      // Check if header line
      const isHeader = /^[A-Z\s]{4,}:?$/.test(line.trim()) || /^(EXPERIENCE|EDUCATION|SKILLS|PROJECTS|SUMMARY|CERTIFICATIONS)/i.test(line.trim());

      // Tokenize line and highlight matched keywords
      let renderedContent = [];
      let lastIndex = 0;

      // Sort matched skills by length descending to match phrases first (e.g. "RESTful APIs" before "APIs")
      const matchedSorted = [...result.skills.matched].sort((a, b) => b.name.length - a.name.length);

      const regexPattern = new RegExp(
        `\\b(${matchedSorted.map(s => s.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`,
        'gi'
      );

      if (matchedSorted.length === 0) {
        return (
          <div key={lineIdx} className={isHeader ? 'highlighter-header' : 'highlighter-line'}>
            {line}
          </div>
        );
      }

      let match;
      const lineStr = line;
      while ((match = regexPattern.exec(lineStr)) !== null) {
        const matchStart = match.index;
        const matchEnd = regexPattern.lastIndex;
        const matchedWord = match[0];

        // Text before match
        if (matchStart > lastIndex) {
          renderedContent.push(lineStr.substring(lastIndex, matchStart));
        }

        // Highlighted span
        renderedContent.push(
          <mark
            key={`${lineIdx}-${matchStart}`}
            className="ats-highlight-mark"
            title={`✓ Matched JD Keyword: ${matchedWord}`}
          >
            {matchedWord}
          </mark>
        );

        lastIndex = matchEnd;
      }

      if (lastIndex < lineStr.length) {
        renderedContent.push(lineStr.substring(lastIndex));
      }

      return (
        <div
          key={lineIdx}
          className={isHeader ? 'highlighter-header' : 'highlighter-line'}
          style={isHeader ? { fontWeight: 800, color: 'var(--accent-cyan)', marginTop: '0.85rem', marginBottom: '0.35rem', letterSpacing: '0.04em' } : {}}
        >
          {renderedContent}
        </div>
      );
    });
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(resumeText);
    addToast('Resume text copied to clipboard!', 'success');
  };

  return (
    <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Eye size={20} color="var(--accent-emerald)" />
            ATS Parser & Real-Time Keyword Highlighter
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            See exactly what ATS bots extract: verified matched keywords are illuminated in glowing green.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div className="toggle-group" style={{ display: 'flex', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', padding: '0.2rem', border: '1px solid var(--border-subtle)' }}>
            <button
              className={`preset-chip ${viewMode === 'highlighted' ? 'active' : ''}`}
              style={{
                border: 'none',
                background: viewMode === 'highlighted' ? 'var(--accent-primary)' : 'transparent',
                color: viewMode === 'highlighted' ? '#FFF' : 'var(--text-secondary)'
              }}
              onClick={() => setViewMode('highlighted')}
            >
              <Sparkles size={13} /> Visual Highlight
            </button>
            <button
              className={`preset-chip ${viewMode === 'raw_ats' ? 'active' : ''}`}
              style={{
                border: 'none',
                background: viewMode === 'raw_ats' ? 'var(--accent-primary)' : 'transparent',
                color: viewMode === 'raw_ats' ? '#FFF' : 'var(--text-secondary)'
              }}
              onClick={() => setViewMode('raw_ats')}
            >
              <Code size={13} /> Plain ATS Bot View
            </button>
          </div>

          <button
            onClick={handleCopyText}
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
          >
            <Copy size={14} /> Copy Text
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem' }}>
        <div style={{ background: 'var(--bg-tertiary)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>MATCHED KEYWORDS</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-emerald)', marginTop: '0.15rem' }}>
            {result.skills.matched.length}
          </div>
        </div>

        <div style={{ background: 'var(--bg-tertiary)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>MISSING FROM JD</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FB7185', marginTop: '0.15rem' }}>
            {result.skills.missing.length}
          </div>
        </div>

        <div style={{ background: 'var(--bg-tertiary)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>ATS KEYWORD DENSITY</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-cyan)', marginTop: '0.15rem' }}>
            {Math.round((result.skills.matched.length / Math.max(1, result.skills.matched.length + result.skills.missing.length)) * 100)}%
          </div>
        </div>

        <div style={{ background: 'var(--bg-tertiary)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>PARSED WORD COUNT</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-primary)', marginTop: '0.15rem' }}>
            {result.atsHealth.wordCount}
          </div>
        </div>
      </div>

      {/* Document Simulation Container */}
      <div className="highlighter-paper-wrapper">
        <div className={`highlighter-paper ${viewMode === 'raw_ats' ? 'mono-view' : ''}`}>
          {viewMode === 'highlighted' ? (
            renderHighlightedResume()
          ) : (
            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'var(--font-mono)', fontSize: '0.86rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
              {resumeText}
            </pre>
          )}
        </div>
      </div>

      {/* Quick Missing Skills Injection Bar */}
      {result.skills.missing.length > 0 && onInjectSkill && (
        <div style={{ background: 'rgba(99, 102, 241, 0.06)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px dashed rgba(99, 102, 241, 0.3)', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-primary)' }}>
            <PlusCircle size={16} /> 1-Click Inject Missing Keywords into Resume:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {result.skills.missing.slice(0, 8).map(skill => (
              <button
                key={skill.name}
                onClick={() => {
                  onInjectSkill(skill.name);
                  addToast(`Injected "${skill.name}" into resume!`, 'success');
                }}
                className={`skill-tag badge-${skill.priority.toLowerCase()}`}
                style={{ cursor: 'pointer', border: 'none' }}
                title="Click to insert into resume"
              >
                <span>+ {skill.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
