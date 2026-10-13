export type OperationalMode = 'setup' | 'operations';

export type AppNavTab =
  | 'onboarding'
  | 'management'
  | 'setup_running'
  | 'stakeholders'
  | 'data_hub';

export type StaffRole =
  | 'founder'
  | 'franchise_hq'
  | 'center_head'
  | 'academic_lead'
  | 'educator'
  | 'didi'
  | 'support_staff'
  | 'admissions_counselor'
  | 'accountant'
  | 'mentor'
  | 'parent';

export type GoogleNativeAssetType =
  | 'sheet'
  | 'doc'
  | 'slide'
  | 'form'
  | 'drive_folder'
  | 'chat_space'
  | 'meet_link';

export interface GoogleNativeAsset {
  id: string;
  title: string;
  description: string;
  type: GoogleNativeAssetType;
  department: Department | 'Management' | 'Hygiene_Support';
  nativeUrl: string;
  iconName: string;
  recommendedRoles: StaffRole[];
  lastUpdated: string;
  rowCountOrSections?: string;
  sampleColumnsOrOutline: string[];
}

export interface CampusSetupInput {
  brand_id: string;
  school_type: 'franchise' | 'independent';
  campus_name: string;
  trust_name: string;
  registration_type: 'Trust' | 'Society' | 'Section 8' | 'LLP' | 'Pvt Ltd';
  city: string;
  locality: string;
  pincode: string;
  total_sqft: number;
  outdoor_play_sqft: number;
  classroom_count: number;
  daycare_offered: boolean;
  cctv_cloud_enabled: boolean;
  franchise_poc_name?: string;
  franchise_poc_email?: string;
  mentors: { name: string; email: string; organization: string }[];
}

export interface StaffUser {
  id: string;
  campus_id: string;
  full_name: string;
  email: string;
  phone: string;
  role: StaffRole;
  designation: string;
  reports_to_id: string | null;
  google_email?: string;
  avatar_url?: string;
  is_active: boolean;
  department?: string;
}

export type Department =
  | 'Legal'
  | 'Civil'
  | 'Safety'
  | 'Academic'
  | 'HR'
  | 'Marketing'
  | 'Operations'
  | 'Finance'
  | 'Procurement';

export type Priority = 'low' | 'medium' | 'high' | 'safety_critical';

export type TaskStatus =
  | 'backlog'
  | 'todo'
  | 'in_progress'
  | 'under_review'
  | 'completed'
  | 'verified';

export interface Task {
  id: string;
  campus_id: string;
  department: Department;
  title: string;
  description: string;
  created_by_id: string;
  assigned_to_id: string;
  priority: Priority;
  status: TaskStatus;
  requires_proof: boolean;
  proof_image_url?: string;
  proof_notes?: string;
  sop_steps?: string[];
  verified_by_id?: string;
  verified_at?: string;
  created_at: string;
  updated_at: string;
}

export type ProgramGrade =
  | 'Playgroup'
  | 'Nursery'
  | 'LKG'
  | 'UKG'
  | 'Daycare';

export type StudentStatus =
  | 'lead'
  | 'tour_scheduled'
  | 'tour_completed'
  | 'admitted'
  | 'alumni';

export interface Student {
  id: string;
  campus_id: string;
  full_name: string;
  date_of_birth: string;
  program_grade: ProgramGrade;
  parent_name: string;
  parent_phone: string;
  parent_email: string;
  google_contact_resource_name?: string;
  status: StudentStatus;
  emergency_contact?: string;
  allergies_dietary?: string;
  notes?: string;
  fee_amount: number;
  fee_paid: boolean;
  lead_source?: string;
  tour_date?: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late';
export type MealStatus = 'ate_full' | 'ate_half' | 'refused' | 'light_snack';

export interface DailyLog {
  id: string;
  student_id: string;
  logged_by_id: string;
  log_date: string;
  attendance: AttendanceStatus;
  meal_status?: MealStatus;
  nap_minutes: number;
  mood_emoji: string;
  notes?: string;
  observation_photo_url?: string;
  created_at: string;
}

export interface VendorOrder {
  id: string;
  campus_id: string;
  category: string;
  vendor_name: string;
  item_details: string;
  amount: number;
  safety_certified: boolean;
  status: 'rfq_sent' | 'quote_received' | 'safety_approved' | 'dispatched' | 'installed_verified';
  delivery_eta?: string;
}

export interface Campus {
  id: string;
  brand_id: string;
  brand_name: string;
  campus_name: string;
  city: string;
  locality: string;
  pincode: string;
  current_mode: OperationalMode;
  budget_allocated: number;
  budget_spent: number;
  compliance_score: number;
  created_at: string;
}

export interface BrandInfo {
  id: string;
  name: string;
  tagline: string;
  pedagogy: string;
  primaryColor: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  zones: string[];
  curriculumFocus: string[];
  complianceRequirements: string[];
  studentTeacherRatio: string;
}

export interface GoogleWorkspaceState {
  connectedAccount: string | null;
  contactsSyncedCount: number;
  lastContactSyncTime: string | null;
  activeChatSpaces: { id: string; name: string; memberCount: number; unreadAlerts: number }[];
  gmailDispatchesCount: number;
  driveFolderTree: string;
}

// -------------------------------------------------------------
// Extended Types for Complete Preschool OS
// -------------------------------------------------------------

export type StakeholderType =
  | 'parent'
  | 'student'
  | 'franchise'
  | 'team'
  | 'teacher'
  | 'didi'
  | 'mentor'
  | 'vendor'
  | 'lead';

export interface Stakeholder {
  id: string;
  name: string;
  type: StakeholderType;
  phone: string;
  email: string;
  google_email?: string;
  roleTitle: string;
  relationDetails?: string; // e.g. "Father of Aarav (Nursery)" or "Regional Franchise Auditor"
  feeStatus?: 'paid' | 'due' | 'not_applicable';
  dueAmount?: number;
  grade?: ProgramGrade;
  preferredChannel: 'whatsapp' | 'call' | 'gmail' | 'chat';
  lastContactedAt?: string;
  notes?: string;
  tags: string[];
  avatarUrl?: string;
}

export interface CommunicationLog {
  id: string;
  stakeholderId: string;
  stakeholderName: string;
  channel: 'whatsapp' | 'call' | 'gmail' | 'chat';
  message: string;
  draftedBy: string;
  sentAt: string;
  status: 'sent' | 'drafted' | 'delivered';
}

export interface WhatsAppTemplate {
  id: string;
  title: string;
  category: 'fees' | 'care' | 'admissions' | 'franchise' | 'staff' | 'emergency';
  targetRole: StakeholderType;
  textTemplate: string;
}

export interface SchoolConfig {
  brandId: string;
  brandName: string;
  campusName: string;
  city: string;
  locality: string;
  pincode: string;
  state: string;
  totalCapacity: number;
  operatingHours: string;
  gradesOffered: ProgramGrade[];
  feesMonthly: Record<ProgramGrade, number>;
  mealsProvision: 'in_house_kitchen' | 'catered_organic' | 'parent_lunchbox';
  transportProvision: 'school_vans_gps' | 'auto_rickshaw_pool' | 'parent_drop_only';
  emergencyContact: string;
  cctvEnabled: boolean;
  fireNocStatus: 'approved' | 'in_review' | 'pending';
}

export type AIPermissionLevel = 'disabled' | 'read' | 'suggest' | 'auto_sync';

export interface ToolPermission {
  tool: 'docs' | 'sheets' | 'slides' | 'forms' | 'notebooklm' | 'classroom' | 'maps' | 'keep';
  title: string;
  description: string;
  level: AIPermissionLevel;
  autoDraft: boolean;
  lastSync: string;
}

export interface GoogleAuthSession {
  connected: boolean;
  email: string;
  name: string;
  avatarUrl: string;
  connectedAt: string;
  provider: 'google';
  secondaryGmail?: string;
  contactsCount: number;
}
