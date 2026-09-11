import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageCode } from '../types';

interface SettingsScreenProps {
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const { language, setLanguage, languages, currentLanguageOption, t } = useLanguage();
  const [isLangPickerOpen, setIsLangPickerOpen] = useState(false);

  return (
    <div className="bg-[#f8f9ff] text-[#121c28] min-h-screen pb-20 font-sans selection:bg-[#005db6] selection:text-white">
      {/* Header */}
      <header className="bg-[#f8f9ff]/95 backdrop-blur-md sticky top-0 z-40 border-b border-[#c3c6d1]">
        <div className="flex justify-between items-center px-4 md:px-8 h-16 w-full max-w-3xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="min-w-[44px] min-h-[44px] -ml-2 rounded-full hover:bg-[#eef4ff] text-[#001e40] flex items-center justify-center transition-colors focus:ring-2 focus:ring-[#005db6] focus:outline-none"
              aria-label="Go Back"
            >
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </button>
            <h1 className="font-bold text-xl text-[#001e40]">{t('settings')}</h1>
          </div>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="w-full max-w-3xl mx-auto px-4 py-6 flex flex-col gap-6">
        {/* General Settings */}
        <section className="bg-white border border-[#c3c6d1] rounded-2xl p-4 md:p-5 shadow-sm space-y-4">
          <h2 className="text-xs font-bold uppercase text-[#737780] tracking-wider px-1">
            {t('general_preferences')}
          </h2>

          {/* App Language Option inside Settings */}
          <div className="p-3 rounded-xl bg-[#f8f9ff] border border-[#c3c6d1]/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#eef4ff] text-[#005db6] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-2xl">translate</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#121c28]">{t('app_language')}</h3>
                  <p className="text-xs text-[#737780]">{t('select_default_language')}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsLangPickerOpen(!isLangPickerOpen)}
                className="text-xs font-bold text-[#005db6] bg-white hover:bg-[#eef4ff] px-3 py-1.5 rounded-xl border border-[#005db6]/30 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span>{currentLanguageOption.flag} {currentLanguageOption.nativeName}</span>
                <span className="material-symbols-outlined text-base">
                  {isLangPickerOpen ? 'expand_less' : 'expand_more'}
                </span>
              </button>
            </div>

            {/* Interactive Language Selector (Expanded or Modal) */}
            {isLangPickerOpen && (
              <div className="pt-2 border-t border-[#c3c6d1]/40 space-y-2">
                <p className="text-[11px] font-bold text-[#001e40] uppercase tracking-wider">
                  Available Languages:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {languages.map((lang) => {
                    const isSelected = language === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangPickerOpen(false);
                        }}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between gap-2 transition-all ${
                          isSelected
                            ? 'bg-[#001e40] border-[#001e40] text-white shadow-xs'
                            : 'bg-white border-[#c3c6d1] hover:border-[#005db6] hover:bg-[#eef4ff] text-[#121c28]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl shrink-0">{lang.flag}</span>
                          <div>
                            <div className={`font-bold text-xs ${isSelected ? 'text-white' : 'text-[#001e40]'}`}>
                              {lang.nativeName}
                            </div>
                            <div className={`text-[10px] ${isSelected ? 'text-[#d5e3ff]' : 'text-[#737780]'}`}>
                              {lang.name}
                            </div>
                          </div>
                        </div>

                        {isSelected && (
                          <span className="material-symbols-outlined text-emerald-400 text-base font-bold">
                            check_circle
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between p-2 border-t border-[#d9e3f4]">
            <div>
              <h3 className="text-sm font-semibold text-[#121c28]">{t('prep_notifications')}</h3>
              <p className="text-xs text-[#737780]">{t('prep_notifications_desc')}</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#001e40]" />
          </div>

          <div className="flex items-center justify-between p-2 border-t border-[#d9e3f4]">
            <div>
              <h3 className="text-sm font-semibold text-[#121c28]">{t('accessibility_contrast')}</h3>
              <p className="text-xs text-[#737780]">{t('accessibility_contrast_desc')}</p>
            </div>
            <input type="checkbox" className="w-5 h-5 accent-[#001e40]" />
          </div>
        </section>

        {/* Security & Privacy */}
        <section className="bg-white border border-[#c3c6d1] rounded-2xl p-4 md:p-5 shadow-sm space-y-4">
          <h2 className="text-xs font-bold uppercase text-[#737780] tracking-wider px-1">
            {t('security_data')}
          </h2>

          <div className="flex items-center justify-between p-2">
            <div>
              <h3 className="text-sm font-semibold text-[#121c28]">{t('local_storage')}</h3>
              <p className="text-xs text-[#737780]">{t('local_storage_desc')}</p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              {t('enabled')}
            </span>
          </div>
        </section>
      </main>
    </div>
  );
};
