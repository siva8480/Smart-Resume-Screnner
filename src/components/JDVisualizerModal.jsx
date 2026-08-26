import React, { useState } from 'react';
import { Eye, X, ZoomIn, ZoomOut, RotateCw, ChevronLeft, ChevronRight, Image as ImageIcon, FileText, CheckCircle2, SplitSquareVertical, Sparkles, Layers } from 'lucide-react';

export const JDVisualizerModal = ({
  isOpen,
  onClose,
  parsedJdMeta,
  resumeText
}) => {
  if (!isOpen || !parsedJdMeta) return null;

  const { visualPreviews = [], embeddedImages = [], filename, fileType, pageCount, wordCount } = parsedJdMeta;
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [activeViewMode, setActiveViewMode] = useState('document'); // 'document' | 'split_match' | 'images'

  const currentPreview = visualPreviews.find(p => p.pageNum === currentPage) || visualPreviews[0];

  const handleZoomIn = () => setZoomLevel(prev => Math.min(250, prev + 25));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(50, prev - 25));
  const handleResetZoom = () => setZoomLevel(100);

  const handleNextPage = () => {
    if (currentPage < visualPreviews.length) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 99999 }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: activeViewMode === 'split_match' ? '1280px' : '980px',
          width: '95vw',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '1.5rem',
          gap: '1rem'
        }}
      >
        {/* Modal Top Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div className="logo-icon" style={{ width: '36px', height: '36px' }}>
              <Eye size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Job Description PDF & Visuals Inspector
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                {filename} • {pageCount} Page(s) • {embeddedImages.length} Visual Asset(s) / Diagram(s) detected
              </p>
            </div>
          </div>

          {/* View Mode Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="mode-selector" style={{ padding: '0.2rem' }}>
              <button
                type="button"
                className={`mode-btn ${activeViewMode === 'document' ? 'active' : ''}`}
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                onClick={() => setActiveViewMode('document')}
              >
                <FileText size={12} /> PDF Document
              </button>

              {embeddedImages.length > 0 && (
                <button
                  type="button"
                  className={`mode-btn ${activeViewMode === 'images' ? 'active' : ''}`}
                  style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                  onClick={() => setActiveViewMode('images')}
                >
                  <ImageIcon size={12} /> Images ({embeddedImages.length})
                </button>
              )}

              {resumeText && (
                <button
                  type="button"
                  className={`mode-btn ${activeViewMode === 'split_match' ? 'active' : ''}`}
                  style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                  onClick={() => setActiveViewMode('split_match')}
                >
                  <SplitSquareVertical size={12} /> Side-by-Side Match
                </button>
              )}
            </div>

            <button
              onClick={onClose}
              className="btn btn-secondary"
              style={{ padding: '0.4rem 0.65rem' }}
              title="Close Visualizer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* View Mode 1: Interactive PDF Page Viewer */}
        {activeViewMode === 'document' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, minHeight: '480px' }}>
            {/* Toolbar: Navigation & Zoom Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', background: 'var(--bg-tertiary)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              {/* Pagination */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage <= 1}
                  className="btn btn-secondary"
                  style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem' }}
                >
                  <ChevronLeft size={14} /> Prev
                </button>
                <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                  Page {currentPage} of {visualPreviews.length || 1}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage >= visualPreviews.length}
                  className="btn btn-secondary"
                  style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem' }}
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>

              {/* Zoom Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <button
                  onClick={handleZoomOut}
                  className="btn btn-secondary"
                  style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem' }}
                  title="Zoom Out"
                >
                  <ZoomOut size={13} />
                </button>
                <span style={{ fontSize: '0.8rem', minWidth: '48px', textAlign: 'center', fontWeight: 700 }}>
                  {zoomLevel}%
                </span>
                <button
                  onClick={handleZoomIn}
                  className="btn btn-secondary"
                  style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem' }}
                  title="Zoom In"
                >
                  <ZoomIn size={13} />
                </button>
                <button
                  onClick={handleResetZoom}
                  className="btn btn-secondary"
                  style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem' }}
                  title="Reset Zoom"
                >
                  Fit
                </button>
              </div>
            </div>

            {/* Rendered PDF Page Container */}
            <div style={{
              flex: 1,
              maxHeight: '62vh',
              overflow: 'auto',
              background: '#090D1A',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              padding: '1.5rem'
            }}>
              {currentPreview ? (
                <div style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center', transition: 'transform 0.15s ease' }}>
                  <img
                    src={currentPreview.dataUrl}
                    alt={`Page ${currentPage}`}
                    style={{
                      maxWidth: '100%',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                      borderRadius: '4px',
                      display: 'block'
                    }}
                  />
                </div>
              ) : (
                <div style={{ padding: '3rem', color: 'var(--text-muted)' }}>
                  No page preview available.
                </div>
              )}
            </div>
          </div>
        )}

        {/* View Mode 2: Isolated Embedded Images & Diagrams Gallery */}
        {activeViewMode === 'images' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, maxHeight: '65vh', overflowY: 'auto' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              These visual diagrams, infographics, or flyer sections were detected and extracted from inside the Job Description PDF:
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {embeddedImages.map((img, idx) => (
                <div
                  key={img.id || idx}
                  style={{
                    background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                      {img.title}
                    </span>
                    <span className="badge badge-bonus" style={{ fontSize: '0.7rem' }}>
                      Page {img.pageNum}
                    </span>
                  </div>

                  <div style={{ padding: '1rem', background: '#000', display: 'flex', justifyContent: 'center' }}>
                    <img
                      src={img.dataUrl}
                      alt={img.title}
                      style={{ maxHeight: '240px', maxWidth: '100%', objectFit: 'contain', borderRadius: '4px' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* View Mode 3: Side-by-Side Visual Match Mode */}
        {activeViewMode === 'split_match' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', flex: 1, maxHeight: '65vh', overflow: 'hidden' }}>
            {/* Left: Job Description Visual PDF View */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                  Visual Job Description PDF (Page {currentPage})
                </span>
                <div style={{ display: 'flex', gap: '0.3rem' }}>
                  <button onClick={handlePrevPage} disabled={currentPage <= 1} className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}>Prev</button>
                  <button onClick={handleNextPage} disabled={currentPage >= visualPreviews.length} className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}>Next</button>
                </div>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', background: '#090D1A', borderRadius: 'var(--radius-sm)', padding: '0.5rem', display: 'flex', justifyContent: 'center' }}>
                {currentPreview && (
                  <img
                    src={currentPreview.dataUrl}
                    alt="JD Visual"
                    style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px' }}
                  />
                )}
              </div>
            </div>

            {/* Right: Candidate Resume Document View */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                  Candidate Resume Text (Matching)
                </span>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-paper)', borderRadius: 'var(--radius-sm)', padding: '1rem', fontSize: '0.84rem', lineHeight: 1.6, color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
                {resumeText}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
