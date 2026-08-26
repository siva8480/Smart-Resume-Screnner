import React, { useState, useRef } from 'react';
import { Briefcase, UploadCloud, FileText, Image as ImageIcon, Eye, Trash2, Edit3, Loader2, AlertCircle, Sparkles, CheckCircle2, ZoomIn, X } from 'lucide-react';
import { parseJobDescriptionFile } from '../services/parser';
import { useToast } from './Toast';

export const JobDescriptionInput = ({
  jdText,
  onChangeText,
  onClear,
  parsedJdMeta,
  setParsedJdMeta
}) => {
  const { addToast } = useToast();
  const fileInputRef = useRef(null);

  // Input choice: 'text' | 'upload'
  const [inputMode, setInputMode] = useState(parsedJdMeta?.filename ? 'upload' : 'text');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditingManually, setIsEditingManually] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  
  // Modal for full-screen visual inspection of PDF/Image pages
  const [selectedPreviewImg, setSelectedPreviewImg] = useState(null);

  const wordCount = jdText ? (jdText.match(/\b[\w'-]+\b/g) || []).length : 0;

  const handleFileProcess = async (file) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const parsed = await parseJobDescriptionFile(file);
      if (parsed.error) {
        setErrorMessage(parsed.error);
        addToast(parsed.error, 'error');
      } else {
        if (setParsedJdMeta) {
          setParsedJdMeta(parsed);
        }
        onChangeText(parsed.text);
        setInputMode('upload');
        addToast(`Extracted ${parsed.wordCount} words from ${parsed.filename}!`, 'success');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Error processing document/image.');
      addToast('Failed to process file.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleClearFile = () => {
    if (setParsedJdMeta) setParsedJdMeta(null);
    onChangeText('');
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    addToast('Cleared Job Description', 'info');
  };

  return (
    <div className="glass-card input-panel">
      {/* Header with Dual Choice Selector */}
      <div className="panel-header" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
        <div className="panel-title">
          <Briefcase size={20} style={{ color: 'var(--accent-cyan)' }} />
          <span>2. Job Description (JD)</span>
        </div>

        {/* 2 Choices Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div className="mode-selector" style={{ padding: '0.18rem' }}>
            <button
              type="button"
              className={`mode-btn ${inputMode === 'text' ? 'active' : ''}`}
              style={{ fontSize: '0.76rem', padding: '0.35rem 0.75rem' }}
              onClick={() => setInputMode('text')}
            >
              <FileText size={12} /> Paste Text
            </button>
            <button
              type="button"
              className={`mode-btn ${inputMode === 'upload' ? 'active' : ''}`}
              style={{ fontSize: '0.76rem', padding: '0.35rem 0.75rem' }}
              onClick={() => setInputMode('upload')}
            >
              <UploadCloud size={12} /> Upload PDF / Images
            </button>
          </div>

          {jdText && (
            <button
              type="button"
              onClick={onClear || handleClearFile}
              className="btn btn-secondary"
              style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', color: '#F87171' }}
              title="Clear Job Description"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Hidden File Input for PDF & Images */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg,.webp,.docx,.txt"
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFileProcess(e.target.files[0]);
          }
        }}
      />

      {/* Choice 1: Text Paste Mode */}
      {inputMode === 'text' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', flex: 1 }}>
          <textarea
            className="custom-textarea"
            placeholder="Paste target job description text here (responsibilities, required skills, qualifications, technologies)..."
            value={jdText}
            onChange={(e) => onChangeText(e.target.value)}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            <span>Tip: You can also switch to 'Upload PDF / Images' to visualize flyers or PDF postings.</span>
            {wordCount > 0 && <span>{wordCount} words</span>}
          </div>
        </div>
      )}

      {/* Choice 2: Upload PDF / Image Mode */}
      {inputMode === 'upload' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
          {/* Dropzone if no file uploaded or currently loading */}
          {!parsedJdMeta?.filename && !isLoading && (
            <div
              className={`dropzone ${isDragging ? 'active' : ''}`}
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onClick={() => fileInputRef.current?.click()}
              style={{ padding: '2.25rem 1.25rem' }}
            >
              <div className="dropzone-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)' }}>
                <UploadCloud size={28} />
              </div>
              <div>
                <p className="dropzone-text" style={{ fontSize: '0.98rem' }}>Upload Job Description PDF or Image</p>
                <p className="dropzone-hint" style={{ fontSize: '0.78rem' }}>
                  Supports PDF (with visual page rendering), PNG, JPG flyers, DOCX, TXT
                </p>
              </div>
            </div>
          )}

          {/* Loading Indicator with OCR notification */}
          {isLoading && (
            <div className="dropzone" style={{ minHeight: '190px' }}>
              <Loader2 size={32} className="animate-spin" style={{ color: 'var(--accent-cyan)' }} />
              <p className="dropzone-text" style={{ fontSize: '0.92rem' }}>
                Rendering PDF Pages & Extracting Text / OCR...
              </p>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div style={{ padding: '0.65rem 0.9rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-md)', color: '#F87171', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem' }}>
              <AlertCircle size={15} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Uploaded File Details & Visual Preview Gallery */}
          {parsedJdMeta?.filename && !isLoading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {/* File Info Bar */}
              <div className="file-card" style={{ padding: '0.8rem 1.1rem' }}>
                <div className="file-info">
                  {parsedJdMeta.visualPreviews?.length > 0 ? (
                    <ImageIcon size={20} color="var(--accent-cyan)" />
                  ) : (
                    <FileText size={20} color="var(--accent-cyan)" />
                  )}
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.88rem' }}>{parsedJdMeta.filename}</p>
                    <p className="file-meta">
                      {parsedJdMeta.fileType.toUpperCase()} • {parsedJdMeta.pageCount} page(s) • {parsedJdMeta.wordCount} words
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.76rem' }}
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload Another File"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.76rem' }}
                    onClick={() => setIsEditingManually(!isEditingManually)}
                  >
                    <Edit3 size={13} />
                    {isEditingManually ? 'Lock' : 'Edit Text'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.76rem', color: '#F87171' }}
                    onClick={handleClearFile}
                    title="Remove File"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Visualized PDF Pages / Image Previews Gallery */}
              {parsedJdMeta.visualPreviews && parsedJdMeta.visualPreviews.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', background: 'var(--bg-tertiary)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Eye size={13} /> Visualized Job Description Pages ({parsedJdMeta.visualPreviews.length}):
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Click image to zoom</span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.4rem' }}>
                    {parsedJdMeta.visualPreviews.map((preview, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedPreviewImg(preview.dataUrl)}
                        style={{
                          position: 'relative',
                          flexShrink: 0,
                          width: '120px',
                          height: '150px',
                          borderRadius: 'var(--radius-sm)',
                          overflow: 'hidden',
                          border: '1px solid var(--border-subtle)',
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                          transition: 'transform 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        title={`Page ${preview.pageNum} - Click to view full image`}
                      >
                        <img
                          src={preview.dataUrl}
                          alt={`JD Page ${preview.pageNum}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{ position: 'absolute', bottom: 0, insetInline: 0, background: 'rgba(0,0,0,0.7)', color: '#FFF', fontSize: '0.68rem', textAlign: 'center', padding: '0.15rem' }}>
                          Page {preview.pageNum} <ZoomIn size={10} style={{ display: 'inline', verticalAlign: 'middle' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Extracted Text Area */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  Extracted Text for ATS Resume Matching:
                </span>
                <textarea
                  className="custom-textarea"
                  style={{ minHeight: '120px' }}
                  placeholder="Extracted text from uploaded PDF/Image document..."
                  value={jdText}
                  onChange={(e) => onChangeText(e.target.value)}
                  disabled={!isEditingManually}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Fullscreen Visual Preview Modal */}
      {selectedPreviewImg && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedPreviewImg(null)}
          style={{ zIndex: 10000 }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '850px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800 }}>
                <Eye size={18} color="var(--accent-cyan)" />
                <span>Job Description Visual Document Preview</span>
              </div>
              <button
                className="btn btn-secondary"
                style={{ padding: '0.35rem 0.6rem' }}
                onClick={() => setSelectedPreviewImg(null)}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ maxHeight: '75vh', overflow: 'auto', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: '#000', display: 'flex', justifyContent: 'center' }}>
              <img
                src={selectedPreviewImg}
                alt="Full preview"
                style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
