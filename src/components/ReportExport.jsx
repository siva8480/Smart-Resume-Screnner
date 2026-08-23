import { Printer, Download } from 'lucide-react';

export const ReportExport = ({ result, resumeFilename }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const filename = resumeFilename ? `${resumeFilename.replace(/\.[^/.]+$/, '')}_audit_report.json` : `ats_audit_report_${Date.now()}.json`;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }} className="no-print">
      <button
        onClick={handlePrint}
        className="btn btn-secondary"
        style={{ fontSize: '0.85rem' }}
        title="Print or Save PDF report"
      >
        <Printer size={15} /> Print / Save PDF Report
      </button>

      <button
        onClick={handleDownloadJson}
        className="btn btn-secondary"
        style={{ fontSize: '0.85rem' }}
        title="Export raw JSON analytics"
      >
        <Download size={15} /> Export JSON
      </button>
    </div>
  );
};
