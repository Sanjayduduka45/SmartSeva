import { DocumentItem, DocumentStatus, ServiceItem } from '../types';

interface DocumentMetadata {
  description: string;
  category: string;
  notes: string;
  required?: boolean;
}

const DOCUMENT_METADATA_REGISTRY: Record<string, DocumentMetadata> = {
  "aadhaar card": {
    description: "Valid unique identity card issued by UIDAI.",
    category: "Identity Proof",
    notes: "Original card, DigiLocker verified copy, or printed e-Aadhaar accepted."
  },
  "aadhaar card of all family members": {
    description: "UIDAI Aadhaar cards for every family member listed in application.",
    category: "Identity Proof",
    notes: "Original cards must be verified at the civic center or local office."
  },
  "parents aadhaar card": {
    description: "UIDAI Aadhaar cards of both biological parents.",
    category: "Parent Identity",
    notes: "Both parents' original Aadhaar cards needed for child record verification."
  },
  "learner's licence": {
    description: "Valid driving learner's permit issued at least 30 days prior to practical test.",
    category: "Driving Permit",
    notes: "Must be valid and issued under Ministry of Road Transport & Highways (Parivahan)."
  },
  "original driving licence": {
    description: "Existing physical smart card driving licence card.",
    category: "Driving Permit",
    notes: "Must be surrendered or physically inspected at the RTO counter."
  },
  "medical certificate (form 1a)": {
    description: "Medical fitness certificate signed by an authorized registered MBBS doctor.",
    category: "Medical Proof",
    notes: "Mandatory for applicants aged 40+ or those applying for commercial/transport endorsement."
  },
  "medical certificate (form 1a for 40+)": {
    description: "Medical fitness certificate signed by an authorized registered MBBS doctor.",
    category: "Medical Proof",
    notes: "Mandatory for applicants aged 40+ or commercial vehicles."
  },
  "medical certificate": {
    description: "Official medical fitness certificate signed by a certified medical practitioner.",
    category: "Medical Proof",
    notes: "Original physical doctor attestation with doctor registration number and seal."
  },
  "proof of address": {
    description: "Recent residential address proof (under 3 months old).",
    category: "Address Proof",
    notes: "Electricity bill, water bill, registered rent agreement, or bank passbook copy."
  },
  "address proof": {
    description: "Recent residential address proof (under 3 months old).",
    category: "Address Proof",
    notes: "Electricity bill, water bill, registered rent agreement, or bank passbook copy."
  },
  "updated address proof": {
    description: "Valid document supporting your new residential address.",
    category: "Address Proof",
    notes: "Must clearly display citizen's full legal name and exact new address."
  },
  "proof of age": {
    description: "Government-approved proof certifying your date of birth.",
    category: "Age Proof",
    notes: "Birth certificate, 10th standard school marksheet, or passport."
  },
  "age proof": {
    description: "Government-approved proof certifying your date of birth.",
    category: "Age Proof",
    notes: "Birth certificate, 10th standard school marksheet, or passport."
  },
  "birth certificate": {
    description: "Official birth certificate issued by municipal corporation or registrar.",
    category: "Age Proof",
    notes: "Original birth certificate with official seal and registration number."
  },
  "passport photo": {
    description: "Recent passport-sized photographs taken with a light or white background.",
    category: "Biometric Photo",
    notes: "Carry 2-4 recent unmounted physical prints (35mm x 45mm)."
  },
  "recent passport photo": {
    description: "Recent passport-sized photographs taken with a light or white background.",
    category: "Biometric Photo",
    notes: "Carry 2-4 recent unmounted physical prints (35mm x 45mm)."
  },
  "hospital discharge summary": {
    description: "Hospital discharge slip or birth record certificate from institutional delivery.",
    category: "Birth Record",
    notes: "Must record baby's gender, date, time of birth, and mother's full name."
  },
  "marriage certificate": {
    description: "Registered marriage certificate or court marriage decree.",
    category: "Civil Record",
    notes: "Required for spouse name inclusion or joint family verification."
  },
  "pan card": {
    description: "Permanent Account Number card issued by Income Tax Department.",
    category: "Tax ID",
    notes: "Physical plastic PAN card or signed e-PAN document."
  },
  "ration card": {
    description: "Valid state civil supplies ration card / food security card.",
    category: "Civil Record",
    notes: "Original ration booklet or digitized smart card listing household members."
  },
  "ration card / salary slip": {
    description: "Valid state ration card, family listing, or latest 3 months salary slips.",
    category: "Income Proof",
    notes: "Used to assess household economic category."
  },
  "ration card / family listing": {
    description: "Valid state civil supplies ration card or village revenue family register.",
    category: "Civil Record",
    notes: "Confirms family composition and local domicile."
  },
  "father/relative caste certificate": {
    description: "Official caste certificate issued to applicant's father or paternal relative.",
    category: "Caste Proof",
    notes: "Required by Revenue Tehsildar to establish community lineage."
  },
  "school leaving certificate": {
    description: "Original transfer certificate (TC) or school leaving certificate.",
    category: "Academic Record",
    notes: "Must mention student's date of birth and recognized caste/community."
  },
  "self-declaration affidavit": {
    description: "Notarized self-declaration on stamp paper certifying family income or facts.",
    category: "Legal Declaration",
    notes: "Signed by applicant and attested by Executive Magistrate or Notary Public."
  },
  "self-declaration form 1": {
    description: "Form 1 self-declaration on physical fitness from Parivahan.",
    category: "Medical Declaration",
    notes: "Can be downloaded from official transport portal and signed."
  },
  "original rc book": {
    description: "Original Vehicle Registration Certificate (RC smart card / book).",
    category: "Vehicle Record",
    notes: "Physical original must be produced at the Regional Transport Office."
  },
  "valid vehicle insurance": {
    description: "Comprehensive or mandatory third-party vehicle insurance policy.",
    category: "Transport Compliance",
    notes: "Policy must be currently active and not expired."
  },
  "puc certificate": {
    description: "Pollution Under Control (PUC) certificate issued by authorized emission testing center.",
    category: "Transport Compliance",
    notes: "Must be unexpired on the date of RTO counter submission."
  },
  "form 29 & 30": {
    description: "Official vehicle ownership transfer notice and application forms.",
    category: "Transport Form",
    notes: "Duly signed in duplicate by both seller (transferor) and buyer (transferee)."
  },
  "commercial premises lease/deed": {
    description: "Registered commercial lease agreement or property ownership deed.",
    category: "Premises Proof",
    notes: "Required for municipal trade license or business registration."
  },
  "bank account passbook": {
    description: "First page of active nationalized/commercial bank account passbook.",
    category: "Financial Proof",
    notes: "Must clearly display applicant's name, account number, and bank IFSC code."
  },
  "bank passbook copy": {
    description: "First page of active nationalized/commercial bank account passbook.",
    category: "Financial Proof",
    notes: "Must clearly display applicant's name, account number, and bank IFSC code."
  },
  "income certificate": {
    description: "Valid government income certificate issued by competent Tehsildar / Sub-Divisional Magistrate.",
    category: "Income Proof",
    notes: "Must be within validity period (usually 1 year from issue date)."
  },
  "domicile certificate": {
    description: "Permanent resident / domicile certificate issued by state revenue authorities.",
    category: "Residence Proof",
    notes: "Required to verify state resident quota or welfare scheme eligibility."
  }
};

const DEFAULT_METADATA: DocumentMetadata = {
  description: "Official verification document required by the government department.",
  category: "Required Document",
  notes: "Carry original physical copy and 2 self-attested photocopies to your office visit."
};

/**
 * Returns metadata for a document name using fuzzy keyword matching
 */
export function getDocumentMetadata(docName: string): DocumentMetadata {
  const cleanName = docName.toLowerCase().trim();
  if (DOCUMENT_METADATA_REGISTRY[cleanName]) {
    return DOCUMENT_METADATA_REGISTRY[cleanName];
  }

  // Fuzzy match
  for (const [key, meta] of Object.entries(DOCUMENT_METADATA_REGISTRY)) {
    if (cleanName.includes(key) || key.includes(cleanName)) {
      return meta;
    }
  }

  // Keyword inferences
  if (cleanName.includes('aadhaar')) return DOCUMENT_METADATA_REGISTRY['aadhaar card'];
  if (cleanName.includes('photo')) return DOCUMENT_METADATA_REGISTRY['passport photo'];
  if (cleanName.includes('address') || cleanName.includes('bill')) return DOCUMENT_METADATA_REGISTRY['proof of address'];
  if (cleanName.includes('age') || cleanName.includes('birth')) return DOCUMENT_METADATA_REGISTRY['proof of age'];
  if (cleanName.includes('license') || cleanName.includes('licence')) return DOCUMENT_METADATA_REGISTRY["learner's licence"];
  if (cleanName.includes('medical')) return DOCUMENT_METADATA_REGISTRY['medical certificate'];
  if (cleanName.includes('income') || cleanName.includes('salary')) return DOCUMENT_METADATA_REGISTRY['income certificate'];
  if (cleanName.includes('caste')) return DOCUMENT_METADATA_REGISTRY['father/relative caste certificate'];
  if (cleanName.includes('bank') || cleanName.includes('passbook')) return DOCUMENT_METADATA_REGISTRY['bank account passbook'];
  if (cleanName.includes('affidavit') || cleanName.includes('declaration')) return DOCUMENT_METADATA_REGISTRY['self-declaration affidavit'];

  return DEFAULT_METADATA;
}

const STORAGE_KEY_PREFIX = 'smartseva_checklist_v2_';

/**
 * Generate initial document list for a service
 */
export function generateInitialDocumentsForService(service: ServiceItem): DocumentItem[] {
  const docNames = service.documentsRequired && service.documentsRequired.length > 0
    ? service.documentsRequired
    : ['Identity Proof', 'Address Proof', 'Passport Photo'];

  const isDrivingLicense = service.id === 'driving-license' || service.id === 'dl-renewal';

  return docNames.map((name, index) => {
    const meta = getDocumentMetadata(name);
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    // For driving-license, provide realistic default progress (e.g. 4 have, 1 needed)
    let defaultStatus: DocumentStatus = 'not_sure';
    if (isDrivingLicense) {
      if (index === 0) defaultStatus = 'have';
      else if (index === 1) defaultStatus = 'have';
      else if (index === 2) defaultStatus = 'expired';
      else if (index === 3) defaultStatus = 'have';
      else defaultStatus = 'dont_have';
    }

    return {
      id: `${service.id}-${slug || index}`,
      title: name,
      description: meta.description,
      required: true,
      status: defaultStatus,
      category: meta.category,
      notes: meta.notes
    };
  });
}

/**
 * Loads service documents from localStorage or creates a fresh service-tailored list
 */
export function loadServiceDocuments(service: ServiceItem): DocumentItem[] {
  if (!service || !service.id) return [];
  const key = `${STORAGE_KEY_PREFIX}${service.id}`;

  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load service documents from storage', e);
  }

  // Fallback: generate tailored documents from service definition
  const generated = generateInitialDocumentsForService(service);
  saveServiceDocuments(service.id, generated);
  return generated;
}

/**
 * Persists document checklist state for a specific service
 */
export function saveServiceDocuments(serviceId: string, documents: DocumentItem[]): void {
  if (!serviceId) return;
  const key = `${STORAGE_KEY_PREFIX}${serviceId}`;
  try {
    localStorage.setItem(key, JSON.stringify(documents));
    // Also update generic key for legacy readers
    localStorage.setItem('smartseva_checklist_docs', JSON.stringify(documents));
  } catch (e) {
    console.error('Failed to persist service documents', e);
  }
}
