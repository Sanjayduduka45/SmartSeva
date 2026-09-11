import { DocumentItem, ServiceItem, NotificationItem } from '../types';

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'driving-license',
    title: 'Driving License',
    description: 'Renew or apply for a permanent driving license.',
    icon: 'directions_car',
    category: 'Transport',
    estCompletion: '15 mins',
    processingTime: '7-10 Days',
    eligibility: "Citizens aged 18+ with valid learner's permit.",
    benefits: [
      'Legal authorization to drive nationwide',
      'Official government identity proof',
      'Nationwide digital recognition'
    ],
    importantNotes: 'Physical verification required at nearest RTO after preparation checklist completion.',
    documentsRequired: ["Learner's License", 'Age Proof', 'Address Proof', 'Passport Photo', 'Medical Certificate']
  },
  {
    id: 'passport',
    title: 'Passport Service',
    description: 'Fresh passport application or renewal preparation.',
    icon: 'flight_takeoff',
    category: 'Identity',
    estCompletion: '20 mins',
    processingTime: '10-15 Days',
    eligibility: 'All Indian citizens with proof of identity and address.',
    benefits: [
      'International travel authorization',
      'Primary government identity proof',
      '10-year validity'
    ],
    importantNotes: 'Ensure all names on documents match exactly before visiting Passport Seva Kendra.',
    documentsRequired: ['Aadhaar Card', 'Proof of Address', 'Birth Certificate', 'Passport Photo']
  },
  {
    id: 'aadhaar-update',
    title: 'Aadhaar Update',
    description: 'Update address, mobile number, or photo records.',
    icon: 'contact_page',
    category: 'Identity',
    estCompletion: '10 mins',
    processingTime: '3-5 Days',
    eligibility: 'Existing Aadhaar cardholders requiring record updates.',
    benefits: [
      'Updated official national ID',
      'Seamless online authentication',
      'Valid address verification'
    ],
    importantNotes: 'Bring original valid supporting documents to UIDAI Kendra.',
    documentsRequired: ['Aadhaar Card', 'Updated Address Proof', 'Identity Proof']
  },
  {
    id: 'pan-card',
    title: 'PAN Card Application',
    description: 'Apply for a new Permanent Account Number.',
    icon: 'credit_card',
    category: 'Identity',
    estCompletion: '12 mins',
    processingTime: '5-7 Days',
    eligibility: 'Any individual or business entity requiring tax identification.',
    benefits: [
      'Official tax ID for financial transactions',
      'Universal identity proof',
      'Required for bank accounts'
    ],
    importantNotes: 'Form 49A required for Indian citizens.',
    documentsRequired: ['Aadhaar Card', 'Address Proof', 'Passport Photo']
  },
  {
    id: 'birth-certificate',
    title: 'Birth Certificate',
    description: 'Prepare documentation for digital birth certificate request.',
    icon: 'child_care',
    category: 'Certificates',
    estCompletion: '15 mins',
    processingTime: '3-5 Days',
    eligibility: 'Parents or adult self-requesting birth registration copy.',
    benefits: [
      'Legal proof of age and lineage',
      'Essential for school admissions and passport',
      'Permanent civic record'
    ],
    importantNotes: 'Hospital discharge certificate or institutional record recommended.',
    documentsRequired: ['Hospital Discharge Summary', 'Parents Aadhaar Card', 'Marriage Certificate']
  },
  {
    id: 'business-license',
    title: 'Business License',
    description: 'Registration and trade license preparation.',
    icon: 'storefront',
    category: 'Employment',
    estCompletion: '25 mins',
    processingTime: '7-12 Days',
    eligibility: 'Proprietors, partners, or corporate entities starting business operations.',
    benefits: [
      'Legal authorization for commercial operations',
      'Eligible for business banking accounts',
      'Government scheme eligibility'
    ],
    importantNotes: 'Commercial premise address proof is mandatory.',
    documentsRequired: ['Commercial Lease / Property Deed', 'PAN Card', 'Identity Proof of Proprietor', 'NOC from Property Owner']
  },
  {
    id: 'social-schemes',
    title: 'Social Welfare Schemes',
    description: 'Apply and verify eligibility for government welfare programs.',
    icon: 'diversity_3',
    category: 'Certificates',
    estCompletion: '15 mins',
    processingTime: '5-10 Days',
    eligibility: 'Eligible citizens based on income or demographic criteria.',
    benefits: [
      'Direct benefit transfer to bank account',
      'Subsidized healthcare and education access',
      'Civic support privileges'
    ],
    importantNotes: 'Income certificate under 1 year old required.',
    documentsRequired: ['Income Certificate', 'Aadhaar Card', 'Bank Passbook Copy', 'Domicile Certificate']
  }
];

export const INITIAL_CHECKLIST_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-aadhaar',
    title: 'Aadhaar Card',
    description: 'Valid national unique identity card.',
    required: true,
    status: 'have',
    category: 'Identity',
    notes: 'Required for identity proof'
  },
  {
    id: 'doc-address',
    title: 'Proof of Address',
    description: 'Utility bill, rent agreement, or bank statement (under 3 months old).',
    required: true,
    status: 'expired',
    category: 'Address',
    notes: 'Address proof must be less than 90 days old'
  },
  {
    id: 'doc-birth-cert',
    title: 'Birth Certificate',
    description: 'Official birth certificate issued by municipal authority.',
    required: true,
    status: 'dont_have',
    category: 'Age Proof',
    notes: 'Required for age verification'
  },
  {
    id: 'doc-photo',
    title: 'Passport Photo',
    description: 'Recent 35x45mm passport photograph with white background.',
    required: true,
    status: 'have',
    category: 'Biometric',
    notes: '2 physical copies required for submission'
  },
  {
    id: 'doc-affidavit',
    title: 'Notarized Affidavit',
    description: 'Signed affidavit verified by a registered notary public.',
    required: false,
    status: 'dont_have',
    category: 'Legal',
    notes: 'Optional unless current address differs from Aadhaar'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Document Expiry Alert',
    message: 'Your Proof of Address status is expired. Update your availability checklist.',
    time: 'Just now',
    type: 'urgent',
    unread: true,
    actionText: 'Update Checklist'
  },
  {
    id: 'notif-2',
    title: 'Preparation Progress',
    message: 'Driving License preparation checklist reached 65% completion.',
    time: '2h ago',
    type: 'info',
    unread: true
  },
  {
    id: 'notif-3',
    title: 'Checklist Reminder',
    message: 'Verify if you have your Birth Certificate before office visit.',
    time: 'Yesterday',
    type: 'reminder',
    unread: false
  }
];
