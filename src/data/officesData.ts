import { OfficeItem, LanguageCode } from '../types';

export const OFFICIAL_OFFICES_DATA: OfficeItem[] = [
  // ==========================================
  // --- TELANGANA: WARANGAL / HANAMKONDA ---
  // ==========================================
  {
    id: 'off-rto-warangal',
    name: 'District RTO & Driving Test Track - Warangal',
    category: 'Transport',
    office_type: 'Regional Transport Office (RTO)',
    address: 'Kazipet - Hanamkonda Road, Near Govt Polytechnic',
    city: 'Hanamkonda',
    district: 'Warangal / Hanamkonda',
    state: 'Telangana',
    pincode: '506001',
    distanceKm: null,
    phone: '0870-2456789',
    workingHours: 'Mon - Fri: 10:00 AM - 5:00 PM',
    servicesHandled: [
      'New Driving Licence & Test Track',
      'Driving Licence Renewal',
      'Learner\'s Licence Test',
      'Vehicle RC Transfer & Fitness'
    ],
    tips: [
      'Arrive 15 minutes before your scheduled test track slot.',
      'Carry original learner\'s licence and passport photos.'
    ],
    coordinates: { lat: 17.9784, lng: 79.5941 }
  },
  {
    id: 'off-psk-warangal',
    name: 'Passport Seva Kendra (PSK) - Warangal',
    category: 'Identity',
    office_type: 'Passport Seva Kendra (PSK)',
    address: 'Subedari Road, Opp. Collectorate Office',
    city: 'Subedari',
    district: 'Warangal / Hanamkonda',
    state: 'Telangana',
    pincode: '506001',
    distanceKm: null,
    phone: '1800-258-1800',
    workingHours: 'Mon - Fri: 9:00 AM - 4:30 PM',
    servicesHandled: [
      'Fresh Passport Application',
      'Passport Re-issue & Renewal',
      'Tatkaal Passport Verification',
      'PCC (Police Clearance Certificate)'
    ],
    tips: [
      'Physical printout of appointment acknowledgment slip is mandatory.',
      'Ensure all names match your Aadhaar card identically.'
    ],
    coordinates: { lat: 17.9810, lng: 79.5902 }
  },
  {
    id: 'off-aadhaar-warangal',
    name: 'Aadhaar Seva Kendra (UIDAI) - Hanamkonda',
    category: 'Identity',
    office_type: 'Aadhaar Seva Kendra (UIDAI)',
    address: 'Chowrastha Circle, 1st Floor, Main Road',
    city: 'Hanamkonda',
    district: 'Warangal / Hanamkonda',
    state: 'Telangana',
    pincode: '506001',
    distanceKm: null,
    phone: '1947',
    workingHours: 'Mon - Sat: 9:30 AM - 5:30 PM',
    servicesHandled: [
      'Aadhaar Address & Mobile Update',
      'Biometric Photo & Fingerprint Update',
      'New Child Aadhaar Enrolment',
      'E-Aadhaar Printout'
    ],
    tips: [
      'Bring original supporting documents for address/identity verification.'
    ],
    coordinates: { lat: 17.9825, lng: 79.5980 }
  },
  {
    id: 'off-tahsildar-warangal',
    name: 'Tahsildar & Revenue Office (Meeseva) - Warangal Urban',
    category: 'Certificates',
    office_type: 'Tahsildar & Revenue Office (Meeseva / E-Seva)',
    address: 'Revenue Complex, Collectorate Campus',
    city: 'Warangal City',
    district: 'Warangal / Hanamkonda',
    state: 'Telangana',
    pincode: '506002',
    distanceKm: null,
    phone: '0870-2567890',
    workingHours: 'Mon - Sat: 10:00 AM - 5:00 PM',
    servicesHandled: [
      'Income Certificate Issuance',
      'Caste & Community Certificate',
      'Residence & Domicile Certificate',
      'Land Record & Pahani Copy'
    ],
    tips: [
      'Verification usually requires VRO signature check.',
      'Keep self-attested photocopies of Aadhaar and Ration card.'
    ],
    coordinates: { lat: 17.9680, lng: 79.6010 }
  },
  {
    id: 'off-municipal-warangal',
    name: 'Greater Warangal Municipal Corporation (GWMC) Civic Center',
    category: 'Certificates',
    office_type: 'Municipal Corporation Civic Service Center',
    address: 'GWMC Office Building, MGM Hospital Road',
    city: 'Warangal City',
    district: 'Warangal / Hanamkonda',
    state: 'Telangana',
    pincode: '506002',
    distanceKm: null,
    phone: '0870-2424242',
    workingHours: 'Mon - Sat: 10:00 AM - 5:00 PM',
    servicesHandled: [
      'Birth Certificate Issuance & Correction',
      'Death Certificate Copy',
      'Property Tax Khata Certificate',
      'Trade Licence Approval'
    ],
    tips: [
      'Hospital discharge summary required for birth certificate registration.'
    ],
    coordinates: { lat: 17.9712, lng: 79.6055 }
  },
  {
    id: 'off-hospital-warangal',
    name: 'MGM District Civil Hospital & Ayushman Desk - Warangal',
    category: 'Healthcare',
    office_type: 'District Civil Hospital & Ayushman Desk',
    address: 'MGM Hospital Campus, Station Road',
    city: 'Warangal City',
    district: 'Warangal / Hanamkonda',
    state: 'Telangana',
    pincode: '506002',
    distanceKm: null,
    phone: '0870-2577777',
    workingHours: 'Mon - Sat: 8:00 AM - 2:00 PM (Emergency 24/7)',
    servicesHandled: [
      'Ayushman Bharat Golden Card Generation',
      'Medical Fitness Certificate Examination',
      'Disability Board Assessment',
      'Government Health Scheme Verification'
    ],
    tips: [
      'Medical board assessments are conducted on Tuesday and Thursday mornings.'
    ],
    coordinates: { lat: 17.9740, lng: 79.6020 }
  },
  {
    id: 'off-deo-warangal',
    name: 'District Education Office (DEO) - Hanamkonda',
    category: 'Education',
    office_type: 'District Education Officer (DEO) & Welfare Desk',
    address: 'Near Arts College, Subedari',
    city: 'Hanamkonda',
    district: 'Warangal / Hanamkonda',
    state: 'Telangana',
    pincode: '506001',
    distanceKm: null,
    phone: '0870-2543210',
    workingHours: 'Mon - Fri: 10:00 AM - 5:00 PM',
    servicesHandled: [
      'Government Scholarship Counter',
      'Educational Marksheet Verification',
      'Student Concession Approval',
      'Transfer Certificate Counter-Signature'
    ],
    tips: [
      'Valid income certificate issued in current financial year is required for scholarships.'
    ],
    coordinates: { lat: 17.9790, lng: 79.5910 }
  },
  {
    id: 'off-employment-warangal',
    name: 'District Employment Exchange - Warangal',
    category: 'Employment',
    office_type: 'District Employment Exchange & Skill Center',
    address: 'Govt. Industrial Training Institute (ITI) Campus',
    city: 'Hanamkonda',
    district: 'Warangal / Hanamkonda',
    state: 'Telangana',
    pincode: '506001',
    distanceKm: null,
    phone: '0870-2433221',
    workingHours: 'Mon - Fri: 10:00 AM - 5:00 PM',
    servicesHandled: [
      'Unemployed Youth Registration',
      'e-Shram Facilitation Counter',
      'Skill India Training Enrolment'
    ],
    tips: [
      'Original educational marksheets required for qualification indexing.'
    ],
    coordinates: { lat: 17.9760, lng: 79.5930 }
  },

  // ==========================================
  // --- TELANGANA: HYDERABAD ---
  // ==========================================
  {
    id: 'off-rto-central-hyd',
    name: 'Regional Transport Office (RTO) - Khairatabad Central',
    category: 'Transport',
    office_type: 'Regional Transport Office (RTO)',
    address: 'Transport Bhavan, Khairatabad',
    city: 'Khairatabad',
    district: 'Hyderabad',
    state: 'Telangana',
    pincode: '500004',
    distanceKm: null,
    phone: '040-23311234',
    workingHours: 'Mon - Fri: 10:00 AM - 5:00 PM',
    servicesHandled: [
      'New Driving Licence & Test Track',
      'Driving Licence Renewal',
      'Learner\'s Licence Test',
      'Vehicle RC Transfer & Fitness'
    ],
    tips: [
      'Token counters close at 3:30 PM on weekdays.'
    ],
    coordinates: { lat: 17.4123, lng: 78.4611 }
  },
  {
    id: 'off-psk-begumpet-hyd',
    name: 'Passport Seva Kendra (PSK) - Begumpet',
    category: 'Identity',
    office_type: 'Passport Seva Kendra (PSK)',
    address: 'Gowra Trinity, SP Road, Begumpet',
    city: 'Secunderabad',
    district: 'Hyderabad',
    state: 'Telangana',
    pincode: '500016',
    distanceKm: null,
    phone: '1800-258-1800',
    workingHours: 'Mon - Fri: 9:00 AM - 4:30 PM',
    servicesHandled: [
      'Fresh Passport Application',
      'Passport Re-issue & Renewal',
      'Tatkaal Passport Verification',
      'PCC (Police Clearance Certificate)'
    ],
    tips: [
      'Physical printout of appointment acknowledgment slip is mandatory.'
    ],
    coordinates: { lat: 17.4432, lng: 78.4721 }
  },
  {
    id: 'off-aadhaar-central-hyd',
    name: 'Aadhaar Seva Kendra (UIDAI) - Central Hyd',
    category: 'Identity',
    office_type: 'Aadhaar Seva Kendra (UIDAI)',
    address: 'Civic Tower, Abids Road, Near Station',
    city: 'Central Zone',
    district: 'Hyderabad',
    state: 'Telangana',
    pincode: '500001',
    distanceKm: null,
    phone: '1947',
    workingHours: 'Mon - Sat: 9:30 AM - 5:30 PM',
    servicesHandled: [
      'Aadhaar Address & Mobile Update',
      'Biometric Photo & Fingerprint Update',
      'New Child Aadhaar Enrolment',
      'E-Aadhaar Printout'
    ],
    tips: ['Bring original address proof document.'],
    coordinates: { lat: 17.3850, lng: 78.4866 }
  },
  {
    id: 'off-tahsildar-hyd',
    name: 'Tahsildar & Revenue Office - Ameerpet / Khairatabad',
    category: 'Certificates',
    office_type: 'Tahsildar & Revenue Office (Meeseva / E-Seva)',
    address: 'MRO Complex, Ameerpet Main Road',
    city: 'Ameerpet',
    district: 'Hyderabad',
    state: 'Telangana',
    pincode: '500016',
    distanceKm: null,
    phone: '040-23730011',
    workingHours: 'Mon - Sat: 10:00 AM - 5:00 PM',
    servicesHandled: [
      'Income Certificate Issuance',
      'Caste & Community Certificate',
      'Residence & Domicile Certificate',
      'Land Record & Pahani Copy'
    ],
    tips: ['Self-attested photocopies of Aadhaar and Ration card required.'],
    coordinates: { lat: 17.4375, lng: 78.4482 }
  },
  {
    id: 'off-municipal-ghmc-hyd',
    name: 'GHMC Main Head Office Civic Center',
    category: 'Certificates',
    office_type: 'Municipal Corporation Civic Service Center',
    address: 'CC Complex, Tank Bund Road, Lower Tank Bund',
    city: 'Central Zone',
    district: 'Hyderabad',
    state: 'Telangana',
    pincode: '500063',
    distanceKm: null,
    phone: '040-21111111',
    workingHours: 'Mon - Sat: 10:00 AM - 5:00 PM',
    servicesHandled: [
      'Birth Certificate Issuance & Correction',
      'Death Certificate Copy',
      'Property Tax Khata Certificate',
      'Trade Licence Approval'
    ],
    tips: ['Property tax receipt needed for Khata requests.'],
    coordinates: { lat: 17.4100, lng: 78.4800 }
  },
  {
    id: 'off-hospital-osmania-hyd',
    name: 'Osmania General Hospital & Ayushman Desk',
    category: 'Healthcare',
    office_type: 'District Civil Hospital & Ayushman Desk',
    address: 'Afzal Gunj, Near High Court Road',
    city: 'Charminar Zone',
    district: 'Hyderabad',
    state: 'Telangana',
    pincode: '500012',
    distanceKm: null,
    phone: '040-24600121',
    workingHours: 'Mon - Sat: 8:00 AM - 2:00 PM (Emergency 24/7)',
    servicesHandled: [
      'Ayushman Bharat Golden Card Generation',
      'Medical Fitness Certificate Examination',
      'Disability Board Assessment'
    ],
    tips: ['Arrive early before 9:00 AM for OPD registration.'],
    coordinates: { lat: 17.3731, lng: 78.4764 }
  },

  // ==========================================
  // --- TELANGANA: KARIMNAGAR ---
  // ==========================================
  {
    id: 'off-rto-karimnagar',
    name: 'District RTO - Karimnagar',
    category: 'Transport',
    office_type: 'Regional Transport Office (RTO)',
    address: 'Collectorate Road, Near Bus Station',
    city: 'Karimnagar City',
    district: 'Karimnagar',
    state: 'Telangana',
    pincode: '505001',
    distanceKm: null,
    phone: '0878-2234567',
    workingHours: 'Mon - Fri: 10:00 AM - 5:00 PM',
    servicesHandled: [
      'New Driving Licence & Test Track',
      'Driving Licence Renewal',
      'Learner\'s Licence Test'
    ],
    tips: ['Slot booking required before visiting track.'],
    coordinates: { lat: 18.4386, lng: 79.1288 }
  },

  // ==========================================
  // --- KARNATAKA: BENGALURU ---
  // ==========================================
  {
    id: 'off-rto-koramangala-blr',
    name: 'Regional Transport Office (RTO) - Koramangala (KA-01)',
    category: 'Transport',
    office_type: 'Regional Transport Office (RTO)',
    address: 'BD A Complex, Koramangala 3rd Block',
    city: 'Koramangala',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    pincode: '560034',
    distanceKm: null,
    phone: '080-25533555',
    workingHours: 'Mon - Fri: 10:00 AM - 5:00 PM',
    servicesHandled: [
      'New Driving Licence & Test Track',
      'Driving Licence Renewal',
      'Learner\'s Licence Test',
      'Vehicle RC Transfer & Fitness'
    ],
    tips: ['Bring original DL and Aadhaar card.'],
    coordinates: { lat: 12.9352, lng: 77.6245 }
  },
  {
    id: 'off-psk-lalbagh-blr',
    name: 'Passport Seva Kendra (PSK) - Lalbagh Road',
    category: 'Identity',
    office_type: 'Passport Seva Kendra (PSK)',
    address: 'Sai Arcade, 1/1 Lalbagh Road',
    city: 'Bengaluru Central',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    pincode: '560027',
    distanceKm: null,
    phone: '1800-258-1800',
    workingHours: 'Mon - Fri: 9:00 AM - 4:30 PM',
    servicesHandled: [
      'Fresh Passport Application',
      'Passport Re-issue & Renewal',
      'Tatkaal Passport Verification'
    ],
    tips: ['Ensure physical copy of appointment receipt is present.'],
    coordinates: { lat: 12.9560, lng: 77.5890 }
  },

  // ==========================================
  // --- MAHARASHTRA: MUMBAI ---
  // ==========================================
  {
    id: 'off-rto-tardeo-mumbai',
    name: 'Regional Transport Office (RTO) - Tardeo (MH-01)',
    category: 'Transport',
    office_type: 'Regional Transport Office (RTO)',
    address: 'Near Willingdon Sports Club, Tardeo',
    city: 'South Mumbai',
    district: 'Mumbai City',
    state: 'Maharashtra',
    pincode: '400034',
    distanceKm: null,
    phone: '022-23532323',
    workingHours: 'Mon - Fri: 10:00 AM - 5:00 PM',
    servicesHandled: [
      'New Driving Licence & Test Track',
      'Driving Licence Renewal',
      'Learner\'s Licence Test'
    ],
    tips: ['Carry original vehicle documents for track verification.'],
    coordinates: { lat: 18.9722, lng: 72.8122 }
  },

  // ==========================================
  // --- DELHI NCR: NEW DELHI ---
  // ==========================================
  {
    id: 'off-rto-sarai-kale-delhi',
    name: 'Regional Transport Authority (RTA) - Sarai Kale Khan',
    category: 'Transport',
    office_type: 'Regional Transport Office (RTO)',
    address: 'ISBT Complex, Sarai Kale Khan',
    city: 'Connaught Place',
    district: 'New Delhi',
    state: 'Delhi NCR',
    pincode: '110013',
    distanceKm: null,
    phone: '011-24355555',
    workingHours: 'Mon - Fri: 10:00 AM - 5:00 PM',
    servicesHandled: [
      'New Driving Licence & Test Track',
      'Driving Licence Renewal',
      'Learner\'s Licence Test'
    ],
    tips: ['Ensure mParivahan digital profile is updated.'],
    coordinates: { lat: 28.5912, lng: 77.2580 }
  }
];

export function getOfficesForCategory(category: string): OfficeItem[] {
  const matches = OFFICIAL_OFFICES_DATA.filter(
    (off) => off.category.toLowerCase() === category.toLowerCase()
  );
  if (matches.length > 0) return matches;
  return OFFICIAL_OFFICES_DATA.slice(0, 3);
}

export function getLocalizedOfficeName(office: OfficeItem, lang: LanguageCode): string {
  if (lang === 'en') return office.name;
  if (lang === 'te') {
    if (office.category === 'Transport') return `ప్రాంతీయ రవాణా కార్యాలయం (RTO) - ${office.city}`;
    if (office.category === 'Identity') return `పాస్‌పోర్ట్ / ఆధార్ సేవా కేంద్రం - ${office.city}`;
    if (office.category === 'Certificates') return `తహసీల్దార్ & రెవెన్యూ సేవాలయం - ${office.city}`;
    return `ప్రభుత్వ సేవా కేంద్రం - ${office.name}`;
  }
  if (lang === 'hi') {
    if (office.category === 'Transport') return `क्षेत्रीय परिवहन कार्यालय (RTO) - ${office.city}`;
    if (office.category === 'Identity') return `पासपोर्ट / आधार सेवा केंद्र - ${office.city}`;
    if (office.category === 'Certificates') return `तहसीलदार एवं नागरिक सेवा केंद्र - ${office.city}`;
    return `सरकारी सेवा केंद्र - ${office.name}`;
  }
  if (lang === 'kn') {
    if (office.category === 'Transport') return `ಪ್ರಾದೇಶಿಕ ಸಾರಿಗೆ ಕಚೇರಿ (RTO) - ${office.city}`;
    if (office.category === 'Identity') return `ಪಾಸ್‌ಪೋರ್ಟ್ / ಆಧಾರ್ ಸೇವಾ ಕೇಂದ್ರ - ${office.city}`;
    if (office.category === 'Certificates') return `ತಹಸೀಲ್ದಾರ್ ಮತ್ತು ನಾಗರಿಕ ಸೇವಾ ಕೇಂದ್ರ - ${office.city}`;
    return `ಸರ್ಕಾರಿ ಸೇವಾ కేంద్రం - ${office.name}`;
  }
  return office.name;
}
