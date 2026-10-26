import { useEffect, useState } from 'react';
import { Upload, X, FileSpreadsheet, CheckCircle2 } from 'lucide-react';

export default function CuttingPOImportModal({ onImport, onClose }) {
  const [file, setFile] = useState(null);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const handleStartImport = () => {
    setImporting(true);
    setTimeout(() => {
      setImporting(false);
      onImport(file ? file.name : 'cutting_pos_import.xlsx');
    }, 800);
  };

  return (
    <div className="cpo-overlay" onMouseDown={onClose}>
      <div
        className="cpo-modal"
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="cpo-modal-head">
          <div className="cpo-modal-title-wrap">
            <div className="cpo-modal-icon">
              <Upload size={18} />
            </div>
            <h2 className="cpo-modal-title">Import Cutting POs</h2>
          </div>
          <button type="button" className="cpo-modal-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="cpo-modal-body">
          <div
            style={{
              border: '2px dashed #d1d5db',
              borderRadius: '8px',
              padding: '32px 20px',
              textAlign: 'center',
              background: '#f9fafb',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
            }}
            onClick={() => document.getElementById('cpo-file-input')?.click()}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgb(var(--color-primary-rgb) / 0.1)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileSpreadsheet size={24} />
            </div>
            <div>
              <p style={{ fontWeight: '600', fontSize: '14px', color: '#111827', margin: 0 }}>
                {file ? file.name : 'Click to upload or drag and drop'}
              </p>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>
                Excel (.xlsx, .xls) or CSV files up to 10MB
              </p>
            </div>
            <input
              id="cpo-file-input"
              type="file"
              accept=".xlsx,.xls,.csv"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setFile(e.target.files[0]);
                }
              }}
            />
          </div>

          <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.6' }}>
            <p style={{ fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
              Import Guidelines:
            </p>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              <li>Columns: PO No, Buyer, Reference, Company, Type, Quantity, Rows, Confirmation Date</li>
              <li>Date format: YYYY-MM-DD or DD/MM/YYYY</li>
              <li>Duplicate PO numbers will be updated automatically</li>
            </ul>
          </div>
        </div>

        <div className="cpo-modal-foot">
          <button type="button" className="cpo-btn cpo-btn-ghost" onClick={onClose} disabled={importing}>
            Cancel
          </button>
          <button
            type="button"
            className="cpo-btn cpo-btn-primary"
            onClick={handleStartImport}
            disabled={importing}
          >
            {importing ? (
              <span>Importing...</span>
            ) : (
              <>
                <CheckCircle2 size={16} />
                <span>Start Import</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
