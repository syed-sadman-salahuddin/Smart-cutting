import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  Hash,
  Layers,
  Link2,
  Plus,
  Save,
  X,
} from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import { BUYERS, COMPANIES, REFERENCES } from '../data/cuttingPOData';
import { useCollection } from '../hooks/useCollection';
import { KEYS } from '../services/storage';
import '../styles/cutting-po-create.css';

const emptyRow = () => ({ color: '', size: '', quantity: '1000' });

export default function CuttingPOCreate() {
  const navigate = useNavigate();
  const { items, add } = useCollection(KEYS.cuttingPOs);
  const [values, setValues] = useState({
    buyer: '',
    reference: '',
    poNo: '',
    lotNumber: '',
    type: 'Top',
    quantity: '',
    smv: '',
    confirmationDate: new Date().toISOString().slice(0, 10),
    shipmentDate: '',
    description: '',
  });
  const [rows, setRows] = useState([emptyRow()]);
  const [error, setError] = useState('');

  const updateValue = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const updateRow = (index, field, value) => {
    setRows((current) => current.map((row, rowIndex) => (
      rowIndex === index ? { ...row, [field]: value } : row
    )));
  };

  const removeRow = (index) => {
    setRows((current) => current.filter((_, rowIndex) => rowIndex !== index));
  };

  const handleSave = (event) => {
    event.preventDefault();
    const poNo = values.poNo.trim();
    if (!values.buyer || !values.reference || !poNo || !values.quantity || !values.confirmationDate) {
      setError('Complete all required fields before saving.');
      return;
    }

    if (items.some((item) => item.poNo?.trim().toLowerCase() === poNo.toLowerCase())) {
      setError('A cutting PO with this PO Number already exists.');
      return;
    }

    add({
      poNo,
      buyer: values.buyer,
      reference: values.reference,
      company: COMPANIES[0],
      type: values.type,
      quantity: Number(values.quantity),
      rows: rows.length,
      confirmationDate: values.confirmationDate,
      shipmentDate: values.shipmentDate,
      status: 'active',
      lotNumber: values.lotNumber,
      smv: Number(values.smv) || 0,
      description: values.description.trim(),
      colorSizeQuantities: rows,
    });
    navigate('/cutting/po');
  };

  return (
    <div className="cpo-create-page">
      <Breadcrumb
        label="Create"
        icon={ClipboardList}
        parents={[{ label: 'Cutting POs', to: '/cutting/po' }]}
      />

      <form className="cpo-create-shell" onSubmit={handleSave}>
        <div className="cpo-create-header">
          <div className="cpo-create-title-wrap">
            <span className="cpo-create-icon"><ClipboardList size={18} /></span>
            <h1 className="cpo-create-title">Create Cutting PO</h1>
          </div>
          <div className="cpo-create-actions">
            <button type="button" className="cpo-create-back" onClick={() => navigate('/cutting/po')}>
              <ArrowLeft size={16} />
              Back
            </button>
            <button type="submit" className="cpo-create-save">
              <Save size={16} />
              Save
            </button>
          </div>
        </div>

        {error && <p className="cpo-create-error" role="alert">{error}</p>}

        <div className="cpo-create-grid">
          <section className="cpo-create-card">
            <div className="cpo-create-card-header">
              <ClipboardList size={16} />
              <h2>Cutting PO Information</h2>
            </div>
            <div className="cpo-create-fields">
              <div className="cpo-create-field cpo-create-field-half">
                <label className="cpo-create-label" htmlFor="cpo-buyer">Buyer Name <span className="cpo-create-required">*</span></label>
                <span className={`cpo-create-control${values.buyer ? ' has-value' : ''}`}>
                  <Layers size={15} />
                  <select id="cpo-buyer" value={values.buyer} onChange={(event) => updateValue('buyer', event.target.value)} required>
                    <option value="">Select Buyer</option>
                    {BUYERS.map((buyer) => <option key={buyer} value={buyer}>{buyer}</option>)}
                  </select>
                  <ChevronDown size={14} className="cpo-create-caret" />
                  {values.buyer && (
                    <button type="button" className="cpo-create-clear" aria-label="Clear buyer" onClick={() => updateValue('buyer', '')}>
                      <X size={14} />
                    </button>
                  )}
                </span>
              </div>

              <div className="cpo-create-field cpo-create-field-half">
                <label className="cpo-create-label" htmlFor="cpo-reference">Our Reference <span className="cpo-create-required">*</span></label>
                <span className={`cpo-create-control${values.reference ? ' has-value' : ''}`}>
                  <Link2 size={15} />
                  <select id="cpo-reference" value={values.reference} onChange={(event) => updateValue('reference', event.target.value)} required>
                    <option value="">Select Our Reference</option>
                    {REFERENCES.map((reference) => <option key={reference} value={reference}>{reference}</option>)}
                  </select>
                  <ChevronDown size={14} className="cpo-create-caret" />
                  {values.reference && (
                    <button type="button" className="cpo-create-clear" aria-label="Clear reference" onClick={() => updateValue('reference', '')}>
                      <X size={14} />
                    </button>
                  )}
                </span>
              </div>

              <div className="cpo-create-field cpo-create-field-po">
                <label className="cpo-create-label" htmlFor="cpo-number">PO No <span className="cpo-create-required">*</span></label>
                <span className={`cpo-create-control${values.poNo ? ' has-value' : ''}`}>
                  <Hash size={15} />
                  <input id="cpo-number" value={values.poNo} onChange={(event) => updateValue('poNo', event.target.value)} placeholder="Select PO Number" required />
                  <ChevronDown size={14} className="cpo-create-caret" />
                  {values.poNo && (
                    <button type="button" className="cpo-create-clear" aria-label="Clear PO number" onClick={() => updateValue('poNo', '')}>
                      <X size={14} />
                    </button>
                  )}
                </span>
              </div>

              <label className="cpo-create-field">
                <span className="cpo-create-label">Lot Number</span>
                <span className="cpo-create-control">
                  <Hash size={15} />
                  <input value={values.lotNumber} onChange={(event) => updateValue('lotNumber', event.target.value)} placeholder="Enter lot number" />
                </span>
              </label>

              <div className="cpo-create-type">
                <span className="cpo-create-label">Select Type</span>
                <span className="cpo-create-radio-group">
                  {['Top', 'Bottom'].map((type) => (
                    <label key={type}>
                      <input type="radio" name="garment-type" value={type} checked={values.type === type} onChange={() => updateValue('type', type)} />
                      {type}
                    </label>
                  ))}
                </span>
              </div>

              <label className="cpo-create-field cpo-create-field-half">
                <span className="cpo-create-label">Total Cutting Quantity <span className="cpo-create-required">*</span></span>
                <input type="number" min="1" value={values.quantity} onChange={(event) => updateValue('quantity', event.target.value)} required />
              </label>

              <label className="cpo-create-field cpo-create-field-half">
                <span className="cpo-create-label">SMV</span>
                <input type="number" min="0" step="any" value={values.smv} onChange={(event) => updateValue('smv', event.target.value)} />
              </label>

              <label className="cpo-create-field cpo-create-field-half">
                <span className="cpo-create-label">Confirmation Date <span className="cpo-create-required">*</span></span>
                <span className="cpo-create-control">
                  <CalendarDays size={15} />
                  <input type="date" value={values.confirmationDate} onChange={(event) => updateValue('confirmationDate', event.target.value)} required />
                </span>
              </label>

              <label className="cpo-create-field cpo-create-field-half">
                <span className="cpo-create-label">Shipment Date</span>
                <span className="cpo-create-control">
                  <CalendarDays size={15} />
                  <input type="date" value={values.shipmentDate} onChange={(event) => updateValue('shipmentDate', event.target.value)} />
                </span>
              </label>

              <label className="cpo-create-field cpo-create-wide">
                <span className="cpo-create-label">Description</span>
                <textarea rows="4" value={values.description} onChange={(event) => updateValue('description', event.target.value)} placeholder="Enter description..." />
              </label>
            </div>
          </section>

          <section className="cpo-create-card">
            <div className="cpo-create-card-header">
              <Layers size={16} />
              <h2>Color, Size &amp; Cutting Quantity</h2>
            </div>
            <div className="cpo-create-rows">
              {rows.map((row, index) => (
                <div className="cpo-create-row" key={index}>
                  <select aria-label={`Color ${index + 1}`} value={row.color} onChange={(event) => updateRow(index, 'color', event.target.value)}>
                    <option value="">Select Color...</option>
                    <option value="Black">Black</option>
                    <option value="Navy">Navy</option>
                    <option value="White">White</option>
                  </select>
                  <select aria-label={`Size ${index + 1}`} value={row.size} onChange={(event) => updateRow(index, 'size', event.target.value)}>
                    <option value="">Select Size...</option>
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => <option key={size} value={size}>{size}</option>)}
                  </select>
                  <input aria-label={`Cutting quantity ${index + 1}`} type="number" min="1" value={row.quantity} onChange={(event) => updateRow(index, 'quantity', event.target.value)} />
                  <button
                    type="button"
                    className={`cpo-create-row-action${index === rows.length - 1 ? ' is-add' : ' is-remove'}`}
                    aria-label={index === rows.length - 1 ? 'Add color, size, and quantity' : `Remove color, size, and quantity row ${index + 1}`}
                    onClick={() => (index === rows.length - 1 ? setRows((current) => [...current, emptyRow()]) : removeRow(index))}
                  >
                    {index === rows.length - 1 ? <Plus size={16} /> : <X size={16} />}
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </form>
    </div>
  );
}
