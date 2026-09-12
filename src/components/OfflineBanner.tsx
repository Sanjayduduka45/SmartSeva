import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export const OfflineBanner: React.FC = () => {
  const [isOffline, setIsOffline] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? !window.navigator.onLine : false;
  });

  const { t } = useLanguage();

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-amber-600 text-white text-xs font-semibold px-4 py-2 flex items-center justify-center gap-2 shadow-sm sticky top-0 z-50"
    >
      <span className="material-symbols-outlined text-base">wifi_off</span>
      <span>{t('offline_banner') || "You're offline. Some SmartSeva features need an internet connection."}</span>
    </div>
  );
};
