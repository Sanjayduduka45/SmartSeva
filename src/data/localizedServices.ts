import { ServiceItem, LanguageCode } from '../types';

export const SERVICE_CATEGORIES = [
  'Identity',
  'Education',
  'Transport',
  'Healthcare',
  'Banking',
  'Certificates',
  'Employment',
  'Housing'
] as const;

export const CATEGORY_TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    'Identity': 'Identity & Passports',
    'Education': 'Education & Scholarships',
    'Transport': 'Transport & Driving',
    'Healthcare': 'Healthcare & Schemes',
    'Banking': 'Banking & Financial',
    'Certificates': 'Civil Certificates',
    'Employment': 'Employment & Skill',
    'Housing': 'Housing & Property'
  },
  te: {
    'Identity': 'గుర్తింపు & పాస్‌పోర్ట్',
    'Education': 'విద్య & స్కాలర్‌షిప్‌లు',
    'Transport': 'రవాణా & డ్రైవింగ్',
    'Healthcare': 'ఆరోగ్య సంరక్షణ & పథకాలు',
    'Banking': 'బ్యాంకింగ్ & ఆర్థికం',
    'Certificates': 'పౌర ధృవీకరణ పత్రాలు',
    'Employment': 'ఉపాధి & నైపుణ్యం',
    'Housing': 'గృహనిర్మాణం & ఆస్తి'
  },
  hi: {
    'Identity': 'पहचान एवं पासपोर्ट',
    'Education': 'शिक्षा एवं छात्रवृत्ति',
    'Transport': 'परिवहन एवं ड्राइविंग',
    'Healthcare': 'स्वास्थ्य एवं योजनाएं',
    'Banking': 'बैंकिंग एवं वित्तीय',
    'Certificates': 'नागरिक प्रमाण पत्र',
    'Employment': 'रोजगार एवं कौशल',
    'Housing': 'आवास एवं संपत्ति'
  },
  kn: {
    'Identity': 'ಗುರುತು ಮತ್ತು ಪಾಸ್‌ಪೋರ್ಟ್',
    'Education': 'ಶಿಕ್ಷಣ ಮತ್ತು ವಿದ್ಯಾರ್ಥಿವೇತನ',
    'Transport': 'ಸಾರಿಗೆ ಮತ್ತು ಚಾಲನೆ',
    'Healthcare': 'ಆರೋಗ್ಯ ಸೇವೆ ಮತ್ತು ಯೋಜನೆಗಳು',
    'Banking': 'ಬ್ಯಾಂಕಿಂಗ್ ಮತ್ತು ಹಣಕಾಸು',
    'Certificates': 'ನಾಗರಿಕ ಪ್ರಮಾಣಪತ್ರಗಳು',
    'Employment': 'ಉದ್ಯೋಗ ಮತ್ತು ಕೌಶಲ್ಯ',
    'Housing': 'ವಸತಿ ಮತ್ತು ಆಸ್ತಿ'
  }
};

export const FULL_SERVICES_CATALOG: ServiceItem[] = [
  // --- IDENTITY ---
  {
    id: 'aadhaar-update',
    title: 'Aadhaar Card Update',
    description: 'Update address, mobile number, photo, or name records.',
    icon: 'contact_page',
    category: 'Identity',
    estCompletion: '10 mins',
    processingTime: '3-5 Days',
    eligibility: 'Existing Aadhaar cardholders requiring demographic or biometric record updates.',
    benefits: [
      'Official updated national identity proof',
      'Seamless online authentication & OTP services',
      'Valid proof of address for official work'
    ],
    importantNotes: 'Original supporting documents must be presented at the Aadhaar Seva Kendra.',
    documentsRequired: ['Aadhaar Card', 'Updated Address Proof', 'Identity Proof']
  },
  {
    id: 'pan-card',
    title: 'PAN Card Application',
    description: 'Apply for a new Permanent Account Number card.',
    icon: 'credit_card',
    category: 'Identity',
    estCompletion: '12 mins',
    processingTime: '5-7 Days',
    eligibility: 'Any individual requiring a Permanent Account Number for financial activities.',
    benefits: [
      'Official tax ID for financial transactions',
      'Universal identity proof recognized nationwide',
      'Mandatory for opening bank accounts & filing taxes'
    ],
    importantNotes: 'Ensure name spelling exactly matches your Aadhaar Card.',
    documentsRequired: ['Aadhaar Card', 'Address Proof', 'Passport Photo']
  },
  {
    id: 'pan-correction',
    title: 'PAN Card Correction',
    description: 'Correction of name, date of birth, or photograph on existing PAN.',
    icon: 'edit_note',
    category: 'Identity',
    estCompletion: '12 mins',
    processingTime: '7-10 Days',
    eligibility: 'Existing PAN cardholders with discrepancies in official details.',
    benefits: [
      'Corrected tax identification record',
      'Seamless link with bank accounts & Aadhaar',
      'Official verified physical card reissue'
    ],
    importantNotes: 'Proof of correct details matching Aadhaar Card is mandatory.',
    documentsRequired: ['Existing PAN Card Copy', 'Aadhaar Card', 'Correct Proof of Name/DOB']
  },
  {
    id: 'voter-id',
    title: 'Voter ID Card (Form 6)',
    description: 'Apply for fresh electoral registration card.',
    icon: 'how_to_vote',
    category: 'Identity',
    estCompletion: '15 mins',
    processingTime: '15-20 Days',
    eligibility: 'Indian citizens aged 18 years or above.',
    benefits: [
      'Official voting rights in national and state elections',
      'Standard government address and identity proof',
      'Digital voter slip generation'
    ],
    importantNotes: 'Must reside in the electoral constituency applied for.',
    documentsRequired: ['Proof of Age', 'Proof of Address', 'Passport Photo']
  },
  {
    id: 'passport',
    title: 'Passport Application',
    description: 'Fresh passport or re-issue application preparation.',
    icon: 'flight_takeoff',
    category: 'Identity',
    estCompletion: '20 mins',
    processingTime: '10-15 Days',
    eligibility: 'All Indian citizens with proof of identity, age, and address.',
    benefits: [
      'Official international travel authorization',
      'Primary government identity credential',
      '10-year validity for adults'
    ],
    importantNotes: 'Ensure all names across documents match identically before Passport Seva Kendra visit.',
    documentsRequired: ['Aadhaar Card', 'Proof of Address', 'Birth Certificate / Class 10 Certificate', 'Passport Photo']
  },

  // --- EDUCATION ---
  {
    id: 'scholarship-application',
    title: 'Government Scholarship Application',
    description: 'Pre-matric, post-matric, and merit scholarship preparation.',
    icon: 'school',
    category: 'Education',
    estCompletion: '15 mins',
    processingTime: '15-30 Days',
    eligibility: 'Eligible students enrolled in recognized educational institutions meeting income criteria.',
    benefits: [
      'Direct benefit tuition fee reimbursement',
      'Maintenance allowance directly credited to bank account',
      'State & central education welfare grants'
    ],
    importantNotes: 'Valid income certificate issued in current financial year is mandatory.',
    documentsRequired: ['Income Certificate', 'Caste Certificate', 'Previous Marksheet', 'Student Bank Passbook', 'Aadhaar Card']
  },
  {
    id: 'bonafide-certificate',
    title: 'Bonafide Student Certificate',
    description: 'Preparation checklist for institutional student verification.',
    icon: 'workspace_premium',
    category: 'Education',
    estCompletion: '10 mins',
    processingTime: '2-3 Days',
    eligibility: 'Currently enrolled students in school, college, or university.',
    benefits: [
      'Official proof of current student status',
      'Required for bus pass, concessions & passports',
      'Valid document for educational loans'
    ],
    importantNotes: 'Issued by head of educational institution or college administration desk.',
    documentsRequired: ['Student ID Card', 'Fee Receipt', 'Aadhaar Card']
  },
  {
    id: 'transfer-certificate',
    title: 'Transfer Certificate (TC)',
    description: 'School or college transfer certificate issuance preparation.',
    icon: 'history_edu',
    category: 'Education',
    estCompletion: '10 mins',
    processingTime: '3-5 Days',
    eligibility: 'Students completing or transferring from an educational institution.',
    benefits: [
      'Mandatory document for admission to higher institutions',
      'Official record of academic conduct and attendance',
      'Verifiable institutional migration record'
    ],
    importantNotes: 'All library books and tuition fee dues must be cleared before requesting TC.',
    documentsRequired: ['No Dues Certificate', 'Student ID Card', 'Parent Aadhaar Card']
  },
  {
    id: 'educational-marksheet',
    title: 'Duplicate Marksheet / Degree Copy',
    description: 'Re-issuance request for lost or damaged educational certificates.',
    icon: 'description',
    category: 'Education',
    estCompletion: '15 mins',
    processingTime: '10-15 Days',
    eligibility: 'Students who completed board exams or university degrees.',
    benefits: [
      'Official replacement degree or marksheet',
      'Verifiable educational qualification copy',
      'Required for employment & higher studies'
    ],
    importantNotes: 'Police FIR copy required if original certificate was stolen or lost.',
    documentsRequired: ['Identity Proof', 'Affidavit for Lost Marksheet', 'Previous Roll Number Details']
  },
  {
    id: 'student-concession',
    title: 'Student Travel Pass / Concession',
    description: 'Apply for subsidized student bus and metro transit pass.',
    icon: 'directions_bus',
    category: 'Education',
    estCompletion: '10 mins',
    processingTime: '3-5 Days',
    eligibility: 'Full-time students attending recognized schools or colleges.',
    benefits: [
      'Subsidized daily transit pass for study commute',
      'Valid across state transport bus services',
      'Reduced educational travel expenses'
    ],
    importantNotes: 'Institutional seal and signature required on application form.',
    documentsRequired: ['Bonafide Certificate', 'Student ID Card', 'Passport Photo']
  },

  // --- TRANSPORT ---
  {
    id: 'driving-license',
    title: 'New Driving Licence',
    description: 'Apply for permanent driving licence after learner period.',
    icon: 'directions_car',
    category: 'Transport',
    estCompletion: '15 mins',
    processingTime: '7-10 Days',
    eligibility: 'Citizens aged 18+ holding a valid learner\'s licence for at least 30 days.',
    benefits: [
      'Legal authorization to drive vehicles nationwide',
      'Official government identity card',
      'Digital storage support in mParivahan'
    ],
    importantNotes: 'Slot booking at local RTO required for driving track test.',
    documentsRequired: ['Learner\'s Licence', 'Age Proof', 'Address Proof', 'Passport Photo', 'Medical Certificate (Form 1A)']
  },
  {
    id: 'dl-renewal',
    title: 'Driving Licence Renewal',
    description: 'Renewal of expired or expiring driving licence.',
    icon: 'autorenew',
    category: 'Transport',
    estCompletion: '12 mins',
    processingTime: '5-7 Days',
    eligibility: 'Driving licence holders within 1 year before or after expiry date.',
    benefits: [
      'Continued driving authorization without penalty',
      'Updated photo and current address records',
      'Valid nationwide'
    ],
    importantNotes: 'Applicants above 40 years must submit a signed Medical Certificate.',
    documentsRequired: ['Original Driving Licence', 'Medical Certificate (Form 1A for 40+)', 'Address Proof', 'Passport Photo']
  },
  {
    id: 'learners-license',
    title: 'Learner\'s Licence (LL)',
    description: 'Apply for initial provisional driving permit.',
    icon: 'badge',
    category: 'Transport',
    estCompletion: '15 mins',
    processingTime: '1-2 Days',
    eligibility: 'Citizens aged 18+ (16+ for gearless 50cc two-wheelers).',
    benefits: [
      'Provisional permission to practice driving with instructor',
      'Valid for 6 months across India',
      'Mandatory prerequisite for permanent DL'
    ],
    importantNotes: 'Online or offline RTO test on traffic rules must be cleared.',
    documentsRequired: ['Proof of Age', 'Proof of Address', 'Passport Photo', 'Self-Declaration Form 1']
  },
  {
    id: 'rc-transfer',
    title: 'Vehicle Registration Certificate (RC)',
    description: 'RC transfer, duplicate RC, or address change preparation.',
    icon: 'minor_crash',
    category: 'Transport',
    estCompletion: '15 mins',
    processingTime: '10-15 Days',
    eligibility: 'Vehicle owners or buyers transferring motor vehicle ownership.',
    benefits: [
      'Legal ownership title over motor vehicle',
      'Compliant vehicle insurance & pollution records',
      'Official state RTO registry record'
    ],
    importantNotes: 'Valid Pollution Under Control (PUC) certificate and Insurance are mandatory.',
    documentsRequired: ['Original RC Book', 'Valid Vehicle Insurance', 'PUC Certificate', 'Identity Proof', 'Form 29 & 30']
  },

  // --- HEALTHCARE ---
  {
    id: 'ayushman-card',
    title: 'Ayushman Bharat Health Card',
    description: 'Apply for government health insurance card for medical coverage.',
    icon: 'health_and_safety',
    category: 'Healthcare',
    estCompletion: '12 mins',
    processingTime: '3-5 Days',
    eligibility: 'Families listed under SECC database or eligible state welfare schemes.',
    benefits: [
      'Cashless health cover up to ₹5 Lakh per family per year',
      'Secondary & tertiary hospital care coverage',
      'Empaneled public & private hospitals network'
    ],
    importantNotes: 'E-KYC verification requires Aadhaar linked mobile number.',
    documentsRequired: ['Aadhaar Card', 'Ration Card / Family Listing', 'Mobile Number']
  },
  {
    id: 'medical-certificate',
    title: 'Government Medical Certificate',
    description: 'Preparation for official fitness or sickness medical certificate.',
    icon: 'medical_services',
    category: 'Healthcare',
    estCompletion: '10 mins',
    processingTime: '1-2 Days',
    eligibility: 'Citizens requiring medical fitness certification for jobs, DL, or leaves.',
    benefits: [
      'Official government doctor certified health record',
      'Accepted by RTO, employers, and educational boards',
      'Legal medical evidence'
    ],
    importantNotes: 'Issued after physical examination by a registered government medical officer.',
    documentsRequired: ['Identity Proof', 'Passport Photo', 'Official Request / Form']
  },
  {
    id: 'disability-certificate',
    title: 'Disability Certificate & UDID Card',
    description: 'Apply for Unique Disability ID card and welfare certificate.',
    icon: 'accessible',
    category: 'Healthcare',
    estCompletion: '20 mins',
    processingTime: '15-20 Days',
    eligibility: 'Persons with benchmark disability certified by medical board.',
    benefits: [
      'Single document for all disability benefits across India',
      'Subsidized transport, equipment, and education benefits',
      'Government job reservations & financial assistance'
    ],
    importantNotes: 'Medical assessment conducted at designated district hospital.',
    documentsRequired: ['Aadhaar Card', 'Recent Passport Photo', 'Medical Assessment Report']
  },

  // --- BANKING ---
  {
    id: 'jandhan-account',
    title: 'Jan Dhan Bank Account',
    description: 'Zero balance basic financial savings account opening preparation.',
    icon: 'account_balance',
    category: 'Banking',
    estCompletion: '10 mins',
    processingTime: '1-2 Days',
    eligibility: 'Any citizen who does not hold a basic savings bank account.',
    benefits: [
      'Zero minimum balance requirement',
      'Free RuPay debit card with built-in accident insurance',
      'Direct Benefit Transfer (DBT) government scheme compatibility'
    ],
    importantNotes: 'Available at any nationalized bank branch or Business Correspondent outlet.',
    documentsRequired: ['Aadhaar Card', 'Passport Photo', 'Mobile Number']
  },
  {
    id: 'pension-scheme',
    title: 'Government Pension Scheme (PM-SYM / APY)',
    description: 'Enrollment in social security pension schemes for unorganized workers.',
    icon: 'savings',
    category: 'Banking',
    estCompletion: '12 mins',
    processingTime: '3-5 Days',
    eligibility: 'Citizens aged 18 to 40 years with monthly income under ₹15,000.',
    benefits: [
      'Fixed monthly pension after age 60',
      'Co-contribution options for eligible subscribers',
      'Financial security for family'
    ],
    importantNotes: 'Savings bank account and auto-debit consent required.',
    documentsRequired: ['Aadhaar Card', 'Bank Savings Account Passbook', 'Mobile Number']
  },
  {
    id: 'aadhaar-dbt-link',
    title: 'Aadhaar Bank Linkage (DBT Status)',
    description: 'Link Aadhaar with bank account for direct welfare payments.',
    icon: 'link',
    category: 'Banking',
    estCompletion: '10 mins',
    processingTime: '2-3 Days',
    eligibility: 'Bank account holders receiving government subsidies.',
    benefits: [
      'Direct credit of scholarships, LPG, and welfare payments',
      'Prevents subsidy payment delays',
      'Verifiable NPCI mapper status'
    ],
    importantNotes: 'Requires submitting Aadhaar seeding consent form at home bank branch.',
    documentsRequired: ['Aadhaar Card', 'Bank Passbook Copy', 'Seeding Consent Form']
  },

  // --- CERTIFICATES ---
  {
    id: 'income-certificate',
    title: 'Income Certificate',
    description: 'Official certificate for annual family income proof.',
    icon: 'payments',
    category: 'Certificates',
    estCompletion: '15 mins',
    processingTime: '7-10 Days',
    eligibility: 'Resident citizens applying for subsidies, fee waivers, or scholarships.',
    benefits: [
      'Essential for college fee reimbursements & scholarships',
      'Proof of eligibility for housing and welfare programs',
      'Valid for 1 financial year'
    ],
    importantNotes: 'Verification conducted by Village Revenue Officer (VRO) / Tahsildar.',
    documentsRequired: ['Aadhaar Card', 'Ration Card / Salary Slip', 'Self-Declaration Affidavit', 'Property/Tax Proof']
  },
  {
    id: 'caste-certificate',
    title: 'Caste & Community Certificate',
    description: 'Official social category community certificate.',
    icon: 'groups',
    category: 'Certificates',
    estCompletion: '15 mins',
    processingTime: '10-15 Days',
    eligibility: 'Citizens belonging to reserved categories (SC/ST/OBC/BC).',
    benefits: [
      'Required for educational admissions under reservation quota',
      'Government job recruitment age relaxations & reservations',
      'Eligibility for state welfare & loan schemes'
    ],
    importantNotes: 'Blood relative caste certificate copy accelerates verification.',
    documentsRequired: ['Aadhaar Card', 'Father/Relative Caste Certificate', 'School Leaving Certificate', 'Ration Card']
  },
  {
    id: 'residence-certificate',
    title: 'Residence / Domicile Certificate',
    description: 'Proof of continuous residence in the state or district.',
    icon: 'home_pin',
    category: 'Certificates',
    estCompletion: '12 mins',
    processingTime: '5-7 Days',
    eligibility: 'Citizens living in the state for the minimum required tenure (usually 3+ years).',
    benefits: [
      'Mandatory for state quota seats in higher education',
      'State government recruitment eligibility',
      'Official proof of local residence'
    ],
    importantNotes: 'Utility bills or school records covering past residency years required.',
    documentsRequired: ['Aadhaar Card', 'Electricity / Water Bill', 'Property Tax Receipt or School Study Certificate']
  },
  {
    id: 'birth-certificate',
    title: 'Birth Certificate',
    description: 'Official birth registration copy from municipal authority.',
    icon: 'child_care',
    category: 'Certificates',
    estCompletion: '15 mins',
    processingTime: '3-5 Days',
    eligibility: 'Parents registering newborn birth or adult requesting digital copy.',
    benefits: [
      'Primary legal proof of age and lineage',
      'Mandatory for school admission, passport, and voter registration',
      'Permanent civic record'
    ],
    importantNotes: 'Hospital discharge summary or institutional report accelerates registration.',
    documentsRequired: ['Hospital Discharge Summary', 'Parents Aadhaar Card', 'Marriage Certificate']
  },
  {
    id: 'death-certificate',
    title: 'Death Certificate',
    description: 'Official civil death registration certificate copy.',
    icon: 'badge',
    category: 'Certificates',
    estCompletion: '15 mins',
    processingTime: '3-5 Days',
    eligibility: 'Family members or legally authorized representatives.',
    benefits: [
      'Required for bank account settlement & insurance claims',
      'Property inheritance & title transfer',
      'Official civil record'
    ],
    importantNotes: 'Doctor medical cause of death report or hospital note required.',
    documentsRequired: ['Doctor Medical Attestation', 'Deceased Aadhaar Card', 'Applicant Identity Proof']
  },

  // --- EMPLOYMENT ---
  {
    id: 'employment-registration',
    title: 'Employment Exchange Registration',
    description: 'Register in state employment bank for job notifications.',
    icon: 'work',
    category: 'Employment',
    estCompletion: '12 mins',
    processingTime: '2-3 Days',
    eligibility: 'Unemployed citizens aged 18+ seeking job opportunities.',
    benefits: [
      'Seniority index for state government job notifications',
      'Free skill training program invitations',
      'Unemployment allowance eligibility where applicable'
    ],
    importantNotes: 'Educational qualifications certificates must be uploaded accurately.',
    documentsRequired: ['Aadhaar Card', 'Educational Marksheets', 'Caste Certificate', 'Passport Photo']
  },
  {
    id: 'business-license',
    title: 'Trade & Business Licence',
    description: 'Municipal trade license for commercial establishment.',
    icon: 'storefront',
    category: 'Employment',
    estCompletion: '20 mins',
    processingTime: '7-10 Days',
    eligibility: 'Proprietors, traders, or companies operating commercial shops or offices.',
    benefits: [
      'Legal authorization to run commercial premises',
      'Required for commercial bank account & GST registration',
      'Eligible for government MSME support schemes'
    ],
    importantNotes: 'Property ownership deed or valid rental lease agreement is mandatory.',
    documentsRequired: ['Commercial Premises Lease/Deed', 'Owner Identity Proof', 'NOC from Property Owner', 'PAN Card']
  },
  {
    id: 'eshram-card',
    title: 'e-Shram Unorganized Worker Card',
    description: 'Social security registration card for informal sector workers.',
    icon: 'Engineering',
    category: 'Employment',
    estCompletion: '10 mins',
    processingTime: 'Instant / 1-2 Days',
    eligibility: 'Unorganized workers aged 16-59 years not covered by EPF/ESIC.',
    benefits: [
      'Universal 12-digit UAN number recognized nationwide',
      'Accidental insurance coverage under PMBY',
      'Priority in social security welfare schemes'
    ],
    importantNotes: 'Aadhaar linked active mobile number required for OTP registration.',
    documentsRequired: ['Aadhaar Card', 'Bank Account Passbook', 'Active Mobile Number']
  },

  // --- HOUSING ---
  {
    id: 'pmay-housing',
    title: 'PMAY Housing Scheme Application',
    description: 'Application checklist for affordable housing scheme subsidy.',
    icon: 'holiday_village',
    category: 'Housing',
    estCompletion: '20 mins',
    processingTime: '30-60 Days',
    eligibility: 'Families who do not own a pucca house anywhere in India and meet income limits.',
    benefits: [
      'Credit linked interest subsidy on home loans',
      'Financial assistance for home construction or enhancement',
      'Secure tenure and housing rights'
    ],
    importantNotes: 'Female family member ownership or co-ownership required for key categories.',
    documentsRequired: ['Aadhaar Card of all family members', 'Income Certificate', 'Bank Passbook Copy', 'Land / Property Documents']
  },
  {
    id: 'property-tax-khata',
    title: 'Property Tax & Khata Certificate',
    description: 'Obtain civic property tax assessment and ownership record.',
    icon: 'real_estate_agent',
    category: 'Housing',
    estCompletion: '15 mins',
    processingTime: '7-12 Days',
    eligibility: 'Property owners within municipal boundaries.',
    benefits: [
      'Official municipal record of property ownership',
      'Mandatory for building sanction plans & property sales',
      'Accepted as address proof for loans'
    ],
    importantNotes: 'Up-to-date property tax payment receipt is required.',
    documentsRequired: ['Sale Deed / Title Deed', 'Latest Property Tax Receipt', 'Owner Identity Proof']
  }
];

// Helper to get localized service text dynamically
export function getLocalizedService(service: ServiceItem, lang: LanguageCode): ServiceItem {
  if (lang === 'en') return service;

  const dictionary = SERVICE_LOCALIZATIONS[service.id]?.[lang];
  if (!dictionary) return service;

  return {
    ...service,
    title: dictionary.title || service.title,
    description: dictionary.description || service.description,
    category: CATEGORY_TRANSLATIONS[lang][service.category] || service.category,
    processingTime: dictionary.processingTime || service.processingTime,
    eligibility: dictionary.eligibility || service.eligibility,
    importantNotes: dictionary.importantNotes || service.importantNotes,
    benefits: dictionary.benefits || service.benefits,
    documentsRequired: dictionary.documentsRequired || service.documentsRequired
  };
}

// Translations dictionary for individual services
const SERVICE_LOCALIZATIONS: Record<string, Partial<Record<LanguageCode, Partial<ServiceItem>>>> = {
  'aadhaar-update': {
    te: {
      title: 'ఆధార్ కార్డ్ నవీకరణ',
      description: 'చిరునామా, మొబైల్ సంఖ్య, ఫోటో లేదా పేరు వివరాలను నవీకరించండి.',
      processingTime: '3-5 రోజులు',
      eligibility: 'డెమోగ్రాఫిక్ లేదా బయోమెట్రిక్ రికార్డుల మార్పులు అవసరమైన ఆధార్ కార్డ్ హోల్డర్లు.',
      benefits: [
        'అధికారికంగా నవీకరించబడిన జాతీయ గుర్తింపు రుజువు',
        'సులభమైన ఆన్‌లైన్ ప్రామాణీకరణ & OTP సేవలు',
        'అధికారిక పనుల కోసం చెల్లుబాటు అయ్యే చిరునామా రుజువు'
      ],
      importantNotes: 'ఆధార్ సేవా కేంద్రం వద్ద అసలు సహాయక పత్రాలను సమర్పించాలి.',
      documentsRequired: ['ఆధార్ కార్డ్', 'నవీకరించబడిన చిరునామా రుజువు', 'గుర్తింపు రుజువు']
    },
    hi: {
      title: 'आधार कार्ड अपडेट',
      description: 'पता, मोबाइल नंबर, फोटो या नाम रिकॉर्ड अपडेट करें।',
      processingTime: '3-5 दिन',
      eligibility: 'सत्यापित विवरण अपडेट की आवश्यकता वाले मौजूदा आधार कार्ड धारक।',
      benefits: [
        'आधिकारिक अद्यतन राष्ट्रीय पहचान प्रमाण',
        'निर्बाध ऑनलाइन प्रमाणीकरण और ओटीपी सेवाएं',
        'आधिकारिक कार्यों के लिए मान्य पते का प्रमाण'
      ],
      importantNotes: 'आधार सेवा केंद्र में मूल सहायक दस्तावेज प्रस्तुत करना अनिवार्य है।',
      documentsRequired: ['आधार कार्ड', 'अद्यतन पता प्रमाण', 'पहचान प्रमाण']
    },
    kn: {
      title: 'ಆಧಾರ್ ಕಾರ್ಡ್ ನವೀಕರಣ',
      description: 'ವಿಳಾಸ, ಮೊಬೈಲ್ ಸಂಖ್ಯೆ, ಫೋಟೋ ಅಥವಾ ಹೆಸರು ನವೀಕರಿಸಿ.',
      processingTime: '3-5 ದಿನಗಳು',
      eligibility: 'ವಿವರಗಳ ನವೀಕರಣ ಅಗತ್ಯವಿರುವ ಆಧಾರ್ ಕಾರ್ಡ್‌ದಾರರು.',
      benefits: [
        'ಅಧಿಕೃತ ನವೀಕರಿಸಿದ ರಾಷ್ಟ್ರೀಯ ಗುರುತಿನ ಚೀಟಿ',
        'ಆನ್‌ಲೈನ್ ದೃಢೀಕರಣ ಮತ್ತು ಒಟಿಪಿ ಸೇವೆಗಳು',
        'ಅಧಿಕೃತ ಕೆಲಸಕ್ಕೆ ಮಾನ್ಯ ವಿಳಾಸ ಪುರಾವೆ'
      ],
      importantNotes: 'ಆಧಾರ್ ಸೇವಾ ಕೇಂದ್ರದಲ್ಲಿ ಮೂಲ ದಾಖಲೆಗಳನ್ನು ಸಲ್ಲಿಸಬೇಕು.',
      documentsRequired: ['ಆಧಾರ್ ಕಾರ್ಡ್', 'ನವೀಕರಿಸಿದ ವಿಳಾಸ ಪುರಾವೆ', 'ಗುರುತಿನ ಪುರಾವೆ']
    }
  },

  'driving-license': {
    te: {
      title: 'కొత్త డ్రైవింగ్ లైసెన్స్',
      description: 'లర్నర్ లైసెన్స్ గడువు ముగిసిన తర్వాత శాశ్వత డ్రైవింగ్ లైసెన్స్ పొందండి.',
      processingTime: '7-10 రోజులు',
      eligibility: 'చెల్లుబాటు అయ్యే లర్నర్ లైసెన్స్ కలిగి ఉన్న 18+ సంవత్సరాల పౌరులు.',
      benefits: [
        'దేశవ్యాప్తంగా వాహనం నడపడానికి చట్టపరమైన అనుమతి',
        'అధికారిక ప్రభుత్వ గుర్తింపు కార్డు',
        'mParivahan లో డిజిటల్ నిల్వ మద్దతు'
      ],
      importantNotes: 'డ్రైవింగ్ ట్రాక్ టెస్ట్ కోసం స్థానిక RTO వద్ద స్లాట్ బుక్ చేసుకోవాలి.',
      documentsRequired: ['లర్నర్ లైసెన్స్', 'వయస్సు రుజువు', 'చిరునామా రుజువు', 'పాస్‌పోర్ట్ ఫోటో', 'మెడికల్ సర్టిఫికేట్ (ఫారమ్ 1A)']
    },
    hi: {
      title: 'नया ड्राइविंग लाइसेंस',
      description: 'लर्नर लाइसेंस अवधि के बाद स्थायी ड्राइविंग लाइसेंस के लिए आवेदन करें।',
      processingTime: '7-10 दिन',
      eligibility: '18 वर्ष से अधिक आयु के नागरिक जिनके पास वैध लर्नर लाइसेंस है।',
      benefits: [
        'देश भर में वाहन चलाने का कानूनी अधिकार',
        'आधिकारिक सरकारी पहचान पत्र',
        'mParivahan में डिजिटल स्टोरेज सुविधा'
      ],
      importantNotes: 'ड्राइविंग टेस्ट के लिए स्थानीय आरटीओ में स्लॉट बुक करना आवश्यक है।',
      documentsRequired: ['लर्नर लाइसेंस', 'आयु प्रमाण', 'पता प्रमाण', 'पासपोर्ट फोटो', 'मेडिकल सर्टिफिकेट']
    },
    kn: {
      title: 'ಹೊಸ ಚಾಲನಾ ಪರವಾನಗಿ',
      description: 'ಲರ್ನರ್ ಪರವಾನಗಿ ಅವಧಿಯ ನಂತರ ಕಾಯಂ ಚಾಲನಾ ಪರವಾನಗಿಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ.',
      processingTime: '7-10 ದಿನಗಳು',
      eligibility: 'ಮಾನ್ಯ ಲರ್ನರ್ ಪರವಾನಗಿ ಹೊಂದಿರುವ 18+ ವರ್ಷದ ನಾಗರಿಕರು.',
      benefits: [
        'ದೇಶಾದ್ಯಂತ ವಾಹನ ಚಲಾಯಿಸಲು ಕಾನೂನುಬದ್ಧ ಅನುಮತಿ',
        'ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಗುರುತಿನ ಚೀಟಿ',
        'mParivahan ನಲ್ಲಿ ಡಿಜಿಟಲ್ ಬೆಂಬಲ'
      ],
      importantNotes: 'ಚಾಲನಾ ಪರೀಕ್ಷೆಗಾಗಿ ಸ್ಥಳೀಯ RTO ನಲ್ಲಿ ಸ್ಲಾಟ್ ಬುಕ್ ಮಾಡಬೇಕು.',
      documentsRequired: ['ಲರ್ನರ್ ಪರವಾನಗಿ', 'ವಯಸ್ಸಿನ ಪುರಾವೆ', 'ವಿಳಾಸ ಪುರಾವೆ', 'ಪಾಸ್‌ಪೋರ್ಟ್ ಫೋಟೋ', 'ವೈದ್ಯಕೀಯ ಪ್ರಮಾಣಪತ್ರ']
    }
  },

  'passport': {
    te: {
      title: 'పాస్‌పోర్ట్ దరఖాస్తు',
      description: 'కొత్త పాస్‌పోర్ట్ లేదా రీ-ఇష్యూ దరఖాస్తు తయారీ.',
      processingTime: '10-15 రోజులు',
      eligibility: 'గుర్తింపు, వయస్సు మరియు చిరునామా రుజువు ఉన్న భారతీయ పౌరులు.',
      benefits: [
        'అంతర్జాతీయ ప్రయాణానికి అధికారిక అనుమతి',
        'ప్రధాన ప్రభుత్వ గుర్తింపు పత్రం',
        '10 సంవత్సరాల చెల్లుబాటు'
      ],
      importantNotes: 'పాస్‌పోర్ట్ సేవా కేంద్రం సందర్శనకు ముందు అన్ని పత్రాలలో పేర్లు ఒకేలా ఉండాలి.',
      documentsRequired: ['ఆధార్ కార్డ్', 'చిరునామా రుజువు', 'బర్త్ సర్టిఫికేట్ / 10వ తరగతి మార్కుల జాబితా', 'పాస్‌పోర్ట్ ఫోటో']
    },
    hi: {
      title: 'पासपोर्ट आवेदन',
      description: 'नए पासपोर्ट या पुनर्निरगम आवेदन की तैयारी।',
      processingTime: '10-15 दिन',
      eligibility: 'पहचान, आयु और पते के प्रमाण वाले भारतीय नागरिक।',
      benefits: [
        'अंतर्राष्ट्रीय यात्रा का आधिकारिक अधिकार',
        'प्राथमिक सरकारी पहचान पत्र',
        '10 वर्ष की वैधता'
      ],
      importantNotes: 'पासपोर्ट सेवा केंद्र जाने से पहले सुनिश्चित करें कि सभी दस्तावेजों में नाम समान हैं।',
      documentsRequired: ['आधार कार्ड', 'पता प्रमाण', 'जन्म प्रमाण पत्र', 'पासपोर्ट फोटो']
    },
    kn: {
      title: 'ಪಾಸ್‌ಪೋರ್ಟ್ ಅರ್ಜಿ',
      description: 'ಹೊಸ ಪಾಸ್‌ಪೋರ್ಟ್ ಅಥವಾ ಮರು-ನೀಡುವಿಕೆ ಅರ್ಜಿ ಸಿದ್ಧತೆ.',
      processingTime: '10-15 ದಿನಗಳು',
      eligibility: 'ಗುರುತು, ವಯಸ್ಸು ಮತ್ತು ವಿಳಾಸದ ಪುರಾವೆ ಹೊಂದಿರುವ ಭಾರತೀಯ ನಾಗರಿಕರು.',
      benefits: [
        'ಅಂತರರಾಷ್ಟ್ರೀಯ ಪ್ರಯಾಣಕ್ಕೆ ಅಧಿಕೃತ ಅನುಮತಿ',
        'ಮುಖ್ಯ ಸರ್ಕಾರಿ ಗುರುತಿನ ಚೀಟಿ',
        '10 ವರ್ಷಗಳ ಮಾನ್ಯತೆ'
      ],
      importantNotes: 'ಪಾಸ್‌ಪೋರ್ಟ್ ಸೇವಾ ಕೇಂದ್ರಕ್ಕೆ ಭೇಟಿ ನೀಡುವ ಮುನ್ನ ಎಲ್ಲ ದಾಖಲೆಗಳಲ್ಲಿ ಹೆಸರುಗಳು ಒಂದೇ ಆಗಿರಬೇಕು.',
      documentsRequired: ['ಆಧಾರ್ ಕಾರ್ಡ್', 'ವಿಳಾಸ ಪುರಾವೆ', 'ಜನನ ಪ್ರಮಾಣಪತ್ರ', 'ಪಾಸ್‌ಪೋರ್ಟ್ ಫೋಟೋ']
    }
  },

  'income-certificate': {
    te: {
      title: 'ఆదాయ ధృవీకరణ పత్రం (Income Certificate)',
      description: 'వార్షిక కుటుంబ ఆదాయ నిరూపణకు అధికారిక పత్రం.',
      processingTime: '7-10 రోజులు',
      eligibility: 'సబ్సిడీలు, ఫీజు మినహాయింపులు లేదా స్కాలర్‌షిప్‌ల కోసం దరఖాస్తు చేసుకునే పౌరులు.',
      benefits: [
        'కాలేజీ ఫీజు రీయింబర్స్‌మెంట్ & స్కాలర్‌షిప్‌లకు అత్యవసరం',
        'గృహనిర్మాణం మరియు సంక్షేమ పథకాలకు అర్హత రుజువు',
        '1 ఆర్థిక సంవత్సరానికి చెల్లుబాటు అవుతుంది'
      ],
      importantNotes: 'గ్రామ రెవెన్యూ అధికారి (VRO) / తహసీల్దార్ ద్వారా పరిశీలన జరుగుతుంది.',
      documentsRequired: ['ఆధార్ కార్డ్', 'రేషన్ కార్డ్ / జీతం రసీదు', 'స్వయం ప్రకటన అఫిడవిట్', 'ఆస్తి/పన్ను రుజువు']
    },
    hi: {
      title: 'आय प्रमाण पत्र (Income Certificate)',
      description: 'वार्षिक पारिवारिक आय प्रमाण के लिए आधिकारिक प्रमाण पत्र।',
      processingTime: '7-10 दिन',
      eligibility: 'छात्रवृत्ति या सरकारी योजनाओं के लिए आवेदन करने वाले नागरिक।',
      benefits: [
        'कॉलेज शुल्क प्रतिपूर्ति और छात्रवृत्ति के लिए आवश्यक',
        'आवास और कल्याणकारी योजनाओं की पात्रता',
        '1 वित्तीय वर्ष के लिए मान्य'
      ],
      importantNotes: 'तहसीलदार या राजस्व अधिकारी द्वारा सत्यापन किया जाता है।',
      documentsRequired: ['आधार कार्ड', 'राशन कार्ड / वेतन पर्ची', 'स्व-घोषणा पत्र']
    },
    kn: {
      title: 'ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ (Income Certificate)',
      description: 'ವಾರ್ಷಿಕ ಕೌಟುಂಬಿಕ ಆದಾಯದ ಪುರಾವೆಗಾಗಿ ಅಧಿಕೃತ ಪ್ರಮಾಣಪತ್ರ.',
      processingTime: '7-10 ದಿನಗಳು',
      eligibility: 'ವಿದ್ಯಾರ್ಥಿವೇತನ ಮತ್ತು ಸರ್ಕಾರಿ ಸೌಲಭ್ಯಗಳಿಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ನಾಗರಿಕರು.',
      benefits: [
        'ಶುಲ್ಕ ಮರುಪಾವತಿ ಮತ್ತು ವಿದ್ಯಾರ್ಥಿವೇತನಕ್ಕೆ ಅಗತ್ಯ',
        'ವಸತಿ ಮತ್ತು ಕಲ್ಯಾಣ ಯೋಜನೆಗಳ ಅರ್ಹತೆ',
        '1 ಹಣಕಾಸು ವರ್ಷಕ್ಕೆ ಮಾನ್ಯ'
      ],
      importantNotes: 'ತಹಸೀಲ್ದಾರ್ / ಕಂದಾಯ ಅಧಿಕಾರಿಯಿಂದ ಪರಿಶೀಲನೆ ನಡೆಸಲಾಗುತ್ತದೆ.',
      documentsRequired: ['ಆಧಾರ್ ಕಾರ್ಡ್', 'ರೇಷನ್ ಕಾರ್ಡ್ / ವೇತನ ಚೀಟಿ', 'ಸ್ವಯಂ ಘೋಷಣಾ ಪತ್ರ']
    }
  }
};
