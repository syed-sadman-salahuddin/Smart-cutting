import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BadgePlus,
  Building2,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Database,
  ListOrdered,
  Network,
  Search,
  SquarePen,
  Trash2,
  X,
} from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import ConfirmDialog from '../components/ConfirmDialog';
import DepartmentFormModal from '../components/departments/DepartmentFormModal';
import { byDepartmentName, DEPARTMENTS_PAGE_SIZES } from '../data/departmentsData';
import { useCollection } from '../hooks/useCollection';
import { KEYS } from '../services/storage';
import '../styles/departments.css';
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
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);
  if (current <= 3) return [1, 2, 3, 4, 'end-gap', total];
  if (current >= total - 2) return [1, 'start-gap', total - 3, total - 2, total - 1, total];
  return [1, 'start-gap', current - 1, current, current + 1, 'end-gap', total];
}

function PageSizeSelect({ value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onClickOutside = (event) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) setOpen(false);
    };
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="po-select" ref={wrapRef}>
      <button
        type="button"
        className="po-select-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Rows per page"
        onClick={() => setOpen((previous) => !previous)}
      >
        <span>{value}</span>
        <ChevronDown size={12} className={`po-select-chevron${open ? ' is-open' : ''}`} />
      </button>
      {open && (
        <ul className="po-select-menu" role="listbox">
          {options.map((size) => (
            <li key={size} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={size === value}
                className={`po-select-option${size === value ? ' is-active' : ''}`}
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

export default function Departments() {
  const { items, add, update, remove } = useCollection(KEYS.departments);
  const [query, setQuery] = useState('');
  const [pageSize, setPageSize] = useState(DEPARTMENTS_PAGE_SIZES[0]);
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(null);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '' });
  const toastTimer = useRef(null);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const showToast = (message) => {
    setToast({ visible: true, message });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast((previous) => ({ ...previous, visible: false })), 3000);
  };

  const closeForm = useCallback(() => setForm(null), []);
  const cancelDelete = useCallback(() => setDepartmentToDelete(null), []);

  const rows = useMemo(() => {
    const text = query.trim().toLowerCase();
    return items
      .filter(
        (department) =>
          !text ||
          department.name.toLowerCase().includes(text) ||
          String(department.description || '').toLowerCase().includes(text)
      )
      .sort(byDepartmentName);
  }, [items, query]);

  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const visibleRows = rows.slice(start, start + pageSize);
  const from = total === 0 ? 0 : start + 1;
  const to = start + visibleRows.length;

  const handleSave = (values) => {
    if (form?.department) {
      update(form.department.id, values);
      showToast('Department updated successfully.');
    } else {
      const created = add(values);
      const position = [...items, created].sort(byDepartmentName).findIndex((item) => item.id === created.id);
      setQuery('');
      setPage(Math.floor(position / pageSize) + 1);
      showToast('Department added successfully.');
    }
    setForm(null);
  };

  const handleDelete = () => {
    if (departmentToDelete) {
      remove(departmentToDelete.id);
      showToast('Department deleted.');
    }
    setDepartmentToDelete(null);
  };

  return (
    <>
      <Breadcrumb label="Departments" icon={Network} />
      <div className="card-shell">
        <div className="po-banner">
          <div className="po-banner-left">
            <div className="po-banner-icon"><Network size={20} /></div>
            <h1 className="po-banner-title">Departments</h1>
          </div>
          <button type="button" className="po-add-btn" onClick={() => setForm({ department: null })}>
            <BadgePlus size={16} />
            <span>Add Department</span>
          </button>
        </div>

        <div className="po-body">
          <div className="po-panel">
            <div className="po-toolbar">
              <div className="po-search">
                <span className="po-search-icon"><Search size={16} /></span>
                <input
                  type="text"
                  className="po-search-input"
                  placeholder="Search departments..."
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setPage(1);
                  }}
                />
              </div>
              <div className="po-show">
                <span className="po-show-label">Show</span>
                <PageSizeSelect
                  value={pageSize}
                  options={DEPARTMENTS_PAGE_SIZES}
                  onChange={(size) => {
                    setPageSize(size);
                    setPage(1);
                  }}
                />
              </div>
            </div>

            <div className="po-scroll">
              <table className="po-table">
                <thead>
                  <tr>
                    <th className="po-th po-sticky-left po-col-index">
                      <div className="po-th-inner"><ListOrdered size={12} className="po-th-icon" /><span>#</span></div>
                    </th>
                    <th className="po-th" style={{ minWidth: 260 }}>Department</th>
                    <th className="po-th" style={{ minWidth: 240 }}>Description</th>
                    <th className="po-th" style={{ minWidth: 160 }}>Created Time</th>
                    <th className="po-th po-th-center" style={{ minWidth: 110 }}>Status</th>
                    <th className="po-th po-th-right po-sticky-right" style={{ minWidth: 100 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.length === 0 ? (
                    <tr className="po-empty-row">
                      <td colSpan={6} className="po-empty">
                        <div className="po-empty-inner">
                          <div className="po-empty-icon"><Database size={20} /></div>
                          <p>No departments found</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    visibleRows.map((department, index) => {
                      const created = formatCreated(department.createdAt);
                      const isActive = department.status !== 'inactive';
                      return (
                        <tr key={department.id}>
                          <td className="po-td po-sticky-left po-col-index">
                            <span className="po-index">{pad(start + index + 1)}</span>
                          </td>
                          <td className="po-td">
                            <div className="po-entity">
                              <div className="po-entity-icon"><Building2 size={16} /></div>
                              <span className="po-entity-name">{department.name}</span>
                            </div>
                          </td>
                          <td className="po-td po-td-muted">{department.description || '—'}</td>
                          <td className="po-td">
                            {created ? (
                              <div>
                                <div className="po-date-day">{created.day}</div>
                                <div className="po-date-time">{created.time}</div>
                              </div>
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
                              <button
                                type="button"
                                className="po-icon-btn po-icon-edit"
                                title="Edit"
                                aria-label={`Edit ${department.name}`}
                                onClick={() => setForm({ department })}
                              >
                                <SquarePen size={20} />
                              </button>
                              <button
                                type="button"
                                className="po-icon-btn po-icon-delete"
                                title="Delete"
                                aria-label={`Delete ${department.name}`}
                                onClick={() => setDepartmentToDelete(department)}
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

            <div className="po-footer">
              <div className="po-showing">
                Showing <strong className="po-strong">{from}–{to}</strong> of{' '}
                <strong className="po-strong">{total}</strong> departments
              </div>
              <div className="po-pager">
                <button
                  type="button"
                  className="po-nav-btn"
                  disabled={currentPage === 1}
                  onClick={() => setPage(currentPage - 1)}
                >
                  <ChevronLeft size={12} /><span className="po-nav-text">Previous</span>
                </button>
                {getPageItems(currentPage, totalPages).map((item) =>
                  typeof item === 'number' ? (
                    <button
                      key={item}
                      type="button"
                      className={`po-page-btn${item === currentPage ? ' is-active' : ''}`}
                      aria-current={item === currentPage ? 'page' : undefined}
                      onClick={() => setPage(item)}
                    >
                      {item}
                    </button>
                  ) : <span key={item} className="po-gap">…</span>
                )}
                <button
                  type="button"
                  className="po-nav-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setPage(currentPage + 1)}
                >
                  <span className="po-nav-text">Next</span><ChevronRight size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {form && (
        <DepartmentFormModal
          department={form.department}
          existingDepartments={items}
          onSave={handleSave}
          onClose={closeForm}
        />
      )}
      {departmentToDelete && (
        <ConfirmDialog
          title="Delete department?"
          message={`Are you sure you want to delete "${departmentToDelete.name}"? This action cannot be undone.`}
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
