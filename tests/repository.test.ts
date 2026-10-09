import { test } from 'node:test';
import assert from 'node:assert/strict';
import { repository } from '../src/data/caseRepository';
import { calculateFilingFees } from '../src/services/feeAssessmentEngine';
import { generateOfficialSuitNumber } from '../src/services/suitNumberService';

test('intake approval registers once; assignment and hearing update the case', () => {
  repository.resetToDefault();
  const source = repository.getFilings()[0];
  const filing = { ...source, id: 'test-filing', intakeId: 'test-intake', filingReference: 'test-ref', status: 'Submitted' as const };
  repository.addFiling(filing);
  repository.updateFilingDecision(filing.id, 'Approved');
  const record = repository.getCases().find(c => c.filingRef === filing.filingReference)!;
  assert.ok(record);
  repository.updateFilingDecision(filing.id, 'Approved');
  assert.equal(repository.getCases().filter(c => c.filingRef === filing.filingReference).length, 1);
  repository.assignJudge(record.id, 'test-judge', 'Demo Judge');
  assert.equal(repository.getCaseById(record.id)?.assignedJudgeName, 'Demo Judge');
  repository.addHearing({ ...repository.getHearings()[0], id: 'test-hearing', caseId: record.id, suitNumber: record.suitNumber, date: '2026-11-01', time: '10:00 AM' });
  assert.equal(repository.getCaseById(record.id)?.nextHearingDate, '2026-11-01');
});

test('filing correction and resubmission workflow operates accurately', () => {
  repository.resetToDefault();
  const filing = repository.getFilings()[0];
  const actor = repository.getCurrentUser();

  // Registrar requests correction
  repository.requestCorrection(filing.id, 'Missing Verifying Affidavit', 'Please upload signed affidavit', actor);
  const correctedFiling = repository.getFilingById(filing.id)!;
  assert.equal(correctedFiling.status, 'Correction Required');
  assert.ok(correctedFiling.correctionRequests && correctedFiling.correctionRequests.length > 0);

  // Lawyer resubmits amended document
  repository.resubmitFiling(
    filing.id,
    {
      documents: [
        ...correctedFiling.documents,
        {
          id: 'test-doc-amended',
          name: 'Verifying_Affidavit_Amended.pdf',
          type: 'Verifying Affidavit',
          size: '300 KB',
          uploadedAt: 'Today',
          uploadedBy: actor.name,
          verified: true,
        },
      ],
    },
    actor
  );

  const resubmittedFiling = repository.getFilingById(filing.id)!;
  assert.equal(resubmittedFiling.status, 'Under Review');
  assert.ok(resubmittedFiling.documents.some((d) => d.name === 'Verifying_Affidavit_Amended.pdf'));
});

test('subsequent filing attaches document into registered case docket', () => {
  repository.resetToDefault();
  const targetCase = repository.getCases()[0];
  const initialDocsCount = targetCase.documents.length;

  repository.addSubsequentFiling({
    id: 'sub_test_01',
    caseId: targetCase.id,
    suitNumber: targetCase.suitNumber,
    caseTitle: targetCase.caseTitle,
    filingRef: 'SUB-2026-TEST',
    documentType: 'Interlocutory Motion',
    documentTitle: 'Motion for Injunction',
    submittedBy: 'Counsel Test',
    submittingPartyRole: 'Plaintiff',
    submissionDate: '09 Oct 2026',
    status: 'Submitted',
    feeAmount: 120.0,
    paymentStatus: 'Paid',
    document: {
      id: 'sub_doc_test',
      name: 'Motion_For_Injunction.pdf',
      type: 'Interlocutory Motion',
      size: '1.2 MB',
      uploadedAt: 'Today',
      uploadedBy: 'Counsel Test',
      verified: true,
      folder: 'Subsequent Filings',
    },
  });

  const updatedCase = repository.getCaseById(targetCase.id)!;
  assert.equal(updatedCase.documents.length, initialDocsCount + 1);
  assert.ok(updatedCase.documents.some((d) => d.name === 'Motion_For_Injunction.pdf'));

  const subsequentList = repository.getSubsequentFilings();
  assert.ok(subsequentList.some((s) => s.filingRef === 'SUB-2026-TEST'));
});

test('fee assessment engine computes statutory tariffs and IT levies accurately', () => {
  const assessment = calculateFilingFees({
    filingRef: 'TEST-FEE',
    courtLevel: 'High Court of Justice',
    division: 'Commercial Division',
    caseCategory: 'Commercial',
    claimAmountNum: 200000,
    defendantsCount: 2,
    documentsCount: 4,
    isExempt: false,
  });

  assert.ok(assessment.total > 0);
  assert.ok(assessment.itLevy > 0);
  assert.equal(assessment.subtotal + assessment.itLevy, assessment.total);

  // Test legal aid exemption
  const exemptAssessment = calculateFilingFees({
    filingRef: 'TEST-EXEMPT',
    courtLevel: 'High Court of Justice',
    division: 'Commercial Division',
    caseCategory: 'Commercial',
    claimAmountNum: 200000,
    defendantsCount: 2,
    documentsCount: 4,
    isExempt: true,
    exemptionReason: 'Legal Aid Board',
  });

  assert.equal(exemptAssessment.total, 0);
  assert.equal(exemptAssessment.isExempt, true);
});

test('suit number service produces valid Ghana court suit numbers', () => {
  const suitNumber = generateOfficialSuitNumber({
    divisionCode: 'COMM',
    existingSuitNumbers: ['COMM/0100/2026'],
  });

  assert.match(suitNumber, /^COMM\/\d{4}\/\d{4}$/);
});
