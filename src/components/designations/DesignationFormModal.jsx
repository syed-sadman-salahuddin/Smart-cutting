import { useEffect, useRef, useState } from 'react';
import { Badge, FileText, Maximize2, Minimize2, Save, Tag, X } from 'lucide-react';

export default function DesignationFormModal({
  designation,
  existingDesignations = [],
  onSave,
  onClose,
}) {
  const isEdit = Boolean(designation);
  const nameInput = useRef(null);
  const [name, setName] = useState(designation?.name || '');
  const [shortName, setShortName] = useState(designation?.shortName || '');
  const [description, setDescription] = useState(designation?.description || '');
  const [status, setStatus] = useState(designation?.status || 'active');
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState('');
  const [shortNameError, setShortNameError] = useState('');

  useEffect(() => {
    nameInput.current?.focus();
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const cleanName = name.trim();
    const cleanShortName = shortName.trim();
    let hasError = false;

    if (!cleanName) {
      setError('Designation name is required.');
      nameInput.current?.focus();
      hasError = true;
    } else {
      const duplicateName = existingDesignations.some(
        (item) => item.id !== designation?.id && item.name.trim().toLowerCase() === cleanName.toLowerCase()
      );
      if (duplicateName) {
        setError('A designation with this name already exists.');
        nameInput.current?.focus();
        hasError = true;
      } else {
        setError('');
      }
    }

    if (!cleanShortName) {
      setShortNameError('Short name is required.');
      hasError = true;
    } else {
      const duplicateShortName = existingDesignations.some(
        (item) =>
          item.id !== designation?.id &&
          String(item.shortName || '').trim().toLowerCase() === cleanShortName.toLowerCase()
      );
      if (duplicateShortName) {
        setShortNameError('A designation with this short name already exists.');
        hasError = true;
      } else {
        setShortNameError('');
      }
    }

    if (hasError) return;
    onSave({ name: cleanName, shortName: cleanShortName, description: description.trim(), status });
  };

  return (
    <div className="po-overlay" onMouseDown={onClose}>
      <div
        className={`po-dialog${isExpanded ? ' is-expanded' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="designation-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="po-dialog-head">
          <div className="po-dialog-title-wrap">
            <div className="po-form-dialog-icon">
              <Badge size={18} />
            </div>
            <h2 id="designation-modal-title" className="po-dialog-title">
              {isEdit ? 'Edit Designation' : 'Add Designation'}
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

        <form id="designationForm" onSubmit={handleSubmit} noValidate>
          <div className="po-dialog-body">
            <div className="po-field">
              <label htmlFor="designation-name" className="po-label">
                Designation Name<span className="po-required">*</span>
              </label>
              <div className={`po-input-wrap${error ? ' has-error' : ''}`}>
                <Badge size={16} aria-hidden="true" />
                <input
                  id="designation-name"
                  ref={nameInput}
                  type="text"
                  maxLength={100}
                  className="po-input"
                  placeholder="Enter designation name"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    if (error) setError('');
                  }}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? 'designation-name-error' : undefined}
                />
              </div>
              {error && (
                <p id="designation-name-error" className="po-error" role="alert">
                  {error}
                </p>
              )}
            </div>

            <div className="po-field">
              <label htmlFor="designation-short-name" className="po-label">
                Short Name<span className="po-required">*</span>
              </label>
              <div className={`po-input-wrap${shortNameError ? ' has-error' : ''}`}>
                <Tag size={16} aria-hidden="true" />
                <input
                  id="designation-short-name"
                  type="text"
                  maxLength={50}
                  className="po-input"
                  placeholder="Enter short name"
                  value={shortName}
                  onChange={(event) => {
                    setShortName(event.target.value);
                    if (shortNameError) setShortNameError('');
                  }}
                  aria-invalid={Boolean(shortNameError)}
                  aria-describedby={shortNameError ? 'designation-short-name-error' : undefined}
                />
              </div>
              {shortNameError && (
                <p id="designation-short-name-error" className="po-error" role="alert">
                  {shortNameError}
                </p>
              )}
            </div>

            <div className="po-field">
              <label htmlFor="designation-description" className="po-label">Description</label>
              <div className="po-input-wrap designation-description-wrap">
                <FileText size={16} aria-hidden="true" />
                <textarea
                  id="designation-description"
                  maxLength={200}
                  className="designation-description"
                  placeholder="Write a short description..."
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>
              <span className="designation-description-count">{description.length}/200</span>
            </div>

            <div className="po-field">
              <span className="po-label">Active</span>
              <label className="po-active-checkbox">
                <input
                  type="checkbox"
                  checked={status === 'active'}
                  onChange={(event) => setStatus(event.target.checked ? 'active' : 'inactive')}
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
            <button type="submit" form="designationForm" className="po-btn po-btn-primary">
              <Save size={16} />
              <span>{isEdit ? 'Save Changes' : 'Save'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
