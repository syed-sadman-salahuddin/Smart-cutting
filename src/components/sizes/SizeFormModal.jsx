import { useEffect, useRef, useState } from 'react';
import { Hash, Maximize2, Minimize2, Save, Tag, X } from 'lucide-react';

export default function SizeFormModal({ size, existingSizes = [], onSave, onClose }) {
  const isEdit = Boolean(size);
  const nameInput = useRef(null);

  const [name, setName] = useState(size?.name || '');
  const [ebsId, setEbsId] = useState(size?.ebsId || '');
  const [status, setStatus] = useState(size?.status || 'active');
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
      setError('Size name is required.');
      nameInput.current?.focus();
      return;
    }

    const duplicate = existingSizes.some(
      (item) => item.id !== size?.id && item.name.trim().toLowerCase() === cleanName.toLowerCase()
    );
    if (duplicate) {
      setError('A size with this name already exists.');
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
        aria-labelledby="size-modal-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="po-dialog-head">
          <div className="po-dialog-title-wrap">
            <div className="po-form-dialog-icon">
              <Tag size={18} />
            </div>
            <h2 id="size-modal-title" className="po-dialog-title">
              {isEdit ? 'Edit Size' : 'Add Size'}
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

        <form id="sizeForm" onSubmit={handleSubmit} noValidate>
          <div className="po-dialog-body">
            <div className="po-field">
              <label htmlFor="size-name" className="po-label">
                Size Name<span className="po-required">*</span>
              </label>
              <div className={`po-input-wrap${error ? ' has-error' : ''}`}>
                <Tag size={16} aria-hidden="true" />
                <input
                  id="size-name"
                  ref={nameInput}
                  type="text"
                  maxLength={100}
                  className="po-input"
                  placeholder="Enter size name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError('');
                  }}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? 'size-name-error' : undefined}
                />
              </div>
              {error && (
                <p id="size-name-error" className="po-error" role="alert">
                  {error}
                </p>
              )}
            </div>

            <div className="po-field">
              <label htmlFor="size-ebs" className="po-label">EBS ID</label>
              <div className="po-input-wrap">
                <Hash size={16} aria-hidden="true" />
                <input
                  id="size-ebs"
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
            <button type="submit" form="sizeForm" className="po-btn po-btn-primary">
              <Save size={16} />
              <span>{isEdit ? 'Save Changes' : 'Save'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
