import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  BadgePlus,
  Building2,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Eye,
  FileText,
  Filter,
  Handshake,
  Home,
  Link2,
  ListOrdered,
  RotateCcw,
  Search,
  SquarePen,
  Trash2,
  X,
} from 'lucide-react';
import ConfirmDialog from '../components/ConfirmDialog';
import BundleCardDetailsModal from '../components/bundleCards/BundleCardDetailsModal';
import BundleCardEditModal from '../components/bundleCards/BundleCardEditModal';
import { useCollection } from '../hooks/useCollection';
import { KEYS } from '../services/storage';
import {
  BUNDLE_CARD_PAGE_SIZES,
  COMPANIES,
  BUYERS,
  bundleCardsSeed,
} from '../data/bundleCardsData';
import '../styles/bundle-card-list.css';

/* Barcode SVG matching the provided HTML dump */
function BarcodeIcon({ size = 20, className = '' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 5v14" />
      <path d="M8 5v14" />
      <path d="M12 5v14" />
      <path d="M17 5v14" />
      <path d="M21 5v14" />
    </svg>
  );
}

/* Custom Dropdown for Filter Inputs */
function FilterSelectDropdown({
  label,
  icon: Icon,
  placeholder,
  value,
  options = [],
  onChange,
  disabled = false,
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
    <div className="bcl-filter-field" ref={wrapRef}>
      <label className="bcl-filter-label">{label}</label>
      <div className="bcl-select-wrap">
        {Icon && <Icon size={15} className="bcl-field-icon" />}
        <button
          type="button"
          disabled={disabled}
          className={`bcl-select-btn ${value ? '' : 'is-placeholder'} ${open ? 'is-open' : ''}`}
          style={!Icon ? { paddingLeft: '12px' } : undefined}
          onClick={() => !disabled && setOpen((prev) => !prev)}
        >
          <span className="truncate">{value || placeholder}</span>
          <ChevronDown size={14} className={`bcl-select-chevron ${open ? 'is-open' : ''}`} />
        </button>

        {open && (
          <div className="bcl-dropdown-menu">
            {options.length > 7 && (
              <div className="bcl-dropdown-search">
                <input
                  type="text"
                  className="bcl-dropdown-search-input"
                  placeholder={`Search ${label.toLowerCase()}...`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                />
              </div>
            )}
            <button
              type="button"
              className={`bcl-dropdown-item ${!value ? 'is-selected' : ''}`}
              onClick={() => {
                onChange('');
                setOpen(false);
              }}
            >
              <span>{placeholder}</span>
              {!value && <Check size={14} />}
            </button>
            {filteredOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`bcl-dropdown-item ${value === opt ? 'is-selected' : ''}`}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
              >
                <span>{opt}</span>
                {value === opt && <Check size={14} />}
              </button>
            ))}
            {filteredOptions.length === 0 && (
              <div style={{ padding: '8px 10px', fontSize: '12px', color: '#9ca3af', textAlign: 'center' }}>
                No results found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function BundleCardList() {
  const navigate = useNavigate();
  const { items: rawStoredItems, update: updateBundleCard, remove: removeBundleCard, add: addBundleCard } =
    useCollection(KEYS.bundleCards);

  // Fallback to seed data if collection is empty
  const allCards = useMemo(() => {
    return rawStoredItems && rawStoredItems.length > 0 ? rawStoredItems : bundleCardsSeed;
  }, [rawStoredItems]);

  // Filter Mode toggle (default ON as in screenshot 1, or toggleable)
  const [filterMode, setFilterMode] = useState(true);

  // Filters state
  const [filterCompany, setFilterCompany] = useState('');
  const [filterBuyer, setFilterBuyer] = useState('');
  const [filterReference, setFilterReference] = useState('');
  const [filterPO, setFilterPO] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  // Search & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [showDropdownOpen, setShowDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Modals state
  const [detailsModalItem, setDetailsModalItem] = useState(null);
  const [editModalItem, setEditModalItem] = useState(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState(null);

  // Available References & POs dynamically derived from dataset
  const availableReferences = useMemo(() => {
    let list = allCards;
    if (filterBuyer) {
      list = list.filter((c) => (c.buyer || '').toLowerCase() === filterBuyer.toLowerCase());
    }
    return [...new Set(list.map((c) => c.ourReference).filter(Boolean))].sort();
  }, [allCards, filterBuyer]);

  const availablePOs = useMemo(() => {
    let list = allCards;
    if (filterReference) {
      list = list.filter((c) => c.ourReference === filterReference);
    }
    const pos = [];
    list.forEach((c) => {
      if (Array.isArray(c.pos)) pos.push(...c.pos);
      else if (c.poNo) pos.push(c.poNo);
    });
    return [...new Set(pos.filter(Boolean))].sort();
  }, [allCards, filterReference]);

  const handleResetFilters = () => {
    setFilterCompany('');
    setFilterBuyer('');
    setFilterReference('');
    setFilterPO('');
    setFilterType('');
    setFilterDateFrom('');
    setFilterDateTo('');
    setCurrentPage(1);
  };

  // Filtered dataset
  const filteredCards = useMemo(() => {
    return allCards.filter((card) => {
      // Company filter
      if (filterCompany) {
        const comp = card.company || '';
        const compCode = card.companyCode || '';
        if (
          !comp.toLowerCase().includes(filterCompany.toLowerCase()) &&
          !compCode.toLowerCase().includes(filterCompany.toLowerCase())
        ) {
          return false;
        }
      }

      // Buyer filter
      if (filterBuyer && (card.buyer || '').toLowerCase() !== filterBuyer.toLowerCase()) {
        return false;
      }

      // Reference filter
      if (filterReference && card.ourReference !== filterReference) {
        return false;
      }

      // PO filter
      if (filterPO) {
        const pos = Array.isArray(card.pos) ? card.pos : card.poNo ? [card.poNo] : [];
        if (!pos.some((p) => p.includes(filterPO))) {
          return false;
        }
      }

      // Type filter
      if (filterType) {
        if ((card.bundleType || 'Single PO').toLowerCase() !== filterType.toLowerCase()) {
          return false;
        }
      }

      // Date range filter
      if (filterDateFrom || filterDateTo) {
        const cardDateStr = card.date || '';
        // If DD/MM/YYYY format
        const parts = cardDateStr.split('/');
        let cardTime = 0;
        if (parts.length === 3) {
          cardTime = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).getTime();
        } else if (card.createdAt) {
          cardTime = new Date(card.createdAt).getTime();
        }

        if (filterDateFrom) {
          const fromTime = new Date(filterDateFrom).getTime();
          if (cardTime < fromTime) return false;
        }
        if (filterDateTo) {
          const toTime = new Date(filterDateTo).getTime() + 86400000;
          if (cardTime > toTime) return false;
        }
      }

      // Global Search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const pos = Array.isArray(card.pos) ? card.pos.join(' ') : card.poNo || '';
        const searchable = `${card.ourReference || ''} ${pos} ${card.buyer || ''} ${card.color || ''}`.toLowerCase();
        if (!searchable.includes(term)) {
          return false;
        }
      }

      return true;
    });
  }, [
    allCards,
    filterCompany,
    filterBuyer,
    filterReference,
    filterPO,
    filterType,
    filterDateFrom,
    filterDateTo,
    searchTerm,
  ]);

  // Pagination calculation
  const totalItems = filteredCards.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentCards = useMemo(() => {
    return filteredCards.slice(startIndex, endIndex);
  }, [filteredCards, startIndex, endIndex]);

  // Copy to New action
  const handleCopyCard = (card) => {
    const copyTitle = `${card.ourReference || 'Reference'} (Copy)`;
    const newRecord = {
      ...card,
      id: `bc-copy-${Date.now()}`,
      ourReference: card.ourReference,
      cutNo: (Number(card.cutNo || 1) + 1),
      nextCutNumber: (Number(card.nextCutNumber || card.cutNo || 1) + 1),
      date: new Date().toLocaleDateString('en-GB'),
      createdAt: new Date().toISOString(),
    };
    addBundleCard(newRecord);
    setNotificationMessage(`Successfully duplicated bundle card for ${card.ourReference}`);
    setTimeout(() => setNotificationMessage(null), 3000);
  };

  // Delete action
  const handleConfirmDelete = () => {
    if (!deleteConfirmItem) return;
    removeBundleCard(deleteConfirmItem.id);
    setDeleteConfirmItem(null);
    setNotificationMessage('Bundle card deleted successfully');
    setTimeout(() => setNotificationMessage(null), 3000);
  };

  return (
    <div className="bcl-page">
      {/* Toast Notification */}
      {notificationMessage && (
        <div
          style={{
            position: 'fixed',
            top: 70,
            right: 20,
            zIndex: 9999,
            backgroundColor: 'var(--color-primary)',
            color: '#ffffff',
            padding: '10px 18px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            fontSize: '14px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'bclFadeIn 0.2s ease',
          }}
        >
          <Check size={16} />
          <span>{notificationMessage}</span>
        </div>
      )}

      {/* Breadcrumb Bar */}
      <div className="bcl-breadcrumb-bar">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="bcl-breadcrumb-back"
          aria-label="Go back"
        >
          <ArrowLeft size={16} />
        </button>

        <nav aria-label="Breadcrumb" className="bcl-breadcrumb-nav">
          <ol className="bcl-breadcrumb-list">
            <li className="bcl-breadcrumb-item">
              <span className="bcl-breadcrumb-sep">
                <ChevronRight size={15} />
              </span>
              <Link to="/" className="bcl-breadcrumb-link">
                <Home size={14} />
                <span>Home</span>
              </Link>
            </li>
            <li className="bcl-breadcrumb-item">
              <span className="bcl-breadcrumb-sep">
                <ChevronRight size={15} />
              </span>
              <span className="bcl-breadcrumb-current" aria-current="page">
                <FileText size={14} />
                <span>Bundle Cards</span>
              </span>
            </li>
          </ol>
        </nav>
      </div>

      {/* Main Card */}
      <div className="bcl-card">
        {/* Banner Header */}
        <div className="bcl-banner">
          <div className="bcl-banner-row">
            {/* Title */}
            <div className="bcl-banner-title-wrap">
              <div className="bcl-banner-icon">
                <BarcodeIcon size={20} className="text-white" />
              </div>
              <h1 className="bcl-banner-title">Bundle Cards</h1>
            </div>

            {/* Actions: Filter Mode switch + Buttons */}
            <div className="bcl-banner-actions">
              <div className="bcl-filter-mode-wrap">
                <span className="bcl-filter-mode-label">Filter Mode</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={filterMode}
                  className={`bcl-switch ${filterMode ? 'is-active' : ''}`}
                  onClick={() => setFilterMode((prev) => !prev)}
                >
                  <span className="bcl-switch-thumb">
                    <span className="bcl-switch-icon">
                      {filterMode ? <Check size={10} /> : <X size={10} />}
                    </span>
                  </span>
                </button>
              </div>

              <button
                type="button"
                className="bcl-btn-primary"
                onClick={() => navigate('/cutting/bundle-card/single-po/create/')}
              >
                <BadgePlus size={16} />
                <span>Single PO</span>
              </button>

              <button
                type="button"
                className="bcl-btn-primary"
                onClick={() => navigate('/cutting/bundle-card/multi-po/create/')}
              >
                <BadgePlus size={16} />
                <span>Multi PO</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Section (Shown when Filter Mode is Active) */}
        {filterMode && (
          <div className="bcl-filter-container">
            <div className="bcl-filter-box">
              <div className="bcl-filter-header">
                <Filter size={16} className="bcl-filter-icon" />
                <span>Filter Bundle Cards</span>
              </div>

              <div className="bcl-filter-body">
                <div className="bcl-filter-grid">
                  {/* Company */}
                  <FilterSelectDropdown
                    label="Company"
                    icon={Building2}
                    placeholder="All companies"
                    value={filterCompany}
                    options={COMPANIES}
                    onChange={(val) => {
                      setFilterCompany(val);
                      setCurrentPage(1);
                    }}
                  />

                  {/* Buyer */}
                  <FilterSelectDropdown
                    label="Buyer"
                    icon={Handshake}
                    placeholder="All buyers"
                    value={filterBuyer}
                    options={BUYERS}
                    onChange={(val) => {
                      setFilterBuyer(val);
                      setFilterReference('');
                      setFilterPO('');
                      setCurrentPage(1);
                    }}
                  />

                  {/* Reference */}
                  <FilterSelectDropdown
                    label="Reference"
                    icon={Link2}
                    placeholder={filterBuyer ? 'All references' : 'Select Buyer first'}
                    value={filterReference}
                    options={availableReferences}
                    onChange={(val) => {
                      setFilterReference(val);
                      setFilterPO('');
                      setCurrentPage(1);
                    }}
                  />

                  {/* PO */}
                  <FilterSelectDropdown
                    label="PO"
                    icon={FileText}
                    placeholder={filterReference ? 'All POs' : 'Select Reference first'}
                    value={filterPO}
                    options={availablePOs}
                    onChange={(val) => {
                      setFilterPO(val);
                      setCurrentPage(1);
                    }}
                  />

                  {/* Type */}
                  <FilterSelectDropdown
                    label="Type"
                    placeholder="All types"
                    value={filterType}
                    options={['Single PO', 'Multi PO']}
                    onChange={(val) => {
                      setFilterType(val);
                      setCurrentPage(1);
                    }}
                  />

                  {/* Date From */}
                  <div className="bcl-filter-field">
                    <label className="bcl-filter-label">Date From</label>
                    <div className="bcl-select-wrap">
                      <Calendar size={15} className="bcl-field-icon" />
                      <input
                        type="date"
                        className="bcl-date-input"
                        value={filterDateFrom}
                        onChange={(e) => {
                          setFilterDateFrom(e.target.value);
                          setCurrentPage(1);
                        }}
                      />
                    </div>
                  </div>

                  {/* Date To */}
                  <div className="bcl-filter-field">
                    <label className="bcl-filter-label">Date To</label>
                    <div className="bcl-select-wrap">
                      <Calendar size={15} className="bcl-field-icon" />
                      <input
                        type="date"
                        className="bcl-date-input"
                        value={filterDateTo}
                        onChange={(e) => {
                          setFilterDateTo(e.target.value);
                          setCurrentPage(1);
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Filter Actions */}
                <div className="bcl-filter-actions">
                  <button type="button" className="bcl-btn-outline" onClick={handleResetFilters}>
                    <RotateCcw size={14} />
                    <span>Reset</span>
                  </button>
                  <button
                    type="button"
                    className="bcl-btn-primary"
                    onClick={() => setCurrentPage(1)}
                  >
                    <Filter size={14} />
                    <span>Filter</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search & Show entries Toolbar */}
        <div className="bcl-toolbar">
          <div className="bcl-search-wrap">
            <Search size={16} className="bcl-search-icon" />
            <input
              type="text"
              placeholder="Search by Our Reference, PO..."
              className="bcl-search-input"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="bcl-show-wrap">
            <span className="bcl-show-label">Show</span>
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="bcl-show-btn"
                onClick={() => setShowDropdownOpen((prev) => !prev)}
              >
                <span>{pageSize}</span>
                <ChevronDown size={13} style={{ color: '#9ca3af' }} />
              </button>

              {showDropdownOpen && (
                <div
                  className="bcl-dropdown-menu"
                  style={{ minWidth: 72, right: 0, left: 'auto' }}
                >
                  {BUNDLE_CARD_PAGE_SIZES.map((size) => (
                    <button
                      key={size}
                      type="button"
                      className={`bcl-dropdown-item ${pageSize === size ? 'is-selected' : ''}`}
                      onClick={() => {
                        setPageSize(size);
                        setShowDropdownOpen(false);
                        setCurrentPage(1);
                      }}
                    >
                      <span>{size}</span>
                      {pageSize === size && <Check size={12} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bcl-table-scroll">
          <table className="bcl-table">
            <thead>
              <tr>
                {/* # sticky left */}
                <th className="bcl-th bcl-sticky-left" style={{ width: 64 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ListOrdered size={14} style={{ opacity: 0.6 }} />
                    <span>#</span>
                  </div>
                </th>
                <th className="bcl-th" style={{ minWidth: 220 }}>
                  Our Reference / Buyer
                </th>
                <th className="bcl-th" style={{ minWidth: 160 }}>
                  PO
                </th>
                <th className="bcl-th" style={{ minWidth: 140 }}>
                  Table / Line
                </th>
                <th className="bcl-th" style={{ minWidth: 150 }}>
                  Rows / Bundles
                </th>
                <th className="bcl-th" style={{ minWidth: 160 }}>
                  Color
                </th>
                <th className="bcl-th bcl-th-center" style={{ minWidth: 70 }}>
                  Cut #
                </th>
                <th className="bcl-th bcl-th-center" style={{ minWidth: 100 }}>
                  Shrinkage
                </th>
                <th className="bcl-th bcl-th-center" style={{ minWidth: 100 }}>
                  Qty Per Ratio
                </th>
                <th className="bcl-th" style={{ minWidth: 130 }}>
                  Date
                </th>
                {/* Actions sticky right */}
                <th className="bcl-th bcl-th-right bcl-sticky-right" style={{ minWidth: 150 }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentCards.map((card, idx) => {
                const globalIndex = startIndex + idx + 1;
                const indexStr = String(globalIndex).padStart(2, '0');
                const pos = Array.isArray(card.pos)
                  ? card.pos
                  : card.poNo
                  ? [card.poNo]
                  : card.rows
                  ? [...new Set(card.rows.map((r) => r.po).filter(Boolean))]
                  : [];
                const tableVal = card.table || card.cuttingTable || '—';
                const lineVal = card.line || card.sewingLine || '—';
                const rowsVal = card.rowsCount || card.details?.length || card.rows?.length || 0;
                const bundlesVal = card.bundlesCount || card.totalBundles || 0;
                const cutNoVal = card.cutNo ?? card.nextCutNumber ?? 1;
                const shrinkageVal = card.shrinkage || '—';
                const qtyVal = card.qtyPerRatio ?? card.totalQuantity ?? 0;
                const dateVal =
                  card.date ||
                  (card.createdAt ? new Date(card.createdAt).toLocaleDateString('en-GB') : '—');
                const colorVal =
                  card.color ||
                  (card.details ? [...new Set(card.details.map((d) => d.color).filter(Boolean))].join(', ') : '—') ||
                  '—';

                return (
                  <tr key={card.id || idx}>
                    {/* Index sticky left */}
                    <td className="bcl-td bcl-sticky-left">
                      <div className="bcl-index-chip">{indexStr}</div>
                    </td>

                    {/* Our Reference / Buyer */}
                    <td className="bcl-td">
                      <div className="bcl-ref-cell">
                        <div className="bcl-ref-icon">
                          <BarcodeIcon size={18} />
                        </div>
                        <div className="bcl-ref-info">
                          <div className="bcl-ref-title">{card.ourReference || '—'}</div>
                          <div className="bcl-ref-buyer">{card.buyer || '—'}</div>
                          <div className="bcl-ref-company">{card.companyCode || card.company || 'DFL'}</div>
                        </div>
                      </div>
                    </td>

                    {/* PO */}
                    <td className="bcl-td">
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {pos.length > 0 ? (
                          pos.map((p) => (
                            <span key={p} className="bcl-po-badge">
                              {p}
                            </span>
                          ))
                        ) : (
                          <span style={{ color: '#9ca3af' }}>—</span>
                        )}
                      </div>
                    </td>

                    {/* Table / Line */}
                    <td className="bcl-td">
                      <div style={{ fontSize: '14px', color: '#374151' }}>
                        {tableVal}{' '}
                        <span style={{ fontSize: '12px', color: '#9ca3af' }}>/ {lineVal}</span>
                      </div>
                    </td>

                    {/* Rows / Bundles */}
                    <td className="bcl-td">
                      <div style={{ fontSize: '14px', color: '#374151' }}>
                        {rowsVal} rows{' '}
                        <span style={{ fontSize: '12px', color: '#9ca3af' }}>· {bundlesVal} bundles</span>
                      </div>
                    </td>

                    {/* Color */}
                    <td className="bcl-td">
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        <span className="bcl-color-badge">{colorVal}</span>
                      </div>
                    </td>

                    {/* Cut # */}
                    <td className="bcl-td bcl-td-center">{cutNoVal}</td>

                    {/* Shrinkage */}
                    <td className="bcl-td bcl-td-center">{shrinkageVal}</td>

                    {/* Qty Per Ratio */}
                    <td className="bcl-td bcl-td-center" style={{ fontWeight: 600 }}>
                      {qtyVal.toLocaleString()}
                    </td>

                    {/* Date */}
                    <td className="bcl-td" style={{ whiteSpace: 'nowrap' }}>
                      {dateVal}
                    </td>

                    {/* Actions sticky right */}
                    <td className="bcl-td bcl-td-right bcl-sticky-right">
                      <div className="bcl-actions">
                        <button
                          type="button"
                          className="bcl-action-btn bcl-action-view"
                          title="View Details"
                          onClick={() => setDetailsModalItem(card)}
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          type="button"
                          className="bcl-action-btn bcl-action-copy"
                          title="Copy to New"
                          onClick={() => handleCopyCard(card)}
                        >
                          <Copy size={18} />
                        </button>
                        <button
                          type="button"
                          className="bcl-action-btn bcl-action-edit"
                          title="Edit"
                          onClick={() => setEditModalItem(card)}
                        >
                          <SquarePen size={18} />
                        </button>
                        <button
                          type="button"
                          className="bcl-action-btn bcl-action-delete"
                          title="Delete"
                          onClick={() => setDeleteConfirmItem(card)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {currentCards.length === 0 && (
                <tr>
                  <td
                    colSpan={11}
                    style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}
                  >
                    No bundle cards match your search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="bcl-footer">
          <div className="bcl-showing">
            Showing{' '}
            <strong>
              {totalItems === 0 ? 0 : startIndex + 1}–{endIndex}
            </strong>{' '}
            of <strong>{totalItems}</strong> bundle cards
          </div>

          <div className="bcl-pagination">
            <button
              type="button"
              disabled={currentPage <= 1}
              className="bcl-page-nav-btn"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft size={14} />
              <span>Previous</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                className={`bcl-page-num-btn ${currentPage === pageNum ? 'is-active' : ''}`}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage >= totalPages}
              className="bcl-page-nav-btn"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              <span>Next</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {detailsModalItem && (
        <BundleCardDetailsModal
          item={detailsModalItem}
          onClose={() => setDetailsModalItem(null)}
        />
      )}

      {/* Edit Modal */}
      {editModalItem && (
        <BundleCardEditModal
          item={editModalItem}
          onSave={(id, updated) => {
            updateBundleCard(id, updated);
            setNotificationMessage('Bundle card updated successfully');
            setTimeout(() => setNotificationMessage(null), 3000);
          }}
          onClose={() => setEditModalItem(null)}
        />
      )}

      {/* Delete Confirm Dialog */}
      {deleteConfirmItem && (
        <ConfirmDialog
          title="Delete Bundle Card"
          message={`Are you sure you want to delete bundle card for "${deleteConfirmItem.ourReference}" (PO: ${
            Array.isArray(deleteConfirmItem.pos)
              ? deleteConfirmItem.pos.join(', ')
              : deleteConfirmItem.poNo || '—'
          })? This action cannot be undone.`}
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteConfirmItem(null)}
        />
      )}
    </div>
  );
}
