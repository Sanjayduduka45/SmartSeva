import { OfficeItem, LocationState, OfficeSearchResponse } from '../types';
import { OFFICIAL_OFFICES_DATA } from '../data/officesData';
import { FULL_SERVICES_CATALOG } from '../data/localizedServices';

/**
 * Service-to-Office Type & Category Mapping Matrix
 */
export interface ServiceOfficeMapping {
  serviceId: string;
  category: string;
  allowedOfficeCategories: string[];
  primaryOfficeTypes: string[];
}

const SERVICE_OFFICE_MAP: Record<string, ServiceOfficeMapping> = {
  // --- TRANSPORT ---
  'driving-license': {
    serviceId: 'driving-license',
    category: 'Transport',
    allowedOfficeCategories: ['Transport'],
    primaryOfficeTypes: ['Regional Transport Office (RTO)', 'Driving Test Track']
  },
  'dl-renewal': {
    serviceId: 'dl-renewal',
    category: 'Transport',
    allowedOfficeCategories: ['Transport'],
    primaryOfficeTypes: ['Regional Transport Office (RTO)']
  },
  'learners-license': {
    serviceId: 'learners-license',
    category: 'Transport',
    allowedOfficeCategories: ['Transport'],
    primaryOfficeTypes: ['Regional Transport Office (RTO)']
  },
  'rc-transfer': {
    serviceId: 'rc-transfer',
    category: 'Transport',
    allowedOfficeCategories: ['Transport'],
    primaryOfficeTypes: ['Regional Transport Office (RTO)']
  },

  // --- IDENTITY & PASSPORT ---
  'passport': {
    serviceId: 'passport',
    category: 'Identity',
    allowedOfficeCategories: ['Identity'],
    primaryOfficeTypes: ['Passport Seva Kendra (PSK)']
  },
  'aadhaar-update': {
    serviceId: 'aadhaar-update',
    category: 'Identity',
    allowedOfficeCategories: ['Identity'],
    primaryOfficeTypes: ['Aadhaar Seva Kendra (UIDAI)']
  },
  'pan-card': {
    serviceId: 'pan-card',
    category: 'Identity',
    allowedOfficeCategories: ['Identity'],
    primaryOfficeTypes: ['PAN & Identity Seva Center']
  },
  'pan-correction': {
    serviceId: 'pan-correction',
    category: 'Identity',
    allowedOfficeCategories: ['Identity'],
    primaryOfficeTypes: ['PAN & Identity Seva Center']
  },
  'voter-id': {
    serviceId: 'voter-id',
    category: 'Identity',
    allowedOfficeCategories: ['Identity'],
    primaryOfficeTypes: ['Electoral Registration Office / Civic Center']
  },

  // --- CERTIFICATES ---
  'income-certificate': {
    serviceId: 'income-certificate',
    category: 'Certificates',
    allowedOfficeCategories: ['Certificates'],
    primaryOfficeTypes: ['Tahsildar & Revenue Office (Meeseva / E-Seva)']
  },
  'caste-certificate': {
    serviceId: 'caste-certificate',
    category: 'Certificates',
    allowedOfficeCategories: ['Certificates'],
    primaryOfficeTypes: ['Tahsildar & Revenue Office (Meeseva / E-Seva)']
  },
  'residence-certificate': {
    serviceId: 'residence-certificate',
    category: 'Certificates',
    allowedOfficeCategories: ['Certificates'],
    primaryOfficeTypes: ['Tahsildar & Revenue Office (Meeseva / E-Seva)']
  },
  'birth-certificate': {
    serviceId: 'birth-certificate',
    category: 'Certificates',
    allowedOfficeCategories: ['Certificates'],
    primaryOfficeTypes: ['Municipal Corporation Civic Service Center']
  },
  'death-certificate': {
    serviceId: 'death-certificate',
    category: 'Certificates',
    allowedOfficeCategories: ['Certificates'],
    primaryOfficeTypes: ['Municipal Corporation Civic Service Center']
  },

  // --- EDUCATION ---
  'scholarship-application': {
    serviceId: 'scholarship-application',
    category: 'Education',
    allowedOfficeCategories: ['Education'],
    primaryOfficeTypes: ['District Education Officer (DEO) & Welfare Desk']
  },
  'bonafide-certificate': {
    serviceId: 'bonafide-certificate',
    category: 'Education',
    allowedOfficeCategories: ['Education'],
    primaryOfficeTypes: ['District Education Officer (DEO) & Welfare Desk']
  },
  'transfer-certificate': {
    serviceId: 'transfer-certificate',
    category: 'Education',
    allowedOfficeCategories: ['Education'],
    primaryOfficeTypes: ['District Education Officer (DEO) & Welfare Desk']
  },
  'educational-marksheet': {
    serviceId: 'educational-marksheet',
    category: 'Education',
    allowedOfficeCategories: ['Education'],
    primaryOfficeTypes: ['District Education Officer (DEO) & Welfare Desk']
  },
  'student-concession': {
    serviceId: 'student-concession',
    category: 'Education',
    allowedOfficeCategories: ['Education', 'Transport'],
    primaryOfficeTypes: ['District Education Officer (DEO) & Welfare Desk']
  },

  // --- EMPLOYMENT ---
  'employment-registration': {
    serviceId: 'employment-registration',
    category: 'Employment',
    allowedOfficeCategories: ['Employment'],
    primaryOfficeTypes: ['District Employment Exchange & Skill Center']
  },
  'business-license': {
    serviceId: 'business-license',
    category: 'Employment',
    allowedOfficeCategories: ['Employment', 'Certificates'],
    primaryOfficeTypes: ['Municipal Corporation Civic Service Center']
  },
  'eshram-card': {
    serviceId: 'eshram-card',
    category: 'Employment',
    allowedOfficeCategories: ['Employment'],
    primaryOfficeTypes: ['District Employment Exchange & Skill Center']
  },

  // --- HEALTHCARE ---
  'ayushman-card': {
    serviceId: 'ayushman-card',
    category: 'Healthcare',
    allowedOfficeCategories: ['Healthcare'],
    primaryOfficeTypes: ['District Civil Hospital & Ayushman Desk']
  },
  'medical-certificate': {
    serviceId: 'medical-certificate',
    category: 'Healthcare',
    allowedOfficeCategories: ['Healthcare'],
    primaryOfficeTypes: ['District Civil Hospital & Ayushman Desk']
  },
  'disability-certificate': {
    serviceId: 'disability-certificate',
    category: 'Healthcare',
    allowedOfficeCategories: ['Healthcare'],
    primaryOfficeTypes: ['District Civil Hospital & Ayushman Desk']
  },

  // --- BANKING & HOUSING ---
  'jandhan-account': {
    serviceId: 'jandhan-account',
    category: 'Banking',
    allowedOfficeCategories: ['Banking', 'Housing'],
    primaryOfficeTypes: ['District Financial Inclusion Center']
  },
  'pension-scheme': {
    serviceId: 'pension-scheme',
    category: 'Banking',
    allowedOfficeCategories: ['Banking', 'Housing'],
    primaryOfficeTypes: ['District Financial Inclusion Center']
  },
  'aadhaar-dbt-link': {
    serviceId: 'aadhaar-dbt-link',
    category: 'Banking',
    allowedOfficeCategories: ['Banking', 'Identity'],
    primaryOfficeTypes: ['District Financial Inclusion Center']
  },
  'pmay-housing': {
    serviceId: 'pmay-housing',
    category: 'Housing',
    allowedOfficeCategories: ['Housing'],
    primaryOfficeTypes: ['District Housing Scheme Center']
  },
  'property-tax-khata': {
    serviceId: 'property-tax-khata',
    category: 'Housing',
    allowedOfficeCategories: ['Housing', 'Certificates'],
    primaryOfficeTypes: ['Municipal Corporation Civic Service Center']
  }
};

/**
 * Calculates geographic distance in kilometers using the Haversine formula.
 * Validates coordinate inputs to prevent impossible values.
 */

export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number | null {
  // Coordinate range check (-90 to 90 lat, -180 to 180 lon)
  if (
    typeof lat1 !== 'number' || typeof lon1 !== 'number' ||
    typeof lat2 !== 'number' || typeof lon2 !== 'number' ||
    isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2) ||
    lat1 < -90 || lat1 > 90 || lat2 < -90 || lat2 > 90 ||
    lon1 < -180 || lon1 > 180 || lon2 < -180 || lon2 > 180
  ) {
    return null;
  }

  const R = 6371; // Radius of Earth in KM
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10;
}

// Pre-index services catalog by ID for O(1) retrieval
const SERVICES_BY_ID = new Map<string, typeof FULL_SERVICES_CATALOG[0]>();
for (const s of FULL_SERVICES_CATALOG) {
  SERVICES_BY_ID.set(s.id, s);
}

// Pre-index offices by category for O(1) candidate lookup
const OFFICES_BY_CATEGORY = new Map<string, OfficeItem[]>();
for (const off of OFFICIAL_OFFICES_DATA) {
  if (off.active === false) continue;
  const cat = off.category.toLowerCase();
  if (!OFFICES_BY_CATEGORY.has(cat)) {
    OFFICES_BY_CATEGORY.set(cat, []);
  }
  OFFICES_BY_CATEGORY.get(cat)!.push(off);
}

// In-memory LRU cache for office search queries (3-minute TTL)
interface SearchCacheEntry {
  data: OfficeSearchResponse;
  expiresAt: number;
}
const SEARCH_QUERY_CACHE = new Map<string, SearchCacheEntry>();
const MAX_SEARCH_CACHE = 150;
const SEARCH_CACHE_TTL_MS = 3 * 60 * 1000;

function getFromSearchCache(key: string): OfficeSearchResponse | null {
  const entry = SEARCH_QUERY_CACHE.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    SEARCH_QUERY_CACHE.delete(key);
    return null;
  }
  return entry.data;
}

function saveToSearchCache(key: string, data: OfficeSearchResponse): void {
  if (SEARCH_QUERY_CACHE.size >= MAX_SEARCH_CACHE) {
    const oldestKey = SEARCH_QUERY_CACHE.keys().next().value;
    if (oldestKey !== undefined) SEARCH_QUERY_CACHE.delete(oldestKey);
  }
  SEARCH_QUERY_CACHE.set(key, {
    data,
    expiresAt: Date.now() + SEARCH_CACHE_TTL_MS
  });
}

export const officeService = {
  /**
   * Retrieves the mapped office types for a given service.
   */
  getServiceMapping(serviceId: string): ServiceOfficeMapping | null {
    return SERVICE_OFFICE_MAP[serviceId] || null;
  },

  /**
   * Validates whether a LocationState object contains usable search location criteria.
   */
  validateSearchLocation(location: LocationState | null | undefined): { isValid: boolean; reason?: string } {
    if (!location) {
      return { isValid: false, reason: 'Location information is missing.' };
    }

    if (location.status !== 'success') {
      return { isValid: false, reason: 'Location selection is not confirmed or has an error.' };
    }

    // Has GPS coordinates
    const hasGps =
      typeof location.latitude === 'number' &&
      typeof location.longitude === 'number' &&
      !isNaN(location.latitude) &&
      !isNaN(location.longitude) &&
      location.latitude >= -90 && location.latitude <= 90 &&
      location.longitude >= -180 && location.longitude <= 180;

    // Has City / District / State
    const hasArea = Boolean(location.city || location.district || location.state);

    // Has Pincode
    const hasPincode = Boolean(location.pincode && /^[1-9][0-9]{5}$/.test(location.pincode));

    if (!hasGps && !hasArea && !hasPincode) {
      return { isValid: false, reason: 'Please select or provide a valid location.' };
    }

    return { isValid: true };
  },

  /**
   * Core Office Search Engine.
   * Performs dual Service-Matching and Location-Matching filtering.
   * Pre-filters by indexed categories and bounding-boxes before expensive distance calculation.
   * Supports pagination (page, pageSize).
   * NEVER returns random or unrelated offices.
   * NEVER fabricates fake coordinates or fake distances.
   */
  searchNearbyOffices(
    serviceId: string,
    location: LocationState,
    page: number = 1,
    pageSize: number = 20
  ): OfficeSearchResponse {
    // 1. Verify Service Existence
    const serviceObj = SERVICES_BY_ID.get(serviceId) || FULL_SERVICES_CATALOG.find(s => s.id === serviceId);
    if (!serviceObj) {
      return {
        status: 'error',
        offices: [],
        total: 0,
        page,
        pageSize,
        totalPages: 0,
        error: 'Invalid or unrecognized service selected.'
      };
    }

    // 2. Verify Service-Office Mapping
    const mapping = this.getServiceMapping(serviceId);
    if (!mapping) {
      return {
        status: 'success',
        service: {
          id: serviceObj.id,
          name: serviceObj.title,
          category: serviceObj.category
        },
        location: {
          city: location.city,
          district: location.district,
          state: location.state,
          pincode: location.pincode,
          latitude: location.latitude,
          longitude: location.longitude
        },
        offices: [],
        total: 0,
        page,
        pageSize,
        totalPages: 0,
        message: 'Office information is not available for this service yet.'
      };
    }

    // 3. Validate Location Input (Strictly no fallback defaults)
    const valCheck = this.validateSearchLocation(location);
    if (!valCheck.isValid) {
      return {
        status: 'error',
        offices: [],
        total: 0,
        page,
        pageSize,
        totalPages: 0,
        error: valCheck.reason || 'Valid search location is required. Please select a location first.'
      };
    }

    // Check in-memory query cache
    const cacheKey = `${serviceId}:${location.method}:${location.latitude?.toFixed(3)}:${location.longitude?.toFixed(3)}:${location.pincode}:${location.state}:${location.district}:${location.city}:${page}:${pageSize}`;
    const cachedResult = getFromSearchCache(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    // 4. Candidate Offices Retrieval from Pre-Indexed Categories
    const candidateOffices: OfficeItem[] = [];
    for (const cat of mapping.allowedOfficeCategories) {
      const officesInCat = OFFICES_BY_CATEGORY.get(cat.toLowerCase());
      if (officesInCat) {
        candidateOffices.push(...officesInCat);
      }
    }

    if (candidateOffices.length === 0) {
      const emptyResponse: OfficeSearchResponse = {
        status: 'success',
        service: {
          id: serviceObj.id,
          name: serviceObj.title,
          category: serviceObj.category
        },
        location: {
          city: location.city,
          district: location.district,
          state: location.state,
          pincode: location.pincode,
          latitude: location.latitude,
          longitude: location.longitude
        },
        offices: [],
        total: 0,
        page,
        pageSize,
        totalPages: 0,
        message: 'No relevant offices found near your selected location.'
      };
      saveToSearchCache(cacheKey, emptyResponse);
      return emptyResponse;
    }

    // 5. Geographic Filtering & Distance Calculation
    const hasCoordinates =
      typeof location.latitude === 'number' &&
      typeof location.longitude === 'number' &&
      !isNaN(location.latitude) &&
      !isNaN(location.longitude);

    let processedOffices: OfficeItem[] = [];

    if (hasCoordinates) {
      // GPS-based search with Bounding Box Pre-Filter (~1.2 deg lat ≈ 133km)
      const userLat = location.latitude!;
      const userLng = location.longitude!;
      const normState = (location.state || '').toLowerCase();
      const normDistrict = (location.district || '').toLowerCase();

      const candidateResults: OfficeItem[] = [];

      for (const off of candidateOffices) {
        const offLat = off.coordinates?.lat;
        const offLng = off.coordinates?.lng;

        // Bounding-box check before trigonometry
        const hasCoords = typeof offLat === 'number' && typeof offLng === 'number';
        const isWithinBoundingBox =
          hasCoords &&
          Math.abs(offLat! - userLat) <= 1.2 &&
          Math.abs(offLng! - userLng) <= 1.4;

        const offState = (off.state || '').toLowerCase();
        const offDist = (off.district || '').toLowerCase();
        const isRegionalMatch =
          (normState && offState && normState === offState) ||
          (normDistrict && offDist && normDistrict === offDist);

        // Skip distant offices outside bounding box and non-matching states
        if (!isWithinBoundingBox && !isRegionalMatch) {
          continue;
        }

        let dist: number | null = null;
        if (hasCoords) {
          dist = calculateHaversineDistance(userLat, userLng, offLat!, offLng!);
        }

        // Distance filtering: within 60km or within regional limits
        if (typeof dist === 'number' && dist <= 60) {
          candidateResults.push({ ...off, distanceKm: dist });
        } else if (isRegionalMatch) {
          candidateResults.push({ ...off, distanceKm: dist });
        } else if (typeof dist === 'number' && dist <= 100) {
          candidateResults.push({ ...off, distanceKm: dist });
        }
      }

      // Sort: Nearest distance first
      candidateResults.sort((a, b) => {
        if (typeof a.distanceKm === 'number' && typeof b.distanceKm === 'number') {
          return a.distanceKm - b.distanceKm;
        }
        if (typeof a.distanceKm === 'number') return -1;
        if (typeof b.distanceKm === 'number') return 1;
        return 0;
      });

      processedOffices = candidateResults;

    } else {
      // Pincode / Manual Location Search (No User Coordinates)
      const normPincode = (location.pincode || '').trim();
      const normCity = (location.city || '').toLowerCase();
      const normDistrict = (location.district || '').toLowerCase();
      const normState = (location.state || '').toLowerCase();

      const scoredOffices = candidateOffices.map(off => {
        let score = 0;
        const offPincode = (off.pincode || '').trim();
        const offCity = (off.city || '').toLowerCase();
        const offDistrict = (off.district || '').toLowerCase();
        const offState = (off.state || '').toLowerCase();

        // Exact pincode match (highest weight)
        if (normPincode && offPincode && normPincode === offPincode) score += 100;

        // Exact or partial city match
        if (normCity && offCity && (normCity === offCity || normCity.includes(offCity) || offCity.includes(normCity))) {
          score += 50;
        }

        // District match
        if (normDistrict && offDistrict && (normDistrict === offDistrict || normDistrict.includes(offDistrict) || offDistrict.includes(normDistrict))) {
          score += 30;
        }

        // State match
        if (normState && offState && (normState === offState || normState.includes(offState) || offState.includes(normState))) {
          score += 10;
        }

        return {
          office: {
            ...off,
            distanceKm: null // Never fabricate fake distance when coordinates are absent!
          },
          score
        };
      });

      // Filter out score === 0 (no match to state/district/city/pincode)
      const matched = scoredOffices.filter(item => item.score > 0);

      // Sort by highest relevance score
      matched.sort((a, b) => b.score - a.score);

      processedOffices = matched.map(item => item.office);
    }

    const total = processedOffices.length;
    const safePage = Math.max(1, page);
    const safePageSize = Math.max(1, Math.min(50, pageSize));
    const totalPages = Math.ceil(total / safePageSize) || 1;
    const startIndex = (safePage - 1) * safePageSize;
    const paginatedOffices = processedOffices.slice(startIndex, startIndex + safePageSize);

    const response: OfficeSearchResponse = {
      status: 'success',
      service: {
        id: serviceObj.id,
        name: serviceObj.title,
        category: serviceObj.category
      },
      location: {
        city: location.city,
        district: location.district,
        state: location.state,
        pincode: location.pincode,
        latitude: location.latitude,
        longitude: location.longitude
      },
      offices: paginatedOffices,
      total,
      page: safePage,
      pageSize: safePageSize,
      totalPages,
      message: total === 0 ? 'No relevant offices found near your selected location.' : undefined
    };

    saveToSearchCache(cacheKey, response);
    return response;
  }
};
