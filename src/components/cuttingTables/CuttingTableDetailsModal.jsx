import { useEffect } from 'react';
import { Table2, X, Building2, Check, Edit2, Calendar } from 'lucide-react';
import { AVAILABLE_COMPANIES } from '../../data/cuttingTablesData';

function formatDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { day: '—', time: '' };
  const pad = (n) => String(n).padStart(2, '0');
  const hours = date.getHours();
  return {
    day: `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`,
    time: `${pad(hours % 12 || 12)}:${pad(date.getMinutes())} ${hours >= 12 ? 'PM' : 'AM'}`,
  };
}

export default function CuttingTableDetailsModal({ table, onClose, onEdit }) {
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  if (!table) return null;

  const created = formatDateTime(table.createdAt);

  // Match company codes to full company details
  const companyDetails = (table.companies || []).map((codeOrName) => {
    const match = AVAILABLE_COMPANIES.find(
      (c) => c.code === codeOrName || c.name === codeOrName || c.label === codeOrName
    );
    return match ? match.label : codeOrName;
  });

  return (
    <div className="ct-modal-overlay" onMouseDown={onClose}>
      <div
        className="ct-modal"
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="ct-modal-head">
          <div className="ct-modal-title-box">
            <div className="ct-modal-icon">
              <Table2 size={18} />
            </div>
            <h3 className="ct-modal-title">
              Table Details: <span style={{ color: 'var(--color-primary)' }}>{table.name}</span>
            </h3>
          </div>
          <button type="button" className="ct-modal-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="ct-modal-body">
          <div className="ct-modal-row">
            <span className="ct-modal-key">Table Name</span>
            <span className="ct-modal-val" style={{ fontWeight: 600 }}>{table.name}</span>
          </div>

          <div className="ct-modal-row">
            <span className="ct-modal-key">EBS ID</span>
            <span className="ct-modal-val">{table.ebsId || '—'}</span>
          </div>

          <div className="ct-modal-row">
            <span className="ct-modal-key">Status</span>
            <span className="ct-modal-val">
              {table.status === 'active' ? (
                <span className="ct-status-badge ct-status-active">
                  <Check size={12} />
                  <span>Active</span>
                </span>
              ) : (
                <span className="ct-status-badge ct-status-inactive">
                  <X size={12} />
                  <span>Inactive</span>
                </span>
              )}
            </span>
          </div>

          <div className="ct-modal-row">
            <span className="ct-modal-key">Assigned Companies</span>
            <div className="ct-modal-val">
              {companyDetails.length > 0 ? (
                <div className="ct-companies-wrap" style={{ marginTop: '4px' }}>
                  {companyDetails.map((comp) => (
                    <span key={comp} className="ct-company-badge">
                      <Building2 size={12} style={{ marginRight: '4px' }} />
                      {comp}
                    </span>
                  ))}
                </div>
              ) : (
                <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>No companies assigned</span>
              )}
            </div>
          </div>

          <div className="ct-modal-row">
            <span className="ct-modal-key">Created Time</span>
            <span className="ct-modal-val">
              <span className="ct-time-date">{created.day}</span>{' '}
              <span className="ct-time-clock">{created.time}</span>
            </span>
          </div>
        </div>

        <div className="ct-modal-footer">
          <button type="button" className="ct-btn-back" onClick={onClose}>
            Close
          </button>
          <button
            type="button"
            className="ct-btn-save"
            onClick={() => {
              onClose();
              if (onEdit) onEdit(table);
            }}
          >
            <Edit2 size={14} />
            Edit Table
          </button>
        </div>
      </div>
    </div>
  );
}
