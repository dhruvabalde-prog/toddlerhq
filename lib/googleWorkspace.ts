import { Student, Task } from '@/types/toddlerhq';

export interface GoogleChatMessage {
  id: string;
  spaceId: string;
  spaceName: string;
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
  fileType: 'image' | 'pdf' | 'doc';
  uploadedBy: string;
  timestamp: string;
  size: string;
  verified: boolean;
}

export interface GmailDispatch {
  id: string;
  toEmail: string;
  recipientName: string;
  subject: string;
  type: 'fee_receipt' | 'admission_offer' | 'vendor_rfq' | 'safety_notice';
  timestamp: string;
  snippet: string;
  status: 'sent' | 'delivered';
}

export const INITIAL_CHAT_SPACES = [
  {
    id: 'space-leadership',
    name: 'Campus Leadership',
    topic: 'Founders, Center Head & Academic Lead strategy & compliance',
    memberCount: 3,
    unreadAlerts: 1,
  },
  {
    id: 'space-educators',
    name: 'Classroom Educators',
    topic: 'Teachers, Co-teachers, Daily classroom logs & sensory plans',
    memberCount: 8,
    unreadAlerts: 0,
  },
  {
    id: 'space-admissions',
    name: 'Admissions Desk',
    topic: 'Inquiries, Walkthroughs, Tours & Enrollments',
    memberCount: 3,
    unreadAlerts: 2,
  },
  {
    id: 'space-alerts',
    name: 'Urgent Campus Alerts',
    topic: 'Safety critical compliance, emergency gate notifications & inspections',
    memberCount: 14,
    unreadAlerts: 1,
  },
];

export const INITIAL_CHAT_MESSAGES: GoogleChatMessage[] = [
  {
    id: 'msg-1',
    spaceId: 'space-alerts',
    spaceName: 'Urgent Campus Alerts',
    senderName: 'System Gatekeeper',
    senderAvatar: '🛡️',
    senderRole: 'Automated Compliance',
    timestamp: 'Today at 08:30 AM',
    content: 'CRITICAL AUDIT ALERT: Window pinch guards on Class 1B East Wing need photographic proof before student intake.',
    isAlertCard: true,
    alertPriority: 'safety_critical',
  },
  {
    id: 'msg-2',
    spaceId: 'space-leadership',
    spaceName: 'Campus Leadership',
    senderName: 'Rajesh Mehta',
    senderAvatar: '👨‍💼',
    senderRole: 'Founder',
    timestamp: 'Today at 09:15 AM',
    content: 'Reviewing budget burn for Indiranagar campus fit-out. Let us ensure the EVA flooring vendor submits the EN71-3 certificate today.',
  },
  {
    id: 'msg-3',
    spaceId: 'space-educators',
    spaceName: 'Classroom Educators',
    senderName: 'Priya Sharma',
    senderAvatar: '👩‍🏫',
    senderRole: 'Center Head',
    timestamp: 'Today at 10:00 AM',
    content: 'Good morning team! Monsoon sensory theme starts this week. Please use the Gemini Sensory Assistant for rainy-day clay and paper crafts.',
  },
  {
    id: 'msg-4',
    spaceId: 'space-admissions',
    spaceName: 'Admissions Desk',
    senderName: 'Aditi Rao',
    senderAvatar: '👩‍💼',
    senderRole: 'Admissions Counselor',
    timestamp: 'Today at 10:45 AM',
    content: 'Tour booked for Dr. Ananya Iyer at 11:30 AM for Playgroup. Google Contacts synced to campus phones.',
  },
];

export const INITIAL_DRIVE_FILES: GoogleDriveFile[] = [
  {
    id: 'drv-1',
    name: 'Indiranagar_Fire_NOC_Inspection_Report.pdf',
    path: '/PreschoolOS/Indiranagar/2026/Compliance/Fire Safety & NOC/',
    fileType: 'pdf',
    uploadedBy: 'Priya Sharma (Principal)',
    timestamp: '11 Oct 2026',
    size: '2.4 MB',
    verified: true,
  },
  {
    id: 'drv-2',
    name: 'Window_Grill_Pinch_Guards_Installation_Proof.jpg',
    path: '/PreschoolOS/Indiranagar/2026/Compliance/Civil & Childproofing Proofs/',
    fileType: 'image',
    uploadedBy: 'Sunil Kumar (Support Lead)',
    timestamp: '12 Oct 2026',
    size: '4.1 MB',
    verified: true,
  },
  {
    id: 'drv-3',
    name: 'Police_Clearance_Ayahs_Batch1_Indiranagar.pdf',
    path: '/PreschoolOS/Indiranagar/2026/Compliance/Staff Police Verifications/',
    fileType: 'pdf',
    uploadedBy: 'Aditi Rao (HR/Admin)',
    timestamp: '09 Oct 2026',
    size: '1.8 MB',
    verified: true,
  },
  {
    id: 'drv-4',
    name: 'EVA_Tiles_Heavy_Metal_EN71_Lab_Test.pdf',
    path: '/PreschoolOS/Indiranagar/2026/Compliance/Vendor Safety Spec Sheets/',
    fileType: 'pdf',
    uploadedBy: 'Priya Sharma (Principal)',
    timestamp: '08 Oct 2026',
    size: '3.2 MB',
    verified: false,
  },
];
