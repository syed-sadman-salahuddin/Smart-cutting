import { useEffect, useRef, useState } from 'react';
import { Layers, Save, ShieldCheck, X } from 'lucide-react';

export default function RoleFormModal({ role, existingRoles, modules, onSave, onClose }) {
  const isEdit = Boolean(role);
  const nameInput = useRef(null);
  const [name, setName] = useState(role?.name || '');
  const [selectedModules, setSelectedModules] = useState(role?.modules || []);
  const [error, setError] = useState('');

  useEffect(() => {
    nameInput.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  const toggleModule = (module) => {
    setSelectedModules((current) =>
      current.includes(module)
        ? current.filter((item) => item !== module)
        : [...current, module]
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const cleanName = name.trim();

    if (!cleanName) {
      setError('Role name is required.');
      nameInput.current?.focus();
      return;
    }

    const duplicate = existingRoles.some(
      (item) => item.id !== role?.id && item.name.trim().toLowerCase() === cleanName.toLowerCase()
    );
    if (duplicate) {
      setError('A role with this name already exists.');
      nameInput.current?.focus();
      return;
    }

    onSave({ name: cleanName, modules: selectedModules });
  };

  return (
    <div className="po-overlay" onMouseDown={onClose}>
      <div
        className="po-dialog roles-form-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="role-form-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="po-dialog-head">
          <div className="po-dialog-title-wrap">
            <div className="po-form-dialog-icon">
              <ShieldCheck size={18} />
            </div>
            <h2 id="role-form-title" className="po-dialog-title">
              {isEdit ? 'Edit Role' : 'Create New Role'}
            </h2>
          </div>
          <button type="button" className="po-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="po-dialog-body">
            <div className="po-field">
              <label htmlFor="role-name" className="po-label">
                Role Name<span className="po-required">*</span>
              </label>
              <div className={`po-input-wrap${error ? ' has-error' : ''}`}>
                <ShieldCheck size={16} aria-hidden="true" />
                <input
                  id="role-name"
                  ref={nameInput}
                  type="text"
                  maxLength={100}
                  className="po-input"
                  placeholder="Enter role name"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    if (error) setError('');
                  }}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? 'role-name-error' : undefined}
                />
              </div>
              {error && (
                <p id="role-name-error" className="po-error" role="alert">
                  {error}
                </p>
              )}
            </div>

            <div className="po-field">
              <div className="roles-module-label">
                <span className="po-label">Modules</span>
                <span>{selectedModules.length} selected</span>
              </div>
              <div className="roles-module-choices">
                {modules.map((module) => (
                  <label key={module} className="roles-module-choice">
                    <input
                      type="checkbox"
                      checked={selectedModules.includes(module)}
                      onChange={() => toggleModule(module)}
                    />
                    <Layers size={13} aria-hidden="true" />
                    <span>{module}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="po-dialog-foot">
            <button type="button" className="po-btn po-btn-ghost" onClick={onClose}>
              <X size={15} />
              Cancel
            </button>
            <button type="submit" className="po-btn po-btn-primary">
              <Save size={16} />
              <span>{isEdit ? 'Save Changes' : 'Create Role'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
