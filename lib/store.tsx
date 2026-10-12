'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Campus,
  StaffUser,
  Task,
  Student,
  DailyLog,
  VendorOrder,
  OperationalMode,
  StaffRole,
  BrandInfo,
  TaskStatus,
  AttendanceStatus,
  MealStatus,
} from '@/types/toddlerhq';
import { PRESCHOOL_BRANDS, getBrandById } from '@/lib/brands';
import { canDelegateTo, canTransitionTaskStatus } from '@/lib/hierarchy';
import {
  INITIAL_CHAT_MESSAGES,
  INITIAL_CHAT_SPACES,
  INITIAL_DRIVE_FILES,
  GoogleChatMessage,
  GoogleDriveFile,
  GmailDispatch,
} from '@/lib/googleWorkspace';

// -------------------------------------------------------------
// Seed Initial Data
// -------------------------------------------------------------

const SEED_CAMPUS: Campus = {
  id: 'campus-blr-1',
  brand_id: 'maple-bear',
  brand_name: 'Maple Bear Canadian Preschool',
  campus_name: 'Maple Bear Indiranagar Campus',
  city: 'Bengaluru',
  locality: 'Indiranagar 100ft Road',
  pincode: '560038',
  current_mode: 'setup',
  budget_allocated: 3500000,
  budget_spent: 1820000,
  compliance_score: 92,
  created_at: new Date().toISOString(),
};

const SEED_STAFF: StaffUser[] = [
  {
    id: 'user-founder',
    campus_id: 'campus-blr-1',
    full_name: 'Rajesh Mehta',
    email: 'rajesh.mehta@edufranchise.com',
    phone: '+91 98450 11223',
    role: 'founder',
    designation: 'Founder & Managing Trustee',
    reports_to_id: null,
    google_email: 'rajesh.mehta@edufranchise.com',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    is_active: true,
    department: 'Management',
  },
  {
    id: 'user-principal',
    campus_id: 'campus-blr-1',
    full_name: 'Priya Sharma',
    email: 'principal.indiranagar@maplebear.in',
    phone: '+91 98860 33445',
    role: 'center_head',
    designation: 'Center Head / Principal',
    reports_to_id: 'user-founder',
    google_email: 'priya.sharma@maplebear.in',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    is_active: true,
    department: 'Operations',
  },
  {
    id: 'user-lead',
    campus_id: 'campus-blr-1',
    full_name: 'Meera Nair',
    email: 'academic.lead@maplebear.in',
    phone: '+91 97410 55667',
    role: 'academic_lead',
    designation: 'Academic Curriculum Lead',
    reports_to_id: 'user-principal',
    google_email: 'meera.nair@maplebear.in',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    is_active: true,
    department: 'Academic',
  },
  {
    id: 'user-admissions',
    campus_id: 'campus-blr-1',
    full_name: 'Aditi Rao',
    email: 'admissions.indiranagar@maplebear.in',
    phone: '+91 99000 77889',
    role: 'admissions_counselor',
    designation: 'Admissions & Front Desk Lead',
    reports_to_id: 'user-principal',
    google_email: 'aditi.rao@maplebear.in',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    is_active: true,
    department: 'Marketing',
  },
  {
    id: 'user-teacher-1',
    campus_id: 'campus-blr-1',
    full_name: 'Kavita Sen',
    email: 'kavita.playgroup@maplebear.in',
    phone: '+91 98440 22334',
    role: 'educator',
    designation: 'Classroom Educator (Playgroup)',
    reports_to_id: 'user-lead',
    google_email: 'kavita.sen@maplebear.in',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    is_active: true,
    department: 'Academic',
  },
  {
    id: 'user-teacher-2',
    campus_id: 'campus-blr-1',
    full_name: 'Anjali Deshmukh',
    email: 'anjali.nursery@maplebear.in',
    phone: '+91 98800 66778',
    role: 'educator',
    designation: 'Classroom Educator (Nursery)',
    reports_to_id: 'user-lead',
    google_email: 'anjali.deshmukh@maplebear.in',
    avatar_url: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    is_active: true,
    department: 'Academic',
  },
  {
    id: 'user-support-1',
    campus_id: 'campus-blr-1',
    full_name: 'Lakshmi Bai',
    email: 'lakshmi.support@maplebear.in',
    phone: '+91 97310 99887',
    role: 'support_staff',
    designation: 'Senior Daycare Ayah & Hygiene Lead',
    reports_to_id: 'user-principal',
    google_email: 'lakshmi.support@maplebear.in',
    avatar_url: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=150&auto=format&fit=crop&q=80',
    is_active: true,
    department: 'Operations',
  },
  {
    id: 'user-security-1',
    campus_id: 'campus-blr-1',
    full_name: 'Ramesh Gowda',
    email: 'ramesh.security@maplebear.in',
    phone: '+91 99160 44556',
    role: 'support_staff',
    designation: 'Campus Gate Security Officer',
    reports_to_id: 'user-principal',
    google_email: 'ramesh.security@maplebear.in',
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    is_active: true,
    department: 'Operations',
  },
];

const SEED_TASKS: Task[] = [
  {
    id: 'task-1',
    campus_id: 'campus-blr-1',
    department: 'Civil',
    title: 'Install 25mm Anti-Microbial EVA Foam Flooring in Toddler Gym',
    description: 'Verify 25mm density tiles with beveled perimeter ramps and non-porous antibacterial finish. Ensure seamless interlocking.',
    created_by_id: 'user-founder',
    assigned_to_id: 'user-principal',
    priority: 'safety_critical',
    status: 'completed',
    requires_proof: true,
    proof_image_url: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=600&auto=format&fit=crop&q=80',
    proof_notes: 'EVA flooring completed across 1200 sq ft toddler area. EN71-3 certification verified with vendor.',
    sop_steps: [
      'Measure room dimensions and vacuum sub-floor clean of dust',
      'Lay damp-proof underlay membrane',
      'Interlock 25mm high-density dual-color tiles starting from entry gate',
      'Install beveled ramp trims at all classroom doorways to prevent trips',
      'Perform drop test with rubber ball and capture photographic proof'
    ],
    verified_by_id: 'user-founder',
    verified_at: '2026-10-10T14:30:00Z',
    created_at: '2026-10-01T10:00:00Z',
    updated_at: '2026-10-10T14:30:00Z',
  },
  {
    id: 'task-2',
    campus_id: 'campus-blr-1',
    department: 'Safety',
    title: 'Childproof All Low Windows & Balcony Safety Netting',
    description: 'All windows below 120cm must have restrictor stays limiting opening to <10cm. Balcony requires nylon braided safety netting tested to 150kg.',
    created_by_id: 'user-principal',
    assigned_to_id: 'user-support-1',
    priority: 'safety_critical',
    status: 'under_review',
    requires_proof: true,
    proof_image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
    proof_notes: 'Window grills installed with 8cm gaps. Nylon netting fixed on balcony perimeter.',
    sop_steps: [
      'Calibrate window restrictor catches to max 10cm gap',
      'Anchor high-strength nylon mesh anchors into RCC lintels',
      'Perform load pull test of 120kg at center point',
      'Upload high-res photo showing measuring tape against grill gaps'
    ],
    created_at: '2026-10-05T09:00:00Z',
    updated_at: '2026-10-12T11:00:00Z',
  },
  {
    id: 'task-3',
    campus_id: 'campus-blr-1',
    department: 'Legal',
    title: 'Obtain Fire Department NOC & Heat Sensor Certification',
    description: 'File application with Local Fire Station for Preschool occupancy. Install 4kg ABC dry chemical extinguishers every 500 sq ft.',
    created_by_id: 'user-founder',
    assigned_to_id: 'user-principal',
    priority: 'high',
    status: 'in_progress',
    requires_proof: true,
    sop_steps: [
      'Procure 6x 4kg ABC dry chemical fire extinguishers with IS 15683 stamp',
      'Mount extinguishers at child-inaccessible height of 1.2m',
      'Conduct local fire inspector walkthrough',
      'Obtain signed Fire NOC endorsement letter'
    ],
    created_at: '2026-10-04T11:00:00Z',
    updated_at: '2026-10-12T16:00:00Z',
  },
  {
    id: 'task-4',
    campus_id: 'campus-blr-1',
    department: 'HR',
    title: 'Police Verification Clearances for Caregivers & Guards',
    description: 'Mandatory background check with local Indiranagar police station for all support staff, ayahs, and security personnel prior to student entry.',
    created_by_id: 'user-principal',
    assigned_to_id: 'user-admissions',
    priority: 'safety_critical',
    status: 'under_review',
    requires_proof: true,
    proof_image_url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80',
    proof_notes: 'Police verification certificates received and submitted for 4 support staff.',
    sop_steps: [
      'Collect Aadhaar, voter ID, and 2 passport photos for each staff member',
      'Submit Form 24 to jurisdictional ACP office',
      'Collect official stamped police clearance certificate',
      'Scan and store in Google Drive compliance folder'
    ],
    created_at: '2026-10-02T12:00:00Z',
    updated_at: '2026-10-11T15:20:00Z',
  },
  {
    id: 'task-5',
    campus_id: 'campus-blr-1',
    department: 'Academic',
    title: 'Assemble Sensory Water & Sand Discovery Tables',
    description: 'Set up dual-basin height-adjustable sensory tables. Fill with non-toxic silica sand and kinetic play textures.',
    created_by_id: 'user-lead',
    assigned_to_id: 'user-teacher-1',
    priority: 'medium',
    status: 'todo',
    requires_proof: false,
    sop_steps: [
      'Unbox wooden sensory table frames and inspect for rounded edges',
      'Sanitize plastic drainage basins',
      'Fill basin A with washed organic sand and basin B with water funnel wheels',
      'Arrange waterproof toddler smocks on low hooks'
    ],
    created_at: '2026-10-08T10:00:00Z',
    updated_at: '2026-10-08T10:00:00Z',
  },
  {
    id: 'task-6',
    campus_id: 'campus-blr-1',
    department: 'Academic',
    title: 'Unpack & Sanitize Canadian Phonics & Manipulative Kits',
    description: 'Inventory 120 phonics sound cards, textured wooden letters, and large tactile counters. Spray with food-grade citrus disinfectant.',
    created_by_id: 'user-lead',
    assigned_to_id: 'user-teacher-2',
    priority: 'medium',
    status: 'backlog',
    requires_proof: true,
    sop_steps: [
      'Verify itemized checklist against franchise master manifest',
      'Inspect all wooden blocks for splinters or sharp corners',
      'Disinfect all pieces with child-safe non-alcoholic sanitizer',
      'Store in designated labeled low cubbies'
    ],
    created_at: '2026-10-09T14:00:00Z',
    updated_at: '2026-10-09T14:00:00Z',
  },
  {
    id: 'task-7',
    campus_id: 'campus-blr-1',
    department: 'Marketing',
    title: 'Local Society RWA WhatsApp Outreach & Banner Setup',
    description: 'Coordinate with premier Indiranagar residential associations for experiential weekend walkthrough invitations.',
    created_by_id: 'user-principal',
    assigned_to_id: 'user-admissions',
    priority: 'low',
    status: 'completed',
    requires_proof: false,
    created_at: '2026-10-06T15:00:00Z',
    updated_at: '2026-10-11T12:00:00Z',
  },
  {
    id: 'task-8',
    campus_id: 'campus-blr-1',
    department: 'Civil',
    title: 'Procure BEE 5-Star Multi-Split ACs with PM2.5 Filtration',
    description: 'Install 4x 1.5-ton low-noise inverter AC units equipped with integrated PM2.5 filters for infant nap room and classrooms.',
    created_by_id: 'user-founder',
    assigned_to_id: 'user-principal',
    priority: 'high',
    status: 'verified',
    requires_proof: true,
    proof_image_url: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600&auto=format&fit=crop&q=80',
    proof_notes: 'All 4 AC units installed with silent dampeners. Indoor air quality tested at PM2.5 < 15 ug/m3.',
    verified_by_id: 'user-founder',
    verified_at: '2026-10-09T17:00:00Z',
    created_at: '2026-10-01T10:30:00Z',
    updated_at: '2026-10-09T17:00:00Z',
  },
];

const SEED_STUDENTS: Student[] = [
  {
    id: 'stud-1',
    campus_id: 'campus-blr-1',
    full_name: 'Vihaan Rao',
    date_of_birth: '2024-04-14',
    program_grade: 'Playgroup',
    parent_name: 'Sneha & Arvind Rao',
    parent_phone: '+91 98451 22334',
    parent_email: 'sneha.rao@gmail.com',
    google_contact_resource_name: 'people/c10293847',
    status: 'admitted',
    emergency_contact: '+91 98451 22334 (Mother)',
    allergies_dietary: 'Mild peanut allergy (strict check)',
    notes: 'Loves building blocks and watercolor finger-painting.',
    fee_amount: 85000,
    fee_paid: true,
  },
  {
    id: 'stud-2',
    campus_id: 'campus-blr-1',
    full_name: 'Aarav Iyer',
    date_of_birth: '2023-09-22',
    program_grade: 'Nursery',
    parent_name: 'Dr. Ananya Iyer',
    parent_phone: '+91 98862 44556',
    parent_email: 'ananya.iyer@manipal.edu',
    google_contact_resource_name: 'people/c20394857',
    status: 'tour_scheduled',
    emergency_contact: '+91 98862 44556',
    notes: 'Parent requested morning tour at 10:30 AM with focus on Canadian bilingual immersion.',
    fee_amount: 95000,
    fee_paid: false,
    tour_date: 'Tomorrow, 10:30 AM',
    lead_source: 'Google Search & Local Parent Referral',
  },
  {
    id: 'stud-3',
    campus_id: 'campus-blr-1',
    full_name: 'Myra Kapoor',
    date_of_birth: '2024-02-18',
    program_grade: 'Playgroup',
    parent_name: 'Vikram Kapoor',
    parent_phone: '+91 99003 88990',
    parent_email: 'vikram.kapoor@zoho.com',
    google_contact_resource_name: 'people/c30495867',
    status: 'admitted',
    emergency_contact: '+91 99003 88990 (Father)',
    allergies_dietary: 'None',
    notes: 'Responds best to gentle musical transitions during nap routine.',
    fee_amount: 85000,
    fee_paid: true,
  },
  {
    id: 'stud-4',
    campus_id: 'campus-blr-1',
    full_name: 'Advik Menon',
    date_of_birth: '2023-01-10',
    program_grade: 'LKG',
    parent_name: 'Neha Menon',
    parent_phone: '+91 97414 11229',
    parent_email: 'neha.menon@amazon.com',
    google_contact_resource_name: 'people/c40596879',
    status: 'lead',
    notes: 'Parent inquired about daycare combo hours up to 6:30 PM.',
    fee_amount: 110000,
    fee_paid: false,
    lead_source: 'Indiranagar RWA Community Flyer',
  },
  {
    id: 'stud-5',
    campus_id: 'campus-blr-1',
    full_name: 'Ananya Sharma',
    date_of_birth: '2023-11-05',
    program_grade: 'Nursery',
    parent_name: 'Rohan Sharma',
    parent_phone: '+91 99165 33441',
    parent_email: 'rohan.sharma@flipkart.com',
    google_contact_resource_name: 'people/c50697881',
    status: 'admitted',
    emergency_contact: '+91 99165 33441',
    notes: 'Enjoys kinetic sand and outdoor sensory garden.',
    fee_amount: 95000,
    fee_paid: false,
  },
  {
    id: 'stud-6',
    campus_id: 'campus-blr-1',
    full_name: 'Kabir Khan',
    date_of_birth: '2024-07-30',
    program_grade: 'Daycare',
    parent_name: 'Dr. Zoya Khan',
    parent_phone: '+91 98458 77665',
    parent_email: 'zoya.khan@apollohospitals.com',
    google_contact_resource_name: 'people/c60798892',
    status: 'tour_completed',
    emergency_contact: '+91 98458 77665',
    notes: 'Visited campus on Saturday. Positive response on infant nap room.',
    fee_amount: 125000,
    fee_paid: false,
    lead_source: 'Pediatric Clinic Notice Board',
  },
];

const SEED_DAILY_LOGS: DailyLog[] = [
  {
    id: 'log-1',
    student_id: 'stud-1',
    logged_by_id: 'user-teacher-1',
    log_date: new Date().toISOString().split('T')[0],
    attendance: 'present',
    meal_status: 'ate_full',
    nap_minutes: 45,
    mood_emoji: '😄',
    notes: 'Ate full bowl of warm vegetable khichdi independently! Explored water wheel.',
    observation_photo_url: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=500&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
  },
  {
    id: 'log-2',
    student_id: 'stud-3',
    logged_by_id: 'user-teacher-1',
    log_date: new Date().toISOString().split('T')[0],
    attendance: 'present',
    meal_status: 'ate_half',
    nap_minutes: 50,
    mood_emoji: '😊',
    notes: 'Rested calmly with soft lullaby. Enjoyed tactile red playdough rolling.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'log-3',
    student_id: 'stud-5',
    logged_by_id: 'user-teacher-2',
    log_date: new Date().toISOString().split('T')[0],
    attendance: 'present',
    meal_status: 'ate_full',
    nap_minutes: 40,
    mood_emoji: '🌟',
    notes: 'Recognized phonics sound /m/ for monkey. Super energetic in outdoor circle time.',
    created_at: new Date().toISOString(),
  },
];

const SEED_VENDOR_ORDERS: VendorOrder[] = [
  {
    id: 'po-1',
    campus_id: 'campus-blr-1',
    category: 'EVA Foam Flooring',
    vendor_name: 'SafePlay India Mats Pvt Ltd',
    item_details: '1200 sq ft 25mm high-density interlocking antibacterial foam tiles (dual color teal & sunshine yellow)',
    amount: 72000,
    safety_certified: true,
    status: 'installed_verified',
  },
  {
    id: 'po-2',
    campus_id: 'campus-blr-1',
    category: 'Childproofing Hardware',
    vendor_name: 'ToddlerSafe Architectural Hardware',
    item_details: '18x Hinge pinch guards (180 deg), 42x soft foam table edge bumpers, 24x magnetic hidden latches',
    amount: 34500,
    safety_certified: true,
    status: 'safety_approved',
  },
  {
    id: 'po-3',
    campus_id: 'campus-blr-1',
    category: 'Multi-Split ACs & HEPA',
    vendor_name: 'Daikin Premium Air Conditioning Solutions',
    item_details: '4x 1.5-Ton 5-Star Inverter ACs with PM2.5 filter mesh & low vibration wall mounts',
    amount: 215000,
    safety_certified: true,
    status: 'installed_verified',
  },
  {
    id: 'po-4',
    campus_id: 'campus-blr-1',
    category: 'Fire Safety Refills',
    vendor_name: 'Ceasefire Industries Ltd',
    item_details: '6x 4kg MAP 90 ABC Extinguishers, 2x CO2 2kg, 4x Standalone optical smoke alarms',
    amount: 26000,
    safety_certified: true,
    status: 'quote_received',
  },
  {
    id: 'po-5',
    campus_id: 'campus-blr-1',
    category: 'Child-Safe Wooden Play Furniture',
    vendor_name: 'KidoCraft Ergonomic Woods',
    item_details: '8x Crescent adjustable tables, 24x Birch plywood chairs (26cm), 6x Low Montessori 3-tier shelves',
    amount: 148000,
    safety_certified: true,
    status: 'safety_approved',
  },
];

// -------------------------------------------------------------
// Context & State Interface
// -------------------------------------------------------------

interface ToddlerHQContextType {
  // Current Campus & Brand
  campus: Campus;
  brand: BrandInfo;
  setBrand: (brandId: string) => void;
  setCampusDetails: (details: Partial<Campus>) => void;

  // Operational Mode
  mode: OperationalMode;
  toggleMode: () => void;
  setMode: (mode: OperationalMode) => void;

  // Current Logged-in Staff User
  currentUser: StaffUser;
  setCurrentUserRole: (role: StaffRole) => void;
  staffList: StaffUser[];

  // Tasks & State Machine
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => Task;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  reassignTask: (taskId: string, newAssigneeId: string) => { success: boolean; error?: string };
  transitionTaskStatus: (taskId: string, targetStatus: TaskStatus) => { success: boolean; error?: string };
  attachProofToTask: (taskId: string, proofUrl: string, notes?: string) => void;
  verifyTask: (taskId: string) => { success: boolean; error?: string };

  // Students & CRM Pipeline
  students: Student[];
  addStudent: (student: Omit<Student, 'id' | 'created_at'>) => void;
  updateStudentStatus: (studentId: string, status: Student['status']) => void;
  markFeePaid: (studentId: string, paid: boolean) => void;

  // Daily Care Logs (Educator Console)
  dailyLogs: DailyLog[];
  updateAttendance: (studentId: string, status: AttendanceStatus) => void;
  logMeal: (studentId: string, mealStatus: MealStatus) => void;
  logNapMinutes: (studentId: string, minutes: number) => void;
  logMoodEmoji: (studentId: string, emoji: string) => void;
  addCareLogNote: (studentId: string, note: string) => void;

  // Vendors & POs
  vendorOrders: VendorOrder[];
  addVendorOrder: (order: Omit<VendorOrder, 'id'>) => void;
  updateVendorOrderStatus: (orderId: string, status: VendorOrder['status']) => void;

  // Google Workspace
  googleConnected: boolean;
  setGoogleConnected: (connected: boolean) => void;
  googleChatSpaces: typeof INITIAL_CHAT_SPACES;
  chatMessages: GoogleChatMessage[];
  sendChatMessage: (spaceId: string, content: string, isAlert?: boolean, priority?: Task['priority']) => void;
  driveFiles: GoogleDriveFile[];
  uploadDriveFile: (name: string, folder: string, fileType: 'image' | 'pdf') => void;
  gmailDispatches: GmailDispatch[];
  dispatchGmail: (dispatch: Omit<GmailDispatch, 'id' | 'timestamp' | 'status'>) => void;
  contactsSyncCount: number;
  syncGoogleContactsNow: () => number;

  // Reset to Seed
  resetToFactoryDefaults: () => void;
}

const ToddlerHQContext = createContext<ToddlerHQContextType | null>(null);

const STORAGE_KEY = 'toddlerhq_state_v1';

export function ToddlerHQProvider({ children }: { children: React.ReactNode }) {
  const [campus, setCampus] = useState<Campus>(SEED_CAMPUS);
  const [brand, setBrandState] = useState<BrandInfo>(() => getBrandById(SEED_CAMPUS.brand_id));
  const [mode, setModeState] = useState<OperationalMode>('setup');
  const [staffList, setStaffList] = useState<StaffUser[]>(SEED_STAFF);
  const [currentUser, setCurrentUserState] = useState<StaffUser>(SEED_STAFF[0]); // Starts as Founder
  const [tasks, setTasks] = useState<Task[]>(SEED_TASKS);
  const [students, setStudents] = useState<Student[]>(SEED_STUDENTS);
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>(SEED_DAILY_LOGS);
  const [vendorOrders, setVendorOrders] = useState<VendorOrder[]>(SEED_VENDOR_ORDERS);

  // Google Workspace Mock State
  const [googleConnected, setGoogleConnected] = useState<boolean>(true);
  const [googleChatSpaces] = useState(INITIAL_CHAT_SPACES);
  const [chatMessages, setChatMessages] = useState<GoogleChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [driveFiles, setDriveFiles] = useState<GoogleDriveFile[]>(INITIAL_DRIVE_FILES);
  const [gmailDispatches, setGmailDispatches] = useState<GmailDispatch[]>([
    {
      id: 'gml-1',
      toEmail: 'sneha.rao@gmail.com',
      recipientName: 'Sneha Rao',
      subject: 'Official Fee Receipt #REC-2026-081 | Maple Bear Canadian Preschool',
      type: 'fee_receipt',
      timestamp: 'Today, 10:15 AM',
      snippet: 'Thank you for your payment of ₹85,000 for Vihaan Rao (Playgroup). Receipt attached.',
      status: 'delivered',
    },
    {
      id: 'gml-2',
      toEmail: 'ananya.iyer@manipal.edu',
      recipientName: 'Dr. Ananya Iyer',
      subject: 'Confirmation: Experiential Campus Discovery Walkthrough Tomorrow',
      type: 'admission_offer',
      timestamp: 'Today, 11:30 AM',
      snippet: 'We look forward to welcoming you and Aarav tomorrow at 10:30 AM at Indiranagar campus.',
      status: 'delivered',
    },
  ]);
  const [contactsSyncCount, setContactsSyncCount] = useState<number>(6);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.campus) setCampus(parsed.campus);
        if (parsed.brand) setBrandState(parsed.brand);
        if (parsed.mode) setModeState(parsed.mode);
        if (parsed.staffList) setStaffList(parsed.staffList);
        if (parsed.currentUser) setCurrentUserState(parsed.currentUser);
        if (parsed.tasks) setTasks(parsed.tasks);
        if (parsed.students) setStudents(parsed.students);
        if (parsed.dailyLogs) setDailyLogs(parsed.dailyLogs);
        if (parsed.vendorOrders) setVendorOrders(parsed.vendorOrders);
      }
    } catch (e) {
      console.warn('Could not load ToddlerHQ localStorage state:', e);
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      const stateToSave = {
        campus,
        brand,
        mode,
        staffList,
        currentUser,
        tasks,
        students,
        dailyLogs,
        vendorOrders,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.warn('Could not save ToddlerHQ localStorage state:', e);
    }
  }, [campus, brand, mode, staffList, currentUser, tasks, students, dailyLogs, vendorOrders]);

  // Brand Switcher
  const setBrand = (brandId: string) => {
    const selectedBrand = getBrandById(brandId);
    setBrandState(selectedBrand);
    setCampus((prev) => ({
      ...prev,
      brand_id: selectedBrand.id,
      brand_name: selectedBrand.name,
      campus_name: `${selectedBrand.name} ${prev.locality ? prev.locality.split(' ')[0] : 'Indiranagar'} Campus`,
    }));
  };

  const setCampusDetails = (details: Partial<Campus>) => {
    setCampus((prev) => ({ ...prev, ...details }));
  };

  // Mode Switcher
  const toggleMode = () => {
    const nextMode: OperationalMode = mode === 'setup' ? 'operations' : 'setup';
    setModeState(nextMode);
    setCampus((prev) => ({ ...prev, current_mode: nextMode }));
  };

  const setMode = (newMode: OperationalMode) => {
    setModeState(newMode);
    setCampus((prev) => ({ ...prev, current_mode: newMode }));
  };

  // User Role Switcher
  const setCurrentUserRole = (role: StaffRole) => {
    const matched = staffList.find((s) => s.role === role) || staffList[0];
    setCurrentUserState(matched);
  };

  // Task Operations
  const addTask = (taskInput: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Task => {
    const newTask: Task = {
      ...taskInput,
      id: `task-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);

    // If safety critical, auto-post to Google Chat alerts space!
    if (newTask.priority === 'safety_critical') {
      sendChatMessage(
        'space-alerts',
        `⚠️ NEW SAFETY CRITICAL TASK: "${newTask.title}" assigned in ${newTask.department}. Verification proof is mandatory.`,
        true,
        'safety_critical'
      );
    }

    return newTask;
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...updates, updated_at: new Date().toISOString() } : t))
    );
  };

  const reassignTask = (taskId: string, newAssigneeId: string) => {
    const targetUser = staffList.find((s) => s.id === newAssigneeId);
    if (!targetUser) return { success: false, error: 'Target staff user not found' };

    // Check Downstairs rule
    if (!canDelegateTo(currentUser, targetUser)) {
      return {
        success: false,
        error: `Downstairs Delegation Rule: As ${currentUser.designation}, you cannot delegate upwards to ${targetUser.designation}.`,
      };
    }

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, assigned_to_id: newAssigneeId, updated_at: new Date().toISOString() } : t))
    );
    return { success: true };
  };

  const transitionTaskStatus = (taskId: string, targetStatus: TaskStatus) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return { success: false, error: 'Task not found' };

    const check = canTransitionTaskStatus(
      task.status,
      targetStatus,
      currentUser,
      task.requires_proof,
      Boolean(task.proof_image_url)
    );

    if (!check.allowed) {
      return { success: false, error: check.reason };
    }

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: targetStatus,
              updated_at: new Date().toISOString(),
              ...(targetStatus === 'verified'
                ? { verified_by_id: currentUser.id, verified_at: new Date().toISOString() }
                : {}),
            }
          : t
      )
    );

    return { success: true };
  };

  const attachProofToTask = (taskId: string, proofUrl: string, notes?: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              proof_image_url: proofUrl,
              proof_notes: notes || t.proof_notes,
              updated_at: new Date().toISOString(),
            }
          : t
      )
    );

    // Auto archive to Google Drive
    uploadDriveFile(
      `Proof_${taskId}_${Date.now().toString().slice(-4)}.jpg`,
      '/PreschoolOS/Indiranagar/2026/Compliance/Civil & Childproofing Proofs/',
      'image'
    );
  };

  const verifyTask = (taskId: string) => {
    if (!['founder', 'center_head', 'academic_lead'].includes(currentUser.role)) {
      return {
        success: false,
        error: 'Only Leadership (Founder, Center Head, Academic Lead) can sign-off and verify tasks.',
      };
    }

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: 'verified',
              verified_by_id: currentUser.id,
              verified_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
          : t
      )
    );

    return { success: true };
  };

  // Student Operations
  const addStudent = (studentInput: Omit<Student, 'id' | 'created_at'>) => {
    const newStudent: Student = {
      ...studentInput,
      id: `stud-${Date.now()}`,
    };
    setStudents((prev) => [newStudent, ...prev]);
    setContactsSyncCount((prev) => prev + 1);
  };

  const updateStudentStatus = (studentId: string, status: Student['status']) => {
    setStudents((prev) => prev.map((s) => (s.id === studentId ? { ...s, status } : s)));
  };

  const markFeePaid = (studentId: string, paid: boolean) => {
    setStudents((prev) => prev.map((s) => (s.id === studentId ? { ...s, fee_paid: paid } : s)));
  };

  // Daily Care Logs
  const updateAttendance = (studentId: string, attendanceStatus: AttendanceStatus) => {
    const today = new Date().toISOString().split('T')[0];
    setDailyLogs((prev) => {
      const existing = prev.find((l) => l.student_id === studentId && l.log_date === today);
      if (existing) {
        return prev.map((l) => (l.id === existing.id ? { ...l, attendance: attendanceStatus } : l));
      } else {
        const newLog: DailyLog = {
          id: `log-${Date.now()}`,
          student_id: studentId,
          logged_by_id: currentUser.id,
          log_date: today,
          attendance: attendanceStatus,
          nap_minutes: 0,
          mood_emoji: '😊',
          created_at: new Date().toISOString(),
        };
        return [newLog, ...prev];
      }
    });
  };

  const logMeal = (studentId: string, mealStatus: MealStatus) => {
    const today = new Date().toISOString().split('T')[0];
    setDailyLogs((prev) => {
      const existing = prev.find((l) => l.student_id === studentId && l.log_date === today);
      if (existing) {
        return prev.map((l) => (l.id === existing.id ? { ...l, meal_status: mealStatus } : l));
      } else {
        const newLog: DailyLog = {
          id: `log-${Date.now()}`,
          student_id: studentId,
          logged_by_id: currentUser.id,
          log_date: today,
          attendance: 'present',
          meal_status: mealStatus,
          nap_minutes: 0,
          mood_emoji: '😊',
          created_at: new Date().toISOString(),
        };
        return [newLog, ...prev];
      }
    });
  };

  const logNapMinutes = (studentId: string, minutes: number) => {
    const today = new Date().toISOString().split('T')[0];
    setDailyLogs((prev) => {
      const existing = prev.find((l) => l.student_id === studentId && l.log_date === today);
      if (existing) {
        return prev.map((l) => (l.id === existing.id ? { ...l, nap_minutes: minutes } : l));
      } else {
        const newLog: DailyLog = {
          id: `log-${Date.now()}`,
          student_id: studentId,
          logged_by_id: currentUser.id,
          log_date: today,
          attendance: 'present',
          nap_minutes: minutes,
          mood_emoji: '😴',
          created_at: new Date().toISOString(),
        };
        return [newLog, ...prev];
      }
    });
  };

  const logMoodEmoji = (studentId: string, emoji: string) => {
    const today = new Date().toISOString().split('T')[0];
    setDailyLogs((prev) => {
      const existing = prev.find((l) => l.student_id === studentId && l.log_date === today);
      if (existing) {
        return prev.map((l) => (l.id === existing.id ? { ...l, mood_emoji: emoji } : l));
      } else {
        const newLog: DailyLog = {
          id: `log-${Date.now()}`,
          student_id: studentId,
          logged_by_id: currentUser.id,
          log_date: today,
          attendance: 'present',
          nap_minutes: 0,
          mood_emoji: emoji,
          created_at: new Date().toISOString(),
        };
        return [newLog, ...prev];
      }
    });
  };

  const addCareLogNote = (studentId: string, note: string) => {
    const today = new Date().toISOString().split('T')[0];
    setDailyLogs((prev) => {
      const existing = prev.find((l) => l.student_id === studentId && l.log_date === today);
      if (existing) {
        return prev.map((l) => (l.id === existing.id ? { ...l, notes: note } : l));
      } else {
        const newLog: DailyLog = {
          id: `log-${Date.now()}`,
          student_id: studentId,
          logged_by_id: currentUser.id,
          log_date: today,
          attendance: 'present',
          nap_minutes: 0,
          mood_emoji: '😊',
          notes: note,
          created_at: new Date().toISOString(),
        };
        return [newLog, ...prev];
      }
    });
  };

  // Vendor POs
  const addVendorOrder = (orderInput: Omit<VendorOrder, 'id'>) => {
    const newOrder: VendorOrder = {
      ...orderInput,
      id: `po-${Date.now()}`,
    };
    setVendorOrders((prev) => [newOrder, ...prev]);
  };

  const updateVendorOrderStatus = (orderId: string, status: VendorOrder['status']) => {
    setVendorOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  };

  // Google Workspace Handlers
  const sendChatMessage = (
    spaceId: string,
    content: string,
    isAlert = false,
    priority?: Task['priority']
  ) => {
    const targetSpace = googleChatSpaces.find((s) => s.id === spaceId);
    const spaceName = targetSpace ? targetSpace.name : 'Urgent Campus Alerts';
    const newMsg: GoogleChatMessage = {
      id: `msg-${Date.now()}`,
      spaceId,
      spaceName,
      senderName: currentUser.full_name,
      senderAvatar: currentUser.role === 'founder' ? '👨‍💼' : currentUser.role === 'center_head' ? '👩‍🏫' : '👩‍💼',
      senderRole: currentUser.designation,
      timestamp: 'Just now',
      content,
      isAlertCard: isAlert,
      alertPriority: priority,
    };
    setChatMessages((prev) => [newMsg, ...prev]);
  };

  const uploadDriveFile = (name: string, folder: string, fileType: 'image' | 'pdf') => {
    const newFile: GoogleDriveFile = {
      id: `drv-${Date.now()}`,
      name,
      path: folder,
      fileType,
      uploadedBy: `${currentUser.full_name} (${currentUser.designation})`,
      timestamp: 'Today',
      size: `${(Math.random() * 3 + 1).toFixed(1)} MB`,
      verified: true,
    };
    setDriveFiles((prev) => [newFile, ...prev]);
  };

  const dispatchGmail = (dispatch: Omit<GmailDispatch, 'id' | 'timestamp' | 'status'>) => {
    const newDispatch: GmailDispatch = {
      ...dispatch,
      id: `gml-${Date.now()}`,
      timestamp: 'Just now',
      status: 'delivered',
    };
    setGmailDispatches((prev) => [newDispatch, ...prev]);
  };

  const syncGoogleContactsNow = () => {
    const count = students.length;
    setContactsSyncCount(count);
    return count;
  };

  const resetToFactoryDefaults = () => {
    localStorage.removeItem(STORAGE_KEY);
    setCampus(SEED_CAMPUS);
    setBrandState(getBrandById(SEED_CAMPUS.brand_id));
    setModeState('setup');
    setStaffList(SEED_STAFF);
    setCurrentUserState(SEED_STAFF[0]);
    setTasks(SEED_TASKS);
    setStudents(SEED_STUDENTS);
    setDailyLogs(SEED_DAILY_LOGS);
    setVendorOrders(SEED_VENDOR_ORDERS);
    setChatMessages(INITIAL_CHAT_MESSAGES);
    setDriveFiles(INITIAL_DRIVE_FILES);
  };

  return (
    <ToddlerHQContext.Provider
      value={{
        campus,
        brand,
        setBrand,
        setCampusDetails,
        mode,
        toggleMode,
        setMode,
        currentUser,
        setCurrentUserRole,
        staffList,
        tasks,
        addTask,
        updateTask,
        reassignTask,
        transitionTaskStatus,
        attachProofToTask,
        verifyTask,
        students,
        addStudent,
        updateStudentStatus,
        markFeePaid,
        dailyLogs,
        updateAttendance,
        logMeal,
        logNapMinutes,
        logMoodEmoji,
        addCareLogNote,
        vendorOrders,
        addVendorOrder,
        updateVendorOrderStatus,
        googleConnected,
        setGoogleConnected,
        googleChatSpaces,
        chatMessages,
        sendChatMessage,
        driveFiles,
        uploadDriveFile,
        gmailDispatches,
        dispatchGmail,
        contactsSyncCount,
        syncGoogleContactsNow,
        resetToFactoryDefaults,
      }}
    >
      {children}
    </ToddlerHQContext.Provider>
  );
}

export function useToddlerHQ() {
  const ctx = useContext(ToddlerHQContext);
  if (!ctx) {
    throw new Error('useToddlerHQ must be used within ToddlerHQProvider');
  }
  return ctx;
}
