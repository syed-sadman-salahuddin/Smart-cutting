import { useEffect, useRef, useState } from 'react';
import { Building2, FileText, Maximize2, Minimize2, Save, X } from 'lucide-react';

export default function DepartmentFormModal({ department, existingDepartments = [], onSave, onClose }) {
  const isEdit = Boolean(department);
  const nameInput = useRef(null);
  const [name, setName] = useState(department?.name || '');
  const [description, setDescription] = useState(department?.description || '');
  const [status, setStatus] = useState(department?.status || 'active');
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState('');

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

    if (!cleanName) {
      setError('Department name is required.');
      nameInput.current?.focus();
      return;
    }

    const duplicate = existingDepartments.some(
      (item) => item.id !== department?.id && item.name.trim().toLowerCase() === cleanName.toLowerCase()
    );
    if (duplicate) {
      setError('A department with this name already exists.');
      nameInput.current?.focus();
      return;
    }

    onSave({ name: cleanName, description: description.trim(), status });
  };

  return (
    <div className="po-overlay" onMouseDown={onClose}>
      <div
        className={`po-dialog${isExpanded ? ' is-expanded' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="department-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="po-dialog-head">
          <div className="po-dialog-title-wrap">
            <div className="po-form-dialog-icon">
              <Building2 size={18} />
            </div>
            <h2 id="department-modal-title" className="po-dialog-title">
              {isEdit ? 'Edit Department' : 'Add Department'}
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

        <form id="departmentForm" onSubmit={handleSubmit} noValidate>
          <div className="po-dialog-body">
            <div className="po-field">
              <label htmlFor="department-name" className="po-label">
                Department Name<span className="po-required">*</span>
              </label>
              <div className={`po-input-wrap${error ? ' has-error' : ''}`}>
                <Building2 size={16} aria-hidden="true" />
                <input
                  id="department-name"
                  ref={nameInput}
                  type="text"
                  maxLength={100}
                  className="po-input"
                  placeholder="Enter department name"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    if (error) setError('');
                  }}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? 'department-name-error' : undefined}
                />
              </div>
              {error && (
                <p id="department-name-error" className="po-error" role="alert">
                  {error}
                </p>
              )}
            </div>

            <div className="po-field">
              <label htmlFor="department-description" className="po-label">Description</label>
              <div className="po-input-wrap department-description-wrap">
                <FileText size={16} aria-hidden="true" />
                <textarea
                  id="department-description"
                  maxLength={200}
                  className="department-description"
                  placeholder="Write a short description..."
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>
              <span className="department-description-count">{description.length}/200</span>
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
            <button type="submit" form="departmentForm" className="po-btn po-btn-primary">
              <Save size={16} />
              <span>{isEdit ? 'Save Changes' : 'Save'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
