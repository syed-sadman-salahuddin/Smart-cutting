import { useEffect, useState } from 'react';
import { X, SquarePen, Save } from 'lucide-react';
import { CUTTING_TABLES, SEWING_LINES } from '../../data/cuttingGeneralData';

export default function BundleCardEditModal({ item, onSave, onClose }) {
  const [formData, setFormData] = useState({
    table: item?.table || item?.cuttingTable || '',
    line: item?.line || item?.sewingLine || '',
    cutNo: item?.cutNo ?? item?.nextCutNumber ?? 1,
    shrinkage: item?.shrinkage || '',
    color: item?.color || '',
    qtyPerRatio: item?.qtyPerRatio || item?.totalQuantity || 0,
  });

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  if (!item) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(item.id, {
      ...formData,
      cuttingTable: formData.table,
      sewingLine: formData.line,
      totalQuantity: Number(formData.qtyPerRatio),
      qtyPerRatio: Number(formData.qtyPerRatio),
      nextCutNumber: Number(formData.cutNo),
    });
    onClose();
  };

  return (
    <div className="bcl-overlay" onMouseDown={onClose}>
      <div
        className="bcl-modal"
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="bcl-modal-header">
          <div className="bcl-modal-title-wrap">
            <div className="bcl-banner-icon" style={{ width: 30, height: 30, borderRadius: 8 }}>
              <SquarePen size={16} />
            </div>
            <div>
              <h3 className="bcl-modal-title">
                Edit Bundle Card: <span style={{ color: 'var(--color-primary)' }}>{item.ourReference}</span>
              </h3>
              <p style={{ fontSize: '12px', color: '#6b7280' }}>
                {item.buyer} · PO: {Array.isArray(item.pos) ? item.pos.join(', ') : item.poNo}
              </p>
            </div>
          </div>
          <button type="button" className="bcl-modal-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bcl-modal-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="bcl-filter-field">
                <label className="bcl-filter-label">Cutting Table</label>
                <select
                  className="bcl-date-input"
                  style={{ paddingLeft: '12px' }}
                  value={formData.table}
                  onChange={(e) => setFormData({ ...formData, table: e.target.value })}
                >
                  <option value="">— (None)</option>
                  {CUTTING_TABLES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bcl-filter-field">
                <label className="bcl-filter-label">Sewing Line</label>
                <select
                  className="bcl-date-input"
                  style={{ paddingLeft: '12px' }}
                  value={formData.line}
                  onChange={(e) => setFormData({ ...formData, line: e.target.value })}
                >
                  <option value="">— (None)</option>
                  {SEWING_LINES.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bcl-filter-field">
                <label className="bcl-filter-label">Cut #</label>
                <input
                  type="number"
                  min="1"
                  className="bcl-date-input"
                  style={{ paddingLeft: '12px' }}
                  value={formData.cutNo}
                  onChange={(e) => setFormData({ ...formData, cutNo: e.target.value })}
                />
              </div>

              <div className="bcl-filter-field">
                <label className="bcl-filter-label">Shrinkage</label>
                <input
                  type="text"
                  className="bcl-date-input"
                  style={{ paddingLeft: '12px' }}
                  value={formData.shrinkage}
                  onChange={(e) => setFormData({ ...formData, shrinkage: e.target.value })}
                  placeholder="e.g. 1 or 2"
                />
              </div>

              <div className="bcl-filter-field">
                <label className="bcl-filter-label">Color</label>
                <input
                  type="text"
                  className="bcl-date-input"
                  style={{ paddingLeft: '12px' }}
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                />
              </div>

              <div className="bcl-filter-field">
                <label className="bcl-filter-label">Quantity Per Ratio</label>
                <input
                  type="number"
                  min="0"
                  className="bcl-date-input"
                  style={{ paddingLeft: '12px' }}
                  value={formData.qtyPerRatio}
                  onChange={(e) => setFormData({ ...formData, qtyPerRatio: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="bcl-modal-footer">
            <button type="button" className="bcl-btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="bcl-btn-primary">
              <Save size={15} />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
