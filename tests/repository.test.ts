import { test } from 'node:test';
import assert from 'node:assert/strict';
import { repository } from '../src/data/caseRepository';

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
