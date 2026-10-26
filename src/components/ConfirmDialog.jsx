import { useEffect } from 'react';
import { Trash2 } from 'lucide-react';

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [onCancel]);

  return (
    <div className="pt-overlay" onMouseDown={onCancel}>
      <div
        className="pt-dialog pt-dialog-confirm"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="pt-confirm-icon">
          <Trash2 size={22} />
        </div>
        <h2 id="confirm-title" className="pt-confirm-title">{title}</h2>
        <p className="pt-confirm-message">{message}</p>

        <div className="pt-confirm-actions">
          <button type="button" className="pt-btn pt-btn-ghost" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type="button" className="pt-btn pt-btn-danger" onClick={onConfirm} autoFocus>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}