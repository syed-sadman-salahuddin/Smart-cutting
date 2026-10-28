import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Barcode,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FileText,
  Hash,
  Home,
  Layers,
  LayoutGrid,
  Link2,
  Package,
  Percent,
  Plus,
  Rows3,
  Save,
  Scan,
  Scissors,
  Search,
  Sparkles,
  X,
} from 'lucide-react';

import { useCollection } from '../hooks/useCollection';
import { KEYS } from '../services/storage';
import { partsSeed } from '../data/partsData';
import { shadesSeed } from '../data/shadesData';
import { groupsSeed } from '../data/groupsData';
import { sizesSeed } from '../data/sizesData';
import { colorsSeed } from '../data/colorsData';
import { purchaseOrdersSeed } from '../data/purchaseOrdersData';
import { ourReferencesSeed } from '../data/ourReferencesData';
import { CUTTING_TABLES, SEWING_LINES } from '../data/cuttingGeneralData';
import '../styles/bundle-card-multi-po.css';

export default function BundleCardMultiPOCreate() {
  const navigate = useNavigate();

  // Storage collections
  const { items: allParts } = useCollection(KEYS.parts);
  const { items: allShades } = useCollection(KEYS.shades);
  const { items: allGroups } = useCollection(KEYS.groups);
  const { items: allSizes } = useCollection(KEYS.sizes);
  const { items: allColors } = useCollection(KEYS.colors);
  const { items: allPOs } = useCollection(KEYS.purchaseOrders);
  const { items: allRefs } = useCollection(KEYS.ourReferences);
  const { add: addBundleCard } = useCollection(KEYS.bundleCards);

  // Active dataset with fallback seeds
  const partsList = useMemo(() => (allParts?.length ? allParts : partsSeed), [allParts]);
  const shadesList = useMemo(() => (allShades?.length ? allShades : shadesSeed), [allShades]);
  const groupsList = useMemo(() => (allGroups?.length ? allGroups : groupsSeed), [allGroups]);
  const sizesList = useMemo(() => (allSizes?.length ? allSizes : sizesSeed), [allSizes]);
  const colorsList = useMemo(() => (allColors?.length ? allColors : colorsSeed), [allColors]);
  const posList = useMemo(() => (allPOs?.length ? allPOs : purchaseOrdersSeed), [allPOs]);
  const refsList = useMemo(() => (allRefs?.length ? allRefs : ourReferencesSeed), [allRefs]);

  // Form State: Card 1 (Bundle Card Information) - Note: 3 selects in Multi PO
  const [ourReference, setOurReference] = useState('');
  const [cuttingTable, setCuttingTable] = useState('');
  const [sewingLine, setSewingLine] = useState('');

  // POs available for this reference
  const availablePOsForRef = useMemo(() => {
    if (!ourReference) return posList;
    const match = posList.filter(
      (po) => (po.ourReference || '').trim() === ourReference.trim()
    );
    return match.length > 0 ? match : posList;
  }, [ourReference, posList]);

  // Parts Dual Listbox State
  const [selectedPartNames, setSelectedPartNames] = useState([]);
  const [checkedAvailable, setCheckedAvailable] = useState(new Set());
  const [checkedSelected, setCheckedSelected] = useState(new Set());
  const [searchAvailable, setSearchAvailable] = useState('');
  const [searchSelected, setSearchSelected] = useState('');

  // Partition parts into Available and Selected
  const selectedPartSet = useMemo(() => new Set(selectedPartNames), [selectedPartNames]);

  const availableParts = useMemo(() => {
    return partsList.filter((part) => !selectedPartSet.has(part.name));
  }, [partsList, selectedPartSet]);

  const selectedParts = useMemo(() => {
    return partsList.filter((part) => selectedPartSet.has(part.name));
  }, [partsList, selectedPartSet]);

  // Filtered lists by search input
  const visibleAvailableParts = useMemo(() => {
    const q = searchAvailable.trim().toLowerCase();
    if (!q) return availableParts;
    return availableParts.filter((p) => p.name.toLowerCase().includes(q));
  }, [availableParts, searchAvailable]);

  const visibleSelectedParts = useMemo(() => {
    const q = searchSelected.trim().toLowerCase();
    if (!q) return selectedParts;
    return selectedParts.filter((p) => p.name.toLowerCase().includes(q));
  }, [selectedParts, searchSelected]);

  // Checkbox toggle helpers
  const toggleAvailableCheck = useCallback((name) => {
    setCheckedAvailable((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }, []);

  const toggleSelectedCheck = useCallback((name) => {
    setCheckedSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }, []);

  // Select all toggles
  const isAllAvailableChecked =
    visibleAvailableParts.length > 0 &&
    visibleAvailableParts.every((p) => checkedAvailable.has(p.name));

  const toggleSelectAllAvailable = () => {
    setCheckedAvailable((prev) => {
      const next = new Set(prev);
      if (isAllAvailableChecked) {
        visibleAvailableParts.forEach((p) => next.delete(p.name));
      } else {
        visibleAvailableParts.forEach((p) => next.add(p.name));
      }
      return next;
    });
  };

  const isAllSelectedChecked =
    visibleSelectedParts.length > 0 &&
    visibleSelectedParts.every((p) => checkedSelected.has(p.name));

  const toggleSelectAllSelected = () => {
    setCheckedSelected((prev) => {
      const next = new Set(prev);
      if (isAllSelectedChecked) {
        visibleSelectedParts.forEach((p) => next.delete(p.name));
      } else {
        visibleSelectedParts.forEach((p) => next.add(p.name));
      }
      return next;
    });
  };

  // Transfer actions
  const moveCheckedToSelected = () => {
    if (checkedAvailable.size === 0) return;
    setSelectedPartNames((prev) => [...prev, ...Array.from(checkedAvailable)]);
    setCheckedAvailable(new Set());
  };

  const moveAllAvailableToSelected = () => {
    const toAdd = visibleAvailableParts.map((p) => p.name);
    setSelectedPartNames((prev) => [...prev, ...toAdd]);
    setCheckedAvailable(new Set());
  };

  const moveCheckedToAvailable = () => {
    if (checkedSelected.size === 0) return;
    const toRemove = checkedSelected;
    setSelectedPartNames((prev) => prev.filter((name) => !toRemove.has(name)));
    setCheckedSelected(new Set());
  };

  const moveAllSelectedToAvailable = () => {
    const toRemove = new Set(visibleSelectedParts.map((p) => p.name));
    setSelectedPartNames((prev) => prev.filter((name) => !toRemove.has(name)));
    setCheckedSelected(new Set());
  };

  const addSinglePart = (partName) => {
    setSelectedPartNames((prev) => [...prev, partName]);
    setCheckedAvailable((prev) => {
      const next = new Set(prev);
      next.delete(partName);
      return next;
    });
  };

  const removeSinglePart = (partName) => {
    setSelectedPartNames((prev) => prev.filter((name) => name !== partName));
    setCheckedSelected((prev) => {
      const next = new Set(prev);
      next.delete(partName);
      return next;
    });
  };

  // Form State: Card 2 (Cut Number & Quantity)
  const previousCutNumber = '';
  const [nextCutNumber, setNextCutNumber] = useState('');
  const [maxQuantityPerBundle, setMaxQuantityPerBundle] = useState('');
  const [shrinkage, setShrinkage] = useState('');
  const [incm, setIncm] = useState('');

  // Form State: Bottom Card (Bundle Card Details: PO / Color / Size / Shade / Quantity)
  const [multiRows, setMultiRows] = useState([
    {
      id: 'multi-1',
      po: '',
      color: '',
      size: '',
      group: '',
      shade: '',
      quantity: '',
    },
  ]);

  const updateMultiRow = (index, field, value) => {
    setMultiRows((rows) =>
      rows.map((row, idx) => {
        if (idx !== index) return row;
        if (field === 'color') {
          return { ...row, color: value, size: '' };
        }
        return { ...row, [field]: value };
      })
    );
  };

  const addMultiRow = () => {
    setMultiRows((rows) => [
      ...rows,
      {
        id: `multi-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        po: '',
        color: '',
        size: '',
        group: '',
        shade: '',
        quantity: '',
      },
    ]);
  };

  const removeMultiRow = (index) => {
    if (multiRows.length <= 1) return;
    setMultiRows((rows) => rows.filter((_, idx) => idx !== index));
  };

  // Live Summary Computations (Rows, Total Quantity, Total Bundles)
  const totalQuantity = useMemo(() => {
    return multiRows.reduce((sum, row) => sum + (Number(row.quantity) || 0), 0);
  }, [multiRows]);

  const totalBundles = useMemo(() => {
    const max = Number(maxQuantityPerBundle);
    if (max <= 0) return 0;
    return multiRows.reduce((sum, row) => {
      const q = Number(row.quantity) || 0;
      return sum + (q > 0 ? Math.ceil(q / max) : 0);
    }, 0);
  }, [multiRows, maxQuantityPerBundle]);

  // Validation & Save Modal State
  const [errorMessage, setErrorMessage] = useState('');
  const [savedDataModal, setSavedDataModal] = useState(null);

  const handleSave = (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    if (!ourReference) {
      setErrorMessage('Please select Our Reference first.');
      return;
    }
    if (selectedPartNames.length === 0) {
      setErrorMessage('Please select at least one Part from Available list.');
      return;
    }
    if (!nextCutNumber) {
      setErrorMessage('Please enter Next Cut Number.');
      return;
    }
    if (!maxQuantityPerBundle || Number(maxQuantityPerBundle) <= 0) {
      setErrorMessage('Please enter a valid Max Quantity Per Bundle.');
      return;
    }

    // Check row details
    for (let i = 0; i < multiRows.length; i++) {
      const row = multiRows[i];
      if (!row.po) {
        setErrorMessage(`Please select a PO for Row #${i + 1}.`);
        return;
      }
      if (!row.color) {
        setErrorMessage(`Please select a Color for Row #${i + 1}.`);
        return;
      }
      if (!row.size) {
        setErrorMessage(`Please select a Size for Row #${i + 1}.`);
        return;
      }
      if (!row.quantity || Number(row.quantity) <= 0) {
        setErrorMessage(`Please enter a valid Quantity (> 0) for Row #${i + 1}.`);
        return;
      }
    }

    const newRecord = {
      bundleType: 'Multi PO',
      ourReference,
      cuttingTable: cuttingTable || 'Table 01',
      sewingLine: sewingLine || 'Line 01',
      parts: selectedPartNames,
      previousCutNumber: previousCutNumber || 'N/A',
      nextCutNumber: Number(nextCutNumber),
      maxQuantityPerBundle: Number(maxQuantityPerBundle),
      shrinkage: shrinkage || '0',
      incm: incm || '',
      rows: multiRows,
      totalQuantity,
      totalBundles,
      createdAt: new Date().toISOString(),
    };

    addBundleCard(newRecord);
    setSavedDataModal(newRecord);
  };

  const handleCreateAnother = () => {
    setSavedDataModal(null);
    setNextCutNumber((prev) => String(Number(prev || 1) + 1));
    setSelectedPartNames([]);
    setCheckedAvailable(new Set());
    setCheckedSelected(new Set());
    setMultiRows([
      {
        id: 'multi-1',
        po: '',
        color: '',
        size: '',
        group: '',
        shade: '',
        quantity: '',
      },
    ]);
  };

  return (
    <div className="bundle-po-page">
      <div className="bundle-breadcrumb">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="bundle-breadcrumb-back"
          aria-label="Go back"
        >
          <ArrowLeft size={16} />
        </button>

        <nav aria-label="Breadcrumb" className="bundle-breadcrumb-nav">
          <ol className="bundle-breadcrumb-list">
            <li className="bundle-breadcrumb-item">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="bundle-breadcrumb-link"
              >
                <Home size={14} />
                <span>Home</span>
              </button>
            </li>

            <li className="bundle-breadcrumb-item">
              <span className="bundle-breadcrumb-separator">
                <ChevronRight size={15} />
              </span>
              <button
                type="button"
                onClick={() => navigate('/cutting/bundle-card/')}
                className="bundle-breadcrumb-link"
              >
                <FileText size={14} />
                <span>Bundle Cards</span>
              </button>
            </li>

            <li className="bundle-breadcrumb-item">
              <span className="bundle-breadcrumb-separator">
                <ChevronRight size={15} />
              </span>
              <span
                className="bundle-breadcrumb-current"
                aria-current="page"
              >
                <Barcode size={14} />
                <span>Multi PO</span>
              </span>
            </li>
          </ol>
        </nav>
      </div>

      {/* Main Shell Container */}
      <div className="bundle-shell">
        {/* Header Bar */}
        <div className="bundle-header">
          <div className="bundle-title-wrap">
            <span className="bundle-icon-badge">
              <Barcode size={17} />
            </span>
            <h1 className="bundle-title">Bundle Card — Multi PO</h1>
          </div>
          <div className="bundle-actions">
            <button
              type="button"
              className="bundle-btn-back"
              onClick={() => navigate('/cutting/po')}
            >
              <ArrowLeft size={15} />
              <span>Back</span>
            </button>
            <button
              type="button"
              className="bundle-btn-save"
              onClick={handleSave}
            >
              <Save size={15} />
              <span>Save</span>
            </button>
          </div>
        </div>

        {/* Validation Banner */}
        {errorMessage && (
          <div className="bundle-alert-error" role="alert">
            <X size={16} className="flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Main Form Body */}
        <div className="bundle-body">
          {/* Top Grid: Left (Bundle Card Information) + Right (Cut Number & Quantity) */}
          <div className="bundle-grid-top">
            {/* Left Card: Bundle Card Information (3 selects in Multi PO) */}
            <div className="bundle-subcard">
              <div className="bundle-subcard-header">
                <div className="bundle-subcard-title">
                  <FileText size={15} />
                  <h2>Bundle Card Information</h2>
                </div>
              </div>

              <div className="bundle-info-form">
                {/* Row 1: 3 Dropdowns (Our Reference, Cutting Table, Sewing Line) */}
                <div className="bundle-info-selects-row-3">
                  {/* Our Reference */}
                  <div className="bundle-field">
                    <label className="bundle-label" htmlFor="bundle-multi-our-ref">
                      Our Reference <span className="bundle-required">*</span>
                    </label>
                    <div className={`bundle-control${ourReference ? ' has-value' : ''}`}>
                      <Link2 size={14} className="bundle-prefix-icon" />
                      <select
                        id="bundle-multi-our-ref"
                        value={ourReference}
                        onChange={(e) => setOurReference(e.target.value)}
                      >
                        <option value="">Select Our Reference</option>
                        {refsList.map((ref) => (
                          <option key={ref.id || ref.name} value={ref.name}>
                            {ref.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="bundle-caret-icon" />
                      {ourReference && (
                        <button
                          type="button"
                          className="bundle-clear-btn"
                          aria-label="Clear Our Reference"
                          onClick={() => setOurReference('')}
                        >
                          <X size={13} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Cutting Table */}
                  <div className="bundle-field">
                    <label className="bundle-label" htmlFor="bundle-multi-table">
                      Cutting Table
                    </label>
                    <div className={`bundle-control${cuttingTable ? ' has-value' : ''}`}>
                      <LayoutGrid size={14} className="bundle-prefix-icon" />
                      <select
                        id="bundle-multi-table"
                        value={cuttingTable}
                        onChange={(e) => setCuttingTable(e.target.value)}
                      >
                        <option value="">Select Cutting Table</option>
                        {CUTTING_TABLES.map((table) => (
                          <option key={table} value={table}>
                            {table}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="bundle-caret-icon" />
                      {cuttingTable && (
                        <button
                          type="button"
                          className="bundle-clear-btn"
                          aria-label="Clear Cutting Table"
                          onClick={() => setCuttingTable('')}
                        >
                          <X size={13} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Sewing Line */}
                  <div className="bundle-field">
                    <label className="bundle-label" htmlFor="bundle-multi-line">
                      Sewing Line
                    </label>
                    <div className={`bundle-control${sewingLine ? ' has-value' : ''}`}>
                      <Rows3 size={14} className="bundle-prefix-icon" />
                      <select
                        id="bundle-multi-line"
                        value={sewingLine}
                        onChange={(e) => setSewingLine(e.target.value)}
                      >
                        <option value="">Select Sewing Line</option>
                        {SEWING_LINES.map((line) => (
                          <option key={line} value={line}>
                            {line}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="bundle-caret-icon" />
                      {sewingLine && (
                        <button
                          type="button"
                          className="bundle-clear-btn"
                          aria-label="Clear Sewing Line"
                          onClick={() => setSewingLine('')}
                        >
                          <X size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Row 2: Parts Transfer List (Dual Listbox) */}
                <div className="bundle-parts-section">
                  <label className="bundle-label">Parts</label>

                  <div className="bundle-transfer-container">
                    {/* Left Listbox: Available */}
                    <div className="bundle-transfer-box">
                      <div className="bundle-transfer-box-header">
                        <span>Available ({availableParts.length})</span>
                        <label className="bundle-checkbox-label">
                          <input
                            type="checkbox"
                            checked={isAllAvailableChecked}
                            onChange={toggleSelectAllAvailable}
                          />
                          <span>Select All</span>
                        </label>
                      </div>

                      <div className="bundle-transfer-search">
                        <Search size={13} />
                        <input
                          type="text"
                          className="bundle-transfer-search-input"
                          placeholder="Search available..."
                          value={searchAvailable}
                          onChange={(e) => setSearchAvailable(e.target.value)}
                        />
                        {searchAvailable && (
                          <button
                            type="button"
                            className="bundle-search-clear"
                            onClick={() => setSearchAvailable('')}
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>

                      <div className="bundle-transfer-list">
                        {visibleAvailableParts.map((part) => (
                          <div className="bundle-transfer-item" key={part.id || part.name}>
                            <label className="bundle-transfer-item-main">
                              <input
                                type="checkbox"
                                checked={checkedAvailable.has(part.name)}
                                onChange={() => toggleAvailableCheck(part.name)}
                              />
                              <span className="bundle-transfer-item-text" title={part.name}>
                                {part.name}
                              </span>
                            </label>
                            <button
                              type="button"
                              className="bundle-transfer-quick-btn"
                              title="Add part"
                              onClick={() => addSinglePart(part.name)}
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        ))}
                        {visibleAvailableParts.length === 0 && (
                          <div className="bundle-transfer-empty">No parts found</div>
                        )}
                      </div>
                    </div>

                    {/* Middle Action Buttons */}
                    <div className="bundle-transfer-actions">
                      <button
                        type="button"
                        className="bundle-transfer-btn"
                        title="Move selected right"
                        disabled={checkedAvailable.size === 0}
                        onClick={moveCheckedToSelected}
                      >
                        <ChevronRight size={14} />
                      </button>
                      <button
                        type="button"
                        className="bundle-transfer-btn"
                        title="Move all right"
                        disabled={visibleAvailableParts.length === 0}
                        onClick={moveAllAvailableToSelected}
                      >
                        <ChevronsRight size={14} />
                      </button>
                      <button
                        type="button"
                        className="bundle-transfer-btn"
                        title="Move selected left"
                        disabled={checkedSelected.size === 0}
                        onClick={moveCheckedToAvailable}
                      >
                        <ChevronLeft size={14} />
                      </button>
                      <button
                        type="button"
                        className="bundle-transfer-btn"
                        title="Move all left"
                        disabled={visibleSelectedParts.length === 0}
                        onClick={moveAllSelectedToAvailable}
                      >
                        <ChevronsLeft size={14} />
                      </button>
                    </div>

                    {/* Right Listbox: Selected */}
                    <div className="bundle-transfer-box">
                      <div className="bundle-transfer-box-header">
                        <span>Selected ({selectedParts.length})</span>
                        <label className="bundle-checkbox-label">
                          <input
                            type="checkbox"
                            checked={isAllSelectedChecked}
                            onChange={toggleSelectAllSelected}
                          />
                          <span>Select All</span>
                        </label>
                      </div>

                      <div className="bundle-transfer-search">
                        <Search size={13} />
                        <input
                          type="text"
                          className="bundle-transfer-search-input"
                          placeholder="Search selected..."
                          value={searchSelected}
                          onChange={(e) => setSearchSelected(e.target.value)}
                        />
                        {searchSelected && (
                          <button
                            type="button"
                            className="bundle-search-clear"
                            onClick={() => setSearchSelected('')}
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>

                      <div className="bundle-transfer-list">
                        {visibleSelectedParts.map((part) => (
                          <div className="bundle-transfer-item" key={part.id || part.name}>
                            <label className="bundle-transfer-item-main">
                              <input
                                type="checkbox"
                                checked={checkedSelected.has(part.name)}
                                onChange={() => toggleSelectedCheck(part.name)}
                              />
                              <span className="bundle-transfer-item-text" title={part.name}>
                                {part.name}
                              </span>
                            </label>
                            <button
                              type="button"
                              className="bundle-transfer-quick-btn"
                              title="Remove part"
                              onClick={() => removeSinglePart(part.name)}
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                        {visibleSelectedParts.length === 0 && (
                          <div className="bundle-transfer-empty">
                            No selected items yet
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card: Cut Number & Quantity */}
            <div className="bundle-subcard">
              <div className="bundle-subcard-header">
                <div className="bundle-subcard-title">
                  <Scissors size={15} />
                  <h2>Cut Number &amp; Quantity</h2>
                </div>
              </div>

              <div className="bundle-cut-fields">
                {/* Previous Cut Number */}
                <div className="bundle-field">
                  <label className="bundle-label">Previous Cut Number</label>
                  <div className="bundle-control">
                    <Scan size={14} className="bundle-prefix-icon" />
                    <input
                      type="text"
                      value={previousCutNumber}
                      disabled
                      readOnly
                    />
                  </div>
                </div>

                {/* Next Cut Number */}
                <div className="bundle-field">
                  <label className="bundle-label">
                    Next Cut Number <span className="bundle-required">*</span>
                  </label>
                  <div className="bundle-control">
                    <Scan size={14} className="bundle-prefix-icon" />
                    <input
                      type="number"
                      min="1"
                      value={nextCutNumber}
                      onChange={(e) => setNextCutNumber(e.target.value)}
                      placeholder="1"
                    />
                  </div>
                </div>

                {/* Max Quantity Per Bundle */}
                <div className="bundle-field">
                  <label className="bundle-label">
                    Max Quantity Per Bundle <span className="bundle-required">*</span>
                  </label>
                  <div className="bundle-control">
                    <Layers size={14} className="bundle-prefix-icon" />
                    <input
                      type="number"
                      min="1"
                      value={maxQuantityPerBundle}
                      onChange={(e) => setMaxQuantityPerBundle(e.target.value)}
                      placeholder="15..."
                    />
                  </div>
                </div>

                {/* Shrinkage */}
                <div className="bundle-field">
                  <label className="bundle-label">Shrinkage</label>
                  <div className="bundle-control">
                    <Percent size={14} className="bundle-prefix-icon" />
                    <input
                      type="text"
                      value={shrinkage}
                      onChange={(e) => setShrinkage(e.target.value)}
                      placeholder="1.111"
                    />
                  </div>
                </div>

                {/* INCM */}
                <div className="bundle-field">
                  <label className="bundle-label">INCM</label>
                  <div className="bundle-control">
                    <Hash size={14} className="bundle-prefix-icon" />
                    <input
                      type="text"
                      value={incm}
                      onChange={(e) => setIncm(e.target.value)}
                      placeholder="Enter INCM"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Card: Full-width Bundle Card Details (PO / Color / Size / Shade / Quantity) */}
          <div className="bundle-subcard bundle-multi-subcard">
            <div className="bundle-subcard-header">
              <div className="bundle-subcard-title">
                <Layers size={15} />
                <h2>Bundle Card Details (PO / Color / Size / Shade / Quantity)</h2>
              </div>
            </div>

            <p className="bundle-multi-hint">
              Select Our Reference first — each row picks its own PO from that reference.
            </p>

            <div className="bundle-multi-rows">
              {multiRows.map((row, index) => (
                <div className="bundle-multi-row" key={row.id}>
                  <span className="bundle-row-label">Row #{index + 1}</span>

                  {/* PO Select */}
                  <select
                    className="bundle-multi-select"
                    value={row.po}
                    onChange={(e) => updateMultiRow(index, 'po', e.target.value)}
                  >
                    <option value="">Select PO..</option>
                    {availablePOsForRef.map((po) => (
                      <option key={po.id || po.name} value={po.name}>
                        {po.name}
                      </option>
                    ))}
                  </select>

                  {/* Color Select */}
                  <select
                    className="bundle-multi-select"
                    value={row.color}
                    onChange={(e) => updateMultiRow(index, 'color', e.target.value)}
                  >
                    <option value="">Select Color..</option>
                    {colorsList.map((c) => (
                      <option key={c.id || c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  {/* Size Select (disabled if color not selected) */}
                  <select
                    className="bundle-multi-select"
                    value={row.size}
                    disabled={!row.color}
                    onChange={(e) => updateMultiRow(index, 'size', e.target.value)}
                  >
                    <option value="">
                      {row.color ? 'Select Size..' : 'Select Color first'}
                    </option>
                    {sizesList.map((s) => (
                      <option key={s.id || s.name} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>

                  {/* Group Select */}
                  <select
                    className="bundle-multi-select"
                    value={row.group}
                    onChange={(e) => updateMultiRow(index, 'group', e.target.value)}
                  >
                    <option value="">No Group</option>
                    {groupsList.map((g) => (
                      <option key={g.id || g.name} value={g.name}>
                        {g.name}
                      </option>
                    ))}
                  </select>

                  {/* Shade Select */}
                  <select
                    className="bundle-multi-select"
                    value={row.shade}
                    onChange={(e) => updateMultiRow(index, 'shade', e.target.value)}
                  >
                    <option value="">Select Shade..</option>
                    {shadesList.map((s) => (
                      <option key={s.id || s.name} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>

                  {/* Quantity Input */}
                  <input
                    type="number"
                    min="1"
                    className="bundle-multi-input"
                    value={row.quantity}
                    onChange={(e) => updateMultiRow(index, 'quantity', e.target.value)}
                    placeholder="100..."
                  />

                  {/* Action button */}
                  {index === multiRows.length - 1 ? (
                    <button
                      type="button"
                      className="bundle-action-btn is-add"
                      title="Add multi PO row"
                      onClick={addMultiRow}
                    >
                      <Plus size={15} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="bundle-action-btn is-remove"
                      title="Remove multi PO row"
                      onClick={() => removeMultiRow(index)}
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom Multi PO Summary Bar */}
            <div className="bundle-multi-footer-summary">
              <div className="bundle-multi-stat">
                <span>Rows:</span>
                <span className="bundle-multi-stat-value">{multiRows.length}</span>
              </div>
              <div className="bundle-multi-stat">
                <span>Total Quantity:</span>
                <span className="bundle-multi-stat-value">{totalQuantity}</span>
              </div>
              <div className="bundle-multi-stat">
                <span>Total Bundles:</span>
                <span className="bundle-multi-stat-value">{totalBundles}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {savedDataModal && (
        <div className="bundle-modal-overlay">
          <div className="bundle-modal-dialog" role="dialog" aria-modal="true">
            <div className="bundle-modal-header">
              <span className="bundle-modal-icon">
                <Check size={20} />
              </span>
              <div>
                <h3 className="bundle-modal-title">Multi PO Bundle Card Created</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Multi PO bundle details successfully generated.
                </p>
              </div>
            </div>

            <div className="bundle-modal-body">
              <div className="bundle-modal-summary-grid">
                <div className="bundle-modal-summary-item">
                  <span className="bundle-modal-summary-label">Our Reference</span>
                  <span className="bundle-modal-summary-val">{savedDataModal.ourReference}</span>
                </div>
                <div className="bundle-modal-summary-item">
                  <span className="bundle-modal-summary-label">PO Count</span>
                  <span className="bundle-modal-summary-val">{savedDataModal.rows.length} PO rows</span>
                </div>
                <div className="bundle-modal-summary-item">
                  <span className="bundle-modal-summary-label">Cut Number</span>
                  <span className="bundle-modal-summary-val">#{savedDataModal.nextCutNumber}</span>
                </div>
                <div className="bundle-modal-summary-item">
                  <span className="bundle-modal-summary-label">Selected Parts</span>
                  <span className="bundle-modal-summary-val">{savedDataModal.parts.length} parts</span>
                </div>
                <div className="bundle-modal-summary-item">
                  <span className="bundle-modal-summary-label">Total Quantity</span>
                  <span className="bundle-modal-summary-val">{savedDataModal.totalQuantity}</span>
                </div>
                <div className="bundle-modal-summary-item">
                  <span className="bundle-modal-summary-label">Total Bundles</span>
                  <span className="bundle-modal-summary-val" style={{ color: 'var(--color-primary)' }}>
                    {savedDataModal.totalBundles} bundles
                  </span>
                </div>
              </div>
            </div>

            <div className="bundle-modal-footer">
              <button
                type="button"
                className="bundle-btn-back"
                onClick={() => navigate('/cutting/po')}
              >
                Go to PO List
              </button>
              <button
                type="button"
                className="bundle-btn-save"
                onClick={handleCreateAnother}
              >
                Create Another
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
