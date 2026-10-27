import { useEffect } from 'react';
import { X, Layers, Calendar, Hash, FileText } from 'lucide-react';

export default function BundleCardDetailsModal({ item, onClose }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  if (!item) return null;

  const posList = Array.isArray(item.pos)
    ? item.pos
    : item.poNo
    ? [item.poNo]
    : item.rows
    ? [...new Set(item.rows.map((r) => r.po).filter(Boolean))]
    : [];

  return (
    <div className="bcl-overlay" onMouseDown={onClose}>
      <div
        className="bcl-modal"
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="bcl-modal-header">
          <div className="bcl-modal-title-wrap">
            <div className="bcl-banner-icon" style={{ width: 30, height: 30, borderRadius: 8 }}>
              <FileText size={16} />
            </div>
            <div>
              <h3 className="bcl-modal-title">
                Bundle Card: <span style={{ color: 'var(--color-primary)' }}>{item.ourReference}</span>
              </h3>
              <p style={{ fontSize: '12px', color: '#6b7280' }}>
                {item.buyer} · {item.companyCode || item.company || 'DFL'}
              </p>
            </div>
          </div>
          <button type="button" className="bcl-modal-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="bcl-modal-body">
          {/* Detail Grid */}
          <div className="bcl-detail-grid">
            <div className="bcl-detail-item">
              <span className="bcl-detail-label">Type</span>
              <span className="bcl-detail-value">{item.bundleType || 'Single PO'}</span>
            </div>
            <div className="bcl-detail-item">
              <span className="bcl-detail-label">Date</span>
              <span className="bcl-detail-value">{item.date || '—'}</span>
            </div>
            <div className="bcl-detail-item">
              <span className="bcl-detail-label">Cut #</span>
              <span className="bcl-detail-value">{item.cutNo ?? item.nextCutNumber ?? '—'}</span>
            </div>
            <div className="bcl-detail-item">
              <span className="bcl-detail-label">Shrinkage</span>
              <span className="bcl-detail-value">{item.shrinkage || '—'}</span>
            </div>
            <div className="bcl-detail-item">
              <span className="bcl-detail-label">Table / Line</span>
              <span className="bcl-detail-value">
                {item.table || item.cuttingTable || '—'} / {item.line || item.sewingLine || '—'}
              </span>
            </div>
            <div className="bcl-detail-item">
              <span className="bcl-detail-label">Color</span>
              <span className="bcl-detail-value">{item.color || '—'}</span>
            </div>
            <div className="bcl-detail-item">
              <span className="bcl-detail-label">Rows / Bundles</span>
              <span className="bcl-detail-value">
                {item.rowsCount || item.details?.length || item.rows?.length || 0} rows · {item.bundlesCount || item.totalBundles || 0} bundles
              </span>
            </div>
            <div className="bcl-detail-item">
              <span className="bcl-detail-label">Total Qty</span>
              <span className="bcl-detail-value" style={{ color: 'var(--color-primary)' }}>
                {(item.qtyPerRatio || item.totalQuantity || 0).toLocaleString()} pcs
              </span>
            </div>
          </div>

          {/* PO Numbers */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#4b5563' }}>
              Purchase Orders ({posList.length})
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {posList.length > 0 ? (
                posList.map((po) => (
                  <span key={po} className="bcl-po-badge">
                    {po}
                  </span>
                ))
              ) : (
                <span style={{ fontSize: '13px', color: '#9ca3af' }}>No POs assigned</span>
              )}
            </div>
          </div>

          {/* Parts */}
          {item.parts && item.parts.length > 0 && (
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#4b5563' }}>
                Selected Parts ({item.parts.length})
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {item.parts.map((part) => (
                  <span
                    key={part}
                    style={{
                      fontSize: '12px',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: '#f3f4f6',
                      border: '1px solid #e5e7eb',
                      color: '#374151',
                    }}
                  >
                    {part}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Details / Quantities breakdown if available */}
          {item.details && item.details.length > 0 && (
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#4b5563' }}>
                Ratio Breakdown ({item.details.length} rows)
              </h4>
              <div style={{ maxHeight: 180, overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: 6 }}>
                <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
                  <thead style={{ background: '#f9fafb' }}>
                    <tr>
                      <th style={{ padding: '6px 10px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Color</th>
                      <th style={{ padding: '6px 10px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Size</th>
                      <th style={{ padding: '6px 10px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Group</th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.details.map((d, i) => (
                      <tr key={d.id || i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '6px 10px' }}>{d.color || '—'}</td>
                        <td style={{ padding: '6px 10px' }}>{d.size || '—'}</td>
                        <td style={{ padding: '6px 10px' }}>{d.group || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="bcl-modal-footer">
          <button type="button" className="bcl-btn-outline" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
