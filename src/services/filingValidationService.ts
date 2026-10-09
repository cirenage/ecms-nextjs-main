import { CaseDocument, CaseParty, ValidationResult } from '../types';
import { getDocumentRulesForFiling } from './courtConfigService';

export interface FilingFormData {
  courtLevel: string;
  region: string;
  courtStation: string;
  division: string;
  caseCategory: string;
  caseType: string;
  filingType: string;
  caseTitle: string;
  natureOfClaim: string;
  claimAmount: string;
  parties: CaseParty[];
  documents: CaseDocument[];
  declarationAccepted: boolean;
}

/**
 * Automated Filing Validation Engine
 * Distinguishes blocking errors from advisory warnings.
 * Does not constitute legal advice or judicial approval.
 */
export function validateFiling(formData: FilingFormData): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Court Information Validation
  if (!formData.courtLevel?.trim()) {
    errors.push('Court Level is required.');
  }
  if (!formData.region?.trim()) {
    errors.push('Region selection is required.');
  }
  if (!formData.courtStation?.trim()) {
    errors.push('Court Station is required.');
  }
  if (!formData.division?.trim()) {
    errors.push('Court Division is required.');
  }
  if (!formData.caseCategory?.trim()) {
    errors.push('Case Category is required.');
  }
  if (!formData.caseType?.trim()) {
    errors.push('Case Type is required.');
  }
  if (!formData.filingType?.trim()) {
    errors.push('Filing Type is required.');
  }
  if (!formData.caseTitle?.trim()) {
    errors.push('Case Title is required (e.g. Ama Serwaa v. Kwame Boateng).');
  } else if (!formData.caseTitle.toLowerCase().includes(' v. ') && !formData.caseTitle.toLowerCase().includes(' v ')) {
    warnings.push('Case Title typically follows standard styling (e.g., "Party A v. Party B" or "In re: Matter of...").');
  }

  if (!formData.natureOfClaim?.trim()) {
    errors.push('Brief description of claim / cause of action is required.');
  }

  // 2. Parties Validation
  const plaintiffs = formData.parties.filter(
    (p) => p.role === 'Plaintiff' || p.role === 'Applicant'
  );
  const defendants = formData.parties.filter(
    (p) => p.role === 'Defendant' || p.role === 'Respondent'
  );

  if (plaintiffs.length === 0) {
    errors.push('At least one Plaintiff or Applicant must be added.');
  }
  if (defendants.length === 0 && !formData.filingType.includes('Ex-Parte')) {
    errors.push('At least one Defendant or Respondent must be added.');
  }

  // Party field completeness and duplicate detection
  const seenPartyNames = new Set<string>();
  formData.parties.forEach((party, index) => {
    if (!party.name?.trim()) {
      errors.push(`Party #${index + 1} is missing a full legal name.`);
    } else {
      const normalizedName = party.name.trim().toLowerCase();
      if (seenPartyNames.has(normalizedName)) {
        warnings.push(`Duplicate party name detected: "${party.name}". Verify distinct identity.`);
      }
      seenPartyNames.add(normalizedName);
    }

    if (!party.contact?.trim() && !party.email?.trim()) {
      warnings.push(`Party "${party.name || `#${index + 1}`}" lacks phone or email for electronic process service.`);
    }

    if (!party.bpNumber) {
      warnings.push(`Party "${party.name || `#${index + 1}`}" is not linked to a verified Business Partner ID.`);
    }
  });

  // 3. Document Requirements Validation
  const docRules = getDocumentRulesForFiling(formData.filingType, formData.caseType);
  const uploadedDocTypes = new Set(formData.documents.map((d) => d.type));

  docRules.forEach((rule) => {
    if (rule.isMandatory && !uploadedDocTypes.has(rule.docType)) {
      errors.push(`Mandatory document missing: "${rule.label}". You must upload this file before submission.`);
    }
  });

  if (formData.documents.length === 0) {
    errors.push('At least one primary originating court document must be uploaded.');
  }

  // File format and size validation
  formData.documents.forEach((doc) => {
    const ext = doc.name.slice(doc.name.lastIndexOf('.')).toLowerCase();
    if (!['.pdf', '.docx'].includes(ext)) {
      errors.push(`File "${doc.name}" has unsupported format (${ext}). Only PDF and DOCX files are permitted.`);
    }

    // Size check
    if (doc.size.includes('MB')) {
      const num = parseFloat(doc.size);
      if (!isNaN(num) && num > 25) {
        errors.push(`File "${doc.name}" exceeds maximum allowed threshold of 25MB (${doc.size}).`);
      }
    }
  });

  // 4. Legal Declaration
  if (!formData.declarationAccepted) {
    errors.push('You must accept the legal filing declaration and certification statement.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
