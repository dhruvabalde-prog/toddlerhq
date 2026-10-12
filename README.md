# ToddlerHQ — Preschool Operations, Project Management & Downstairs Team Delegation OS

**ToddlerHQ** is a deterministic, timeline-agnostic Project Management, Operations Management, and Team Delegation Operating System engineered specifically for early-childhood education centers and national preschool franchise brands (e.g., Maple Bear, Kidzee, EuroKids, Kangaroo Kids, KLAY, Footprints).

---

## 🌟 Core Architecture & Capabilities

### 1. Non-Agentic Context-Aware AI Copilot (`@google/genai`)
- Zero autonomous background loops or unsolicited database writes.
- Powered by `gemini-3.8-flash` on explicit user button triggers:
  - **Parent Inquiry Smart Responder**: Generates empathetic, brand-aligned WhatsApp replies under 80 words inviting parents for experiential campus walkthroughs.
  - **Sensory Lesson Plan Generator**: Produces 20-minute structured sensory plans with safety notes, setup tips, and observation cues.
  - **Vendor Invoice & Safety Auditor**: Analyzes quotes and material specs against non-toxicity (EN71-3, ASTM F963) and Class A fire-retardant standards.
  - **Weekly Student Progress Digest**: Aggregates meals, naps, moods, and milestone logs into a 4-line WhatsApp update for parents.
  - **Vernacular Safety SOP Translator**: Translates English hygiene, fire drill, and diaper change SOPs into Hindi, Marathi, Kannada, Tamil, or Telugu for campus ayahs and support staff.

### 2. Persistent Dual Operational Modes
- **Setup Mode**: Fit-out, civil, safety netting, window grills, licensing, toy procurement, hiring, and launch day tasks.
- **Operations Mode**: Daily student check-in/out, meal/nap tracking, lead CRM, fee receipts, and weekly theme schedules.
- Seamless persistent toggle in the top navigation bar.

### 3. Top 25 National Preschool Brands Selector
- Searchable catalog of India's top 25 preschool franchise networks (Maple Bear, Kidzee, EuroKids, Kangaroo Kids, Little Elly, Bachpan, Shemrock, KLAY, Podar Prep, Footprints, etc.) + **Independent Preschool**.
- Auto-populates brand-specific pedagogy presets, classroom zones, curriculum pillars, and student-teacher ratios.

### 4. Location-Aware Context Engine
- Captures City, Locality, and Pincode across major Indian hubs (Bengaluru, Mumbai, Delhi NCR, Hyderabad, Pune, Chennai).
- Auto-populates recommended local vendor categories (25mm anti-microbial EVA flooring, childproofing pinch guards, multi-split ACs with HEPA filters, fire refills) and local ECCE hiring pools.

### 5. Role-Tailored Dynamic UI
- **Founder / Co-Founder (Executive Cockpit)**: Gantt-less milestone completion bars, budget burn vs. allocated, multi-campus selector, downstairs delegation control, multi-email Google account switcher.
- **Center Head / Principal (Operational Hub)**: Departmental Kanban board, critical safety gatekeeper alerts, staff shift roster, vendor PO management.
- **Classroom Educator (Mobile Console)**: Mobile-first 1-touch student attendance (Present/Absent/Late), meal intake logger, live quiet nap timer, mood emojis, and sensory plan assistant.
- **Admissions / Front Desk (Visual CRM)**: Visual inquiry-to-admission pipeline (`New Lead` -> `WhatsApp Engaged` -> `School Tour Booked` -> `Offer Made` -> `Fee Paid`), 1-click WhatsApp launch with Gemini drafts, 1-click Gmail fee receipts, and Google Contacts sync.

### 6. Fluid Downstairs Hierarchy Delegation
- Assignees are dynamically filtered and grouped strictly downward:
  - Founder -> Can assign to any tier.
  - Center Head -> Can assign to Academic Leads, Teachers, Front Desk, Support.
  - Academic Lead -> Can assign to Classroom Teachers.
- Strict State Machine: `Backlog` -> `To Do` -> `In Progress` -> `Under Review (Proof Required)` -> `Completed` -> `Verified & Closed`.
- Mandatory photographic/document proof review before closing safety tasks.

### 7. Native Google Workspace Integration
- **Google Contacts**: One-click sync with smartphone incoming Caller ID simulation.
- **Google Chat Spaces**: Departmental rooms (`#campus-leadership`, `#classroom-educators`, `#admissions-desk`, `#urgent-campus-alerts`).
- **Gmail**: Systemic dispatch of tuition fee receipts and admission offers.
- **Google Drive**: Compliance folder archive `/PreschoolOS/{Campus}/{Year}/Compliance/`.

---

## 🛠️ Tech Stack
- **Framework**: Next.js 16+ (Turbopack, App Router) & React 19
- **Styling**: Tailwind CSS & Lucide Icons
- **AI Intelligence**: Google Gemini API via official `@google/genai` SDK
- **Database Schema**: Supabase / PostgreSQL with Row Level Security (RLS) in `supabase/schema.sql`
- **State Engine**: Reactive persistent store with Downstairs delegation checks and state machine validation

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/dhruvabalde-prog/toddlerhq.git

# Install dependencies
npm install

# Run local development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view ToddlerHQ.
