import React from 'react';
import { FolderGit2, CheckCircle2, AlertTriangle, ExternalLink, GitBranch, Layers, Award, Sparkles, Code2, Database } from 'lucide-react';

export const ProjectDepthAudit = ({ projectDepth, isFresher }) => {
  const { projects, projectCount, overallDepthScore, hasGithubOrLiveLinks, productionReadyCount } = projectDepth;

  return (
    <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header & Overview Stats */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FolderGit2 size={20} color="var(--accent-cyan)" />
              Project Depth & Technical Execution Audit
            </h3>
            {isFresher && (
              <span className="badge badge-bonus" style={{ fontSize: '0.76rem', padding: '0.25rem 0.65rem' }}>
                <Sparkles size={12} /> Fresher / Project-Weighted Mode
              </span>
            )}
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            For freshers and engineers, recruiters judge your technical maturity based on project architecture, live deployments, and full-stack depth.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span
            className="badge"
            style={{
              background: overallDepthScore >= 80 ? 'rgba(16, 185, 129, 0.16)' : overallDepthScore >= 60 ? 'rgba(245, 158, 11, 0.16)' : 'rgba(244, 63, 94, 0.16)',
              color: overallDepthScore >= 80 ? '#34D399' : overallDepthScore >= 60 ? '#FBBF24' : '#FB7185',
              fontSize: '0.85rem',
              padding: '0.4rem 0.9rem'
            }}
          >
            <Award size={15} /> Project Depth: {overallDepthScore}/100
          </span>
        </div>
      </div>

      {/* Top 3 Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div style={{ background: 'var(--bg-tertiary)', padding: '1rem 1.15rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 700 }}>DETECTED PROJECTS</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
            {projectCount} {projectCount === 1 ? 'Project' : 'Projects'}
          </div>
          <span style={{ fontSize: '0.75rem', color: projectCount >= 2 ? 'var(--accent-emerald)' : 'var(--accent-amber)', fontWeight: 600 }}>
            {projectCount >= 2 ? '✓ Good portfolio density' : '⚠ Aim for 2-3 comprehensive projects'}
          </span>
        </div>

        <div style={{ background: 'var(--bg-tertiary)', padding: '1rem 1.15rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 700 }}>PRODUCTION READINESS</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-emerald)', marginTop: '0.2rem' }}>
            {productionReadyCount} of {projectCount}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Full-stack, DB, Auth & Deployment
          </span>
        </div>

        <div style={{ background: 'var(--bg-tertiary)', padding: '1rem 1.15rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 700 }}>LIVE DEMO & GITHUB LINKS</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: hasGithubOrLiveLinks ? 'var(--accent-cyan)' : '#FB7185', marginTop: '0.2rem' }}>
            {hasGithubOrLiveLinks ? 'Verified' : 'Missing'}
          </div>
          <span style={{ fontSize: '0.75rem', color: hasGithubOrLiveLinks ? 'var(--accent-emerald)' : '#FB7185', fontWeight: 600 }}>
            {hasGithubOrLiveLinks ? '✓ Code & deployment links found' : '⚠ Add GitHub & Vercel/Netlify URLs'}
          </span>
        </div>
      </div>

      {/* Projects List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
          Project Breakdown & Architectural Scorecard:
        </h4>

        {projects.map((proj, idx) => (
          <div
            key={proj.id || idx}
            style={{
              background: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              borderLeft: `5px solid ${proj.rating === 'Production-Ready' ? 'var(--accent-emerald)' : proj.rating === 'Intermediate' ? 'var(--accent-amber)' : 'var(--accent-rose)'}`,
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem'
            }}
          >
            {/* Project Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {proj.title}
                </span>
                <span
                  className="badge"
                  style={{
                    background: proj.rating === 'Production-Ready' ? 'rgba(16, 185, 129, 0.16)' : proj.rating === 'Intermediate' ? 'rgba(245, 158, 11, 0.16)' : 'rgba(244, 63, 94, 0.16)',
                    color: proj.rating === 'Production-Ready' ? '#34D399' : proj.rating === 'Intermediate' ? '#FBBF24' : '#FB7185',
                    fontSize: '0.74rem'
                  }}
                >
                  {proj.rating} ({proj.score}/100)
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {proj.hasLiveLink && (
                  <span className="badge badge-matched" style={{ fontSize: '0.72rem' }}>
                    <ExternalLink size={12} /> Live Link
                  </span>
                )}
                {proj.hasGithubRepo && (
                  <span className="badge badge-bonus" style={{ fontSize: '0.72rem' }}>
                    <GitBranch size={12} /> GitHub Repo
                  </span>
                )}
              </div>
            </div>

            {/* Tech Stack Chips */}
            {proj.techStack && proj.techStack.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>Tech Stack:</span>
                {proj.techStack.map(t => (
                  <span key={t} className="badge badge-bonus" style={{ fontSize: '0.72rem', padding: '0.2rem 0.55rem' }}>
                    {t}
                  </span>
                ))}
              </div>
            )}

            {/* Architecture Highlights & Metrics */}
            <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: proj.hasArchitectureDepth ? 'var(--accent-emerald)' : 'var(--text-muted)' }}>
                <Database size={13} /> {proj.hasArchitectureDepth ? 'Full-Stack Architecture Detected' : 'Basic Architecture'}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: proj.hasQuantifiableImpact ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>
                <Code2 size={13} /> {proj.hasQuantifiableImpact ? 'Quantified Impact Metrics Included' : 'Missing Quantified Impact'}
              </span>
            </div>

            {/* Actionable Project Improvement Tips */}
            {proj.tips && proj.tips.length > 0 && (
              <div style={{ background: 'rgba(0, 0, 0, 0.15)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {proj.tips.map((tip, tIdx) => (
                  <div key={tIdx} style={{ fontSize: '0.78rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ color: 'var(--accent-amber)', fontWeight: 800 }}>💡</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
