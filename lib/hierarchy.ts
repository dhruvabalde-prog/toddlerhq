import { StaffRole, StaffUser } from '@/types/toddlerhq';

export const ROLE_HIERARCHY_RANK: Record<StaffRole, number> = {
  founder: 1,
  center_head: 2,
  academic_lead: 3,
  admissions_counselor: 4,
  accountant: 4,
  educator: 5,
  support_staff: 6,
};

export const ROLE_LABELS: Record<StaffRole, string> = {
  founder: 'Founder & Managing Trustee',
  center_head: 'Center Head / Principal',
  academic_lead: 'Academic Curriculum Lead',
  educator: 'Classroom Educator',
  admissions_counselor: 'Admissions & Front Desk Lead',
  accountant: 'Finance & Compliance Officer',
  support_staff: 'Daycare Ayah / Campus Support',
};

export interface DelegableStaffGroups {
  myself: StaffUser[];
  directSubordinates: StaffUser[];
  secondarySubordinates: StaffUser[];
}

/**
 * Checks whether assigner has permission to delegate to target user.
 * Founder can assign to anyone.
 * Other roles can only assign to equal or subordinate roles in the tree, or direct reports.
 */
export function canDelegateTo(
  assigner: StaffUser,
  target: StaffUser
): boolean {
  if (assigner.id === target.id) return true;
  if (assigner.role === 'founder') return true;

  const assignerRank = ROLE_HIERARCHY_RANK[assigner.role] || 99;
  const targetRank = ROLE_HIERARCHY_RANK[target.role] || 99;

  // Direct reporting relationship always allowed if downwards or peer
  if (target.reports_to_id === assigner.id) return true;

  // Downstairs rule: target must be lower in hierarchy rank (larger rank number)
  if (targetRank > assignerRank) {
    // Specific operational constraints:
    if (assigner.role === 'academic_lead') {
      return target.role === 'educator';
    }
    if (assigner.role === 'admissions_counselor') {
      return false; // only to self
    }
    if (assigner.role === 'educator' || assigner.role === 'support_staff') {
      return false; // only to self
    }
    return true;
  }

  return false;
}

/**
 * Returns grouped list of staff members that the currentUser is allowed to assign tasks to.
 */
export function getDelegableStaffGroups(
  currentUser: StaffUser,
  allStaff: StaffUser[]
): DelegableStaffGroups {
  const myself = allStaff.filter((s) => s.id === currentUser.id && s.is_active);
  const others = allStaff.filter(
    (s) => s.id !== currentUser.id && s.is_active && canDelegateTo(currentUser, s)
  );

  const directSubordinates = others.filter((s) => s.reports_to_id === currentUser.id);
  const directSubordinateIds = new Set(directSubordinates.map((s) => s.id));
  const secondarySubordinates = others.filter((s) => !directSubordinateIds.has(s.id));

  return {
    myself,
    directSubordinates,
    secondarySubordinates,
  };
}

/**
 * State Machine Transition Validator
 * backlog -> todo -> in_progress -> under_review -> completed -> verified
 */
export const ALLOWED_STATUS_TRANSITIONS: Record<string, string[]> = {
  backlog: ['todo'],
  todo: ['in_progress', 'backlog'],
  in_progress: ['under_review', 'todo'],
  under_review: ['completed', 'in_progress'], // in_progress if rejected/needs rework
  completed: ['verified', 'in_progress'],
  verified: [], // Terminal verified state
};

export function canTransitionTaskStatus(
  currentStatus: string,
  targetStatus: string,
  user: StaffUser,
  requiresProof: boolean,
  hasProofAttachment: boolean
): { allowed: boolean; reason?: string } {
  if (currentStatus === targetStatus) return { allowed: true };

  const validNextStates = ALLOWED_STATUS_TRANSITIONS[currentStatus] || [];
  if (!validNextStates.includes(targetStatus)) {
    return {
      allowed: false,
      reason: `Invalid status transition from "${currentStatus}" to "${targetStatus}". Flow must follow: Backlog → To Do → In Progress → Under Review → Completed → Verified.`,
    };
  }

  // Check proof requirement when transitioning to under_review or completed
  if (
    requiresProof &&
    (targetStatus === 'under_review' || targetStatus === 'completed' || targetStatus === 'verified') &&
    !hasProofAttachment
  ) {
    return {
      allowed: false,
      reason: `Compliance Violation: This task requires mandatory proof attachment (photo or document) before advancing to "${targetStatus}".`,
    };
  }

  // Only Leadership can verify & close or complete
  if (targetStatus === 'verified') {
    if (!['founder', 'center_head', 'academic_lead'].includes(user.role)) {
      return {
        allowed: false,
        reason: 'Authority restriction: Only Founder, Center Head, or Academic Lead can verify and close tasks.',
      };
    }
  }

  return { allowed: true };
}
