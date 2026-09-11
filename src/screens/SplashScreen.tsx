import React from 'react';

interface SplashScreenProps {
  onStart: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onStart }) => {
  return (
    <div className="bg-[#f8f9ff] min-h-screen w-full flex flex-col justify-between items-center text-[#121c28] p-4 sm:p-6 md:p-8 font-sans selection:bg-[#005db6] selection:text-white">
      {/* Top Header Identifier */}
      <header className="w-full max-w-md md:max-w-xl flex items-center justify-between pt-2 pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#001e40]/5 text-[#001e40] text-xs font-bold tracking-wide uppercase border border-[#001e40]/10">
          <span className="material-symbols-outlined text-sm text-[#005db6]">verified</span>
          Official Public Requirements Guide
        </div>
        <span className="text-xs font-semibold text-[#737780]">SmartSeva Portal</span>
      </header>

      {/* Hero Welcome Centerpiece */}
      <main className="w-full max-w-md md:max-w-xl flex flex-col items-center text-center my-auto py-4 sm:py-6 space-y-6">
        {/* Emblem Logo Badge */}
        <div className="relative flex items-center justify-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white border border-[#005db6]/20 shadow-xs flex items-center justify-center p-3">
            <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#001e40] to-[#00376f] flex items-center justify-center text-white shadow-inner">
              <span className="material-symbols-outlined text-3xl sm:text-4xl">account_balance</span>
            </div>
          </div>
        </div>

        {/* App Title & Purpose */}
        <div className="space-y-2 max-w-md mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#001e40] tracking-tight">
            SmartSeva
          </h1>
          <p className="text-sm sm:text-base font-bold text-[#005db6]">
            Citizen Service Preparation Portal
          </p>
          <p className="text-xs sm:text-sm text-[#43474f] leading-relaxed max-w-sm mx-auto">
            Prepare documents, check requirements, and get ready before visiting government offices.
          </p>
        </div>

        {/* Secondary Supporting Highlights */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left max-w-md pt-1">
          <div className="bg-white border border-[#c3c6d1]/80 p-3 rounded-xl flex items-center gap-2.5 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-[#005db6]/10 text-[#005db6] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-lg">travel_explore</span>
            </div>
            <span className="text-xs font-semibold text-[#001e40] leading-snug">
              Find public services in one place
            </span>
          </div>

          <div className="bg-white border border-[#c3c6d1]/80 p-3 rounded-xl flex items-center gap-2.5 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-[#005db6]/10 text-[#005db6] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-lg">checklist</span>
            </div>
            <span className="text-xs font-semibold text-[#001e40] leading-snug">
              Follow simple document checklists
            </span>
          </div>

          <div className="bg-white border border-[#c3c6d1]/80 p-3 rounded-xl flex items-center gap-2.5 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-lg">no_sim</span>
            </div>
            <span className="text-xs font-semibold text-[#001e40] leading-snug">
              No document uploads required
            </span>
          </div>

          <div className="bg-white border border-[#c3c6d1]/80 p-3 rounded-xl flex items-center gap-2.5 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-lg">lock</span>
            </div>
            <span className="text-xs font-semibold text-[#001e40] leading-snug">
              Your information stays private
            </span>
          </div>
        </div>

        {/* Primary Action CTA */}
        <div className="w-full max-w-md pt-2">
          <button
            type="button"
            onClick={onStart}
            className="w-full min-h-[50px] px-6 py-3 rounded-xl bg-[#001e40] text-white text-sm font-bold shadow-md hover:bg-[#00376f] active:scale-[0.99] transition-all flex items-center justify-center gap-2 focus:ring-2 focus:ring-[#005db6] focus:outline-none"
            aria-label="Get Started with SmartSeva"
          >
            <span>Get Started</span>
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        </div>
      </main>

      {/* Footer Trust Indicator */}
      <footer className="w-full max-w-md flex flex-col items-center justify-center gap-1 pt-4 pb-2 border-t border-[#c3c6d1]/40 text-center">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          <span className="text-xs font-semibold text-[#43474f]">
            100% Private • No File Uploads Required
          </span>
        </div>
        <p className="text-[11px] text-[#737780]">
          Helping citizens stay prepared before office visits
        </p>
      </footer>
    </div>
  );
};


