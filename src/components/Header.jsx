import { Sparkles, Sun, Moon, FileText, RefreshCw } from 'lucide-react';

export const Header = ({
  theme,
  onToggleTheme,
  onOpenTailorModal,
  onReset,
  hasScanResult
}) => {
  return (
    <header className="app-header no-print">
      <div className="logo-group">
        <div className="logo-icon">
          <FileText size={24} />
        </div>
        <div>
          <h1 className="logo-title">
            Smart<span className="gradient-text">Resume</span> Screener
          </h1>
          <p className="logo-subtitle">AI-Powered ATS Screener & Candidate Intelligence</p>
        </div>
      </div>

      <div className="header-actions">
        {hasScanResult && (
          <>
            <button
              onClick={onOpenTailorModal}
              className="btn btn-primary"
              title="Generate tailored summary and cover letter"
            >
              <Sparkles size={16} />
              AI Tailor & Summary
            </button>

            <button
              onClick={onReset}
              className="btn btn-secondary"
              title="Reset inputs and screen another candidate"
            >
              <RefreshCw size={16} />
              New Screen
            </button>
          </>
        )}

        <button
          onClick={onToggleTheme}
          className="btn btn-secondary"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
};
