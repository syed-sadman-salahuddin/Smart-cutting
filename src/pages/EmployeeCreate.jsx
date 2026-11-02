import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BadgePlus,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  ContactRound,
  FileText,
  ImageUp,
  IdCard,
  LockKeyhole,
  Mail,
  Network,
  Phone,
  Plus,
  Save,
  Search,
  Shield,
  Tag,
  Trash2,
  UserRound,
  Eye,
  EyeOff,
  X,
  Globe2,
  UploadCloud,
} from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import { companiesSeed } from '../data/companiesData';
import { departmentsSeed } from '../data/departmentsData';
import { designationsSeed } from '../data/designationsData';
import { rolesSeed } from '../data/rolesData';
import { useCollection } from '../hooks/useCollection';
import { KEYS } from '../services/storage';
import '../styles/employee-create.css';

const employeeStatuses = ['Active', 'Probation', 'On Leave', 'Inactive'];
const genders = ['Male', 'Female', 'Other'];
const religions = ['Islam', 'Hinduism', 'Christianity', 'Buddhism', 'Other'];

function SectionCard({ title, icon: Icon, children, className = '' }) {
  return (
    <section className={`employee-create-section ${className}`}>
      <header className="employee-create-section-heading">
        <Icon size={16} aria-hidden="true" />
        <h2>{title}</h2>
      </header>
      <div className="employee-create-section-body">{children}</div>
    </section>
  );
}

function FormField({ label, htmlFor, required = false, error, children, className = '' }) {
  return (
    <div className={`employee-create-field${className ? ` ${className}` : ''}`}>
      <label className="employee-create-label" htmlFor={htmlFor}>
        {label}{required && <span className="employee-required"> *</span>}
      </label>
      {children}
      {error && <span className="employee-create-error">{error}</span>}
    </div>
  );
}

function InputControl({ icon: Icon, children, error, className = '' }) {
  return (
    <span className={`employee-create-control${error ? ' has-error' : ''}${className ? ` ${className}` : ''}`}>
      {Icon && <Icon size={16} aria-hidden="true" />}
      {children}
    </span>
  );
}

function SelectControl({ id, icon: Icon, value, onChange, options, placeholder, required = false }) {
  return (
    <InputControl icon={Icon}>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)} required={required}>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      <ChevronDown size={14} className="employee-create-select-chevron" aria-hidden="true" />
    </InputControl>
  );
}

function TransferPicker({ title, items, selected, onChange, emptyMessage }) {
  const [availableSearch, setAvailableSearch] = useState('');
  const [selectedSearch, setSelectedSearch] = useState('');
  const [checkedAvailable, setCheckedAvailable] = useState([]);
  const [checkedSelected, setCheckedSelected] = useState([]);
  const availableItems = items.filter((item) => !selected.includes(item.value));
  const filteredAvailable = availableItems.filter((item) =>
    item.label.toLowerCase().includes(availableSearch.trim().toLowerCase())
  );
  const selectedItems = items.filter((item) => selected.includes(item.value));
  const filteredSelected = selectedItems.filter((item) =>
    item.label.toLowerCase().includes(selectedSearch.trim().toLowerCase())
  );
  const availableAllChecked = filteredAvailable.length > 0 &&
    filteredAvailable.every((item) => checkedAvailable.includes(item.value));
  const selectedAllChecked = filteredSelected.length > 0 &&
    filteredSelected.every((item) => checkedSelected.includes(item.value));

  const toggleChecked = (value, side) => {
    const setChecked = side === 'available' ? setCheckedAvailable : setCheckedSelected;
    setChecked((previous) => previous.includes(value)
      ? previous.filter((item) => item !== value)
      : [...previous, value]);
  };

  const toggleAll = (side, checked) => {
    const list = side === 'available' ? filteredAvailable : filteredSelected;
    const setChecked = side === 'available' ? setCheckedAvailable : setCheckedSelected;
    setChecked((previous) => {
      const currentVisible = list.map((item) => item.value);
      return checked
        ? [...new Set([...previous, ...currentVisible])]
        : previous.filter((value) => !currentVisible.includes(value));
    });
  };

  const move = (values, direction) => {
    if (direction === 'add') {
      onChange([...selected, ...values.filter((value) => !selected.includes(value))]);
      setCheckedAvailable((previous) => previous.filter((value) => !values.includes(value)));
    } else {
      onChange(selected.filter((value) => !values.includes(value)));
      setCheckedSelected((previous) => previous.filter((value) => !values.includes(value)));
    }
  };

  const renderList = (list, checked, side) => (
    <div className="employee-transfer-list">
      {list.length === 0 ? (
        <p className="employee-transfer-empty">
          {side === 'selected' && selected.length ? 'No matching items' : emptyMessage}
        </p>
      ) : list.map((item) => (
        <div className="employee-transfer-item" key={item.value}>
          <input
            type="checkbox"
            checked={checked.includes(item.value)}
            aria-label={`Select ${item.label}`}
            onChange={() => toggleChecked(item.value, side)}
          />
          <span>{item.label}</span>
          <button
            type="button"
            className={side === 'available' ? 'employee-transfer-add' : 'employee-transfer-remove'}
            aria-label={`${side === 'available' ? 'Add' : 'Remove'} ${item.label}`}
            onClick={() => move([item.value], side === 'available' ? 'add' : 'remove')}
          >
            {side === 'available' ? <Plus size={16} /> : <X size={16} />}
          </button>
        </div>
      ))}
    </div>
  );

  const renderColumn = (side, list, checked, search, setSearch, allChecked) => (
    <div className="employee-transfer-column">
      <div className="employee-transfer-column-heading">
        <strong>{side === 'available' ? `Available (${availableItems.length})` : `Selected (${selectedItems.length})`}</strong>
        <label className="employee-transfer-select-all">
          <input
            type="checkbox"
            checked={allChecked}
            onChange={(event) => toggleAll(side, event.target.checked)}
          />
          Select All
        </label>
      </div>
      <span className="employee-transfer-search">
        <Search size={15} aria-hidden="true" />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={`Search ${side}...`}
          aria-label={`Search ${side} ${title.toLowerCase()}`}
        />
      </span>
      {renderList(list, checked, side)}
    </div>
  );

  return (
    <div className="employee-transfer">
      {renderColumn('available', filteredAvailable, checkedAvailable, availableSearch, setAvailableSearch, availableAllChecked)}
      <div className="employee-transfer-actions" aria-label={`${title} selection controls`}>
        <button
          type="button"
          title="Add selected"
          aria-label="Add selected items"
          disabled={!checkedAvailable.length}
          onClick={() => move(checkedAvailable, 'add')}
        >
          <ArrowRight size={16} />
        </button>
        <button
          type="button"
          title="Add all"
          aria-label="Add all items"
          disabled={!availableItems.length}
          onClick={() => move(availableItems.map((item) => item.value), 'add')}
        >
          <span>»</span>
        </button>
        <button
          type="button"
          title="Remove selected"
          aria-label="Remove selected items"
          disabled={!checkedSelected.length}
          onClick={() => move(checkedSelected, 'remove')}
        >
          <ArrowLeft size={16} />
        </button>
        <button
          type="button"
          title="Remove all"
          aria-label="Remove all items"
          disabled={!selected.length}
          onClick={() => move(selected, 'remove')}
        >
          <span>«</span>
        </button>
      </div>
      {renderColumn('selected', filteredSelected, checkedSelected, selectedSearch, setSelectedSearch, selectedAllChecked)}
    </div>
  );
}

function UploadCard({ title, icon: Icon, accept, hint, caption, value, onChange, error, imageShape = 'wide' }) {
  const fileInput = useRef(null);
  const [dragging, setDragging] = useState(false);

  const selectFile = (file) => {
    if (!file) return;
    onChange(file);
  };

  return (
    <SectionCard title={title} icon={Icon} className="employee-upload-section">
      <input
        ref={fileInput}
        className="employee-file-input"
        type="file"
        accept={accept}
        onChange={(event) => {
          selectFile(event.target.files?.[0]);
          event.target.value = '';
        }}
      />
      {caption && <p className="employee-upload-caption">{caption}</p>}
      <button
        type="button"
        className={`employee-upload-zone employee-upload-${imageShape}${dragging ? ' is-dragging' : ''}${value?.preview ? ' has-preview' : ''}`}
        onClick={() => fileInput.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          selectFile(event.dataTransfer.files?.[0]);
        }}
      >
        {value?.preview ? (
          <>
            <img src={value.preview} alt={`${title} preview`} />
            <span className="employee-upload-overlay"><ImageUp size={18} /> Replace image</span>
          </>
        ) : (
          <>
            <span className="employee-upload-placeholder">
              {imageShape === 'square' ? <UserRound size={25} /> : <UploadCloud size={26} />}
            </span>
            <strong>{imageShape === 'square' ? 'Upload Photo' : 'Drag & drop or click to upload'}</strong>
            <span>{imageShape === 'square' ? '1:1 square' : hint}</span>
          </>
        )}
      </button>
      {imageShape === 'square' && (
        <p className="employee-upload-hint">1:1 square, up to 2 MB (JPG &amp; PNG only)</p>
      )}
      {error && <p className="employee-create-error">{error}</p>}
      {value?.name && (
        <div className="employee-upload-file">
          <span>{value.name}</span>
          <button type="button" onClick={() => onChange(null)} aria-label={`Remove ${title.toLowerCase()}`}>
            <Trash2 size={15} />
          </button>
        </div>
      )}
    </SectionCard>
  );
}

export default function EmployeeCreate() {
  const navigate = useNavigate();
  const { items: employees, add } = useCollection(KEYS.employees);
  const { items: companyRecords } = useCollection(KEYS.companies);
  const { items: departmentRecords } = useCollection(KEYS.departments);
  const { items: designationRecords } = useCollection(KEYS.designations);
  const { items: roleRecords } = useCollection(KEYS.roles);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '+8801000000000',
    gender: '',
    dateOfBirth: '',
    religion: '',
    isActive: true,
    employeeId: '',
    department: '',
    designation: '',
    joiningDate: '',
    employeeStatus: '',
    notes: '',
    password: '',
    confirmPassword: '',
  });
  const [companies, setCompanies] = useState(['DGL']);
  const [roles, setRoles] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [signature, setSignature] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [imageError, setImageError] = useState('');
  const [signatureError, setSignatureError] = useState('');

  const departments = useMemo(
    () => (departmentRecords.length ? departmentRecords : departmentsSeed).map(({ name }) => ({ value: name, label: name })),
    [departmentRecords]
  );
  const designations = useMemo(
    () => (designationRecords.length ? designationRecords : designationsSeed).map(({ name }) => ({ value: name, label: name })),
    [designationRecords]
  );
  const companyOptions = useMemo(
    () => (companyRecords.length ? companyRecords : companiesSeed)
      .map(({ shortName, name, id }) => ({ value: shortName || id || name, label: name })),
    [companyRecords]
  );
  const roleOptions = useMemo(
    () => (roleRecords.length ? roleRecords : rolesSeed).map(({ id, name }) => ({ value: id, label: name })),
    [roleRecords]
  );

  const updateForm = (key, value) => {
    setForm((previous) => ({ ...previous, [key]: value }));
    if (errors[key]) setErrors((previous) => ({ ...previous, [key]: '' }));
  };

  const handleUpload = (file, type) => {
    const setError = type === 'profile' ? setImageError : setSignatureError;
    const setValue = type === 'profile' ? setProfileImage : setSignature;
    setError('');
    if (!file) {
      setValue(null);
      return;
    }

    const allowedTypes = type === 'profile'
      ? ['image/jpeg', 'image/png']
      : ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError(type === 'profile' ? 'Choose a JPG or PNG image.' : 'Choose a JPG, PNG, WEBP, or GIF image.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be 2 MB or smaller.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setValue({ name: file.name, preview: reader.result });
      } else {
        setError('The selected image could not be read.');
      }
    };
    reader.onerror = () => setError('The selected image could not be read.');
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = {};
    if (!form.firstName.trim()) validationErrors.firstName = 'First name is required.';
    if (!form.lastName.trim()) validationErrors.lastName = 'Last name is required.';
    if (!form.email.trim()) validationErrors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) validationErrors.email = 'Enter a valid email address.';
    else if (employees.some((employee) => employee.email?.toLowerCase() === form.email.trim().toLowerCase())) {
      validationErrors.email = 'An employee with this email already exists.';
    }
    if (form.employeeId.trim() && employees.some(
      (employee) => employee.employeeId?.toLowerCase() === form.employeeId.trim().toLowerCase()
    )) {
      validationErrors.employeeId = 'This employee ID is already in use.';
    }
    if (!form.gender) validationErrors.gender = 'Select a gender.';
    if (!form.joiningDate) validationErrors.joiningDate = 'Joining date is required.';
    if (!form.employeeStatus) validationErrors.employeeStatus = 'Select an employee status.';
    if (!form.password) validationErrors.password = 'Password is required.';
    if (form.password && form.password.length < 6) validationErrors.password = 'Password must be at least 6 characters.';
    if (!form.confirmPassword) validationErrors.confirmPassword = 'Confirm your password.';
    else if (form.password !== form.confirmPassword) validationErrors.confirmPassword = 'Passwords do not match.';
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;

    const name = `${form.firstName.trim()} ${form.lastName.trim()}`;
    let employeeId = form.employeeId.trim();
    if (!employeeId) {
      let sequence = employees.length + 1;
      employeeId = `EMP${String(sequence).padStart(4, '0')}`;
      while (employees.some((employee) => employee.employeeId === employeeId)) {
        sequence += 1;
        employeeId = `EMP${String(sequence).padStart(4, '0')}`;
      }
    }
    add({
      name,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      employeeId,
      email: form.email.trim(),
      phone: form.phone.trim(),
      gender: form.gender,
      dateOfBirth: form.dateOfBirth,
      religion: form.religion,
      companies,
      department: form.department,
      designation: form.designation,
      joiningDate: form.joiningDate,
      employeeStatus: form.employeeStatus,
      status: form.isActive ? 'Active' : 'Inactive',
      isActive: form.isActive,
      roles,
      notes: form.notes.trim(),
      profileImage: profileImage?.preview || '',
      signature: signature?.preview || '',
    });
    navigate('/employee/');
  };

  return (
    <>
      <Breadcrumb
        label="Create"
        icon={BadgePlus}
        parents={[{ label: 'Employees', to: '/employee/', icon: ContactRound }]}
      />
      <section className="employee-create-shell">
        <header className="employee-create-banner">
          <div className="employee-create-banner-title">
            <span><UserRound size={20} /></span>
            <h1>Create New Employee</h1>
          </div>
          <div className="employee-create-banner-actions">
            <button type="button" className="employee-create-back" onClick={() => navigate('/employee/')}>
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
            <button type="submit" form="employee-create-form" className="employee-create-submit">
              <Save size={16} />
              <span>Create</span>
            </button>
          </div>
        </header>

        <form id="employee-create-form" className="employee-create-body" onSubmit={handleSubmit} noValidate>
          <div className="employee-create-column employee-create-main-column">
            <SectionCard title="Personal Information" icon={UserRound}>
              <div className="employee-create-fields">
                <FormField label="First Name" htmlFor="employee-first-name" required error={errors.firstName}>
                  <InputControl icon={UserRound} error={errors.firstName}>
                    <input
                      id="employee-first-name"
                      autoComplete="given-name"
                      placeholder="Enter first name"
                      value={form.firstName}
                      onChange={(event) => updateForm('firstName', event.target.value)}
                      aria-invalid={Boolean(errors.firstName)}
                    />
                  </InputControl>
                </FormField>
                <FormField label="Last Name" htmlFor="employee-last-name" required error={errors.lastName}>
                  <InputControl icon={UserRound} error={errors.lastName}>
                    <input
                      id="employee-last-name"
                      autoComplete="family-name"
                      placeholder="Enter last name"
                      value={form.lastName}
                      onChange={(event) => updateForm('lastName', event.target.value)}
                      aria-invalid={Boolean(errors.lastName)}
                    />
                  </InputControl>
                </FormField>
                <FormField label="Email" htmlFor="employee-email" required error={errors.email}>
                  <InputControl icon={Mail} error={errors.email}>
                    <input
                      id="employee-email"
                      type="email"
                      autoComplete="email"
                      placeholder="Enter email"
                      value={form.email}
                      onChange={(event) => updateForm('email', event.target.value)}
                      aria-invalid={Boolean(errors.email)}
                    />
                  </InputControl>
                </FormField>
                <FormField label="Phone" htmlFor="employee-phone">
                  <InputControl icon={Phone}>
                    <input
                      id="employee-phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+8801000000000"
                      value={form.phone}
                      onChange={(event) => updateForm('phone', event.target.value)}
                    />
                  </InputControl>
                </FormField>
                <FormField label="Gender" htmlFor="employee-gender" required error={errors.gender}>
                  <SelectControl
                    id="employee-gender"
                    icon={UserRound}
                    value={form.gender}
                    onChange={(value) => updateForm('gender', value)}
                    options={genders.map((value) => ({ value, label: value }))}
                    placeholder="Select gender"
                    required
                  />
                </FormField>
                <FormField label="Date of Birth" htmlFor="employee-date-of-birth">
                  <InputControl icon={CalendarDays}>
                    <input
                      id="employee-date-of-birth"
                      type="date"
                      value={form.dateOfBirth}
                      onChange={(event) => updateForm('dateOfBirth', event.target.value)}
                    />
                  </InputControl>
                </FormField>
                <FormField label="Religion" htmlFor="employee-religion">
                  <SelectControl
                    id="employee-religion"
                    icon={Globe2}
                    value={form.religion}
                    onChange={(value) => updateForm('religion', value)}
                    options={religions.map((value) => ({ value, label: value }))}
                    placeholder="Select religion"
                  />
                </FormField>
                <div className="employee-create-field employee-create-active-field">
                  <span className="employee-create-label">Active</span>
                  <label className="employee-create-checkbox">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(event) => updateForm('isActive', event.target.checked)}
                    />
                    <span className="employee-checkbox-custom">{form.isActive && <Check size={12} />}</span>
                    <span>Is active ?</span>
                  </label>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Company Access" icon={Building2}>
              <TransferPicker
                title="companies"
                items={companyOptions}
                selected={companies}
                onChange={setCompanies}
                emptyMessage="No companies found"
              />
            </SectionCard>

            <SectionCard title="Employment Information" icon={BriefcaseBusiness}>
              <div className="employee-create-fields">
                <FormField label="Employee ID" htmlFor="employee-id" className="employee-create-field-full" error={errors.employeeId}>
                  <InputControl icon={IdCard} error={errors.employeeId}>
                    <input
                      id="employee-id"
                      placeholder="Auto-generated if left blank"
                      value={form.employeeId}
                      onChange={(event) => updateForm('employeeId', event.target.value)}
                    />
                  </InputControl>
                </FormField>
                <FormField label="Department" htmlFor="employee-department">
                  <SelectControl
                    id="employee-department"
                    icon={Network}
                    value={form.department}
                    onChange={(value) => updateForm('department', value)}
                    options={departments}
                    placeholder="Select department"
                  />
                </FormField>
                <FormField label="Designation" htmlFor="employee-designation">
                  <SelectControl
                    id="employee-designation"
                    icon={BriefcaseBusiness}
                    value={form.designation}
                    onChange={(value) => updateForm('designation', value)}
                    options={designations}
                    placeholder="Select designation"
                  />
                </FormField>
                <FormField label="Joining Date" htmlFor="employee-joining-date" required error={errors.joiningDate}>
                  <InputControl icon={CalendarDays} error={errors.joiningDate}>
                    <input
                      id="employee-joining-date"
                      type="date"
                      value={form.joiningDate}
                      onChange={(event) => updateForm('joiningDate', event.target.value)}
                      aria-invalid={Boolean(errors.joiningDate)}
                    />
                  </InputControl>
                </FormField>
                <FormField label="Employee Status" htmlFor="employee-status" required error={errors.employeeStatus}>
                  <SelectControl
                    id="employee-status"
                    icon={ContactRound}
                    value={form.employeeStatus}
                    onChange={(value) => updateForm('employeeStatus', value)}
                    options={employeeStatuses.map((value) => ({ value, label: value }))}
                    placeholder="Select employee status"
                    required
                  />
                </FormField>
              </div>
            </SectionCard>

            <SectionCard title="Account Roles & Permissions Set" icon={Shield}>
              <TransferPicker
                title="roles"
                items={roleOptions}
                selected={roles}
                onChange={setRoles}
                emptyMessage="No roles found"
              />
            </SectionCard>
          </div>

          <aside className="employee-create-column employee-create-aside">
            <UploadCard
              title="Profile Image"
              icon={ImageUp}
              accept="image/jpeg,image/png"
              value={profileImage}
              onChange={(file) => handleUpload(file, 'profile')}
              error={imageError}
              imageShape="square"
            />
            <UploadCard
              title="Signature"
              icon={Tag}
              accept="image/jpeg,image/png,image/webp,image/gif"
              caption={<>Signature (<span>Upload signature image</span>)</>}
              value={signature}
              onChange={(file) => handleUpload(file, 'signature')}
              error={signatureError}
              imageShape="wide"
              hint="Images (JPG, PNG, WEBP, GIF) • Max 2.0 MB"
            />
            <SectionCard title="Password" icon={LockKeyhole}>
              <div className="employee-create-password-fields">
                <FormField label="Password" htmlFor="employee-password" required error={errors.password}>
                  <InputControl icon={LockKeyhole} error={errors.password} className="employee-password-control">
                    <input
                      id="employee-password"
                      type={passwordVisible ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Enter password"
                      value={form.password}
                      onChange={(event) => updateForm('password', event.target.value)}
                      aria-invalid={Boolean(errors.password)}
                    />
                    <button
                      type="button"
                      className="employee-password-toggle"
                      aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                      onClick={() => setPasswordVisible((visible) => !visible)}
                    >
                      {passwordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </InputControl>
                </FormField>
                <FormField label="Confirm Password" htmlFor="employee-confirm-password" required error={errors.confirmPassword}>
                  <InputControl icon={LockKeyhole} error={errors.confirmPassword} className="employee-password-control">
                    <input
                      id="employee-confirm-password"
                      type={confirmPasswordVisible ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Enter confirm password"
                      value={form.confirmPassword}
                      onChange={(event) => updateForm('confirmPassword', event.target.value)}
                      aria-invalid={Boolean(errors.confirmPassword)}
                    />
                    <button
                      type="button"
                      className="employee-password-toggle"
                      aria-label={confirmPasswordVisible ? 'Hide password' : 'Show password'}
                      onClick={() => setConfirmPasswordVisible((visible) => !visible)}
                    >
                      {confirmPasswordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </InputControl>
                </FormField>
              </div>
            </SectionCard>
            <SectionCard title="Employee Notes" icon={FileText}>
              <label className="employee-notes-wrap" htmlFor="employee-notes">
                <FileText size={15} aria-hidden="true" />
                <textarea
                  id="employee-notes"
                  placeholder="Write employee notes..."
                  maxLength={500}
                  value={form.notes}
                  onChange={(event) => updateForm('notes', event.target.value)}
                />
              </label>
              <div className="employee-notes-footer">
                <span>You can write up to 500 characters.</span>
                <span>{form.notes.length}/500</span>
              </div>
            </SectionCard>
          </aside>
        </form>
      </section>
    </>
  );
}
