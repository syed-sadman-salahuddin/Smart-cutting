import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BadgePlus,
  Building2,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  ClipboardList,
  Eye,
  FileInput,
  Funnel,
  Handshake,
  Link2,
  ListOrdered,
  RotateCcw,
  Search,
  SquarePen,
  Trash2,
  X,
} from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import ConfirmDialog from '../components/ConfirmDialog';
import CuttingPOFormModal from '../components/cuttingPO/CuttingPOFormModal';
import CuttingPODetailsModal from '../components/cuttingPO/CuttingPODetailsModal';
import CuttingPOImportModal from '../components/cuttingPO/CuttingPOImportModal';
import { KEYS } from '../services/storage';
import { useCollection } from '../hooks/useCollection';
import {
  CUTTING_PO_PAGE_SIZES,
  COMPANIES,
  BUYERS,
  REFERENCES,
} from '../data/cuttingPOData';
import '../styles/cutting-po.css';

function getPageItems(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, 4, 'end-gap', total];
  if (current >= total - 2) return [1, 'start-gap', total - 3, total - 2, total - 1, total];
  return [1, 'start-gap', current - 1, current, current + 1, 'end-gap', total];
}

function formatDateDisplay(dateStr) {
  if (!dateStr) return '—';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

/* Custom Dropdown for Filter (Company, Buyer, Reference) */
function FilterSelectDropdown({
  label,
  icon: Icon,
  placeholder,
  value,
  options,
  onChange,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) {
      setSearch('');
      return undefined;
    }
    const onClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
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

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    const term = search.toLowerCase();
    return options.filter((opt) => opt.toLowerCase().includes(term));
  }, [options, search]);

  return (
    <div className="cpo-filter-field" ref={wrapRef}>
      <label className="cpo-filter-label">{label}</label>
      <div className="cpo-select-wrap">
        <Icon size={16} className="cpo-field-icon" />
        <button
          type="button"
          className={`cpo-dropdown-btn ${value ? 'has-value' : 'is-placeholder'} ${open ? 'is-open' : ''}`}
          onClick={() => setOpen((prev) => !prev)}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className="truncate">{value || placeholder}</span>
          <ChevronDown size={14} className={`cpo-dropdown-chevron ${open ? 'is-open' : ''}`} />
        </button>

        {open && (
          <div className="cpo-dropdown-menu" role="listbox">
            {options.length > 8 && (
              <div className="cpo-dropdown-search">
                <input
                  type="text"
                  className="cpo-dropdown-search-input"
                  placeholder={`Search ${label.toLowerCase()}...`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                />
              </div>
            )}

            <button
              type="button"
              className={`cpo-dropdown-item ${!value ? 'is-selected' : ''}`}
              onClick={() => {
                onChange('');
                setOpen(false);
              }}
            >
              <span>{placeholder}</span>
              {!value && <Check size={14} color="var(--color-primary)" />}
            </button>

            {filteredOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`cpo-dropdown-item ${value === opt ? 'is-selected' : ''}`}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
              >
                <span className="truncate">{opt}</span>
                {value === opt && <Check size={14} color="var(--color-primary)" />}
              </button>
            ))}

            {filteredOptions.length === 0 && (
              <div style={{ padding: '8px 12px', fontSize: '12px', color: '#9ca3af', textAlign: 'center' }}>
                No options found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CuttingPO() {
  const { items, add, update, remove } = useCollection(KEYS.cuttingPOs);

  // Filter mode toggle (true by default as in screenshot)
  const [filterMode, setFilterMode] = useState(true);

  // Active filter state
  const [filterCompany, setFilterCompany] = useState('');
  const [filterBuyer, setFilterBuyer] = useState('');
  const [filterReference, setFilterReference] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  // Applied filter state (filters applied when Filter button clicked or updated)
  const [appliedFilters, setAppliedFilters] = useState({
    company: '',
    buyer: '',
    reference: '',
    dateFrom: '',
    dateTo: '',
  });

  // Table search & pagination
  const [query, setQuery] = useState('');
  const [pageSize, setPageSize] = useState(CUTTING_PO_PAGE_SIZES[0]);
  const [page, setPage] = useState(1);
  const [pageSizeOpen, setPageSizeOpen] = useState(false);
  const pageSizeRef = useRef(null);

  // Modals state
  const [formModal, setFormModal] = useState(null); // { mode: 'add' | 'edit', item: null | item }
  const [detailsModal, setDetailsModal] = useState(null); // item
  const [importModal, setImportModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Toast state
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

  // Close page-size dropdown on outside click
  useEffect(() => {
    if (!pageSizeOpen) return undefined;
    const onClickOutside = (e) => {
      if (pageSizeRef.current && !pageSizeRef.current.contains(e.target)) {
        setPageSizeOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [pageSizeOpen]);

  // Handle Apply Filter
  const handleApplyFilter = () => {
    setAppliedFilters({
      company: filterCompany,
      buyer: filterBuyer,
      reference: filterReference,
      dateFrom: filterDateFrom,
      dateTo: filterDateTo,
    });
    setPage(1);
  };

  // Handle Reset Filter
  const handleResetFilter = () => {
    setFilterCompany('');
    setFilterBuyer('');
    setFilterReference('');
    setFilterDateFrom('');
    setFilterDateTo('');
    setAppliedFilters({
      company: '',
      buyer: '',
      reference: '',
      dateFrom: '',
      dateTo: '',
    });
    setPage(1);
  };

  // Filtered rows
  const rows = useMemo(() => {
    const text = query.trim().toLowerCase();

    return items.filter((row) => {
      // Search query across PO No, Reference, Buyer, Company
      if (text) {
        const matchPo = (row.poNo || '').toLowerCase().includes(text);
        const matchRef = (row.reference || '').toLowerCase().includes(text);
        const matchBuyer = (row.buyer || '').toLowerCase().includes(text);
        const matchComp = (row.company || '').toLowerCase().includes(text);
        if (!matchPo && !matchRef && !matchBuyer && !matchComp) return false;
      }

      // Dropdown filters
      if (appliedFilters.company && row.company !== appliedFilters.company) {
        return false;
      }
      if (appliedFilters.buyer && row.buyer !== appliedFilters.buyer) {
        return false;
      }
      if (appliedFilters.reference && row.reference !== appliedFilters.reference) {
        return false;
      }

      // Date range filtering (against confirmationDate)
      if (appliedFilters.dateFrom && row.confirmationDate) {
        if (row.confirmationDate < appliedFilters.dateFrom) return false;
      }
      if (appliedFilters.dateTo && row.confirmationDate) {
        if (row.confirmationDate > appliedFilters.dateTo) return false;
      }

      return true;
    });
  }, [items, query, appliedFilters]);

  // Pagination calculations
  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const visibleRows = rows.slice(start, start + pageSize);
  const from = total === 0 ? 0 : start + 1;
  const to = start + visibleRows.length;

  const handleSavePO = (values) => {
    if (formModal?.item) {
      update(formModal.item.id, values);
      showToast('Cutting PO updated successfully.');
    } else {
      add(values);
      showToast('Cutting PO added successfully.');
    }
    setFormModal(null);
  };

  const handleDeletePO = () => {
    if (itemToDelete) {
      remove(itemToDelete.id);
      showToast('Cutting PO deleted successfully.');
    }
    setItemToDelete(null);
  };

  const handleImportCompleted = (fileName) => {
    setImportModal(false);
    showToast(`File "${fileName}" imported successfully.`);
  };

  return (
    <>
      <Breadcrumb label="Cutting POs" icon={ClipboardList} />

      <div className="pt-main-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
        <div className="cpo-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Card Header / Banner */}
          <div className="cpo-banner">
            <div className="cpo-banner-left">
              <div className="cpo-banner-icon">
                <ClipboardList size={18} />
              </div>
              <h1 className="cpo-banner-title">Cutting POs</h1>
            </div>

            <div className="cpo-banner-actions">
              {/* Filter Mode switch */}
              <div className="cpo-filter-mode-wrap">
                <span className="cpo-filter-mode-label">Filter Mode</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={filterMode}
                  className={`cpo-switch ${filterMode ? 'is-active' : ''}`}
                  onClick={() => setFilterMode((prev) => !prev)}
                  title="Toggle filter section"
                >
                  <span className="cpo-switch-thumb">
                    {filterMode && <Check size={10} className="cpo-switch-icon" />}
                  </span>
                </button>
              </div>

              {/* Import button */}
              <button
                type="button"
                className="cpo-btn cpo-btn-outline"
                onClick={() => setImportModal(true)}
              >
                <FileInput size={16} />
                <span>Import</span>
              </button>

              {/* Add Cutting PO button */}
              <button
                type="button"
                className="cpo-btn cpo-btn-primary"
                onClick={() => setFormModal({ mode: 'add', item: null })}
              >
                <BadgePlus size={16} />
                <span>Add Cutting PO</span>
              </button>
            </div>
          </div>

          <div className="cpo-body">
            {/* Filter Section Card (Collapsible via Filter Mode switch) */}
            {filterMode && (
              <div className="cpo-filter-card">
                <div className="cpo-filter-head">
                  <h2 className="cpo-filter-title">
                    <Funnel size={16} className="cpo-filter-icon" />
                    <span>Filter Cutting POs</span>
                  </h2>
                </div>

                <div className="cpo-filter-body">
                  <div className="cpo-filter-grid">
                    {/* 1. Company dropdown */}
                    <FilterSelectDropdown
                      label="Company"
                      icon={Building2}
                      placeholder="All companies"
                      value={filterCompany}
                      options={COMPANIES}
                      onChange={setFilterCompany}
                    />

                    {/* 2. Buyer dropdown */}
                    <FilterSelectDropdown
                      label="Buyer"
                      icon={Handshake}
                      placeholder="All buyers"
                      value={filterBuyer}
                      options={BUYERS}
                      onChange={setFilterBuyer}
                    />

                    {/* 3. Reference dropdown */}
                    <FilterSelectDropdown
                      label="Reference"
                      icon={Link2}
                      placeholder="All references"
                      value={filterReference}
                      options={REFERENCES}
                      onChange={setFilterReference}
                    />

                    {/* 4. Date From */}
                    <div className="cpo-filter-field">
                      <label className="cpo-filter-label" htmlFor="filter-date-from">Date From</label>
                      <div className="cpo-select-wrap">
                        <Calendar size={16} className="cpo-field-icon" />
                        <input
                          id="filter-date-from"
                          type="date"
                          className="cpo-date-input"
                          value={filterDateFrom}
                          onChange={(e) => setFilterDateFrom(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* 5. Date To */}
                    <div className="cpo-filter-field">
                      <label className="cpo-filter-label" htmlFor="filter-date-to">Date To</label>
                      <div className="cpo-select-wrap">
                        <Calendar size={16} className="cpo-field-icon" />
                        <input
                          id="filter-date-to"
                          type="date"
                          className="cpo-date-input"
                          value={filterDateTo}
                          onChange={(e) => setFilterDateTo(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Filter action buttons: Reset & Filter */}
                  <div className="cpo-filter-actions">
                    <button
                      type="button"
                      className="cpo-btn cpo-btn-ghost"
                      onClick={handleResetFilter}
                    >
                      <RotateCcw size={14} />
                      <span>Reset</span>
                    </button>
                    <button
                      type="button"
                      className="cpo-btn cpo-btn-outline"
                      onClick={handleApplyFilter}
                    >
                      <Funnel size={14} />
                      <span>Filter</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Table Container */}
            <div className="cpo-panel">
              {/* Search + Show count */}
              <div className="cpo-toolbar">
                <div className="cpo-search">
                  <Search size={16} className="cpo-search-icon" />
                  <input
                    type="text"
                    className="cpo-search-input"
                    placeholder="Search by PO No, Our Reference, Buyer..."
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setPage(1);
                    }}
                  />
                </div>

                <div className="cpo-show">
                  <span className="cpo-show-label">Show</span>
                  <div className="cpo-select-wrap" ref={pageSizeRef} style={{ width: 'auto' }}>
                    <button
                      type="button"
                      className="cpo-dropdown-btn"
                      style={{ paddingLeft: '12px', minWidth: '72px' }}
                      onClick={() => setPageSizeOpen((p) => !p)}
                    >
                      <span>{pageSize}</span>
                      <ChevronDown size={12} className={`cpo-dropdown-chevron ${pageSizeOpen ? 'is-open' : ''}`} />
                    </button>

                    {pageSizeOpen && (
                      <div className="cpo-dropdown-menu" style={{ minWidth: '80px', right: 0, left: 'auto' }}>
                        {CUTTING_PO_PAGE_SIZES.map((size) => (
                          <button
                            key={size}
                            type="button"
                            className={`cpo-dropdown-item ${pageSize === size ? 'is-selected' : ''}`}
                            onClick={() => {
                              setPageSize(size);
                              setPage(1);
                              setPageSizeOpen(false);
                            }}
                          >
                            <span>{size}</span>
                            {pageSize === size && <Check size={12} color="var(--color-primary)" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="cpo-scroll">
                <table className="cpo-table">
                  <thead>
                    <tr>
                      <th className="cpo-th cpo-sticky-left" style={{ width: '64px' }}>
                        <div className="cpo-th-inner">
                          <ListOrdered size={14} style={{ opacity: 0.6 }} />
                          <span>#</span>
                        </div>
                      </th>
                      <th className="cpo-th" style={{ minWidth: '280px' }}>
                        <div className="cpo-th-inner">
                          <span>PO NO / BUYER / REFERENCE</span>
                        </div>
                      </th>
                      <th className="cpo-th" style={{ minWidth: '160px' }}>
                        <div className="cpo-th-inner">
                          <span>COMPANY</span>
                        </div>
                      </th>
                      <th className="cpo-th" style={{ minWidth: '100px' }}>
                        <div className="cpo-th-inner">
                          <span>TYPE</span>
                        </div>
                      </th>
                      <th className="cpo-th" style={{ minWidth: '140px' }}>
                        <div className="cpo-th-inner">
                          <span>QUANTITY</span>
                        </div>
                      </th>
                      <th className="cpo-th" style={{ minWidth: '130px' }}>
                        <div className="cpo-th-inner">
                          <span>CONFIRMATION</span>
                        </div>
                      </th>
                      <th className="cpo-th" style={{ minWidth: '130px' }}>
                        <div className="cpo-th-inner">
                          <span>SHIPMENT</span>
                        </div>
                      </th>
                      <th className="cpo-th cpo-th-center" style={{ minWidth: '100px' }}>
                        <div className="cpo-th-inner">
                          <span>STATUS</span>
                        </div>
                      </th>
                      <th className="cpo-th cpo-th-right cpo-sticky-right" style={{ minWidth: '120px' }}>
                        <div className="cpo-th-inner">
                          <span>ACTIONS</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleRows.length === 0 ? (
                      <tr>
                        <td colSpan={9} style={{ padding: '48px 16px', textAlign: 'center', color: '#6b7280' }}>
                          <ClipboardList size={32} style={{ margin: '0 auto 8px auto', opacity: 0.4 }} />
                          <p style={{ fontWeight: '500' }}>No cutting POs found</p>
                          <p style={{ fontSize: '12px', color: '#9ca3af' }}>Try adjusting your search or filters</p>
                        </td>
                      </tr>
                    ) : (
                      visibleRows.map((row, index) => {
                        const globalIndex = start + index + 1;
                        const indexStr = String(globalIndex).padStart(2, '0');
                        const isBottom = row.type?.toLowerCase() === 'bottom';

                        return (
                          <tr key={row.id}>
                            {/* # Index Column */}
                            <td className="cpo-td cpo-sticky-left">
                              <span className="cpo-index">{indexStr}</span>
                            </td>

                            {/* PO NO / BUYER / REFERENCE */}
                            <td className="cpo-td">
                              <div className="cpo-entity">
                                <div className="cpo-entity-icon">
                                  <ClipboardList size={18} />
                                </div>
                                <div className="cpo-entity-details">
                                  <span className="cpo-entity-po">{row.poNo}</span>
                                  <span className="cpo-entity-sub">
                                    {row.buyer} · {row.reference}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* COMPANY */}
                            <td className="cpo-td">
                              <span>{row.company}</span>
                            </td>

                            {/* TYPE */}
                            <td className="cpo-td">
                              <span className={`cpo-type-badge cpo-type-${isBottom ? 'bottom' : 'top'}`}>
                                {row.type || 'Top'}
                              </span>
                            </td>

                            {/* QUANTITY */}
                            <td className="cpo-td">
                              <span className="cpo-quantity">
                                {Number(row.quantity).toLocaleString()}
                                <span className="cpo-rows-count">({row.rows} rows)</span>
                              </span>
                            </td>

                            {/* CONFIRMATION */}
                            <td className="cpo-td">
                              <span style={{ whiteSpace: 'nowrap' }}>
                                {formatDateDisplay(row.confirmationDate)}
                              </span>
                            </td>

                            {/* SHIPMENT */}
                            <td className="cpo-td">
                              <span style={{ whiteSpace: 'nowrap' }}>
                                {formatDateDisplay(row.shipmentDate)}
                              </span>
                            </td>

                            {/* STATUS */}
                            <td className="cpo-td cpo-td-center">
                              <span className={`cpo-badge cpo-badge-${row.status === 'active' ? 'active' : 'inactive'}`}>
                                {row.status === 'active' && <Check size={12} />}
                                <span>{row.status === 'active' ? 'Active' : 'Inactive'}</span>
                              </span>
                            </td>

                            {/* ACTIONS */}
                            <td className="cpo-td cpo-td-right cpo-sticky-right">
                              <div className="cpo-actions">
                                <button
                                  type="button"
                                  className="cpo-action-btn cpo-action-view"
                                  title="View Details"
                                  onClick={() => setDetailsModal(row)}
                                >
                                  <Eye size={18} />
                                </button>
                                <button
                                  type="button"
                                  className="cpo-action-btn cpo-action-edit"
                                  title="Edit"
                                  onClick={() => setFormModal({ mode: 'edit', item: row })}
                                >
                                  <SquarePen size={18} />
                                </button>
                                <button
                                  type="button"
                                  className="cpo-action-btn cpo-action-delete"
                                  title="Delete"
                                  onClick={() => setItemToDelete(row)}
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

              {/* Pagination Footer */}
              <div className="cpo-footer">
                <div className="cpo-showing">
                  Showing <strong>{from}–{to}</strong> of <strong>{total}</strong> cutting POs
                </div>

                <div className="cpo-pager">
                  <button
                    type="button"
                    className="cpo-nav-btn"
                    disabled={currentPage <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronLeft size={14} />
                    <span>Previous</span>
                  </button>

                  {getPageItems(currentPage, totalPages).map((item, idx) => {
                    if (item === 'start-gap' || item === 'end-gap') {
                      return (
                        <span key={`gap-${idx}`} className="cpo-page-gap">
                          ...
                        </span>
                      );
                    }
                    return (
                      <button
                        key={item}
                        type="button"
                        className={`cpo-page-btn ${currentPage === item ? 'is-active' : ''}`}
                        onClick={() => setPage(item)}
                      >
                        {item}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    className="cpo-nav-btn"
                    disabled={currentPage >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    <span>Next</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Form Modal */}
      {formModal && (
        <CuttingPOFormModal
          item={formModal.item}
          existingItems={items}
          onSave={handleSavePO}
          onClose={() => setFormModal(null)}
        />
      )}

      {/* Details Modal */}
      {detailsModal && (
        <CuttingPODetailsModal
          item={detailsModal}
          onClose={() => setDetailsModal(null)}
        />
      )}

      {/* Import Modal */}
      {importModal && (
        <CuttingPOImportModal
          onImport={handleImportCompleted}
          onClose={() => setImportModal(false)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {itemToDelete && (
        <ConfirmDialog
          title="Delete Cutting PO"
          message={`Are you sure you want to delete Cutting PO "${itemToDelete.poNo}"? This action cannot be undone.`}
          confirmLabel="Delete PO"
          onConfirm={handleDeletePO}
          onCancel={() => setItemToDelete(null)}
        />
      )}

      {/* Toast Notification */}
      {toast.visible && (
        <div className="cpo-toast">
          <CircleCheck size={18} color="#22c55e" />
          <span>{toast.message}</span>
        </div>
      )}
    </>
  );
}
