import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, GraduationCap, Briefcase, Code, FileCode2, Copy, Check, Sparkles, Award } from 'lucide-react';
import { useToast } from './Toast';

export const StructuredDataViewer = ({ structuredData, fitScore10, shortlistStatus }) => {
  const { addToast } = useToast();
  const [viewJson, setViewJson] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(structuredData, null, 2));
    setCopied(true);
    addToast('Structured JSON copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  if (!structuredData) return null;

  return (
    <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileCode2 size={20} color="var(--accent-primary)" />
              Extracted Structured Resume Data
            </h3>
            <span className="badge badge-bonus" style={{ fontSize: '0.76rem' }}>
              <Sparkles size={12} /> Auto-Extracted Entities
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Structured schema extracted from unstructured resume document (contact, education, skills, experience).
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setViewJson(!viewJson)}
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
          >
            {viewJson ? 'Show Visual Cards' : 'View Raw JSON Schema'}
          </button>
          {viewJson && (
            <button
              onClick={handleCopyJson}
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
            >
              {copied ? <Check size={13} color="var(--accent-emerald)" /> : <Copy size={13} />}
              {copied ? 'Copied' : 'Copy JSON'}
            </button>
          )}
        </div>
      </div>

      {viewJson ? (
        <pre style={{ background: 'var(--bg-paper)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', overflowX: 'auto', fontSize: '0.82rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
          {JSON.stringify(structuredData, null, 2)}
        </pre>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {/* Candidate Profile Card */}
          <div style={{ background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
              <User size={16} color="var(--accent-primary)" />
              <h4 style={{ fontSize: '0.92rem', fontWeight: 800 }}>Candidate Profile</h4>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.84rem' }}>
              <div><strong>Name:</strong> {structuredData.candidateName}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Mail size={13} color="var(--text-muted)" />
                <span>{structuredData.contact.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Phone size={13} color="var(--text-muted)" />
                <span>{structuredData.contact.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={13} color="var(--text-muted)" />
                <span>{structuredData.contact.location}</span>
              </div>
            </div>
          </div>

          {/* Education Card */}
          <div style={{ background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
              <GraduationCap size={16} color="var(--accent-cyan)" />
              <h4 style={{ fontSize: '0.92rem', fontWeight: 800 }}>Education & Academic Background</h4>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.84rem' }}>
              <div><strong>Degree:</strong> {structuredData.education.degree}</div>
              <div><strong>Institution:</strong> {structuredData.education.university}</div>
              <div><strong>Graduation / Batch:</strong> {structuredData.education.graduationYear}</div>
              <div><strong>Academic Standing:</strong> {structuredData.education.gpa}</div>
            </div>
          </div>

          {/* Experience & Seniority Card */}
          <div style={{ background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
              <Briefcase size={16} color="var(--accent-emerald)" />
              <h4 style={{ fontSize: '0.92rem', fontWeight: 800 }}>Experience & Seniority Fit</h4>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.84rem' }}>
              <div><strong>Experience Detected:</strong> {structuredData.experience.yearsDetected}</div>
              <div><strong>Candidate Tier:</strong> {structuredData.experience.level}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.3rem' }}>
                <span className="badge badge-bonus">Skills Count: {structuredData.skillsCount}</span>
              </div>
            </div>
          </div>

          {/* Primary Skills Extracted */}
          <div style={{ background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
              <Code size={16} color="var(--accent-amber)" />
              <h4 style={{ fontSize: '0.92rem', fontWeight: 800 }}>Key Technical Entities ({structuredData.topSkills.length})</h4>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {structuredData.topSkills.map(s => (
                <span key={s} className="skill-tag badge-matched" style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
