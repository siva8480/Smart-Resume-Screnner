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
import { StructuredDataViewer } from './components/StructuredDataViewer';
import { CandidateShortlistDashboard } from './components/CandidateShortlistDashboard';
import { TailoredSummaryModal } from './components/TailoredSummaryModal';
import { ReportExport } from './components/ReportExport';
import { ToastProvider, useToast } from './components/Toast';
import { runATSScreener } from './services/atsEngine';
import { screenCandidateWithLLM } from './services/aiService';
import { SAMPLE_PRESETS } from './services/sampleData';
import { Play, Sparkles, Target, Layers, ShieldCheck, Hash, ArrowRight, Zap, CheckCircle2, Eye, FolderGit2, GraduationCap, Briefcase, FileCode2, Users } from 'lucide-react';
import './App.css';

function MainApp() {
  const { addToast } = useToast();

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('resume_screener_theme') || 'dark';
  });

  const [candidateMode, setCandidateMode] = useState('auto'); // 'auto' | 'fresher' | 'experienced'
  const [resumeText, setResumeText] = useState('');
  const [jdText, setJdText] = useState('');
  const [parsedMeta, setParsedMeta] = useState(null);
  const [parsedJdMeta, setParsedJdMeta] = useState(null);

  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('shortlist');

  const [isTailorModalOpen, setIsTailorModalOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('resume_screener_theme', theme);
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
    
    if (preset.id.includes('fresher')) {
      setCandidateMode('fresher');
    } else {
      setCandidateMode('experienced');
    }
    
    setResult(null);
    addToast(`Loaded preset: ${preset.title}`, 'info');
  };

  const handleRunScan = async () => {
    if (!resumeText.trim() || !jdText.trim()) return;

    setIsScanning(true);
    try {
      // 1. Run local deterministic screening & structured extraction
      const scanResult = runATSScreener(resumeText, jdText, candidateMode);
      
      // 2. Call LLM for semantic 1-10 fit score & justification
      try {
        const llmScreening = await screenCandidateWithLLM(resumeText, jdText);
        scanResult.llmScreening = llmScreening;
        if (llmScreening.fitScore10) {
          scanResult.fitScore10 = llmScreening.fitScore10;
          scanResult.shortlistStatus = llmScreening.shortlistStatus;
        }
      } catch (err) {
        console.warn('LLM screening fallback handled');
      }

      setResult(scanResult);

      if (scanResult.overallScore >= 70) {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
      addToast(`Screening complete: Fit Score ${scanResult.fitScore10 || 8}/10 (${scanResult.shortlistStatus || 'Shortlisted'})`, 'success');
    } catch (err) {
      console.error('Screening error:', err);
      addToast('Error screening resume.', 'error');
    } finally {
      setIsScanning(false);
    }
  };

  const handleReset = () => {
    setResumeText('');
    setJdText('');
    setParsedMeta(null);
    setParsedJdMeta(null);
    setResult(null);
    addToast('Ready for a new candidate screen', 'info');
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
            <span style={{ fontSize: '0.88rem', fontWeight: 800 }}>Screening Strategy:</span>
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
            onClear={() => {
              setJdText('');
              setParsedJdMeta(null);
            }}
            parsedJdMeta={parsedJdMeta}
            setParsedJdMeta={setParsedJdMeta}
          />
        </div>
      )}

      {/* Scan / Screen Action Button */}
      {!result && (
        <div className="action-bar animate-slide-up">
          <button
            onClick={handleRunScan}
            disabled={!resumeText.trim() || !jdText.trim() || isScanning}
            className="btn btn-primary scan-btn"
          >
            {isScanning ? (
              <>Running LLM Semantic Screening & Matching...</>
            ) : (
              <>
                <Play size={18} fill="#FFF" />
                Screen & Match Resume Against JD
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
                <CheckCircle2 size={14} /> Screening Completed
              </span>
              <span
                className="badge"
                style={{
                  background: result.fitScore10 >= 7.5 ? 'rgba(16, 185, 129, 0.18)' : result.fitScore10 >= 6.0 ? 'rgba(245, 158, 11, 0.18)' : 'rgba(244, 63, 94, 0.18)',
                  color: result.fitScore10 >= 7.5 ? '#34D399' : result.fitScore10 >= 6.0 ? '#FBBF24' : '#FB7185',
                  fontSize: '0.82rem',
                  padding: '0.35rem 0.85rem'
                }}
              >
                Fit Rating: {result.fitScore10}/10 ({result.shortlistStatus})
              </span>
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
              className={`tab-btn ${activeTab === 'shortlist' ? 'active' : ''}`}
              onClick={() => setActiveTab('shortlist')}
            >
              <Users size={16} /> Shortlisted Candidates
            </button>

            <button
              className={`tab-btn ${activeTab === 'structured' ? 'active' : ''}`}
              onClick={() => setActiveTab('structured')}
            >
              <FileCode2 size={16} /> Structured Entities
            </button>

            <button
              className={`tab-btn ${activeTab === 'highlighter' ? 'active' : ''}`}
              onClick={() => setActiveTab('highlighter')}
            >
              <Eye size={16} /> ATS Simulation
              <span className="tab-count-badge">{result.skills.matched.length} matched</span>
            </button>

            <button
              className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveTab('projects')}
            >
              <FolderGit2 size={16} /> Project Depth
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
              <Layers size={16} /> Bullet Optimizer
              <span className="tab-count-badge">{result.bulletAnalysis.length}</span>
            </button>

            <button
              className={`tab-btn ${activeTab === 'format' ? 'active' : ''}`}
              onClick={() => setActiveTab('format')}
            >
              <ShieldCheck size={16} /> Parseability
              <span className="tab-count-badge">{result.atsHealth.score}%</span>
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'shortlist' && (
            <CandidateShortlistDashboard
              currentResult={result}
              jdText={jdText}
            />
          )}

          {activeTab === 'structured' && (
            <StructuredDataViewer
              structuredData={result.structuredData}
              fitScore10={result.fitScore10}
              shortlistStatus={result.shortlistStatus}
            />
          )}

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
