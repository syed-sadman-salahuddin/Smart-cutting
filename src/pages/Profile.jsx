import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  UserRound,
  Pencil,
  AtSign,
  BadgeCheck,
  Wifi,
  Shield,
  User,
  Mail,
  Phone,
  Calendar,
  Hash,
  Globe,
  Clock,
  ToggleRight,
  X,
  Check,
} from 'lucide-react';
import { useCurrentUser } from '../hooks/useCurrentUser';
import '../styles/profile.css';

export default function Profile() {
  const { t } = useTranslation();
  const currentUser = useCurrentUser();
  const [isEditing, setIsEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Form state for editing
  const [formData, setFormData] = useState({
    name: currentUser.name || 'Syed Sadman Salahuddin',
    email: currentUser.email || 'superuser@test.com',
    phone: currentUser.phone || '+8801500000001',
    gender: currentUser.gender || 'Male',
    dateOfBirth: currentUser.dateOfBirth || 'Oct 19, 2002',
    age: currentUser.age || '24',
    religion: currentUser.religion || 'Islam',
  });

  const handleOpenEdit = () => {
    setFormData({
      name: currentUser.name || 'Syed Sadman Salahuddin',
      email: currentUser.email || 'superuser@test.com',
      phone: currentUser.phone || '+8801500000001',
      gender: currentUser.gender || 'Male',
      dateOfBirth: currentUser.dateOfBirth || 'Oct 19, 2002',
      age: currentUser.age || '24',
      religion: currentUser.religion || 'Islam',
    });
    setIsEditing(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (currentUser.updateProfile) {
      currentUser.updateProfile(formData);
    }
    setIsEditing(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const statusList = [
    { key: 'active', label: t('profile.active', { defaultValue: 'Active' }) },
    { key: 'admin', label: t('profile.admin', { defaultValue: 'Admin' }) },
    { key: 'superuser', label: t('profile.superuser', { defaultValue: 'Superuser' }) },
    { key: 'verified', label: t('profile.verified', { defaultValue: 'Verified' }) },
    { key: 'emailVerified', label: t('profile.emailVerified', { defaultValue: 'Email Verified' }) },
    { key: 'phoneVerified', label: t('profile.phoneVerified', { defaultValue: 'Phone Verified' }) },
  ];

  return (
    <div className="profile-card-shell">
      {/* ---------- Top Banner ---------- */}
      <div className="profile-banner">
        <div className="profile-banner-content">
          <div className="profile-banner-left">
            <div className="profile-banner-icon">
              <UserRound size={20} />
            </div>
            <h1 className="profile-banner-title">{currentUser.name}</h1>
          </div>

          <div className="profile-banner-actions">
            <button
              type="button"
              className="profile-edit-btn"
              onClick={handleOpenEdit}
              id="editProfileBtn"
            >
              <Pencil size={15} />
              <span>{t('profile.editProfile', { defaultValue: 'Edit Profile' })}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ---------- Profile Body ---------- */}
      <div className="profile-body">
        {/* Hero Section: Avatar + Handle + Badges */}
        <div className="profile-hero">
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar-box">
              <div className="profile-avatar-inner">
                <span className="profile-avatar-letter">{currentUser.initial}</span>
              </div>
            </div>
          </div>

          <div className="profile-hero-meta">
            <div className="profile-username-row">
              <AtSign size={14} />
              <span>{currentUser.username || 'superuser'}</span>
              <BadgeCheck size={16} className="profile-verified-badge" />
            </div>

            <div className="profile-tags-row">
              <span className="profile-badge-pill badge-active">
                <Wifi size={12} />
                <span>{t('profile.active', { defaultValue: 'Active' })}</span>
              </span>
              <span className="profile-badge-pill badge-superadmin">
                <Shield size={12} />
                <span>{t('profile.superAdmin', { defaultValue: 'Super Admin' })}</span>
              </span>
            </div>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="profile-grid">
          {/* Left Column (Personal Info, Religion, Roles) */}
          <div className="profile-grid-left">
            {/* 1. Personal Information Card */}
            <div className="profile-subcard">
              <div className="profile-subcard-header">
                <div className="profile-subcard-title-group">
                  <div className="subcard-icon-badge icon-blue">
                    <User size={16} />
                  </div>
                  <h2 className="profile-subcard-title">
                    {t('profile.personalInfo', { defaultValue: 'Personal Information' })}
                  </h2>
                </div>
              </div>

              <div className="profile-subcard-body">
                <div className="profile-fields-grid">
                  {/* Full Name */}
                  <div className="profile-field-item">
                    <div className="field-item-icon icon-blue">
                      <User size={14} />
                    </div>
                    <div className="field-item-text">
                      <p className="field-item-label">{t('profile.fullName', { defaultValue: 'FULL NAME' })}</p>
                      <p className="field-item-value">{currentUser.name}</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="profile-field-item">
                    <div className="field-item-icon icon-indigo">
                      <Mail size={14} />
                    </div>
                    <div className="field-item-text">
                      <p className="field-item-label">{t('profile.email', { defaultValue: 'EMAIL' })}</p>
                      <p className="field-item-value">{currentUser.email}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="profile-field-item">
                    <div className="field-item-icon icon-green">
                      <Phone size={14} />
                    </div>
                    <div className="field-item-text">
                      <p className="field-item-label">{t('profile.phone', { defaultValue: 'PHONE' })}</p>
                      <p className="field-item-value">{currentUser.phone || '+8801500000001'}</p>
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="profile-field-item">
                    <div className="field-item-icon icon-pink">
                      <User size={14} />
                    </div>
                    <div className="field-item-text">
                      <p className="field-item-label">{t('profile.gender', { defaultValue: 'GENDER' })}</p>
                      <p className="field-item-value">{currentUser.gender || 'Male'}</p>
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div className="profile-field-item">
                    <div className="field-item-icon icon-orange">
                      <Calendar size={14} />
                    </div>
                    <div className="field-item-text">
                      <p className="field-item-label">{t('profile.dateOfBirth', { defaultValue: 'DATE OF BIRTH' })}</p>
                      <p className="field-item-value">{currentUser.dateOfBirth || 'Oct 19, 2002'}</p>
                    </div>
                  </div>

                  {/* Age */}
                  <div className="profile-field-item">
                    <div className="field-item-icon icon-purple">
                      <Hash size={14} />
                    </div>
                    <div className="field-item-text">
                      <p className="field-item-label">{t('profile.age', { defaultValue: 'AGE' })}</p>
                      <p className="field-item-value">{currentUser.age || '24'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Religion Card */}
            <div className="profile-subcard">
              <div className="profile-subcard-header">
                <div className="profile-subcard-title-group">
                  <div className="subcard-icon-badge icon-emerald">
                    <Globe size={16} />
                  </div>
                  <h2 className="profile-subcard-title">{t('profile.religion', { defaultValue: 'Religion' })}</h2>
                </div>
              </div>

              <div className="profile-subcard-body">
                <div className="profile-fields-grid">
                  <div className="profile-field-item">
                    <div className="field-item-icon icon-emerald">
                      <Globe size={14} />
                    </div>
                    <div className="field-item-text">
                      <p className="field-item-label">{t('profile.religion', { defaultValue: 'RELIGION' })}</p>
                      <p className="field-item-value">{currentUser.religion || 'Islam'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Roles Card */}
            <div className="profile-subcard">
              <div className="profile-subcard-header">
                <div className="profile-subcard-title-group">
                  <div className="subcard-icon-badge icon-purple">
                    <Shield size={16} />
                  </div>
                  <h2 className="profile-subcard-title">{t('profile.roles', { defaultValue: 'Roles' })}</h2>
                </div>
                <span className="subcard-count-badge">{(currentUser.roles || ['HR & Admin']).length}</span>
              </div>

              <div className="profile-subcard-body">
                <div className="roles-container">
                  {(currentUser.roles || ['HR & Admin']).map((role, idx) => (
                    <span key={idx} className="role-pill">
                      <Shield size={14} />
                      <span>{role}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Activity, Account Status) */}
          <div className="profile-grid-right">
            {/* 1. Activity Card */}
            <div className="profile-subcard">
              <div className="profile-subcard-header">
                <div className="profile-subcard-title-group">
                  <div className="subcard-icon-badge icon-sky">
                    <Clock size={16} />
                  </div>
                  <h2 className="profile-subcard-title">{t('profile.activity', { defaultValue: 'Activity' })}</h2>
                </div>
              </div>

              <div className="profile-subcard-body">
                <div className="activity-timeline">
                  {/* Joined */}
                  <div className="timeline-item">
                    <div className="timeline-track">
                      <span className="timeline-dot timeline-dot-green" />
                      <span className="timeline-line" />
                    </div>
                    <div className="timeline-content">
                      <p className="timeline-label">{t('profile.joined', { defaultValue: 'JOINED' })}</p>
                      <p className="timeline-value">{currentUser.joined || 'Sep 17, 2026, 02:47 PM'}</p>
                    </div>
                  </div>

                  {/* Last Updated */}
                  <div className="timeline-item">
                    <div className="timeline-track">
                      <span className="timeline-dot timeline-dot-blue" />
                      <span className="timeline-line" />
                    </div>
                    <div className="timeline-content">
                      <p className="timeline-label">{t('profile.lastUpdated', { defaultValue: 'LAST UPDATED' })}</p>
                      <p className="timeline-value">{currentUser.lastUpdated || 'Oct 19, 2026, 02:27 PM'}</p>
                    </div>
                  </div>

                  {/* Last Active */}
                  <div className="timeline-item">
                    <div className="timeline-track">
                      <span className="timeline-dot timeline-dot-amber" />
                    </div>
                    <div className="timeline-content">
                      <p className="timeline-label">{t('profile.lastActive', { defaultValue: 'LAST ACTIVE' })}</p>
                      <p className="timeline-value">{currentUser.lastActive || 'Oct 19, 2026, 02:27 PM'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Account Status Card */}
            <div className="profile-subcard">
              <div className="profile-subcard-header">
                <div className="profile-subcard-title-group">
                  <div className="subcard-icon-badge icon-green">
                    <Shield size={16} />
                  </div>
                  <h2 className="profile-subcard-title">
                    {t('profile.accountStatus', { defaultValue: 'Account Status' })}
                  </h2>
                </div>
              </div>

              <div className="profile-subcard-body">
                <div className="account-status-grid">
                  {statusList.map((st) => (
                    <div key={st.key} className="status-badge-card">
                      <ToggleRight size={16} className="status-badge-icon" />
                      <span className="status-badge-label">{st.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Edit Profile Modal ---------- */}
      {isEditing && (
        <div className="profile-modal-backdrop" onClick={() => setIsEditing(false)}>
          <div className="profile-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <div className="modal-header-title">
                <Pencil size={18} />
                <span>{t('profile.editProfileTitle', { defaultValue: 'Edit Profile' })}</span>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsEditing(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="profile-modal-body">
                <div className="modal-form-grid">
                  <div className="form-group modal-span-2">
                    <label className="form-label">{t('profile.fullName', { defaultValue: 'Full Name' })}</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('profile.email', { defaultValue: 'Email' })}</label>
                    <input
                      type="email"
                      className="form-input"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('profile.phone', { defaultValue: 'Phone' })}</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('profile.gender', { defaultValue: 'Gender' })}</label>
                    <select
                      className="form-select"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    >
                      <option value="Male">{t('profile.genderMale', { defaultValue: 'Male' })}</option>
                      <option value="Female">{t('profile.genderFemale', { defaultValue: 'Female' })}</option>
                      <option value="Other">{t('profile.genderOther', { defaultValue: 'Other' })}</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('profile.age', { defaultValue: 'Age' })}</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      {t('profile.dateOfBirth', { defaultValue: 'Date of Birth' })}
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('profile.religion', { defaultValue: 'Religion' })}</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.religion}
                      onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="profile-modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsEditing(false)}
                >
                  {t('profile.cancel', { defaultValue: 'Cancel' })}
                </button>
                <button type="submit" className="btn-primary">
                  {t('profile.saveChanges', { defaultValue: 'Save Changes' })}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------- Success Toast ---------- */}
      {showToast && (
        <div className="profile-toast">
          <Check size={18} />
          <span>{t('profile.profileUpdated', { defaultValue: 'Profile updated successfully!' })}</span>
        </div>
      )}
    </div>
  );
}
