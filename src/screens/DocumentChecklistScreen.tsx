import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { DocumentItem, DocumentStatus, ScreenType, ServiceItem } from '../types';

interface DocumentChecklistScreenProps {
  documents: DocumentItem[];
  selectedService?: ServiceItem;
  onUpdateStatus: (id: string, status: DocumentStatus) => void;
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
}

export const DocumentChecklistScreen: React.FC<DocumentChecklistScreenProps> = ({
  documents,
  selectedService,
  onUpdateStatus,
  onBack,
  onNavigate
}) => {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<'all' | 'have' | 'dont_have' | 'not_sure' | 'expired'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [infoModalDoc, setInfoModalDoc] = useState<DocumentItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dynamic Status Calculations based on Required Documents (Memoized)
  const {
    requiredTotal,
    requiredHaveCount,
    requiredNeedCount,
    requiredUnsureCount,
    isFullyReady,
    remainingRequired,
    total,
    haveCount,
    dontHaveCount,
    notSureCount,
    expiredCount,
    readinessPercentage
  } = useMemo(() => {
    const requiredDocs = documents.filter((d) => d.required);
    const reqTotal = requiredDocs.length;
    const reqHave = requiredDocs.filter((d) => d.status === 'have').length;
    const reqNeed = requiredDocs.filter((d) => d.status === 'dont_have' || d.status === 'expired').length;
    const reqUnsure = requiredDocs.filter((d) => d.status === 'not_sure' || !d.status).length;
    const fullyReady = reqTotal > 0 && reqHave === reqTotal;
    const remRequired = reqTotal - reqHave;

    const tot = documents.length;
    const have = documents.filter((d) => d.status === 'have').length;
    const dontHave = documents.filter((d) => d.status === 'dont_have').length;
    const notSure = documents.filter((d) => d.status === 'not_sure').length;
    const expired = documents.filter((d) => d.status === 'expired').length;
    const readyPct = reqTotal > 0 ? Math.round((reqHave / reqTotal) * 100) : 0;

    return {
      requiredTotal: reqTotal,
      requiredHaveCount: reqHave,
      requiredNeedCount: reqNeed,
      requiredUnsureCount: reqUnsure,
      isFullyReady: fullyReady,
      remainingRequired: remRequired,
      total: tot,
      haveCount: have,
      dontHaveCount: dontHave,
      notSureCount: notSure,
      expiredCount: expired,
      readinessPercentage: readyPct
    };
  }, [documents]);

  const handleStatusChange = (id: string, status: DocumentStatus, docTitle: string) => {
    onUpdateStatus(id, status);
    let feedback = '';
    if (status === 'have') feedback = `"${docTitle}" marked as available.`;
    else if (status === 'dont_have') feedback = `"${docTitle}" marked as needed.`;
    else if (status === 'not_sure') feedback = `"${docTitle}" marked as not sure.`;
    else if (status === 'expired') feedback = `"${docTitle}" marked as expired.`;

    setToastMessage(feedback);
    setTimeout(() => {
      setToastMessage((prev) => (prev === feedback ? null : prev));
    }, 2200);
  };

  const filteredDocuments = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return documents.filter((doc) => {
      const matchesFilter = activeFilter === 'all' || doc.status === activeFilter;
      const matchesSearch =
        !q ||
        doc.title.toLowerCase().includes(q) ||
        doc.description.toLowerCase().includes(q) ||
        (doc.category && doc.category.toLowerCase().includes(q)) ||
        (doc.notes && doc.notes.toLowerCase().includes(q));
      return matchesFilter && matchesSearch;
    });
  }, [documents, activeFilter, searchQuery]);

  return (
    <div className="bg-[#f8f9ff] text-[#121c28] min-h-screen pb-44 md:pb-20 font-sans selection:bg-[#005db6] selection:text-white relative">
      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#001e40] text-white px-4 py-2.5 rounded-xl shadow-lg border border-[#005db6]/40 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <span className="material-symbols-outlined text-base text-emerald-400">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-[#c3c6d1]">
        <div className="flex justify-between items-center px-4 md:px-8 h-16 w-full max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="min-w-[44px] min-h-[44px] -ml-2 rounded-full hover:bg-[#eef4ff] text-[#001e40] flex items-center justify-center transition-colors focus:ring-2 focus:ring-[#005db6] focus:outline-none"
              aria-label="Go Back"
            >
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </button>
            <div>
              <h1 className="font-bold text-lg md:text-xl text-[#001e40] leading-tight">
                {selectedService ? `${selectedService.title} Checklist` : (t('document_checklist') || 'Document Checklist')}
              </h1>
              <p className="text-xs text-[#43474f]">
                {selectedService
                  ? `Verify required documents for ${selectedService.title} before your visit`
                  : 'Check off documents you have before your office visit'}
              </p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#eef4ff] text-[#001e40] flex items-center justify-center border border-[#005db6]/20">
            <span className="material-symbols-outlined text-2xl">fact_check</span>
          </div>
        </div>
      </header>

      <main className="w-full max-w-4xl mx-auto px-4 py-5 flex flex-col gap-5">

        {/* 1. Main Checklist Progress Summary Banner */}
        <section className={`rounded-2xl p-5 shadow-xs border transition-all ${
          isFullyReady
            ? 'bg-emerald-800 text-white border-emerald-900'
            : 'bg-white border-[#c3c6d1]'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wide px-2.5 py-0.5 rounded-md ${
                  isFullyReady
                    ? 'bg-emerald-900 text-emerald-100 border border-emerald-700'
                    : 'bg-[#eef4ff] text-[#005db6] border border-[#005db6]/20'
                }`}>
                  <span className="material-symbols-outlined text-sm">
                    {isFullyReady ? 'task_alt' : 'inventory_2'}
                  </span>
                  {isFullyReady ? "You're Ready!" : 'Preparation Status'}
                </span>
                
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  isFullyReady ? 'bg-emerald-700 text-white' : 'bg-[#eef4ff] text-[#005db6]'
                }`}>
                  {requiredHaveCount} of {requiredTotal} required documents ready
                </span>
              </div>

              <h2 className={`font-extrabold text-xl leading-tight ${isFullyReady ? 'text-white' : 'text-[#001e40]'}`}>
                {isFullyReady
                  ? "You have all required documents for your visit!"
                  : remainingRequired === 1
                  ? "You still need 1 required document"
                  : `You still need ${remainingRequired} required documents`}
              </h2>

              <p className={`text-xs ${isFullyReady ? 'text-emerald-100' : 'text-[#43474f]'}`}>
                {isFullyReady
                  ? "You said you have all required items. You are ready to proceed."
                  : "Mark whether you have each item below before visiting the government office."}
              </p>
            </div>

            {isFullyReady && (
              <button
                type="button"
                onClick={() => onNavigate('preparation_plan')}
                className="min-h-[44px] px-5 py-2.5 bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl font-bold text-xs transition-colors shadow-xs flex items-center justify-center gap-2 shrink-0 focus:ring-2 focus:ring-white focus:outline-none"
              >
                <span>View Summary</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-4 space-y-1.5">
            <div className={`w-full h-3 rounded-full overflow-hidden ${isFullyReady ? 'bg-emerald-900' : 'bg-[#f0f1f5]'}`}>
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isFullyReady ? 'bg-white' : 'bg-[#005db6]'
                }`}
                style={{ width: `${readinessPercentage}%` }}
              />
            </div>
          </div>
        </section>

        {/* 2. Private Self-Declaration Notice */}
        <div className="bg-[#eef4ff] border border-[#005db6]/20 rounded-xl p-3.5 flex items-start gap-3 text-xs text-[#001e40]">
          <span className="material-symbols-outlined text-lg text-[#005db6] shrink-0 mt-0.5">lock</span>
          <div>
            <strong className="font-bold">100% Private Self-Check:</strong> SmartSeva does not ask you to upload or scan files. You are only marking documents for your own visit preparation.
          </div>
        </div>

        {/* 3. Search & Filter Bar */}
        <section className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#43474f] text-lg">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents..."
              className="w-full h-10 pl-9 pr-8 rounded-xl border border-[#c3c6d1] bg-white text-xs text-[#121c28] outline-none focus:border-[#005db6] focus:ring-1 focus:ring-[#005db6] transition-colors font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#43474f] text-xs hover:text-[#121c28]"
              >
                ✕
              </button>
            )}
          </div>

          {/* Plain Language Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto hide-scrollbar pb-1 sm:pb-0">
            {[
              { id: 'all', label: `All (${total})` },
              { id: 'have', label: `Documents you have (${haveCount})` },
              { id: 'dont_have', label: `Documents still needed (${dontHaveCount})` },
              { id: 'not_sure', label: `Not sure (${notSureCount})` },
              { id: 'expired', label: `Expired (${expiredCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id as any)}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-colors border focus:ring-2 focus:ring-[#005db6] focus:outline-none ${
                  activeFilter === tab.id
                    ? 'bg-[#001e40] text-white border-[#001e40]'
                    : 'bg-white text-[#43474f] border-[#c3c6d1] hover:bg-[#eef4ff]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {/* 4. Document Items Section */}
        <section className="flex flex-col gap-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-bold text-sm text-[#001e40]">Required & Optional Documents</h3>
            <span className="text-xs font-medium text-[#43474f]">
              Showing {filteredDocuments.length} of {total}
            </span>
          </div>

          {filteredDocuments.length === 0 ? (
            <div className="bg-white border border-[#c3c6d1] rounded-2xl p-8 text-center space-y-3">
              <span className="material-symbols-outlined text-4xl text-[#43474f]">search_off</span>
              <p className="text-sm font-semibold text-[#121c28]">No matching documents found.</p>
              <button
                type="button"
                onClick={() => {
                  setActiveFilter('all');
                  setSearchQuery('');
                }}
                className="text-xs font-bold text-[#005db6] hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            filteredDocuments.map((doc) => {
              const isHave = doc.status === 'have';
              const isNeed = doc.status === 'dont_have';
              const isNotSure = doc.status === 'not_sure';
              const isExpired = doc.status === 'expired';

              return (
                <div
                  key={doc.id}
                  className={`bg-white border rounded-2xl p-4 sm:p-5 shadow-xs transition-all flex flex-col gap-3.5 ${
                    isHave
                      ? 'border-emerald-400 bg-emerald-50/20'
                      : isExpired
                      ? 'border-amber-400 bg-amber-50/20'
                      : isNeed
                      ? 'border-rose-300'
                      : 'border-[#c3c6d1] hover:border-[#005db6]/50'
                  }`}
                >
                  {/* Card Header: Document Name, Badges & User Status */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-[#c3c6d1]/40 pb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-base text-[#121c28] leading-tight">
                          {doc.title}
                        </h4>

                        {/* Required / Optional Badge */}
                        {doc.required ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-md uppercase tracking-wide">
                            Required
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-[#f0f1f5] text-[#43474f] px-2 py-0.5 rounded-md uppercase">
                            Optional
                          </span>
                        )}

                        {doc.category && (
                          <span className="text-[10px] font-semibold bg-[#eef4ff] text-[#005db6] px-2 py-0.5 rounded-md">
                            {doc.category}
                          </span>
                        )}
                      </div>

                      {/* Why it is needed & Simple Description */}
                      <p className="text-xs text-[#001e40] font-medium leading-relaxed">
                        {doc.description}
                      </p>
                      {doc.notes && (
                        <p className="text-[11px] text-[#43474f] italic">
                          Why needed: {doc.notes}
                        </p>
                      )}
                    </div>

                    {/* Honest User Status Badge */}
                    <div className="shrink-0 self-start sm:self-center">
                      {isHave && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                          <span className="material-symbols-outlined text-sm font-extrabold text-emerald-700">check_circle</span>
                          Marked as available
                        </span>
                      )}
                      {isNeed && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300">
                          <span className="material-symbols-outlined text-sm font-extrabold text-rose-700">error</span>
                          Needs to be obtained
                        </span>
                      )}
                      {isNotSure && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300">
                          <span className="material-symbols-outlined text-sm font-extrabold text-slate-600">help</span>
                          Unsure - check at home
                        </span>
                      )}
                      {isExpired && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          <span className="material-symbols-outlined text-sm font-extrabold text-amber-700">history_toggle_off</span>
                          Expired
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Question Prompt */}
                  <div className="text-xs font-bold text-[#001e40] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-[#005db6]">quiz</span>
                    <span>Do you have this document?</span>
                  </div>

                  {/* Primary Action Choice Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {/* Choice 1: I Have It */}
                    <button
                      type="button"
                      onClick={() => handleStatusChange(doc.id, 'have', doc.title)}
                      className={`min-h-[44px] px-3 py-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 focus:ring-2 focus:ring-[#005db6] focus:outline-none ${
                        isHave
                          ? 'bg-emerald-700 border-emerald-700 text-white shadow-xs'
                          : 'bg-white border-[#c3c6d1] text-[#121c28] hover:bg-emerald-50 hover:border-emerald-400'
                      }`}
                    >
                      <span className="material-symbols-outlined text-base">check</span>
                      <span>I Have It</span>
                    </button>

                    {/* Choice 2: I Need It */}
                    <button
                      type="button"
                      onClick={() => handleStatusChange(doc.id, 'dont_have', doc.title)}
                      className={`min-h-[44px] px-3 py-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 focus:ring-2 focus:ring-[#005db6] focus:outline-none ${
                        isNeed
                          ? 'bg-rose-700 border-rose-700 text-white shadow-xs'
                          : 'bg-white border-[#c3c6d1] text-[#121c28] hover:bg-rose-50 hover:border-rose-400'
                      }`}
                    >
                      <span className="material-symbols-outlined text-base">close</span>
                      <span>I Need It</span>
                    </button>

                    {/* Choice 3: Not Sure */}
                    <button
                      type="button"
                      onClick={() => handleStatusChange(doc.id, 'not_sure', doc.title)}
                      className={`min-h-[44px] px-3 py-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 focus:ring-2 focus:ring-[#005db6] focus:outline-none ${
                        isNotSure
                          ? 'bg-slate-700 border-slate-700 text-white shadow-xs'
                          : 'bg-white border-[#c3c6d1] text-[#43474f] hover:bg-slate-100 hover:text-[#001e40]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-base">help_outline</span>
                      <span>Not Sure</span>
                    </button>
                  </div>

                  {/* Secondary Guidance Box when "I Need It" or "Expired" is selected */}
                  {(isNeed || isExpired) && (
                    <div className="mt-1 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-amber-900">
                        <span className="material-symbols-outlined text-base text-amber-700 shrink-0">info</span>
                        <span>You may need to obtain this document before continuing.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onNavigate('document_guide')}
                        className="font-bold text-[#005db6] hover:underline flex items-center gap-1 shrink-0 ml-auto sm:ml-0"
                      >
                        <span>How to get this document</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </button>
                    </div>
                  )}

                  {/* Secondary Guidance Box when "Not Sure" is selected */}
                  {isNotSure && (
                    <div className="mt-1 p-3 rounded-xl bg-slate-100 border border-slate-300 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-slate-800">
                        <span className="material-symbols-outlined text-base text-slate-600 shrink-0">help</span>
                        <span>Check at home or ask family before your appointment.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setInfoModalDoc(doc)}
                        className="font-bold text-[#005db6] hover:underline flex items-center gap-1 shrink-0 ml-auto sm:ml-0"
                      >
                        <span>What is this?</span>
                        <span className="material-symbols-outlined text-sm">help_outline</span>
                      </button>
                    </div>
                  )}

                  {/* Help Option button for all states */}
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => setInfoModalDoc(doc)}
                      className="text-xs font-semibold text-[#005db6] hover:underline flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">help_outline</span>
                      <span>What is this document?</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </section>
      </main>

      {/* "What is this?" Explanation Modal */}
      {infoModalDoc && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-[#c3c6d1] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start gap-3 border-b border-[#c3c6d1]/50 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#eef4ff] text-[#001e40] flex items-center justify-center font-bold shrink-0">
                  <span className="material-symbols-outlined text-2xl">help_outline</span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#121c28]">{infoModalDoc.title}</h3>
                  <p className="text-xs text-[#43474f]">Document Guidance & Help</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInfoModalDoc(null)}
                className="p-1 rounded-full hover:bg-gray-100 text-[#43474f]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#121c28] leading-relaxed">
              <div className="bg-[#f8f9ff] p-3.5 rounded-xl border border-[#c3c6d1]/50 space-y-1">
                <strong className="text-[#001e40] font-bold block">Why is this required?</strong>
                <p className="text-[#43474f]">{infoModalDoc.description}</p>
              </div>

              <div className="space-y-1.5">
                <strong className="text-[#001e40] font-bold block">Acceptable Copies at Office:</strong>
                <ul className="list-disc pl-4 space-y-1 text-[#43474f]">
                  <li>Original physical document or plastic card</li>
                  <li>Official DigiLocker copy on smartphone</li>
                  <li>Attested photocopy if requested by the service provider</li>
                </ul>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-emerald-900 flex items-start gap-2">
                <span className="material-symbols-outlined text-base text-emerald-700 shrink-0 mt-0.5">lock</span>
                <span>
                  <strong>Private Check:</strong> SmartSeva never asks you to upload or scan documents. You are only declaring whether you have it for your own visit preparation.
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-[#c3c6d1]/40">
              <button
                type="button"
                onClick={() => {
                  handleStatusChange(infoModalDoc.id, 'have', infoModalDoc.title);
                  setInfoModalDoc(null);
                }}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              >
                <span className="material-symbols-outlined text-sm">check</span>
                I Have This Document
              </button>
              <button
                type="button"
                onClick={() => setInfoModalDoc(null)}
                className="bg-[#eef4ff] text-[#001e40] px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-[#dfe9fa] focus:ring-2 focus:ring-[#005db6] focus:outline-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Bar */}
      <footer className="fixed bottom-[64px] md:bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#c3c6d1] p-3.5 z-40 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="hidden sm:block text-xs">
            <span className="text-[#43474f]">Checklist Progress: </span>
            <strong className="text-[#005db6]">
              {requiredHaveCount} of {requiredTotal} required documents ready
            </strong>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => onNavigate('preparation_plan')}
              className="flex-1 sm:flex-initial min-h-[44px] px-5 bg-[#001e40] text-white rounded-xl font-bold text-xs hover:bg-[#00376f] transition-colors shadow-xs flex items-center justify-center gap-1.5 focus:ring-2 focus:ring-[#005db6] focus:outline-none"
            >
              <span>View Preparation Summary</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
