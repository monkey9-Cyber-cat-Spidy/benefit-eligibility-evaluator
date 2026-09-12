import { test, describe } from 'node:test';
import assert from 'node:assert';
import { EligibilityEngine } from '../src/eligibilityEngine.mjs';

describe('Benefit Eligibility Evaluator Suite', () => {
  const engine = new EligibilityEngine();
  engine.enrollMember({
    memberId: 'MEM-001',
    planType: 'GOLD_PPO',
    effectiveDate: '2026-01-01',
    terminationDate: '2026-12-31',
    coveredDependents: ['DEP-A', 'DEP-B']
  });

  test('should verify active coverage for enrolled member and dependents', () => {
    const res1 = engine.checkEligibility('MEM-001', '2026-05-15');
    assert.strictEqual(res1.eligible, true);
    assert.strictEqual(res1.planType, 'GOLD_PPO');

    const res2 = engine.checkEligibility('MEM-001', '2026-05-15', 'DEP-A');
    assert.strictEqual(res2.eligible, true);
  });

  test('should reject coverage request after termination date', () => {
    const res = engine.checkEligibility('MEM-001', '2027-02-01');
    assert.strictEqual(res.eligible, false);
    assert.strictEqual(res.reason, 'COVERAGE_TERMINATED');
  });
});
