import { useEffect, useRef, useState } from 'react';
import { Hash, Maximize2, Minimize2, Save, Users, X } from 'lucide-react';

export default function BuyerFormModal({ buyer, existingBuyers = [], onSave, onClose }) {
  const isEdit = Boolean(buyer);
  const nameInput = useRef(null);

  const [name, setName] = useState(buyer?.name || '');
  const [ebsId, setEbsId] = useState(buyer?.ebsId || '');
  const [status, setStatus] = useState(buyer?.status || 'active');
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    nameInput.current?.focus();
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
      setError('Buyer name is required.');
      nameInput.current?.focus();
      return;
    }

    const duplicate = existingBuyers.some(
      (item) => item.id !== buyer?.id && item.name.trim().toLowerCase() === cleanName.toLowerCase()
    );
    if (duplicate) {
      setError('A buyer with this name already exists.');
      nameInput.current?.focus();
      return;
    }

    onSave({ name: cleanName, ebsId: ebsId.trim(), status });
  };

  return (
    <div className="po-overlay" onMouseDown={onClose}>
      <div
        className={`po-dialog${isExpanded ? ' is-expanded' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="buyer-modal-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="po-dialog-head">
          <div className="po-dialog-title-wrap">
            <div className="po-form-dialog-icon">
              <Users size={18} />
            </div>
            <h2 id="buyer-modal-title" className="po-dialog-title">
              {isEdit ? 'Edit Buyer' : 'Add Buyer'}
            </h2>
          </div>
          <div className="po-dialog-head-actions">
            <button
              type="button"
              className="po-close"
              onClick={() => setIsExpanded((expanded) => !expanded)}
              aria-label={isExpanded ? 'Restore dialog size' : 'Expand dialog'}
            >
              {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <button type="button" className="po-close" onClick={onClose} aria-label="Close">
              <X size={18} />
            </button>
          </div>
        </div>

        <form id="buyerForm" onSubmit={handleSubmit} noValidate>
          <div className="po-dialog-body">
            <div className="po-field">
              <label htmlFor="buyer-name" className="po-label">
                Buyer Name<span className="po-required">*</span>
              </label>
              <div className={`po-input-wrap${error ? ' has-error' : ''}`}>
                <Users size={16} aria-hidden="true" />
                <input
                  id="buyer-name"
                  ref={nameInput}
                  type="text"
                  maxLength={100}
                  className="po-input"
                  placeholder="Enter buyer name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError('');
                  }}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? 'buyer-name-error' : undefined}
                />
              </div>
              {error && (
                <p id="buyer-name-error" className="po-error" role="alert">
                  {error}
                </p>
              )}
            </div>

            <div className="po-field">
              <label htmlFor="buyer-ebs" className="po-label">EBS ID</label>
              <div className="po-input-wrap">
                <Hash size={16} aria-hidden="true" />
                <input
                  id="buyer-ebs"
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
                <input
                  type="checkbox"
                  checked={status === 'active'}
                  onChange={(e) => setStatus(e.target.checked ? 'active' : 'inactive')}
                />
                <span>Is active ?</span>
              </label>
            </div>
          </div>

          <div className="po-dialog-foot">
            <button type="button" className="po-btn po-btn-ghost" onClick={onClose}>
              <X size={15} />
              Cancel
            </button>
            <button type="submit" form="buyerForm" className="po-btn po-btn-primary">
              <Save size={16} />
              <span>{isEdit ? 'Save Changes' : 'Save'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
