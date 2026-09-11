import React from 'react';
import { ScreenType } from '../types';

interface DocumentGuideScreenProps {
  onBack: () => void;
  onMarkAsObtained: () => void;
  onNavigate: (screen: ScreenType) => void;
}

export const DocumentGuideScreen: React.FC<DocumentGuideScreenProps> = ({
  onBack,
  onMarkAsObtained,
  onNavigate
}) => {
  return (
    <div className="bg-[#f8f9ff] text-[#121c28] min-h-screen pb-28 md:pb-12 font-sans selection:bg-[#005db6] selection:text-white">
      {/* Top Header */}
      <header className="bg-[#f8f9ff]/95 backdrop-blur-md sticky top-0 z-40 border-b border-[#c3c6d1]">
        <div className="flex justify-between items-center px-4 md:px-8 h-16 w-full max-w-3xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="min-w-[44px] min-h-[44px] -ml-2 rounded-full hover:bg-[#eef4ff] text-[#001e40] flex items-center justify-center transition-colors focus:ring-2 focus:ring-[#005db6] focus:outline-none"
              aria-label="Go back"
            >
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </button>
            <div>
              <h1 className="font-bold text-lg md:text-xl text-[#001e40] leading-tight">
                Missing Document Guide
              </h1>
              <p className="text-xs text-[#43474f]">Proof of Address & Required Documents</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('preparation_plan')}
            className="min-h-[44px] text-xs font-bold text-[#005db6] hover:bg-[#eef4ff] px-3.5 py-2 rounded-xl border border-[#005db6]/20 transition-colors flex items-center gap-1 focus:ring-2 focus:ring-[#005db6] focus:outline-none"
          >
            <span className="material-symbols-outlined text-base">assignment</span>
            <span>Plan</span>
          </button>
        </div>
      </header>

      <main className="w-full max-w-3xl mx-auto px-4 py-6 flex flex-col gap-6">
        {/* Banner: Missing Document Header */}
        <section className="bg-gradient-to-r from-[#001e40] to-[#00376f] text-white border border-[#001e40] rounded-2xl p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-amber-400 text-amber-950 rounded-2xl shrink-0 font-bold">
              <span className="material-symbols-outlined text-3xl">assignment_late</span>
            </div>
            <div className="space-y-1">
              <span className="inline-block text-[10px] font-extrabold uppercase bg-amber-400/20 text-amber-300 border border-amber-300/30 px-2 py-0.5 rounded-md tracking-wider">
                Action Needed
              </span>
              <h2 className="text-xl font-extrabold text-white">
                Proof of Address (Utility Bill / Rent Agreement)
              </h2>
              <p className="text-xs text-[#d5e3ff] leading-relaxed">
                Required for residential verification on driving license, passport, and official regional applications.
              </p>
            </div>
          </div>
        </section>

        {/* 1. Why the Document is Required */}
        <section className="bg-white border border-[#c3c6d1] rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-[#001e40] border-b border-[#c3c6d1]/40 pb-2.5">
            <span className="material-symbols-outlined text-[#005db6]">help_outline</span>
            <h3 className="font-bold text-base text-[#121c28]">Why is this document required?</h3>
          </div>
          <p className="text-xs md:text-sm text-[#43474f] leading-relaxed">
            Government issuing authorities require valid, verified proof of current residential address to ensure official correspondence, verify regional jurisdiction, and prevent identity fraud before issuing licenses or certificates.
          </p>
        </section>

        {/* 2. Eligibility */}
        <section className="bg-white border border-[#c3c6d1] rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-[#001e40] border-b border-[#c3c6d1]/40 pb-2.5">
            <span className="material-symbols-outlined text-[#005db6]">person_check</span>
            <h3 className="font-bold text-base text-[#121c28]">Eligibility Requirements</h3>
          </div>
          <ul className="space-y-2 text-xs md:text-sm text-[#43474f]">
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-emerald-600 text-base mt-0.5 shrink-0">check_circle</span>
              <span><strong>Resident Citizen:</strong> Applicant must be residing at the declared address for at least 30 consecutive days.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-emerald-600 text-base mt-0.5 shrink-0">check_circle</span>
              <span><strong>Matching Name Credentials:</strong> Document holder's name must match your primary photo identity proof (Aadhaar/PAN).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-emerald-600 text-base mt-0.5 shrink-0">check_circle</span>
              <span><strong>Validity Period:</strong> Utility bills must be issued within the last 90 days. Rent agreements must be currently active and notarized.</span>
            </li>
          </ul>
        </section>

        {/* 3. Required Documents to Apply */}
        <section className="bg-white border border-[#c3c6d1] rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-[#001e40] border-b border-[#c3c6d1]/40 pb-2.5">
            <span className="material-symbols-outlined text-[#005db6]">folder_open</span>
            <h3 className="font-bold text-base text-[#121c28]">Supporting Documents Needed to Apply</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-[#f8f9ff] border border-[#c3c6d1]/50 rounded-xl space-y-1">
              <div className="font-bold text-[#001e40] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-[#005db6]">badge</span>
                Primary Identity Proof
              </div>
              <p className="text-[#43474f]">Aadhaar Card, Passport, Voter ID, or PAN Card copy.</p>
            </div>

            <div className="p-3 bg-[#f8f9ff] border border-[#c3c6d1]/50 rounded-xl space-y-1">
              <div className="font-bold text-[#001e40] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-[#005db6]">receipt_long</span>
                Utility / Bank Record
              </div>
              <p className="text-[#43474f]">Recent Electricity, Water, Gas bill, or Bank Passbook statement.</p>
            </div>

            <div className="p-3 bg-[#f8f9ff] border border-[#c3c6d1]/50 rounded-xl space-y-1">
              <div className="font-bold text-[#001e40] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-[#005db6]">gavel</span>
                Rent Agreement (If Tenant)
              </div>
              <p className="text-[#43474f]">Registered agreement stamped by Sub-Registrar or Notary Public.</p>
            </div>

            <div className="p-3 bg-[#f8f9ff] border border-[#c3c6d1]/50 rounded-xl space-y-1">
              <div className="font-bold text-[#001e40] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-[#005db6]">photo_camera</span>
                Passport Photo
              </div>
              <p className="text-[#43474f]">2 recent color passport photos with plain white background.</p>
            </div>
          </div>
        </section>

        {/* 4. Processing Time */}
        <section className="bg-white border border-[#c3c6d1] rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-[#001e40] border-b border-[#c3c6d1]/40 pb-2.5">
            <span className="material-symbols-outlined text-[#005db6]">schedule</span>
            <h3 className="font-bold text-base text-[#121c28]">Estimated Processing Time</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-center">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="font-extrabold text-emerald-900 block text-base">2 - 3 Days</span>
              <span className="text-emerald-700 font-medium">Online E-Download</span>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
              <span className="font-extrabold text-blue-900 block text-base">5 - 7 Days</span>
              <span className="text-blue-700 font-medium">Standard Issue</span>
            </div>
            <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
              <span className="font-extrabold text-purple-900 block text-base">24 Hours</span>
              <span className="text-purple-700 font-medium">Tatkal / Urgent</span>
            </div>
          </div>
        </section>

        {/* 5. Step-by-Step Application Steps */}
        <section className="bg-white border border-[#c3c6d1] rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-[#001e40] border-b border-[#c3c6d1]/40 pb-2.5">
            <span className="material-symbols-outlined text-[#005db6]">route</span>
            <h3 className="font-bold text-base text-[#121c28]">Application Steps</h3>
          </div>

          <div className="space-y-3">
            <div className="flex gap-3 items-start">
              <span className="w-6 h-6 rounded-full bg-[#001e40] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <div>
                <h4 className="font-bold text-xs md:text-sm text-[#121c28]">Log into Official Provider Portal</h4>
                <p className="text-xs text-[#43474f] mt-0.5">
                  Visit your state electricity board, municipal portal, or bank net-banking services.
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <span className="w-6 h-6 rounded-full bg-[#001e40] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <div>
                <h4 className="font-bold text-xs md:text-sm text-[#121c28]">Fill Application / Request Form</h4>
                <p className="text-xs text-[#43474f] mt-0.5">
                  Select "E-Statement Download" or "Address Certificate Application" and enter account number.
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <span className="w-6 h-6 rounded-full bg-[#001e40] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <div>
                <h4 className="font-bold text-xs md:text-sm text-[#121c28]">Verify Details & Save Copy</h4>
                <p className="text-xs text-[#43474f] mt-0.5">
                  Check that your full name and current pin code match your appointment application details.
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <span className="w-6 h-6 rounded-full bg-[#001e40] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                4
              </span>
              <div>
                <h4 className="font-bold text-xs md:text-sm text-[#121c28]">Update SmartSeva Checklist</h4>
                <p className="text-xs text-[#43474f] mt-0.5">
                  Once obtained, return to SmartSeva and mark the document as "✓ Available".
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Helpful Tips */}
        <section className="bg-amber-50/80 border border-amber-300 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-amber-900 border-b border-amber-200 pb-2">
            <span className="material-symbols-outlined text-amber-700">lightbulb</span>
            <h3 className="font-bold text-base">Helpful Pro-Tips to Avoid Rejection</h3>
          </div>
          <ul className="space-y-2 text-xs text-amber-950 leading-relaxed">
            <li className="flex items-start gap-1.5">
              <span>•</span>
              <span><strong>Spelling Check:</strong> Ensure your name spelling on utility bills matches your Aadhaar letter-for-letter.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span>•</span>
              <span><strong>DigiLocker Integration:</strong> Download DigiLocker verified e-documents on your phone for instant acceptance at government desks.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span>•</span>
              <span><strong>Print Quality:</strong> If bringing physical paper, ensure bar-codes and official stamps are completely legible.</span>
            </li>
          </ul>
        </section>

      </main>

      {/* 7. Sticky Bottom Bar with Return to Preparation Plan */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#c3c6d1] p-3.5 z-40 shadow-lg">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-2.5">
          {/* Action 1: Mark as Obtained */}
          <button
            onClick={() => {
              onMarkAsObtained();
              onNavigate('document_checklist');
            }}
            className="w-full sm:flex-1 h-11 bg-emerald-700 text-white rounded-xl font-bold text-xs hover:bg-emerald-800 transition-colors shadow-sm flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">check_circle</span>
            <span>Mark as "✓ Available"</span>
          </button>

          {/* Action 2: Return to Preparation Plan */}
          <button
            onClick={() => onNavigate('preparation_plan')}
            className="w-full sm:flex-1 h-11 bg-[#001e40] text-white rounded-xl font-bold text-xs hover:bg-[#00376f] transition-colors shadow-sm flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">assignment</span>
            <span>Return to Preparation Plan</span>
          </button>

          {/* Action 3: Return to Checklist */}
          <button
            onClick={() => onNavigate('document_checklist')}
            className="w-full sm:w-auto h-11 px-4 border border-[#c3c6d1] text-[#43474f] rounded-xl font-bold text-xs hover:bg-[#eef4ff] hover:text-[#001e40] transition-colors"
          >
            Checklist
          </button>
        </div>
      </footer>
    </div>
  );
};

