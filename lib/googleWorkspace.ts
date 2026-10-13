import { Student, Task, ToolPermission, WhatsAppTemplate } from '@/types/toddlerhq';

export interface GoogleChatMessage {
  id: string;
  spaceId: string;
  spaceName?: string;
  senderName: string;
  senderAvatar: string;
  senderRole: string;
  timestamp: string;
  content: string;
  isAlertCard?: boolean;
  alertPriority?: 'low' | 'medium' | 'high' | 'safety_critical';
  taskId?: string;
}

export interface GoogleDriveFile {
  id: string;
  name: string;
  path: string;
  fileType: 'image' | 'pdf' | 'doc' | 'sheet' | 'slide';
  uploadedBy: string;
  timestamp: string;
  size: string;
  verified: boolean;
  url?: string;
}

export interface GmailDispatch {
  id: string;
  toEmail: string;
  recipientName: string;
  subject: string;
  type: 'fee_receipt' | 'admission_offer' | 'vendor_rfq' | 'safety_notice' | 'franchise_audit';
  timestamp: string;
  snippet: string;
  status: 'sent' | 'delivered';
}

export const INITIAL_CHAT_SPACES = [
  {
    id: 'space-leadership',
    name: 'Campus Leadership & Founder',
    topic: 'Founders, Center Head, Academic Lead & Mentors',
    memberCount: 4,
    unreadAlerts: 1,
  },
  {
    id: 'space-educators',
    name: 'Classroom Teachers & Didis',
    topic: 'Educators, Caregivers, Daily care handovers & meal logs',
    memberCount: 8,
    unreadAlerts: 0,
  },
  {
    id: 'space-admissions',
    name: 'Admissions Desk & Inquiries',
    topic: 'Inquiries, Walkthroughs, Tours & WhatsApp follow-ups',
    memberCount: 3,
    unreadAlerts: 2,
  },
  {
    id: 'space-franchise',
    name: 'Franchise Head Office & Audits',
    topic: 'Brand Auditor, Royalty reporting & Curriculum adherence',
    memberCount: 3,
    unreadAlerts: 1,
  },
  {
    id: 'space-alerts',
    name: 'Emergency & Safety Gate',
    topic: 'Fire safety, emergency medicine, guardian pickup verifications',
    memberCount: 14,
    unreadAlerts: 0,
  },
];

export const INITIAL_CHAT_MESSAGES: GoogleChatMessage[] = [
  {
    id: 'msg-1',
    spaceId: 'space-leadership',
    senderName: 'Rajesh Mehta',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    senderRole: 'Founder',
    timestamp: '9:15 AM',
    content: 'Good morning team. Today is the franchise audit preparation day. Please ensure all 25mm EVA flooring joint seals and Fire NOC docs in Google Drive are verified.',
  },
  {
    id: 'msg-2',
    spaceId: 'space-educators',
    senderName: 'Meera Nair',
    senderAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    senderRole: 'Academic Lead',
    timestamp: '9:30 AM',
    content: 'Morning circle time today focuses on Monsoon raindrops & sensory sponge play. Didi Lakshmi, please ensure extra towels are prepped in the toddler nap room.',
  },
  {
    id: 'msg-3',
    spaceId: 'space-admissions',
    senderName: 'Aditi Rao',
    senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    senderRole: 'Admissions Lead',
    timestamp: '10:05 AM',
    content: '3 campus walkthrough tours booked for Nursery and Daycare between 11:30 AM and 1:00 PM. Parents requested to see the sensory discovery lab and nap room.',
  },
];

export const INITIAL_DRIVE_FILES: GoogleDriveFile[] = [
  {
    id: 'drv-1',
    name: 'Preschool_Parent_Handbook_2026.pdf',
    path: '/Campus Policies & Handbooks',
    fileType: 'pdf',
    uploadedBy: 'Rajesh Mehta (Founder)',
    timestamp: 'Yesterday',
    size: '3.4 MB',
    verified: true,
  },
  {
    id: 'drv-2',
    name: 'Fire_Safety_Evacuation_NOC_Govt.pdf',
    path: '/Statutory & Licensing Approvals',
    fileType: 'pdf',
    uploadedBy: 'Priya Sharma (Principal)',
    timestamp: '2 days ago',
    size: '1.8 MB',
    verified: true,
  },
  {
    id: 'drv-3',
    name: 'Toddler_Tuition_Fee_Master_2026.xlsx',
    path: '/Finance & Fee Trackers',
    fileType: 'sheet',
    uploadedBy: 'Rajesh Mehta (Founder)',
    timestamp: 'Today, 8:40 AM',
    size: '840 KB',
    verified: true,
  },
  {
    id: 'drv-4',
    name: 'Curriculum_Weekly_Activity_Playgroup.docx',
    path: '/Curriculum & Lesson Plans',
    fileType: 'doc',
    uploadedBy: 'Meera Nair (Academic Lead)',
    timestamp: 'Today, 9:10 AM',
    size: '1.2 MB',
    verified: true,
  },
];

// Pre-built Preschool WhatsApp Message Templates for 1-Way Draft & Send
export const DEFAULT_WHATSAPP_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: 'fee-reminder-due',
    title: 'Tuition Fee Due Reminder (with UPI)',
    category: 'fees',
    targetRole: 'parent',
    textTemplate:
      'Dear {PARENT_NAME},\n\nWarm greetings from {SCHOOL_NAME}! 🌟\n\nThis is a gentle reminder regarding the preschool fee of ₹{AMOUNT} for {CHILD_NAME} ({GRADE}), due by {DATE}.\n\nYou can pay directly via UPI: toddlerhq@icici or at the school fee counter.\n\nReceipt will be issued instantly on ToddlerHQ. Please let us know once transferred.\n\nWarm regards,\n{SENDER_NAME}\n{SCHOOL_NAME}',
  },
  {
    id: 'daily-care-update',
    title: 'Daily Care & Nap Routine Report',
    category: 'care',
    targetRole: 'parent',
    textTemplate:
      'Dear {PARENT_NAME},\n\nHere is {CHILD_NAME}’s daily smile update from {SCHOOL_NAME}! 🌈\n\n🥗 Meals: {MEAL_STATUS}\n💤 Nap Time: {NAP_DURATION} of restful sleep in the quiet room.\n🎨 Activities: Enjoyed sensory playdough & phonics circle time.\n😊 Mood: Cheerful & cooperative today!\n\nHave a lovely evening!\nTeacher {SENDER_NAME}',
  },
  {
    id: 'tour-invitation',
    title: 'Admissions Campus Walkthrough Invitation',
    category: 'admissions',
    targetRole: 'lead',
    textTemplate:
      'Dear {PARENT_NAME},\n\nThank you for your inquiry for {CHILD_NAME} at {SCHOOL_NAME}! 🏫\n\nWe would love to invite you for a guided campus walkthrough on {DATE} at {TIME}.\n\nYou will experience our {PEDAGOGY} sensory labs, toddler nap suites, and interactive play areas.\n\n📍 Location: {CAMPUS_LOCATION}\n\nPlease reply with "CONFIRM" if this slot suits you.\n\nWarm regards,\nAdmissions Team\n{PHONE}',
  },
  {
    id: 'sick-child-notice',
    title: 'Urgent: Child Health / Early Pickup Request',
    category: 'emergency',
    targetRole: 'parent',
    textTemplate:
      'Dear {PARENT_NAME},\n\nURGENT NOTICE regarding {CHILD_NAME}. During mid-morning circle time, we recorded a mild fever ({TEMPERATURE}°F) / slight discomfort.\n\nOur campus nurse has provided comforting care and hydration in the infirmary. Kindly arrange for an early pickup at your earliest convenience.\n\nCampus Office: {PHONE}\n{SCHOOL_NAME}',
  },
  {
    id: 'franchise-audit-notice',
    title: 'Franchise HQ Quality & Royalty Report',
    category: 'franchise',
    targetRole: 'franchise',
    textTemplate:
      'Dear {FRANCHISE_REP},\n\nMonthly audit update from {SCHOOL_NAME} ({CAMPUS_NAME}).\n\n📊 Current Brand Compliance Score: {COMPLIANCE_SCORE}%\n📋 Fire NOC & EVA Flooring: Verified\n💰 Monthly Royalty Dispatched: ₹{ROYALTY_AMOUNT} (Gross Collections: ₹{GROSS_FEE})\n\nFull digital compliance report is available in our Google Workspace drive folder.\n\nRegards,\n{FOUNDER_NAME}\nFounder & Franchisee Partner',
  },
  {
    id: 'teacher-shift-reminder',
    title: 'Staff Meeting & Lesson Plan Submission',
    category: 'staff',
    targetRole: 'teacher',
    textTemplate:
      'Dear {STAFF_NAME},\n\nReminder: Please submit your weekly sensory lesson plans for {GRADE} by 4:00 PM today via the ToddlerHQ Academics Tab.\n\nAlso, staff briefing tomorrow morning at 8:15 AM regarding the upcoming Annual Orientation.\n\nCenter Head,\n{SCHOOL_NAME}',
  },
];

// Default Granular AI Tool Permissions
export const DEFAULT_TOOL_PERMISSIONS: ToolPermission[] = [
  {
    tool: 'docs',
    title: 'Google Docs',
    description: 'Circulars, Parent Handbooks, Child Protection Policies & Admission Letters',
    level: 'auto_sync',
    autoDraft: true,
    lastSync: '10 mins ago',
  },
  {
    tool: 'sheets',
    title: 'Google Sheets',
    description: 'Live Fee Collection Ledger, Petty Cash, Asset Inventory & Budget vs Actuals',
    level: 'auto_sync',
    autoDraft: true,
    lastSync: '5 mins ago',
  },
  {
    tool: 'slides',
    title: 'Google Slides',
    description: 'Annual Day Decks, Parent Orientation Slides & Thematic Class Showcases',
    level: 'suggest',
    autoDraft: true,
    lastSync: '1 hour ago',
  },
  {
    tool: 'forms',
    title: 'Google Forms',
    description: 'Online Admission Inquiries, Parent Satisfaction Surveys & Teacher Appraisals',
    level: 'auto_sync',
    autoDraft: false,
    lastSync: 'Just now',
  },
  {
    tool: 'notebooklm',
    title: 'Google NotebookLM',
    description: 'NEP 2020 Foundation Stage Guidelines & Franchise Teacher Training Summaries',
    level: 'read',
    autoDraft: false,
    lastSync: 'Yesterday',
  },
  {
    tool: 'classroom',
    title: 'Google Classroom',
    description: 'Teacher ECCE Training Modules & Parent Home-Activity / Rhymes Portal',
    level: 'suggest',
    autoDraft: true,
    lastSync: '3 hours ago',
  },
  {
    tool: 'maps',
    title: 'Google Maps',
    description: 'Campus Geotag, Van GPS Routes, Pickup/Drop Stops & Competitor Radius',
    level: 'auto_sync',
    autoDraft: false,
    lastSync: 'Active',
  },
  {
    tool: 'keep',
    title: 'Google Keep / Notes',
    description: 'Quick Teacher Voice Notes, Emergency Reminders & Urgent Task Sticky Notes',
    level: 'auto_sync',
    autoDraft: true,
    lastSync: 'Live',
  },
];
