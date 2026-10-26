import { useEffect, useRef, useState } from 'react';
import { Hash, Maximize2, Minimize2, Palette, Save, X } from 'lucide-react';

export default function ShadeFormModal({ shade, existingShades = [], onSave, onClose }) {
  const isEdit = Boolean(shade);
  const nameInput = useRef(null);

  const [name, setName] = useState(shade?.name || '');
  const [ebsId, setEbsId] = useState(shade?.ebsId || '');
  const [status, setStatus] = useState(shade?.status || 'active');
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
      setError('Shade name is required.');
      nameInput.current?.focus();
      return;
    }

    const duplicate = existingShades.some(
      (item) => item.id !== shade?.id && item.name.trim().toLowerCase() === cleanName.toLowerCase()
    );
    if (duplicate) {
      setError('A shade with this name already exists.');
      nameInput.current?.focus();
      return;
    }

    onSave({ name: cleanName, ebsId: ebsId.trim(), status });
  };

  return (
    <div className="sh-overlay sh-shade-form-overlay" onMouseDown={onClose}>
      <div
        className={`sh-dialog sh-shade-form-dialog${isExpanded ? ' is-expanded' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="shade-modal-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="sh-dialog-head">
          <div className="sh-dialog-title-wrap">
            <div className="sh-form-dialog-icon">
              <Palette size={18} />
            </div>
            <h2 id="shade-modal-title" className="sh-dialog-title">
              {isEdit ? 'Edit Shade' : 'Add Shade'}
            </h2>
          </div>
          <div className="sh-dialog-head-actions">
            <button
              type="button"
              className="sh-close"
              onClick={() => setIsExpanded((expanded) => !expanded)}
              aria-label={isExpanded ? 'Restore dialog size' : 'Expand dialog'}
            >
              {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <button type="button" className="sh-close" onClick={onClose} aria-label="Close">
              <X size={18} />
            </button>
          </div>
        </div>

        <form id="shadeForm" onSubmit={handleSubmit} noValidate>
          <div className="sh-dialog-body">
            <div className="sh-field">
              <label htmlFor="shade-name" className="sh-label">
                Shade Name<span className="sh-required">*</span>
              </label>
              <div className={`sh-input-wrap${error ? ' has-error' : ''}`}>
                <Palette size={16} aria-hidden="true" />
                <input
                  id="shade-name"
                  ref={nameInput}
                  type="text"
                  maxLength={100}
                  className="sh-input"
                  placeholder="Enter fabric shade name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError('');
                  }}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? 'shade-name-error' : undefined}
                />
              </div>
              {error && (
                <p id="shade-name-error" className="sh-error" role="alert">
                  {error}
                </p>
              )}
            </div>

            <div className="sh-field">
              <label htmlFor="shade-ebs" className="sh-label">EBS ID</label>
              <div className="sh-input-wrap">
                <Hash size={16} aria-hidden="true" />
                <input
                  id="shade-ebs"
                  type="text"
                  maxLength={50}
                  className="sh-input"
                  placeholder="Enter EBS ID"
                  value={ebsId}
                  onChange={(e) => setEbsId(e.target.value)}
                />
              </div>
            </div>

            <div className="sh-field">
              <span className="sh-label">Active</span>
              <label className="sh-active-checkbox">
                <input
                  type="checkbox"
                  checked={status === 'active'}
                  onChange={(e) => setStatus(e.target.checked ? 'active' : 'inactive')}
                />
                <span>Is active ?</span>
              </label>
            </div>
          </div>

          <div className="sh-dialog-foot">
            <button type="button" className="sh-btn sh-btn-ghost" onClick={onClose}>
              <X size={15} />
              Cancel
            </button>
            <button type="submit" form="shadeForm" className="sh-btn sh-btn-primary">
              <Save size={16} />
              <span>{isEdit ? 'Save Changes' : 'Save'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
