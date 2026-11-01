import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  Calendar,
  Check,
  CircleCheck,
  FileText,
  Globe,
  ImageUp,
  Mail,
  MapPin,
  Phone,
  Save,
  Tag,
  X,
} from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import { COMPANY_TYPES, companiesSeed } from '../data/companiesData';
import { useCollection } from '../hooks/useCollection';
import { KEYS, readJSON, writeJSON } from '../services/storage';
import '../styles/companies.css';
import '../styles/po.css';

export default function CompanyCreate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { items: rawItems, add, update } = useCollection(KEYS.companies);
  const fileInputRef = useRef(null);
  const toastTimer = useRef(null);

  // Seed on first load
  useEffect(() => {
    const stored = readJSON(KEYS.companies, null);
    if (!stored || (Array.isArray(stored) && stored.length === 0)) {
      writeJSON(KEYS.companies, companiesSeed);
    }
  }, []);

  const items = rawItems.length > 0 ? rawItems : companiesSeed;
  const isEdit = Boolean(id);
  const existingItem = isEdit ? items.find((item) => item.id === id) : null;

  // Form state
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [type, setType] = useState('private');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [license, setLicense] = useState('');
  const [established, setEstablished] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [address, setAddress] = useState('');
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ visible: false, message: '' });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (existingItem) {
      setName(existingItem.name || '');
      setShortName(existingItem.shortName || '');
      setType(existingItem.type || 'private');
      setEmail(existingItem.email || '');
      setPhone(existingItem.phone || '');
      setWebsite(existingItem.website || '');
      setLicense(existingItem.license || '');
      setEstablished(existingItem.established || '');
      setIsActive(existingItem.status !== 'inactive');
      setAddress(existingItem.address || '');
      setLogoPreview(existingItem.logo || null);
    }
  }, [existingItem]);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const showToast = (message) => {
    setToast({ visible: true, message });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(
      () => setToast((previous) => ({ ...previous, visible: false })),
      3000
    );
  };

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Company name is required.';
    if (!type) newErrors.type = 'Company type is required.';
    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Enter a valid email address.';
    }
    if (!phone.trim()) newErrors.phone = 'Phone number is required.';
    return newErrors;
  };

  const handleLogoChange = (file) => {
    if (!file) return;
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) return;
    if (file.size > 2 * 1024 * 1024) return;
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setLogoPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleLogoChange(file);
  };

  const handleSave = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    const values = {
      name: name.trim(),
      shortName: shortName.trim(),
      type,
      email: email.trim(),
      phone: phone.trim(),
      website: website.trim(),
      license: license.trim(),
      established,
      status: isActive ? 'active' : 'inactive',
      address: address.trim(),
      logo: logoPreview || '',
    };

    if (isEdit && existingItem) {
      update(existingItem.id, values);
      showToast('Company updated successfully.');
    } else {
      add(values);
      showToast('Company created successfully.');
    }

    setTimeout(() => navigate('/company/list'), 1200);
  };

  const addressLength = address.length;

  return (
    <>
      <Breadcrumb
        label={isEdit ? 'Edit' : 'Create'}
        icon={Building2}
        parents={[{ label: 'Companies', to: '/company/list', icon: Building2 }]}
      />
      <div className="co-create-shell">
        {/* Header Banner */}
        <div className="co-create-banner">
          <div className="co-create-banner-left">
            <div className="co-create-banner-icon"><Building2 size={20} /></div>
            <h1 className="co-create-banner-title">
              {isEdit ? 'Edit Company' : 'Create New Company'}
            </h1>
          </div>
          <div className="co-create-banner-actions">
            <button
              type="button"
              className="co-back-btn"
              onClick={() => navigate('/company/list')}
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
            <button
              type="button"
              className="co-save-btn"
              onClick={handleSave}
            >
              <Save size={16} />
              <span>Save</span>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="co-create-body">
          <div className="co-create-layout">
            {/* Main Form */}
            <div className="co-create-main">
              <div className="co-section">
                <div className="co-section-header">
                  <div className="co-section-icon"><FileText size={15} /></div>
                  <h2 className="co-section-title">Basic Information</h2>
                </div>

                <div className="co-form-grid">
                  {/* Company Name */}
                  <div className="co-field">
                    <label className="co-label" htmlFor="co-name">
                      Company Name <span className="co-required">*</span>
                    </label>
                    <div className={`co-input-wrap${errors.name ? ' has-error' : ''}`}>
                      <Building2 size={15} />
                      <input
                        id="co-name"
                        type="text"
                        className="co-input"
                        placeholder="Enter company name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    {errors.name && <p className="co-error">{errors.name}</p>}
                  </div>

                  {/* Short Name */}
                  <div className="co-field">
                    <label className="co-label" htmlFor="co-short-name">Short Name</label>
                    <div className="co-input-wrap">
                      <Tag size={15} />
                      <input
                        id="co-short-name"
                        type="text"
                        className="co-input"
                        placeholder="Enter short name"
                        value={shortName}
                        onChange={(e) => setShortName(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Company Type */}
                  <div className="co-field">
                    <label className="co-label" htmlFor="co-type">
                      Company Type <span className="co-required">*</span>
                    </label>
                    <div className={`co-input-wrap${errors.type ? ' has-error' : ''}`}>
                      <Building2 size={15} />
                      <select
                        id="co-type"
                        className="co-select"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                      >
                        {COMPANY_TYPES.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      {type && (
                        <button
                          type="button"
                          className="co-select-clear"
                          onClick={() => setType('')}
                          aria-label="Clear type"
                        >
                          <X size={13} />
                        </button>
                      )}
                    </div>
                    {errors.type && <p className="co-error">{errors.type}</p>}
                  </div>

                  {/* Email */}
                  <div className="co-field">
                    <label className="co-label" htmlFor="co-email">
                      Email <span className="co-required">*</span>
                    </label>
                    <div className={`co-input-wrap${errors.email ? ' has-error' : ''}`}>
                      <Mail size={15} />
                      <input
                        id="co-email"
                        type="email"
                        className="co-input"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    {errors.email && <p className="co-error">{errors.email}</p>}
                  </div>

                  {/* Phone */}
                  <div className="co-field">
                    <label className="co-label" htmlFor="co-phone">
                      Phone <span className="co-required">*</span>
                    </label>
                    <div className={`co-input-wrap${errors.phone ? ' has-error' : ''}`}>
                      <Phone size={15} />
                      <input
                        id="co-phone"
                        type="text"
                        className="co-input"
                        placeholder="Enter phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    {errors.phone && <p className="co-error">{errors.phone}</p>}
                  </div>

                  {/* Website URL */}
                  <div className="co-field">
                    <label className="co-label" htmlFor="co-website">Website URL</label>
                    <div className="co-input-wrap">
                      <Globe size={15} />
                      <input
                        id="co-website"
                        type="url"
                        className="co-input"
                        placeholder="Enter website url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Govt. License */}
                  <div className="co-field">
                    <label className="co-label" htmlFor="co-license">Govt. License</label>
                    <div className="co-input-wrap">
                      <FileText size={15} />
                      <input
                        id="co-license"
                        type="text"
                        className="co-input"
                        placeholder="Enter govt. license"
                        value={license}
                        onChange={(e) => setLicense(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Established At */}
                  <div className="co-field">
                    <label className="co-label" htmlFor="co-established">Established At</label>
                    <div className="co-input-wrap">
                      <Calendar size={15} />
                      <input
                        id="co-established"
                        type="date"
                        className="co-input co-date-input"
                        value={established}
                        onChange={(e) => setEstablished(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Active Checkbox */}
                <div className="co-active-row">
                  <label className="co-active-label" htmlFor="co-active">Active</label>
                  <label className="co-checkbox-wrap">
                    <input
                      id="co-active"
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                    />
                    <span className={`co-checkbox${isActive ? ' is-checked' : ''}`}>
                      {isActive && <Check size={11} />}
                    </span>
                    <span className="co-checkbox-text">Is active ?</span>
                  </label>
                </div>

                {/* Address */}
                <div className="co-field co-field-full">
                  <label className="co-label" htmlFor="co-address">Address</label>
                  <div className="co-textarea-wrap">
                    <MapPin size={15} className="co-textarea-icon" />
                    <textarea
                      id="co-address"
                      className="co-textarea"
                      placeholder="Write your address..."
                      maxLength={500}
                      rows={4}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                  <div className="co-textarea-footer">
                    <span className="co-textarea-hint">You can write up to 500 characters.</span>
                    <span className="co-textarea-count">{addressLength}/500</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar: Logo Upload */}
            <div className="co-create-aside">
              <div className="co-section">
                <div className="co-section-header">
                  <div className="co-section-icon"><ImageUp size={15} /></div>
                  <h2 className="co-section-title">Company Logo</h2>
                </div>

                <div
                  className={`co-logo-zone${isDragging ? ' is-dragging' : ''}`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  aria-label="Upload company logo"
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
                >
                  {logoPreview ? (
                    <div className="co-logo-preview-wrap">
                      <img src={logoPreview} alt="Company logo" className="co-logo-preview" />
                      <button
                        type="button"
                        className="co-logo-remove"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLogoPreview(null);
                          setLogoFile(null);
                        }}
                        aria-label="Remove logo"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="co-logo-upload-icon">
                        <ImageUp size={28} />
                      </div>
                      <p className="co-logo-upload-text">Drag &amp; drop or click to upload</p>
                      <p className="co-logo-upload-hint">Images (JPG, PNG, WEBP, GIF)</p>
                      <p className="co-logo-upload-hint">• Max 2.0 MB</p>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="co-logo-file-input"
                    onChange={(e) => handleLogoChange(e.target.files?.[0])}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`po-toast${toast.visible ? '' : ' po-toast-hidden'}`} role="status" aria-live="polite">
        <CircleCheck size={16} /><span>{toast.message}</span>
      </div>
    </>
  );
}
