/**
 * Judicial Service of Ghana (JSG) Court & E-Filing Configuration Service
 * Demonstrative reference configuration for court hierarchy, case classifications,
 * required document checklists, and fee schedules.
 */

export interface CourtStationOption {
  id: string;
  name: string;
  region: string;
  level: string;
  address: string;
}

export interface CourtDivisionOption {
  id: string;
  name: string;
  code: string;
  level: string;
}

export interface CaseCategoryOption {
  id: string;
  name: string;
  divisions: string[];
  types: { id: string; name: string; defaultCode: string }[];
}

export interface DocumentRequirementRule {
  docType: string;
  label: string;
  isMandatory: boolean;
  description: string;
  allowedExtensions: string[];
  maxSizeMB: number;
}

export const COURT_LEVELS = [
  'Supreme Court of Ghana',
  'Court of Appeal',
  'High Court of Justice',
  'Circuit Court',
  'District Court',
] as const;

export const GHANA_REGIONS = [
  'Greater Accra Region',
  'Ashanti Region',
  'Western Region',
  'Central Region',
  'Eastern Region',
  'Volta Region',
  'Northern Region',
  'Upper East Region',
  'Upper West Region',
  'Bono Region',
] as const;

export const COURT_STATIONS: CourtStationOption[] = [
  {
    id: 'stn_accra_lcc',
    name: 'Law Court Complex (High Court Buildings)',
    region: 'Greater Accra Region',
    level: 'High Court of Justice',
    address: 'High Street, Victoriaborg, Accra',
  },
  {
    id: 'stn_accra_sc',
    name: 'Supreme Court Administration Building',
    region: 'Greater Accra Region',
    level: 'Supreme Court of Ghana',
    address: 'High Street, Accra',
  },
  {
    id: 'stn_accra_coa',
    name: 'Court of Appeal (Accra Bench)',
    region: 'Greater Accra Region',
    level: 'Court of Appeal',
    address: 'Ministries, Accra',
  },
  {
    id: 'stn_accra_adenta',
    name: 'Adenta Court Complex',
    region: 'Greater Accra Region',
    level: 'High Court of Justice',
    address: 'Adenta Barrier, Accra',
  },
  {
    id: 'stn_kumasi_hcc',
    name: 'High Court Complex, Adum',
    region: 'Ashanti Region',
    level: 'High Court of Justice',
    address: 'Adum, Kumasi',
  },
  {
    id: 'stn_kumasi_coa',
    name: 'Court of Appeal (Kumasi Bench)',
    region: 'Ashanti Region',
    level: 'Court of Appeal',
    address: 'Danyame, Kumasi',
  },
  {
    id: 'stn_sekondi_hc',
    name: 'Sekondi High Court Complex',
    region: 'Western Region',
    level: 'High Court of Justice',
    address: 'Court Road, Sekondi-Takoradi',
  },
  {
    id: 'stn_capecoast_hc',
    name: 'Cape Coast Court Complex',
    region: 'Central Region',
    level: 'High Court of Justice',
    address: 'Commercial Street, Cape Coast',
  },
  {
    id: 'stn_tamale_hc',
    name: 'Tamale High Court Complex',
    region: 'Northern Region',
    level: 'High Court of Justice',
    address: 'Hospital Road, Tamale',
  },
];

export const COURT_DIVISIONS: CourtDivisionOption[] = [
  { id: 'div_comm', name: 'Commercial Division', code: 'COMM', level: 'High Court of Justice' },
  { id: 'div_land', name: 'Land Division', code: 'LD', level: 'High Court of Justice' },
  { id: 'div_gen', name: 'General Jurisdiction', code: 'GJ', level: 'High Court of Justice' },
  { id: 'div_crim', name: 'Criminal Division', code: 'CR', level: 'High Court of Justice' },
  { id: 'div_fin', name: 'Financial & Economic Crimes Division', code: 'FED', level: 'High Court of Justice' },
  { id: 'div_labour', name: 'Labour Division', code: 'LBR', level: 'High Court of Justice' },
  { id: 'div_probate', name: 'Probate & Letters of Administration', code: 'PRB', level: 'High Court of Justice' },
  { id: 'div_human_rights', name: 'Human Rights Division', code: 'HR', level: 'High Court of Justice' },
  { id: 'div_app_civil', name: 'Civil Appeals Division', code: 'CA-CIV', level: 'Court of Appeal' },
  { id: 'div_app_crim', name: 'Criminal Appeals Division', code: 'CA-CRIM', level: 'Court of Appeal' },
  { id: 'div_sc_const', name: 'Constitutional & General Bench', code: 'SC', level: 'Supreme Court of Ghana' },
];

export const CASE_CATEGORIES: CaseCategoryOption[] = [
  {
    id: 'cat_commercial',
    name: 'Commercial',
    divisions: ['div_comm', 'div_fin'],
    types: [
      { id: 't_breach_contract', name: 'Breach of Commercial Contract', defaultCode: 'COMM' },
      { id: 't_debt_recovery', name: 'Recovery of Commercial Debt', defaultCode: 'COMM' },
      { id: 't_banking_finance', name: 'Banking & Securities Dispute', defaultCode: 'COMM' },
      { id: 't_intellectual_property', name: 'Intellectual Property & Trademarks', defaultCode: 'COMM' },
      { id: 't_insurance', name: 'Insurance Claim Dispute', defaultCode: 'COMM' },
    ],
  },
  {
    id: 'cat_civil',
    name: 'Civil (General Jurisdiction)',
    divisions: ['div_gen'],
    types: [
      { id: 't_tort_negligence', name: 'Tort & Negligence Damages', defaultCode: 'GJ' },
      { id: 't_defamation', name: 'Defamation / Libel', defaultCode: 'GJ' },
      { id: 't_breach_agreement', name: 'Breach of Agreement', defaultCode: 'GJ' },
      { id: 't_specific_perf', name: 'Specific Performance', defaultCode: 'GJ' },
    ],
  },
  {
    id: 'cat_land',
    name: 'Land & Real Property',
    divisions: ['div_land'],
    types: [
      { id: 't_declaration_title', name: 'Declaration of Title to Land', defaultCode: 'LD' },
      { id: 't_recovery_possession', name: 'Recovery of Possession & Ejection', defaultCode: 'LD' },
      { id: 't_trespass_injunction', name: 'Trespass & Perpetual Injunction', defaultCode: 'LD' },
      { id: 't_boundary_dispute', name: 'Stool / Family Boundary Dispute', defaultCode: 'LD' },
    ],
  },
  {
    id: 'cat_labour',
    name: 'Labour & Employment',
    divisions: ['div_labour'],
    types: [
      { id: 't_wrongful_termination', name: 'Wrongful / Unfair Termination', defaultCode: 'LBR' },
      { id: 't_severance_claim', name: 'Severance & Terminal Benefits', defaultCode: 'LBR' },
      { id: 't_trade_union', name: 'Collective Bargaining & Union Dispute', defaultCode: 'LBR' },
    ],
  },
  {
    id: 'cat_probate',
    name: 'Probate & Administration',
    divisions: ['div_probate'],
    types: [
      { id: 't_grant_probate', name: 'Grant of Probate (With Will Attached)', defaultCode: 'PRB' },
      { id: 't_letters_admin', name: 'Letters of Administration (Intestate)', defaultCode: 'PRB' },
      { id: 't_caveat_will', name: 'Caveat / Will Contest Challenge', defaultCode: 'PRB' },
    ],
  },
  {
    id: 'cat_human_rights',
    name: 'Human Rights',
    divisions: ['div_human_rights'],
    types: [
      { id: 't_enforce_rights', name: 'Enforcement of Fundamental Human Rights', defaultCode: 'HR' },
      { id: 't_unlawful_detention', name: 'Habeas Corpus / Unlawful Detention', defaultCode: 'HR' },
    ],
  },
];

export const FILING_TYPES = [
  'Writ of Summons with Statement of Claim',
  'Originating Notice of Motion with Verifying Affidavit',
  'Petition with Supporting Affidavit',
  'Originating Summons',
  'Notice of Appeal',
] as const;

/**
 * Returns required & optional document rules for a given filing and case type
 */
export function getDocumentRulesForFiling(
  filingType: string,
  caseType?: string
): DocumentRequirementRule[] {
  const commonRules: DocumentRequirementRule[] = [];

  if (filingType.includes('Writ of Summons')) {
    commonRules.push(
      {
        docType: 'Writ of Summons',
        label: 'Writ of Summons',
        isMandatory: true,
        description: 'Prescribed Form 1 signed by Plaintiff or Counsel with Solicitor License No.',
        allowedExtensions: ['.pdf'],
        maxSizeMB: 15,
      },
      {
        docType: 'Statement of Claim',
        label: 'Statement of Claim',
        isMandatory: true,
        description: 'Itemized pleadings setting out material facts, reliefs, and interest sought.',
        allowedExtensions: ['.pdf'],
        maxSizeMB: 15,
      },
      {
        docType: 'Verifying Affidavit',
        label: 'Verifying Affidavit',
        isMandatory: true,
        description: 'Sworn affidavit verifying facts contained in the statement of claim.',
        allowedExtensions: ['.pdf'],
        maxSizeMB: 15,
      }
    );
  } else if (filingType.includes('Motion')) {
    commonRules.push(
      {
        docType: 'Notice of Motion',
        label: 'Notice of Motion',
        isMandatory: true,
        description: 'Formal application specifying statutory provisions and grounds.',
        allowedExtensions: ['.pdf'],
        maxSizeMB: 15,
      },
      {
        docType: 'Supporting Affidavit',
        label: 'Affidavit in Support',
        isMandatory: true,
        description: 'Deponent sworn statement establishing prima facie entitlement to reliefs.',
        allowedExtensions: ['.pdf'],
        maxSizeMB: 15,
      }
    );
  } else if (filingType.includes('Petition')) {
    commonRules.push(
      {
        docType: 'Petition',
        label: 'Originating Petition',
        isMandatory: true,
        description: 'Petition setting out statutory grounds and prayed declarations.',
        allowedExtensions: ['.pdf'],
        maxSizeMB: 15,
      },
      {
        docType: 'Verifying Affidavit',
        label: 'Verifying Affidavit',
        isMandatory: true,
        description: 'Sworn affidavit of petitioner confirming truth of petition contents.',
        allowedExtensions: ['.pdf'],
        maxSizeMB: 15,
      }
    );
  } else {
    commonRules.push({
      docType: 'Primary Originating Document',
      label: 'Primary Originating Document',
      isMandatory: true,
      description: 'Main pleading or summons initiating proceedings.',
      allowedExtensions: ['.pdf'],
      maxSizeMB: 15,
    });
  }

  // Case-type-specific optional/advisable documents
  if (caseType && caseType.toLowerCase().includes('land')) {
    commonRules.push({
      docType: 'Site Plan / Search Report',
      label: 'Survey Site Plan / Lands Commission Search Report',
      isMandatory: false,
      description: 'Certified survey plan or official search report verifying land coordinates.',
      allowedExtensions: ['.pdf'],
      maxSizeMB: 20,
    });
  } else if (caseType && caseType.toLowerCase().includes('contract')) {
    commonRules.push({
      docType: 'Contract Agreement Exhibit',
      label: 'Executed Contract Agreement Exhibit',
      isMandatory: false,
      description: 'Underlying signed agreement, purchase order, or letter of award.',
      allowedExtensions: ['.pdf'],
      maxSizeMB: 20,
    });
  } else if (caseType && caseType.toLowerCase().includes('probate')) {
    commonRules.push({
      docType: 'Death Certificate / Statutory Declaration',
      label: 'Certified Death Certificate / Proof of Death',
      isMandatory: true,
      description: 'Registrar General / Births & Deaths Registry certificate or statutory declaration.',
      allowedExtensions: ['.pdf'],
      maxSizeMB: 10,
    });
  }

  // General exhibits
  commonRules.push({
    docType: 'Exhibits & Supporting Documents',
    label: 'Marked Exhibits (Bundled)',
    isMandatory: false,
    description: 'Supporting letters, demand notices, receipts or documentation.',
    allowedExtensions: ['.pdf', '.docx'],
    maxSizeMB: 25,
  });

  return commonRules;
}
