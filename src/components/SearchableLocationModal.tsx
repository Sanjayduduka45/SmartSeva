import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface SearchableLocationModalProps {
  isOpen: boolean;
  title: string;
  placeholder: string;
  items: string[];
  selectedItem: string;
  onSelect: (item: string) => void;
  onClose: () => void;
  emptyMessage?: string;
}

export const SearchableLocationModal: React.FC<SearchableLocationModalProps> = ({
  isOpen,
  title,
  placeholder,
  items,
  selectedItem,
  onSelect,
  onClose,
  emptyMessage
}) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return items;
    const term = searchTerm.toLowerCase().trim();
    return items.filter(item => item.toLowerCase().includes(term));
  }, [items, searchTerm]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-[#c3c6d1] flex items-center justify-between bg-[#f8f9ff]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#005db6]">pin_drop</span>
            <h3 id="modal-title" className="font-bold text-base text-[#001e40]">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#74777f] hover:text-[#001e40] rounded-full hover:bg-slate-200 transition-colors"
            aria-label="Close dialog"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Search Input Box */}
        <div className="p-3 border-b border-[#c3c6d1] bg-white sticky top-0">
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-[#74777f] text-lg pointer-events-none">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={placeholder}
              autoFocus
              className="w-full h-11 pl-9 pr-8 bg-[#f8f9ff] border border-[#c3c6d1] rounded-xl text-sm font-semibold text-[#121c28] focus:outline-none focus:ring-2 focus:ring-[#005db6]"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 p-1 text-[#74777f] hover:text-[#001e40] rounded-full"
                aria-label="Clear search"
              >
                <span className="material-symbols-outlined text-base">cancel</span>
              </button>
            )}
          </div>
        </div>

        {/* Options List */}
        <div className="p-2 overflow-y-auto flex-1 min-h-[220px] max-h-[380px] divide-y divide-slate-100">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => {
              const isSelected = item.toLowerCase() === selectedItem.toLowerCase();
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                  className={`w-full p-3 text-left text-sm rounded-xl font-medium flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-[#eef4ff] text-[#005db6] font-bold border border-[#005db6]/30'
                      : 'text-[#121c28] hover:bg-[#f8f9ff] hover:text-[#001e40]'
                  }`}
                >
                  <span className="truncate pr-2">{item}</span>
                  {isSelected && (
                    <span className="material-symbols-outlined text-[#005db6] text-lg shrink-0">
                      check_circle
                    </span>
                  )}
                </button>
              );
            })
          ) : (
            <div className="p-8 text-center flex flex-col items-center justify-center gap-2 text-[#74777f]">
              <span className="material-symbols-outlined text-3xl text-slate-400">search_off</span>
              <p className="text-xs font-semibold">
                {emptyMessage || t('no_matching_location_found')}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-[#c3c6d1] bg-[#f8f9ff] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-[#c3c6d1] bg-white text-[#001e40] rounded-xl text-xs font-bold hover:bg-slate-100"
          >
            {t('back')}
          </button>
        </div>
      </div>
    </div>
  );
};
