import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ScreenType, ServiceItem } from '../types';
import { FULL_SERVICES_CATALOG, getLocalizedService } from '../data/localizedServices';

interface SearchServicesScreenProps {
  services: ServiceItem[];
  onBack: () => void;
  onSelectService: (service: ServiceItem) => void;
}

export const SearchServicesScreen: React.FC<SearchServicesScreenProps> = ({
  services: initialServices,
  onBack,
  onSelectService
}) => {
  const { t, language } = useLanguage();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { name: 'Identity', icon: 'fingerprint' },
    { name: 'Education', icon: 'school' },
    { name: 'Transport', icon: 'directions_car' },
    { name: 'Healthcare', icon: 'health_and_safety' },
    { name: 'Banking', icon: 'account_balance' },
    { name: 'Certificates', icon: 'verified' },
    { name: 'Employment', icon: 'work' },
    { name: 'Housing', icon: 'home' }
  ];

  // Memoize full catalog localization to prevent recalculating on every keystroke
  const allLocalizedServices = useMemo(() => {
    return FULL_SERVICES_CATALOG.map((s) => getLocalizedService(s, language));
  }, [language]);

  // Memoize search filtering
  const filteredServices = useMemo(() => {
    const q = query.toLowerCase().trim();
    return allLocalizedServices.filter((s) => {
      const titleMatch = s.title.toLowerCase().includes(q);
      const descMatch = s.description.toLowerCase().includes(q);
      const categoryMatchStr = s.category.toLowerCase().includes(q);
      const matchesQuery = !q || titleMatch || descMatch || categoryMatchStr;

      const matchesCategory = selectedCategory
        ? s.category.toLowerCase() === selectedCategory.toLowerCase()
        : true;

      return matchesQuery && matchesCategory;
    });
  }, [allLocalizedServices, query, selectedCategory]);

  return (
    <div className="bg-[#f8f9ff] text-[#121c28] min-h-screen pb-24 md:pb-12 max-w-full overflow-x-hidden">
      {/* Header */}
      <header className="w-full sticky top-0 bg-white border-b border-[#c3c6d1] z-40 shadow-xs">
        <div className="flex justify-between items-center px-4 h-16 w-full max-w-7xl mx-auto">
          <button
            onClick={onBack}
            className="min-w-[44px] min-h-[44px] -ml-2 rounded-full hover:bg-[#eef4ff] text-[#001e40] flex items-center justify-center transition-colors focus:ring-2 focus:ring-[#005db6] focus:outline-none"
            aria-label={t('back')}
          >
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold text-[#001e40]">{t('search')}</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col gap-6">
        {/* Search Input */}
        <section className="flex flex-col gap-3">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#737780]">
              search
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search services, certificates, permits, or government offices..."
              className="w-full pl-12 pr-12 h-12 min-h-[44px] bg-white border border-[#c3c6d1] rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#005db6] shadow-xs"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#737780] hover:text-[#001e40]"
                aria-label="Clear Search"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            )}
          </div>

          {/* Quick Search Chips */}
          <div className="flex flex-col gap-2 mt-1">
            <h3 className="text-xs font-semibold text-[#43474f] uppercase tracking-wider">
              Popular Searches
            </h3>
            <div className="flex flex-wrap gap-2">
              {['Passport', 'Driving License', 'Aadhaar Update', 'PAN Card', 'Voter ID', 'Income Certificate'].map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="min-h-[44px] flex items-center gap-1.5 px-3.5 py-2 bg-[#eef4ff] border border-[#c3c6d1] rounded-full text-xs font-semibold text-[#121c28] hover:bg-[#d9e3f4] transition-colors"
                >
                  <span className="material-symbols-outlined text-sm text-[#001e40]">
                    history
                  </span>
                  {term}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-[#001e40]">Service Categories</h2>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-xs font-semibold text-[#005db6] hover:underline"
              >
                Clear Category Filter
              </button>
            )}
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2.5">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() =>
                    setSelectedCategory(isSelected ? null : cat.name)
                  }
                  className={`flex flex-col items-center gap-1.5 p-2.5 rounded-2xl transition-all border ${
                    isSelected
                      ? 'bg-[#001e40] text-white border-[#001e40] shadow-sm'
                      : 'bg-white text-[#43474f] border-[#c3c6d1] hover:bg-[#eef4ff]'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-[#eef4ff] text-[#005db6]'
                  }`}>
                    <span className="material-symbols-outlined text-xl">
                      {cat.icon}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-center truncate w-full">
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Available Services Section */}
        <section className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-[#001e40]">
              Available Services ({filteredServices.length})
            </h2>
            {selectedCategory && (
              <span className="text-xs font-bold text-[#005db6] bg-[#eef4ff] px-2.5 py-1 rounded-md">
                Filter: {selectedCategory}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <div
                  key={service.id}
                  onClick={() => {
                    onSelectService(service);
                  }}
                  className="bg-white border border-[#c3c6d1] rounded-2xl p-4 flex items-center gap-4 hover:border-[#005db6] hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#eef4ff] flex items-center justify-center text-[#001e40] group-hover:bg-[#001e40] group-hover:text-white transition-colors shrink-0">
                    <span className="material-symbols-outlined text-2xl">
                      {service.icon}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-[#121c28] group-hover:text-[#005db6] transition-colors truncate">
                        {service.title}
                      </h4>
                      {service.isComingSoon && (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-900 rounded-md border border-amber-300">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#43474f] mt-0.5 line-clamp-1">
                      {service.description}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] font-semibold text-[#005db6]">
                      <span className="bg-[#eef4ff] px-2 py-0.5 rounded border border-[#c3c6d1]">
                        {service.category}
                      </span>
                      <span>Est. Prep: {service.estCompletion}</span>
                    </div>
                  </div>

                  <span className="material-symbols-outlined text-[#737780] group-hover:text-[#001e40] transition-colors shrink-0">
                    chevron_right
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-12 px-4 bg-white rounded-2xl border border-[#c3c6d1] flex flex-col items-center">
                <span className="material-symbols-outlined text-4xl text-[#737780] mb-2">search_off</span>
                <p className="text-base font-bold text-[#121c28]">
                  {t('no_matching_services')}
                </p>
                <p className="text-xs text-[#43474f] max-w-sm mt-1">
                  {t('try_another_search_category')}
                </p>
                <button
                  onClick={() => {
                    setQuery('');
                    setSelectedCategory(null);
                  }}
                  className="mt-4 px-4 py-2 bg-[#001e40] text-white font-semibold text-xs rounded-xl hover:bg-[#003366]"
                >
                  Reset Search & Filters
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

