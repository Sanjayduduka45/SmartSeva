import React, { useMemo } from 'react';
import { ScreenType, DocumentItem, ServiceItem } from '../types';

interface ReadinessDashboardScreenProps {
  documents?: DocumentItem[];
  selectedService?: ServiceItem;
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
}

const DashboardCard: React.FC<{
  title: string;
  icon?: string;
  badge?: string;
  badgeColor?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, icon, badge, badgeColor = 'bg-[#eef4ff] text-[#005db6]', children, className = '' }) => (
  <div className={`bg-white border border-[#c3c6d1] rounded-2xl p-5 shadow-sm space-y-3 ${className}`}>
    <div className="flex items-center justify-between border-b border-[#c3c6d1]/40 pb-2.5">
      <div className="flex items-center gap-2">
        {icon && <span className="material-symbols-outlined text-[#005db6] text-xl">{icon}</span>}
        <h3 className="font-bold text-base text-[#121c28]">{title}</h3>
      </div>
      {badge && (
        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${badgeColor}`}>
          {badge}
        </span>
      )}
    </div>
    {children}
  </div>
);

const StatCard: React.FC<{
  label: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  colorBg?: string;
  colorText?: string;
}> = ({ label, value, subtitle, icon, colorBg = 'bg-[#f8f9ff]', colorText = 'text-[#001e40]' }) => (
  <div className={`p-4 rounded-xl border border-[#c3c6d1]/60 ${colorBg} space-y-1`}>
    <div className="flex items-center justify-between">
      <span className="text-xs font-medium text-[#43474f]">{label}</span>
      <span className={`material-symbols-outlined text-lg ${colorText}`}>{icon}</span>
    </div>
    <div className={`text-2xl font-extrabold ${colorText}`}>{value}</div>
    {subtitle && <p className="text-[11px] text-[#737780] font-medium">{subtitle}</p>}
  </div>
);

export const ReadinessDashboardScreen: React.FC<ReadinessDashboardScreenProps> = ({
  documents = [],
  selectedService,
  onBack,
  onNavigate
}) => {
  const {
    completedDocs,
    missingDocs,
    expiredDocs,
    remainingDocs,
    total,
    requiredTotal,
    requiredHaveCount,
    readinessPercentage,
    estimatedCompletion
  } = useMemo(() => {
    const comp = documents.filter((d) => d.status === 'have');
    const miss = documents.filter((d) => d.status === 'dont_have');
    const exp = documents.filter((d) => d.status === 'expired');
    const rem = documents.filter((d) => d.status !== 'have');
    const tot = documents.length || 5;

    const req = documents.filter((d) => d.required);
    const reqTot = req.length;
    const reqHave = req.filter((d) => d.status === 'have').length;
    const pct = reqTot > 0 ? Math.round((reqHave / reqTot) * 100) : (tot > 0 ? Math.round((comp.length / tot) * 100) : 0);

    const est =
      rem.length === 0
        ? 'Ready Today'
        : rem.length === 1
        ? '1 - 2 Days'
        : `${rem.length * 2} Days`;

    return {
      completedDocs: comp,
      missingDocs: miss,
      expiredDocs: exp,
      remainingDocs: rem,
      total: tot,
      requiredTotal: reqTot,
      requiredHaveCount: reqHave,
      readinessPercentage: pct,
      estimatedCompletion: est
    };
  }, [documents]);

  return (
    <div className="bg-[#f8f9ff] text-[#121c28] min-h-screen pb-44 md:pb-16 font-sans selection:bg-[#005db6] selection:text-white">
      {/* Top Header */}
      <header className="bg-[#f8f9ff]/95 backdrop-blur-md sticky top-0 z-40 border-b border-[#c3c6d1]">
        <div className="flex justify-between items-center px-4 md:px-8 h-16 w-full max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 -ml-2 rounded-full hover:bg-[#eef4ff] text-[#43474f] transition-colors"
              aria-label="Go Back"
            >
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </button>
            <div>
              <h1 className="font-bold text-lg md:text-xl text-[#001e40] leading-tight">
                {selectedService ? `${selectedService.title} Readiness` : 'Readiness Dashboard'}
              </h1>
              <p className="text-xs text-[#43474f]">
                {selectedService
                  ? `Preparation & verification progress for ${selectedService.title}`
                  : 'Document Readiness & Preparation Tracker'}
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('document_checklist')}
            className="text-xs font-bold text-[#005db6] bg-[#eef4ff] hover:bg-[#dfe9fa] px-3 py-1.5 rounded-xl border border-[#005db6]/20 transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-base">fact_check</span>
            <span className="hidden sm:inline">Checklist</span>
          </button>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <main className="w-full max-w-4xl mx-auto px-4 md:px-8 py-6 space-y-6">

        {/* 1. Overall Readiness Hero Section */}
        <section className="bg-gradient-to-r from-[#001e40] to-[#00376f] text-white rounded-2xl p-6 shadow-sm border border-[#001e40] space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/15 pb-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#63a1ff]/20 text-[#d5e3ff] text-xs font-semibold border border-[#63a1ff]/30 mb-2">
                <span className="material-symbols-outlined text-sm">analytics</span>
                Document Status Tracker
              </span>
              <h2 className="text-2xl font-extrabold text-white">Overall Readiness Score</h2>
            </div>
            <div className="text-right sm:text-right">
              <span className="text-3xl font-black text-emerald-400">{readinessPercentage}%</span>
              <span className="text-xs text-[#d5e3ff] block font-medium">Declared Preparedness</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="w-full h-3.5 bg-white/15 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full transition-all duration-500"
                style={{ width: `${readinessPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[11px] text-[#d5e3ff]">
              <span>0% Initial</span>
              <span>{requiredHaveCount} of {requiredTotal} Required Documents Ready</span>
              <span>100% Ready</span>
            </div>
          </div>
        </section>

        {/* 2. Key Metrics Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Documents You Have"
            value={`${completedDocs.length} / ${total}`}
            subtitle="Marked as available"
            icon="task_alt"
            colorBg="bg-emerald-50/60"
            colorText="text-emerald-900"
          />

          <StatCard
            label="Documents Still Needed"
            value={remainingDocs.length}
            subtitle={remainingDocs.length === 0 ? 'All items ready!' : 'Needs to be obtained'}
            icon="pending_actions"
            colorBg="bg-amber-50/60"
            colorText="text-amber-900"
          />

          <StatCard
            label="Estimated Time"
            value={estimatedCompletion}
            subtitle="Based on missing items"
            icon="hourglass_top"
            colorBg="bg-blue-50/60"
            colorText="text-blue-900"
          />
        </section>

        {/* 3. Next Recommended Action */}
        <section className="bg-white border-2 border-[#005db6] rounded-2xl p-4 shadow-xs space-y-3 relative overflow-hidden">
          <div className="flex items-center gap-2 text-[#005db6] border-b border-[#c3c6d1]/40 pb-2">
            <span className="material-symbols-outlined text-xl">play_circle</span>
            <h3 className="font-bold text-sm md:text-base text-[#121c28]">Next Recommended Step</h3>
            <span className="ml-auto text-[10px] font-extrabold uppercase bg-[#005db6] text-white px-2 py-0.5 rounded-full">
              Priority 1
            </span>
          </div>

          {remainingDocs.length > 0 ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <h4 className="font-bold text-xs md:text-sm text-[#001e40]">
                  Obtain Document: {remainingDocs[0].title}
                </h4>
                <p className="text-xs text-[#43474f]">
                  {remainingDocs[0].description || 'Check guidance on how to obtain or renew this document.'}
                </p>
              </div>
              <button
                onClick={() => onNavigate('document_guide')}
                className="min-h-[44px] bg-[#001e40] hover:bg-[#00376f] text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0"
              >
                <span>View Guide</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <h4 className="font-bold text-xs md:text-sm text-[#006d3a]">
                  Ready for Your Visit!
                </h4>
                <p className="text-xs text-[#43474f]">
                  All required documents are marked as available. Review your summary before your appointment.
                </p>
              </div>
              <button
                onClick={() => onNavigate('preparation_plan')}
                className="min-h-[44px] bg-[#006d3a] hover:bg-[#006d3a]/90 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0"
              >
                <span>Preparation Summary</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            </div>
          )}
        </section>

        {/* 4. Missing Documents Section */}
        <DashboardCard
          title="Documents Still Needed"
          icon="warning"
          badge={`${missingDocs.length + expiredDocs.length} Items`}
          badgeColor={missingDocs.length > 0 ? 'bg-[#ffdad6] text-[#ba1a1a]' : 'bg-[#e6f4ea] text-[#006d3a]'}
        >
          {remainingDocs.length === 0 ? (
            <div className="p-3.5 rounded-xl bg-[#e6f4ea] border border-[#a8dab5] text-[#006d3a] text-xs font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-lg text-[#006d3a]">check_circle</span>
              <span>All required documents are marked as available!</span>
            </div>
          ) : (
            <div className="space-y-2">
              {remainingDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3 rounded-xl border border-amber-200 bg-amber-50/50 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-amber-700 text-lg">
                      {doc.status === 'expired' ? 'history_toggle_off' : 'error'}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="font-bold text-[#121c28]">{doc.title}</strong>
                        <span className="text-[9px] font-bold bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded uppercase">
                          {doc.status === 'expired' ? 'Expired' : 'Needs to be obtained'}
                        </span>
                      </div>
                      <p className="text-[#43474f] text-[11px] mt-0.5">{doc.description}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('document_checklist')}
                    className="min-h-[44px] min-w-[44px] px-2 text-xs font-bold text-[#005db6] hover:underline shrink-0 flex items-center justify-center"
                  >
                    Update →
                  </button>
                </div>
              ))}
            </div>
          )}
        </DashboardCard>

        {/* 5. Documents Marked as Available */}
        <DashboardCard
          title="Documents Marked as Available"
          icon="task_alt"
          badge={`${completedDocs.length} Available`}
          badgeColor="bg-[#e6f4ea] text-[#006d3a]"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {completedDocs.map((doc) => (
              <div
                key={doc.id}
                className="p-2.5 rounded-xl bg-[#f8f9ff] border border-[#c3c6d1]/50 flex items-center gap-2.5 min-h-[44px]"
              >
                <span className="material-symbols-outlined text-[#006d3a] text-base">check_circle</span>
                <span className="font-semibold text-[#121c28] truncate">{doc.title}</span>
              </div>
            ))}
          </div>
        </DashboardCard>

      </main>

      {/* Sticky Bottom Bar */}
      <footer className="fixed bottom-[64px] md:bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#c3c6d1] p-3.5 z-40 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="hidden sm:block text-xs">
            <span className="text-[#43474f]">Readiness Progress: </span>
            <strong className="text-[#005db6]">{readinessPercentage}% Complete</strong>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => onNavigate('document_checklist')}
              className="flex-1 sm:flex-initial h-11 px-5 border border-[#c3c6d1] text-[#001e40] rounded-xl font-bold text-xs hover:bg-[#eef4ff] transition-colors"
            >
              Edit Checklist
            </button>
            <button
              onClick={() => onNavigate('preparation_plan')}
              className="flex-1 sm:flex-initial h-11 px-5 bg-[#001e40] text-white rounded-xl font-bold text-xs hover:bg-[#00376f] transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              <span>Preparation Summary</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
