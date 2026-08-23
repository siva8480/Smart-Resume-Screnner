import React, { useState } from 'react';
import { Sparkles, Check, Copy, AlertTriangle, ShieldAlert, CheckCircle2, ArrowRight, Filter, Wand2 } from 'lucide-react';
import { useToast } from './Toast';

export const BulletPointOptimizer = ({ bullets, onApplyRewrite }) => {
  const { addToast } = useToast();
  const [filterRating, setFilterRating] = useState('all'); // 'all' | 'Weak' | 'Moderate' | 'Strong'
  const [copiedId, setCopiedId] = useState(null);
  const [appliedIds, setAppliedIds] = useState(new Set());

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    addToast('Rewritten bullet copied to clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleApply = (original, improved, id) => {
    if (onApplyRewrite) {
      onApplyRewrite(original, improved);
      setAppliedIds(prev => new Set(prev).add(id));
      addToast('Applied high-impact rewrite directly to your resume!', 'ai');
    }
  };

  if (!bullets || bullets.length === 0) {
    return (
      <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        No bullet points detected in resume. Try formatting experience items with standard bullet symbols (• or -).
      </div>
    );
  }

  const strongCount = bullets.filter(b => b.rating === 'Strong').length;
  const weakCount = bullets.filter(b => b.rating === 'Weak').length;
  const moderateCount = bullets.filter(b => b.rating === 'Moderate').length;

  const filteredBullets = filterRating === 'all' 
    ? bullets 
    : bullets.filter(b => b.rating === filterRating);

  return (
    <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header & Filter Pills */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Wand2 size={20} color="var(--accent-primary)" />
            Bullet Point Impact & Action Verb Optimizer
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            ATS algorithms and hiring managers favor strong power verbs and quantifiable business metrics (%, $, scale).
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setFilterRating('all')}
            className={`preset-chip ${filterRating === 'all' ? 'active' : ''}`}
            style={{
              background: filterRating === 'all' ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
              color: filterRating === 'all' ? '#FFF' : 'var(--text-primary)'
            }}
          >
            All ({bullets.length})
          </button>
          <button
            onClick={() => setFilterRating('Weak')}
            className={`preset-chip ${filterRating === 'Weak' ? 'active' : ''}`}
            style={{
              background: filterRating === 'Weak' ? 'rgba(244, 63, 94, 0.25)' : 'var(--bg-tertiary)',
              color: filterRating === 'Weak' ? '#FB7185' : 'var(--text-primary)'
            }}
          >
            <ShieldAlert size={12} /> Needs Metrics ({weakCount})
          </button>
          <button
            onClick={() => setFilterRating('Moderate')}
            className={`preset-chip ${filterRating === 'Moderate' ? 'active' : ''}`}
            style={{
              background: filterRating === 'Moderate' ? 'rgba(245, 158, 11, 0.25)' : 'var(--bg-tertiary)',
              color: filterRating === 'Moderate' ? '#FBBF24' : 'var(--text-primary)'
            }}
          >
            Moderate ({moderateCount})
          </button>
          <button
            onClick={() => setFilterRating('Strong')}
            className={`preset-chip ${filterRating === 'Strong' ? 'active' : ''}`}
            style={{
              background: filterRating === 'Strong' ? 'rgba(16, 185, 129, 0.25)' : 'var(--bg-tertiary)',
              color: filterRating === 'Strong' ? '#34D399' : 'var(--text-primary)'
            }}
          >
            <CheckCircle2 size={12} /> High Impact ({strongCount})
          </button>
        </div>
      </div>

      {/* Bullet Cards List */}
      <div className="bullet-list">
        {filteredBullets.map((bullet) => {
          const isApplied = appliedIds.has(bullet.id);

          return (
            <div key={bullet.id} className={`bullet-card ${bullet.rating}`}>
              {/* Header Badges */}
              <div className="bullet-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span
                    className="badge"
                    style={{
                      background: bullet.rating === 'Strong' ? 'rgba(16, 185, 129, 0.18)' : bullet.rating === 'Moderate' ? 'rgba(245, 158, 11, 0.18)' : 'rgba(244, 63, 94, 0.18)',
                      color: bullet.rating === 'Strong' ? '#34D399' : bullet.rating === 'Moderate' ? '#FBBF24' : '#FB7185',
                      fontSize: '0.78rem'
                    }}
                  >
                    {bullet.rating} Impact • Score: {bullet.score}/100
                  </span>

                  {bullet.hasActionVerb && (
                    <span style={{ fontSize: '0.76rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>
                      ✓ Action Verb: "{bullet.actionVerb}"
                    </span>
                  )}

                  {bullet.hasQuantifiableMetric ? (
                    <span style={{ fontSize: '0.76rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                      ✓ Quantified ({bullet.metricsFound.join(', ')})
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.76rem', color: '#F87171', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <AlertTriangle size={12} /> Missing Quantifiable Impact
                    </span>
                  )}

                  {bullet.hasWeakPhrase && (
                    <span style={{ fontSize: '0.76rem', color: '#FB7185', fontWeight: 700 }}>
                      ⚠ Weak Phrase: "{bullet.weakPhraseFound}"
                    </span>
                  )}
                </div>
              </div>

              {/* Current text */}
              <div className="bullet-original">
                <span style={{ color: 'var(--text-muted)', marginRight: '0.5rem', fontWeight: 600 }}>Original:</span>
                <span>{bullet.text}</span>
              </div>

              {/* Improved Box with 1-Click Apply */}
              {bullet.rating !== 'Strong' && (
                <div className="bullet-improved-box">
                  <div className="improved-label">
                    <Sparkles size={14} />
                    <span>Recommended Power Rewrite:</span>
                  </div>
                  <div style={{ fontSize: '0.92rem', color: 'var(--text-primary)', lineHeight: 1.55, fontWeight: 500 }}>
                    {bullet.improvedExample}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.35rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      💡 {bullet.suggestion}
                    </span>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleCopy(bullet.improvedExample, bullet.id)}
                        className="btn btn-secondary"
                        style={{ padding: '0.35rem 0.8rem', fontSize: '0.78rem' }}
                      >
                        {copiedId === bullet.id ? <Check size={13} color="var(--accent-emerald)" /> : <Copy size={13} />}
                        {copiedId === bullet.id ? 'Copied' : 'Copy'}
                      </button>

                      {onApplyRewrite && (
                        <button
                          onClick={() => handleApply(bullet.text, bullet.improvedExample, bullet.id)}
                          className={isApplied ? "btn btn-secondary" : "btn btn-primary"}
                          style={{ padding: '0.35rem 0.85rem', fontSize: '0.78rem' }}
                          disabled={isApplied}
                        >
                          {isApplied ? <CheckCircle2 size={13} color="var(--accent-emerald)" /> : <Sparkles size={13} />}
                          {isApplied ? 'Applied to Resume' : 'Apply to Resume'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
