import { useEffect, useRef, useState } from 'react';
import {
  ClipboardList,
  Save,
  X,
  Building2,
  Handshake,
  Link2,
  Calendar,
  Layers,
  Hash,
} from 'lucide-react';
import { COMPANIES, BUYERS, REFERENCES, GARMENT_TYPES } from '../../data/cuttingPOData';

export default function CuttingPOFormModal({ item, existingItems = [], onSave, onClose }) {
  const isEdit = Boolean(item);
  const poInput = useRef(null);

  const [poNo, setPoNo] = useState(item?.poNo || '');
  const [company, setCompany] = useState(item?.company || COMPANIES[0]);
  const [buyer, setBuyer] = useState(item?.buyer || BUYERS[0]);
  const [reference, setReference] = useState(item?.reference || REFERENCES[0]);
  const [type, setType] = useState(item?.type || 'Top');
  const [quantity, setQuantity] = useState(item?.quantity !== undefined ? item.quantity : 100);
  const [rows, setRows] = useState(item?.rows !== undefined ? item.rows : 5);
  const [confirmationDate, setConfirmationDate] = useState(item?.confirmationDate || '');
  const [shipmentDate, setShipmentDate] = useState(item?.shipmentDate || '');
  const [status, setStatus] = useState(item?.status || 'active');

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
    const cleanPo = poNo.trim();

    if (!cleanPo) {
      setError('PO Number is required.');
      poInput.current?.focus();
      return;
    }

    const duplicate = existingItems.some(
      (it) => it.id !== item?.id && it.poNo.trim().toLowerCase() === cleanPo.toLowerCase()
    );
    if (duplicate) {
      setError('A cutting PO with this PO Number already exists.');
      poInput.current?.focus();
      return;
    }

    onSave({
      poNo: cleanPo,
      company,
      buyer,
      reference,
      type,
      quantity: Number(quantity) || 0,
      rows: Number(rows) || 1,
      confirmationDate,
      shipmentDate,
      status,
    });
  };

  return (
    <div className="cpo-overlay" onMouseDown={onClose}>
      <div
        className="cpo-modal"
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="cpo-modal-head">
          <div className="cpo-modal-title-wrap">
            <div className="cpo-modal-icon">
              <ClipboardList size={18} />
            </div>
            <h2 className="cpo-modal-title">
              {isEdit ? 'Edit Cutting PO' : 'Add Cutting PO'}
            </h2>
          </div>
          <button type="button" className="cpo-modal-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="cpo-modal-body">
            {error && (
              <div style={{
                padding: '8px 12px',
                borderRadius: '6px',
                background: '#fee2e2',
                color: '#b91c1c',
                fontSize: '13px',
                border: '1px solid #fecaca'
              }}>
                {error}
              </div>
            )}

            <div className="cpo-modal-grid-2">
              <div className="cpo-form-field">
                <label className="cpo-form-label" htmlFor="po-no-input">
                  PO Number<span className="cpo-required">*</span>
                </label>
                <input
                  id="po-no-input"
                  ref={poInput}
                  type="text"
                  className="cpo-form-input"
                  placeholder="e.g. 4100062113"
                  value={poNo}
                  onChange={(e) => {
                    setPoNo(e.target.value);
                    if (error) setError('');
                  }}
                  required
                />
              </div>

              <div className="cpo-form-field">
                <label className="cpo-form-label" htmlFor="company-select">
                  Company
                </label>
                <select
                  id="company-select"
                  className="cpo-form-select"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                >
                  {COMPANIES.map((comp) => (
                    <option key={comp} value={comp}>
                      {comp}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="cpo-modal-grid-2">
              <div className="cpo-form-field">
                <label className="cpo-form-label" htmlFor="buyer-select">
                  Buyer
                </label>
                <select
                  id="buyer-select"
                  className="cpo-form-select"
                  value={buyer}
                  onChange={(e) => setBuyer(e.target.value)}
                >
                  {BUYERS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div className="cpo-form-field">
                <label className="cpo-form-label" htmlFor="ref-select">
                  Reference
                </label>
                <select
                  id="ref-select"
                  className="cpo-form-select"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                >
                  {REFERENCES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="cpo-modal-grid-2">
              <div className="cpo-form-field">
                <label className="cpo-form-label" htmlFor="type-select">
                  Garment Type
                </label>
                <select
                  id="type-select"
                  className="cpo-form-select"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  {GARMENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="cpo-form-field">
                <label className="cpo-form-label" htmlFor="qty-input">
                  Total Quantity
                </label>
                <input
                  id="qty-input"
                  type="number"
                  min="1"
                  className="cpo-form-input"
                  placeholder="e.g. 1000"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
            </div>

            <div className="cpo-modal-grid-2">
              <div className="cpo-form-field">
                <label className="cpo-form-label" htmlFor="rows-input">
                  Rows / Bundles Count
                </label>
                <input
                  id="rows-input"
                  type="number"
                  min="1"
                  className="cpo-form-input"
                  placeholder="e.g. 5"
                  value={rows}
                  onChange={(e) => setRows(e.target.value)}
                />
              </div>

              <div className="cpo-form-field">
                <label className="cpo-form-label" htmlFor="status-select">
                  Status
                </label>
                <select
                  id="status-select"
                  className="cpo-form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="cpo-modal-grid-2">
              <div className="cpo-form-field">
                <label className="cpo-form-label" htmlFor="conf-date-input">
                  Confirmation Date
                </label>
                <input
                  id="conf-date-input"
                  type="date"
                  className="cpo-form-input"
                  value={confirmationDate}
                  onChange={(e) => setConfirmationDate(e.target.value)}
                />
              </div>

              <div className="cpo-form-field">
                <label className="cpo-form-label" htmlFor="ship-date-input">
                  Shipment Date (Optional)
                </label>
                <input
                  id="ship-date-input"
                  type="date"
                  className="cpo-form-input"
                  value={shipmentDate}
                  onChange={(e) => setShipmentDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="cpo-modal-foot">
            <button type="button" className="cpo-btn cpo-btn-ghost" onClick={onClose}>
              <X size={15} />
              Cancel
            </button>
            <button type="submit" className="cpo-btn cpo-btn-primary">
              <Save size={15} />
              <span>{isEdit ? 'Save Changes' : 'Add PO'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
