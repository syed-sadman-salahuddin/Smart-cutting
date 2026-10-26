import { useEffect, useRef, useState } from 'react';
import { Hash, Link as LinkIcon, Maximize2, Minimize2, Save, Users, X } from 'lucide-react';

export default function OurReferenceFormModal({
  reference,
  existingReferences = [],
  buyers = [],
  onSave,
  onClose,
}) {
  const isEdit = Boolean(reference);
  const nameInput = useRef(null);

  const [name, setName] = useState(reference?.name || '');
  const [buyer, setBuyer] = useState(reference?.buyer || (buyers[0]?.name || ''));
  const [ebsId, setEbsId] = useState(reference?.ebsId || '');
  const [status, setStatus] = useState(reference?.status || 'active');
  const [isExpanded, setIsExpanded] = useState(false);
  const [errors, setErrors] = useState({});

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
    const newErrors = {};

    const cleanBuyer = buyer.trim();
    if (!cleanBuyer) {
      newErrors.buyer = 'Buyer is required.';
    }

    const cleanName = name.trim();
    if (!cleanName) {
      newErrors.name = 'Our reference name is required.';
    } else {
      const duplicate = existingReferences.some(
        (item) => item.id !== reference?.id && item.name.trim().toLowerCase() === cleanName.toLowerCase()
      );
      if (duplicate) {
        newErrors.name = 'A reference with this name already exists.';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      name: cleanName,
      buyer: cleanBuyer,
      ebsId: ebsId.trim(),
      status,
    });
  };

  return (
    <div className="po-overlay" onMouseDown={onClose}>
      <div
        className={`po-dialog${isExpanded ? ' is-expanded' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ref-modal-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="po-dialog-head">
          <div className="po-dialog-title-wrap">
            <div className="po-form-dialog-icon">
              <LinkIcon size={18} />
            </div>
            <h2 id="ref-modal-title" className="po-dialog-title">
              {isEdit ? 'Edit Our Reference' : 'Add Our Reference'}
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

        <form id="refForm" onSubmit={handleSubmit} noValidate>
          <div className="po-dialog-body">
            {/* Buyer selection */}
            <div className="po-field">
              <label htmlFor="ref-buyer" className="po-label">
                Buyer<span className="po-required">*</span>
              </label>
              <div className={`po-input-wrap${errors.buyer ? ' has-error' : ''}`}>
                <Users size={16} aria-hidden="true" />
                <select
                  id="ref-buyer"
                  className="po-select-field"
                  value={buyer}
                  onChange={(e) => {
                    setBuyer(e.target.value);
                    if (errors.buyer) setErrors((prev) => ({ ...prev, buyer: '' }));
                  }}
                >
                  <option value="">Select buyer</option>
                  {buyers.map((b) => (
                    <option key={b.id || b.name} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.buyer && (
                <p className="po-error" role="alert">
                  {errors.buyer}
                </p>
              )}
            </div>

            {/* Reference Name */}
            <div className="po-field">
              <label htmlFor="ref-name" className="po-label">
                Our Reference Name<span className="po-required">*</span>
              </label>
              <div className={`po-input-wrap${errors.name ? ' has-error' : ''}`}>
                <LinkIcon size={16} aria-hidden="true" />
                <input
                  id="ref-name"
                  ref={nameInput}
                  type="text"
                  maxLength={100}
                  className="po-input"
                  placeholder="Enter our reference name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                  }}
                  aria-invalid={Boolean(errors.name)}
                />
              </div>
              {errors.name && (
                <p className="po-error" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            {/* EBS ID */}
            <div className="po-field">
              <label htmlFor="ref-ebs" className="po-label">EBS ID</label>
              <div className="po-input-wrap">
                <Hash size={16} aria-hidden="true" />
                <input
                  id="ref-ebs"
                  type="text"
                  maxLength={50}
                  className="po-input"
                  placeholder="Enter EBS ID"
                  value={ebsId}
                  onChange={(e) => setEbsId(e.target.value)}
                />
              </div>
            </div>

            {/* Status */}
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
            <button type="submit" form="refForm" className="po-btn po-btn-primary">
              <Save size={16} />
              <span>{isEdit ? 'Save Changes' : 'Save'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
