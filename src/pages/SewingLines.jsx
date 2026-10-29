import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BadgePlus,
  Building2,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  ListOrdered,
  Search,
  SquarePen,
  Trash2,
  Workflow,
  X,
} from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import ConfirmDialog from '../components/ConfirmDialog';
import SewingLineDetailsModal from '../components/sewingLines/SewingLineDetailsModal';
import { SEWING_LINES_PAGE_SIZES, byLineName } from '../data/sewingLinesData';
import { useCollection } from '../hooks/useCollection';
import { KEYS } from '../services/storage';
import '../styles/cutting-tables.css';

const pad = (value) => String(value).padStart(2, '0');

function formatCreated(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { day: '—', time: '' };
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
    <div className="ct-select-wrap" ref={wrapRef}>
      <button
        type="button"
        className="ct-select-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Rows per page"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{value}</span>
        <ChevronDown size={12} className={`fa-solid fa-chevron-down ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul className="ct-select-menu" role="listbox">
          {options.map((size) => (
            <li key={size} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={size === value}
                className={`ct-select-option ${size === value ? 'is-active' : ''}`}
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

export default function SewingLines() {
  const navigate = useNavigate();
  const { items, remove } = useCollection(KEYS.sewingLines);

  const [query, setQuery] = useState('');
  const [pageSize, setPageSize] = useState(SEWING_LINES_PAGE_SIZES[0]);
  const [page, setPage] = useState(1);

  const [viewingLine, setViewingLine] = useState(null);
  const [lineToDelete, setLineToDelete] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '' });
  const toastTimer = useRef(null);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const showToast = (message) => {
    setToast({ visible: true, message });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => {
      setToast({ visible: false, message: '' });
    }, 3000);
  };

  // Filter & sort
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const sorted = [...items].sort(byLineName);
    if (!q) return sorted;
    return sorted.filter((item) => {
      const nameMatch = item.name?.toLowerCase().includes(q);
      const ebsMatch = item.ebsId?.toLowerCase().includes(q);
      const compMatch = (item.companies || []).some((c) =>
        c.toLowerCase().includes(q)
      );
      return nameMatch || ebsMatch || compMatch;
    });
  }, [items, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const startIndex = filtered.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, filtered.length);

  const handleConfirmDelete = () => {
    if (!lineToDelete) return;
    remove(lineToDelete.id);
    showToast(`Sewing line "${lineToDelete.name}" deleted successfully.`);
    setLineToDelete(null);
  };

  return (
    <div className="ct-page">
      <Breadcrumb label="Sewing Lines" icon={Workflow} />

      <div className="ct-shell">
        {/* Banner */}
        <div className="ct-banner">
          <div className="ct-banner-title-wrap">
            <div className="ct-banner-icon">
              <Workflow size={20} />
            </div>
            <h4 className="ct-banner-title">
              <span>Sewing Lines</span>
            </h4>
          </div>

          <button
            type="button"
            className="ct-add-btn"
            onClick={() => navigate('/general/line/create')}
          >
            <BadgePlus size={16} />
            <span>Add Line</span>
          </button>
        </div>

        {/* Content body */}
        <div className="ct-body">
          <div className="ct-panel">
            {/* Toolbar */}
            <div className="ct-toolbar">
              <div className="ct-toolbar-inner">
                <div className="ct-search-box">
                  <Search size={16} className="ct-search-icon" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Search lines..."
                    className="ct-search-input"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        background: 'transparent',
                        border: 'none',
                        color: '#9ca3af',
                        cursor: 'pointer',
                      }}
                      title="Clear search"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div className="ct-show-wrap">
                  <span className="ct-show-label">Show</span>
                  <PageSizeSelect
                    value={pageSize}
                    options={SEWING_LINES_PAGE_SIZES}
                    onChange={(size) => {
                      setPageSize(size);
                      setPage(1);
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="ct-table-scroll">
              <table className="ct-table">
                <thead>
                  <tr className="ct-thead-tr">
                    <th className="ct-th ct-th-sticky-left" style={{ width: '64px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ListOrdered size={12} style={{ opacity: 0.6 }} />
                        <span>#</span>
                      </div>
                    </th>
                    <th className="ct-th" style={{ minWidth: '220px' }}>
                      Line
                    </th>
                    <th className="ct-th" style={{ minWidth: '120px' }}>
                      EBS ID
                    </th>
                    <th className="ct-th" style={{ minWidth: '260px' }}>
                      Companies
                    </th>
                    <th className="ct-th" style={{ minWidth: '150px' }}>
                      Created Time
                    </th>
                    <th className="ct-th" style={{ minWidth: '110px', textAlign: 'center' }}>
                      Status
                    </th>
                    <th className="ct-th ct-th-sticky-right" style={{ minWidth: '100px' }}>
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {pageItems.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: '48px 20px', textAlign: 'center', color: '#9ca3af' }}>
                        No sewing lines found.
                      </td>
                    </tr>
                  ) : (
                    pageItems.map((line, idx) => {
                      const absoluteIndex = (page - 1) * pageSize + idx + 1;
                      const created = formatCreated(line.createdAt);
                      const companies = line.companies || [];

                      return (
                        <tr key={line.id} className="ct-tbody-tr">
                          {/* Row Number */}
                          <td className="ct-td ct-td-sticky-left">
                            <span className="ct-num-badge">{pad(absoluteIndex)}</span>
                          </td>

                          {/* Line Name */}
                          <td className="ct-td">
                            <div className="ct-table-cell">
                              <div className="ct-line-avatar">
                                <Workflow size={16} />
                              </div>
                              <span className="ct-table-name">{line.name}</span>
                            </div>
                          </td>

                          {/* EBS ID */}
                          <td className="ct-td">
                            <span style={{ fontSize: '14px', color: '#6b7280' }}>
                              {line.ebsId || '—'}
                            </span>
                          </td>

                          {/* Companies */}
                          <td className="ct-td">
                            <div className="ct-companies-wrap">
                              {companies.length > 0 ? (
                                companies.map((comp) => (
                                  <span key={comp} className="ct-company-badge">
                                    <Building2 size={12} style={{ marginRight: '4px' }} />
                                    {comp}
                                  </span>
                                ))
                              ) : (
                                <span style={{ color: '#9ca3af', fontSize: '13px' }}>—</span>
                              )}
                            </div>
                          </td>

                          {/* Created Time */}
                          <td className="ct-td">
                            <div>
                              <div className="ct-time-date">{created.day}</div>
                              <div className="ct-time-clock">{created.time}</div>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="ct-td" style={{ textAlign: 'center' }}>
                            {line.status === 'active' ? (
                              <span className="ct-status-badge ct-status-active">
                                <Check size={12} />
                                <span>Active</span>
                              </span>
                            ) : (
                              <span className="ct-status-badge ct-status-inactive">
                                <X size={12} />
                                <span>Inactive</span>
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="ct-td ct-td-sticky-right">
                            <div className="ct-actions-wrap">
                              <button
                                type="button"
                                className="ct-action-btn ct-btn-view"
                                title="View Details"
                                onClick={() => setViewingLine(line)}
                              >
                                <Eye size={18} />
                              </button>
                              <button
                                type="button"
                                className="ct-action-btn ct-btn-edit"
                                title="Edit"
                                onClick={() => navigate(`/general/line/edit/${line.id}`)}
                              >
                                <SquarePen size={18} />
                              </button>
                              <button
                                type="button"
                                className="ct-action-btn ct-btn-delete"
                                title="Delete"
                                onClick={() => setLineToDelete(line)}
                              >
                                <Trash2 size={18} />
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

            {/* Pagination footer */}
            <div className="ct-pagination-wrap">
              <div className="ct-showing-text">
                Showing <strong>{startIndex}–{endIndex}</strong> of{' '}
                <strong>{filtered.length}</strong> lines
              </div>

              {totalPages > 1 && (
                <nav className="ct-pagination-nav" aria-label="Pagination">
                  <button
                    type="button"
                    className="ct-page-btn"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {getPageItems(page, totalPages).map((item, index) => {
                    if (typeof item !== 'number') {
                      return (
                        <span
                          key={`gap-${index}`}
                          style={{ padding: '0 6px', color: '#9ca3af' }}
                        >
                          …
                        </span>
                      );
                    }
                    return (
                      <button
                        key={item}
                        type="button"
                        className={`ct-page-btn ${item === page ? 'is-active' : ''}`}
                        onClick={() => setPage(item)}
                      >
                        {item}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    className="ct-page-btn"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    aria-label="Next page"
                  >
                    <ChevronRight size={16} />
                  </button>
                </nav>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* View Details Modal */}
      {viewingLine && (
        <SewingLineDetailsModal
          line={viewingLine}
          onClose={() => setViewingLine(null)}
          onEdit={(l) => {
            setViewingLine(null);
            navigate(`/general/line/edit/${l.id}`);
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {lineToDelete && (
        <ConfirmDialog
          title="Delete Sewing Line"
          message={`Are you sure you want to delete ${lineToDelete.name}? This action cannot be undone.`}
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={handleConfirmDelete}
          onCancel={() => setLineToDelete(null)}
        />
      )}

      {/* Toast Notification */}
      {toast.visible && (
        <div className="ct-toast" role="alert">
          <Check size={16} style={{ color: '#10b981' }} />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
