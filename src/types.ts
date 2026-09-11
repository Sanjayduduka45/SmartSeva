export interface UserProfile {
  id: string;
  fullName: string;
  mobileNumber?: string;
  email?: string;
  preferredLanguage: string;
  createdAt: string;
  updatedAt: string;
  isVerified?: boolean;
}

export type LanguageCode = 'en' | 'te' | 'hi' | 'kn';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  subtext: string;
}

export type ScreenType =
  | 'splash'
  | 'onboarding'
  | 'login'
  | 'home'
  | 'search'
  | 'service_details'
  | 'questionnaire'
  | 'preparation_plan'
  | 'document_checklist'
  | 'document_guide'
  | 'readiness_dashboard'
  | 'completion'
  | 'notifications'
  | 'profile'
  | 'settings'
  | 'help_support'
  | 'nearby_offices'
  | 'office_details';

export type DocumentStatus = 'have' | 'dont_have' | 'not_sure' | 'expired';

export interface DocumentItem {
  id: string;
  title: string;
  description: string;
  required: boolean;
  status: DocumentStatus;
  category?: string;
  notes?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  estCompletion: string;
  processingTime: string;
  eligibility: string;
  benefits: string[];
  importantNotes: string;
  documentsRequired: string[];
  isComingSoon?: boolean;
}

export interface OfficeItem {
  id: string;
  name: string;
  category: string;
  office_type?: string;
  address: string;
  city: string;
  district?: string;
  state?: string;
  pincode?: string;
  distanceKm?: number | null;
  phone?: string;
  website?: string;
  workingHours: string;
  servicesHandled: string[];
  tips?: string[];
  coordinates?: { lat: number; lng: number };
  active?: boolean;
}

export interface OfficeSearchQuery {
  serviceId: string;
  location: LocationState;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export interface OfficeSearchResponse {
  status: 'success' | 'error';
  service?: {
    id: string;
    name: string;
    category: string;
  };
  location?: {
    city?: string | null;
    district?: string | null;
    state?: string | null;
    pincode?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  };
  offices: OfficeItem[];
  total: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
  message?: string;
  error?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'urgent' | 'info' | 'reminder';
  unread: boolean;
  actionText?: string;
}

export interface PreparationHistoryItem {
  id: string;
  userId: string;
  serviceId: string;
  serviceTitle: string;
  readinessScore: number;
  totalDocuments: number;
  availableDocuments: number;
  status: 'in_progress' | 'ready_for_visit' | 'completed' | 'archived';
  summaryNotes?: string;
  createdAt: string;
}

export interface ServiceChecklistResponse {
  status: 'success' | 'error';
  serviceId: string;
  serviceTitle: string;
  requirements: DocumentItem[];
  totalRequired: number;
  totalOptional: number;
  error?: string;
}

export type LocationMethod = 'gps' | 'pincode' | 'manual';

export type LocationErrorType =
  | 'permission_denied'
  | 'unavailable'
  | 'timeout'
  | 'resolution_failed'
  | 'network_error'
  | 'invalid_pincode'
  | 'pincode_not_found'
  | 'server_error';

export interface LocationState {
  method: LocationMethod | null;
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  district: string | null;
  state: string | null;
  pincode: string | null;
  country?: string | null;
  formattedAddress: string | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  errorType: LocationErrorType | null;
  errorMessage: string | null;
}

