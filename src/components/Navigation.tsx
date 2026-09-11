import React from 'react';
import { ScreenType } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface TopAppBarProps {
  title: string;
  onBack?: () => void;
  showAvatar?: boolean;
  avatarUrl?: string;
  onAvatarClick?: () => void;
  rightAction?: React.ReactNode;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  title,
  onBack,
  showAvatar = false,
  avatarUrl,
  onAvatarClick,
  rightAction
}) => {
  return (
    <header className="w-full sticky top-0 bg-[#f8f9ff]/95 backdrop-blur-md border-b border-[#c3c6d1] z-40 transition-colors duration-200">
      <div className="flex justify-between items-center px-4 h-16 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          {onBack ? (
            <button
              onClick={onBack}
              aria-label="Go back"
              className="min-w-[44px] min-h-[44px] -ml-2 rounded-full hover:bg-[#eef4ff] text-[#001e40] flex items-center justify-center transition-colors focus:ring-2 focus:ring-[#005db6] focus:outline-none"
            >
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#001e40] text-2xl">account_balance</span>
            </div>
          )}
          <h1 className="text-lg font-bold text-[#001e40] tracking-tight">{title}</h1>
        </div>

        <div className="flex items-center gap-3">
          {rightAction}
          {showAvatar && (
            <button
              onClick={onAvatarClick}
              aria-label="User Profile"
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#005db6]/20 hover:border-[#005db6] transition-all focus:ring-2 focus:ring-[#005db6] focus:outline-none"
            >
              <img
                src={avatarUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200"}
                alt="User Profile"
                className="w-full h-full object-cover"
              />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

interface BottomNavBarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  unreadNotificationsCount?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentScreen,
  onNavigate,
  unreadNotificationsCount = 0
}) => {
  const { t } = useLanguage();

  const tabs = [
    { id: 'home' as ScreenType, label: t('home'), icon: 'home' },
    { id: 'search' as ScreenType, label: t('search'), icon: 'grid_view' },
    { id: 'document_checklist' as ScreenType, label: t('checklist'), icon: 'fact_check' },
    { id: 'profile' as ScreenType, label: t('profile'), icon: 'person' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full bg-[#f8f9ff] border-t border-[#c3c6d1] z-50 md:hidden shadow-lg">
      <div className="flex justify-around items-center h-16 px-2 max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive =
            currentScreen === tab.id ||
            (tab.id === 'document_checklist' && currentScreen === 'readiness_dashboard');
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] px-3 py-1 rounded-2xl transition-all ${
                isActive
                  ? 'bg-[#001e40] text-white font-bold'
                  : 'text-[#43474f] hover:text-[#001e40] hover:bg-[#eef4ff]'
              }`}
            >
              <span className={`material-symbols-outlined text-2xl ${isActive ? 'fill' : ''}`}>
                {tab.icon}
              </span>
              <span className="text-[10px] font-bold mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

