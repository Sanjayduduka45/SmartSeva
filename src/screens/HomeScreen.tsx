import React, { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ScreenType, ServiceItem, DocumentItem } from '../types';

interface HomeScreenProps {
  services: ServiceItem[];
  selectedService?: ServiceItem;
  documents?: DocumentItem[];
  onNavigate: (screen: ScreenType) => void;
  onSelectService: (service: ServiceItem) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  services,
  selectedService,
  documents = [],
  onNavigate,
  onSelectService,
}) => {
  const { t } = useLanguage();
  const { user, getUserInitials } = useAuth();
  const firstName = user?.fullName ? user.fullName.split(' ')[0] : 'Citizen';
  const initials = getUserInitials(user?.fullName);

  // Active preparation service & dynamic metrics
  const activeService = selectedService || services.find((s) => s.id === 'driving-license') || services[0];
  const reqDocs = useMemo(() => documents.filter((d) => d.required), [documents]);
  const reqTotal = reqDocs.length || 5;
  const reqHave = reqDocs.filter((d) => d.status === 'have').length;
  const readinessPct = reqTotal > 0 ? Math.round((reqHave / reqTotal) * 100) : 80;

  // Memoize popular services excluding utility/land records
  const popularServices = useMemo(() => {
    return services.filter(
      (s) => !['land-records', 'utility-bills'].includes(s.id)
    );
  }, [services]);

  return (
    <div className="bg-[#f8f9ff] text-[#121c28] min-h-screen pb-24 md:pb-12 max-w-full overflow-x-hidden">
      {/* Top Navigation / Header */}
      <header className="w-full sticky top-0 bg-[#f8f9ff]/95 backdrop-blur-md border-b border-[#c3c6d1]/60 z-40">
        <div className="flex justify-between items-center px-4 md:px-8 h-16 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#001e40] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-2xl">account_balance</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#001e40] leading-tight">{t('app_name')}</h1>
              <p className="text-xs text-[#43474f] font-medium">{t('single_access_point')}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {/* Notifications Button */}
            <button
              onClick={() => onNavigate('notifications')}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-[#eef4ff] text-[#43474f] relative transition-colors"
              aria-label={t('notifications')}
            >
              <span className="material-symbols-outlined text-2xl">notifications</span>
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#ba1a1a] rounded-full ring-2 ring-white"></span>
            </button>

            {/* Profile Avatar Button */}
            <button
              onClick={() => onNavigate('profile')}
              className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#005db6]/20 bg-[#001e40] text-white flex items-center justify-center font-bold text-sm hover:border-[#005db6] transition-colors focus:outline-none"
              aria-label={t('profile')}
            >
              <span>{initials}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Preparation Dashboard */}
      <main className="w-full max-w-7xl mx-auto px-4 md:px-8 py-4 space-y-4 md:space-y-5">
        
        {/* Welcome Card & Overview */}
        <section className="bg-gradient-to-r from-[#001e40] to-[#00376f] rounded-2xl p-6 text-white shadow-sm relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#63a1ff]/20 text-[#d5e3ff] text-xs font-semibold border border-[#63a1ff]/30">
                <span className="material-symbols-outlined text-sm">verified_user</span>
                {t('single_access_point')}
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                {t('welcome_back')}, {firstName}
              </h2>
              <p className="text-sm md:text-base text-[#d5e3ff] leading-relaxed">
                {t('exact_fees_rules')}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => onNavigate('document_checklist')}
                className="min-h-[44px] bg-[#005db6] hover:bg-[#005db6]/90 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-xs flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">fact_check</span>
                {t('document_checklist')}
              </button>
              <button
                onClick={() => onNavigate('search')}
                className="min-h-[44px] bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all border border-white/20 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">search</span>
                {t('search')}
              </button>
            </div>
          </div>
        </section>

        {/* Search Bar & Quick Filters */}
        <section className="space-y-2">
          <div
            onClick={() => onNavigate('search')}
            className="relative cursor-pointer group"
          >
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#43474f] text-2xl group-hover:text-[#005db6] transition-colors">
              search
            </span>
            <input
              type="text"
              readOnly
              placeholder="Search services, documents, or preparation checklists..."
              className="w-full h-12 min-h-[44px] pl-12 pr-10 rounded-xl border border-[#c3c6d1] bg-white cursor-pointer outline-none text-sm text-[#121c28] shadow-xs hover:border-[#005db6] transition-colors"
            />
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#43474f] text-lg">
              tune
            </span>
          </div>

          {/* Service Search Chips */}
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-0.5">
            <span className="text-xs font-semibold text-[#43474f] shrink-0 mr-1">Quick Search:</span>
            {['Driving License', 'Passport', 'PAN Card', 'Aadhaar Update', 'Voter ID'].map((chip) => (
              <button
                key={chip}
                onClick={() => onNavigate('search')}
                className="shrink-0 min-h-[44px] px-3.5 py-2 rounded-full border border-[#c3c6d1] bg-white text-[#121c28] hover:bg-[#eef4ff] hover:border-[#005db6] text-xs font-semibold transition-colors flex items-center"
              >
                {chip}
              </button>
            ))}
          </div>
        </section>

        {/* Continue Preparation & Current Readiness Score (2-Column Desktop Grid) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Continue Preparation Card (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#c3c6d1] p-6 shadow-sm space-y-4 hover:border-[#005db6]/40 transition-all flex flex-col justify-between">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#eef4ff] border border-[#005db6]/20 text-[#001e40] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-2xl">{activeService.icon}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#e5eeff] text-[#001e40]">
                      Active Preparation
                    </span>
                    <span className="text-xs text-[#43474f]">{activeService.category}</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#121c28] mt-0.5">
                    {activeService.title}
                  </h3>
                </div>
              </div>
              <span className="text-sm font-bold text-[#005db6] bg-[#eef4ff] px-2.5 py-1 rounded-lg shrink-0">
                {readinessPct}% Done
              </span>
            </div>

            {/* Progress Bar & Next Action */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium text-[#43474f]">
                <span>Document Availability Checklist</span>
                <span className="font-semibold text-[#121c28]">{reqHave} / {reqTotal} Required Documents</span>
              </div>
              <div className="w-full bg-[#eef4ff] h-2.5 rounded-full overflow-hidden border border-[#c3c6d1]/40">
                <div
                  className="bg-[#005db6] h-full rounded-full transition-all duration-500"
                  style={{ width: `${readinessPct}%` }}
                ></div>
              </div>
              <p className="text-xs text-[#43474f] flex items-center gap-1 pt-1">
                {readinessPct === 100 ? (
                  <>
                    <span className="material-symbols-outlined text-sm text-[#006d3a]">check_circle</span>
                    <span>All required documents verified. You are ready to visit!</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm text-[#ba1a1a]">info</span>
                    <span>{Math.max(0, reqTotal - reqHave)} document(s) need attention before visiting office.</span>
                  </>
                )}
              </p>
            </div>

            {/* Action Controls */}
            <div className="pt-2 flex flex-wrap items-center gap-3 border-t border-[#c3c6d1]/40">
              <button
                onClick={() => {
                  onSelectService(activeService);
                  onNavigate('document_checklist');
                }}
                className="bg-[#001e40] hover:bg-[#00376f] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2"
              >
                <span>Continue Checklist</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
              <button
                onClick={() => {
                  onSelectService(activeService);
                  onNavigate('preparation_plan');
                }}
                className="bg-[#eef4ff] hover:bg-[#dfe9fa] text-[#001e40] px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors border border-[#c3c6d1]/60"
              >
                View Plan Steps
              </button>
            </div>
          </div>

          {/* Current Readiness Score Card (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#c3c6d1] p-6 shadow-sm space-y-4 hover:border-[#005db6]/40 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#005db6]">verified</span>
                <h3 className="text-base font-bold text-[#001e40]">Current Readiness Score</h3>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                readinessPct >= 80
                  ? 'bg-[#e6f4ea] text-[#137333] border-[#a8dab5]'
                  : readinessPct >= 50
                  ? 'bg-[#fef7e0] text-[#b06000] border-[#fdd663]'
                  : 'bg-[#fce8e6] text-[#c5221f] border-[#f5c2c7]'
              }`}>
                {readinessPct >= 80 ? 'High Readiness' : readinessPct >= 50 ? 'In Progress' : 'Action Required'}
              </span>
            </div>

            {/* Visual Gauge / Score Metric */}
            <div className="flex items-center gap-5 my-1">
              <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-[#eef4ff]"
                    strokeWidth="3.8"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#005db6]"
                    strokeDasharray={`${readinessPct}, 100`}
                    strokeWidth="3.8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-xl font-extrabold text-[#001e40] leading-none">{readinessPct}%</span>
                  <span className="text-[10px] text-[#43474f] font-medium">Score</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-[#121c28]">
                  <span className="w-2 h-2 rounded-full bg-[#006d3a]"></span>
                  <span className="font-semibold">{reqHave} Documents Ready</span>
                </div>
                <div className="flex items-center gap-2 text-[#121c28]">
                  <span className="w-2 h-2 rounded-full bg-[#ba1a1a]"></span>
                  <span>{Math.max(0, reqTotal - reqHave)} Document(s) Pending</span>
                </div>
                <div className="flex items-center gap-2 text-[#43474f]">
                  <span className="w-2 h-2 rounded-full bg-[#005db6]"></span>
                  <span>{activeService.title}</span>
                </div>
              </div>
            </div>

            {/* Button */}
            <button
              onClick={() => {
                onSelectService(activeService);
                onNavigate('readiness_dashboard');
              }}
              className="w-full bg-[#eef4ff] hover:bg-[#dfe9fa] text-[#001e40] py-2.5 px-4 rounded-xl text-sm font-semibold transition-colors border border-[#c3c6d1]/60 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">monitoring</span>
              <span>Open Readiness Dashboard</span>
            </button>
          </div>

        </section>

        {/* Recent Services Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#001e40]">history</span>
              <h3 className="text-xl font-bold text-[#001e40]">{t('recent_services')}</h3>
            </div>
            <button
              onClick={() => onNavigate('search')}
              className="text-xs font-semibold text-[#005db6] hover:underline flex items-center gap-1"
            >
              <span>View All Services</span>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Driving License */}
            <div
              onClick={() => {
                const s = services.find((x) => x.id === 'driving-license') || services[0];
                onSelectService(s);
                onNavigate('document_checklist');
              }}
              className="p-4 rounded-2xl border border-[#c3c6d1] bg-white hover:bg-[#eef4ff]/60 hover:border-[#005db6] transition-all cursor-pointer flex items-start gap-3.5 shadow-sm group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#eef4ff] border border-[#c3c6d1]/60 flex items-center justify-center text-[#001e40] shrink-0 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-2xl">directions_car</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[#121c28] truncate">Driving License</h4>
                  <span className="text-[11px] font-medium text-[#006d3a] bg-[#e6f4ea] px-2 py-0.5 rounded">
                    Active
                  </span>
                </div>
                <p className="text-xs text-[#43474f] mt-1 truncate">Checklist & requirements</p>
                <span className="inline-block text-[11px] font-semibold text-[#005db6] mt-2 group-hover:underline">
                  Open Checklist →
                </span>
              </div>
            </div>

            {/* Passport Service */}
            <div
              onClick={() => {
                const s = services.find((x) => x.id === 'passport');
                if (s) {
                  onSelectService(s);
                  onNavigate('service_details');
                }
              }}
              className="p-4 rounded-2xl border border-[#c3c6d1] bg-white hover:bg-[#eef4ff]/60 hover:border-[#005db6] transition-all cursor-pointer flex items-start gap-3.5 shadow-sm group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#eef4ff] border border-[#c3c6d1]/60 flex items-center justify-center text-[#001e40] shrink-0 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-2xl">flight_takeoff</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[#121c28] truncate">Passport Service</h4>
                  <span className="text-[11px] font-medium text-[#005db6] bg-[#eef4ff] px-2 py-0.5 rounded">
                    Popular
                  </span>
                </div>
                <p className="text-xs text-[#43474f] mt-1 truncate">Step-by-step roadmap ready</p>
                <span className="inline-block text-[11px] font-semibold text-[#005db6] mt-2 group-hover:underline">
                  View Service Details →
                </span>
              </div>
            </div>

            {/* Aadhaar Address Update */}
            <div
              onClick={() => {
                const s = services.find((x) => x.id === 'aadhaar-update');
                if (s) {
                  onSelectService(s);
                  onNavigate('service_details');
                }
              }}
              className="p-4 rounded-2xl border border-[#c3c6d1] bg-white hover:bg-[#eef4ff]/60 hover:border-[#005db6] transition-all cursor-pointer flex items-start gap-3.5 shadow-sm group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#eef4ff] border border-[#c3c6d1]/60 flex items-center justify-center text-[#001e40] shrink-0 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-2xl">contact_page</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[#121c28] truncate">Aadhaar Update</h4>
                  <span className="text-[11px] font-medium text-[#43474f] bg-[#f0f1f5] px-2 py-0.5 rounded">
                    Essential
                  </span>
                </div>
                <p className="text-xs text-[#43474f] mt-1 truncate">Biometric & address update</p>
                <span className="inline-block text-[11px] font-semibold text-[#005db6] mt-2 group-hover:underline">
                  View Service Details →
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* Popular Services Section */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#001e40]">grid_view</span>
              <h3 className="text-xl font-bold text-[#001e40]">Popular Services</h3>
            </div>
            <button
              onClick={() => onNavigate('search')}
              className="text-xs font-semibold text-[#005db6] hover:underline flex items-center gap-1"
            >
              <span>Explore All ({services.length})</span>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularServices.slice(0, 4).map((service) => (
              <button
                key={service.id}
                onClick={() => {
                  onSelectService(service);
                  onNavigate('service_details');
                }}
                className="flex flex-col items-center justify-between p-5 rounded-2xl border border-[#c3c6d1] bg-white hover:bg-[#eef4ff] hover:border-[#005db6] transition-all group text-center h-full shadow-sm hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-xl bg-[#eef4ff] group-hover:bg-[#001e40] text-[#001e40] group-hover:text-white flex items-center justify-center transition-colors mb-3">
                  <span className="material-symbols-outlined text-2xl">
                    {service.icon}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-[#121c28] group-hover:text-[#005db6] transition-colors leading-tight">
                    {service.title}
                  </h4>
                  <p className="text-[11px] text-[#43474f] line-clamp-1">
                    Est. {service.estCompletion} prep
                  </p>
                </div>

                <div className="mt-3 w-full pt-2 border-t border-[#c3c6d1]/40 flex items-center justify-center gap-1 text-[11px] font-semibold text-[#005db6]">
                  <span>Start Preparation</span>
                  <span className="material-symbols-outlined text-xs group-hover:translate-x-0.5 transition-transform">
                    chevron_right
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
};

