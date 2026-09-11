import React from 'react';
import { NotificationItem, ScreenType } from '../types';

interface NotificationsScreenProps {
  notifications: NotificationItem[];
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  notifications,
  onBack,
  onNavigate
}) => {
  return (
    <div className="bg-[#f8f9ff] text-[#121c28] min-h-screen pb-20">
      {/* Header */}
      <header className="bg-[#f8f9ff] sticky top-0 z-40 border-b border-[#c3c6d1]">
        <div className="flex justify-between items-center px-4 md:px-8 h-16 w-full max-w-3xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="min-w-[44px] min-h-[44px] -ml-2 rounded-full hover:bg-[#eef4ff] text-[#001e40] flex items-center justify-center transition-colors focus:ring-2 focus:ring-[#005db6] focus:outline-none"
              aria-label="Go Back"
            >
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </button>
            <h1 className="font-bold text-xl text-[#001e40]">Notifications</h1>
          </div>
          <span className="text-xs font-semibold text-[#005db6] cursor-pointer hover:underline">
            Mark all read
          </span>
        </div>
      </header>

      <main className="w-full max-w-3xl mx-auto px-4 py-6 flex flex-col gap-4">
        {notifications.map((item) => (
          <div
            key={item.id}
            onClick={() => onNavigate('document_checklist')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
              item.unread
                ? 'bg-white border-[#005db6] shadow-sm'
                : 'bg-[#f8f9ff] border-[#c3c6d1]'
            }`}
          >
            <div
              className={`p-2.5 rounded-xl shrink-0 ${
                item.type === 'urgent'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-[#eef4ff] text-[#001e40]'
              }`}
            >
              <span className="material-symbols-outlined text-xl">
                {item.type === 'urgent' ? 'warning' : 'notifications'}
              </span>
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <h2 className="font-bold text-sm text-[#121c28]">{item.title}</h2>
                <span className="text-[11px] text-[#737780]">{item.time}</span>
              </div>
              <p className="text-xs text-[#43474f] leading-relaxed">{item.message}</p>
              {item.actionText && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate('document_checklist');
                  }}
                  className="mt-2 text-xs font-bold text-[#005db6] hover:underline flex items-center gap-1"
                >
                  {item.actionText}
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};
