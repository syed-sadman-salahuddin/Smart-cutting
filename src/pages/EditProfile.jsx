import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarDays,
  Camera,
  Check,
  ChevronRight,
  Home,
  Mail,
  Pencil,
  Phone,
  Save,
  UserRound,
  X,
} from 'lucide-react';
import { useCurrentUser } from '../hooks/useCurrentUser';
import '../styles/profile-edit.css';

const MAX_PHOTO_SIZE = 2 * 1024 * 1024;

function getDateInputValue(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDate(value) {
  if (!value) return '';
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getNameParts(name) {
  const parts = (name || '').trim().split(/\s+/);
  return {
    firstName: parts.slice(0, -1).join(' '),
    lastName: parts.length > 1 ? parts[parts.length - 1] : '',
  };
}

function readPhoto(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('The selected photo could not be read.'));
    reader.readAsDataURL(file);
  });
}

export default function EditProfile() {
  const { t } = useTranslation();
  const currentUser = useCurrentUser();
  const navigate = useNavigate();
  const photoInput = useRef(null);
  const [formData, setFormData] = useState(() => ({
    ...getNameParts(currentUser.name),
    email: currentUser.email || '',
    phone: currentUser.phone || '',
    gender: currentUser.gender || '',
    dateOfBirth: getDateInputValue(currentUser.dateOfBirth),
  }));
  const [photo, setPhoto] = useState(currentUser.avatar || '');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const updateField = (event) => {
    setSaved(false);
    setFormData((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  };

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError('');
    setSaved(false);

    if (!file.type.startsWith('image/')) {
      setError('Choose an image file to use as your profile photo.');
      event.target.value = '';
      return;
    }
    if (file.size > MAX_PHOTO_SIZE) {
      setError('The profile photo must be 2 MB or smaller.');
      event.target.value = '';
      return;
    }

    try {
      setPhoto(await readPhoto(file));
    } catch (readError) {
      setError(readError.message);
    }
  };

  const handleSave = (event) => {
    event.preventDefault();
    setError('');
    const updates = {
      name: `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      gender: formData.gender,
      dateOfBirth: formatDate(formData.dateOfBirth),
      avatar: photo,
    };

    if (!currentUser.updateProfile(updates)) {
      setError('Your changes could not be saved. Please check available browser storage and try again.');
      return;
    }
    setSaved(true);
  };

  return (
    <section className="edit-profile-page" aria-labelledby="editProfileHeading">
      <nav className="edit-profile-breadcrumb" aria-label="Breadcrumb">
        <Link to="/superuser" className="breadcrumb-back" aria-label="Back to profile">
          <ArrowLeft size={17} />
        </Link>
        <ChevronRight size={16} className="breadcrumb-chevron" />
        <Link to="/" className="breadcrumb-link">
          <Home size={15} />
          <span>Home</span>
        </Link>
        <ChevronRight size={16} className="breadcrumb-chevron" />
        <Link to="/superuser" className="breadcrumb-link">
          <UserRound size={15} />
          <span>Profile</span>
        </Link>
        <ChevronRight size={16} className="breadcrumb-chevron" />
        <span className="breadcrumb-current">
          <Pencil size={14} />
          <span>Update</span>
        </span>
      </nav>

      <div className="edit-profile-card">
        <div className="edit-profile-header">
          <div className="edit-profile-heading">
            <span className="edit-profile-heading-icon"><UserRound size={19} /></span>
            <h1 id="editProfileHeading">{t('profile.editProfileTitle', { defaultValue: 'Edit Profile' })}</h1>
          </div>
          <div className="edit-profile-actions">
            <button type="button" className="edit-cancel-button" onClick={() => navigate('/superuser')}>
              <X size={16} />
              <span>{t('profile.cancel', { defaultValue: 'Cancel' })}</span>
            </button>
            <button type="submit" form="editProfileForm" className="edit-save-button">
              <Save size={16} />
              <span>{t('profile.saveChanges', { defaultValue: 'Save Changes' })}</span>
            </button>
          </div>
        </div>

        <form id="editProfileForm" onSubmit={handleSave} className="edit-profile-form">
          <div className="edit-profile-content">
            <section className="edit-form-card" aria-labelledby="basicInfoHeading">
              <header className="edit-form-card-header">
                <UserRound size={16} />
                <h2 id="basicInfoHeading">Basic Information</h2>
              </header>
              <div className="edit-form-fields">
                <label className="edit-field">
                  <span>First Name <b>*</b></span>
                  <span className="edit-input-wrap">
                    <UserRound size={16} />
                    <input
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={updateField}
                      autoComplete="given-name"
                      required
                    />
                  </span>
                </label>
                <label className="edit-field">
                  <span>Last Name <b>*</b></span>
                  <span className="edit-input-wrap">
                    <UserRound size={16} />
                    <input
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={updateField}
                      autoComplete="family-name"
                      required
                    />
                  </span>
                </label>
                <label className="edit-field">
                  <span>{t('profile.email', { defaultValue: 'Email' })}</span>
                  <span className="edit-input-wrap">
                    <Mail size={16} />
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={updateField}
                      autoComplete="email"
                      required
                    />
                  </span>
                </label>
                <label className="edit-field">
                  <span>{t('profile.phone', { defaultValue: 'Phone' })}</span>
                  <span className="edit-input-wrap">
                    <Phone size={16} />
                    <input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={updateField}
                      autoComplete="tel"
                    />
                  </span>
                </label>
                <fieldset className="edit-field edit-gender-field">
                  <legend>{t('profile.gender', { defaultValue: 'Gender' })}</legend>
                  {['Male', 'Female', 'Other'].map((gender) => (
                    <label key={gender} className="edit-radio-option">
                      <input
                        type="radio"
                        name="gender"
                        value={gender}
                        checked={formData.gender === gender}
                        onChange={updateField}
                      />
                      <span>{t(`profile.gender${gender}`, { defaultValue: gender === 'Other' ? 'Others' : gender })}</span>
                    </label>
                  ))}
                </fieldset>
                <label className="edit-field">
                  <span>{t('profile.dateOfBirth', { defaultValue: 'Date of Birth' })}</span>
                  <span className="edit-input-wrap">
                    <CalendarDays size={16} />
                    <input
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={updateField}
                    />
                  </span>
                </label>
              </div>
            </section>

            <section className="edit-form-card edit-photo-card" aria-labelledby="profilePhotoHeading">
              <header className="edit-form-card-header">
                <Camera size={16} />
                <h2 id="profilePhotoHeading">Profile Photo</h2>
              </header>
              <div className="edit-photo-content">
                <input
                  ref={photoInput}
                  type="file"
                  accept="image/*"
                  className="edit-photo-input"
                  onChange={handlePhotoChange}
                  aria-label="Choose a profile photo"
                />
                <button
                  type="button"
                  className="edit-photo-picker"
                  onClick={() => photoInput.current?.click()}
                  aria-label="Upload profile photo"
                >
                  {photo ? (
                    <img src={photo} alt="Profile preview" />
                  ) : (
                    <>
                      <span className="edit-photo-user"><UserRound size={25} /></span>
                      <strong>Upload Photo</strong>
                      <small>1:1 square</small>
                    </>
                  )}
                </button>
                {photo && (
                  <button type="button" className="edit-remove-photo" onClick={() => {
                    setPhoto('');
                    setSaved(false);
                  }}>
                    <X size={14} /> Remove photo
                  </button>
                )}
                <p className="edit-photo-hint">1:1 square, up to 2 MB</p>
              </div>
            </section>
          </div>
          {(error || saved) && (
            <p className={`edit-profile-feedback${error ? ' is-error' : ' is-success'}`} role={error ? 'alert' : 'status'}>
              {error || <><Check size={16} /> Profile updated successfully.</>}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
