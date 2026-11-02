import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  BadgePlus,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  CircleCheck,
  ContactRound,
  Copy,
  Download,
  Eye,
  Filter,
  ListOrdered,
  Mail,
  Network,
  Phone,
  RotateCcw,
  Search,
  SquarePen,
  Trash2,
  UserRound,
} from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import {
  EMPLOYEE_PAGE_SIZES,
} from '../data/employeesData';
import { useCollection } from '../hooks/useCollection';
import { KEYS } from '../services/storage';
import '../styles/employees.css';
import '../styles/po.css';

const companyNames = {
  AFL: 'Agami Fashions Ltd.',
  AWL: 'Agami Washing Ltd.',
  DFL: 'Dekko Fashions Ltd.',
  DGL: 'Dekko Garments Ltd.',
  DRL: 'Dekko Readywears Ltd.',
  GGL: 'Globus Garments Ltd.',
};

const initialFilters = {
  company: '',
  department: '',
  designation: '',
  employeeStatus: '',
  status: '',
  createdFrom: '',
  createdTo: '',
};

const filterOptions = {
  companies: Object.keys(companyNames).map((code) => ({ value: code, label: companyNames[code] })),
  departments: ['Fabric & Dice Cutting', 'Information Technology'],
  designations: ['Deputy General Manager', 'Software Engineer'],
  statuses: ['Active', 'Inactive'],
};

function FilterField({ label, icon: Icon, children }) {
  return (
    <label className="employee-filter-field">
      <span className="employee-filter-label">{label}</span>
      <span className="employee-filter-control">
        <Icon size={16} aria-hidden="true" />
        {children}
      </span>
    </label>
  );
}

function FilterSelect({ label, icon, value, options, onChange, allLabel }) {
  return (
    <FilterField label={label} icon={icon}>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">{allLabel}</option>
        {options.map((option) => {
          const item = typeof option === 'string' ? { value: option, label: option } : option;
          return <option key={item.value} value={item.value}>{item.label}</option>;
        })}
      </select>
      <ChevronDown size={14} className="employee-filter-chevron" aria-hidden="true" />
    </FilterField>
  );
}

function getPageItems(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);
  if (current <= 3) return [1, 2, 3, 4, 'end-gap', total];
  if (current >= total - 2) return [1, 'start-gap', total - 3, total - 2, total - 1, total];
  return [1, 'start-gap', current - 1, current, current + 1, 'end-gap', total];
}

export default function Employees() {
  const navigate = useNavigate();
  const { items: employees } = useCollection(KEYS.employees);
  const [query, setQuery] = useState('');
  const [pageSize, setPageSize] = useState(EMPLOYEE_PAGE_SIZES[0]);
  const [page, setPage] = useState(1);
  const [filterMode, setFilterMode] = useState(true);
  const [draftFilters, setDraftFilters] = useState(initialFilters);
  const [filters, setFilters] = useState(initialFilters);
  const [sortAscending, setSortAscending] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '' });
  const toastTimer = useRef(null);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const showToast = (message) => {
    setToast({ visible: true, message });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(
      () => setToast((previous) => ({ ...previous, visible: false })),
      3000
    );
  };

  const rows = useMemo(() => {
    const text = query.trim().toLowerCase();
    return employees
      .filter((employee) => {
        const searchText = [
          employee.name,
          employee.employeeId,
          employee.email,
          employee.phone,
          ...employee.companies,
          employee.department,
          employee.designation,
        ].join(' ').toLowerCase();
        const createdDate = employee.createdAt.slice(0, 10);
        return (
          (!text || searchText.includes(text)) &&
          (!filters.company || employee.companies.includes(filters.company)) &&
          (!filters.department || employee.department === filters.department) &&
          (!filters.designation || employee.designation === filters.designation) &&
          (!filters.employeeStatus || employee.employeeStatus === filters.employeeStatus) &&
          (!filters.status || employee.status === filters.status) &&
          (!filters.createdFrom || createdDate >= filters.createdFrom) &&
          (!filters.createdTo || createdDate <= filters.createdTo)
        );
      })
      .sort((a, b) => {
        if (sortAscending === null) return 0;
        const result = a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
        return sortAscending ? result : -result;
      });
  }, [employees, filters, query, sortAscending]);

  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const visibleRows = rows.slice(start, start + pageSize);
  const from = total === 0 ? 0 : start + 1;
  const to = start + visibleRows.length;

  const updateDraftFilter = (key, value) => {
    setDraftFilters((previous) => ({ ...previous, [key]: value }));
  };

  const applyFilters = () => {
    setFilters({ ...draftFilters });
    setPage(1);
  };

  const resetFilters = () => {
    setDraftFilters({ ...initialFilters });
    setFilters({ ...initialFilters });
    setPage(1);
  };

  const downloadCsv = () => {
    const headings = ['Employee', 'Employee ID', 'Email', 'Phone', 'Company', 'Department', 'Designation', 'Employee Status'];
    const escapeCsv = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
    const csvRows = rows.map((employee) => [
      employee.name,
      employee.employeeId,
      employee.email,
      employee.phone,
      employee.companies.join(', '),
      employee.department,
      employee.designation,
      employee.employeeStatus,
    ]);
    const csv = [headings, ...csvRows].map((row) => row.map(escapeCsv).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'employees.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const showActionNotice = () => {
    showToast('Employee record actions are not included in this design preview.');
  };

  return (
    <>
      <Breadcrumb label="Employees" icon={ContactRound} />
      <section className="card-shell employee-page">
        <header className="po-banner employee-banner">
          <div className="po-banner-left">
            <div className="po-banner-icon"><ContactRound size={20} /></div>
            <h1 className="po-banner-title">Employee List</h1>
          </div>
          <div className="employee-banner-actions">
            <span className="employee-filter-mode-label">Filter Mode</span>
            <button
              type="button"
              className={`employee-toggle${filterMode ? ' is-on' : ''}`}
              role="switch"
              aria-checked={filterMode}
              aria-label="Toggle filter mode"
              onClick={() => setFilterMode((enabled) => !enabled)}
            >
              <span className="employee-toggle-thumb">
                {filterMode && <Check size={12} strokeWidth={3} />}
              </span>
            </button>
            <button type="button" className="po-add-btn employee-add-btn" onClick={() => navigate('/employee/create')}>
              <BadgePlus size={16} />
              <span>Add a new employee</span>
            </button>
          </div>
        </header>

        <div className="po-body employee-body">
          {filterMode && (
            <section className="employee-filter-card" aria-labelledby="employee-filter-heading">
              <div className="employee-filter-heading">
                <Filter size={16} aria-hidden="true" />
                <h2 id="employee-filter-heading">Filter Employees</h2>
              </div>
              <div className="employee-filter-content">
                <div className="employee-filter-grid">
                  <FilterSelect
                    label="Company"
                    icon={Building2}
                    value={draftFilters.company}
                    options={filterOptions.companies}
                    allLabel="All companies"
                    onChange={(value) => updateDraftFilter('company', value)}
                  />
                  <FilterSelect
                    label="Department"
                    icon={Network}
                    value={draftFilters.department}
                    options={filterOptions.departments}
                    allLabel="All departments"
                    onChange={(value) => updateDraftFilter('department', value)}
                  />
                  <FilterSelect
                    label="Designation"
                    icon={BriefcaseBusiness}
                    value={draftFilters.designation}
                    options={filterOptions.designations}
                    allLabel="All designations"
                    onChange={(value) => updateDraftFilter('designation', value)}
                  />
                  <FilterSelect
                    label="Employee Status"
                    icon={Activity}
                    value={draftFilters.employeeStatus}
                    options={filterOptions.statuses}
                    allLabel="All"
                    onChange={(value) => updateDraftFilter('employeeStatus', value)}
                  />
                  <FilterSelect
                    label="Status"
                    icon={Eye}
                    value={draftFilters.status}
                    options={filterOptions.statuses}
                    allLabel="All"
                    onChange={(value) => updateDraftFilter('status', value)}
                  />
                  <FilterField label="Created From" icon={CalendarDays}>
                    <input
                      type="date"
                      value={draftFilters.createdFrom}
                      onChange={(event) => updateDraftFilter('createdFrom', event.target.value)}
                    />
                  </FilterField>
                  <FilterField label="Created To" icon={CalendarDays}>
                    <input
                      type="date"
                      value={draftFilters.createdTo}
                      onChange={(event) => updateDraftFilter('createdTo', event.target.value)}
                    />
                  </FilterField>
                </div>
                <div className="employee-filter-actions">
                  <button type="button" className="employee-download-btn" onClick={downloadCsv}>
                    <Download size={16} />
                    <span>Download</span>
                  </button>
                  <button type="button" className="employee-reset-btn" onClick={resetFilters}>
                    <RotateCcw size={16} />
                    <span>Reset</span>
                  </button>
                  <button type="button" className="employee-apply-btn" onClick={applyFilters}>
                    <Filter size={16} />
                    <span>Filter</span>
                  </button>
                </div>
              </div>
            </section>
          )}

          <section className="po-panel employee-list-panel" aria-label="Employees">
            <div className="po-toolbar employee-toolbar">
              <div className="po-search employee-search">
                <span className="po-search-icon"><Search size={16} /></span>
                <input
                  type="search"
                  className="po-search-input"
                  placeholder="Search employees by Name, Email, Phone and Employee ID..."
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setPage(1);
                  }}
                  aria-label="Search employees"
                />
              </div>
              <label className="employee-page-size">
                <span className="po-show-label">Show</span>
                <span className="employee-page-size-select">
                  <select
                    value={pageSize}
                    onChange={(event) => {
                      setPageSize(Number(event.target.value));
                      setPage(1);
                    }}
                    aria-label="Rows per page"
                  >
                    {EMPLOYEE_PAGE_SIZES.map((size) => <option key={size} value={size}>{size}</option>)}
                  </select>
                  <ChevronDown size={12} aria-hidden="true" />
                </span>
              </label>
            </div>

            <div className="po-scroll employee-table-scroll">
              <table className="po-table employee-table">
                <thead>
                  <tr>
                    <th className="po-th po-col-index">
                      <div className="po-th-inner"><ListOrdered size={12} className="po-th-icon" /><span>#</span></div>
                    </th>
                    <th className="po-th employee-info-heading">
                      <button
                        type="button"
                        className="employee-sort-button"
                        onClick={() => setSortAscending((ascending) => (ascending === null ? true : !ascending))}
                        aria-label={`Sort employee names ${sortAscending === true ? 'descending' : 'ascending'}`}
                      >
                        <span>Employee Info.</span>
                        <ChevronsUpDown size={14} className="employee-sort-indicator" aria-hidden="true" />
                      </button>
                    </th>
                    <th className="po-th">Company</th>
                    <th className="po-th">Department</th>
                    <th className="po-th">Designation</th>
                    <th className="po-th po-th-center employee-status-heading">Employee Status</th>
                    <th className="po-th po-th-right employee-actions-heading">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.length === 0 ? (
                    <tr className="po-empty-row">
                      <td colSpan={7} className="po-empty">
                        <div className="po-empty-inner">
                          <div className="po-empty-icon"><Search size={20} /></div>
                          <p>No employees found</p>
                        </div>
                      </td>
                    </tr>
                  ) : visibleRows.map((employee, index) => (
                    <tr key={employee.id}>
                      <td className="po-td po-col-index">
                        <span className="po-index">{String(start + index + 1).padStart(2, '0')}</span>
                      </td>
                      <td className="po-td employee-info-cell">
                        <div className="employee-person">
                          <div className="employee-avatar">
                            {employee.profileImage
                              ? <img src={employee.profileImage} alt="" />
                              : <UserRound size={17} />}
                          </div>
                          <div className="employee-details">
                            <span className="employee-name">
                              {employee.name}<Copy size={11} className="employee-copy-mark" aria-hidden="true" />
                            </span>
                            {employee.employeeId && (
                              <span className="employee-id">
                                {employee.employeeId}<Copy size={11} className="employee-copy-mark" aria-hidden="true" />
                              </span>
                            )}
                            {employee.email && (
                              <span className="employee-contact">
                                <Mail size={12} />{employee.email}<Copy size={11} className="employee-copy-mark" aria-hidden="true" />
                              </span>
                            )}
                            {employee.phone && (
                              <span className="employee-contact">
                                <Phone size={12} />{employee.phone}<Copy size={11} className="employee-copy-mark" aria-hidden="true" />
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="po-td employee-organization">
                        {employee.companies.length
                          ? employee.companies.map((company) => (
                            <span key={company}>{company}</span>
                          ))
                          : '—'}
                      </td>
                      <td className="po-td employee-organization">{employee.department || '—'}</td>
                      <td className="po-td employee-organization">{employee.designation || '—'}</td>
                      <td className="po-td po-td-center">
                        {employee.employeeStatus ? (
                          <span className="po-badge po-badge-active">
                            <Check size={12} />
                            {employee.employeeStatus}
                          </span>
                        ) : <span className="employee-dash">—</span>}
                      </td>
                      <td className="po-td po-td-right">
                        <div className="employee-row-actions">
                          <button
                            type="button"
                            className="employee-action employee-action-view"
                            title="View employee"
                            aria-label={`View ${employee.name}`}
                            onClick={showActionNotice}
                          >
                            <Eye size={19} />
                          </button>
                          <button
                            type="button"
                            className="employee-action employee-action-edit"
                            title="Edit employee"
                            aria-label={`Edit ${employee.name}`}
                            onClick={showActionNotice}
                          >
                            <SquarePen size={19} />
                          </button>
                          <button
                            type="button"
                            className="employee-action employee-action-delete"
                            title="Delete employee"
                            aria-label={`Delete ${employee.name}`}
                            onClick={showActionNotice}
                          >
                            <Trash2 size={19} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="po-footer employee-footer">
              <div className="po-showing">
                Showing <strong className="po-strong">{from}–{to}</strong> of{' '}
                <strong className="po-strong">{total}</strong> employees
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
                {getPageItems(currentPage, totalPages).map((item) => (
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
                ))}
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
          </section>
        </div>
      </section>

      <div className={`employee-toast${toast.visible ? '' : ' is-hidden'}`} role="status" aria-live="polite">
        <CircleCheck size={16} />
        <span>{toast.message}</span>
      </div>
    </>
  );
}
