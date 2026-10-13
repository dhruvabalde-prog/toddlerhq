import { StaffRole, StaffUser } from '@/types/toddlerhq';

export const ROLE_HIERARCHY_RANK: Record<StaffRole, number> = {
  founder: 1,
  franchise_hq: 1,
  mentor: 2,
  center_head: 2,
  academic_lead: 3,
  accountant: 4,
  admissions_counselor: 4,
  educator: 5,
  didi: 6,
  support_staff: 6,
  parent: 7,
};

export const ROLE_LABELS: Record<StaffRole, string> = {
  founder: 'School Founder & Owner',
  franchise_hq: 'Franchise Head Office & Brand Auditor',
  center_head: 'Center Head / Principal',
  academic_lead: 'Academic Curriculum Lead',
  educator: 'Classroom Teacher (Educator)',
  didi: 'Daycare Didi (Caregiver / Helper)',
  support_staff: 'Campus Security & Support',
  accountant: 'Accountant & Finance Admin',
  admissions_counselor: 'Admissions & Front Desk Counselor',
  mentor: 'Pedagogy & Business Mentor',
  parent: 'Parent & Guardian Portal',
};

export interface DelegableStaffGroups {
  myself: StaffUser[];
  directSubordinates: StaffUser[];
  secondarySubordinates: StaffUser[];
}

/**
 * Checks whether assigner has permission to delegate to target user.
 * Founder and Franchise HQ can assign to anyone.
 */
export function canDelegateTo(
  assigner: StaffUser,
  target: StaffUser
): boolean {
  if (assigner.id === target.id) return true;
  if (assigner.role === 'founder' || assigner.role === 'franchise_hq') return true;

  const assignerRank = ROLE_HIERARCHY_RANK[assigner.role] || 99;
  const targetRank = ROLE_HIERARCHY_RANK[target.role] || 99;

  // Direct reporting relationship always allowed if downwards or peer
  if (target.reports_to_id === assigner.id) return true;

  // Downstairs rule: target must be lower in hierarchy rank
  if (targetRank > assignerRank) {
    if (assigner.role === 'academic_lead') {
      return target.role === 'educator' || target.role === 'didi';
    }
    if (assigner.role === 'admissions_counselor') {
      return false;
    }
    if (assigner.role === 'educator' || assigner.role === 'didi' || assigner.role === 'support_staff') {
      return false;
    }
    return true;
  }

  return false;
}

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

export const ALLOWED_STATUS_TRANSITIONS: Record<string, string[]> = {
  backlog: ['todo'],
  todo: ['in_progress', 'backlog'],
  in_progress: ['under_review', 'todo'],
  under_review: ['completed', 'in_progress'],
  completed: ['verified', 'in_progress'],
  verified: [],
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

  if (targetStatus === 'verified') {
    if (!['founder', 'franchise_hq', 'center_head', 'academic_lead'].includes(user.role)) {
      return {
        allowed: false,
        reason: 'Authority restriction: Only Founder, Franchise HQ, Center Head, or Academic Lead can verify and close tasks.',
      };
    }
  }

  return { allowed: true };
}
