import { Briefcase, Trash2 } from 'lucide-react';

export const JobDescriptionInput = ({
  jdText,
  onChangeText,
  onClear
}) => {
  const wordCount = jdText ? (jdText.match(/\b[\w'-]+\b/g) || []).length : 0;

  return (
    <div className="glass-card input-panel">
      <div className="panel-header">
        <div className="panel-title">
          <Briefcase size={20} style={{ color: 'var(--accent-cyan)' }} />
          <span>2. Job Description (JD)</span>
        </div>
        <div className="panel-badge" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {wordCount > 0 && <span>{wordCount} words</span>}
          {jdText && (
            <button
              onClick={onClear}
              className="btn btn-secondary"
              style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', color: '#F87171' }}
              title="Clear Job Description"
            >
              <Trash2 size={13} />
              Clear
            </button>
          )}
        </div>
      </div>

      <textarea
        className="custom-textarea"
        placeholder="Paste the target job description here (responsibilities, required skills, qualifications, technologies)..."
        value={jdText}
        onChange={(e) => onChangeText(e.target.value)}
      />
    </div>
  );
};
