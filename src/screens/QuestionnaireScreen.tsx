import React, { useState } from 'react';

interface QuestionnaireScreenProps {
  onBack: () => void;
  onNext: () => void;
}

export const QuestionnaireScreen: React.FC<QuestionnaireScreenProps> = ({
  onBack,
  onNext
}) => {
  const [selectedOption, setSelectedOption] = useState<string>('yes');
  const [showHelp, setShowHelp] = useState<boolean>(false);

  return (
    <div className="bg-white text-[#121c28] min-h-screen flex flex-col items-center">
      <div className="w-full max-w-md mx-auto relative min-h-screen flex flex-col bg-white pb-32">
        {/* Top Header */}
        <header className="w-full sticky top-0 bg-white border-b border-[#c3c6d1] z-10">
          <div className="flex justify-between items-center px-4 h-16 w-full">
            <button
              onClick={onBack}
              aria-label="Go back"
              className="text-[#43474f] hover:bg-[#eef4ff] rounded-full p-2"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-lg font-bold text-[#001e40]">Questionnaire</h1>
            <div className="w-10"></div>
          </div>
          {/* Progress Bar */}
          <div className="w-full h-1 bg-[#d9e3f4]">
            <div className="h-full bg-[#003366]" style={{ width: '30%' }}></div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-4 pt-6 pb-4 flex flex-col">
          {/* Progress Meta */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-semibold text-[#43474f]">Question 3 of 12</span>
            <span className="text-xs text-[#737780] flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">schedule</span> Est. 4 mins left
            </span>
          </div>

          {/* Question Card */}
          <div className="bg-white border border-[#c3c6d1] rounded-2xl p-5 mb-4 shadow-sm">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-bold text-[#121c28]">
                Do you already have an Aadhaar Card?
              </h2>
              <button
                onClick={() => setShowHelp(!showHelp)}
                aria-label="Help with this question"
                className="text-[#003366] hover:text-[#001e40] transition-colors ml-2 shrink-0 p-1 rounded-full hover:bg-[#eef4ff]"
              >
                <span className="material-symbols-outlined">help</span>
              </button>
            </div>
            {showHelp && (
              <div className="mt-3 p-3 bg-[#eef4ff] rounded-xl border border-[#005db6]/20 text-xs text-[#001e40] leading-relaxed">
                <strong>Why we ask:</strong> Aadhaar Card serves as the primary national identity and age proof required for driving license renewal and verification.
              </div>
            )}
          </div>

          {/* Radio Options */}
          <div className="space-y-3 flex-1">
            {[
              { id: 'yes', label: 'Yes' },
              { id: 'no', label: 'No' },
              { id: 'not_sure', label: 'Not Sure' }
            ].map((option) => {
              const isChecked = selectedOption === option.id;
              return (
                <label
                  key={option.id}
                  onClick={() => setSelectedOption(option.id)}
                  className={`block cursor-pointer rounded-xl border p-4 transition-all ${
                    isChecked
                      ? 'border-[#003366] bg-[#eef4ff] shadow-sm'
                      : 'border-[#c3c6d1] bg-white hover:bg-[#f8f9ff]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isChecked ? 'border-[#003366]' : 'border-[#737780]'
                      }`}
                    >
                      {isChecked && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#003366]" />
                      )}
                    </div>
                    <span className="text-base font-semibold text-[#121c28]">
                      {option.label}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </main>

        {/* Sticky Footer Actions */}
        <div className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto bg-white border-t border-[#c3c6d1] p-4 z-20">
          <div className="flex gap-3 mb-2">
            <button
              onClick={onBack}
              className="flex-1 h-12 rounded-xl border border-[#003366] text-[#003366] font-semibold text-sm hover:bg-[#eef4ff] transition-colors flex items-center justify-center"
            >
              Previous
            </button>
            <button
              onClick={onNext}
              className="flex-1 h-12 rounded-xl bg-[#003366] text-white font-semibold text-sm hover:bg-[#001e40] transition-colors shadow-sm flex items-center justify-center"
            >
              Next
            </button>
          </div>
          <div className="text-center">
            <button
              onClick={onNext}
              className="text-xs font-semibold text-[#003366] hover:underline"
            >
              Save Progress
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
