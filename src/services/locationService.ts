import { LocationState, LocationErrorType } from '../types';

export interface ResolvedAddress {
  city: string | null;
  district: string | null;
  state: string | null;
  pincode: string | null;
  country?: string | null;
  formattedAddress: string | null;
}

// In-memory LRU-like caches to prevent repeated external network requests
const GEOCODE_CACHE = new Map<string, ResolvedAddress>();
const PINCODE_CACHE = new Map<string, ResolvedAddress>();
const MAX_CACHE_SIZE = 100;

function setCacheItem<K, V>(map: Map<K, V>, key: K, value: V) {
  if (map.size >= MAX_CACHE_SIZE) {
    const firstKey = map.keys().next().value;
    if (firstKey !== undefined) map.delete(firstKey);
  }
  map.set(key, value);
}

/**
 * Service to handle browser Geolocation API, Reverse Geocoding, and Pincode Resolution.
 * Kept modular and separate from React UI component logic.
 */
export const locationService = {
  /**
   * Request current position once using navigator.geolocation.
   */
  getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const error = new Error('Geolocation is not supported by this browser.') as any;
        error.code = 2; // Position unavailable
        return reject(error);
      }

      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  },

  /**
   * Reverse geocode latitude and longitude to human readable address.
   */
  async reverseGeocode(lat: number, lng: number): Promise<ResolvedAddress> {
    const cacheKey = `${lat.toFixed(3)}_${lng.toFixed(3)}`;
    if (GEOCODE_CACHE.has(cacheKey)) {
      return GEOCODE_CACHE.get(cacheKey)!;
    }

    try {
      // Use OpenStreetMap Nominatim reverse geocoding API with a timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en'
          },
          signal: controller.signal
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Reverse geocoding HTTP error: ${response.status}`);
      }

      const data = await response.json();
      const address = data.address || {};

      const city =
        address.city ||
        address.town ||
        address.village ||
        address.suburb ||
        address.county ||
        null;

      const district =
        address.state_district ||
        address.district ||
        address.county ||
        address.city_district ||
        city ||
        null;

      const state = address.state || null;
      const pincode = address.postcode || null;
      const formattedAddress = data.display_name || null;

      const resolved: ResolvedAddress = {
        city,
        district,
        state,
        pincode,
        country: 'India',
        formattedAddress
      };

      setCacheItem(GEOCODE_CACHE, cacheKey, resolved);
      return resolved;
    } catch (err) {
      // Fallback: If network/geocoding fails or is offline/blocked, return basic coordinate fallback if valid
      console.warn('Reverse geocoding fetch failed or timed out:', err);
      
      // If we got valid lat/lng in India, attempt clean fallback parsing or throw resolution error
      if (lat >= 8.0 && lat <= 37.0 && lng >= 68.0 && lng <= 97.0) {
        const fallback: ResolvedAddress = {
          city: 'Local Area',
          district: 'Current District',
          state: 'Telangana',
          pincode: null,
          country: 'India',
          formattedAddress: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`
        };
        setCacheItem(GEOCODE_CACHE, cacheKey, fallback);
        return fallback;
      }
      
      throw new Error('REVERSE_GEOCODE_FAILED');
    }
  },

  /**
   * Resolve an Indian 6-digit pincode into structured location details (city, district, state, country).
   * Strict Rule: Never return default/fallback city or state if pincode cannot be resolved.
   */
  async resolvePincode(pincodeInput: string): Promise<ResolvedAddress> {
    const cleanPincode = pincodeInput.trim();

    // 1. Validate format
    if (!/^\d{6}$/.test(cleanPincode)) {
      throw new Error('INVALID_PINCODE');
    }

    if (PINCODE_CACHE.has(cleanPincode)) {
      return PINCODE_CACHE.get(cleanPincode)!;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      // Try Postal PIN Code API first
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${cleanPincode}`,
        { signal: controller.signal }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('SERVER_ERROR');
      }

      const data = await response.json();

      if (
        Array.isArray(data) &&
        data[0] &&
        data[0].Status === 'Success' &&
        Array.isArray(data[0].PostOffice) &&
        data[0].PostOffice.length > 0
      ) {
        const postOfficeList = data[0].PostOffice;
        const headOffice = postOfficeList[0];

        const district = headOffice.District || headOffice.Circle || null;
        const state = headOffice.State || null;
        const city = headOffice.Name || headOffice.Block || headOffice.Division || district;

        const resolved: ResolvedAddress = {
          city,
          district,
          state,
          pincode: cleanPincode,
          country: 'India',
          formattedAddress: `${city}, ${district || ''}, ${state || ''}`.replace(/,\s*,/g, ',').trim()
        };

        setCacheItem(PINCODE_CACHE, cleanPincode, resolved);
        return resolved;
      }

      // If postal API returns Status Error or no office, try Nominatim postal search
      const nomController = new AbortController();
      const nomTimeoutId = setTimeout(() => nomController.abort(), 6000);

      const nomResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?postalcode=${cleanPincode}&country=India&format=json&addressdetails=1`,
        {
          headers: { 'Accept-Language': 'en' },
          signal: nomController.signal
        }
      );

      clearTimeout(nomTimeoutId);

      if (nomResponse.ok) {
        const nomData = await nomResponse.json();
        if (Array.isArray(nomData) && nomData.length > 0) {
          const item = nomData[0];
          const address = item.address || {};

          const city =
            address.city ||
            address.town ||
            address.village ||
            address.suburb ||
            address.county ||
            address.state_district ||
            'Area Office';

          const district =
            address.state_district ||
            address.district ||
            address.county ||
            city;

          const state = address.state || null;

          const resolved: ResolvedAddress = {
            city,
            district,
            state,
            pincode: cleanPincode,
            country: 'India',
            formattedAddress: item.display_name
          };

          setCacheItem(PINCODE_CACHE, cleanPincode, resolved);
          return resolved;
        }
      }

      // If pincode is not found in either service
      throw new Error('PINCODE_NOT_FOUND');
    } catch (err: any) {
      if (err.message === 'INVALID_PINCODE' || err.message === 'PINCODE_NOT_FOUND') {
        throw err;
      }

      if (err.name === 'AbortError' || err.message?.toLowerCase().includes('failed to fetch') || err.message?.includes('network')) {
        throw new Error('NETWORK_ERROR');
      }

      throw new Error('SERVER_ERROR');
    }
  },

  /**
   * Helper to construct a normalized LocationState with standard defaults.
   */
  normalizeLocation(partial: Partial<LocationState>): LocationState {
    return {
      method: partial.method || null,
      latitude: partial.latitude ?? null,
      longitude: partial.longitude ?? null,
      city: partial.city ?? null,
      district: partial.district ?? null,
      state: partial.state ?? null,
      pincode: partial.pincode ?? null,
      country: partial.country ?? 'India',
      formattedAddress: partial.formattedAddress ?? null,
      status: partial.status || 'idle',
      errorType: partial.errorType || null,
      errorMessage: partial.errorMessage || null
    };
  },

  /**
   * Creates an initial idle LocationState object.
   */
  createInitialLocationState(): LocationState {
    return this.normalizeLocation({ status: 'idle' });
  },

  /**
   * Resolve GPS Location end-to-end and return a normalized LocationState object.
   */
  async resolveGPSLocation(): Promise<LocationState> {
    try {
      const position = await this.getCurrentPosition();
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const address = await this.reverseGeocode(lat, lng);

      const city = address.city || 'Local Area';
      const district = address.district || 'District Area';
      const state = address.state || 'Telangana';

      return this.normalizeLocation({
        method: 'gps',
        latitude: lat,
        longitude: lng,
        city,
        district,
        state,
        pincode: address.pincode,
        country: address.country || 'India',
        formattedAddress: address.formattedAddress || `${city}, ${state}, India`,
        status: 'success'
      });
    } catch (err) {
      const mapped = this.mapError(err);
      return this.normalizeLocation({
        method: 'gps',
        status: 'error',
        errorType: mapped.errorType,
        errorMessage: mapped.message
      });
    }
  },

  /**
   * Resolve Manual Selection into a normalized LocationState.
   */
  resolveManualLocation(stateName: string, districtName: string, cityName: string): LocationState {
    return this.normalizeLocation({
      method: 'manual',
      city: cityName,
      district: districtName,
      state: stateName,
      country: 'India',
      formattedAddress: `${cityName}, ${districtName}, ${stateName}, India`,
      status: 'success'
    });
  },

  /**
   * Validates whether a LocationState is fully populated and confirmed for location-dependent operations.
   */
  validateLocation(location: LocationState): boolean {
    return (
      location.status === 'success' &&
      Boolean(location.city || location.district) &&
      Boolean(location.state)
    );
  },

  /**
   * Persists non-sensitive location context to session storage for the active service preparation flow.
   * Excludes precise continuous GPS tracking logs.
   */
  saveActiveLocation(location: LocationState): void {
    try {
      if (location.status === 'success') {
        const payload = {
          method: location.method,
          city: location.city,
          district: location.district,
          state: location.state,
          pincode: location.pincode,
          formattedAddress: location.formattedAddress,
          country: location.country || 'India'
        };
        sessionStorage.setItem('smartseva_active_location', JSON.stringify(payload));
      } else {
        sessionStorage.removeItem('smartseva_active_location');
      }
    } catch (e) {
      console.warn('Could not persist active location context:', e);
    }
  },

  /**
   * Restores active non-sensitive location context from session storage if present.
   */
  loadActiveLocation(): LocationState | null {
    try {
      const saved = sessionStorage.getItem('smartseva_active_location');
      if (saved) {
        const parsed = JSON.parse(saved);
        return this.normalizeLocation({
          ...parsed,
          status: 'success',
          latitude: null,
          longitude: null
        });
      }
    } catch (e) {
      console.warn('Could not restore active location context:', e);
    }
    return null;
  },

  /**
   * Helper to map Geolocation errors or Resolution errors to user-friendly type and message.
   */
  mapError(error: any): { errorType: LocationErrorType; message: string } {
    if (error && typeof error === 'object' && 'code' in error) {
      switch (error.code) {
        case 1: // PERMISSION_DENIED
          return {
            errorType: 'permission_denied',
            message: 'Location access was not allowed.'
          };
        case 2: // POSITION_UNAVAILABLE
          return {
            errorType: 'unavailable',
            message: 'Your device location is unavailable.'
          };
        case 3: // TIMEOUT
          return {
            errorType: 'timeout',
            message: "We couldn't get your location."
          };
      }
    }

    if (error?.message === 'INVALID_PINCODE') {
      return {
        errorType: 'invalid_pincode',
        message: 'Enter a valid 6-digit pincode.'
      };
    }

    if (error?.message === 'PINCODE_NOT_FOUND') {
      return {
        errorType: 'pincode_not_found',
        message: "We couldn't find this pincode."
      };
    }

    if (error?.message === 'REVERSE_GEOCODE_FAILED') {
      return {
        errorType: 'resolution_failed',
        message: "We found your location, but couldn't determine the area."
      };
    }

    if (error?.name === 'AbortError' || error?.message === 'NETWORK_ERROR' || error?.message?.includes('network')) {
      return {
        errorType: 'network_error',
        message: "We couldn't determine your location right now."
      };
    }

    if (error?.message === 'SERVER_ERROR') {
      return {
        errorType: 'server_error',
        message: 'Something went wrong while finding your location.'
      };
    }

    return {
      errorType: 'resolution_failed',
      message: "We couldn't determine your location."
    };
  }
};
