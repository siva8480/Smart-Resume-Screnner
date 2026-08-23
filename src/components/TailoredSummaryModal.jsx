import { useState, useEffect } from 'react';
import { X, Sparkles, Copy, Check, Loader2, HelpCircle, FileText, Send } from 'lucide-react';
import { generateAITailoredContent } from '../services/aiService';

export const TailoredSummaryModal = ({
  isOpen,
  onClose,
  resumeText,
  jdText,
  apiKey
}) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');
  const [copiedKey, setCopiedKey] = useState(null);

  useEffect(() => {
    if (isOpen && resumeText && jdText) {
      handleGenerate();
    }
  }, [isOpen]);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const response = await generateAITailoredContent(resumeText, jdText, apiKey);
      setData(response);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop animate-slide-up" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div className="logo-icon" style={{ width: '32px', height: '32px' }}>
              <Sparkles size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>AI Resume Tailor & Strategy</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                {apiKey ? 'Powered by Gemini AI' : 'Deterministic Semantic Optimization Engine'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '0.35rem 0.6rem', borderRadius: '50%' }}
          >
            <X size={18} />
          </button>
        </div>

        <div className="tabs-nav" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <button
            className={`tab-btn ${activeTab === 'summary' ? 'active' : ''}`}
            onClick={() => setActiveTab('summary')}
          >
            <FileText size={15} /> Tailored Summary
          </button>
          <button
            className={`tab-btn ${activeTab === 'bullets' ? 'active' : ''}`}
            onClick={() => setActiveTab('bullets')}
          >
            <Sparkles size={15} /> Impact Bullets
          </button>
          <button
            className={`tab-btn ${activeTab === 'coverLetter' ? 'active' : ''}`}
            onClick={() => setActiveTab('coverLetter')}
          >
            <Send size={15} /> Cover Letter Hook
          </button>
          <button
            className={`tab-btn ${activeTab === 'interview' ? 'active' : ''}`}
            onClick={() => setActiveTab('interview')}
          >
            <HelpCircle size={15} /> Interview Prep
          </button>
        </div>

        {isLoading && (
          <div style={{ padding: '3rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <Loader2 size={36} className="animate-spin" color="var(--accent-primary)" />
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Synthesizing tailored recommendations for this role...
            </p>
          </div>
        )}

        {!isLoading && data && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {activeTab === 'summary' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Use this executive summary at the top of your resume to instantly grab recruiters' attention and match the job description:
                </p>
                <div style={{ background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                  {data.tailoredSummary}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => handleCopy(data.tailoredSummary, 'summary')}
                    className="btn btn-primary"
                    style={{ fontSize: '0.85rem' }}
                  >
                    {copiedKey === 'summary' ? <Check size={15} /> : <Copy size={15} />}
                    {copiedKey === 'summary' ? 'Copied Summary!' : 'Copy Summary'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'bullets' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Tailored high-impact bullet points incorporating target keywords:
                </p>
                {data.improvedBullets.map((item, idx) => (
                  <div key={idx} style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      <strong>Context:</strong> {item.original}
                    </div>
                    <div style={{ fontSize: '0.92rem', color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.5, background: 'rgba(16, 185, 129, 0.08)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                      • {item.improved}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)' }}>💡 {item.reason}</span>
                      <button
                        onClick={() => handleCopy(item.improved, `bullet-${idx}`)}
                        className="btn btn-secondary"
                        style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}
                      >
                        {copiedKey === `bullet-${idx}` ? <Check size={12} /> : <Copy size={12} />}
                        Copy
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'coverLetter' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Tailored opening paragraph for your cover letter:
                </p>
                <div style={{ background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                  {data.coverLetterSnippet}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => handleCopy(data.coverLetterSnippet, 'coverLetter')}
                    className="btn btn-primary"
                    style={{ fontSize: '0.85rem' }}
                  >
                    {copiedKey === 'coverLetter' ? <Check size={15} /> : <Copy size={15} />}
                    {copiedKey === 'coverLetter' ? 'Copied Cover Letter Hook!' : 'Copy Cover Letter Hook'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'interview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Likely interview questions based on the requirements of this role:
                </p>
                {data.interviewQuestions.map((q, idx) => (
                  <div key={idx} style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--accent-primary)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>
                      {idx + 1}
                    </span>
                    <span style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>{q}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
