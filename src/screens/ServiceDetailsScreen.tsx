import React from 'react';
import { ScreenType, ServiceItem } from '../types';

interface ServiceDetailsScreenProps {
  service: ServiceItem;
  onBack: () => void;
  onStartPreparation: () => void;
  onNavigate: (screen: ScreenType) => void;
}

export const ServiceDetailsScreen: React.FC<ServiceDetailsScreenProps> = ({
  service,
  onBack,
  onStartPreparation,
  onNavigate
}) => {
  if (!service) {
    return (
      <div className="bg-[#f8f9ff] min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-[#eef4ff] text-[#005db6] rounded-full flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-3xl">info</span>
        </div>
        <h2 className="text-xl font-bold text-[#001e40]">Unable to load service</h2>
        <p className="text-xs text-[#43474f] mt-1 mb-6 max-w-sm">
          We couldn't load this service. Please return to search and select a service again.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="h-11 px-6 bg-[#005db6] hover:bg-[#00376f] text-white font-bold text-xs rounded-xl"
        >
          Back to Services
        </button>
      </div>
    );
  }

  const isComingSoon = service.isComingSoon || (service.documentsRequired && service.documentsRequired.length === 0);

  return (
    <div className="bg-[#f8f9ff] text-[#121c28] min-h-screen pb-28 md:pb-8">
      {/* Top Header */}
      <header className="bg-white sticky top-0 z-40 border-b border-[#c3c6d1] flex justify-between items-center px-4 md:px-8 h-16 w-full max-w-7xl mx-auto shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="min-w-[44px] min-h-[44px] -ml-2 rounded-full hover:bg-[#eef4ff] text-[#001e40] flex items-center justify-center transition-colors focus:ring-2 focus:ring-[#005db6] focus:outline-none"
            aria-label="Go Back"
          >
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
          <h1 className="font-bold text-lg md:text-xl text-[#001e40]">Service Details</h1>
        </div>
        <div className="flex items-center gap-2 text-[#001e40] font-bold">
          <span className="material-symbols-outlined text-2xl">account_balance</span>
          <span className="hidden md:inline text-base">SmartSeva</span>
        </div>
      </header>

      <main className="w-full max-w-3xl mx-auto px-4 py-6 flex flex-col gap-6">
        {/* Header Hero Section */}
        <section className="flex flex-col items-center text-center mb-2">
          <div className="w-20 h-20 bg-[#eef4ff] rounded-2xl flex items-center justify-center mb-4 border border-[#c3c6d1] text-[#001e40] shadow-xs">
            <span className="material-symbols-outlined text-4xl">{service.icon}</span>
          </div>
          <div className="flex items-center gap-2 justify-center flex-wrap mb-1">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase bg-[#eef4ff] text-[#005db6] border border-[#c3c6d1]">
              {service.category}
            </span>
            {isComingSoon && (
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase bg-amber-100 text-amber-900 border border-amber-300">
                Coming Soon
              </span>
            )}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#121c28] mb-1">
            {service.title}
          </h2>
          <p className="text-sm text-[#43474f] max-w-md">
            {service.description}
          </p>
        </section>

        {isComingSoon ? (
          <section className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center flex flex-col items-center">
            <span className="material-symbols-outlined text-4xl text-amber-700 mb-2">hourglass_empty</span>
            <h3 className="font-bold text-lg text-amber-950 mb-1">
              Preparation information coming soon.
            </h3>
            <p className="text-xs text-amber-900 max-w-md leading-relaxed mb-4">
              Detailed step-by-step document preparation guides for {service.title} are currently being verified with official departmental notices.
            </p>
            <button
              onClick={() => onNavigate('nearby_offices')}
              className="h-11 px-5 bg-[#001e40] text-white font-bold text-xs rounded-xl hover:bg-[#003366] transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base">location_on</span>
              <span>Find Nearby Department Offices</span>
            </button>
          </section>
        ) : (
          <>
            {/* Quick Info Grid */}
            <section className="grid grid-cols-2 gap-4">
              <div className="bg-[#eef4ff] border border-[#c3c6d1] p-4 rounded-2xl flex flex-col items-center text-center">
                <span className="material-symbols-outlined text-[#005db6] mb-1">schedule</span>
                <span className="text-xs font-semibold text-[#43474f]">Est. Prep Time</span>
                <span className="text-lg font-bold text-[#121c28] mt-1">{service.estCompletion}</span>
              </div>
              <div className="bg-[#eef4ff] border border-[#c3c6d1] p-4 rounded-2xl flex flex-col items-center text-center">
                <span className="material-symbols-outlined text-[#005db6] mb-1">calendar_month</span>
                <span className="text-xs font-semibold text-[#43474f]">Processing Window</span>
                <span className="text-lg font-bold text-[#121c28] mt-1">{service.processingTime}</span>
              </div>
            </section>

            {/* Detailed Info Cards */}
            <section className="space-y-4">
              {/* Eligibility */}
              <div className="bg-white border border-[#c3c6d1] p-5 rounded-2xl shadow-xs">
                <div className="flex items-center gap-2 mb-2 border-b border-[#d9e3f4] pb-2">
                  <span className="material-symbols-outlined text-[#001e40]">fact_check</span>
                  <h3 className="font-bold text-base text-[#121c28]">Eligibility</h3>
                </div>
                <p className="text-sm text-[#43474f]">{service.eligibility}</p>
              </div>

              {/* Benefits */}
              <div className="bg-white border border-[#c3c6d1] p-5 rounded-2xl shadow-xs">
                <div className="flex items-center gap-2 mb-2 border-b border-[#d9e3f4] pb-2">
                  <span className="material-symbols-outlined text-[#001e40]">verified_user</span>
                  <h3 className="font-bold text-base text-[#121c28]">Benefits</h3>
                </div>
                <ul className="space-y-2 text-sm text-[#43474f]">
                  {service.benefits.map((b, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#005db6] text-base">check_circle</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Important Notes */}
              <div className="bg-white border border-[#c3c6d1] p-5 rounded-2xl shadow-xs border-l-4 border-l-[#005db6]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-[#005db6]">info</span>
                  <h3 className="font-bold text-base text-[#121c28]">Important Notes</h3>
                </div>
                <p className="text-sm text-[#43474f]">{service.importantNotes}</p>
              </div>
            </section>

            {/* Documents Required List Preview */}
            {service.documentsRequired.length > 0 && (
              <section>
                <h3 className="font-bold text-base text-[#121c28] mb-3">Required Documents Preview</h3>
                <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2">
                  {service.documentsRequired.map((doc, idx) => (
                    <div
                      key={idx}
                      className="whitespace-nowrap flex items-center gap-2 px-4 py-2 bg-[#eef4ff] border border-[#c3c6d1] rounded-full text-xs font-semibold text-[#121c28]"
                    >
                      <span className="material-symbols-outlined text-sm text-[#005db6]">description</span>
                      {doc}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Service Readiness Guidance Box */}
            <section className="bg-[#eef4ff] border border-[#c3c6d1] rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4 shadow-xs">
              <div className="w-12 h-12 bg-[#001e40] text-white rounded-2xl flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">fact_check</span>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h4 className="font-bold text-sm text-[#121c28]">Document Availability Checklist</h4>
                <p className="text-xs text-[#43474f] mt-0.5">
                  Check which documents you have before starting your preparation roadmap.
                </p>
              </div>
              <button
                onClick={() => onNavigate('document_checklist')}
                className="shrink-0 px-4 py-2.5 bg-white text-[#001e40] border border-[#c3c6d1] rounded-xl text-xs font-bold hover:bg-[#dfe9fa] transition-colors"
              >
                Checklist
              </button>
            </section>
          </>
        )}
      </main>

      {/* Bottom Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-[#c3c6d1] p-4 z-40 shadow-lg max-w-3xl mx-auto right-0 flex gap-3">
        <button
          onClick={() => onNavigate('nearby_offices')}
          className="flex-1 min-h-[48px] border border-[#001e40] text-[#001e40] rounded-xl font-bold text-xs hover:bg-[#eef4ff] transition-colors flex items-center justify-center gap-1.5 focus:ring-2 focus:ring-[#005db6] focus:outline-none"
        >
          <span className="material-symbols-outlined text-lg">location_on</span>
          <span>Find Offices</span>
        </button>
        {!isComingSoon && (
          <button
            onClick={onStartPreparation}
            className="flex-1 min-h-[48px] bg-[#001e40] text-white rounded-xl font-bold text-xs hover:bg-[#003366] transition-colors shadow-xs flex items-center justify-center gap-1.5 focus:ring-2 focus:ring-[#005db6] focus:outline-none"
          >
            <span>Start Preparation</span>
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        )}
      </div>
    </div>
  );
};
