import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageCode } from '../types';

interface OnboardingScreenProps {
  onComplete: () => void;
}

// Step 1 Custom Civic Illustration: All Services in One Place
const Step1Illustration: React.FC<{ t: (key: string) => string }> = ({ t }) => (
  <div className="w-full bg-gradient-to-b from-[#eef4ff] to-[#dfe9fa] border border-[#005db6]/20 rounded-2xl p-4 shadow-inner relative overflow-hidden flex flex-col items-center">
    {/* Central Portal Badge */}
    <div className="relative z-10 flex items-center justify-center gap-2 bg-[#001e40] text-white px-3 py-1.5 rounded-xl shadow-xs border border-white/20 mb-3">
      <span className="material-symbols-outlined text-lg text-[#63a1ff]">account_balance</span>
      <span className="text-xs font-bold tracking-tight">{t('app_name')} Citizen Hub</span>
    </div>

    {/* Connected Service Chips Grid */}
    <div className="w-full grid grid-cols-2 gap-2 relative z-10 max-w-xs">
      <div className="bg-white/90 backdrop-blur-xs border border-[#005db6]/20 p-2 rounded-xl flex items-center gap-2 shadow-2xs">
        <div className="w-7 h-7 rounded-lg bg-[#005db6]/10 text-[#005db6] flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-base">badge</span>
        </div>
        <div className="text-left overflow-hidden">
          <div className="text-[11px] font-bold text-[#001e40] truncate">{t('feat_driving_license')}</div>
          <div className="text-[9px] text-[#43474f]">{t('preparation_plan')}</div>
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-xs border border-[#005db6]/20 p-2 rounded-xl flex items-center gap-2 shadow-2xs">
        <div className="w-7 h-7 rounded-lg bg-[#005db6]/10 text-[#005db6] flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-base">flight_takeoff</span>
        </div>
        <div className="text-left overflow-hidden">
          <div className="text-[11px] font-bold text-[#001e40] truncate">{t('feat_passport')}</div>
          <div className="text-[9px] text-[#43474f]">{t('preparation_plan')}</div>
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-xs border border-[#005db6]/20 p-2 rounded-xl flex items-center gap-2 shadow-2xs">
        <div className="w-7 h-7 rounded-lg bg-[#005db6]/10 text-[#005db6] flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-base">fingerprint</span>
        </div>
        <div className="text-left overflow-hidden">
          <div className="text-[11px] font-bold text-[#001e40] truncate">{t('feat_aadhaar_pan')}</div>
          <div className="text-[9px] text-[#43474f]">{t('preparation_plan')}</div>
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-xs border border-[#005db6]/20 p-2 rounded-xl flex items-center gap-2 shadow-2xs">
        <div className="w-7 h-7 rounded-lg bg-[#005db6]/10 text-[#005db6] flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-base">description</span>
        </div>
        <div className="text-left overflow-hidden">
          <div className="text-[11px] font-bold text-[#001e40] truncate">{t('feat_certificates')}</div>
          <div className="text-[9px] text-[#43474f]">{t('preparation_plan')}</div>
        </div>
      </div>
    </div>

    {/* Connecting Indicator Line */}
    <div className="mt-2.5 pt-2 border-t border-[#005db6]/15 w-full flex items-center justify-center gap-2 text-[10px] font-semibold text-[#005db6]">
      <span className="w-1.5 h-1.5 rounded-full bg-[#005db6]" />
      <span>{t('single_access_point')}</span>
    </div>
  </div>
);

// Step 2 Custom Civic Illustration: Know What You Need
const Step2Illustration: React.FC<{ t: (key: string) => string }> = ({ t }) => (
  <div className="w-full bg-gradient-to-b from-[#f8f9ff] to-[#eef4ff] border border-[#005db6]/20 rounded-2xl p-4 shadow-inner relative overflow-hidden flex flex-col items-center">
    {/* Header Document Sheet */}
    <div className="w-full bg-white border border-[#c3c6d1] rounded-xl p-3 shadow-xs space-y-2">
      <div className="flex items-center justify-between border-b border-[#c3c6d1]/50 pb-2">
        <div className="flex items-center gap-1.5 text-[#001e40]">
          <span className="material-symbols-outlined text-base text-[#005db6]">menu_book</span>
          <span className="text-xs font-extrabold">{t('document_checklist')}</span>
        </div>
        <span className="text-[9px] font-bold uppercase bg-[#005db6]/10 text-[#005db6] px-2 py-0.5 rounded-md">
          {t('official_guidance')}
        </span>
      </div>

      {/* Clear Requirements Overview */}
      <div className="space-y-1.5 text-left text-xs">
        <div className="flex items-center justify-between bg-[#f8f9ff] p-1.5 rounded-lg border border-[#c3c6d1]/40">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-emerald-600">check_box</span>
            <span className="font-semibold text-[#121c28]">{t('feat_eligibility')}</span>
          </div>
          <span className="text-[10px] text-[#43474f] font-medium">{t('required')}</span>
        </div>

        <div className="flex items-center justify-between bg-[#f8f9ff] p-1.5 rounded-lg border border-[#c3c6d1]/40">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-emerald-600">check_box</span>
            <span className="font-semibold text-[#121c28]">{t('feat_doc_list')}</span>
          </div>
          <span className="text-[10px] text-[#43474f] font-medium">{t('required')}</span>
        </div>

        <div className="flex items-center justify-between bg-amber-50 p-1.5 rounded-lg border border-amber-200">
          <div className="flex items-center gap-1.5 text-amber-900">
            <span className="material-symbols-outlined text-sm text-amber-600">info</span>
            <span className="font-semibold text-[11px]">{t('feat_official_fees')}</span>
          </div>
          <span className="text-[9px] font-bold text-amber-800 uppercase bg-amber-200/60 px-1.5 py-0.5 rounded">{t('required')}</span>
        </div>
      </div>
    </div>

    <div className="mt-2.5 pt-2 border-t border-[#005db6]/15 w-full flex items-center justify-center gap-2 text-[10px] font-semibold text-[#005db6]">
      <span className="material-symbols-outlined text-sm">lightbulb</span>
      <span>{t('exact_fees_rules')}</span>
    </div>
  </div>
);

// Step 3 Custom Civic Illustration: Be Ready Before You Go
const Step3Illustration: React.FC<{ t: (key: string) => string }> = ({ t }) => (
  <div className="w-full bg-gradient-to-b from-[#e6f4ea] to-[#d5e3ff]/40 border border-emerald-500/30 rounded-2xl p-4 shadow-inner relative overflow-hidden flex flex-col items-center">
    {/* Readiness Badge Header */}
    <div className="w-full bg-white border border-[#c3c6d1] rounded-xl p-3 shadow-xs space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-base">verified</span>
          </div>
          <div className="text-left">
            <div className="text-xs font-extrabold text-[#001e40]">{t('hundred_pct_prepared')}</div>
            <div className="text-[10px] text-[#006d3a] font-semibold">{t('appointment_ready')}</div>
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase bg-emerald-100 text-[#006d3a] px-2 py-1 rounded-lg border border-emerald-300">
          {t('zero_delays')}
        </span>
      </div>

      {/* Prepared Status Cards */}
      <div className="grid grid-cols-2 gap-2 text-left">
        <div className="bg-[#f8f9ff] border border-emerald-200 p-2 rounded-xl flex items-center gap-1.5">
          <span className="material-symbols-outlined text-sm text-emerald-600">task_alt</span>
          <span className="text-[10px] font-bold text-[#001e40]">{t('physical_copy_ready')}</span>
        </div>

        <div className="bg-[#f8f9ff] border border-emerald-200 p-2 rounded-xl flex items-center gap-1.5">
          <span className="material-symbols-outlined text-sm text-emerald-600">task_alt</span>
          <span className="text-[10px] font-bold text-[#001e40]">{t('valid_active_docs')}</span>
        </div>
      </div>
    </div>

    <div className="mt-2.5 pt-2 border-t border-emerald-600/20 w-full flex items-center justify-center gap-2 text-[10px] font-bold text-[#006d3a]">
      <span className="material-symbols-outlined text-sm">lock</span>
      <span>{t('private_self_check')}</span>
    </div>
  </div>
);

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const { language, setLanguage, languages, t } = useLanguage();
  // Step 0 is Language Selection, Steps 1-3 are Intro Slides
  const [step, setStep] = useState(0);

  const slides = [
    {
      title: t('onboarding_slide1_title'),
      description: t('onboarding_slide1_desc'),
      icon: 'travel_explore',
      badge: t('all_in_one_hub'),
      features: [t('feat_passport'), t('feat_driving_license'), t('feat_aadhaar_pan'), t('feat_certificates')],
      color: 'bg-[#eef4ff] text-[#001e40] border-[#005db6]/20'
    },
    {
      title: t('onboarding_slide2_title'),
      description: t('onboarding_slide2_desc'),
      icon: 'assignment_turned_in',
      badge: t('official_guidance'),
      features: [t('feat_doc_list'), t('feat_eligibility'), t('feat_official_fees'), t('feat_timelines')],
      color: 'bg-[#dfe9fa] text-[#005db6] border-[#005db6]/30'
    },
    {
      title: t('onboarding_slide3_title'),
      description: t('onboarding_slide3_desc'),
      icon: 'task_alt',
      badge: t('hassle_free_readiness'),
      features: [t('feat_self_check'), t('feat_missing_docs'), t('feat_expiry_warnings'), t('feat_private_no_upload')],
      color: 'bg-[#d5e3ff] text-[#003366] border-[#005db6]/40'
    }
  ];

  const handleNext = () => {
    if (step < slides.length) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="bg-[#f8f9ff] text-[#121c28] min-h-screen flex flex-col justify-between items-center selection:bg-[#005db6] selection:text-white">
      {/* Header Bar */}
      <header className="w-full flex justify-between items-center px-4 md:px-8 py-3.5 border-b border-[#c3c6d1] bg-white/95 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-[#001e40] flex items-center justify-center text-white font-bold shadow-xs">
            <span className="material-symbols-outlined text-xl">account_balance</span>
          </div>
          <span className="text-lg font-bold text-[#001e40] tracking-tight">{t('app_name')}</span>
        </div>

        {/* Header Controls: Language Selector + Skip */}
        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as LanguageCode)}
            className="text-xs font-bold text-[#001e40] bg-[#eef4ff] border border-[#c3c6d1] rounded-xl px-3 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#005db6]"
            aria-label="Select Language"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.nativeName}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={onComplete}
            className="min-h-[40px] px-3.5 py-1.5 text-xs font-bold text-[#001e40] hover:bg-[#eef4ff] rounded-xl transition-colors focus:ring-2 focus:ring-[#005db6] focus:outline-none"
          >
            {t('skip')}
          </button>
        </div>
      </header>

      {/* Main Viewport Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-8 py-6 text-center max-w-md w-full my-auto">
        {step === 0 ? (
          /* Step 0: Language Selection Screen */
          <div className="w-full space-y-5 my-auto">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eef4ff] text-[#005db6] text-xs font-bold border border-[#005db6]/20">
                <span className="material-symbols-outlined text-base">translate</span>
                <span>Language / భాష / भाषा / ಭಾಷೆ</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#001e40]">
                {t('select_language')}
              </h1>
              <p className="text-xs text-[#43474f] leading-relaxed max-w-xs mx-auto">
                {t('choose_language_desc')}
              </p>
            </div>

            {/* Language Options List */}
            <div className="grid grid-cols-1 gap-2.5 text-left pt-2">
              {languages.map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setLanguage(lang.code)}
                    className={`min-h-[52px] p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 shadow-xs focus:ring-2 focus:ring-[#005db6] focus:outline-none ${
                      isSelected
                        ? 'bg-[#001e40] border-[#001e40] text-white shadow-sm'
                        : 'bg-white border-[#c3c6d1] hover:border-[#005db6] hover:bg-[#eef4ff]/50 text-[#121c28]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl shrink-0 leading-none">{lang.flag}</span>
                      <div>
                        <div className={`font-bold text-sm leading-tight ${isSelected ? 'text-white' : 'text-[#001e40]'}`}>
                          {lang.nativeName}
                        </div>
                        <div className={`text-[11px] ${isSelected ? 'text-[#d5e3ff]' : 'text-[#737780]'}`}>
                          {lang.name} • {lang.subtext}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border ${
                        isSelected
                          ? 'bg-[#005db6] border-white text-white'
                          : 'border-[#c3c6d1] bg-[#f8f9ff] text-transparent'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm font-extrabold">check</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Steps 1-3: Intro Slides */
          <div className="w-full flex flex-col items-center my-auto space-y-4">
            {/* Visual Hero Card */}
            <div className="w-full bg-white border border-[#c3c6d1] rounded-2xl p-4 shadow-xs flex flex-col items-center justify-center relative overflow-hidden text-center space-y-3">
              {/* Bespoke Illustration for Step */}
              {step === 1 && <Step1Illustration t={t} />}
              {step === 2 && <Step2Illustration t={t} />}
              {step === 3 && <Step3Illustration t={t} />}

              <span className="inline-block bg-[#001e40] text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider">
                {slides[step - 1].badge}
              </span>

              {/* Feature Highlights Grid */}
              <div className="w-full grid grid-cols-2 gap-1.5 text-left">
                {slides[step - 1].features.map((feat, idx) => (
                  <div key={idx} className="bg-[#f8f9ff] border border-[#c3c6d1]/60 p-2 rounded-xl text-[11px] font-semibold text-[#001e40] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-xs text-[#005db6]">check_circle</span>
                    <span className="truncate">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Slide Title & Description */}
            <div className="space-y-1.5 max-w-sm px-2">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#005db6]">
                {t('step')} {step} {t('of')} 3
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-[#001e40]">
                {slides[step - 1].title}
              </h1>
              <p className="text-xs text-[#43474f] leading-relaxed">
                {slides[step - 1].description}
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer Navigation Bar */}
      <footer className="w-full max-w-md px-4 pb-6 pt-3 flex flex-col items-center gap-4 bg-[#f8f9ff]">
        {/* Step Progress Dots */}
        <div className="flex items-center justify-center gap-2">
          {[0, 1, 2, 3].map((idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setStep(idx)}
              aria-label={`Go to step ${idx}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === step ? 'w-8 bg-[#001e40]' : 'w-2 bg-[#c3c6d1]'
              }`}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="w-full flex gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex-1 min-h-[48px] border-2 border-[#001e40] text-[#001e40] rounded-xl font-bold text-xs hover:bg-[#eef4ff] transition-colors focus:ring-2 focus:ring-[#005db6] focus:outline-none"
            >
              {t('back')}
            </button>
          )}
          <button
            type="button"
            onClick={handleNext}
            className="flex-1 min-h-[48px] bg-[#001e40] text-white rounded-xl font-bold text-xs hover:bg-[#00376f] transition-colors flex items-center justify-center gap-2 shadow-xs focus:ring-2 focus:ring-[#005db6] focus:outline-none"
          >
            <span>
              {step === 0
                ? `${t('continue')} →`
                : step === slides.length
                ? t('get_started')
                : t('next')}
            </span>
            {step > 0 && <span className="material-symbols-outlined text-base">arrow_forward</span>}
          </button>
        </div>
      </footer>
    </div>
  );
};

