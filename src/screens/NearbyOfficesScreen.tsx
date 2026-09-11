import React, { useState, useMemo } from 'react';
import { ScreenType, ServiceItem, LocationState, LocationMethod, OfficeSearchResponse, OfficeItem } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { locationService } from '../services/locationService';
import { officeService } from '../services/officeService';
import { locationDataService } from '../data/locationData';
import { SearchableLocationModal } from '../components/SearchableLocationModal';

interface NearbyOfficesScreenProps {
  selectedService: ServiceItem;
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
}

export const NearbyOfficesScreen: React.FC<NearbyOfficesScreenProps> = ({
  selectedService,
  onBack,
  onNavigate
}) => {
  const { t } = useLanguage();
  
  // Selected Office for Office Details view
  const [selectedOffice, setSelectedOffice] = useState<OfficeItem | null>(null);

  // Selected location method card ('gps' | 'pincode' | 'manual')
  const [selectedOption, setSelectedOption] = useState<LocationMethod | null>(() => {
    const restored = locationService.loadActiveLocation();
    return restored?.method || null;
  });

  // Centralized Location State for GPS / Pincode / Manual Flow
  const [locationState, setLocationState] = useState<LocationState>(() => {
    const restored = locationService.loadActiveLocation();
    if (restored && locationService.validateLocation(restored)) {
      return restored;
    }
    return locationService.createInitialLocationState();
  });

  // Synchronize non-sensitive active location context to session storage
  React.useEffect(() => {
    locationService.saveActiveLocation(locationState);
  }, [locationState]);

  // Location confirmed flag (when user taps [Continue] after location resolution)
  const [isLocationConfirmed, setIsLocationConfirmed] = useState<boolean>(false);

  // Option 2 state: Pincode Flow
  const [pincode, setPincode] = useState<string>('');
  const [pincodeValidationError, setPincodeValidationError] = useState<string | null>(null);

  // Option 3 state: Manual Location Selection Flow
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [activeModal, setActiveModal] = useState<'state' | 'district' | 'city' | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Dynamic Location Lists based on selections
  const allStates = useMemo(() => {
    return locationDataService.getStates().map(s => s.name);
  }, []);

  const availableDistricts = useMemo(() => {
    if (!selectedState) return [];
    return locationDataService.getDistricts(selectedState);
  }, [selectedState]);

  const availableCities = useMemo(() => {
    if (!selectedState || !selectedDistrict) return [];
    return locationDataService.getCities(selectedState, selectedDistrict);
  }, [selectedState, selectedDistrict]);

  // Office Search Engine Integration: Calculates service-matched and location-filtered offices with pagination
  const searchResponse: OfficeSearchResponse | null = useMemo(() => {
    if (locationState.status !== 'success') return null;
    return officeService.searchNearbyOffices(selectedService.id, locationState, currentPage, 10);
  }, [selectedService.id, locationState, currentPage]);

  // Handle option card selection
  const handleSelectOption = (option: LocationMethod) => {
    setSelectedOption(option);
    setIsLocationConfirmed(false);
    setPincodeValidationError(null);
    setCurrentPage(1);
    
    // Reset location state when switching options unless already in success
    setLocationState({
      method: option,
      latitude: null,
      longitude: null,
      city: option === 'manual' ? (selectedCity || null) : null,
      district: option === 'manual' ? (selectedDistrict || null) : null,
      state: option === 'manual' ? (selectedState || null) : null,
      pincode: option === 'pincode' ? pincode : null,
      formattedAddress: null,
      status: 'idle',
      errorType: null,
      errorMessage: null
    });
  };

  /**
   * Manual Selection Change Handlers (Dependent logic)
   */
  const handleStateSelect = (stateName: string) => {
    if (stateName !== selectedState) {
      setSelectedState(stateName);
      setSelectedDistrict('');
      setSelectedCity('');
    }
  };

  const handleDistrictSelect = (districtName: string) => {
    if (districtName !== selectedDistrict) {
      setSelectedDistrict(districtName);
      setSelectedCity('');
    }
  };

  const handleCitySelect = (cityName: string) => {
    setSelectedCity(cityName);
  };

  const handleResetManualSelections = () => {
    setSelectedState('');
    setSelectedDistrict('');
    setSelectedCity('');
    setLocationState(prev => ({
      ...prev,
      status: 'idle',
      city: null,
      district: null,
      state: null
    }));
    setIsLocationConfirmed(false);
  };

  /**
   * Confirm Manual Location Selection
   */
  const handleConfirmManualLocation = () => {
    if (!selectedState || !selectedDistrict || !selectedCity) return;

    setIsLocationConfirmed(false);
    const normalized = locationService.resolveManualLocation(selectedState, selectedDistrict, selectedCity);
    setLocationState(normalized);
  };

  /**
   * Pincode Resolution Handler
   * Validates 6-digit pincode and calls locationService.resolvePincode
   */
  const handleResolvePincode = async (pincodeToResolve?: string) => {
    const targetPincode = (pincodeToResolve || pincode).trim();

    // Strict 6-digit validation
    if (!targetPincode || targetPincode.length !== 6 || !/^\d{6}$/.test(targetPincode)) {
      setPincodeValidationError(t('enter_valid_6digit_pincode'));
      return;
    }

    setPincodeValidationError(null);
    setIsLocationConfirmed(false);
    setSelectedOption('pincode');
    setLocationState(locationService.normalizeLocation({
      method: 'pincode',
      pincode: targetPincode,
      status: 'loading'
    }));

    try {
      const resolvedAddress = await locationService.resolvePincode(targetPincode);

      setLocationState(locationService.normalizeLocation({
        method: 'pincode',
        city: resolvedAddress.city,
        district: resolvedAddress.district,
        state: resolvedAddress.state,
        pincode: resolvedAddress.pincode,
        country: resolvedAddress.country || 'India',
        formattedAddress: resolvedAddress.formattedAddress,
        status: 'success'
      }));
    } catch (err: any) {
      const mapped = locationService.mapError(err);
      setLocationState(locationService.normalizeLocation({
        method: 'pincode',
        pincode: targetPincode,
        status: 'error',
        errorType: mapped.errorType,
        errorMessage: mapped.message
      }));
    }
  };

  /**
   * Real Geolocation & Resolution Handler
   * User-initiated when user clicks "Use Current Location" or "Get Location" or "Try Again"
   */
  const handleGetLocation = async () => {
    setSelectedOption('gps');
    setIsLocationConfirmed(false);
    setLocationState(locationService.normalizeLocation({
      method: 'gps',
      status: 'loading'
    }));

    const result = await locationService.resolveGPSLocation();
    setLocationState(result);
  };

  /**
   * Simulation handlers for demo/testing environments (e.g., iframe permission restrictions)
   */
  const handleSimulateGpsSuccess = () => {
    setSelectedOption('gps');
    setIsLocationConfirmed(false);
    setLocationState(locationService.normalizeLocation({
      method: 'gps',
      latitude: 17.9784,
      longitude: 79.5941,
      city: 'Warangal',
      district: 'Hanamkonda',
      state: 'Telangana',
      pincode: '506001',
      formattedAddress: 'Kazipet - Hanamkonda Rd, Warangal, Telangana 506001',
      status: 'success'
    }));
  };

  const handleSimulateError = (errorType: 'permission_denied' | 'unavailable' | 'timeout' | 'resolution_failed' | 'network_error') => {
    setSelectedOption('gps');
    setIsLocationConfirmed(false);
    
    let msg = 'Unable to determine location.';
    if (errorType === 'permission_denied') msg = 'Location access was not allowed.';
    if (errorType === 'unavailable') msg = 'Your device location is unavailable.';
    if (errorType === 'timeout') msg = "We couldn't get your location.";
    if (errorType === 'resolution_failed') msg = "We found your location, but couldn't determine the area.";
    if (errorType === 'network_error') msg = 'Unable to determine your location right now.';

    setLocationState(locationService.normalizeLocation({
      method: 'gps',
      status: 'error',
      errorType: errorType,
      errorMessage: msg
    }));
  };

  const handleResetLocation = () => {
    setIsLocationConfirmed(false);
    setLocationState(locationService.createInitialLocationState());
    setSelectedOption(null);
  };

  // Back Button Navigation
  const handleHeaderBack = () => {
    if (isLocationConfirmed) {
      setIsLocationConfirmed(false);
      return;
    }

    if (locationState.status === 'success' || locationState.status === 'error' || locationState.status === 'loading') {
      // Return to input view or option select view
      setLocationState(prev => ({
        ...prev,
        status: 'idle',
        errorType: null,
        errorMessage: null
      }));
      return;
    }

    if (selectedOption === 'manual') {
      if (selectedCity) {
        setSelectedCity('');
        return;
      }
      if (selectedDistrict) {
        setSelectedDistrict('');
        return;
      }
      if (selectedState) {
        setSelectedState('');
        return;
      }
      setSelectedOption(null);
      return;
    }

    if (selectedOption !== null) {
      // If at an active option card, return to Location Selection options root
      setSelectedOption(null);
      return;
    }

    // If at location options root, return to Preparation Summary
    onBack();
  };

  const handlePincodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleResolvePincode();
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedState && selectedDistrict && selectedCity) {
      handleConfirmManualLocation();
    }
  };

  // Helper to validate coordinates
  const isValidCoordinates = (coords?: { lat?: number; lng?: number } | null): coords is { lat: number; lng: number } => {
    if (!coords) return false;
    const { lat, lng } = coords;
    if (typeof lat !== 'number' || typeof lng !== 'number') return false;
    if (isNaN(lat) || isNaN(lng)) return false;
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return false;
    if (lat === 0 && lng === 0) return false;
    return true;
  };

  // Helper to construct clean verified address
  const getValidAddressString = (office: OfficeItem): string | null => {
    const parts = [
      office.name,
      office.address,
      office.city,
      office.district,
      office.state,
      office.pincode
    ].filter((p): p is string => typeof p === 'string' && p.trim().length > 0);

    if (parts.length >= 2) {
      return parts.join(', ');
    }
    return null;
  };

  const isDirectionsAvailable = (office: OfficeItem): boolean => {
    return isValidCoordinates(office.coordinates) || getValidAddressString(office) !== null;
  };

  const [directionsError, setDirectionsError] = useState<string | null>(null);

  // Helper for opening directions in Google Maps
  const handleOpenDirections = (office: OfficeItem) => {
    setDirectionsError(null);

    if (!isDirectionsAvailable(office)) {
      setDirectionsError(t('directions_not_available') || 'Directions are not available for this office yet.');
      return;
    }

    try {
      let targetUrl = '';
      
      if (isValidCoordinates(office.coordinates)) {
        const { lat, lng } = office.coordinates;
        if (locationState.method === 'gps' && typeof locationState.latitude === 'number' && typeof locationState.longitude === 'number' && !isNaN(locationState.latitude) && !isNaN(locationState.longitude)) {
          targetUrl = `https://www.google.com/maps/dir/?api=1&origin=${locationState.latitude},${locationState.longitude}&destination=${lat},${lng}`;
        } else {
          targetUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        }
      } else {
        const fullAddress = getValidAddressString(office);
        if (fullAddress) {
          const encoded = encodeURIComponent(fullAddress);
          if (locationState.method === 'gps' && typeof locationState.latitude === 'number' && typeof locationState.longitude === 'number' && !isNaN(locationState.latitude) && !isNaN(locationState.longitude)) {
            targetUrl = `https://www.google.com/maps/dir/?api=1&origin=${locationState.latitude},${locationState.longitude}&destination=${encoded}`;
          } else {
            targetUrl = `https://www.google.com/maps/dir/?api=1&destination=${encoded}`;
          }
        }
      }

      if (targetUrl) {
        const newWin = window.open(targetUrl, '_blank', 'noopener,noreferrer');
        if (!newWin) {
          window.location.href = targetUrl;
        }
      } else {
        setDirectionsError(t('directions_not_available') || 'Directions are not available for this office yet.');
      }
    } catch (err) {
      setDirectionsError(t('unable_to_open_directions') || 'Unable to open directions.');
    }
  };

  // =========================================================================
  // OFFICE DETAILS VIEW (When user taps "View Details")
  // =========================================================================
  if (selectedOffice) {
    return (
      <div className="bg-[#f8f9ff] text-[#121c28] min-h-screen pb-24">
        {/* Header */}
        <header className="bg-white sticky top-0 z-40 border-b border-[#c3c6d1] shadow-xs">
          <div className="flex justify-between items-center px-4 md:px-8 h-16 w-full max-w-3xl mx-auto">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedOffice(null)}
                className="p-2 -ml-2 rounded-full hover:bg-[#eef4ff] text-[#43474f] transition-colors flex items-center justify-center min-w-[44px] min-h-[44px]"
                aria-label="Back to Nearby Offices"
              >
                <span className="material-symbols-outlined text-2xl">arrow_back</span>
              </button>
              <div>
                <h1 className="font-bold text-lg text-[#001e40] leading-tight">
                  Office Details
                </h1>
                <p className="text-xs text-[#43474f]">
                  {selectedService.title}
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-[#005db6] bg-[#eef4ff] px-2.5 py-1 rounded-md border border-[#c3c6d1]">
              Verified Center
            </span>
          </div>
        </header>

        <main className="w-full max-w-3xl mx-auto px-4 py-6 flex flex-col gap-6">
          {/* Office Main Information Card */}
          <div className="bg-white border border-[#c3c6d1] rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-5 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-[#c3c6d1]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#005db6] bg-[#eef4ff] px-2.5 py-1 rounded-md border border-[#c3c6d1]/60">
                  {selectedOffice.category} {selectedOffice.office_type ? `• ${selectedOffice.office_type}` : ''}
                </span>
                <h2 className="text-xl md:text-2xl font-extrabold text-[#001e40] mt-2">
                  {selectedOffice.name}
                </h2>
              </div>

              {typeof selectedOffice.distanceKm === 'number' && (
                <span className="self-start px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-lg text-xs font-bold shrink-0 flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">near_me</span>
                  {selectedOffice.distanceKm} km away
                </span>
              )}
            </div>

            {/* Structured Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#43474f] pt-1">
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#f8f9ff] border border-[#c3c6d1]/60">
                <span className="material-symbols-outlined text-lg text-[#005db6] shrink-0 mt-0.5">place</span>
                <div>
                  <strong className="block text-[#001e40] mb-0.5 font-bold">Address & Location</strong>
                  <span>{selectedOffice.address}, {selectedOffice.city}{selectedOffice.district ? `, ${selectedOffice.district}` : ''}{selectedOffice.state ? `, ${selectedOffice.state}` : ''}{selectedOffice.pincode ? ` - ${selectedOffice.pincode}` : ''}</span>
                </div>
              </div>

              {selectedOffice.workingHours && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#f8f9ff] border border-[#c3c6d1]/60">
                  <span className="material-symbols-outlined text-lg text-[#005db6] shrink-0 mt-0.5">schedule</span>
                  <div>
                    <strong className="block text-[#001e40] mb-0.5 font-bold">Working Hours</strong>
                    <span>{selectedOffice.workingHours}</span>
                  </div>
                </div>
              )}

              {selectedOffice.phone && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#f8f9ff] border border-[#c3c6d1]/60">
                  <span className="material-symbols-outlined text-lg text-[#005db6] shrink-0 mt-0.5">call</span>
                  <div>
                    <strong className="block text-[#001e40] mb-0.5 font-bold">Phone Number</strong>
                    <a href={`tel:${selectedOffice.phone}`} className="text-[#005db6] font-bold hover:underline">
                      {selectedOffice.phone}
                    </a>
                  </div>
                </div>
              )}

              {selectedOffice.website && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#f8f9ff] border border-[#c3c6d1]/60">
                  <span className="material-symbols-outlined text-lg text-[#005db6] shrink-0 mt-0.5">language</span>
                  <div>
                    <strong className="block text-[#001e40] mb-0.5 font-bold">Official Portal</strong>
                    <a href={selectedOffice.website} target="_blank" rel="noopener noreferrer" className="text-[#005db6] font-bold hover:underline truncate block max-w-[220px]">
                      {selectedOffice.website}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {selectedOffice.servicesHandled && selectedOffice.servicesHandled.length > 0 && (
              <div className="pt-3 border-t border-[#c3c6d1]/60">
                <span className="text-xs font-bold text-[#001e40] block mb-2">Services Handled at this Center:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedOffice.servicesHandled.map((srv, idx) => (
                    <span key={idx} className="text-xs bg-[#eef4ff] text-[#005db6] border border-[#c3c6d1]/60 px-2.5 py-1 rounded-md font-medium">
                      {srv}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedOffice.tips && selectedOffice.tips.length > 0 && (
              <div className="bg-[#eef4ff] border border-[#c3c6d1] rounded-xl p-4 text-xs text-[#001e40]">
                <p className="font-extrabold flex items-center gap-1.5 text-[#005db6] text-sm mb-2">
                  <span className="material-symbols-outlined text-base">lightbulb</span>
                  Citizen Visit Guidance
                </p>
                <ul className="list-disc list-inside space-y-1 text-[#43474f] leading-relaxed">
                  {selectedOffice.tips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Error or Notice Banner for Directions */}
            {directionsError && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-amber-700">warning</span>
                  <span>{directionsError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenDirections(selectedOffice)}
                  className="px-2.5 py-1 bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold rounded-lg text-[11px] shrink-0"
                >
                  {t('try_again') || 'Try Again'}
                </button>
              </div>
            )}

            {!isDirectionsAvailable(selectedOffice) && !directionsError && (
              <div className="bg-[#f8f9ff] border border-[#c3c6d1] rounded-xl p-3 text-xs text-[#43474f] flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-amber-600">info</span>
                <span>{t('directions_not_available') || 'Directions are not available for this office yet.'}</span>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-4 border-t border-[#c3c6d1] flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setDirectionsError(null);
                  setSelectedOffice(null);
                }}
                className="w-full sm:w-auto min-h-[44px] px-5 border border-[#c3c6d1] bg-white text-[#001e40] rounded-xl text-xs font-bold hover:bg-[#eef4ff] transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                <span>Back to Nearby Offices</span>
              </button>

              <button
                type="button"
                onClick={() => handleOpenDirections(selectedOffice)}
                disabled={!isDirectionsAvailable(selectedOffice)}
                className={`w-full sm:w-auto min-h-[44px] px-6 rounded-xl text-xs font-extrabold transition-colors flex items-center justify-center gap-2 shadow-sm ${
                  isDirectionsAvailable(selectedOffice)
                    ? 'bg-[#005db6] hover:bg-[#00376f] text-white focus:ring-2 focus:ring-[#005db6]'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300'
                }`}
              >
                <span className="material-symbols-outlined text-lg">directions</span>
                <span>{t('get_directions') || 'Get Directions'}</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9ff] text-[#121c28] min-h-screen pb-28 md:pb-12">
      {/* Sticky Header with Back Button */}
      <header className="bg-white sticky top-0 z-40 border-b border-[#c3c6d1] shadow-xs">
        <div className="flex justify-between items-center px-4 md:px-8 h-16 w-full max-w-3xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={handleHeaderBack}
              className="p-2 -ml-2 rounded-full hover:bg-[#eef4ff] text-[#43474f] transition-colors flex items-center justify-center min-w-[44px] min-h-[44px]"
              aria-label={t('back')}
            >
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </button>
            <div>
              <h1 className="font-bold text-lg text-[#001e40] leading-tight">
                {t('find_offices_near_you')}
              </h1>
              <p className="text-xs text-[#43474f]">
                {t('where_to_go')}
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-[#005db6] bg-[#eef4ff] px-2.5 py-1 rounded-md border border-[#c3c6d1] truncate max-w-[140px] sm:max-w-[200px]">
            {selectedService.category}
          </span>
        </div>
      </header>

      <main className="w-full max-w-3xl mx-auto px-4 py-6 flex flex-col gap-6">
        
        {/* Selected Service Context Banner */}
        <section className="bg-white border border-[#c3c6d1] rounded-2xl p-4 md:p-5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#eef4ff] text-[#005db6] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">{selectedService.icon || 'assignment'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#005db6]">
                Preparing For
              </span>
              <h2 className="text-base font-bold text-[#001e40] truncate">
                {selectedService.title}
              </h2>
            </div>
          </div>
        </section>

        {/* LOCATION SELECTION CONTAINER */}
        <section className="bg-white border border-[#c3c6d1] rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-6">
          
          {/* Section Heading & Supporting Text */}
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-[#001e40] tracking-tight">
              {t('find_offices_near_you')}
            </h2>
            <p className="text-sm text-[#43474f] mt-1.5 leading-relaxed">
              {t('choose_location_supporting')}
            </p>
          </div>

          {/* THREE LOCATION METHOD OPTIONS */}
          <div className="flex flex-col gap-3" role="radiogroup" aria-label="Location methods">
            
            {/* OPTION 1: Use Current Location */}
            <div
              tabIndex={0}
              role="radio"
              aria-checked={selectedOption === 'gps'}
              onClick={() => {
                handleSelectOption('gps');
                if (locationState.status === 'idle') {
                  handleGetLocation();
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelectOption('gps');
                  if (locationState.status === 'idle') {
                    handleGetLocation();
                  }
                }
              }}
              className={`p-4 md:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 outline-none ${
                selectedOption === 'gps'
                  ? 'border-[#005db6] bg-[#eef4ff]/60 shadow-xs ring-2 ring-[#005db6]/20'
                  : 'border-[#c3c6d1] bg-white hover:border-[#005db6]/50 hover:bg-[#f8f9ff]'
              }`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                selectedOption === 'gps'
                  ? 'bg-[#005db6] text-white'
                  : 'bg-[#eef4ff] text-[#005db6]'
              }`}>
                <span className="material-symbols-outlined text-2xl">my_location</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-base text-[#001e40]">
                    {t('use_current_location')}
                  </h3>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                    selectedOption === 'gps'
                      ? 'border-[#005db6] bg-[#005db6] text-white'
                      : 'border-[#c3c6d1] bg-white'
                  }`}>
                    {selectedOption === 'gps' && (
                      <span className="material-symbols-outlined text-sm font-bold">check</span>
                    )}
                  </div>
                </div>
                <p className="text-xs md:text-sm text-[#43474f] mt-1 leading-relaxed">
                  {t('use_current_location_desc')}
                </p>
              </div>
            </div>

            {/* OPTION 2: Enter Pincode */}
            <div
              tabIndex={0}
              role="radio"
              aria-checked={selectedOption === 'pincode'}
              onClick={() => handleSelectOption('pincode')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelectOption('pincode');
                }
              }}
              className={`p-4 md:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 outline-none ${
                selectedOption === 'pincode'
                  ? 'border-[#005db6] bg-[#eef4ff]/60 shadow-xs ring-2 ring-[#005db6]/20'
                  : 'border-[#c3c6d1] bg-white hover:border-[#005db6]/50 hover:bg-[#f8f9ff]'
              }`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                selectedOption === 'pincode'
                  ? 'bg-[#005db6] text-white'
                  : 'bg-[#eef4ff] text-[#005db6]'
              }`}>
                <span className="material-symbols-outlined text-2xl">pin_drop</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-base text-[#001e40]">
                    {t('enter_pincode')}
                  </h3>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                    selectedOption === 'pincode'
                      ? 'border-[#005db6] bg-[#005db6] text-white'
                      : 'border-[#c3c6d1] bg-white'
                  }`}>
                    {selectedOption === 'pincode' && (
                      <span className="material-symbols-outlined text-sm font-bold">check</span>
                    )}
                  </div>
                </div>
                <p className="text-xs md:text-sm text-[#43474f] mt-1 leading-relaxed">
                  {t('enter_pincode_desc')}
                </p>
              </div>
            </div>

            {/* OPTION 3: Select Location */}
            <div
              tabIndex={0}
              role="radio"
              aria-checked={selectedOption === 'manual'}
              onClick={() => handleSelectOption('manual')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelectOption('manual');
                }
              }}
              className={`p-4 md:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 outline-none ${
                selectedOption === 'manual'
                  ? 'border-[#005db6] bg-[#eef4ff]/60 shadow-xs ring-2 ring-[#005db6]/20'
                  : 'border-[#c3c6d1] bg-white hover:border-[#005db6]/50 hover:bg-[#f8f9ff]'
              }`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                selectedOption === 'manual'
                  ? 'bg-[#005db6] text-white'
                  : 'bg-[#eef4ff] text-[#005db6]'
              }`}>
                <span className="material-symbols-outlined text-2xl">map</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-base text-[#001e40]">
                    {t('select_location_manual')}
                  </h3>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                    selectedOption === 'manual'
                      ? 'border-[#005db6] bg-[#005db6] text-white'
                      : 'border-[#c3c6d1] bg-white'
                  }`}>
                    {selectedOption === 'manual' && (
                      <span className="material-symbols-outlined text-sm font-bold">check</span>
                    )}
                  </div>
                </div>
                <p className="text-xs md:text-sm text-[#43474f] mt-1 leading-relaxed">
                  {t('select_location_manual_desc')}
                </p>
              </div>
            </div>

          </div>


          {/* GPS FLOW: LOADING STATE */}
          {selectedOption === 'gps' && locationState.status === 'loading' && (
            <div className="bg-[#eef4ff] border border-[#005db6]/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3 animate-fade-in" aria-live="polite">
              <div className="w-10 h-10 border-3 border-[#005db6] border-t-transparent rounded-full animate-spin"></div>
              <div>
                <p className="font-bold text-base text-[#001e40]">
                  {t('getting_your_location')}
                </p>
                <p className="text-xs text-[#43474f] mt-1">
                  Please wait while we resolve your coordinates...
                </p>
              </div>
            </div>
          )}


          {/* GPS FLOW: SUCCESS STATE */}
          {selectedOption === 'gps' && locationState.status === 'success' && (
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-5 md:p-6 flex flex-col gap-4 animate-fade-in">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-2xl">location_on</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                      {t('location_found')}
                    </span>
                  </div>
                  
                  {/* Human readable location title */}
                  <h3 className="text-lg md:text-xl font-extrabold text-[#001e40] mt-1 truncate">
                    {locationState.city || locationState.district || 'Current Area'}, {locationState.state}
                  </h3>

                  {locationState.pincode && (
                    <p className="text-xs font-bold text-[#005db6] mt-0.5">
                      PIN Code: {locationState.pincode}
                    </p>
                  )}

                  {locationState.formattedAddress && (
                    <p className="text-xs text-[#43474f] mt-1.5 leading-relaxed line-clamp-2">
                      {locationState.formattedAddress}
                    </p>
                  )}
                </div>
              </div>

              {/* Success Actions */}
              <div className="pt-3 border-t border-emerald-200/80 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleResetLocation}
                  className="h-10 px-4 bg-white border border-[#c3c6d1] text-[#001e40] rounded-xl text-xs font-bold hover:bg-[#eef4ff] transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">edit_location</span>
                  {t('change_location')}
                </button>

                <button
                  type="button"
                  onClick={() => setIsLocationConfirmed(true)}
                  className="h-10 px-5 bg-[#005db6] text-white rounded-xl text-xs font-bold hover:bg-[#004488] transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <span>{t('continue')}</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>

              {isLocationConfirmed && (
                <div className="p-3 bg-white border border-emerald-300 rounded-xl text-xs text-emerald-900 font-medium flex items-center gap-2 mt-1">
                  <span className="material-symbols-outlined text-emerald-600 text-base shrink-0">check_circle</span>
                  <span>Location confirmed. Context ready for nearby office search.</span>
                </div>
              )}
            </div>
          )}


          {/* GPS FLOW: ERROR STATES (PERMISSION DENIED / UNAVAILABLE / TIMEOUT / RESOLUTION FAILED / NETWORK ERROR) */}
          {selectedOption === 'gps' && locationState.status === 'error' && (
            <div className="bg-red-50/90 border border-red-200 rounded-2xl p-5 md:p-6 flex flex-col gap-4 animate-fade-in" role="alert">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-2xl">
                    {locationState.errorType === 'permission_denied' ? 'location_off' : 'error'}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base text-red-950">
                    {locationState.errorType === 'permission_denied' && t('location_permission_denied_title')}
                    {locationState.errorType === 'unavailable' && t('location_unavailable_title')}
                    {locationState.errorType === 'timeout' && t('location_timeout_title')}
                    {locationState.errorType === 'resolution_failed' && t('location_resolution_failed_title')}
                    {locationState.errorType === 'network_error' && t('location_network_error_title')}
                    {!locationState.errorType && t('could_not_determine_location')}
                  </h3>

                  <p className="text-xs md:text-sm text-red-800 mt-1 leading-relaxed">
                    {locationState.errorType === 'permission_denied' && t('location_permission_denied_sub')}
                    {locationState.errorType === 'timeout' && t('location_timeout_sub')}
                    {locationState.errorType !== 'permission_denied' && locationState.errorType !== 'timeout' && (
                      locationState.errorMessage || 'You can still find nearby offices by entering your pincode or selecting your location manually.'
                    )}
                  </p>
                </div>
              </div>

              {/* Standard Error Recovery Actions */}
              <div className="pt-3 border-t border-red-200 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleGetLocation}
                  className="h-10 px-4 bg-red-700 text-white rounded-xl text-xs font-bold hover:bg-red-800 transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <span className="material-symbols-outlined text-base">refresh</span>
                  {t('try_again')}
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectOption('pincode')}
                  className="h-10 px-4 bg-white border border-red-300 text-red-900 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">pin_drop</span>
                  {t('enter_pincode')}
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectOption('manual')}
                  className="h-10 px-4 bg-white border border-red-300 text-red-900 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">map</span>
                  {t('select_location_manual')}
                </button>
              </div>
            </div>
          )}


          {/* GPS IDLE INITIAL ACTION BUTTON (When GPS selected but location not requested yet) */}
          {selectedOption === 'gps' && locationState.status === 'idle' && (
            <div className="bg-[#f8f9ff] border border-[#c3c6d1] rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#005db6] text-2xl shrink-0">my_location</span>
                <div>
                  <p className="text-sm font-bold text-[#001e40]">Ready to detect location</p>
                  <p className="text-xs text-[#43474f]">Click below to request browser location permission.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGetLocation}
                className="w-full sm:w-auto h-11 px-6 bg-[#005db6] text-white rounded-xl text-xs font-bold hover:bg-[#004488] transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">near_me</span>
                <span>Get Current Location</span>
              </button>
            </div>
          )}


          {/* TESTING / DEMO CONTROLS PANEL FOR TESTING ALL GPS STATES IN IFRAME */}
          {selectedOption === 'gps' && (
            <div className="mt-1 pt-4 border-t border-dashed border-[#c3c6d1]">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#74777f] mb-2">
                Simulate Location States (For Preview/Testing)
              </p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={handleSimulateGpsSuccess}
                  className="px-2.5 py-1 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-lg text-[11px] font-semibold hover:bg-emerald-200"
                >
                  ✓ Simulate Success (Warangal)
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulateError('permission_denied')}
                  className="px-2.5 py-1 bg-red-100 border border-red-300 text-red-900 rounded-lg text-[11px] font-semibold hover:bg-red-200"
                >
                  ! Permission Denied
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulateError('unavailable')}
                  className="px-2.5 py-1 bg-amber-100 border border-amber-300 text-amber-900 rounded-lg text-[11px] font-semibold hover:bg-amber-200"
                >
                  ! GPS Unavailable
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulateError('timeout')}
                  className="px-2.5 py-1 bg-amber-100 border border-amber-300 text-amber-900 rounded-lg text-[11px] font-semibold hover:bg-amber-200"
                >
                  ! Timeout
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulateError('resolution_failed')}
                  className="px-2.5 py-1 bg-purple-100 border border-purple-300 text-purple-900 rounded-lg text-[11px] font-semibold hover:bg-purple-200"
                >
                  ! Resolution Failure
                </button>
              </div>
            </div>
          )}


          {/* OPTION 2: ENTER PINCODE FLOW */}
          {selectedOption === 'pincode' && (
            <div className="bg-[#f8f9ff] border border-[#c3c6d1] rounded-2xl p-5 md:p-6 flex flex-col gap-5 animate-fade-in">
              
              {/* PINCODE INPUT STATE */}
              {locationState.status === 'idle' && (
                <form onSubmit={handlePincodeSubmit} className="flex flex-col gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#001e40]">
                      {t('enter_your_pincode')}
                    </h3>
                    <p className="text-xs md:text-sm text-[#43474f] mt-1">
                      {t('enter_pincode_supporting')}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="pincode-input" className="text-xs font-bold text-[#001e40] uppercase tracking-wider">
                      {t('pincode')} <span className="text-red-600">*</span>
                    </label>

                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3.5 text-[#74777f] text-xl pointer-events-none">
                        pin_drop
                      </span>

                      <input
                        id="pincode-input"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        value={pincode}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          setPincode(val);
                          if (pincodeValidationError) {
                            setPincodeValidationError(null);
                          }
                        }}
                        placeholder={t('enter_6digit_pincode')}
                        className={`w-full h-12 pl-11 pr-10 bg-white border rounded-xl text-base font-bold text-[#121c28] tracking-widest placeholder:font-normal placeholder:tracking-normal focus:outline-none focus:ring-2 ${
                          pincodeValidationError
                            ? 'border-red-500 ring-1 ring-red-500 focus:ring-red-500'
                            : 'border-[#c3c6d1] focus:ring-[#005db6] focus:border-[#005db6]'
                        }`}
                        aria-invalid={!!pincodeValidationError}
                        aria-describedby={pincodeValidationError ? 'pincode-error' : undefined}
                      />

                      {/* Clear Input Button */}
                      {pincode.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setPincode('');
                            setPincodeValidationError(null);
                          }}
                          className="absolute right-3 p-1 text-[#74777f] hover:text-[#001e40] rounded-full hover:bg-slate-200 transition-colors"
                          aria-label="Clear pincode input"
                        >
                          <span className="material-symbols-outlined text-lg">cancel</span>
                        </button>
                      )}
                    </div>

                    {/* Validation Error Message */}
                    {pincodeValidationError && (
                      <p id="pincode-error" className="text-xs font-semibold text-red-600 flex items-center gap-1 mt-0.5" role="alert">
                        <span className="material-symbols-outlined text-sm">error</span>
                        <span>{pincodeValidationError}</span>
                      </p>
                    )}
                  </div>

                  {/* Privacy Note */}
                  <div className="text-[11px] text-[#43474f] flex items-center gap-1.5 bg-white p-2.5 rounded-xl border border-[#c3c6d1]/60">
                    <span className="material-symbols-outlined text-sm text-[#005db6] shrink-0">lock</span>
                    <span>{t('pincode_privacy_note')}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[#c3c6d1]">
                    <button
                      type="button"
                      onClick={() => handleSelectOption(null as any)}
                      className="w-full sm:w-auto h-11 px-4 border border-[#c3c6d1] bg-white text-[#001e40] rounded-xl text-xs font-bold hover:bg-[#eef4ff] transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-base">arrow_back</span>
                      {t('use_another_method')}
                    </button>

                    <button
                      type="submit"
                      disabled={pincode.length !== 6}
                      className="w-full sm:w-auto h-11 px-6 bg-[#005db6] disabled:bg-[#c3c6d1] disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold hover:bg-[#004488] transition-colors shadow-xs flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-lg">search</span>
                      <span>{t('find_location')}</span>
                    </button>
                  </div>

                  {/* TESTING / DEMO PINCODE QUICK PRESETS */}
                  <div className="mt-2 pt-3 border-t border-dashed border-[#c3c6d1]">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#74777f] mb-2">
                      Test Pincode Presets
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setPincode('506001');
                          handleResolvePincode('506001');
                        }}
                        className="px-2.5 py-1 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-lg text-[11px] font-semibold hover:bg-emerald-200"
                      >
                        ✓ 506001 (Warangal)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPincode('500001');
                          handleResolvePincode('500001');
                        }}
                        className="px-2.5 py-1 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-lg text-[11px] font-semibold hover:bg-emerald-200"
                      >
                        ✓ 500001 (Hyderabad)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPincode('999999');
                          handleResolvePincode('999999');
                        }}
                        className="px-2.5 py-1 bg-red-100 border border-red-300 text-red-900 rounded-lg text-[11px] font-semibold hover:bg-red-200"
                      >
                        ! 999999 (Invalid Code)
                      </button>
                    </div>
                  </div>

                </form>
              )}

              {/* PINCODE LOADING STATE */}
              {locationState.status === 'loading' && (
                <div className="p-6 flex flex-col items-center justify-center text-center gap-3 animate-fade-in" aria-live="polite">
                  <div className="w-10 h-10 border-3 border-[#005db6] border-t-transparent rounded-full animate-spin"></div>
                  <div>
                    <p className="font-bold text-base text-[#001e40]">
                      Resolving location for pincode {pincode}...
                    </p>
                    <p className="text-xs text-[#43474f] mt-1">
                      Checking official postal directory...
                    </p>
                  </div>
                </div>
              )}

              {/* PINCODE SUCCESS STATE */}
              {locationState.status === 'success' && (
                <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-5 md:p-6 flex flex-col gap-4 animate-fade-in">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <span className="material-symbols-outlined text-2xl">check_circle</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                          {t('location_found')}
                        </span>
                      </div>

                      <h3 className="text-lg md:text-xl font-extrabold text-[#001e40] mt-1 truncate">
                        {locationState.city || locationState.district}, {locationState.state}
                      </h3>

                      <p className="text-xs font-bold text-[#005db6] mt-0.5">
                        PIN Code: {locationState.pincode}
                      </p>

                      {locationState.formattedAddress && (
                        <p className="text-xs text-[#43474f] mt-1.5 leading-relaxed line-clamp-2">
                          {locationState.formattedAddress}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Success Actions */}
                  <div className="pt-3 border-t border-emerald-200 flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setLocationState(prev => ({ ...prev, status: 'idle' }));
                        setIsLocationConfirmed(false);
                      }}
                      className="h-10 px-4 bg-white border border-[#c3c6d1] text-[#001e40] rounded-xl text-xs font-bold hover:bg-[#eef4ff] transition-colors flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-base">edit</span>
                      {t('change_pincode')}
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsLocationConfirmed(true)}
                      className="h-10 px-5 bg-[#005db6] text-white rounded-xl text-xs font-bold hover:bg-[#004488] transition-colors shadow-xs flex items-center gap-1.5"
                    >
                      <span>{t('continue')}</span>
                      <span className="material-symbols-outlined text-base">arrow_forward</span>
                    </button>
                  </div>

                  {isLocationConfirmed && (
                    <div className="p-3 bg-white border border-emerald-300 rounded-xl text-xs text-emerald-900 font-medium flex items-center gap-2 mt-1">
                      <span className="material-symbols-outlined text-emerald-600 text-base shrink-0">check_circle</span>
                      <span>Location confirmed for Pincode {locationState.pincode}. Ready for nearby office search.</span>
                    </div>
                  )}
                </div>
              )}

              {/* PINCODE ERROR STATE */}
              {locationState.status === 'error' && (
                <div className="bg-red-50/90 border border-red-200 rounded-2xl p-5 md:p-6 flex flex-col gap-4 animate-fade-in" role="alert">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-2xl">error</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base text-red-950">
                        {locationState.errorType === 'invalid_pincode' && t('enter_valid_6digit_pincode')}
                        {locationState.errorType === 'pincode_not_found' && t('pincode_not_found')}
                        {locationState.errorType === 'network_error' && t('network_error_location')}
                        {locationState.errorType === 'server_error' && t('something_went_wrong_location')}
                        {!locationState.errorType && t('something_went_wrong_location')}
                      </h3>

                      <p className="text-xs md:text-sm text-red-800 mt-1 leading-relaxed">
                        {locationState.errorMessage || "We couldn't resolve this pincode. Please verify the 6-digit number and try again."}
                      </p>
                    </div>
                  </div>

                  {/* Error Recovery Actions */}
                  <div className="pt-3 border-t border-red-200 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setLocationState(prev => ({ ...prev, status: 'idle' }))}
                      className="h-10 px-4 bg-red-700 text-white rounded-xl text-xs font-bold hover:bg-red-800 transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <span className="material-symbols-outlined text-base">refresh</span>
                      {t('try_again')}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectOption(null as any)}
                      className="h-10 px-4 bg-white border border-red-300 text-red-900 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-base">map</span>
                      {t('use_another_method')}
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}


          {/* OPTION 3: SELECT LOCATION MANUALLY */}
          {selectedOption === 'manual' && (
            <div className="bg-[#f8f9ff] border border-[#c3c6d1] rounded-2xl p-5 md:p-6 flex flex-col gap-5 animate-fade-in">
              {/* Heading and Supporting Text */}
              <div>
                <h3 className="text-lg font-bold text-[#001e40]">
                  {t('select_your_location')}
                </h3>
                <p className="text-xs md:text-sm text-[#43474f] mt-1">
                  {t('select_location_supporting')}
                </p>
              </div>

              {/* Form / Selection Controls */}
              <div className="flex flex-col gap-4">
                {/* 1. STATE SELECTOR */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#001e40] uppercase tracking-wider">
                      {t('state')} <span className="text-red-600">*</span>
                    </label>
                    {selectedState && (
                      <button
                        type="button"
                        onClick={handleResetManualSelections}
                        className="text-[11px] font-semibold text-[#005db6] hover:underline"
                      >
                        Reset All
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveModal('state')}
                    className={`w-full h-12 px-3.5 bg-white border rounded-xl text-left text-sm font-semibold flex items-center justify-between transition-colors focus:outline-none focus:ring-2 focus:ring-[#005db6] ${
                      selectedState
                        ? 'border-[#005db6] text-[#001e40] bg-[#eef4ff]/30'
                        : 'border-[#c3c6d1] text-[#74777f] hover:border-[#005db6]'
                    }`}
                    aria-haspopup="dialog"
                    aria-expanded={activeModal === 'state'}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="material-symbols-outlined text-base text-[#005db6]">map</span>
                      <span className="truncate">{selectedState || t('select_state_placeholder')}</span>
                    </div>
                    <span className="material-symbols-outlined text-lg text-[#74777f]">arrow_drop_down</span>
                  </button>
                </div>

                {/* 2. DISTRICT SELECTOR */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#001e40] uppercase tracking-wider">
                    {t('district')} <span className="text-red-600">*</span>
                  </label>
                  <button
                    type="button"
                    disabled={!selectedState}
                    onClick={() => setActiveModal('district')}
                    className={`w-full h-12 px-3.5 border rounded-xl text-left text-sm font-semibold flex items-center justify-between transition-colors focus:outline-none focus:ring-2 focus:ring-[#005db6] ${
                      !selectedState
                        ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                        : selectedDistrict
                        ? 'bg-[#eef4ff]/30 border-[#005db6] text-[#001e40]'
                        : 'bg-white border-[#c3c6d1] text-[#74777f] hover:border-[#005db6]'
                    }`}
                    aria-haspopup="dialog"
                    aria-expanded={activeModal === 'district'}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="material-symbols-outlined text-base text-[#005db6]">location_city</span>
                      <span className="truncate">
                        {selectedDistrict || (!selectedState ? t('select_state_first') : t('select_district_placeholder'))}
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-lg text-[#74777f]">arrow_drop_down</span>
                  </button>
                </div>

                {/* 3. CITY / LOCALITY SELECTOR */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#001e40] uppercase tracking-wider">
                    {t('city_locality')} <span className="text-red-600">*</span>
                  </label>
                  <button
                    type="button"
                    disabled={!selectedDistrict}
                    onClick={() => setActiveModal('city')}
                    className={`w-full h-12 px-3.5 border rounded-xl text-left text-sm font-semibold flex items-center justify-between transition-colors focus:outline-none focus:ring-2 focus:ring-[#005db6] ${
                      !selectedDistrict
                        ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                        : selectedCity
                        ? 'bg-[#eef4ff]/30 border-[#005db6] text-[#001e40]'
                        : 'bg-white border-[#c3c6d1] text-[#74777f] hover:border-[#005db6]'
                    }`}
                    aria-haspopup="dialog"
                    aria-expanded={activeModal === 'city'}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="material-symbols-outlined text-base text-[#005db6]">pin_drop</span>
                      <span className="truncate">
                        {selectedCity || (!selectedDistrict ? t('select_district_first') : t('select_city_placeholder'))}
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-lg text-[#74777f]">arrow_drop_down</span>
                  </button>

                  {/* Empty Cities Notice */}
                  {selectedDistrict && availableCities.length === 0 && (
                    <p className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200 flex items-center gap-1.5 mt-1">
                      <span className="material-symbols-outlined text-sm shrink-0">info</span>
                      <span>{t('no_locations_available')}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* CONFIRMATION SUMMARY CARD (When all 3 chosen) */}
              {selectedState && selectedDistrict && selectedCity && locationState.status !== 'success' && (
                <div className="bg-white border-2 border-[#005db6] rounded-2xl p-4 flex flex-col gap-3 shadow-xs animate-fade-in">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#005db6] bg-[#eef4ff] px-2 py-0.5 rounded-md">
                        {t('your_selected_location')}
                      </span>
                      <h4 className="text-base font-extrabold text-[#001e40] mt-1">
                        📍 {selectedCity}
                      </h4>
                      <p className="text-xs text-[#43474f]">
                        {selectedDistrict}, {selectedState}, India
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedCity('')}
                      className="text-xs font-bold text-[#005db6] hover:bg-[#eef4ff] px-2.5 py-1 rounded-lg border border-[#c3c6d1]"
                    >
                      {t('change')}
                    </button>
                  </div>

                  <div className="pt-2 border-t border-[#c3c6d1] flex justify-end">
                    <button
                      type="button"
                      onClick={handleConfirmManualLocation}
                      className="w-full sm:w-auto h-11 px-6 bg-[#005db6] text-white rounded-xl text-xs font-bold hover:bg-[#004488] transition-colors shadow-xs flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-lg">check_circle</span>
                      <span>{t('confirm_location')}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* LOCATION RESULT CARD (When locationState.status === 'success' and method === 'manual') */}
              {locationState.status === 'success' && locationState.method === 'manual' && (
                <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-5 md:p-6 flex flex-col gap-4 animate-fade-in">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <span className="material-symbols-outlined text-2xl">check_circle</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                          {t('location_selected')}
                        </span>
                      </div>

                      <h3 className="text-lg md:text-xl font-extrabold text-[#001e40] mt-1 truncate">
                        📍 {locationState.city}, {locationState.state}
                      </h3>

                      <p className="text-xs text-[#43474f] mt-1 leading-relaxed">
                        {locationState.district} District, {locationState.state}, India
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-emerald-200 flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setLocationState(prev => ({ ...prev, status: 'idle' }));
                        setIsLocationConfirmed(false);
                      }}
                      className="h-10 px-4 bg-white border border-[#c3c6d1] text-[#001e40] rounded-xl text-xs font-bold hover:bg-[#eef4ff] transition-colors flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-base">edit</span>
                      {t('change_location')}
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsLocationConfirmed(true)}
                      className="h-10 px-5 bg-[#005db6] text-white rounded-xl text-xs font-bold hover:bg-[#004488] transition-colors shadow-xs flex items-center gap-1.5"
                    >
                      <span>{t('continue')}</span>
                      <span className="material-symbols-outlined text-base">arrow_forward</span>
                    </button>
                  </div>

                  {isLocationConfirmed && (
                    <div className="p-3 bg-white border border-emerald-300 rounded-xl text-xs text-emerald-900 font-medium flex items-center gap-2 mt-1">
                      <span className="material-symbols-outlined text-emerald-600 text-base shrink-0">check_circle</span>
                      <span>Location confirmed: {locationState.city}, {locationState.state}. Ready for nearby office search.</span>
                    </div>
                  )}
                </div>
              )}

              {/* SEARCHABLE MODALS */}
              <SearchableLocationModal
                isOpen={activeModal === 'state'}
                title={t('select_your_location') + ' - ' + t('state')}
                placeholder={t('search_state')}
                items={allStates}
                selectedItem={selectedState}
                onSelect={handleStateSelect}
                onClose={() => setActiveModal(null)}
                emptyMessage={t('no_matching_location_found')}
              />

              <SearchableLocationModal
                isOpen={activeModal === 'district'}
                title={t('district') + ' (' + selectedState + ')'}
                placeholder={t('search_district')}
                items={availableDistricts}
                selectedItem={selectedDistrict}
                onSelect={handleDistrictSelect}
                onClose={() => setActiveModal(null)}
                emptyMessage={t('no_districts_found')}
              />

              <SearchableLocationModal
                isOpen={activeModal === 'city'}
                title={t('city_locality') + ' (' + selectedDistrict + ')'}
                placeholder={t('search_city')}
                items={availableCities}
                selectedItem={selectedCity}
                onSelect={handleCitySelect}
                onClose={() => setActiveModal(null)}
                emptyMessage={t('no_locations_available')}
              />

            </div>
          )}


          {/* Privacy Message */}
          <div className="mt-2 flex items-center justify-center gap-2 text-xs text-[#43474f] bg-[#eef4ff]/70 border border-[#c3c6d1]/60 p-3 rounded-xl text-center">
            <span className="material-symbols-outlined text-[#005db6] text-base shrink-0">
              lock
            </span>
            <span>{t('location_privacy_note')}</span>
          </div>

        </section>

        {/* RELEVANT OFFICE RESULTS SECTION */}
        {locationState.status === 'success' && searchResponse && (
          <section className="bg-white border border-[#c3c6d1] rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-5 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#c3c6d1]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                    Verified Office Results
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-[#001e40] mt-1">
                  Relevant Government Offices
                </h3>
                <p className="text-xs text-[#43474f] mt-0.5">
                  Showing official offices for <strong className="text-[#005db6]">{selectedService.title}</strong> near{' '}
                  <strong className="text-[#001e40]">
                    {locationState.city || locationState.district || locationState.state || (locationState.pincode ? `Pincode ${locationState.pincode}` : 'Selected Location')}
                  </strong>
                </p>
              </div>

              <span className="self-start sm:self-center px-3 py-1 bg-[#eef4ff] text-[#005db6] border border-[#c3c6d1] rounded-full text-xs font-bold shrink-0">
                {searchResponse.total} {searchResponse.total === 1 ? 'Office Found' : 'Offices Found'}
              </span>
            </div>

            {/* OFFICES LIST */}
            {searchResponse.offices.length > 0 ? (
              <div className="flex flex-col gap-4">
                {searchResponse.offices.map((office) => (
                  <div
                    key={office.id}
                    className="p-4 md:p-5 border border-[#c3c6d1] rounded-2xl bg-white hover:border-[#005db6] transition-all flex flex-col gap-3 shadow-2xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#005db6] bg-[#eef4ff] px-2 py-0.5 rounded-md">
                          {office.category} {office.office_type ? `• ${office.office_type}` : ''}
                        </span>
                        <h4 className="text-base font-extrabold text-[#001e40] mt-1">
                          {office.name}
                        </h4>
                      </div>

                      {typeof office.distanceKm === 'number' ? (
                        <span className="self-start px-2.5 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-lg text-xs font-bold shrink-0 flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">near_me</span>
                          {office.distanceKm} km away
                        </span>
                      ) : (
                        <span className="self-start px-2.5 py-1 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg text-xs font-medium shrink-0 flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">location_on</span>
                          Location Match
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5 text-xs text-[#43474f] pt-1">
                      <p className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-base text-[#005db6] shrink-0 mt-0.5">place</span>
                        <span>{office.address}, {office.city}{office.district ? `, ${office.district}` : ''}{office.state ? `, ${office.state}` : ''}{office.pincode ? ` - ${office.pincode}` : ''}</span>
                      </p>

                      <p className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-base text-[#005db6] shrink-0">schedule</span>
                        <span>{office.workingHours}</span>
                      </p>

                      {office.phone && (
                        <p className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-base text-[#005db6] shrink-0">call</span>
                          <span>{office.phone}</span>
                        </p>
                      )}
                    </div>

                    {office.servicesHandled && office.servicesHandled.length > 0 && (
                      <div className="pt-2 border-t border-[#c3c6d1]/60 flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-bold text-[#001e40] mr-1">Services Handled:</span>
                        {office.servicesHandled.map((srv, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] bg-[#f8f9ff] text-[#43474f] border border-[#c3c6d1]/60 px-2 py-0.5 rounded-md"
                          >
                            {srv}
                          </span>
                        ))}
                      </div>
                    )}

                    {office.tips && office.tips.length > 0 && (
                      <div className="bg-[#eef4ff]/50 border border-[#c3c6d1]/60 rounded-xl p-3 text-xs text-[#001e40]">
                        <p className="font-bold flex items-center gap-1 text-[#005db6] mb-1">
                          <span className="material-symbols-outlined text-sm">lightbulb</span>
                          Citizen Visit Guidance:
                        </p>
                        <ul className="list-disc list-inside space-y-0.5 text-[#43474f]">
                          {office.tips.map((tip, idx) => (
                            <li key={idx}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Office Card Actions */}
                    <div className="pt-3 border-t border-[#c3c6d1]/60 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                      <button
                        type="button"
                        onClick={() => setSelectedOffice(office)}
                        className="w-full sm:w-auto h-10 px-4 bg-[#005db6] hover:bg-[#00376f] text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <span className="material-symbols-outlined text-base">visibility</span>
                        <span>{t('view_details') || 'View Details'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenDirections(office)}
                        disabled={!isDirectionsAvailable(office)}
                        className={`w-full sm:w-auto h-10 px-4 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                          isDirectionsAvailable(office)
                            ? 'bg-[#eef4ff] hover:bg-[#dfe9fa] text-[#005db6] border border-[#c3c6d1]'
                            : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                        }`}
                      >
                        <span className="material-symbols-outlined text-base">directions</span>
                        <span>{t('get_directions') || 'Get Directions'}</span>
                      </button>
                    </div>
                  </div>
                ))}

                {/* PAGINATION CONTROLS */}
                {(searchResponse.totalPages || 1) > 1 && (
                  <div className="flex items-center justify-between pt-4 border-t border-[#c3c6d1]">
                    <button
                      type="button"
                      disabled={currentPage <= 1}
                      onClick={() => {
                        setCurrentPage((prev) => Math.max(1, prev - 1));
                        window.scrollTo({ top: 400, behavior: 'smooth' });
                      }}
                      className="px-3.5 py-2 bg-white border border-[#c3c6d1] rounded-xl text-xs font-bold text-[#001e40] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#eef4ff] transition-colors flex items-center gap-1 shadow-2xs"
                    >
                      <span className="material-symbols-outlined text-sm">chevron_left</span>
                      Previous
                    </button>

                    <span className="text-xs font-semibold text-[#43474f]">
                      Page {currentPage} of {searchResponse.totalPages}
                    </span>

                    <button
                      type="button"
                      disabled={currentPage >= (searchResponse.totalPages || 1)}
                      onClick={() => {
                        setCurrentPage((prev) => Math.min(searchResponse.totalPages || 1, prev + 1));
                        window.scrollTo({ top: 400, behavior: 'smooth' });
                      }}
                      className="px-3.5 py-2 bg-white border border-[#c3c6d1] rounded-xl text-xs font-bold text-[#001e40] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#eef4ff] transition-colors flex items-center gap-1 shadow-2xs"
                    >
                      Next
                      <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* EMPTY RESULTS CARD */
              <div className="p-6 bg-[#f8f9ff] border border-[#c3c6d1] rounded-2xl text-center flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">location_off</span>
                </div>
                <div>
                  <h4 className="font-bold text-base text-[#001e40]">
                    No Relevant Offices Found in Your Direct Area
                  </h4>
                  <p className="text-xs text-[#43474f] max-w-md mt-1 leading-relaxed">
                    {searchResponse.message ||
                      `We verified official centers for ${selectedService.title}. No matching offices were found directly in ${locationState.city || locationState.district || locationState.state || 'your selected location'} yet.`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setLocationState(prev => ({ ...prev, status: 'idle' }));
                    setIsLocationConfirmed(false);
                  }}
                  className="mt-1 px-4 py-2 bg-white border border-[#c3c6d1] text-[#005db6] rounded-xl text-xs font-bold hover:bg-[#eef4ff] transition-colors"
                >
                  Try Searching Another City or District
                </button>
              </div>
            )}
          </section>
        )}

        {/* Back Button to Return to Preparation Summary */}
        <div className="flex justify-start">
          <button
            type="button"
            onClick={handleHeaderBack}
            className="h-11 px-5 border border-[#c3c6d1] bg-white text-[#001e40] rounded-xl text-xs font-bold hover:bg-[#eef4ff] transition-colors flex items-center gap-2 shadow-xs"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            {t('back_to_summary')}
          </button>
        </div>

      </main>
    </div>
  );
};
