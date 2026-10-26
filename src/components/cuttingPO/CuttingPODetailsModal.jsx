import { useEffect } from 'react';
import {
  ClipboardList,
  X,
  Building2,
  Handshake,
  Link2,
  Calendar,
  Layers,
  Check,
} from 'lucide-react';

export default function CuttingPODetailsModal({ item, onClose }) {
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

  if (!item) return null;

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
              <ClipboardList size={18} />
            </div>
            <h2 className="cpo-modal-title">
              Cutting PO Details: <span style={{ color: 'var(--color-primary)' }}>{item.poNo}</span>
            </h2>
          </div>
          <button type="button" className="cpo-modal-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="cpo-modal-body">
          <div className="cpo-details-list">
            <div className="cpo-detail-row">
              <span className="cpo-detail-key">PO Number:</span>
              <span className="cpo-detail-val" style={{ fontFamily: 'monospace', fontSize: '15px' }}>
                {item.poNo}
              </span>
            </div>

            <div className="cpo-detail-row">
              <span className="cpo-detail-key">Buyer:</span>
              <span className="cpo-detail-val">{item.buyer}</span>
            </div>

            <div className="cpo-detail-row">
              <span className="cpo-detail-key">Our Reference:</span>
              <span className="cpo-detail-val">{item.reference}</span>
            </div>

            <div className="cpo-detail-row">
              <span className="cpo-detail-key">Company:</span>
              <span className="cpo-detail-val">{item.company}</span>
            </div>

            <div className="cpo-detail-row">
              <span className="cpo-detail-key">Garment Type:</span>
              <span className="cpo-detail-val">
                <span className={`cpo-type-badge cpo-type-${item.type?.toLowerCase() === 'bottom' ? 'bottom' : 'top'}`}>
                  {item.type || 'Top'}
                </span>
              </span>
            </div>

            <div className="cpo-detail-row">
              <span className="cpo-detail-key">Quantity:</span>
              <span className="cpo-detail-val">
                {item.quantity?.toLocaleString()} pcs <span style={{ color: '#9ca3af', fontSize: '12px' }}>({item.rows} rows)</span>
              </span>
            </div>

            <div className="cpo-detail-row">
              <span className="cpo-detail-key">Confirmation Date:</span>
              <span className="cpo-detail-val">
                {item.confirmationDate ? item.confirmationDate.split('-').reverse().join('/') : '—'}
              </span>
            </div>

            <div className="cpo-detail-row">
              <span className="cpo-detail-key">Shipment Date:</span>
              <span className="cpo-detail-val">
                {item.shipmentDate ? item.shipmentDate.split('-').reverse().join('/') : '—'}
              </span>
            </div>

            <div className="cpo-detail-row">
              <span className="cpo-detail-key">Status:</span>
              <span className="cpo-detail-val">
                <span className={`cpo-badge cpo-badge-${item.status === 'active' ? 'active' : 'inactive'}`}>
                  {item.status === 'active' && <Check size={12} />}
                  <span>{item.status === 'active' ? 'Active' : 'Inactive'}</span>
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="cpo-modal-foot">
          <button type="button" className="cpo-btn cpo-btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
