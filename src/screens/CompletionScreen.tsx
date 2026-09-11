import React from 'react';
import { ScreenType } from '../types';

interface CompletionScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onBack?: () => void;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({ onNavigate, onBack }) => {
  return (
    <div className="bg-[#f8f9ff] text-[#121c28] min-h-screen pb-28 md:pb-8">
      {/* Top Header */}
      <header className="bg-[#f8f9ff] sticky top-0 z-40 border-b border-[#c3c6d1]">
        <div className="flex justify-between items-center px-4 md:px-8 h-16 w-full max-w-3xl mx-auto">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 -ml-2 rounded-full hover:bg-[#eef4ff] text-[#43474f] transition-colors"
                aria-label="Go Back"
              >
                <span className="material-symbols-outlined text-2xl">arrow_back</span>
              </button>
            )}
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#001e40] text-2xl">account_balance</span>
              <span className="font-bold text-lg text-[#001e40]">SmartSeva</span>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            Ready to Submit
          </span>
        </div>
      </header>

      <main className="w-full max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6">
        {/* Celebration Banner */}
        <section className="bg-white border border-[#c3c6d1] rounded-2xl p-6 shadow-sm text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-4xl">task_alt</span>
          </div>
          <h1 className="text-2xl font-bold text-[#001e40] mb-1">
            Congratulations, Anjali!
          </h1>
          <p className="text-sm text-[#43474f] max-w-md">
            Your preparation for the <strong className="text-[#121c28]">Driving License</strong> service is fully completed. You are set for a smooth office visit.
          </p>

          <div className="mt-4 px-4 py-2 bg-[#eef4ff] rounded-xl border border-[#c3c6d1] text-xs font-bold text-[#005db6]">
            Readiness Score: 100% Prepared
          </div>
        </section>

        {/* Preparation Summary Grid */}
        <section className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-[#c3c6d1] p-4 rounded-2xl text-center">
            <span className="material-symbols-outlined text-[#005db6] text-3xl mb-1">
              verified
            </span>
            <span className="block text-xl font-bold text-[#121c28]">5 / 5</span>
            <span className="text-xs text-[#43474f]">Documents Marked Available</span>
          </div>
          <div className="bg-white border border-[#c3c6d1] p-4 rounded-2xl text-center">
            <span className="material-symbols-outlined text-[#005db6] text-3xl mb-1">
              playlist_add_check
            </span>
            <span className="block text-xl font-bold text-[#121c28]">100%</span>
            <span className="text-xs text-[#43474f]">Prerequisites Met</span>
          </div>
        </section>

        {/* What to Carry Checklist */}
        <section className="bg-white border border-[#c3c6d1] rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-base text-[#001e40] mb-3 border-b border-[#d9e3f4] pb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#005db6]">folder</span>
            What to Carry to the Office
          </h3>
          <ul className="space-y-2 text-sm text-[#43474f]">
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600 text-lg">check_circle</span>
              Original Aadhaar Card & 1 Self-Attested Photocopy
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600 text-lg">check_circle</span>
              Valid Proof of Address (Under 90 Days Old)
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600 text-lg">check_circle</span>
              2 Passport-Sized Photographs (White Background)
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600 text-lg">check_circle</span>
              Printed SmartSeva Preparation Checklist Summary
            </li>
          </ul>
        </section>

        {/* Office Visit Tips */}
        <section className="bg-[#eef4ff] border border-[#c3c6d1] rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-sm text-[#001e40] mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#005db6]">tips_and_updates</span>
            Smooth Visit Tips
          </h3>
          <ul className="space-y-1.5 text-xs text-[#43474f]">
            <li>• Arrive 10-15 minutes prior to official counters opening.</li>
            <li>• Carry all original documents alongside printed copies.</li>
            <li>• Keep documents organized according to your preparation checklist order.</li>
          </ul>
        </section>

        {/* Find Nearby Offices Banner */}
        <section className="bg-gradient-to-r from-[#001e40] to-[#00376f] rounded-2xl p-5 shadow-md text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-bold text-base text-white flex items-center justify-center sm:justify-start gap-1.5">
              <span className="material-symbols-outlined text-amber-300">location_on</span>
              Ready to visit the office?
            </h3>
            <p className="text-xs text-[#d5e3ff]">
              Locate official counters near you, check working hours, and get directions.
            </p>
          </div>
          <button
            onClick={() => onNavigate('nearby_offices')}
            className="h-11 px-5 bg-amber-400 hover:bg-amber-300 text-amber-950 font-extrabold text-xs rounded-xl transition-colors shrink-0 flex items-center gap-1.5 shadow-xs"
          >
            <span>Find Nearby Offices</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </section>
      </main>

      {/* Sticky Action Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#c3c6d1] p-3.5 z-40 shadow-lg">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={() => onNavigate('nearby_offices')}
            className="flex-1 h-11 bg-[#005db6] text-white rounded-xl font-bold text-xs hover:bg-[#005db6]/90 transition-colors shadow-xs flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">location_on</span>
            <span>Find Nearby Offices</span>
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="flex-1 h-11 border border-[#001e40] text-[#001e40] rounded-xl font-bold text-xs hover:bg-[#eef4ff] transition-colors"
          >
            Return to Home
          </button>
          <button
            onClick={() => onNavigate('search')}
            className="flex-1 h-11 bg-[#001e40] text-white rounded-xl font-bold text-xs hover:bg-[#003366] transition-colors shadow-xs flex items-center justify-center gap-1"
          >
            Start Another Service
          </button>
        </div>
      </footer>
    </div>
  );
};
