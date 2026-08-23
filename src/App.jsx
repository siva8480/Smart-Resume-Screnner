import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { ResumeUploader } from './components/ResumeUploader';
import { JobDescriptionInput } from './components/JobDescriptionInput';
import { ScoreOverview } from './components/ScoreOverview';
import { SkillGapAnalysis } from './components/SkillGapAnalysis';
import { BulletPointOptimizer } from './components/BulletPointOptimizer';
import { ATSFormatChecker } from './components/ATSFormatChecker';
import { ATSKeywordHighlighter } from './components/ATSKeywordHighlighter';
import { ProjectDepthAudit } from './components/ProjectDepthAudit';
import { TailoredSummaryModal } from './components/TailoredSummaryModal';
import { ReportExport } from './components/ReportExport';
import { ToastProvider, useToast } from './components/Toast';
import { runATSScanner } from './services/atsEngine';
import { SAMPLE_PRESETS } from './services/sampleData';
import { Play, Sparkles, Target, Layers, ShieldCheck, Hash, ArrowRight, Zap, CheckCircle2, Eye, FolderGit2, GraduationCap, Briefcase } from 'lucide-react';
import './App.css';

function MainApp() {
  const { addToast } = useToast();

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('resume_scanner_theme') || 'dark';
  });

  const [candidateMode, setCandidateMode] = useState('auto'); // 'auto' | 'fresher' | 'experienced'
  const [resumeText, setResumeText] = useState('');
  const [jdText, setJdText] = useState('');
  const [parsedMeta, setParsedMeta] = useState(null);

  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('highlighter');

  const [isTailorModalOpen, setIsTailorModalOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('resume_scanner_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    addToast(`Switched to ${next === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
  };

  const handleLoadPreset = (preset) => {
    setResumeText(preset.resumeText);
    setJdText(preset.jdText);
    setParsedMeta({
      filename: `${preset.title.replace(/\s+/g, '_')}_Sample_Resume.pdf`,
      text: preset.resumeText,
      wordCount: (preset.resumeText.match(/\b[\w'-]+\b/g) || []).length,
      charCount: preset.resumeText.length,
      pageCount: 1,
      fileType: 'pdf'
    });
    
    // Auto adjust mode based on preset
    if (preset.id.includes('fresher')) {
      setCandidateMode('fresher');
    } else {
      setCandidateMode('experienced');
    }
    
    setResult(null);
    addToast(`Loaded preset: ${preset.title}`, 'info');
  };

  const handleRunScan = () => {
    if (!resumeText.trim() || !jdText.trim()) return;

    setIsScanning(true);
    setTimeout(() => {
      try {
        const scanResult = runATSScanner(resumeText, jdText, candidateMode);
        setResult(scanResult);

        if (scanResult.overallScore >= 70) {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 }
          });
        }
        addToast(`Scan complete: ${scanResult.isFresher ? 'Fresher/Project-Centric Mode' : 'Industry Professional Mode'} (${scanResult.overallScore}%)`, 'success');
      } catch (err) {
        console.error('Scan error:', err);
        addToast('Error scanning resume.', 'error');
      } finally {
        setIsScanning(false);
      }
    }, 400);
  };

  const handleReset = () => {
    setResumeText('');
    setJdText('');
    setParsedMeta(null);
    setResult(null);
    addToast('Ready for a new scan', 'info');
  };

  const handleInjectSkill = (skill) => {
    setResumeText(prev => {
      if (prev.includes(skill)) return prev;
      return `${prev}\n• ${skill}`;
    });
  };

  const handleApplyRewrite = (original, improved) => {
    setResumeText(prev => {
      if (prev.includes(original)) {
        return prev.replace(original, improved);
      }
      return `${prev}\n• ${improved}`;
    });
  };

  return (
    <div className="app-container">
      {/* Header */}
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenTailorModal={() => setIsTailorModalOpen(true)}
        onReset={handleReset}
        hasScanResult={!!result}
      />

      {/* Preset Picker Banner */}
      {!result && (
        <div className="presets-banner no-print animate-slide-up">
          <div className="presets-label">
            <Sparkles size={18} color="var(--accent-primary)" />
            <span>Try sample resume & job description presets:</span>
          </div>
          <div className="presets-list">
            {SAMPLE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleLoadPreset(preset)}
                className="preset-chip"
                title={`Load ${preset.title}`}
              >
                <Zap size={13} color="var(--accent-cyan)" />
                {preset.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Candidate Profile Evaluation Mode Selector */}
      {!result && (
        <div className="candidate-mode-bar no-print animate-slide-up">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 800 }}>Evaluation Strategy:</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {candidateMode === 'fresher' 
                ? '🎓 Evaluates project depth, architecture, and CS fundamentals instead of years of experience.' 
                : candidateMode === 'experienced'
                ? '💼 Evaluates industry years of experience, leadership, and scale.'
                : '⚡ Auto-detects whether candidate is a Fresher or Experienced.'}
            </span>
          </div>

          <div className="mode-selector">
            <button
              className={`mode-btn ${candidateMode === 'auto' ? 'active' : ''}`}
              onClick={() => setCandidateMode('auto')}
            >
              <Zap size={13} /> Auto Detect
            </button>
            <button
              className={`mode-btn ${candidateMode === 'fresher' ? 'active' : ''}`}
              onClick={() => setCandidateMode('fresher')}
            >
              <GraduationCap size={14} /> Student / Fresher Mode
            </button>
            <button
              className={`mode-btn ${candidateMode === 'experienced' ? 'active' : ''}`}
              onClick={() => setCandidateMode('experienced')}
            >
              <Briefcase size={13} /> Experienced Mode
            </button>
          </div>
        </div>
      )}

      {/* Inputs: Resume (Left) & Job Description (Right) */}
      {!result && (
        <div className="input-grid animate-slide-up">
          <ResumeUploader
            resumeText={resumeText}
            onChangeText={setResumeText}
            parsedMeta={parsedMeta}
            setParsedMeta={setParsedMeta}
          />

          <JobDescriptionInput
            jdText={jdText}
            onChangeText={setJdText}
            onClear={() => setJdText('')}
          />
        </div>
      )}

      {/* Scan Action Button */}
      {!result && (
        <div className="action-bar animate-slide-up">
          <button
            onClick={handleRunScan}
            disabled={!resumeText.trim() || !jdText.trim() || isScanning}
            className="btn btn-primary scan-btn"
          >
            {isScanning ? (
              <>Running ATS Deep Intelligence Scan...</>
            ) : (
              <>
                <Play size={18} fill="#FFF" />
                Scan & Match Resume Against JD
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      )}

      {/* Results View */}
      {result && (
        <div className="results-container animate-slide-up">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }} className="no-print">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
              <span className="badge badge-bonus" style={{ fontSize: '0.82rem', padding: '0.35rem 0.85rem' }}>
                <CheckCircle2 size={14} /> Scan Completed in 0.35s
              </span>
              {result.isFresher && (
                <span className="badge badge-matched" style={{ fontSize: '0.82rem' }}>
                  <GraduationCap size={14} /> Fresher / Project-Centric Evaluation
                </span>
              )}
              {parsedMeta?.filename && (
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Target: <strong>{parsedMeta.filename}</strong>
                </span>
              )}
            </div>

            <ReportExport result={result} resumeFilename={parsedMeta?.filename} />
          </div>

          {/* Hero Score Overview */}
          <ScoreOverview result={result} />

          {/* Result Tabs Navigation */}
          <div className="tabs-nav no-print">
            <button
              className={`tab-btn ${activeTab === 'highlighter' ? 'active' : ''}`}
              onClick={() => setActiveTab('highlighter')}
            >
              <Eye size={16} /> ATS Scanner Simulation
              <span className="tab-count-badge">{result.skills.matched.length} matched</span>
            </button>

            <button
              className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveTab('projects')}
            >
              <FolderGit2 size={16} /> Project Depth Audit
              <span className="tab-count-badge">{result.projectDepth.projectCount} proj</span>
            </button>

            <button
              className={`tab-btn ${activeTab === 'skills' ? 'active' : ''}`}
              onClick={() => setActiveTab('skills')}
            >
              <Target size={16} /> Skill Gap Matrix
              <span className="tab-count-badge">{result.skills.missing.length} missing</span>
            </button>

            <button
              className={`tab-btn ${activeTab === 'bullets' ? 'active' : ''}`}
              onClick={() => setActiveTab('bullets')}
            >
              <Layers size={16} /> Bullet Impact & Rewrites
              <span className="tab-count-badge">{result.bulletAnalysis.length}</span>
            </button>

            <button
              className={`tab-btn ${activeTab === 'format' ? 'active' : ''}`}
              onClick={() => setActiveTab('format')}
            >
              <ShieldCheck size={16} /> ATS Health & Parseability
              <span className="tab-count-badge">{result.atsHealth.score}%</span>
            </button>

            <button
              className={`tab-btn ${activeTab === 'keywords' ? 'active' : ''}`}
              onClick={() => setActiveTab('keywords')}
            >
              <Hash size={16} /> Top JD Keywords
              <span className="tab-count-badge">{result.topKeywords.length}</span>
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'highlighter' && (
            <ATSKeywordHighlighter
              resumeText={resumeText}
              result={result}
              onInjectSkill={handleInjectSkill}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectDepthAudit
              projectDepth={result.projectDepth}
              isFresher={result.isFresher}
            />
          )}

          {activeTab === 'skills' && (
            <SkillGapAnalysis
              result={result}
              onInjectSkill={handleInjectSkill}
            />
          )}

          {activeTab === 'bullets' && (
            <BulletPointOptimizer
              bullets={result.bulletAnalysis}
              onApplyRewrite={handleApplyRewrite}
            />
          )}

          {activeTab === 'format' && (
            <ATSFormatChecker health={result.atsHealth} />
          )}

          {activeTab === 'keywords' && (
            <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                Top High-Frequency Keywords in Job Description
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                These are the most repeated critical keywords found in the job posting and how often they appear in your resume.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
                {result.topKeywords.map(kw => (
                  <div key={kw.word} style={{ background: 'var(--bg-tertiary)', padding: '0.95rem 1.15rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>{kw.word}</span>
                    <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.78rem' }}>
                      <span className="badge badge-bonus">JD: {kw.countInJd}x</span>
                      <span className={`badge ${kw.countInResume > 0 ? 'badge-matched' : 'badge-critical'}`}>
                        Resume: {kw.countInResume}x
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI Tailoring Modal */}
      <TailoredSummaryModal
        isOpen={isTailorModalOpen}
        onClose={() => setIsTailorModalOpen(false)}
        resumeText={resumeText}
        jdText={jdText}
      />
    </div>
  );
}

export function App() {
  return (
    <ToastProvider>
      <MainApp />
    </ToastProvider>
  );
}

export default App;
