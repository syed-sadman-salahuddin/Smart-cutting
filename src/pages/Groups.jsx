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
  Search,
  SquarePen,
  Trash2,
  UsersRound,
  X,
} from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import ConfirmDialog from '../components/ConfirmDialog';
import GroupFormModal from '../components/groups/GroupFormModal';
import { GROUPS_PAGE_SIZES, byName } from '../data/groupsData';
import { useCollection } from '../hooks/useCollection';
import { KEYS } from '../services/storage';
import '../styles/parts.css';

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
    <div className="pt-select" ref={wrapRef}>
      <button
        type="button"
        className="pt-select-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Rows per page"
        onClick={() => setOpen((previous) => !previous)}
      >
        <span>{value}</span>
        <ChevronDown size={12} className={`pt-select-chevron${open ? ' is-open' : ''}`} />
      </button>
      {open && (
        <ul className="pt-select-menu" role="listbox">
          {options.map((size) => (
            <li key={size} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={size === value}
                className={`pt-select-option${size === value ? ' is-active' : ''}`}
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

export default function Groups() {
  const { items, add, update, remove } = useCollection(KEYS.groups);
  const [query, setQuery] = useState('');
  const [pageSize, setPageSize] = useState(GROUPS_PAGE_SIZES[0]);
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(null);
  const [groupToDelete, setGroupToDelete] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '' });
  const toastTimer = useRef(null);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const showToast = (message) => {
    setToast({ visible: true, message });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast((previous) => ({ ...previous, visible: false })), 3000);
  };

  const closeForm = useCallback(() => setForm(null), []);
  const cancelDelete = useCallback(() => setGroupToDelete(null), []);

  const rows = useMemo(() => {
    const text = query.trim().toLowerCase();
    return items
      .filter(
        (group) =>
          !text ||
          group.name.toLowerCase().includes(text) ||
          String(group.ebsId || '').toLowerCase().includes(text)
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

  const handleSave = (values) => {
    if (form?.group) {
      update(form.group.id, values);
      showToast('Group updated successfully.');
    } else {
      const created = add(values);
      const position = [...items, created].sort(byName).findIndex((item) => item.id === created.id);
      setQuery('');
      setPage(Math.floor(position / pageSize) + 1);
      showToast('Group added successfully.');
    }
    setForm(null);
  };

  const handleDelete = () => {
    if (groupToDelete) {
      remove(groupToDelete.id);
      showToast('Group deleted.');
    }
    setGroupToDelete(null);
  };

  return (
    <>
      <Breadcrumb label="Cutting Ratio Groups" icon={UsersRound} />

      <div className="card-shell">
        <div className="pt-banner">
          <div className="pt-banner-left">
            <div className="pt-banner-icon">
              <UsersRound size={20} />
            </div>
            <h1 className="pt-banner-title">Cutting Ratio Groups</h1>
          </div>
          <button type="button" className="pt-add-btn" onClick={() => setForm({ group: null })}>
            <BadgePlus size={16} />
            <span>Add Group</span>
          </button>
        </div>

        <div className="pt-body">
          <div className="pt-panel">
            <div className="pt-toolbar">
              <div className="pt-search">
                <span className="pt-search-icon">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  className="pt-search-input"
                  placeholder="Search groups..."
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setPage(1);
                  }}
                />
              </div>
              <div className="pt-show">
                <span className="pt-show-label">Show</span>
                <PageSizeSelect
                  value={pageSize}
                  options={GROUPS_PAGE_SIZES}
                  onChange={(size) => {
                    setPageSize(size);
                    setPage(1);
                  }}
                />
              </div>
            </div>

            <div className="pt-scroll">
              <table className="pt-table">
                <thead>
                  <tr>
                    <th className="pt-th pt-sticky-left pt-col-index">
                      <div className="pt-th-inner">
                        <ListOrdered size={12} className="pt-th-icon" />
                        <span>#</span>
                      </div>
                    </th>
                    <th className="pt-th" style={{ minWidth: 260 }}>Group</th>
                    <th className="pt-th" style={{ minWidth: 140 }}>EBS ID</th>
                    <th className="pt-th" style={{ minWidth: 150 }}>Created Time</th>
                    <th className="pt-th pt-th-center" style={{ minWidth: 110 }}>Status</th>
                    <th className="pt-th pt-th-right pt-sticky-right" style={{ minWidth: 100 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.length === 0 ? (
                    <tr className="pt-empty-row">
                      <td colSpan={6} className="pt-empty">
                        <div className="pt-empty-inner">
                          <div className="pt-empty-icon"><Database size={20} /></div>
                          <p>No groups found</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    visibleRows.map((group, index) => {
                      const created = formatCreated(group.createdAt);
                      const isActive = group.status !== 'inactive';
                      return (
                        <tr key={group.id}>
                          <td className="pt-td pt-sticky-left pt-col-index">
                            <span className="pt-index">{pad(start + index + 1)}</span>
                          </td>
                          <td className="pt-td">
                            <div className="pt-part">
                              <div className="pt-part-icon"><UsersRound size={16} /></div>
                              <span className="pt-part-name">{group.name}</span>
                            </div>
                          </td>
                          <td className="pt-td pt-td-muted">{group.ebsId || '—'}</td>
                          <td className="pt-td">
                            {created ? (
                              <div className="pt-date">
                                <div className="pt-date-day">{created.day}</div>
                                <div className="pt-date-time">{created.time}</div>
                              </div>
                            ) : '—'}
                          </td>
                          <td className="pt-td pt-td-center">
                            <span className={`pt-badge ${isActive ? 'pt-badge-active' : 'pt-badge-inactive'}`}>
                              {isActive ? <Check size={12} /> : <X size={12} />}
                              {isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="pt-td pt-td-right pt-sticky-right">
                            <div className="pt-actions">
                              <button
                                type="button"
                                className="pt-icon-btn pt-icon-edit"
                                title="Edit"
                                aria-label={`Edit ${group.name}`}
                                onClick={() => setForm({ group })}
                              >
                                <SquarePen size={20} />
                              </button>
                              <button
                                type="button"
                                className="pt-icon-btn pt-icon-delete"
                                title="Delete"
                                aria-label={`Delete ${group.name}`}
                                onClick={() => setGroupToDelete(group)}
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

            <div className="pt-footer">
              <div className="pt-showing">
                Showing <strong className="pt-strong">{from}–{to}</strong> of{' '}
                <strong className="pt-strong">{total}</strong> groups
              </div>
              <div className="pt-pager">
                <button
                  type="button"
                  className="pt-nav-btn"
                  disabled={currentPage === 1}
                  onClick={() => setPage(currentPage - 1)}
                >
                  <ChevronLeft size={12} />
                  <span className="pt-nav-text">Previous</span>
                </button>
                {getPageItems(currentPage, totalPages).map((item) =>
                  typeof item === 'number' ? (
                    <button
                      type="button"
                      key={item}
                      className={`pt-page-btn${item === currentPage ? ' is-active' : ''}`}
                      aria-current={item === currentPage ? 'page' : undefined}
                      onClick={() => setPage(item)}
                    >
                      {item}
                    </button>
                  ) : <span className="pt-gap" key={item}>…</span>
                )}
                <button
                  type="button"
                  className="pt-nav-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setPage(currentPage + 1)}
                >
                  <span className="pt-nav-text">Next</span>
                  <ChevronRight size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {form && (
        <GroupFormModal
          group={form.group}
          existingGroups={items}
          onSave={handleSave}
          onClose={closeForm}
        />
      )}

      {groupToDelete && (
        <ConfirmDialog
          title="Delete group?"
          message={`Are you sure you want to delete "${groupToDelete.name}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={cancelDelete}
        />
      )}

      <div className={`pt-toast${toast.visible ? '' : ' pt-toast-hidden'}`} role="status" aria-live="polite">
        <CircleCheck size={16} />
        <span>{toast.message}</span>
      </div>
    </>
  );
}
