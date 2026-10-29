import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Hash,
  Info,
  Minus,
  Plus,
  Save,
  Search,
  Workflow,
  X,
} from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import { AVAILABLE_COMPANIES } from '../data/sewingLinesData';
import { useCollection } from '../hooks/useCollection';
import { KEYS } from '../services/storage';
import '../styles/cutting-tables.css';

export default function SewingLineCreate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items, add, update } = useCollection(KEYS.sewingLines);

  const isEdit = Boolean(id);
  const existingItem = isEdit ? items.find((item) => item.id === id) : null;

  const [lineName, setLineName] = useState('');
  const [ebsId, setEbsId] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [checkedAvailable, setCheckedAvailable] = useState([]);
  const [checkedSelected, setCheckedSelected] = useState([]);
  const [searchAvailable, setSearchAvailable] = useState('');
  const [searchSelected, setSearchSelected] = useState('');
  const [error, setError] = useState('');

  // Populate data if editing
  useEffect(() => {
    if (existingItem) {
      setLineName(existingItem.name || '');
      setEbsId(existingItem.ebsId || '');
      setIsActive(existingItem.status !== 'inactive');

      const mapped = (existingItem.companies || []).map((c) => {
        const found = AVAILABLE_COMPANIES.find(
          (comp) => comp.code === c || comp.name === c || comp.label === c
        );
        return found ? found.code : c;
      });
      setSelectedCompanies(mapped);
    }
  }, [existingItem]);

  const availableList = useMemo(() => {
    return AVAILABLE_COMPANIES.filter((c) => !selectedCompanies.includes(c.code));
  }, [selectedCompanies]);

  const filteredAvailable = useMemo(() => {
    const q = searchAvailable.trim().toLowerCase();
    if (!q) return availableList;
    return availableList.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [availableList, searchAvailable]);

  const selectedList = useMemo(() => {
    return selectedCompanies
      .map((code) => AVAILABLE_COMPANIES.find((c) => c.code === code))
      .filter(Boolean);
  }, [selectedCompanies]);

  const filteredSelected = useMemo(() => {
    const q = searchSelected.trim().toLowerCase();
    if (!q) return selectedList;
    return selectedList.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [selectedList, searchSelected]);

  const moveRight = (codesToMove) => {
    setSelectedCompanies((prev) => [...prev, ...codesToMove]);
    setCheckedAvailable((prev) => prev.filter((c) => !codesToMove.includes(c)));
  };

  const moveLeft = (codesToMove) => {
    setSelectedCompanies((prev) => prev.filter((c) => !codesToMove.includes(c)));
    setCheckedSelected((prev) => prev.filter((c) => !codesToMove.includes(c)));
  };

  const moveAllRight = () => {
    const codes = availableList.map((c) => c.code);
    setSelectedCompanies((prev) => [...prev, ...codes]);
    setCheckedAvailable([]);
  };

  const moveAllLeft = () => {
    setSelectedCompanies([]);
    setCheckedSelected([]);
  };

  const toggleAvailableCheck = (code) => {
    setCheckedAvailable((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const toggleSelectedCheck = (code) => {
    setCheckedSelected((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handleSelectAllAvailable = (e) => {
    if (e.target.checked) {
      const allFiltered = filteredAvailable.map((c) => c.code);
      setCheckedAvailable(Array.from(new Set([...checkedAvailable, ...allFiltered])));
    } else {
      const allFiltered = filteredAvailable.map((c) => c.code);
      setCheckedAvailable(checkedAvailable.filter((c) => !allFiltered.includes(c)));
    }
  };

  const handleSelectAllSelected = (e) => {
    if (e.target.checked) {
      const allFiltered = filteredSelected.map((c) => c.code);
      setCheckedSelected(Array.from(new Set([...checkedSelected, ...allFiltered])));
    } else {
      const allFiltered = filteredSelected.map((c) => c.code);
      setCheckedSelected(checkedSelected.filter((c) => !allFiltered.includes(c)));
    }
  };

  const isAllAvailableChecked =
    filteredAvailable.length > 0 &&
    filteredAvailable.every((c) => checkedAvailable.includes(c.code));

  const isAllSelectedChecked =
    filteredSelected.length > 0 &&
    filteredSelected.every((c) => checkedSelected.includes(c.code));

  const handleSave = (e) => {
    e.preventDefault();
    const trimmedName = lineName.trim();

    if (!trimmedName) {
      setError('Line Name is required.');
      return;
    }

    const isDuplicate = items.some(
      (item) =>
        item.name.toLowerCase() === trimmedName.toLowerCase() &&
        (!isEdit || item.id !== id)
    );

    if (isDuplicate) {
      setError(`A sewing line named "${trimmedName}" already exists.`);
      return;
    }

    if (isEdit) {
      update(id, {
        name: trimmedName,
        ebsId: ebsId.trim(),
        companies: selectedCompanies,
        status: isActive ? 'active' : 'inactive',
      });
    } else {
      add({
        name: trimmedName,
        ebsId: ebsId.trim(),
        companies: selectedCompanies,
        status: isActive ? 'active' : 'inactive',
      });
    }

    navigate('/general/line');
  };

  return (
    <div className="ct-create-page">
      <Breadcrumb
        label={isEdit ? 'Edit' : 'Create'}
        icon={Workflow}
        parents={[{ to: '/general/line', label: 'Sewing Lines', icon: Workflow }]}
      />

      <div className="ct-create-shell">
        {/* Header */}
        <div className="ct-create-header">
          <div className="ct-create-title-box">
            <div className="ct-banner-icon">
              <Workflow size={18} />
            </div>
            <h3 className="ct-create-title">
              {isEdit ? 'Edit Sewing Line' : 'Create New Sewing Line'}
            </h3>
          </div>

          <div className="ct-create-header-actions">
            <button
              type="button"
              className="ct-btn-back"
              onClick={() => navigate('/general/line')}
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>
            <button type="button" className="ct-btn-save" onClick={handleSave}>
              <Save size={14} />
              <span>Save</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="ct-form-body">
          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '6px',
                fontSize: '13px',
                backgroundColor: '#fee2e2',
                color: '#b91c1c',
                border: '1px solid #fecaca',
              }}
            >
              <span>{error}</span>
              <button
                type="button"
                onClick={() => setError('')}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#b91c1c' }}
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Section: Basic Information */}
          <div className="ct-form-section-title">
            <Info size={16} style={{ color: 'var(--color-primary)' }} />
            <span>Basic Information</span>
          </div>

          <div className="ct-form-row">
            {/* Line Name */}
            <div className="ct-form-group">
              <label htmlFor="sl-name-input" className="ct-form-label">
                Line Name <span className="ct-req">*</span>
              </label>
              <input
                id="sl-name-input"
                type="text"
                value={lineName}
                onChange={(e) => {
                  setLineName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter sewing line name"
                className="ct-input"
                required
              />
            </div>

            {/* EBS ID */}
            <div className="ct-form-group">
              <label htmlFor="sl-ebs-input" className="ct-form-label">
                EBS ID
              </label>
              <div className="ct-input-wrap">
                <Hash size={14} className="ct-input-prefix" />
                <input
                  id="sl-ebs-input"
                  type="text"
                  value={ebsId}
                  onChange={(e) => setEbsId(e.target.value)}
                  placeholder="Enter EBS ID"
                  className="ct-input ct-input-has-prefix"
                />
              </div>
            </div>

            {/* Active Checkbox */}
            <div className="ct-form-group">
              <label className="ct-form-label">Active</label>
              <label className="ct-checkbox-label">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="ct-custom-checkbox"
                />
                <span>Is active ?</span>
              </label>
            </div>
          </div>

          {/* Section: Companies (optional) with Transfer List */}
          <div className="ct-transfer-section">
            <label className="ct-transfer-label">Companies (optional)</label>

            <div className="ct-transfer-container">
              {/* Left Panel: Available */}
              <div className="ct-transfer-box">
                <div className="ct-transfer-box-header">
                  <span>Available ({availableList.length})</span>
                  <label className="ct-transfer-select-all">
                    <input
                      type="checkbox"
                      checked={isAllAvailableChecked}
                      onChange={handleSelectAllAvailable}
                      className="ct-custom-checkbox"
                    />
                    <span>Select All</span>
                  </label>
                </div>

                <div className="ct-transfer-search-wrap">
                  <Search size={14} className="ct-transfer-search-icon" />
                  <input
                    type="text"
                    value={searchAvailable}
                    onChange={(e) => setSearchAvailable(e.target.value)}
                    placeholder="Search available..."
                    className="ct-transfer-search-input"
                  />
                  {searchAvailable && (
                    <button
                      type="button"
                      onClick={() => setSearchAvailable('')}
                      style={{
                        position: 'absolute',
                        right: '18px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        color: '#9ca3af',
                        cursor: 'pointer',
                      }}
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>

                <div className="ct-transfer-list">
                  {filteredAvailable.length === 0 ? (
                    <div className="ct-transfer-empty">
                      {searchAvailable ? 'No matching companies' : 'No available companies'}
                    </div>
                  ) : (
                    filteredAvailable.map((company) => {
                      const isChecked = checkedAvailable.includes(company.code);
                      return (
                        <div
                          key={company.code}
                          className={`ct-transfer-item ${isChecked ? 'is-checked' : ''}`}
                          onClick={() => toggleAvailableCheck(company.code)}
                        >
                          <div className="ct-transfer-item-left">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleAvailableCheck(company.code)}
                              onClick={(e) => e.stopPropagation()}
                              className="ct-custom-checkbox"
                            />
                            <span>{company.label}</span>
                          </div>
                          <button
                            type="button"
                            className="ct-item-btn"
                            title="Add"
                            onClick={(e) => {
                              e.stopPropagation();
                              moveRight([company.code]);
                            }}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Middle Transfer Buttons */}
              <div className="ct-transfer-controls">
                <button
                  type="button"
                  className="ct-ctrl-btn"
                  title="Move selected right"
                  disabled={checkedAvailable.length === 0}
                  onClick={() => moveRight(checkedAvailable)}
                >
                  <ChevronRight size={16} />
                </button>
                <button
                  type="button"
                  className="ct-ctrl-btn"
                  title="Move all right"
                  disabled={availableList.length === 0}
                  onClick={moveAllRight}
                >
                  <ChevronsRight size={16} />
                </button>
                <button
                  type="button"
                  className="ct-ctrl-btn"
                  title="Move selected left"
                  disabled={checkedSelected.length === 0}
                  onClick={() => moveLeft(checkedSelected)}
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  className="ct-ctrl-btn"
                  title="Move all left"
                  disabled={selectedCompanies.length === 0}
                  onClick={moveAllLeft}
                >
                  <ChevronsLeft size={16} />
                </button>
              </div>

              {/* Right Panel: Selected */}
              <div className="ct-transfer-box">
                <div className="ct-transfer-box-header">
                  <span>Selected ({selectedCompanies.length})</span>
                  <label className="ct-transfer-select-all">
                    <input
                      type="checkbox"
                      checked={isAllSelectedChecked}
                      onChange={handleSelectAllSelected}
                      className="ct-custom-checkbox"
                    />
                    <span>Select All</span>
                  </label>
                </div>

                <div className="ct-transfer-search-wrap">
                  <Search size={14} className="ct-transfer-search-icon" />
                  <input
                    type="text"
                    value={searchSelected}
                    onChange={(e) => setSearchSelected(e.target.value)}
                    placeholder="Search selected..."
                    className="ct-transfer-search-input"
                  />
                  {searchSelected && (
                    <button
                      type="button"
                      onClick={() => setSearchSelected('')}
                      style={{
                        position: 'absolute',
                        right: '18px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        color: '#9ca3af',
                        cursor: 'pointer',
                      }}
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>

                <div className="ct-transfer-list">
                  {selectedCompanies.length === 0 ? (
                    <div className="ct-transfer-empty">No selected items yet</div>
                  ) : filteredSelected.length === 0 ? (
                    <div className="ct-transfer-empty">No matching selected companies</div>
                  ) : (
                    filteredSelected.map((company) => {
                      const isChecked = checkedSelected.includes(company.code);
                      return (
                        <div
                          key={company.code}
                          className={`ct-transfer-item ${isChecked ? 'is-checked' : ''}`}
                          onClick={() => toggleSelectedCheck(company.code)}
                        >
                          <div className="ct-transfer-item-left">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleSelectedCheck(company.code)}
                              onClick={(e) => e.stopPropagation()}
                              className="ct-custom-checkbox"
                            />
                            <span>{company.label}</span>
                          </div>
                          <button
                            type="button"
                            className="ct-item-btn"
                            title="Remove"
                            onClick={(e) => {
                              e.stopPropagation();
                              moveLeft([company.code]);
                            }}
                          >
                            <Minus size={14} />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
