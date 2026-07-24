export class EligibilityEngine {
  constructor() {
    this.coverages = new Map();
  }

  enrollMember({ memberId, planType, effectiveDate, terminationDate, coveredDependents = [] }) {
    this.coverages.set(memberId, {
      memberId,
      planType,
      effectiveDate: new Date(effectiveDate),
      terminationDate: terminationDate ? new Date(terminationDate) : null,
      coveredDependents: new Set(coveredDependents)
    });
  }

  checkEligibility(memberId, serviceDate, dependentId = null) {
    const cov = this.coverages.get(memberId);
    if (!cov) return { eligible: false, reason: 'MEMBER_NOT_FOUND' };

    const date = new Date(serviceDate);
    if (date < cov.effectiveDate) return { eligible: false, reason: 'SERVICE_BEFORE_EFFECTIVE_DATE' };
    if (cov.terminationDate && date > cov.terminationDate) return { eligible: false, reason: 'COVERAGE_TERMINATED' };

    if (dependentId && !cov.coveredDependents.has(dependentId)) {
      return { eligible: false, reason: 'DEPENDENT_NOT_ENROLLED' };
    }

    return { eligible: true, planType: cov.planType };
  }
}
