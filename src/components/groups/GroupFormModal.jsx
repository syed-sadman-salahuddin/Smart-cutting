import { useEffect, useRef, useState } from 'react';
import { Hash, Maximize2, Minimize2, Save, UsersRound, X } from 'lucide-react';

export default function GroupFormModal({ group, existingGroups, onSave, onClose }) {
  const isEdit = Boolean(group);
  const nameInput = useRef(null);
  const [name, setName] = useState(group?.name || '');
  const [ebsId, setEbsId] = useState(group?.ebsId || '');
  const [status, setStatus] = useState(group?.status || 'active');
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
      setError('Group name is required.');
      nameInput.current?.focus();
      return;
    }

    const duplicate = existingGroups.some(
      (item) => item.id !== group?.id && item.name.trim().toLowerCase() === cleanName.toLowerCase()
    );
    if (duplicate) {
      setError('A group with this name already exists.');
      nameInput.current?.focus();
      return;
    }

    onSave({ name: cleanName, ebsId: ebsId.trim(), status });
  };

  return (
    <div className="pt-overlay pt-part-form-overlay" onMouseDown={onClose}>
      <div
        className={`pt-dialog pt-part-form-dialog${isExpanded ? ' is-expanded' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="group-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="pt-dialog-head">
          <div className="pt-dialog-title-wrap">
            <div className="pt-form-dialog-icon">
              <UsersRound size={18} />
            </div>
            <h2 id="group-modal-title" className="pt-dialog-title">
              {isEdit ? 'Edit Group' : 'Add Group'}
            </h2>
          </div>
          <div className="pt-dialog-head-actions">
            <button
              type="button"
              className="pt-close"
              onClick={() => setIsExpanded((expanded) => !expanded)}
              aria-label={isExpanded ? 'Restore dialog size' : 'Expand dialog'}
            >
              {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <button type="button" className="pt-close" onClick={onClose} aria-label="Close">
              <X size={18} />
            </button>
          </div>
        </div>

        <form id="groupForm" onSubmit={handleSubmit} noValidate>
          <div className="pt-dialog-body">
            <div className="pt-field">
              <label htmlFor="group-name" className="pt-label">
                Group Name<span className="pt-required">*</span>
              </label>
              <div className={`pt-input-wrap${error ? ' has-error' : ''}`}>
                <UsersRound size={16} aria-hidden="true" />
                <input
                  id="group-name"
                  ref={nameInput}
                  type="text"
                  maxLength={100}
                  className="pt-input"
                  placeholder="Enter group name"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    if (error) setError('');
                  }}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? 'group-name-error' : undefined}
                />
              </div>
              {error && (
                <p id="group-name-error" className="pt-error" role="alert">
                  {error}
                </p>
              )}
            </div>

            <div className="pt-field">
              <label htmlFor="group-ebs" className="pt-label">EBS ID</label>
              <div className="pt-input-wrap">
                <Hash size={16} aria-hidden="true" />
                <input
                  id="group-ebs"
                  type="text"
                  maxLength={50}
                  className="pt-input"
                  placeholder="Enter EBS ID"
                  value={ebsId}
                  onChange={(event) => setEbsId(event.target.value)}
                />
              </div>
            </div>

            <div className="pt-field">
              <span className="pt-label">Active</span>
              <label className="pt-active-checkbox">
                <input
                  type="checkbox"
                  checked={status === 'active'}
                  onChange={(event) => setStatus(event.target.checked ? 'active' : 'inactive')}
                />
                <span>Is active ?</span>
              </label>
            </div>
          </div>

          <div className="pt-dialog-foot">
            <button type="button" className="pt-btn pt-btn-ghost" onClick={onClose}>
              <X size={15} />
              Cancel
            </button>
            <button type="submit" form="groupForm" className="pt-btn pt-btn-primary">
              <Save size={16} />
              <span>{isEdit ? 'Save Changes' : 'Save'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
