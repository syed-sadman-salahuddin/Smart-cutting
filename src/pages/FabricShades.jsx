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
import ShadeFormModal from '../components/shades/ShadeFormModal';
import { KEYS } from '../services/storage';
import { useCollection } from '../hooks/useCollection';
import { SHADES_PAGE_SIZES, byName } from '../data/shadesData';
import '../styles/shades.css';

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
    const onClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="sh-select" ref={wrapRef}>
      <button
        type="button"
        className="sh-select-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Rows per page"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{value}</span>
        <ChevronDown size={12} className={`sh-select-chevron${open ? ' is-open' : ''}`} />
      </button>

      {open && (
        <ul className="sh-select-menu" role="listbox">
          {options.map((size) => (
            <li key={size} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={size === value}
                className={`sh-select-option${size === value ? ' is-active' : ''}`}
                onClick={() => {
                  onChange(size);
                  setOpen(false);
                }}
              >
                {size}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function FabricShades() {
  const { items, add, update, remove } = useCollection(KEYS.shades);

  const [query, setQuery] = useState('');
  const [pageSize, setPageSize] = useState(SHADES_PAGE_SIZES[0]);
  const [page, setPage] = useState(1);

  const [form, setForm] = useState(null);
  const [shadeToDelete, setShadeToDelete] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '' });
  const toastTimer = useRef(null);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const showToast = (message) => {
    setToast({ visible: true, message });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3000);
  };

  const closeForm = useCallback(() => setForm(null), []);
  const cancelDelete = useCallback(() => setShadeToDelete(null), []);

  const rows = useMemo(() => {
    const text = query.trim().toLowerCase();
    return items
      .filter(
        (shade) =>
          !text ||
          shade.name.toLowerCase().includes(text) ||
          String(shade.ebsId || '').toLowerCase().includes(text)
      )
      .sort(byName);
  }, [items, query]);

  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const visibleRows = rows.slice(start, start + pageSize);
  const from = total === 0 ? 0 : start + 1;
  const to = start + visibleRows.length;

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setPage(1);
  };

  const handlePageSize = (size) => {
    setPageSize(size);
    setPage(1);
  };

  const handleSave = (values) => {
    if (form?.shade) {
      update(form.shade.id, values);
      showToast('Shade updated successfully.');
    } else {
      const created = add(values);
      const position = [...items, created].sort(byName).findIndex((shade) => shade.id === created.id);
      setQuery('');
      setPage(Math.floor(position / pageSize) + 1);
      showToast('Shade added successfully.');
    }
    setForm(null);
  };

  const handleDelete = () => {
    if (shadeToDelete) {
      remove(shadeToDelete.id);
      showToast('Shade deleted.');
    }
    setShadeToDelete(null);
  };

  return (
    <>
      <Breadcrumb label="Fabric Shades" icon={Palette} />

      <div className="card-shell">
        {/* ---------- Banner ---------- */}
        <div className="sh-banner">
          <div className="sh-banner-left">
            <div className="sh-banner-icon">
              <Palette size={20} />
            </div>
            <h1 className="sh-banner-title">Fabric Shades</h1>
          </div>

          <button type="button" className="sh-add-btn" onClick={() => setForm({ shade: null })}>
            <BadgePlus size={16} />
            <span>Add Shade</span>
          </button>
        </div>

        {/* ---------- Body ---------- */}
        <div className="sh-body">
          <div className="sh-panel">
            {/* search + "Show" dropdown */}
            <div className="sh-toolbar">
              <div className="sh-search">
                <span className="sh-search-icon">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  className="sh-search-input"
                  placeholder="Search shades..."
                  value={query}
                  onChange={handleSearch}
                />
              </div>

              <div className="sh-show">
                <span className="sh-show-label">Show</span>
                <PageSizeSelect value={pageSize} options={SHADES_PAGE_SIZES} onChange={handlePageSize} />
              </div>
            </div>

            {/* table */}
            <div className="sh-scroll">
              <table className="sh-table">
                <thead>
                  <tr>
                    <th className="sh-th sh-sticky-left sh-col-index">
                      <div className="sh-th-inner">
                        <ListOrdered size={12} className="sh-th-icon" />
                        <span>#</span>
                      </div>
                    </th>
                    <th className="sh-th" style={{ minWidth: 260 }}>Shade</th>
                    <th className="sh-th" style={{ minWidth: 140 }}>EBS ID</th>
                    <th className="sh-th" style={{ minWidth: 150 }}>Created Time</th>
                    <th className="sh-th sh-th-center" style={{ minWidth: 110 }}>Status</th>
                    <th className="sh-th sh-th-right sh-sticky-right" style={{ minWidth: 100 }}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {visibleRows.length === 0 ? (
                    <tr className="sh-empty-row">
                      <td colSpan={6} className="sh-empty">
                        <div className="sh-empty-inner">
                          <div className="sh-empty-icon">
                            <Database size={20} />
                          </div>
                          <p>No shades found</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    visibleRows.map((shade, index) => {
                      const created = formatCreated(shade.createdAt);
                      const isActive = shade.status !== 'inactive';
                      return (
                        <tr key={shade.id}>
                          <td className="sh-td sh-sticky-left sh-col-index">
                            <span className="sh-index">{pad(start + index + 1)}</span>
                          </td>

                          <td className="sh-td">
                            <div className="sh-shade">
                              <div className="sh-shade-icon">
                                <Palette size={16} />
                              </div>
                              <span className="sh-shade-name">{shade.name}</span>
                            </div>
                          </td>

                          <td className="sh-td sh-td-muted">{shade.ebsId || '—'}</td>

                          <td className="sh-td">
                            {created ? (
                              <div className="sh-date">
                                <div className="sh-date-day">{created.day}</div>
                                <div className="sh-date-time">{created.time}</div>
                              </div>
                            ) : (
                              '—'
                            )}
                          </td>

                          <td className="sh-td sh-td-center">
                            <span className={`sh-badge ${isActive ? 'sh-badge-active' : 'sh-badge-inactive'}`}>
                              {isActive ? <Check size={12} /> : <X size={12} />}
                              {isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>

                          <td className="sh-td sh-td-right sh-sticky-right">
                            <div className="sh-actions">
                              <button
                                type="button"
                                className="sh-icon-btn sh-icon-edit"
                                title="Edit"
                                aria-label={`Edit ${shade.name}`}
                                onClick={() => setForm({ shade })}
                              >
                                <SquarePen size={20} />
                              </button>
                              <button
                                type="button"
                                className="sh-icon-btn sh-icon-delete"
                                title="Delete"
                                aria-label={`Delete ${shade.name}`}
                                onClick={() => setShadeToDelete(shade)}
                              >
                                <Trash2 size={20} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* footer: "Showing 1–10 of 50 shades" + page buttons */}
            <div className="sh-footer">
              <div className="sh-showing">
                Showing <strong className="sh-strong">{from}–{to}</strong> of{' '}
                <strong className="sh-strong">{total}</strong> shades
              </div>

              <div className="sh-pager">
                <button
                  type="button"
                  className="sh-nav-btn"
                  disabled={currentPage === 1}
                  onClick={() => setPage(currentPage - 1)}
                >
                  <ChevronLeft size={12} />
                  <span className="sh-nav-text">Previous</span>
                </button>

                {getPageItems(currentPage, totalPages).map((item) =>
                  typeof item === 'number' ? (
                    <button
                      type="button"
                      key={item}
                      className={`sh-page-btn${item === currentPage ? ' is-active' : ''}`}
                      aria-current={item === currentPage ? 'page' : undefined}
                      onClick={() => setPage(item)}
                    >
                      {item}
                    </button>
                  ) : (
                    <span className="sh-gap" key={item}>…</span>
                  )
                )}

                <button
                  type="button"
                  className="sh-nav-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setPage(currentPage + 1)}
                >
                  <span className="sh-nav-text">Next</span>
                  <ChevronRight size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {form && (
        <ShadeFormModal
          shade={form.shade}
          existingShades={items}
          onSave={handleSave}
          onClose={closeForm}
        />
      )}

      {shadeToDelete && (
        <ConfirmDialog
          title="Delete shade?"
          message={`Are you sure you want to delete "${shadeToDelete.name}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={cancelDelete}
        />
      )}

      <div className={`sh-toast${toast.visible ? '' : ' sh-toast-hidden'}`} role="status" aria-live="polite">
        <CircleCheck size={16} />
        <span>{toast.message}</span>
      </div>
    </>
  );
}
