import { FeeAssessment, FeeLineItem } from '../types';

export interface FeeAssessmentInput {
  filingRef: string;
  courtLevel: string;
  division: string;
  caseCategory: string;
  claimAmountNum: number;
  defendantsCount: number;
  documentsCount: number;
  isExempt?: boolean;
  exemptionReason?: string;
}

/**
 * Configurable E-Filing Fee Assessment Engine
 * Demonstrative tariff configuration. Fictional indicative values for prototyping.
 */
export function calculateFilingFees(input: FeeAssessmentInput): FeeAssessment {
  if (input.isExempt) {
    return {
      filingRef: input.filingRef,
      lineItems: [
        {
          id: 'item_exempt',
          description: `Fee Exemption Granted: ${input.exemptionReason || 'Statutory / Legal Aid Exemption'}`,
          category: 'Exempt',
          amount: 0.0,
        },
      ],
      subtotal: 0.0,
      itLevy: 0.0,
      total: 0.0,
      isExempt: true,
      exemptionReason: input.exemptionReason,
    };
  }

  const lineItems: FeeLineItem[] = [];

  // 1. Base Court Filing Fee by Court Level
  let baseFee = 200.0;
  if (input.courtLevel.includes('Supreme Court')) {
    baseFee = 450.0;
  } else if (input.courtLevel.includes('Court of Appeal')) {
    baseFee = 320.0;
  } else if (input.courtLevel.includes('High Court')) {
    baseFee = 220.0;
  } else if (input.courtLevel.includes('Circuit Court')) {
    baseFee = 150.0;
  } else {
    baseFee = 90.0;
  }

  lineItems.push({
    id: 'f_base_court',
    description: `Originating Process Filing Fee (${input.courtLevel})`,
    category: 'Court Registry Fee',
    amount: baseFee,
  });

  // 2. Division Specific Assessment
  if (input.division.includes('Commercial')) {
    lineItems.push({
      id: 'f_comm_div',
      description: 'Commercial Pre-Trial Settlement & Mediation Surcharge',
      category: 'Specialised Court Fee',
      amount: 60.0,
    });
  } else if (input.division.includes('Land')) {
    lineItems.push({
      id: 'f_land_div',
      description: 'Land Title Registry Inspection & Search Surcharge',
      category: 'Specialised Court Fee',
      amount: 50.0,
    });
  }

  // 3. Electronic Process Service Assessment (per defendant/respondent)
  const serviceCount = Math.max(1, input.defendantsCount);
  const serviceUnitFee = 40.0;
  lineItems.push({
    id: 'f_service',
    description: `Bailiff & Electronic Service Assessment (${serviceCount} Party${serviceCount > 1 ? 'ies' : ''})`,
    category: 'Service of Process',
    amount: serviceCount * serviceUnitFee,
  });

  // 4. Exhibit verification surcharge (documents > 2)
  if (input.documentsCount > 2) {
    const extraDocs = input.documentsCount - 2;
    lineItems.push({
      id: 'f_exhibits',
      description: `Supporting Exhibits Stamp & Digital Archiving (${extraDocs} document${extraDocs > 1 ? 's' : ''})`,
      category: 'Exhibit Verification',
      amount: extraDocs * 15.0,
    });
  }

  // Calculate subtotal
  const subtotal = lineItems.reduce((acc, item) => acc + item.amount, 0);

  // 5. IT Automation & e-Docket Infrastructure Levy (Flat GHS 25.00)
  const itLevy = 25.0;
  lineItems.push({
    id: 'f_it_levy',
    description: 'Judicial Automation & e-Docket Platform Maintenance Levy',
    category: 'Statutory Technology Levy',
    amount: itLevy,
  });

  const total = subtotal + itLevy;

  return {
    filingRef: input.filingRef,
    lineItems,
    subtotal,
    itLevy,
    total,
    isExempt: false,
  };
}
