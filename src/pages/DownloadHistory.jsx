import { useEffect, useMemo, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Database,
  Download,
  FileDown,
  FileText,
  ListOrdered,
  Search,
} from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import { useStorage } from '../hooks/useStorage';
import { DOWNLOADS_KEY, PAGE_SIZES, statusTone } from '../data/downloadData';
import '../styles/download-history.css';

const COLUMNS = [
  { id: 'report', minWidth: 200 },
  { id: 'file', minWidth: 220 },
  { id: 'status', minWidth: 140 },
  { id: 'requestedAt', minWidth: 150 },
  { id: 'completedAt', minWidth: 150 },
];

function getPageNumbers(current, total) {
  const max = 5;
  const end = Math.min(total, Math.max(current + 2, max));
  const start = Math.max(1, end - max + 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function PageSizeSelect({ value, options, onChange, ariaLabel }) {
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
    <div className="dh-select" ref={wrapRef}>
      <button
        type="button"
        className="dh-select-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{value}</span>
        <ChevronDown size={12} className={`dh-select-chevron${open ? ' is-open' : ''}`} />
      </button>

      {open && (
        <ul className="dh-select-menu" role="listbox">
          {options.map((size) => (
            <li key={size} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={size === value}
                className={`dh-select-option${size === value ? ' is-active' : ''}`}
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

export default function DownloadHistory() {
  const { t, i18n } = useTranslation();
  const [downloads] = useStorage(DOWNLOADS_KEY, []);

  const [query, setQuery] = useState('');
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [page, setPage] = useState(1);

  const rows = useMemo(() => {
    const list = Array.isArray(downloads) ? downloads : [];
    const text = query.trim().toLowerCase();
    return list
      .filter((row) => !text || String(row.report || '').toLowerCase().includes(text))
      .sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));
  }, [downloads, query]);

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

  const formatDate = (value) => {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleString(i18n.language?.startsWith('bn') ? 'bn-BD' : 'en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDownload = (row) => {
    const lines = [
      'Report,Status,Requested At,Completed At',
      [row.report, row.status, row.requestedAt || '', row.completedAt || ''].map((cell) => `"${cell}"`).join(','),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(row.file || row.report || 'report').replace(/\.[^.]+$/, '')}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Breadcrumb label={t('downloadHistory.breadcrumb')} icon={FileDown} />

      <div className="card-shell">
        {/* ---------- Banner ---------- */}
        <div className="dh-banner">
          <div className="dh-banner-icon">
            <FileDown size={20} />
          </div>
          <h1 className="dh-banner-title">{t('downloadHistory.title')}</h1>
        </div>

        {/* ---------- Body ---------- */}
        <div className="dh-body">
          <div className="dh-panel">
            {/* search + "Show" dropdown */}
            <div className="dh-toolbar">
              <div className="dh-search">
                <span className="dh-search-icon">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  className="dh-search-input"
                  placeholder={t('downloadHistory.searchPlaceholder')}
                  value={query}
                  onChange={handleSearch}
                />
              </div>

              <div className="dh-show">
                <span className="dh-show-label">{t('downloadHistory.show')}</span>
                <PageSizeSelect
                  value={pageSize}
                  options={PAGE_SIZES}
                  onChange={handlePageSize}
                  ariaLabel={t('downloadHistory.rowsPerPage')}
                />
              </div>
            </div>

            {/* table */}
            <div className="dh-scroll">
              <table className="dh-table">
                <thead>
                  <tr>
                    <th className="dh-th dh-sticky-left dh-col-index">
                      <div className="dh-th-inner">
                        <ListOrdered size={12} className="dh-th-icon" />
                        <span>{t('downloadHistory.columns.index')}</span>
                      </div>
                    </th>
                    {COLUMNS.map((column) => (
                      <th className="dh-th" style={{ minWidth: column.minWidth }} key={column.id}>
                        <div className="dh-th-inner">
                          <span>{t(`downloadHistory.columns.${column.id}`)}</span>
                        </div>
                      </th>
                    ))}
                    <th className="dh-th dh-th-right dh-sticky-right" style={{ minWidth: 100 }}>
                      <div className="dh-th-inner dh-th-inner-right">
                        <span>{t('downloadHistory.columns.actions')}</span>
                      </div>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {visibleRows.length === 0 ? (
                    <tr className="dh-empty-row">
                      <td colSpan={7} className="dh-empty">
                        <div className="dh-empty-inner">
                          <div className="dh-empty-icon">
                            <Database size={20} />
                          </div>
                          <p>{t('downloadHistory.empty')}</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    visibleRows.map((row, index) => {
                      const tone = statusTone[row.status] || 'gray';
                      const ready = row.status === 'completed';
                      return (
                        <tr key={row.id ?? `${row.report}-${index}`}>
                          <td className="dh-td dh-sticky-left dh-col-index">{start + index + 1}</td>
                          <td className="dh-td dh-td-strong">{row.report}</td>
                          <td className="dh-td">
                            {row.file ? (
                              <span className="dh-file">
                                <FileText size={14} />
                                <span>{row.file}</span>
                              </span>
                            ) : (
                              '—'
                            )}
                          </td>
                          <td className="dh-td">
                            <span className={`dh-badge dh-badge-${tone}`}>
                              <span className="dh-badge-dot" />
                              {t(`downloadHistory.status.${row.status}`, { defaultValue: row.status })}
                            </span>
                          </td>
                          <td className="dh-td dh-td-muted">{formatDate(row.requestedAt)}</td>
                          <td className="dh-td dh-td-muted">{formatDate(row.completedAt)}</td>
                          <td className="dh-td dh-td-right dh-sticky-right">
                            <button
                              type="button"
                              className="dh-action"
                              disabled={!ready}
                              title={ready ? t('downloadHistory.download') : t('downloadHistory.notReady')}
                              aria-label={ready ? t('downloadHistory.download') : t('downloadHistory.notReady')}
                              onClick={() => handleDownload(row)}
                            >
                              <Download size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* footer: "Showing 1-10 of 25 reports" + page buttons */}
            <div className="dh-footer">
              <div className="dh-showing">
                <Trans
                  i18nKey="downloadHistory.showing"
                  values={{ from, to, total }}
                  components={{ b: <strong className="dh-strong" /> }}
                />
              </div>

              {totalPages > 1 && (
                <div className="dh-pager">
                  <button
                    type="button"
                    className="dh-page-btn"
                    disabled={currentPage === 1}
                    onClick={() => setPage(currentPage - 1)}
                    aria-label={t('downloadHistory.previous')}
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {getPageNumbers(currentPage, totalPages).map((number) => (
                    <button
                      type="button"
                      key={number}
                      className={`dh-page-btn${number === currentPage ? ' is-active' : ''}`}
                      aria-current={number === currentPage ? 'page' : undefined}
                      onClick={() => setPage(number)}
                    >
                      {number}
                    </button>
                  ))}

                  <button
                    type="button"
                    className="dh-page-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => setPage(currentPage + 1)}
                    aria-label={t('downloadHistory.next')}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}