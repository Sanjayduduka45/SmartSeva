import React, { useMemo } from 'react';
import { ScreenType, DocumentItem, ServiceItem } from '../types';

interface PreparationPlanScreenProps {
  selectedService?: ServiceItem;
  documents: DocumentItem[];
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
}

export const PreparationPlanScreen: React.FC<PreparationPlanScreenProps> = ({
  selectedService,
  documents,
  onBack,
  onNavigate
}) => {
  // 1. READINESS CALCULATIONS (Memoized to eliminate redundant computations on re-render)
  const { requiredTotal, requiredHaveCount, isReady, missingDocs, availableDocs } = useMemo(() => {
    const req = documents.filter((d) => d.required);
    const reqTotal = req.length;
    const reqHave = req.filter((d) => d.status === 'have').length;
    const ready = reqTotal > 0 ? reqHave === reqTotal : documents.every((d) => d.status === 'have');
    const missing = documents.filter(
      (d) => d.status === 'dont_have' || d.status === 'expired' || d.status === 'not_sure' || (d.required && d.status !== 'have')
    );
    const available = documents.filter((d) => d.status === 'have');
    return {
      requiredTotal: reqTotal,
      requiredHaveCount: reqHave,
      isReady: ready,
      missingDocs: missing,
      availableDocs: available
    };
  }, [documents]);

  const serviceTitle = selectedService?.title || 'Government Office Visit';

  // 4. SERVICE-SPECIFIC NEXT STEPS
  const getServiceNextSteps = (service?: ServiceItem) => {
    const titleLower = (service?.title || '').toLowerCase();

    if (titleLower.includes('driving') || titleLower.includes('license')) {
      return [
        {
          num: 1,
          title: 'Check required documents',
          desc: "Verify that your Learner's License, Age Proof, and Address Proof are marked as available in your checklist.",
        },
        {
          num: 2,
          title: 'Prepare original documents',
          desc: 'Gather your physical originals for identity proof, address proof, and existing permit/license.',
        },
        {
          num: 3,
          title: 'Keep required copies & photos',
          desc: 'Prepare 2 self-attested photocopies of each original document and 2 recent passport-size photographs.',
        },
        {
          num: 4,
          title: 'Check official application / office process',
          desc: 'Visit the state transport / Parivahan portal to complete pre-filing fees or book an RTO appointment slot.',
        },
        {
          num: 5,
          title: 'Visit or submit through the appropriate official channel',
          desc: 'Visit your nearest Regional Transport Office (RTO) at your scheduled time with your document folder.',
        },
      ];
    }

    if (titleLower.includes('passport')) {
      return [
        {
          num: 1,
          title: 'Check required documents',
          desc: 'Confirm that names, date of birth, and address details match across your Aadhaar Card, Address Proof, and Birth Certificate.',
        },
        {
          num: 2,
          title: 'Prepare original documents',
          desc: 'Assemble original physical copies of Aadhaar Card, Proof of Address, and Birth Certificate.',
        },
        {
          num: 3,
          title: 'Keep required copies & photos',
          desc: 'Keep 2 self-attested photocopies of each original document.',
        },
        {
          num: 4,
          title: 'Check official application / office process',
          desc: 'Register and schedule your appointment on the official Passport Seva Kendra (PSK) portal.',
        },
        {
          num: 5,
          title: 'Visit or submit through the appropriate official channel',
          desc: 'Visit the assigned Passport Seva Kendra (PSK) on your appointment date with all original documents.',
        },
      ];
    }

    if (titleLower.includes('aadhaar')) {
      return [
        {
          num: 1,
          title: 'Check required documents',
          desc: 'Ensure your supporting address or identity document is valid and issued within acceptable timeframes.',
        },
        {
          num: 2,
          title: 'Prepare original documents',
          desc: 'Carry the original supporting document for biometric and document scanning at the center.',
        },
        {
          num: 3,
          title: 'Keep required copies & photos',
          desc: 'Keep your existing Aadhaar number and active mobile phone for OTP verification.',
        },
        {
          num: 4,
          title: 'Check official application / office process',
          desc: 'Check if your update can be submitted on myAadhaar or requires an in-person Aadhaar Seva Kendra appointment.',
        },
        {
          num: 5,
          title: 'Visit or submit through the appropriate official channel',
          desc: 'Visit your nearest Aadhaar Seva Kendra or submit online through the official UIDAI portal.',
        },
      ];
    }

    if (titleLower.includes('pan')) {
      return [
        {
          num: 1,
          title: 'Check required documents',
          desc: 'Verify that your Aadhaar card details match your name and date of birth exactly.',
        },
        {
          num: 2,
          title: 'Prepare original documents',
          desc: 'Keep physical Aadhaar card and identity proof ready for inspection.',
        },
        {
          num: 3,
          title: 'Keep required copies & photos',
          desc: 'Keep 2 recent passport-size color photographs (3.5cm x 2.5cm) with light background.',
        },
        {
          num: 4,
          title: 'Check official application / office process',
          desc: 'Fill Form 49A online via Protean (NSDL) / UTIITSL portal or carry signed paper application.',
        },
        {
          num: 5,
          title: 'Visit or submit through the appropriate official channel',
          desc: 'Visit nearest UTIITSL / Protean TIN-FC center or authenticate instantly via Aadhaar OTP.',
        },
      ];
    }

    if (titleLower.includes('birth') || titleLower.includes('death')) {
      return [
        {
          num: 1,
          title: 'Check required documents',
          desc: 'Ensure hospital discharge slip, institutional birth summary, and parents Aadhaar cards are verified.',
        },
        {
          num: 2,
          title: 'Prepare original documents',
          desc: 'Carry original institutional delivery receipt and parents government identity cards.',
        },
        {
          num: 3,
          title: 'Keep required copies & photos',
          desc: 'Prepare self-attested photocopies of parents Aadhaar cards and marriage certificate if applicable.',
        },
        {
          num: 4,
          title: 'Check official application / office process',
          desc: 'Check state Civil Registration System (CRS) portal or municipal corporation portal guidelines.',
        },
        {
          num: 5,
          title: 'Visit or submit through the appropriate official channel',
          desc: 'Submit at your local Municipal Ward Office, Birth & Death Registrar, or Gram Panchayat.',
        },
      ];
    }

    if (titleLower.includes('income') || titleLower.includes('caste') || titleLower.includes('residence') || titleLower.includes('domicile')) {
      return [
        {
          num: 1,
          title: 'Check required documents',
          desc: 'Verify income declaration affidavit, family ration card, and community proof documents.',
        },
        {
          num: 2,
          title: 'Prepare original documents',
          desc: 'Carry original Aadhaar card, family ration booklet, and paternal caste certificate if applying for caste verification.',
        },
        {
          num: 3,
          title: 'Keep required copies & photos',
          desc: 'Keep 2 sets of self-attested document copies and 2 passport-size photographs.',
        },
        {
          num: 4,
          title: 'Check official application / office process',
          desc: 'Generate e-District / MeeSeva application reference number and pay prescribed government fee.',
        },
        {
          num: 5,
          title: 'Visit or submit through the appropriate official channel',
          desc: 'Visit Revenue Tehsildar Office, Sub-Divisional Magistrate office, or authorized CSC MeeSeva counter.',
        },
      ];
    }

    // Default / General Service Steps
    return [
      {
        num: 1,
        title: 'Check required documents',
        desc: `Review the list of required documents for ${serviceTitle} and confirm availability.`,
      },
      {
        num: 2,
        title: 'Prepare original documents',
        desc: 'Gather physical original documents in a clean protective folder.',
      },
      {
        num: 3,
        title: 'Keep required copies & photos',
        desc: 'Make 2 sets of photocopies and carry recent passport-size photographs if required.',
      },
      {
        num: 4,
        title: 'Check official application / office process',
        desc: 'Check the official portal or local office guidelines for appointment booking or fee rules.',
      },
      {
        num: 5,
        title: 'Visit or submit through the appropriate official channel',
        desc: 'Submit your application at the designated official office or authorized digital channel.',
      },
    ];
  };

  const steps = getServiceNextSteps(selectedService);

  return (
    <div className="bg-[#f8f9ff] text-[#121c28] min-h-screen pb-32 md:pb-16 font-sans selection:bg-[#005db6] selection:text-white">
      {/* Top Header */}
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
                Your Preparation Summary
              </h1>
              <p className="text-xs text-[#43474f]">{serviceTitle}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('document_checklist')}
            className="min-h-[40px] text-xs font-bold text-[#005db6] bg-[#eef4ff] hover:bg-[#dfe9fa] px-3.5 py-1.5 rounded-xl border border-[#005db6]/20 transition-colors flex items-center gap-1.5 focus:ring-2 focus:ring-[#005db6] focus:outline-none"
          >
            <span className="material-symbols-outlined text-base">fact_check</span>
            <span className="hidden sm:inline">Edit Checklist</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-4xl mx-auto px-4 md:px-8 py-5 space-y-6">

        {/* ==================================================================== */}
        {/* QUESTION 1: AM I READY? */}
        {/* ==================================================================== */}
        <section
          className={`rounded-2xl p-5 sm:p-6 border transition-all ${
            isReady
              ? 'bg-emerald-900 text-white border-emerald-950 shadow-sm'
              : 'bg-white text-[#121c28] border-amber-300 shadow-sm'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide ${
                  isReady
                    ? 'bg-emerald-950 text-emerald-100 border border-emerald-700'
                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  {isReady ? 'check_circle' : 'pending_actions'}
                </span>
                <span>Question 1: Am I Ready?</span>
              </span>

              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  isReady ? 'bg-emerald-800 text-white' : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}
              >
                {requiredHaveCount} of {requiredTotal} required documents marked as available
              </span>
            </div>

            <div className="space-y-1">
              <h2
                className={`text-2xl sm:text-3xl font-black leading-tight ${
                  isReady ? 'text-white' : 'text-[#001e40]'
                }`}
              >
                {isReady ? "You're ready" : "You're not ready yet"}
              </h2>

              <p className={`text-xs sm:text-sm font-medium ${isReady ? 'text-emerald-100' : 'text-[#43474f]'}`}>
                {isReady
                  ? 'All required documents have been marked as available in your checklist. Review what to bring with you below.'
                  : `${requiredTotal - requiredHaveCount} required document${
                      requiredTotal - requiredHaveCount === 1 ? '' : 's'
                    } still needed before visiting the government office.`}
              </p>
            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* QUESTION 2: WHAT AM I MISSING? */}
        {/* ==================================================================== */}
        <section className="bg-white rounded-2xl border border-[#c3c6d1] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#c3c6d1]/40 pb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#005db6] text-xl">help</span>
              <h3 className="font-extrabold text-base sm:text-lg text-[#001e40]">
                2. What am I missing?
              </h3>
            </div>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                missingDocs.length === 0
                  ? 'bg-emerald-100 text-emerald-900'
                  : 'bg-rose-100 text-rose-900'
              }`}
            >
              {missingDocs.length} Item{missingDocs.length === 1 ? '' : 's'}
            </span>
          </div>

          {missingDocs.length === 0 ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-900 flex items-center gap-3 text-xs font-semibold">
              <span className="material-symbols-outlined text-xl text-emerald-700 shrink-0">check_circle</span>
              <span>Nothing missing! You have marked all required documents as available.</span>
            </div>
          ) : (
            <div className="space-y-3">
              {missingDocs.map((doc) => {
                const isExpired = doc.status === 'expired';
                const isNotSure = doc.status === 'not_sure';

                return (
                  <div
                    key={doc.id}
                    className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm text-[#121c28]">{doc.title}</h4>
                        {doc.required ? (
                          <span className="text-[10px] font-extrabold bg-rose-100 text-rose-900 border border-rose-200 px-2 py-0.5 rounded uppercase">
                            Required
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-[#f0f1f5] text-[#43474f] px-2 py-0.5 rounded uppercase">
                            Optional
                          </span>
                        )}
                        <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded uppercase">
                          {isExpired ? 'Expired' : isNotSure ? 'Unsure' : 'Needs to be obtained'}
                        </span>
                      </div>

                      {/* Why it is needed */}
                      <p className="text-xs text-[#001e40] font-medium leading-relaxed">
                        <strong>Why needed:</strong> {doc.description}
                      </p>
                      {doc.notes && (
                        <p className="text-[11px] text-[#43474f] italic">
                          Note: {doc.notes}
                        </p>
                      )}
                    </div>

                    {/* How to get it / Next step */}
                    <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 pt-1 sm:pt-0">
                      <button
                        type="button"
                        onClick={() => onNavigate('document_guide')}
                        className="min-h-[38px] bg-[#001e40] hover:bg-[#00376f] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 focus:ring-2 focus:ring-[#005db6] focus:outline-none"
                      >
                        <span>How to get this</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onNavigate('document_checklist')}
                        className="min-h-[38px] bg-white border border-[#c3c6d1] text-[#001e40] hover:bg-[#eef4ff] px-3 py-1.5 rounded-xl text-xs font-bold transition-colors focus:ring-2 focus:ring-[#005db6] focus:outline-none"
                      >
                        Update status
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ==================================================================== */}
        {/* QUESTION 3: WHAT SHOULD I DO NEXT? */}
        {/* ==================================================================== */}
        <section className="bg-white rounded-2xl border border-[#c3c6d1] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#c3c6d1]/40 pb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#005db6] text-xl">format_list_numbered</span>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-[#001e40]">
                  3. What should I do next?
                </h3>
                <p className="text-xs text-[#43474f]">Step-by-step guidance for {serviceTitle}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {steps.map((step) => (
              <div
                key={step.num}
                className="p-3.5 rounded-xl border border-[#c3c6d1]/60 bg-[#f8f9ff] flex items-start gap-3"
              >
                <span className="w-6 h-6 rounded-full bg-[#001e40] text-white font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {step.num}
                </span>
                <div className="space-y-0.5">
                  <h4 className="font-bold text-xs sm:text-sm text-[#001e40]">
                    {step.title}
                  </h4>
                  <p className="text-xs text-[#43474f] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Guidance Disclaimer */}
          <div className="bg-[#eef4ff] border border-[#005db6]/20 rounded-xl p-3 text-xs text-[#001e40] flex items-start gap-2.5">
            <span className="material-symbols-outlined text-base text-[#005db6] shrink-0 mt-0.5">info</span>
            <span>
              <strong>Official Process Note:</strong> General preparation guidance shown above. Official procedures, appointment rules, and fee structures may vary by state or office. Always confirm on official government portals.
            </span>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* QUESTION 4: WHAT SHOULD I TAKE WITH ME? */}
        {/* ==================================================================== */}
        <section className="bg-white rounded-2xl border border-[#c3c6d1] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#c3c6d1]/40 pb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#005db6] text-xl">work</span>
              <h3 className="font-extrabold text-base sm:text-lg text-[#001e40]">
                4. What should I take with me?
              </h3>
            </div>
            <span className="text-xs font-semibold text-[#43474f]">
              Office Visit Checklist
            </span>
          </div>

          <div className="space-y-3 text-xs text-[#121c28]">

            {/* 1. Original Physical Documents */}
            <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/30 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-950 font-bold">
                <span className="material-symbols-outlined text-base text-emerald-700">description</span>
                <span>Original Physical Documents</span>
              </div>
              {availableDocs.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1 text-[#43474f] font-medium">
                  {availableDocs.map((d) => (
                    <li key={d.id}>
                      <strong className="text-[#121c28]">{d.title}</strong>
                      {d.required && <span className="text-[10px] text-emerald-800 ml-1">(Required)</span>}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[#43474f] italic">
                  No documents marked as available yet. Mark items in your checklist to populate your physical originals list.
                </p>
              )}
            </div>

            {/* 2. Photocopies */}
            <div className="p-3.5 rounded-xl border border-[#c3c6d1]/60 bg-[#f8f9ff] space-y-1">
              <div className="flex items-center gap-2 text-[#001e40] font-bold">
                <span className="material-symbols-outlined text-base text-[#005db6]">file_copy</span>
                <span>Self-Attested Photocopies</span>
              </div>
              <p className="text-[#43474f] leading-relaxed">
                Carry at least <strong>1 to 2 sets of clear photocopies</strong> of every original document you are taking.
              </p>
            </div>

            {/* 3. Passport Photographs */}
            <div className="p-3.5 rounded-xl border border-[#c3c6d1]/60 bg-[#f8f9ff] space-y-1">
              <div className="flex items-center gap-2 text-[#001e40] font-bold">
                <span className="material-symbols-outlined text-base text-[#005db6]">badge</span>
                <span>Passport Photographs</span>
              </div>
              <p className="text-[#43474f] leading-relaxed">
                Carry <strong>2 to 4 recent passport-size photographs</strong> with a plain light or white background.
              </p>
            </div>

            {/* 4. Digital Backup & Smartphone */}
            <div className="p-3.5 rounded-xl border border-[#c3c6d1]/60 bg-[#f8f9ff] space-y-1">
              <div className="flex items-center gap-2 text-[#001e40] font-bold">
                <span className="material-symbols-outlined text-base text-[#005db6]">smartphone</span>
                <span>Digital Backup & Mobile Phone</span>
              </div>
              <p className="text-[#43474f] leading-relaxed">
                Ensure your smartphone is charged with <strong>DigiLocker installed</strong> for instant digital document access, and keep your mobile active for official SMS OTP verifications.
              </p>
            </div>

            {/* 5. Payment & Appointment Details */}
            <div className="p-3.5 rounded-xl border border-[#c3c6d1]/60 bg-[#f8f9ff] space-y-1">
              <div className="flex items-center gap-2 text-[#001e40] font-bold">
                <span className="material-symbols-outlined text-base text-[#005db6]">payments</span>
                <span>Fees & Appointment Slip</span>
              </div>
              <p className="text-[#43474f] leading-relaxed">
                Bring official fee payment method (exact cash or card/UPI) and a printed or digital copy of your official appointment slip if booked online.
              </p>
            </div>

          </div>
        </section>

        {/* ==================================================================== */}
        {/* QUESTION 5: WHERE DO I GO? (NEARBY OFFICES) */}
        {/* ==================================================================== */}
        <section className="bg-gradient-to-r from-[#001e40] to-[#00376f] rounded-2xl p-5 shadow-md text-white space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl text-amber-300">location_on</span>
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-white">
                  5. Where do I go?
                </h3>
                <p className="text-xs text-[#d5e3ff]">Official office locations for {serviceTitle}</p>
              </div>
            </div>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-amber-950 uppercase">
              Real-world Visit
            </span>
          </div>

          <p className="text-xs text-[#d5e3ff] leading-relaxed">
            Find nearest official government counters, working hours, contact numbers, and turn-by-turn directions.
          </p>

          <button
            type="button"
            onClick={() => onNavigate('nearby_offices')}
            className="w-full h-11 bg-amber-400 hover:bg-amber-300 text-amber-950 font-extrabold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-lg">near_me</span>
            <span>Find Nearby Offices</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </section>

      </main>

      {/* Sticky Bottom Bar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#c3c6d1] p-3.5 z-40 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="hidden sm:block text-xs">
            <span className="text-[#43474f]">Status: </span>
            <strong className={isReady ? 'text-emerald-700' : 'text-amber-800'}>
              {isReady ? "Ready for Visit" : "Preparation Pending"}
            </strong>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => onNavigate('nearby_offices')}
              className="flex-1 sm:flex-initial min-h-[44px] px-4 bg-[#eef4ff] border border-[#005db6] text-[#005db6] rounded-xl font-bold text-xs hover:bg-[#dfe9fa] transition-colors flex items-center justify-center gap-1.5 focus:ring-2 focus:ring-[#005db6] focus:outline-none"
            >
              <span className="material-symbols-outlined text-base">location_on</span>
              <span>Nearby Offices</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('document_checklist')}
              className="flex-1 sm:flex-initial min-h-[44px] px-4 bg-[#001e40] text-white rounded-xl font-bold text-xs hover:bg-[#00376f] transition-colors shadow-xs flex items-center justify-center gap-1.5 focus:ring-2 focus:ring-[#005db6] focus:outline-none"
            >
              <span className="material-symbols-outlined text-base">fact_check</span>
              <span>Edit Checklist</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('readiness_dashboard')}
              className="flex-1 sm:flex-initial min-h-[44px] px-4 bg-[#005db6] text-white rounded-xl font-bold text-xs hover:bg-[#005db6]/90 transition-colors shadow-xs flex items-center justify-center gap-1.5 focus:ring-2 focus:ring-[#005db6] focus:outline-none"
            >
              <span>Dashboard</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
