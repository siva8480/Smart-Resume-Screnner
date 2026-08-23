import { useRef, useState } from 'react';
import { UploadCloud, FileCheck, AlertCircle, Edit3, Trash2, Loader2 } from 'lucide-react';
import { parseResumeFile } from '../services/parser';

export const ResumeUploader = ({
  resumeText,
  onChangeText,
  parsedMeta,
  setParsedMeta
}) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditingManually, setIsEditingManually] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleFileProcess = async (file) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const parsed = await parseResumeFile(file);
      if (parsed.error) {
        setErrorMessage(parsed.error);
      } else {
        setParsedMeta(parsed);
        onChangeText(parsed.text);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Error parsing file.');
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

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClear = () => {
    onChangeText('');
    setParsedMeta(null);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const wordCount = resumeText ? (resumeText.match(/\b[\w'-]+\b/g) || []).length : 0;

  return (
    <div className="glass-card input-panel">
      <div className="panel-header">
        <div className="panel-title">
          <FileCheck size={20} className="text-primary" />
          <span>1. Resume / CV</span>
        </div>
        <div className="panel-badge">
          {wordCount > 0 && <span>{wordCount} words • ~{Math.max(1, Math.ceil(wordCount / 450))} page(s)</span>}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.txt"
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFileProcess(e.target.files[0]);
          }
        }}
      />

      {!resumeText && !isLoading && (
        <div
          className={`dropzone ${isDragging ? 'active' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="dropzone-icon">
            <UploadCloud size={30} />
          </div>
          <div>
            <p className="dropzone-text">Click to upload or drag & drop</p>
            <p className="dropzone-hint">Supports PDF, DOCX, TXT (Up to 10MB)</p>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="dropzone" style={{ minHeight: '220px' }}>
          <Loader2 size={36} className="animate-spin" style={{ color: 'var(--accent-primary)' }} />
          <p className="dropzone-text">Extracting & Parsing Document Text...</p>
        </div>
      )}

      {errorMessage && (
        <div style={{ padding: '0.75rem 1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-md)', color: '#F87171', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          <AlertCircle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      {resumeText && !isLoading && (
        <>
          {parsedMeta?.filename && (
            <div className="file-card">
              <div className="file-info">
                <FileCheck size={20} color="var(--accent-emerald)" />
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{parsedMeta.filename}</p>
                  <p className="file-meta">
                    {parsedMeta.fileType.toUpperCase()} • {parsedMeta.pageCount} page(s) • {parsedMeta.wordCount} words
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                  onClick={() => setIsEditingManually(!isEditingManually)}
                >
                  <Edit3 size={14} />
                  {isEditingManually ? 'Lock' : 'Edit Text'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', color: '#F87171' }}
                  onClick={handleClear}
                  title="Clear Resume"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          )}

          <textarea
            className="custom-textarea"
            placeholder="Or paste your plain resume text directly here..."
            value={resumeText}
            onChange={(e) => onChangeText(e.target.value)}
            disabled={!isEditingManually && !!parsedMeta?.filename}
          />
        </>
      )}

      {!resumeText && !isLoading && (
        <textarea
          className="custom-textarea"
          placeholder="Or paste your plain resume text directly here..."
          value={resumeText}
          onChange={(e) => onChangeText(e.target.value)}
          style={{ minHeight: '120px' }}
        />
      )}
    </div>
  );
};
