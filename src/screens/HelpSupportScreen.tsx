import React, { useState } from 'react';

interface HelpSupportScreenProps {
  onBack: () => void;
}

export const HelpSupportScreen: React.FC<HelpSupportScreenProps> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      question: 'How does the Document Availability Checklist work?',
      answer: 'The checklist allows you to mark whether you currently have a required document ("✓ I Have It"), do not have it ("✗ I Don\'t Have It"), or if it is expired ("⚠ Expired"). This helps you prepare before visiting government offices.'
    },
    {
      question: 'Are file uploads required on SmartSeva?',
      answer: 'No. SmartSeva is a preparation and readiness portal. You do not upload files or document copies. You simply track your physical document readiness.'
    },
    {
      question: 'How do I resolve an expired document status?',
      answer: 'If a document is marked as Expired, view the Missing Document Guide to check renewal requirements. Once renewed, update its status to "✓ I Have It".'
    },
    {
      question: 'Do I need to book appointments on SmartSeva?',
      answer: 'No appointment booking is required on this preparation tool. Complete your preparation checklist and bring your original documents directly to the relevant office.'
    }
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <h1 className="font-bold text-xl text-[#001e40]">Help & Preparation Support</h1>
          </div>
          <span className="material-symbols-outlined text-[#001e40] text-2xl">help</span>
        </div>
      </header>

      <main className="w-full max-w-3xl mx-auto px-4 py-6 flex flex-col gap-6">
        {/* Search Bar */}
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#737780]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search preparation guides and FAQs..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-[#c3c6d1] rounded-full text-sm outline-none focus:ring-2 focus:ring-[#005db6]"
          />
        </div>

        {/* FAQs Section */}
        <section className="bg-white border border-[#c3c6d1] rounded-2xl p-5 shadow-sm">
          <h2 className="font-bold text-lg text-[#001e40] mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {filteredFaqs.map((faq, idx) => (
              <div key={idx} className="border-b border-[#d9e3f4] pb-4 last:border-0 last:pb-0">
                <h3 className="font-bold text-sm text-[#121c28] mb-1">
                  {faq.question}
                </h3>
                <p className="text-xs text-[#43474f] leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Support */}
        <section className="bg-[#eef4ff] border border-[#c3c6d1] rounded-2xl p-5 shadow-sm text-center">
          <h3 className="font-bold text-base text-[#001e40]">Need Further Help?</h3>
          <p className="text-xs text-[#43474f] mt-1 mb-4">
            Our citizen support team is available for preparation guidance.
          </p>
          <div className="flex justify-center gap-3">
            <a
              href="mailto:support@smartseva.gov.in"
              className="px-4 py-2 bg-white border border-[#c3c6d1] rounded-xl text-xs font-bold text-[#001e40] hover:bg-[#dfe9fa] transition-colors"
            >
              Email Support
            </a>
            <a
              href="tel:1800112233"
              className="px-4 py-2 bg-[#001e40] text-white rounded-xl text-xs font-bold hover:bg-[#003366] transition-colors"
            >
              Call Helpline
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};
