import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BadgePlus,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Database,
  ListOrdered,
  Palette,
  Search,
  SquarePen,
  Trash2,
  X,
} from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import ConfirmDialog from '../components/ConfirmDialog';
import ColorFormModal from '../components/colors/ColorFormModal';
import { KEYS } from '../services/storage';
import { useCollection } from '../hooks/useCollection';
import { COLORS_PAGE_SIZES, byName } from '../data/colorsData';
import '../styles/po.css';

const pad = (value) => String(value).padStart(2, '0');
function formatCreated(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const hours = date.getHours();
  return {
    day: `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`,
    time: `${pad(hours % 12 || 12)}:${pad(date.getMinutes())} ${hours >= 12 ? 'PM' : 'AM'}`,
  };
}
function getPageItems(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, 4, 'end-gap', total];
  if (current >= total - 2) return [1, 'start-gap', total - 3, total - 2, total - 1, total];
  return [1, 'start-gap', current - 1, current, current + 1, 'end-gap', total];
}
function PageSizeSelect({ value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const onClickOutside = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onClickOutside); document.removeEventListener('keydown', onKey); };
  }, [open]);
  return (
    <div className="po-select" ref={wrapRef}>
      <button type="button" className="po-select-btn" aria-haspopup="listbox" aria-expanded={open} aria-label="Rows per page" onClick={() => setOpen((p) => !p)}>
        <span>{value}</span>
        <ChevronDown size={12} className={`po-select-chevron${open ? ' is-open' : ''}`} />
      </button>
      {open && (
        <ul className="po-select-menu" role="listbox">
          {options.map((opt) => (
            <li key={opt} role="presentation">
              <button type="button" role="option" aria-selected={opt === value} className={`po-select-option${opt === value ? ' is-active' : ''}`} onClick={() => { onChange(opt); setOpen(false); }}>{opt}</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Colors() {
  const { items, add, update, remove } = useCollection(KEYS.colors);
  const [query, setQuery] = useState('');
  const [pageSize, setPageSize] = useState(COLORS_PAGE_SIZES[0]);
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(null);
  const [colorToDelete, setColorToDelete] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '' });
  const toastTimer = useRef(null);
  useEffect(() => () => clearTimeout(toastTimer.current), []);
  const showToast = (msg) => {
    setToast({ visible: true, message: msg });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000);
  };
  const closeForm = useCallback(() => setForm(null), []);
  const cancelDelete = useCallback(() => setColorToDelete(null), []);
  const rows = useMemo(() => {
    const txt = query.trim().toLowerCase();
    return items
      .filter((c) => !txt || c.name.toLowerCase().includes(txt) || String(c.ebsId || '').toLowerCase().includes(txt))
      .sort(byName);
  }, [items, query]);
  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const visibleRows = rows.slice(start, start + pageSize);
  const from = total === 0 ? 0 : start + 1;
  const to = start + visibleRows.length;
  const handleSearch = (e) => { setQuery(e.target.value); setPage(1); };
  const handlePageSize = (size) => { setPageSize(size); setPage(1); };
  const handleSave = (values) => {
    if (form?.color) {
      update(form.color.id, values);
      showToast('Color updated successfully.');
    } else {
      const created = add(values);
      const pos = [...items, created].sort(byName).findIndex((i) => i.id === created.id);
      setQuery('');
      setPage(Math.floor(pos / pageSize) + 1);
      showToast('Color added successfully.');
    }
    setForm(null);
  };
  const handleDelete = () => {
    if (colorToDelete) { remove(colorToDelete.id); showToast('Color deleted.'); }
    setColorToDelete(null);
  };
  return (
    <>
      <Breadcrumb label="Colors" icon={Palette} />
      <div className="card-shell">
        <div className="po-banner">
          <div className="po-banner-left">
            <div className="po-banner-icon"><Palette size={20} /></div>
            <h1 className="po-banner-title">Colors</h1>
          </div>
          <button type="button" className="po-add-btn" onClick={() => setForm({ color: null })}>
            <BadgePlus size={16} /><span>Add Color</span>
          </button>
        </div>
        <div className="po-body">
          <div className="po-panel">
            <div className="po-toolbar">
              <div className="po-search">
                <span className="po-search-icon"><Search size={16} /></span>
                <input type="text" className="po-search-input" placeholder="Search colors..." value={query} onChange={handleSearch} />
              </div>
              <div className="po-show">
                <span className="po-show-label">Show</span>
                <PageSizeSelect value={pageSize} options={COLORS_PAGE_SIZES} onChange={handlePageSize} />
              </div>
            </div>
            <div className="po-scroll">
              <table className="po-table">
                <thead>
                  <tr>
                    <th className="po-th po-sticky-left po-col-index"><div className="po-th-inner"><ListOrdered size={12} className="po-th-icon" /><span>#</span></div></th>
                    <th className="po-th" style={{ minWidth: 260 }}>Color</th>
                    <th className="po-th" style={{ minWidth: 140 }}>EBS ID</th>
                    <th className="po-th" style={{ minWidth: 160 }}>Created Time</th>
                    <th className="po-th po-th-center" style={{ minWidth: 110 }}>Status</th>
                    <th className="po-th po-th-right po-sticky-right" style={{ minWidth: 100 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.length === 0 ? (
                    <tr className="po-empty-row">
                      <td colSpan={6} className="po-empty">
                        <div className="po-empty-inner"><div className="po-empty-icon"><Database size={20} /></div><p>No colors found</p></div>
                      </td>
                    </tr>
                  ) : (
                    visibleRows.map((color, index) => {
                      const created = formatCreated(color.createdAt);
                      const isActive = color.status !== 'inactive';
                      return (
                        <tr key={color.id}>
                          <td className="po-td po-sticky-left po-col-index"><span className="po-index">{pad(start + index + 1)}</span></td>
                          <td className="po-td">
                            <div className="po-entity">
                              <div className="po-entity-icon"><Palette size={16} /></div>
                              <span className="po-entity-name">{color.name}</span>
                            </div>
                          </td>
                          <td className="po-td po-td-muted">{color.ebsId || '—'}</td>
                          <td className="po-td">
                            {created ? (
                              <div><div className="po-date-day">{created.day}</div><div className="po-date-time">{created.time}</div></div>
                            ) : '—'}
                          </td>
                          <td className="po-td po-td-center">
                            <span className={`po-badge ${isActive ? 'po-badge-active' : 'po-badge-inactive'}`}>
                              {isActive ? <Check size={12} /> : <X size={12} />}
                              {isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="po-td po-td-right po-sticky-right">
                            <div className="po-actions">
                              <button type="button" className="po-icon-btn po-icon-edit" title="Edit" aria-label={`Edit ${color.name}`} onClick={() => setForm({ color })}><SquarePen size={20} /></button>
                              <button type="button" className="po-icon-btn po-icon-delete" title="Delete" aria-label={`Delete ${color.name}`} onClick={() => setColorToDelete(color)}><Trash2 size={20} /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <div className="po-footer">
              <div className="po-showing">Showing <strong className="po-strong">{from}–{to}</strong> of <strong className="po-strong">{total}</strong> colors</div>
              <div className="po-pager">
                <button type="button" className="po-nav-btn" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}><ChevronLeft size={12} /><span className="po-nav-text">Previous</span></button>
                {getPageItems(currentPage, totalPages).map((item) =>
                  typeof item === 'number' ? (
                    <button key={item} type="button" className={`po-page-btn${item === currentPage ? ' is-active' : ''}`} aria-current={item === currentPage ? 'page' : undefined} onClick={() => setPage(item)}>{item}</button>
                  ) : (
                    <span key={item} className="po-gap">…</span>
                  )
                )}
                <button type="button" className="po-nav-btn" disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)}><span className="po-nav-text">Next</span><ChevronRight size={12} /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {form && <ColorFormModal color={form.color} existingColors={items} onSave={handleSave} onClose={closeForm} />}
      {colorToDelete && (
        <ConfirmDialog
          title="Delete color?"
          message={`Are you sure you want to delete "${colorToDelete.name}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={cancelDelete}
        />
      )}
      <div className={`po-toast${toast.visible ? '' : ' po-toast-hidden'}`} role="status" aria-live="polite">
        <CircleCheck size={16} /><span>{toast.message}</span>
      </div>
    </>
  );
}
