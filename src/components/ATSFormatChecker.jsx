import { CheckCircle, AlertTriangle, Mail, Phone, Globe, MapPin, FileCheck2, AlignLeft, ShieldCheck } from 'lucide-react';

export const ATSFormatChecker = ({ health }) => {
  return (
    <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={20} color="var(--accent-emerald)" />
            ATS Formatting & Parseability Health Check
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Ensures ATS applicant tracking systems can accurately extract your contact info, sections, and experience.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            className="badge"
            style={{
              background: health.score >= 80 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              color: health.score >= 80 ? '#34D399' : '#FBBF24',
              fontSize: '0.85rem'
            }}
          >
            Health Score: {health.score}/100
          </span>
        </div>
      </div>

      <div className="health-grid">
        <div style={{ background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)' }}>
            <Mail size={16} color="var(--accent-primary)" /> Contact Details Detection
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                <Mail size={14} /> Email Address
              </span>
              {health.hasEmail ? (
                <span className="badge badge-matched"><CheckCircle size={12} /> {health.email || 'Found'}</span>
              ) : (
                <span className="badge badge-critical"><AlertTriangle size={12} /> Missing</span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                <Phone size={14} /> Phone Number
              </span>
              {health.hasPhone ? (
                <span className="badge badge-matched"><CheckCircle size={12} /> {health.phone || 'Found'}</span>
              ) : (
                <span className="badge badge-critical"><AlertTriangle size={12} /> Missing</span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                <Globe size={14} /> LinkedIn / Portfolio
              </span>
              {health.hasLinkedIn || health.hasGitHub ? (
                <span className="badge badge-matched"><CheckCircle size={12} /> Detected</span>
              ) : (
                <span className="badge badge-recommended"><AlertTriangle size={12} /> Recommended</span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                <MapPin size={14} /> Location / Remote Status
              </span>
              {health.hasLocation ? (
                <span className="badge badge-matched"><CheckCircle size={12} /> Detected</span>
              ) : (
                <span className="badge badge-recommended"><AlertTriangle size={12} /> Not Specified</span>
              )}
            </div>
          </div>
        </div>

        <div style={{ background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)' }}>
            <FileCheck2 size={16} color="var(--accent-cyan)" /> Standard Section Headers
          </h4>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.25rem' }}>
            {['Experience', 'Skills', 'Education', 'Summary', 'Projects'].map((sec) => {
              const isFound = health.foundSections.includes(sec);
              return (
                <span
                  key={sec}
                  className={`badge ${isFound ? 'badge-matched' : 'badge-recommended'}`}
                  style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                >
                  {isFound ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
                  {sec}
                </span>
              );
            })}
          </div>

          <div style={{ marginTop: '0.5rem', fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <AlignLeft size={14} /> Total Words: <strong style={{ color: 'var(--text-primary)' }}>{health.wordCount}</strong> ({health.bulletPointCount} bullet points)
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {health.strengths.length > 0 && (
          <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-emerald)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle size={14} /> What You Did Right:
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.82rem', color: 'var(--text-primary)' }}>
              {health.strengths.map((s, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ color: 'var(--accent-emerald)' }}>✓</span> {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {health.issues.length > 0 && (
          <div style={{ background: 'rgba(244, 63, 94, 0.05)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
            <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FB7185', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <AlertTriangle size={14} /> Formatting Improvements Needed:
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.82rem', color: 'var(--text-primary)' }}>
              {health.issues.map((issue, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ color: '#FB7185' }}>⚠</span> {issue}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
