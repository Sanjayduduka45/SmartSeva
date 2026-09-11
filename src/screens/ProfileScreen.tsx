import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ScreenType } from '../types';

interface ProfileScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onNavigate,
  onLogout
}) => {
  const { t } = useLanguage();
  const { user, logout, updateProfile, getUserInitials } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState(user?.fullName || '');
  const [editMobile, setEditMobile] = useState(user?.mobileNumber || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');

  const displayName = user?.fullName || 'Citizen User';
  const initials = getUserInitials(displayName);

  // Dynamic Profile Completeness Calculation
  const hasName = !!user?.fullName && user.fullName.trim().length > 1;
  const hasMobile = !!user?.mobileNumber && user.mobileNumber.replace(/\D/g, '').length === 10;
  const hasEmail = !!user?.email && user.email.includes('@');

  const completenessPercentage = (hasName ? 30 : 0) + (hasMobile ? 35 : 0) + (hasEmail ? 35 : 0);

  const getCompletenessHint = () => {
    if (completenessPercentage === 100) {
      return 'Your profile is 100% complete and ready for all government service preparations!';
    }
    const missing: string[] = [];
    if (!hasMobile) missing.push('a mobile number for instant SMS alerts');
    if (!hasEmail) missing.push('an email address for electronic preparation summaries');
    return `Add ${missing.join(' and ')} to reach 100% profile completeness.`;
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    onLogout();
  };

  const handleOpenEdit = () => {
    setEditName(user?.fullName || '');
    setEditMobile(user?.mobileNumber || '');
    setEditEmail(user?.email || '');
    setEditError('');
    setEditSuccess('');
    setShowEditModal(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setEditError('');
    setEditSuccess('');

    if (!editName || editName.trim().length < 2) {
      setEditError('Please enter your full legal name.');
      return;
    }

    let cleanMobile = editMobile.replace(/\D/g, '');
    if (cleanMobile && cleanMobile.length !== 10) {
      setEditError('Mobile number must be a valid 10-digit number.');
      return;
    }

    let cleanEmail = editEmail.trim().toLowerCase();
    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setEditError('Please enter a valid email address.');
      return;
    }

    updateProfile({
      fullName: editName.trim(),
      mobileNumber: cleanMobile || undefined,
      email: cleanEmail || undefined
    });

    setEditSuccess('Profile details updated successfully!');
    setTimeout(() => {
      setShowEditModal(false);
      setEditSuccess('');
    }, 1000);
  };

  return (
    <div className="bg-[#f8f9ff] text-[#121c28] min-h-screen pb-28 md:pb-12 max-w-full overflow-x-hidden font-sans">
      {/* Top Header */}
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-[#c3c6d1]">
        <div className="flex justify-between items-center px-4 md:px-8 h-16 w-full max-w-3xl mx-auto">
          <h1 className="font-bold text-xl text-[#001e40] tracking-tight">{t('profile', 'Profile')}</h1>
          <button
            type="button"
            onClick={() => onNavigate('settings')}
            className="min-w-[44px] min-h-[44px] rounded-full hover:bg-[#eef4ff] text-[#001e40] flex items-center justify-center transition-colors focus:ring-2 focus:ring-[#005db6] focus:outline-none"
            aria-label={t('settings_preferences', 'Settings & Preferences')}
          >
            <span className="material-symbols-outlined text-2xl">settings</span>
          </button>
        </div>
      </header>

      <main className="w-full max-w-3xl mx-auto px-4 py-6 flex flex-col gap-5">
        {/* User Info & Dynamic Profile Completeness Card */}
        <section className="bg-white border border-[#c3c6d1] rounded-2xl p-6 shadow-xs flex flex-col items-center text-center relative overflow-hidden">
          {/* Avatar with Initials */}
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-full bg-[#001e40] text-white flex items-center justify-center font-extrabold text-2xl border-4 border-[#eef4ff] shadow-xs">
              {initials}
            </div>
            <span
              title={t('verified_citizen', 'Verified Citizen')}
              className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs border-2 border-white shadow-xs"
            >
              <span className="material-symbols-outlined text-sm font-extrabold">check</span>
            </span>
          </div>

          <h2 className="text-xl font-bold text-[#001e40] tracking-tight flex items-center gap-2">
            <span>{displayName}</span>
            <button
              type="button"
              onClick={handleOpenEdit}
              className="p-1 rounded-md text-[#005db6] hover:bg-[#eef4ff] transition-colors"
              title={t('edit_profile', 'Edit Profile')}
            >
              <span className="material-symbols-outlined text-lg">edit</span>
            </button>
          </h2>

          {/* Contact Details Badges */}
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-[#43474f]">
            {hasMobile ? (
              <span className="inline-flex items-center gap-1 bg-[#eef4ff] text-[#001e40] px-2.5 py-1 rounded-lg border border-[#c3c6d1]/60">
                <span className="material-symbols-outlined text-sm text-[#005db6]">smartphone</span>
                +91 {user?.mobileNumber}
              </span>
            ) : (
              <button
                type="button"
                onClick={handleOpenEdit}
                className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg border border-amber-200 hover:bg-amber-100 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">add_call</span>
                + Add Mobile Number
              </button>
            )}

            {hasEmail ? (
              <span className="inline-flex items-center gap-1 bg-[#eef4ff] text-[#001e40] px-2.5 py-1 rounded-lg border border-[#c3c6d1]/60">
                <span className="material-symbols-outlined text-sm text-[#005db6]">mail</span>
                {user?.email}
              </span>
            ) : (
              <button
                type="button"
                onClick={handleOpenEdit}
                className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg border border-amber-200 hover:bg-amber-100 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">add_to_photos</span>
                + Add Email Address
              </button>
            )}

            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200 font-semibold">
              <span className="material-symbols-outlined text-sm text-emerald-600">verified</span>
              {t('verified_citizen', 'Verified Citizen')}
            </span>
          </div>

          {/* Dynamic Profile Completeness Bar */}
          <div className="mt-5 w-full bg-[#f8f9ff] p-4 rounded-xl border border-[#c3c6d1]/80 flex flex-col gap-2 text-left">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-[#001e40]">{t('profile_completeness', 'Profile Completeness')}</span>
              <span className="text-[#005db6] font-extrabold">{completenessPercentage}% {t('profile_pct_ready', 'Ready')}</span>
            </div>

            <div className="w-full bg-[#c3c6d1]/40 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-[#005db6] h-full rounded-full transition-all duration-500"
                style={{ width: `${completenessPercentage}%` }}
              />
            </div>

            <p className="text-[12px] text-[#43474f] mt-0.5 leading-relaxed">
              {getCompletenessHint()}
            </p>
          </div>
        </section>

        {/* Personal Records Section */}
        <section className="bg-white border border-[#c3c6d1] rounded-2xl p-4 shadow-xs">
          <h3 className="font-extrabold text-xs text-[#001e40] mb-3 px-2 uppercase tracking-wider">
            {t('personal_records', 'Personal Records')}
          </h3>
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => onNavigate('document_checklist')}
              className="w-full min-h-[52px] p-3 rounded-xl hover:bg-[#eef4ff] transition-colors flex items-center justify-between text-left focus:ring-2 focus:ring-[#005db6] focus:outline-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#eef4ff] text-[#001e40] flex items-center justify-center shrink-0 border border-[#c3c6d1]/60">
                  <span className="material-symbols-outlined text-xl">fact_check</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-[#121c28]">{t('document_checklist', 'Document Checklist')}</div>
                  <div className="text-xs text-[#43474f]">{t('doc_checklist_desc', 'View & update document availability')}</div>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#737780]">chevron_right</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('preparation_plan')}
              className="w-full min-h-[52px] p-3 rounded-xl hover:bg-[#eef4ff] transition-colors flex items-center justify-between text-left focus:ring-2 focus:ring-[#005db6] focus:outline-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#eef4ff] text-[#001e40] flex items-center justify-center shrink-0 border border-[#c3c6d1]/60">
                  <span className="material-symbols-outlined text-xl">assignment</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-[#121c28]">{t('saved_preparation_plans', 'Saved Preparation Plans')}</div>
                  <div className="text-xs text-[#43474f]">{t('saved_plans_desc', 'Step-by-step guides for government visits')}</div>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#737780]">chevron_right</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('completion')}
              className="w-full min-h-[52px] p-3 rounded-xl hover:bg-[#eef4ff] transition-colors flex items-center justify-between text-left focus:ring-2 focus:ring-[#005db6] focus:outline-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#eef4ff] text-[#001e40] flex items-center justify-center shrink-0 border border-[#c3c6d1]/60">
                  <span className="material-symbols-outlined text-xl">verified</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-[#121c28]">{t('completed_preparations', 'Completed Preparations')}</div>
                  <div className="text-xs text-[#43474f]">{t('completed_preparations_desc', 'Saved readiness summaries & history')}</div>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#737780]">chevron_right</span>
            </button>
          </div>
        </section>

        {/* Preferences & Support Section */}
        <section className="bg-white border border-[#c3c6d1] rounded-2xl p-4 shadow-xs">
          <h3 className="font-extrabold text-xs text-[#001e40] mb-3 px-2 uppercase tracking-wider">
            {t('preferences_support', 'Preferences & Support')}
          </h3>
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => onNavigate('settings')}
              className="w-full min-h-[52px] p-3 rounded-xl hover:bg-[#eef4ff] transition-colors flex items-center justify-between text-left focus:ring-2 focus:ring-[#005db6] focus:outline-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#eef4ff] text-[#001e40] flex items-center justify-center shrink-0 border border-[#c3c6d1]/60">
                  <span className="material-symbols-outlined text-xl">settings</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-[#121c28]">{t('settings_preferences', 'Settings & Preferences')}</div>
                  <div className="text-xs text-[#43474f]">{t('settings_desc', 'Manage language, notifications & account preferences')}</div>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#737780]">chevron_right</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('help_support')}
              className="w-full min-h-[52px] p-3 rounded-xl hover:bg-[#eef4ff] transition-colors flex items-center justify-between text-left focus:ring-2 focus:ring-[#005db6] focus:outline-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#eef4ff] text-[#001e40] flex items-center justify-center shrink-0 border border-[#c3c6d1]/60">
                  <span className="material-symbols-outlined text-xl">help</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-[#121c28]">{t('help_and_support', 'Help & Support')}</div>
                  <div className="text-xs text-[#43474f]">{t('help_desc', 'Get answers, preparation guidance & helpline')}</div>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#737780]">chevron_right</span>
            </button>
          </div>
        </section>

        {/* Sign Out Button */}
        <button
          type="button"
          onClick={() => setShowLogoutModal(true)}
          className="w-full min-h-[48px] bg-white border border-[#ba1a1a] text-[#ba1a1a] rounded-xl font-bold text-sm hover:bg-rose-50 transition-colors flex items-center justify-center gap-2 shadow-2xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
        >
          <span className="material-symbols-outlined">logout</span>
          {t('sign_out', 'Sign Out')}
        </button>
      </main>

      {/* Edit Profile Modal Dialog */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#c3c6d1] p-6 max-w-md w-full shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-[#c3c6d1] pb-3">
              <h3 className="text-lg font-bold text-[#001e40]">{t('update_profile_title', 'Update Citizen Profile')}</h3>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="p-1 rounded-full text-[#737780] hover:bg-[#f8f9ff]"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {editError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-[#ba1a1a] font-medium flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">error</span>
                  <span>{editError}</span>
                </div>
              )}

              {editSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">check_circle</span>
                  <span>{editSuccess}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#001e40] mb-1">
                  {t('full_name_label', 'Full Legal Name')} <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Rajesh Kumar"
                  className="w-full min-h-[44px] px-3 rounded-xl border border-[#c3c6d1] text-sm focus:ring-2 focus:ring-[#005db6] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#001e40] mb-1">
                  {t('mobile_number_label', 'Mobile Number')} (Optional)
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-bold text-[#43474f]">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={editMobile}
                    onChange={(e) => setEditMobile(e.target.value.replace(/\D/g, ''))}
                    placeholder="10-digit mobile number"
                    className="w-full min-h-[44px] pl-12 pr-3 rounded-xl border border-[#c3c6d1] text-sm focus:ring-2 focus:ring-[#005db6] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#001e40] mb-1">
                  {t('email_address_label', 'Email Address')} (Optional)
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="e.g. citizen@example.com"
                  className="w-full min-h-[44px] px-3 rounded-xl border border-[#c3c6d1] text-sm focus:ring-2 focus:ring-[#005db6] focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 min-h-[44px] bg-[#eef4ff] text-[#001e40] rounded-xl font-bold text-xs hover:bg-[#d9e3f4] transition-colors"
                >
                  {t('cancel', 'Cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 min-h-[44px] bg-[#005db6] text-white rounded-xl font-bold text-xs hover:bg-[#004a93] transition-colors shadow-xs"
                >
                  {t('save', 'Save Changes')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sign Out Confirmation Modal Dialog */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#c3c6d1] p-6 max-w-sm w-full shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-[#ba1a1a] flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">logout</span>
            </div>

            <div className="text-center space-y-1">
              <h4 className="text-lg font-bold text-[#001e40]">{t('sign_out_confirm_title', 'Sign out of SmartSeva?')}</h4>
              <p className="text-xs text-[#43474f] leading-relaxed">
                {t('sign_out_confirm_desc', 'You can sign in again anytime using your mobile number or email address.')}
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 min-h-[44px] bg-[#eef4ff] text-[#001e40] rounded-xl font-bold text-xs hover:bg-[#d9e3f4] transition-colors focus:ring-2 focus:ring-[#005db6] focus:outline-none"
              >
                {t('cancel', 'Cancel')}
              </button>

              <button
                type="button"
                onClick={handleConfirmLogout}
                className="flex-1 min-h-[44px] bg-[#ba1a1a] text-white rounded-xl font-bold text-xs hover:bg-rose-800 transition-colors shadow-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
              >
                {t('sign_out', 'Sign Out')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
