// PurchaseOrderFormModal.jsx – Form modal for adding/editing purchase orders
import { useEffect, useRef, useState } from 'react';
import { Hash, Maximize2, Minimize2, Save, X } from 'lucide-react';

export default function PurchaseOrderFormModal({ purchaseOrder, existingPurchaseOrders = [], onSave, onClose }) {
  const isEdit = Boolean(purchaseOrder);
  const poInput = useRef(null);

  const [name, setName] = useState(purchaseOrder?.name || '');
  const [ourReference, setOurReference] = useState(purchaseOrder?.ourReference || '');
  const [ebsId, setEbsId] = useState(purchaseOrder?.ebsId || '');
  const [status, setStatus] = useState(purchaseOrder?.status || 'active');
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    poInput.current?.focus();
  }, []);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) {
      setError('Purchase order name is required.');
      poInput.current?.focus();
      return;
    }
    const duplicate = existingPurchaseOrders.some(
      (item) => item.id !== purchaseOrder?.id && item.name.trim().toLowerCase() === cleanName.toLowerCase()
    );
    if (duplicate) {
      setError('A purchase order with this name already exists.');
      poInput.current?.focus();
      return;
    }
    onSave({ name: cleanName, ourReference: ourReference.trim(), ebsId: ebsId.trim(), status });
  };

  return (
    <div className="po-overlay" onMouseDown={onClose}>
      <div
        className={`po-dialog${isExpanded ? ' is-expanded' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="po-modal-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="po-dialog-head">
          <div className="po-dialog-title-wrap">
            <div className="po-form-dialog-icon"><Hash size={18} /></div>
            <h2 id="po-modal-title" className="po-dialog-title">{isEdit ? 'Edit Purchase Order' : 'Add Purchase Order'}</h2>
          </div>
          <div className="po-dialog-head-actions">
            <button type="button" className="po-close" onClick={() => setIsExpanded((e) => !e)}
              aria-label={isExpanded ? 'Restore dialog size' : 'Expand dialog'}>
              {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <button type="button" className="po-close" onClick={onClose} aria-label="Close">
              <X size={18} />
            </button>
          </div>
        </div>
        <form id="poForm" onSubmit={handleSubmit} noValidate>
          <div className="po-dialog-body">
            <div className="po-field">
              <label htmlFor="po-name" className="po-label">Purchase Order<span className="po-required">*</span></label>
              <div className={`po-input-wrap${error ? ' has-error' : ''}`}>
                <Hash size={16} aria-hidden="true" />
                <input
                  id="po-name"
                  ref={poInput}
                  type="text"
                  maxLength={100}
                  className="po-input"
                  placeholder="Enter PO"
                  value={name}
                  onChange={(e) => { setName(e.target.value); if (error) setError(''); }}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? 'po-name-error' : undefined}
                />
              </div>
              {error && (
                <p id="po-name-error" className="po-error" role="alert">{error}</p>
              )}
            </div>
            <div className="po-field">
              <label htmlFor="po-ref" className="po-label">Our Reference</label>
              <div className="po-input-wrap">
                <Hash size={16} aria-hidden="true" />
                <input
                  id="po-ref"
                  type="text"
                  maxLength={100}
                  className="po-input"
                  placeholder="Enter reference"
                  value={ourReference}
                  onChange={(e) => setOurReference(e.target.value)}
                />
              </div>
            </div>
            <div className="po-field">
              <label htmlFor="po-ebs" className="po-label">EBS ID</label>
              <div className="po-input-wrap">
                <Hash size={16} aria-hidden="true" />
                <input
                  id="po-ebs"
                  type="text"
                  maxLength={50}
                  className="po-input"
                  placeholder="Enter EBS ID"
                  value={ebsId}
                  onChange={(e) => setEbsId(e.target.value)}
                />
              </div>
            </div>
            <div className="po-field">
              <span className="po-label">Active</span>
              <label className="po-active-checkbox">
                <input type="checkbox" checked={status === 'active'}
                  onChange={(e) => setStatus(e.target.checked ? 'active' : 'inactive')} />
                <span>Is active ?</span>
              </label>
            </div>
          </div>
          <div className="po-dialog-foot">
            <button type="button" className="po-btn po-btn-ghost" onClick={onClose}>
              <X size={15} /> Cancel
            </button>
            <button type="submit" form="poForm" className="po-btn po-btn-primary">
              <Save size={16} /> <span>{isEdit ? 'Save Changes' : 'Save'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
