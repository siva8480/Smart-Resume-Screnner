import React, { useState, useEffect } from 'react';
import { Users, Award, CheckCircle2, AlertTriangle, ShieldAlert, Sparkles, Download, Trash2, ChevronRight, Eye, Briefcase, GraduationCap } from 'lucide-react';
import { useToast } from './Toast';

export const CandidateShortlistDashboard = ({ currentResult, jdText, onSelectCandidate }) => {
  const { addToast } = useToast();
  const [candidates, setCandidates] = useState(() => {
    const saved = localStorage.getItem('screener_candidates_db');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [filterStatus, setFilterStatus] = useState('all');

  // Auto-save or update current scanned candidate to the database
  useEffect(() => {
    if (currentResult && currentResult.structuredData) {
      const candidateEntry = {
        id: `cand-${Date.now()}`,
        name: currentResult.structuredData.candidateName,
        email: currentResult.structuredData.contact.email,
        degree: currentResult.structuredData.education.degree,
        experience: currentResult.structuredData.experience.yearsDetected,
        fitScore10: currentResult.llmScreening?.fitScore10 || currentResult.fitScore10 || 8.0,
        overallPercentage: currentResult.overallScore,
        shortlistStatus: currentResult.llmScreening?.shortlistStatus || currentResult.shortlistStatus || 'Shortlisted',
        recruiterJustification: currentResult.llmScreening?.recruiterJustification || currentResult.summaryRecommendations[0] || 'Strong candidate alignment.',
        keyStrengths: currentResult.llmScreening?.keyStrengths || currentResult.skills.matched.slice(0, 3).map(s => s.name),
        criticalGaps: currentResult.llmScreening?.criticalGaps || currentResult.skills.missing.slice(0, 2).map(s => s.name),
        scannedAt: new Date().toLocaleDateString(),
        isFresher: currentResult.isFresher,
        matchedSkillsCount: currentResult.skills.matched.length
      };

      setCandidates(prev => {
        // Prevent duplicate by email or name
        const filtered = prev.filter(c => c.name !== candidateEntry.name);
        const updated = [candidateEntry, ...filtered];
        localStorage.setItem('screener_candidates_db', JSON.stringify(updated));
        return updated;
      });
    }
  }, [currentResult]);

  const handleClearDb = () => {
    localStorage.removeItem('screener_candidates_db');
    setCandidates([]);
    addToast('Candidate database cleared', 'info');
  };

  const handleExportCsv = () => {
    if (candidates.length === 0) return;
    const headers = ['Name', 'Email', 'Degree', 'Experience', 'Fit Score (1-10)', 'Match %', 'Status', 'Recruiter Justification'];
    const rows = candidates.map(c => [
      `"${c.name}"`,
      `"${c.email}"`,
      `"${c.degree}"`,
      `"${c.experience}"`,
      c.fitScore10,
      `${c.overallPercentage}%`,
      `"${c.shortlistStatus}"`,
      `"${(c.recruiterJustification || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Candidate_Shortlist_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    addToast('Candidate shortlist exported to CSV!', 'success');
  };

  const filteredCandidates = filterStatus === 'all'
    ? candidates
    : candidates.filter(c => c.shortlistStatus === filterStatus);

  const shortlistedCount = candidates.filter(c => c.shortlistStatus === 'Shortlisted').length;
  const holdCount = candidates.filter(c => c.shortlistStatus === 'Hold / Review').length;
  const screenedOutCount = candidates.filter(c => c.shortlistStatus === 'Screened Out').length;

  return (
    <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={20} color="var(--accent-primary)" />
              Candidate Shortlist & Screener Database
            </h3>
            <span className="badge badge-bonus" style={{ fontSize: '0.76rem' }}>
              <Sparkles size={12} /> LLM Semantic Screening & Ranking
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Rank candidates evaluated against the target Job Description with 1–10 fit rating and recruiter justification.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {candidates.length > 0 && (
            <>
              <button
                onClick={handleExportCsv}
                className="btn btn-secondary"
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
              >
                <Download size={14} /> Export Shortlist (CSV)
              </button>
              <button
                onClick={handleClearDb}
                className="btn btn-secondary"
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem', color: '#FB7185' }}
                title="Clear Database"
              >
                <Trash2 size={14} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setFilterStatus('all')}
          className={`preset-chip ${filterStatus === 'all' ? 'active' : ''}`}
          style={{ background: filterStatus === 'all' ? 'var(--accent-primary)' : 'var(--bg-tertiary)', color: filterStatus === 'all' ? '#FFF' : 'var(--text-primary)' }}
        >
          All Candidates ({candidates.length})
        </button>
        <button
          onClick={() => setFilterStatus('Shortlisted')}
          className={`preset-chip ${filterStatus === 'Shortlisted' ? 'active' : ''}`}
          style={{ background: filterStatus === 'Shortlisted' ? 'rgba(16, 185, 129, 0.25)' : 'var(--bg-tertiary)', color: filterStatus === 'Shortlisted' ? '#34D399' : 'var(--text-primary)' }}
        >
          <CheckCircle2 size={13} /> Shortlisted ({shortlistedCount})
        </button>
        <button
          onClick={() => setFilterStatus('Hold / Review')}
          className={`preset-chip ${filterStatus === 'Hold / Review' ? 'active' : ''}`}
          style={{ background: filterStatus === 'Hold / Review' ? 'rgba(245, 158, 11, 0.25)' : 'var(--bg-tertiary)', color: filterStatus === 'Hold / Review' ? '#FBBF24' : 'var(--text-primary)' }}
        >
          <AlertTriangle size={13} /> Hold / Review ({holdCount})
        </button>
        <button
          onClick={() => setFilterStatus('Screened Out')}
          className={`preset-chip ${filterStatus === 'Screened Out' ? 'active' : ''}`}
          style={{ background: filterStatus === 'Screened Out' ? 'rgba(244, 63, 94, 0.25)' : 'var(--bg-tertiary)', color: filterStatus === 'Screened Out' ? '#FB7185' : 'var(--text-primary)' }}
        >
          <ShieldAlert size={13} /> Screened Out ({screenedOutCount})
        </button>
      </div>

      {/* Candidate Shortlist Table / Cards */}
      {filteredCandidates.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
          No candidates found in this view. Run a screening scan above or load a sample preset to populate the shortlist database!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredCandidates.map((cand, idx) => (
            <div
              key={cand.id}
              style={{
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                borderLeft: `5px solid ${cand.shortlistStatus === 'Shortlisted' ? 'var(--accent-emerald)' : cand.shortlistStatus === 'Hold / Review' ? 'var(--accent-amber)' : 'var(--accent-rose)'}`,
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem'
              }}
            >
              {/* Card Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.65rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--grad-brand)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem' }}>
                    #{idx + 1}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {cand.name}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      <span>{cand.email}</span>
                      <span>•</span>
                      <span>{cand.experience}</span>
                      <span>•</span>
                      <span>{cand.degree}</span>
                    </div>
                  </div>
                </div>

                {/* Score & Status Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: cand.fitScore10 >= 7.5 ? 'var(--accent-emerald)' : cand.fitScore10 >= 6.0 ? 'var(--accent-amber)' : 'var(--accent-rose)' }}>
                      {cand.fitScore10} <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>/ 10</span>
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Match: {cand.overallPercentage}%</div>
                  </div>

                  <span
                    className="badge"
                    style={{
                      background: cand.shortlistStatus === 'Shortlisted' ? 'rgba(16, 185, 129, 0.18)' : cand.shortlistStatus === 'Hold / Review' ? 'rgba(245, 158, 11, 0.18)' : 'rgba(244, 63, 94, 0.18)',
                      color: cand.shortlistStatus === 'Shortlisted' ? '#34D399' : cand.shortlistStatus === 'Hold / Review' ? '#FBBF24' : '#FB7185',
                      fontSize: '0.82rem',
                      padding: '0.4rem 0.85rem'
                    }}
                  >
                    {cand.shortlistStatus}
                  </span>
                </div>
              </div>

              {/* Recruiter Justification Box */}
              <div style={{ background: 'rgba(0, 0, 0, 0.15)', padding: '0.85rem 1.1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Sparkles size={13} /> LLM Screening Justification:
                </div>
                <div style={{ fontSize: '0.86rem', color: 'var(--text-primary)', lineHeight: 1.55 }}>
                  {cand.recruiterJustification}
                </div>
              </div>

              {/* Key Strengths & Missing Gaps */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem', fontSize: '0.8rem' }}>
                {cand.keyStrengths && cand.keyStrengths.length > 0 && (
                  <div>
                    <span style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>✓ Strengths: </span>
                    <span style={{ color: 'var(--text-secondary)' }}>{cand.keyStrengths.join(' • ')}</span>
                  </div>
                )}
                {cand.criticalGaps && cand.criticalGaps.length > 0 && (
                  <div>
                    <span style={{ fontWeight: 700, color: '#FB7185' }}>⚠ Review Gaps: </span>
                    <span style={{ color: 'var(--text-secondary)' }}>{cand.criticalGaps.join(' • ')}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
