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
  AppNavTab,
  Stakeholder,
  CommunicationLog,
  SchoolConfig,
  ToolPermission,
  GoogleAuthSession,
  WhatsAppTemplate,
  GoogleNativeAsset,
  CampusSetupInput,
} from '@/types/toddlerhq';
import { PRESCHOOL_BRANDS, getBrandById } from '@/lib/brands';
import { canDelegateTo, canTransitionTaskStatus } from '@/lib/hierarchy';
import { GOOGLE_NATIVE_ASSETS } from '@/lib/googleNativeRegistry';
import {
  INITIAL_CHAT_MESSAGES,
  INITIAL_CHAT_SPACES,
  INITIAL_DRIVE_FILES,
  DEFAULT_WHATSAPP_TEMPLATES,
  DEFAULT_TOOL_PERMISSIONS,
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

const SEED_SCHOOL_CONFIG: SchoolConfig = {
  brandId: 'maple-bear',
  brandName: 'Maple Bear Canadian Preschool',
  campusName: 'Maple Bear Indiranagar Campus',
  city: 'Bengaluru',
  locality: 'Indiranagar 100ft Road',
  pincode: '560038',
  state: 'Karnataka',
  totalCapacity: 120,
  operatingHours: '08:30 AM – 12:30 PM (Daycare till 06:30 PM)',
  gradesOffered: ['Playgroup', 'Nursery', 'LKG', 'UKG', 'Daycare'],
  feesMonthly: {
    Playgroup: 8500,
    Nursery: 9500,
    LKG: 10500,
    UKG: 11000,
    Daycare: 14000,
  },
  mealsProvision: 'in_house_kitchen',
  transportProvision: 'school_vans_gps',
  emergencyContact: '+91 98450 11223',
  cctvEnabled: true,
  fireNocStatus: 'approved',
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
    id: 'user-franchise-hq',
    campus_id: 'campus-blr-1',
    full_name: 'Vikram Malhotra',
    email: 'audit.south@franchise-hq.com',
    phone: '+91 98100 11223',
    role: 'franchise_hq',
    designation: 'National Brand & Quality Auditor',
    reports_to_id: null,
    google_email: 'audit.south@franchise-hq.com',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    is_active: true,
    department: 'Franchise HQ',
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
    id: 'user-didi-1',
    campus_id: 'campus-blr-1',
    full_name: 'Lakshmi Bai',
    email: 'lakshmi.support@maplebear.in',
    phone: '+91 97310 99887',
    role: 'didi',
    designation: 'Senior Daycare Ayah / Didi & Hygiene Lead',
    reports_to_id: 'user-principal',
    google_email: 'lakshmi.support@maplebear.in',
    avatar_url: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=150&auto=format&fit=crop&q=80',
    is_active: true,
    department: 'Operations',
  },
  {
    id: 'user-mentor-1',
    campus_id: 'campus-blr-1',
    full_name: 'Prof. Aruna Swaminathan',
    email: 'aruna.swami@gmail.com',
    phone: '+91 98200 33445',
    role: 'mentor',
    designation: 'Early Childhood Pedagogy Advisor & Mentor',
    reports_to_id: null,
    google_email: 'aruna.swami@gmail.com',
    avatar_url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    is_active: true,
    department: 'Advisory',
  },
  {
    id: 'user-parent-demo',
    campus_id: 'campus-blr-1',
    full_name: 'Rohit Sen (Parent of Samaira)',
    email: 'rohit.sen@microsoft.com',
    phone: '+91 98450 67890',
    role: 'parent',
    designation: 'Parent & Guardian',
    reports_to_id: null,
    google_email: 'rohit.sen@microsoft.com',
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    is_active: true,
    department: 'Parents',
  },
  {
    id: 'user-accountant',
    campus_id: 'campus-blr-1',
    full_name: 'Suresh Narayanan',
    email: 'accounts.indiranagar@maplebear.in',
    phone: '+91 98450 44332',
    role: 'accountant',
    designation: 'Finance & Admin Officer',
    reports_to_id: 'user-founder',
    google_email: 'accounts.indiranagar@maplebear.in',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    is_active: true,
    department: 'Finance',
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
      'Trim edge borders flush against skirtings with no gaps',
    ],
    verified_by_id: 'user-founder',
    verified_at: new Date().toISOString(),
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'task-2',
    campus_id: 'campus-blr-1',
    department: 'Legal',
    title: 'Obtain Fire Department Provisional NOC & Heat Sensors Clearance',
    description: 'Procure Fire & Emergency Services inspection certificate. Ensure ABC-powder fire extinguishers are mounted at 3.5 ft child-inaccessible height.',
    created_by_id: 'user-founder',
    assigned_to_id: 'user-principal',
    priority: 'safety_critical',
    status: 'in_progress',
    requires_proof: true,
    sop_steps: [
      'Install 4x 4kg ABC dry powder extinguishers at labeled stations',
      'Clear dual 1.5m emergency exit stairwell passageways',
      'Schedule municipal fire officer on-site inspection walkthrough',
    ],
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'task-3',
    campus_id: 'campus-blr-1',
    department: 'Safety',
    title: 'Mount Zero-Pinch Finger Guards on All Classroom Doors',
    description: 'Dual-sided hinge pinch guards to prevent severe toddler finger crushing accidents. Must cover full 180-degree door swing arc.',
    created_by_id: 'user-founder',
    assigned_to_id: 'user-principal',
    priority: 'safety_critical',
    status: 'todo',
    requires_proof: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'task-4',
    campus_id: 'campus-blr-1',
    department: 'Academic',
    title: 'Verify Canadian Experiential Sensory Kits & Wooden Block Inventory',
    description: 'Inspect Montessori sensorial apparatus, cylinders, rough-smooth boards, and bilingual sound immersion books.',
    created_by_id: 'user-principal',
    assigned_to_id: 'user-lead',
    priority: 'high',
    status: 'todo',
    requires_proof: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'task-5',
    campus_id: 'campus-blr-1',
    department: 'Marketing',
    title: 'Launch WhatsApp Parent Walkthrough Campaign for Indiranagar Tech RWAs',
    description: 'Send high-conversion experiential play tour invites to 50 parent inquiries via 1-click WhatsApp.',
    created_by_id: 'user-founder',
    assigned_to_id: 'user-admissions',
    priority: 'medium',
    status: 'in_progress',
    requires_proof: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const SEED_STUDENTS: Student[] = [
  {
    id: 'stud-1',
    campus_id: 'campus-blr-1',
    full_name: 'Samaira Sen',
    date_of_birth: '2023-04-12',
    program_grade: 'Playgroup',
    parent_name: 'Rohit Sen',
    parent_phone: '+91 98450 67890',
    parent_email: 'rohit.sen@microsoft.com',
    status: 'admitted',
    emergency_contact: '+91 98450 67891 (Tanya Sen, Mother)',
    allergies_dietary: 'Lactose sensitive (needs almond/oat milk for afternoon snack)',
    fee_amount: 85000,
    fee_paid: false,
    notes: 'Very inquisitive, loves tactile sensory bins and circle time rhymes.',
  },
  {
    id: 'stud-2',
    campus_id: 'campus-blr-1',
    full_name: 'Reyansh Reddy',
    date_of_birth: '2022-11-25',
    program_grade: 'Nursery',
    parent_name: 'Deepa Reddy',
    parent_phone: '+91 98860 12345',
    parent_email: 'deepa.reddy@accenture.com',
    status: 'admitted',
    emergency_contact: '+91 98860 12346',
    fee_amount: 95000,
    fee_paid: true,
    notes: 'Loves building high wooden block towers and sandbox water wheels.',
  },
  {
    id: 'stud-3',
    campus_id: 'campus-blr-1',
    full_name: 'Aanya Kulkarni',
    date_of_birth: '2022-02-18',
    program_grade: 'LKG',
    parent_name: 'Amit Kulkarni',
    parent_phone: '+91 99002 98765',
    parent_email: 'amit.kulkarni@infosys.com',
    status: 'admitted',
    fee_amount: 105000,
    fee_paid: false,
    notes: 'Recent transfer from Pune. Practicing pincer grip and scissor control.',
  },
  {
    id: 'stud-4',
    campus_id: 'campus-blr-1',
    full_name: 'Kabir Varma',
    date_of_birth: '2023-08-05',
    program_grade: 'Daycare',
    parent_name: 'Pooja Varma',
    parent_phone: '+91 97410 44332',
    parent_email: 'pooja.varma@amazon.com',
    status: 'admitted',
    fee_amount: 140000,
    fee_paid: true,
    notes: 'Needs 1:30 PM post-lunch nap with soft instrumental background music.',
  },
  {
    id: 'stud-5',
    campus_id: 'campus-blr-1',
    full_name: 'Aarav Iyer',
    date_of_birth: '2023-01-15',
    program_grade: 'Nursery',
    parent_name: 'Dr. Ananya Iyer',
    parent_phone: '+91 98800 88990',
    parent_email: 'ananya.iyer@manipal.edu',
    status: 'tour_scheduled',
    fee_amount: 95000,
    fee_paid: false,
    tour_date: 'Tomorrow, 10:30 AM',
    notes: 'Inquired about bilingual French-English immersion & sand pit safety.',
  },
];

const SEED_STAKEHOLDERS: Stakeholder[] = [
  {
    id: 'stk-1',
    name: 'Rohit Sen',
    type: 'parent',
    phone: '+91 98450 67890',
    email: 'rohit.sen@microsoft.com',
    roleTitle: 'Parent of Samaira Sen (Playgroup)',
    relationDetails: 'Father • Tech Lead at Microsoft',
    feeStatus: 'due',
    dueAmount: 85000,
    grade: 'Playgroup',
    preferredChannel: 'whatsapp',
    notes: 'Requested fee installment link via WhatsApp. Prefers afternoon updates.',
    tags: ['Enrolled', 'Fee Due', 'High Priority'],
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'stk-2',
    name: 'Deepa Reddy',
    type: 'parent',
    phone: '+91 98860 12345',
    email: 'deepa.reddy@accenture.com',
    roleTitle: 'Parent of Reyansh Reddy (Nursery)',
    relationDetails: 'Mother • Director at Accenture',
    feeStatus: 'paid',
    dueAmount: 0,
    grade: 'Nursery',
    preferredChannel: 'whatsapp',
    notes: 'Active in parent-teacher committee. Very satisfied with sensory play.',
    tags: ['Enrolled', 'Fee Paid', 'PTA Member'],
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'stk-3',
    name: 'Vikram Malhotra',
    type: 'franchise',
    phone: '+91 98100 11223',
    email: 'audit.south@franchise-hq.com',
    roleTitle: 'Regional Franchise Auditor (Franchise Head Office)',
    relationDetails: 'National Brand & Quality Assurance Team',
    feeStatus: 'not_applicable',
    preferredChannel: 'gmail',
    notes: 'Conducting biannual preschool brand audit next Tuesday. Requires 25mm EVA certification.',
    tags: ['Franchise HQ', 'Quality Audit', 'Compliance'],
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'stk-4',
    name: 'Prof. Aruna Swaminathan',
    type: 'mentor',
    phone: '+91 98200 33445',
    email: 'aruna.swami@gmail.com',
    roleTitle: 'Pedagogy & Early Years Mentor',
    relationDetails: 'Former NCERT Foundation Stage Advisor',
    feeStatus: 'not_applicable',
    preferredChannel: 'call',
    notes: 'Monthly advisory call on NEP 2020 NIPUN Bharat curriculum adaptation.',
    tags: ['Advisory Board', 'Mentor', 'Pedagogy'],
    avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'stk-5',
    name: 'Lakshmi Bai',
    type: 'didi',
    phone: '+91 97310 99887',
    email: 'lakshmi.support@maplebear.in',
    roleTitle: 'Senior Daycare Ayah / Didi & Caregiver',
    relationDetails: 'Full-time Toddler Care & Nap Room Supervisor',
    feeStatus: 'not_applicable',
    preferredChannel: 'call',
    notes: 'Oversees infant meal distribution, hygiene, diaper changing, and cot sanitation.',
    tags: ['Staff', 'Didi', 'Hygiene Lead'],
    avatarUrl: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'stk-6',
    name: 'Kavita Sen',
    type: 'teacher',
    phone: '+91 98440 22334',
    email: 'kavita.playgroup@maplebear.in',
    roleTitle: 'Playgroup Head Educator',
    relationDetails: 'Montessori & Sensory Specialist',
    feeStatus: 'not_applicable',
    preferredChannel: 'chat',
    notes: 'Prepares weekly sensory and water play plans.',
    tags: ['Teacher', 'Playgroup', 'Sensory'],
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'stk-7',
    name: 'SafePlay India Mats Pvt Ltd',
    type: 'vendor',
    phone: '+91 98111 22233',
    email: 'orders@safeplayindia.com',
    roleTitle: 'Certified EVA Flooring & Play Equipment Contractor',
    relationDetails: 'Primary vendor for soft play zones & safety netting',
    feeStatus: 'not_applicable',
    preferredChannel: 'whatsapp',
    notes: 'Warranty valid for 24 months. Provides non-toxic ASTM certified EVA mats.',
    tags: ['Vendor', 'Civil & Safety', 'EVA Mats'],
    avatarUrl: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'stk-8',
    name: 'Dr. Ananya Iyer',
    type: 'lead',
    phone: '+91 98800 88990',
    email: 'ananya.iyer@manipal.edu',
    roleTitle: 'Admissions Lead (Mother of Aarav, 2.5 yrs)',
    relationDetails: 'Inquiry via Google Form • Pediatrician at Manipal Hospital',
    feeStatus: 'not_applicable',
    preferredChannel: 'whatsapp',
    notes: 'Scheduled for campus walkthrough tomorrow at 10:30 AM. Send WhatsApp reminder.',
    tags: ['Hot Lead', 'Walkthrough Scheduled', 'Nursery'],
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
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
    nap_minutes: 60,
    mood_emoji: '😄',
    notes: 'Delighted with water color sponge dab activity. Drank 150ml warm milk before nap.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'log-2',
    student_id: 'stud-2',
    logged_by_id: 'user-teacher-2',
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
    student_id: 'stud-3',
    logged_by_id: 'user-teacher-1',
    log_date: new Date().toISOString().split('T')[0],
    attendance: 'present',
    meal_status: 'ate_full',
    nap_minutes: 45,
    mood_emoji: '🌟',
    notes: 'Super energetic in outdoor circle time. Practiced counting colored beads.',
    created_at: new Date().toISOString(),
  },
];

const SEED_VENDOR_ORDERS: VendorOrder[] = [
  {
    id: 'po-1',
    campus_id: 'campus-blr-1',
    category: 'EVA Foam Flooring',
    vendor_name: 'SafePlay India Mats Pvt Ltd',
    item_details: '1200 sq ft 25mm high-density interlocking antibacterial foam tiles (teal & sunshine yellow)',
    amount: 72000,
    safety_certified: true,
    status: 'installed_verified',
    delivery_eta: 'Completed',
  },
  {
    id: 'po-2',
    campus_id: 'campus-blr-1',
    category: 'CCTV Surveillance',
    vendor_name: 'SecureEye Systems Bangalore',
    item_details: '16x IP 4MP Zero-Blindspot CCTV cameras with cloud recording and parent live-stream app integration',
    amount: 98000,
    safety_certified: true,
    status: 'safety_approved',
    delivery_eta: 'In Progress',
  },
];

// -------------------------------------------------------------
// Context & State Interface
// -------------------------------------------------------------

interface ToddlerHQContextType {
  // Navigation Tabs (5 Core Tabs)
  activeTab: AppNavTab;
  setActiveTab: (tab: AppNavTab) => void;

  // Current Campus, Brand & Configuration
  campus: Campus;
  brand: BrandInfo;
  setBrand: (brandId: string) => void;
  setCampusDetails: (details: Partial<Campus>) => void;
  schoolConfig: SchoolConfig;
  updateSchoolConfig: (partial: Partial<SchoolConfig>) => void;

  // Operational Mode (Setup vs Operations)
  mode: OperationalMode;
  toggleMode: () => void;
  setMode: (mode: OperationalMode) => void;

  // Current Logged-in Staff User / Role Switcher
  currentUser: StaffUser;
  setCurrentUserRole: (role: StaffRole) => void;
  staffList: StaffUser[];
  inviteTeamMember: (data: {
    name: string;
    email: string;
    role: StaffRole;
    phone: string;
    department?: string;
  }) => void;

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

  // Stakeholders Directory & Communication CRM
  stakeholders: Stakeholder[];
  addStakeholder: (stakeholder: Omit<Stakeholder, 'id'>) => void;
  updateStakeholder: (id: string, updates: Partial<Stakeholder>) => void;
  deleteStakeholder: (id: string) => void;
  communicationLogs: CommunicationLog[];
  logCommunication: (log: Omit<CommunicationLog, 'id' | 'sentAt'>) => void;
  generateWhatsAppLink: (stakeholder: Stakeholder, template: WhatsAppTemplate) => string;

  // Daily Care Logs (Educator & Didi Console)
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

  // Google Workspace Persistent Authentication & Tools
  googleAuth: GoogleAuthSession;
  connectGoogle: (account?: Partial<GoogleAuthSession>) => void;
  disconnectGoogle: () => void;
  switchGoogleAccount: (email: string) => void;

  // 0-Contacts Diagnostic
  isContactsDiagnosticOpen: boolean;
  setIsContactsDiagnosticOpen: (open: boolean) => void;
  contactsSyncCount: number;
  syncGoogleContactsNow: () => number;

  // Google Workspace Chat, Drive, Gmail
  googleChatSpaces: typeof INITIAL_CHAT_SPACES;
  chatMessages: GoogleChatMessage[];
  sendChatMessage: (spaceId: string, content: string, isAlert?: boolean, priority?: Task['priority']) => void;
  driveFiles: GoogleDriveFile[];
  uploadDriveFile: (name: string, folder: string, fileType: GoogleDriveFile['fileType']) => void;
  gmailDispatches: GmailDispatch[];
  dispatchGmail: (dispatch: Omit<GmailDispatch, 'id' | 'timestamp' | 'status'>) => void;

  // AI Tool Permissions
  aiToolPermissions: ToolPermission[];
  setAIToolPermission: (tool: ToolPermission['tool'], level: ToolPermission['level'], autoDraft?: boolean) => void;

  // Google Native Assets Registry & Deep Links
  googleNativeAssets: GoogleNativeAsset[];
  updateGoogleNativeAsset: (id: string, updates: Partial<GoogleNativeAsset>) => void;
  applyCampusSetup: (input: CampusSetupInput) => void;
  removeStaffMember: (id: string) => void;

  // Reset State
  resetToFactoryDefaults: () => void;
}

const ToddlerHQContext = createContext<ToddlerHQContextType | null>(null);

const STORAGE_KEY = 'toddlerhq_state_v2';
const GOOGLE_AUTH_STORAGE_KEY = 'toddlerhq_google_auth_v2';

export function ToddlerHQProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<AppNavTab>('onboarding');

  const [campus, setCampus] = useState<Campus>(SEED_CAMPUS);
  const [brand, setBrandState] = useState<BrandInfo>(() => getBrandById(SEED_CAMPUS.brand_id));
  const [schoolConfig, setSchoolConfig] = useState<SchoolConfig>(SEED_SCHOOL_CONFIG);
  const [mode, setModeState] = useState<OperationalMode>('setup');
  const [staffList, setStaffList] = useState<StaffUser[]>(SEED_STAFF);
  const [currentUser, setCurrentUserState] = useState<StaffUser>(SEED_STAFF[0]); // Starts as Founder
  const [tasks, setTasks] = useState<Task[]>(SEED_TASKS);
  const [students, setStudents] = useState<Student[]>(SEED_STUDENTS);
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>(SEED_STAKEHOLDERS);
  const [communicationLogs, setCommunicationLogs] = useState<CommunicationLog[]>([]);
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>(SEED_DAILY_LOGS);
  const [vendorOrders, setVendorOrders] = useState<VendorOrder[]>(SEED_VENDOR_ORDERS);

  // Persistent Google Auth Session (default connected to mock Google session, but can be disconnected)
  const [googleAuth, setGoogleAuth] = useState<GoogleAuthSession>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(GOOGLE_AUTH_STORAGE_KEY);
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.warn('Could not read google auth', e);
      }
    }
    return {
      connected: true,
      email: 'rajesh.mehta@edufranchise.com',
      name: 'Rajesh Mehta',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      connectedAt: 'Today, 8:00 AM',
      provider: 'google',
      secondaryGmail: 'rajesh.personal@gmail.com',
      contactsCount: 8,
    };
  });

  const [isContactsDiagnosticOpen, setIsContactsDiagnosticOpen] = useState(false);
  const [contactsSyncCount, setContactsSyncCount] = useState<number>(8);
  const [googleChatSpaces] = useState(INITIAL_CHAT_SPACES);
  const [chatMessages, setChatMessages] = useState<GoogleChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [driveFiles, setDriveFiles] = useState<GoogleDriveFile[]>(INITIAL_DRIVE_FILES);
  const [gmailDispatches, setGmailDispatches] = useState<GmailDispatch[]>([
    {
      id: 'gml-1',
      toEmail: 'rohit.sen@microsoft.com',
      recipientName: 'Rohit Sen',
      subject: 'Official Fee Receipt #REC-2026-081 | Maple Bear Canadian Preschool',
      type: 'fee_receipt',
      timestamp: 'Today, 10:15 AM',
      snippet: 'Thank you for your fee payment for Samaira Sen (Playgroup). Official receipt attached.',
      status: 'delivered',
    },
  ]);
  const [aiToolPermissions, setAIToolPermissions] = useState<ToolPermission[]>(DEFAULT_TOOL_PERMISSIONS);
  const [googleNativeAssets, setGoogleNativeAssets] = useState<GoogleNativeAsset[]>(GOOGLE_NATIVE_ASSETS);

  // Rehydrate state from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.campus) setCampus(parsed.campus);
        if (parsed.brand) setBrandState(parsed.brand);
        if (parsed.schoolConfig) setSchoolConfig(parsed.schoolConfig);
        if (parsed.mode) setModeState(parsed.mode);
        if (parsed.staffList) setStaffList(parsed.staffList);
        if (parsed.currentUser) setCurrentUserState(parsed.currentUser);
        if (parsed.tasks) setTasks(parsed.tasks);
        if (parsed.students) setStudents(parsed.students);
        if (parsed.stakeholders) setStakeholders(parsed.stakeholders);
        if (parsed.dailyLogs) setDailyLogs(parsed.dailyLogs);
        if (parsed.vendorOrders) setVendorOrders(parsed.vendorOrders);
        if (parsed.activeTab) setActiveTab(parsed.activeTab);
        if (parsed.aiToolPermissions) setAIToolPermissions(parsed.aiToolPermissions);
      }
    } catch (e) {
      console.warn('Could not load ToddlerHQ localStorage state:', e);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      const stateToSave = {
        campus,
        brand,
        schoolConfig,
        mode,
        staffList,
        currentUser,
        tasks,
        students,
        stakeholders,
        dailyLogs,
        vendorOrders,
        activeTab,
        aiToolPermissions,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.warn('Could not save ToddlerHQ localStorage state:', e);
    }
  }, [
    campus,
    brand,
    schoolConfig,
    mode,
    staffList,
    currentUser,
    tasks,
    students,
    stakeholders,
    dailyLogs,
    vendorOrders,
    activeTab,
    aiToolPermissions,
  ]);

  // Save Google Auth separately
  useEffect(() => {
    try {
      localStorage.setItem(GOOGLE_AUTH_STORAGE_KEY, JSON.stringify(googleAuth));
    } catch (e) {
      console.warn('Could not save Google Auth state', e);
    }
  }, [googleAuth]);

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
    setSchoolConfig((prev) => ({
      ...prev,
      brandId: selectedBrand.id,
      brandName: selectedBrand.name,
      campusName: `${selectedBrand.name} ${campus.locality ? campus.locality.split(' ')[0] : 'Indiranagar'} Campus`,
    }));
  };

  const setCampusDetails = (details: Partial<Campus>) => {
    setCampus((prev) => ({ ...prev, ...details }));
  };

  const updateSchoolConfig = (partial: Partial<SchoolConfig>) => {
    setSchoolConfig((prev) => {
      const updated = { ...prev, ...partial };
      // Keep campus in sync
      if (partial.campusName) setCampus((c) => ({ ...c, campus_name: partial.campusName! }));
      if (partial.city) setCampus((c) => ({ ...c, city: partial.city! }));
      if (partial.locality) setCampus((c) => ({ ...c, locality: partial.locality! }));
      if (partial.pincode) setCampus((c) => ({ ...c, pincode: partial.pincode! }));
      if (partial.brandId) {
        const brandObj = getBrandById(partial.brandId);
        setBrandState(brandObj);
        setCampus((c) => ({ ...c, brand_id: brandObj.id, brand_name: brandObj.name }));
      }
      return updated;
    });
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

  // Current Logged-in Staff Role
  const setCurrentUserRole = (role: StaffRole) => {
    const existing = staffList.find((s) => s.role === role);
    if (existing) {
      setCurrentUserState(existing);
    } else {
      const syntheticUser: StaffUser = {
        id: `user-${role}`,
        campus_id: campus.id,
        full_name: `${role.toUpperCase()} User`,
        email: `${role}@maplebear.in`,
        phone: '+91 99999 00000',
        role,
        designation: role.replace('_', ' ').toUpperCase(),
        reports_to_id: null,
        google_email: `${role}@maplebear.in`,
        is_active: true,
      };
      setCurrentUserState(syntheticUser);
    }
  };

  // Google Connect & Disconnect handlers
  const connectGoogle = (account?: Partial<GoogleAuthSession>) => {
    const newSession: GoogleAuthSession = {
      connected: true,
      email: account?.email || 'rajesh.mehta@edufranchise.com',
      name: account?.name || 'Rajesh Mehta',
      avatarUrl:
        account?.avatarUrl ||
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      connectedAt: 'Just now',
      provider: 'google',
      secondaryGmail: account?.secondaryGmail || 'rajesh.personal@gmail.com',
      contactsCount: account?.contactsCount ?? 8,
    };
    setGoogleAuth(newSession);
  };

  const disconnectGoogle = () => {
    setGoogleAuth((prev) => ({
      ...prev,
      connected: false,
    }));
  };

  const switchGoogleAccount = (email: string) => {
    setGoogleAuth((prev) => ({
      ...prev,
      email,
      name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      connectedAt: 'Just now',
    }));
  };

  const syncGoogleContactsNow = () => {
    const count = stakeholders.length;
    setContactsSyncCount(count);
    setGoogleAuth((prev) => ({ ...prev, contactsCount: count }));
    return count;
  };

  // Invite Team Member by Gmail ID
  const inviteTeamMember = (data: {
    name: string;
    email: string;
    role: StaffRole;
    phone: string;
    department?: string;
  }) => {
    const newMember: StaffUser = {
      id: `staff-${Date.now()}`,
      campus_id: campus.id,
      full_name: data.name,
      email: data.email,
      google_email: data.email,
      phone: data.phone,
      role: data.role,
      designation: data.role.replace('_', ' ').toUpperCase(),
      reports_to_id: data.role === 'founder' ? null : 'user-founder',
      is_active: true,
      department: data.department || 'Operations',
      avatar_url: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000)}?w=150&auto=format&fit=crop&q=80`,
    };
    setStaffList((prev) => [...prev, newMember]);

    // Also add to Stakeholders directory
    const newStk: Stakeholder = {
      id: `stk-${Date.now()}`,
      name: data.name,
      type: data.role === 'mentor' ? 'mentor' : data.role === 'didi' ? 'didi' : 'team',
      phone: data.phone,
      email: data.email,
      roleTitle: `${data.role.replace('_', ' ').toUpperCase()} (${data.department || 'Operations'})`,
      preferredChannel: 'gmail',
      tags: ['Staff', data.role],
    };
    setStakeholders((prev) => [newStk, ...prev]);
  };

  const removeStaffMember = (id: string) => {
    setStaffList((prev) => prev.filter((s) => s.id !== id));
  };

  const updateGoogleNativeAsset = (id: string, updates: Partial<GoogleNativeAsset>) => {
    setGoogleNativeAssets((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates, lastUpdated: 'Just now' } : a))
    );
  };

  const applyCampusSetup = (input: CampusSetupInput) => {
    const selectedBrand = getBrandById(input.brand_id);
    setBrandState(selectedBrand);
    setCampus((prev) => ({
      ...prev,
      brand_id: selectedBrand.id,
      brand_name: selectedBrand.name,
      campus_name: input.campus_name,
      city: input.city,
      locality: input.locality,
      pincode: input.pincode,
    }));
    setSchoolConfig((prev) => ({
      ...prev,
      brandId: selectedBrand.id,
      brandName: selectedBrand.name,
      campusName: input.campus_name,
      city: input.city,
      locality: input.locality,
      pincode: input.pincode,
      cctvEnabled: input.cctv_cloud_enabled,
    }));
  };

  // Tasks actions
  const addTask = (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Task => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...updates, updated_at: new Date().toISOString() } : t))
    );
  };

  const reassignTask = (taskId: string, newAssigneeId: string) => {
    const targetTask = tasks.find((t) => t.id === taskId);
    const targetStaff = staffList.find((s) => s.id === newAssigneeId);
    if (!targetTask || !targetStaff) return { success: false, error: 'Task or assignee not found' };

    if (!canDelegateTo(currentUser, targetStaff)) {
      return {
        success: false,
        error: `Delegation restricted: Role "${currentUser.role}" cannot assign tasks to "${targetStaff.role}".`,
      };
    }

    updateTask(taskId, { assigned_to_id: newAssigneeId });
    return { success: true };
  };

  const transitionTaskStatus = (taskId: string, targetStatus: TaskStatus) => {
    const targetTask = tasks.find((t) => t.id === taskId);
    if (!targetTask) return { success: false, error: 'Task not found' };

    const validation = canTransitionTaskStatus(
      targetTask.status,
      targetStatus,
      currentUser,
      targetTask.requires_proof,
      Boolean(targetTask.proof_image_url)
    );

    if (!validation.allowed) {
      return { success: false, error: validation.reason };
    }

    const updates: Partial<Task> = { status: targetStatus };
    if (targetStatus === 'verified') {
      updates.verified_by_id = currentUser.id;
      updates.verified_at = new Date().toISOString();
    }

    updateTask(taskId, updates);
    return { success: true };
  };

  const attachProofToTask = (taskId: string, proofUrl: string, notes?: string) => {
    updateTask(taskId, {
      proof_image_url: proofUrl,
      proof_notes: notes || 'Proof attached for leadership compliance sign-off.',
    });
  };

  const verifyTask = (taskId: string) => {
    return transitionTaskStatus(taskId, 'verified');
  };

  // Student Actions
  const addStudent = (studentData: Omit<Student, 'id' | 'created_at'>) => {
    const newStudent: Student = {
      ...studentData,
      id: `stud-${Date.now()}`,
    };
    setStudents((prev) => [newStudent, ...prev]);

    // Also add parent to Stakeholders directory
    const newStakeholder: Stakeholder = {
      id: `stk-${Date.now()}`,
      name: studentData.parent_name,
      type: studentData.status === 'lead' ? 'lead' : 'parent',
      phone: studentData.parent_phone,
      email: studentData.parent_email,
      roleTitle: `Parent of ${studentData.full_name} (${studentData.program_grade})`,
      relationDetails: `Child: ${studentData.full_name} • Grade: ${studentData.program_grade}`,
      feeStatus: studentData.fee_paid ? 'paid' : 'due',
      dueAmount: studentData.fee_amount,
      grade: studentData.program_grade,
      preferredChannel: 'whatsapp',
      notes: studentData.notes,
      tags: [studentData.status === 'admitted' ? 'Enrolled' : 'Lead', studentData.program_grade],
    };
    setStakeholders((prev) => [newStakeholder, ...prev]);
  };

  const updateStudentStatus = (studentId: string, status: Student['status']) => {
    setStudents((prev) => prev.map((s) => (s.id === studentId ? { ...s, status } : s)));
  };

  const markFeePaid = (studentId: string, paid: boolean) => {
    setStudents((prev) => prev.map((s) => (s.id === studentId ? { ...s, fee_paid: paid } : s)));
    const st = students.find((s) => s.id === studentId);
    if (st) {
      setStakeholders((prev) =>
        prev.map((s) =>
          s.phone === st.parent_phone || s.name === st.parent_name
            ? { ...s, feeStatus: paid ? 'paid' : 'due' }
            : s
        )
      );
    }
  };

  // Stakeholders Directory Actions
  const addStakeholder = (stakeholderData: Omit<Stakeholder, 'id'>) => {
    const newStk: Stakeholder = {
      ...stakeholderData,
      id: `stk-${Date.now()}`,
    };
    setStakeholders((prev) => [newStk, ...prev]);
  };

  const updateStakeholder = (id: string, updates: Partial<Stakeholder>) => {
    setStakeholders((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteStakeholder = (id: string) => {
    setStakeholders((prev) => prev.filter((s) => s.id !== id));
  };

  const logCommunication = (logData: Omit<CommunicationLog, 'id' | 'sentAt'>) => {
    const newLog: CommunicationLog = {
      ...logData,
      id: `comm-${Date.now()}`,
      sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setCommunicationLogs((prev) => [newLog, ...prev]);

    // Update lastContactedAt on stakeholder
    updateStakeholder(logData.stakeholderId, {
      lastContactedAt: 'Just now',
    });
  };

  // Helper to generate 1-Way WhatsApp Deep Link with token replacement
  const generateWhatsAppLink = (stakeholder: Stakeholder, template: WhatsAppTemplate) => {
    const cleanPhone = stakeholder.phone.replace(/[^0-9]/g, '');
    const childName = stakeholder.relationDetails?.includes('Child:')
      ? stakeholder.relationDetails.split('Child:')[1]?.split('•')[0]?.trim()
      : stakeholder.roleTitle?.includes('Parent of')
      ? stakeholder.roleTitle.split('Parent of')[1]?.split('(')[0]?.trim()
      : 'your child';

    let message = template.textTemplate
      .replace(/{PARENT_NAME}/g, stakeholder.name)
      .replace(/{CHILD_NAME}/g, childName || 'your child')
      .replace(/{GRADE}/g, stakeholder.grade || 'Preschool')
      .replace(/{SCHOOL_NAME}/g, schoolConfig.campusName || campus.campus_name)
      .replace(/{AMOUNT}/g, String(stakeholder.dueAmount || 85000))
      .replace(/{DATE}/g, new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }))
      .replace(/{TIME}/g, '10:30 AM')
      .replace(/{PEDAGOGY}/g, brand.pedagogy)
      .replace(/{CAMPUS_LOCATION}/g, `${campus.locality}, ${campus.city}`)
      .replace(/{PHONE}/g, schoolConfig.emergencyContact)
      .replace(/{SENDER_NAME}/g, currentUser.full_name)
      .replace(/{FRANCHISE_REP}/g, stakeholder.name)
      .replace(/{CAMPUS_NAME}/g, campus.campus_name)
      .replace(/{COMPLIANCE_SCORE}/g, String(campus.compliance_score))
      .replace(/{ROYALTY_AMOUNT}/g, '65,000')
      .replace(/{GROSS_FEE}/g, '4,25,000')
      .replace(/{FOUNDER_NAME}/g, currentUser.full_name)
      .replace(/{STAFF_NAME}/g, stakeholder.name)
      .replace(/{MEAL_STATUS}/g, 'Ate full warm vegetable khichdi independently')
      .replace(/{NAP_DURATION}/g, '55 minutes')
      .replace(/{TEMPERATURE}/g, '100.2');

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  // Daily Care Logs
  const updateAttendance = (studentId: string, status: AttendanceStatus) => {
    const today = new Date().toISOString().split('T')[0];
    setDailyLogs((prev) => {
      const idx = prev.findIndex((l) => l.student_id === studentId && l.log_date === today);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], attendance: status };
        return copy;
      }
      return [
        {
          id: `log-${Date.now()}`,
          student_id: studentId,
          logged_by_id: currentUser.id,
          log_date: today,
          attendance: status,
          nap_minutes: 0,
          mood_emoji: '😊',
          created_at: new Date().toISOString(),
        },
        ...prev,
      ];
    });
  };

  const logMeal = (studentId: string, mealStatus: MealStatus) => {
    const today = new Date().toISOString().split('T')[0];
    setDailyLogs((prev) =>
      prev.map((l) =>
        l.student_id === studentId && l.log_date === today ? { ...l, meal_status: mealStatus } : l
      )
    );
  };

  const logNapMinutes = (studentId: string, minutes: number) => {
    const today = new Date().toISOString().split('T')[0];
    setDailyLogs((prev) =>
      prev.map((l) =>
        l.student_id === studentId && l.log_date === today ? { ...l, nap_minutes: minutes } : l
      )
    );
  };

  const logMoodEmoji = (studentId: string, emoji: string) => {
    const today = new Date().toISOString().split('T')[0];
    setDailyLogs((prev) =>
      prev.map((l) =>
        l.student_id === studentId && l.log_date === today ? { ...l, mood_emoji: emoji } : l
      )
    );
  };

  const addCareLogNote = (studentId: string, note: string) => {
    const today = new Date().toISOString().split('T')[0];
    setDailyLogs((prev) =>
      prev.map((l) =>
        l.student_id === studentId && l.log_date === today
          ? { ...l, notes: l.notes ? `${l.notes} • ${note}` : note }
          : l
      )
    );
  };

  // Vendor Orders
  const addVendorOrder = (orderData: Omit<VendorOrder, 'id'>) => {
    const newOrder: VendorOrder = {
      ...orderData,
      id: `po-${Date.now()}`,
    };
    setVendorOrders((prev) => [newOrder, ...prev]);
  };

  const updateVendorOrderStatus = (orderId: string, status: VendorOrder['status']) => {
    setVendorOrders((prev) => prev.map((v) => (v.id === orderId ? { ...v, status } : v)));
  };

  // Google Workspace Tools
  const sendChatMessage = (
    spaceId: string,
    content: string,
    isAlert = false,
    priority: Task['priority'] = 'low'
  ) => {
    const currentSpace = googleChatSpaces.find((s) => s.id === spaceId);
    const newMsg: GoogleChatMessage = {
      id: `msg-${Date.now()}`,
      spaceId,
      spaceName: currentSpace ? currentSpace.name : 'Campus Alerts',
      senderName: currentUser.full_name,
      senderAvatar:
        currentUser.avatar_url ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      senderRole: currentUser.designation,
      timestamp: 'Just now',
      content,
      isAlertCard: isAlert,
      alertPriority: priority,
    };
    setChatMessages((prev) => [newMsg, ...prev]);
  };

  const uploadDriveFile = (
    name: string,
    folder: string,
    fileType: GoogleDriveFile['fileType'] = 'pdf'
  ) => {
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

  const setAIToolPermission = (
    tool: ToolPermission['tool'],
    level: ToolPermission['level'],
    autoDraft = true
  ) => {
    setAIToolPermissions((prev) =>
      prev.map((p) =>
        p.tool === tool ? { ...p, level, autoDraft, lastSync: 'Updated now' } : p
      )
    );
  };

  const resetToFactoryDefaults = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(GOOGLE_AUTH_STORAGE_KEY);
    setCampus(SEED_CAMPUS);
    setBrandState(getBrandById(SEED_CAMPUS.brand_id));
    setSchoolConfig(SEED_SCHOOL_CONFIG);
    setModeState('setup');
    setStaffList(SEED_STAFF);
    setCurrentUserState(SEED_STAFF[0]);
    setTasks(SEED_TASKS);
    setStudents(SEED_STUDENTS);
    setStakeholders(SEED_STAKEHOLDERS);
    setDailyLogs(SEED_DAILY_LOGS);
    setVendorOrders(SEED_VENDOR_ORDERS);
    setActiveTab('onboarding');
    setChatMessages(INITIAL_CHAT_MESSAGES);
    setDriveFiles(INITIAL_DRIVE_FILES);
    setAIToolPermissions(DEFAULT_TOOL_PERMISSIONS);
    setGoogleAuth({
      connected: true,
      email: 'rajesh.mehta@edufranchise.com',
      name: 'Rajesh Mehta',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      connectedAt: 'Today',
      provider: 'google',
      secondaryGmail: 'rajesh.personal@gmail.com',
      contactsCount: 8,
    });
  };

  return (
    <ToddlerHQContext.Provider
      value={{
        activeTab,
        setActiveTab,
        campus,
        brand,
        setBrand,
        setCampusDetails,
        schoolConfig,
        updateSchoolConfig,
        mode,
        toggleMode,
        setMode,
        currentUser,
        setCurrentUserRole,
        staffList,
        inviteTeamMember,
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
        stakeholders,
        addStakeholder,
        updateStakeholder,
        deleteStakeholder,
        communicationLogs,
        logCommunication,
        generateWhatsAppLink,
        dailyLogs,
        updateAttendance,
        logMeal,
        logNapMinutes,
        logMoodEmoji,
        addCareLogNote,
        vendorOrders,
        addVendorOrder,
        updateVendorOrderStatus,
        googleAuth,
        connectGoogle,
        disconnectGoogle,
        switchGoogleAccount,
        isContactsDiagnosticOpen,
        setIsContactsDiagnosticOpen,
        contactsSyncCount,
        syncGoogleContactsNow,
        googleChatSpaces,
        chatMessages,
        sendChatMessage,
        driveFiles,
        uploadDriveFile,
        gmailDispatches,
        dispatchGmail,
        aiToolPermissions,
        setAIToolPermission,
        googleNativeAssets,
        updateGoogleNativeAsset,
        applyCampusSetup,
        removeStaffMember,
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
