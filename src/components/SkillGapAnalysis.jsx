import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Copy, Check, Filter, PlusCircle, Search, Sparkles } from 'lucide-react';
import { useToast } from './Toast';

export const SkillGapAnalysis = ({ result, onInjectSkill }) => {
  const { addToast } = useToast();
  const { skills } = result;
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedText, setCopiedText] = useState(false);

  const categories = ['all', ...Array.from(new Set([
    ...skills.missing.map(s => s.category),
    ...skills.matched.map(s => s.category)
  ]))];

  const filterList = (list) => {
    let filtered = list;
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(s => s.category === selectedCategory);
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(s => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
    }
    return filtered;
  };

  const filteredMissing = filterList(skills.missing);
  const filteredMatched = filterList(skills.matched);

  const handleCopyMissing = () => {
    const text = skills.missing.map(s => s.name).join(', ');
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    addToast('All missing keywords copied to clipboard!', 'success');
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleInject = (skillName) => {
    if (onInjectSkill) {
      onInjectSkill(skillName);
      addToast(`Added "${skillName}" to your resume!`, 'success');
    }
  };

  return (
    <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Search & Category Filter Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        {/* Search Bar */}
        <div style={{ position: 'relative', minWidth: '240px' }}>
          <Search size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="custom-textarea"
            style={{ minHeight: 'auto', padding: '0.5rem 1rem 0.5rem 2.25rem', fontSize: '0.82rem', borderRadius: 'var(--radius-full)' }}
            placeholder="Search keywords or domains..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Copy Button */}
        {skills.missing.length > 0 && (
          <button
            onClick={handleCopyMissing}
            className="btn btn-secondary"
            style={{ fontSize: '0.82rem', padding: '0.45rem 0.95rem' }}
          >
            {copiedText ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />}
            {copiedText ? 'Copied Missing Skills!' : `Copy All (${skills.missing.length}) Missing`}
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Filter size={13} /> Filter:
        </span>
        {categories.map(cat => {
          const count = cat === 'all' 
            ? skills.missing.length + skills.matched.length 
            : skills.missing.filter(s => s.category === cat).length + skills.matched.filter(s => s.category === cat).length;

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`preset-chip ${selectedCategory === cat ? 'active' : ''}`}
              style={{
                background: selectedCategory === cat ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                color: selectedCategory === cat ? '#FFF' : 'var(--text-primary)'
              }}
            >
              {cat === 'all' ? 'All Skills' : cat}
              <span style={{ opacity: 0.7, fontSize: '0.72rem', marginLeft: '0.25rem' }}>({count})</span>
            </button>
          );
        })}
      </div>

      {/* 2 Column Matrix */}
      <div className="skills-matrix-grid">
        {/* Missing Skills Column */}
        <div className="skills-column" style={{ background: 'rgba(239, 68, 68, 0.04)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={18} color="#F87171" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#F87171' }}>
                Missing Keywords ({filteredMissing.length})
              </h3>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Found in JD, not in Resume</span>
          </div>

          {filteredMissing.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              🎉 No missing skills detected in this view!
            </div>
          ) : (
            <div className="skills-chip-container">
              {filteredMissing.map(skill => (
                <div
                  key={skill.name}
                  className={`skill-tag badge-${skill.priority.toLowerCase()}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleInject(skill.name)}
                  title={`Priority: ${skill.priority}. Click to insert into your resume.`}
                >
                  <span>{skill.name}</span>
                  <span style={{ fontSize: '0.68rem', opacity: 0.75 }}>
                    ({skill.priority})
                  </span>
                  <PlusCircle size={13} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Matched Skills Column */}
        <div className="skills-column" style={{ background: 'rgba(16, 185, 129, 0.04)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={18} color="var(--accent-emerald)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                Matched Skills ({filteredMatched.length})
              </h3>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified in Resume</span>
          </div>

          {filteredMatched.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No matches found with this filter.
            </div>
          ) : (
            <div className="skills-chip-container">
              {filteredMatched.map(skill => (
                <div
                  key={skill.name}
                  className="skill-tag badge-matched"
                >
                  <Check size={13} />
                  <span>{skill.name}</span>
                  <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>
                    {skill.countInResume}x
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Domain Alignment Progress Bars */}
      {skills.categoryScores.length > 0 && (
        <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
            Domain Alignment Breakdown:
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
            {skills.categoryScores.map(cat => (
              <div key={cat.category} style={{ background: 'var(--bg-tertiary)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                  <span>{cat.category}</span>
                  <span style={{ color: cat.percentage >= 70 ? 'var(--accent-emerald)' : cat.percentage >= 40 ? 'var(--accent-amber)' : 'var(--accent-rose)' }}>
                    {cat.matchedCount} / {cat.totalInJd} ({cat.percentage}%)
                  </span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${cat.percentage}%`,
                      background: cat.percentage >= 70 ? 'var(--accent-emerald)' : cat.percentage >= 40 ? 'var(--accent-amber)' : 'var(--accent-rose)'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
