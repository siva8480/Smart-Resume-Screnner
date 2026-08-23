import React from 'react';
import { Award, Zap, CheckCircle2, AlertTriangle, ShieldCheck, Target, Layers, TrendingUp, FolderGit2, Sparkles } from 'lucide-react';

export const ScoreOverview = ({ result }) => {
  const { isFresher, overallScore, scoreGrade, scoreColor, breakdown, summaryRecommendations, skills } = result;

  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  // Calculate potential score if recommended fixes are applied
  const projectedBoost = Math.min(100, Math.max(overallScore + 10, Math.round(overallScore + (100 - overallScore) * 0.65)));

  return (
    <div className="glass-card score-hero-card">
      {/* Left: Circular Animated Score Meter */}
      <div className="score-circle-wrapper">
        <svg className="circular-chart" viewBox="0 0 210 210">
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="50%" stopColor={scoreColor} />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
          </defs>
          <circle
            className="circle-bg"
            cx="105"
            cy="105"
            r={radius}
          />
          <circle
            className="circle-bar"
            cx="105"
            cy="105"
            r={radius}
            stroke="url(#scoreGradient)"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              filter: `drop-shadow(0px 0px 12px ${scoreColor}99)`
            }}
          />
        </svg>

        <div className="score-inner-text">
          <span className="score-value" style={{ color: scoreColor }}>
            {overallScore}
            <span style={{ fontSize: '1.8rem', fontWeight: 700 }}>%</span>
          </span>
          <span className="score-label">ATS Score</span>
        </div>
      </div>

      {/* Right: Grade, Insights & Breakdown */}
      <div className="score-details-wrapper">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
            <span
              className="badge"
              style={{
                background: `${scoreColor}22`,
                color: scoreColor,
                border: `1px solid ${scoreColor}60`,
                fontSize: '0.88rem',
                padding: '0.4rem 0.95rem'
              }}
            >
              <Award size={16} />
              {scoreGrade}
            </span>

            {isFresher ? (
              <span className="badge badge-bonus" style={{ fontSize: '0.8rem' }}>
                <Sparkles size={13} /> Project-Centric Fresher Evaluation
              </span>
            ) : (
              <span className="badge badge-bonus" style={{ fontSize: '0.8rem' }}>
                <Award size={13} /> Professional Industry Evaluation
              </span>
            )}

            {skills.criticalMissingCount > 0 ? (
              <span className="badge badge-critical">
                <AlertTriangle size={14} />
                {skills.criticalMissingCount} Critical Skills Missing
              </span>
            ) : (
              <span className="badge badge-matched">
                <CheckCircle2 size={14} />
                All Critical Keywords Aligned
              </span>
            )}

            {overallScore < 95 && (
              <span className="badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.35)' }}>
                <TrendingUp size={14} /> Potential: {projectedBoost}% after quick fixes
              </span>
            )}
          </div>

          <h2 className="grade-badge-title">
            {overallScore >= 85 ? 'Exceptional Candidate Alignment!' : overallScore >= 70 ? 'Strong Fit with Key Growth Opportunities' : 'Targeted Project & Keyword Optimization Needed'}
          </h2>
        </div>

        {/* Actionable Recommendations Summary */}
        {summaryRecommendations.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', background: 'var(--bg-tertiary)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Zap size={15} /> Top Strategic Recommendations:
            </span>
            {summaryRecommendations.map((rec, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                <span style={{ color: 'var(--accent-primary)', fontWeight: 800 }}>•</span>
                <span>{rec}</span>
              </div>
            ))}
          </div>
        )}

        {/* 5 Dimensional Breakdown Bars */}
        <div className="breakdown-grid">
          <div className="breakdown-card">
            <div className="breakdown-header">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Target size={14} color="var(--accent-primary)" /> Hard Skills (35%)
              </span>
              <span className="breakdown-score">{breakdown.hardSkillsScore}%</span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${breakdown.hardSkillsScore}%`,
                  background: 'var(--accent-primary)'
                }}
              />
            </div>
          </div>

          {/* If fresher, show Project Depth; else show Experience Alignment */}
          {isFresher ? (
            <div className="breakdown-card">
              <div className="breakdown-header">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <FolderGit2 size={14} color="var(--accent-cyan)" /> Project Depth (25%)
                </span>
                <span className="breakdown-score">{breakdown.projectDepthScore}%</span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${breakdown.projectDepthScore}%`,
                    background: 'var(--accent-cyan)'
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="breakdown-card">
              <div className="breakdown-header">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Award size={14} color="var(--accent-cyan)" /> Experience Fit (20%)
                </span>
                <span className="breakdown-score">{breakdown.experienceScore}%</span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${breakdown.experienceScore}%`,
                    background: 'var(--accent-cyan)'
                  }}
                />
              </div>
            </div>
          )}

          <div className="breakdown-card">
            <div className="breakdown-header">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Layers size={14} color="var(--accent-secondary)" /> Soft & CS Skills (15%)
              </span>
              <span className="breakdown-score">{breakdown.softSkillsScore}%</span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${breakdown.softSkillsScore}%`,
                  background: 'var(--accent-secondary)'
                }}
              />
            </div>
          </div>

          <div className="breakdown-card">
            <div className="breakdown-header">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldCheck size={14} color="var(--accent-emerald)" /> ATS Formatting (15%)
              </span>
              <span className="breakdown-score">{breakdown.atsFormatScore}%</span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${breakdown.atsFormatScore}%`,
                  background: 'var(--accent-emerald)'
                }}
              />
            </div>
          </div>

          <div className="breakdown-card">
            <div className="breakdown-header">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Zap size={14} color="var(--accent-amber)" /> Relevancy (10%)
              </span>
              <span className="breakdown-score">{breakdown.relevanceScore}%</span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${breakdown.relevanceScore}%`,
                  background: 'var(--accent-amber)'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
