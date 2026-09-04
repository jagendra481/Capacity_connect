const pptxgen = require('pptxgenjs');
const path = require('path');

const pptx = new pptxgen();

// Define Presentation Dimensions & Metadata
pptx.layout = 'LAYOUT_16x9';
pptx.title = 'CAPACITY CONNECT - SIH 2025 Official Presentation';
pptx.subject = 'SIH 2025 Problem Statement 26075 Solution';
pptx.author = 'Capacity Connect Team';

// Color Palette
const COLORS = {
  NAVY_BLUE: '0B2545',
  SIH_ORANGE: 'FF6B00',
  SLATE_DARK: '1E293B',
  BG_LIGHT: 'F8FAFC',
  WHITE: 'FFFFFF',
  BORDER_GRAY: 'E2E8F0',
  BLUE_ACCENT: '2563EB',
  GREEN_ACCENT: '16A34A',
  CARD_BG: 'EDF2F7',
};

// Helper: Add Standard Header Banner to Slides 2-6
function addHeader(slide, titleText, slideNumStr) {
  // SIH Logo Text Badge (Top Left)
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 0.3, w: 1.8, h: 0.5,
    fill: { color: 'FFFFFF' },
    line: { color: COLORS.SIH_ORANGE, width: 1.5 },
  });
  slide.addText('SIH 2025', {
    x: 0.5, y: 0.3, w: 1.8, h: 0.5,
    fontFace: 'Arial', fontSize: 13, bold: true, color: COLORS.SIH_ORANGE, align: 'center', valign: 'middle',
  });

  // Slide Title (Center)
  slide.addText(titleText.toUpperCase(), {
    x: 2.5, y: 0.3, w: 7.5, h: 0.5,
    fontFace: 'Arial', fontSize: 22, bold: true, color: COLORS.NAVY_BLUE, align: 'center', valign: 'middle',
  });

  // SIH Right Badge (Top Right)
  slide.addText('SMART INDIA\nHACKATHON 2025', {
    x: 10.3, y: 0.25, w: 2.5, h: 0.6,
    fontFace: 'Arial', fontSize: 10, bold: true, color: COLORS.NAVY_BLUE, align: 'right', valign: 'middle',
  });

  // Bottom Footer Bar
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 7.0, w: 13.33, h: 0.5,
    fill: { color: COLORS.BLUE_ACCENT },
  });
  slide.addText('@SIH Idea submission- Template', {
    x: 0.5, y: 7.0, w: 6.0, h: 0.5,
    fontFace: 'Arial', fontSize: 10, color: COLORS.WHITE, valign: 'middle',
  });
  slide.addText(slideNumStr, {
    x: 12.0, y: 7.0, w: 0.8, h: 0.5,
    fontFace: 'Arial', fontSize: 10, bold: true, color: COLORS.WHITE, align: 'right', valign: 'middle',
  });
}

// =============================================================================
// SLIDE 1: TITLE PAGE
// =============================================================================
const slide1 = pptx.addSlide();

// Title Header
slide1.addText('SMART INDIA HACKATHON 2025', {
  x: 1.0, y: 0.6, w: 11.33, h: 0.7,
  fontFace: 'Arial', fontSize: 28, bold: true, color: COLORS.NAVY_BLUE, align: 'center',
});
slide1.addText('TITLE PAGE', {
  x: 1.0, y: 1.3, w: 11.33, h: 0.5,
  fontFace: 'Arial', fontSize: 20, bold: true, color: COLORS.SLATE_DARK, align: 'center',
});

// SIH Official Badge Text
slide1.addShape(pptx.shapes.OVAL, {
  x: 9.5, y: 0.5, w: 2.8, h: 1.5,
  fill: { color: 'FFFFFF' },
  line: { color: COLORS.SIH_ORANGE, width: 2 },
});
slide1.addText('SMART INDIA\nHACKATHON\n2025', {
  x: 9.5, y: 0.5, w: 2.8, h: 1.5,
  fontFace: 'Arial', fontSize: 12, bold: true, color: COLORS.SIH_ORANGE, align: 'center', valign: 'middle',
});

// Main Details Box
slide1.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 1.2, y: 2.0, w: 10.93, h: 4.8,
  fill: { color: COLORS.BG_LIGHT },
  line: { color: COLORS.BORDER_GRAY, width: 1.5 },
});

const slide1Text = [
  { text: '• Problem Statement ID - ', options: { bold: true, fontSize: 15, color: COLORS.NAVY_BLUE } },
  { text: '26075\n\n', options: { fontSize: 15, color: COLORS.SLATE_DARK } },
  { text: '• Problem Statement Title - \n', options: { bold: true, fontSize: 15, color: COLORS.NAVY_BLUE } },
  { text: '  CAPACITY CONNECT: A Digital Capacity Building and Learning Management Portal\n\n', options: { bold: true, fontSize: 16, color: COLORS.BLUE_ACCENT } },
  { text: '• Theme - ', options: { bold: true, fontSize: 15, color: COLORS.NAVY_BLUE } },
  { text: 'Smart Education\n\n', options: { fontSize: 15, color: COLORS.SLATE_DARK } },
  { text: '• PS Category - ', options: { bold: true, fontSize: 15, color: COLORS.NAVY_BLUE } },
  { text: 'Software\n\n', options: { fontSize: 15, color: COLORS.SLATE_DARK } },
  { text: '• Organization - ', options: { bold: true, fontSize: 15, color: COLORS.NAVY_BLUE } },
  { text: 'Ministry of Earth Sciences (MoES) / India Meteorological Department (IMD)\n\n', options: { fontSize: 15, color: COLORS.SLATE_DARK } },
  { text: '• Team ID - ', options: { bold: true, fontSize: 15, color: COLORS.NAVY_BLUE } },
  { text: '[Your Team ID]\n\n', options: { fontSize: 15, color: COLORS.SLATE_DARK } },
  { text: '• Team Name - ', options: { bold: true, fontSize: 15, color: COLORS.NAVY_BLUE } },
  { text: '[Your Team Name]', options: { fontSize: 15, color: COLORS.SLATE_DARK } },
];
slide1.addText(slide1Text, { x: 1.5, y: 2.2, w: 10.3, h: 4.4, valign: 'top' });


// =============================================================================
// SLIDE 2: IDEA TITLE (Problem & Solution)
// =============================================================================
const slide2 = pptx.addSlide();
addHeader(slide2, 'IDEA TITLE', '2');

// Subheader Title
slide2.addText('CAPACITY CONNECT — Digital Capacity Building & Competency Analytics Portal', {
  x: 0.5, y: 0.95, w: 12.33, h: 0.4,
  fontFace: 'Arial', fontSize: 14, bold: true, color: COLORS.BLUE_ACCENT, align: 'center',
});

// Problem Description Box
slide2.addShape(pptx.shapes.RECTANGLE, {
  x: 0.5, y: 1.45, w: 12.33, h: 2.4,
  fill: { color: COLORS.WHITE },
  line: { color: COLORS.SLATE_DARK, width: 1.5 },
});
slide2.addText('Problem Description :', {
  x: 0.7, y: 1.55, w: 11.9, h: 0.35,
  fontFace: 'Arial', fontSize: 15, bold: true, underline: true, color: COLORS.NAVY_BLUE,
});

const probItems = [
  { text: '• Skill Misalignment & Opacity: Organizations lack real-time visibility into workforce competency levels vs required baselines.\n', options: { fontSize: 11.5, color: COLORS.SLATE_DARK } },
  { text: '• Disconnected 3-Role Management: Fragmented access for Trainees, Trainers, and Admins across legacy portals.\n', options: { fontSize: 11.5, color: COLORS.SLATE_DARK } },
  { text: '• Ungrounded & Static Learning: Traditional LMS portals lack intelligent, course-grounded AI guidance and practice tools.\n', options: { fontSize: 11.5, color: COLORS.SLATE_DARK } },
  { text: '• Impact → Reduced training ROI, unmonitored skill gaps, resource over-allocation, and certificate forgery risks.', options: { bold: true, fontSize: 11.5, color: COLORS.SIH_ORANGE } },
];
slide2.addText(probItems, { x: 0.8, y: 1.9, w: 11.8, h: 1.8, valign: 'top' });

// Solution Box
slide2.addShape(pptx.shapes.RECTANGLE, {
  x: 0.5, y: 4.0, w: 12.33, h: 2.8,
  fill: { color: COLORS.WHITE },
  line: { color: COLORS.SLATE_DARK, width: 1.5 },
});
slide2.addText('Solution :', {
  x: 0.7, y: 4.1, w: 11.9, h: 0.35,
  fontFace: 'Arial', fontSize: 15, bold: true, underline: true, color: COLORS.NAVY_BLUE,
});

const solItems = [
  { text: '• Centralized 3-Role Portal (Trainee, Trainer, Admin): Role-based access control with secure Nodemailer OTP (30s cooldown) and Google OAuth 2.0.\n', options: { fontSize: 11.5, color: COLORS.SLATE_DARK } },
  { text: '• RAG-Powered AI Learning Assistant: Course-grounded AI chatbot providing source-cited explanations (📚 Course — Module — Lesson), practice MCQs, and flashcards.\n', options: { fontSize: 11.5, color: COLORS.SLATE_DARK } },
  { text: '• Capacity Radar & Competency Mapping: Real-time departmental workload risk heatmap, automated skill gap formula (Skill Gap = Required - Current), and trainer-subject mapping.\n', options: { fontSize: 11.5, color: COLORS.SLATE_DARK } },
  { text: '• SHA-256 Cryptographic Certification: Tamper-proof, cryptographically verifiable certificates with instant public validation links.', options: { fontSize: 11.5, color: COLORS.SLATE_DARK } },
];
slide2.addText(solItems, { x: 0.8, y: 4.45, w: 11.8, h: 2.2, valign: 'top' });


// =============================================================================
// SLIDE 3: TECHNICAL APPROACH
// =============================================================================
const slide3 = pptx.addSlide();
addHeader(slide3, 'TECHNICAL APPROACH', '3');

// Left Column: Tech Stack & Process Text
slide3.addText('Tech Stack :', {
  x: 0.5, y: 1.0, w: 7.0, h: 0.35,
  fontFace: 'Arial', fontSize: 15, bold: true, underline: true, color: COLORS.NAVY_BLUE,
});

const techStackText = [
  { text: '• AI / RAG: ', options: { bold: true, fontSize: 12, color: COLORS.BLUE_ACCENT } },
  { text: 'Google Gemini 2.0/1.5 Flash, RAG Engine, Memory Store (ai_conversations)\n', options: { fontSize: 12, color: COLORS.SLATE_DARK } },
  { text: '• Backend: ', options: { bold: true, fontSize: 12, color: COLORS.BLUE_ACCENT } },
  { text: 'Node.js, Express.js REST APIs, JWT, bcryptjs, Nodemailer (Gmail SMTP)\n', options: { fontSize: 12, color: COLORS.SLATE_DARK } },
  { text: '• Frontend: ', options: { bold: true, fontSize: 12, color: COLORS.BLUE_ACCENT } },
  { text: 'ReactJS 18, Vite, Tailwind CSS, Recharts, Lucide Icons\n', options: { fontSize: 12, color: COLORS.SLATE_DARK } },
  { text: '• Database: ', options: { bold: true, fontSize: 12, color: COLORS.BLUE_ACCENT } },
  { text: 'PostgreSQL (Relational Schema) + Resilient Memory Store Fallback\n', options: { fontSize: 12, color: COLORS.SLATE_DARK } },
  { text: '• Security: ', options: { bold: true, fontSize: 12, color: COLORS.BLUE_ACCENT } },
  { text: 'SHA-256 Hashing, Bearer JWT Auth, Google GIS SDK', options: { fontSize: 12, color: COLORS.SLATE_DARK } },
];
slide3.addText(techStackText, { x: 0.6, y: 1.4, w: 7.2, h: 2.2, valign: 'top' });

slide3.addText('Process :', {
  x: 0.5, y: 3.8, w: 7.0, h: 0.35,
  fontFace: 'Arial', fontSize: 15, bold: true, underline: true, color: COLORS.NAVY_BLUE,
});

const processText = [
  { text: 'a. User Auth & Provisioning: Dual-mode Login/Signup with Nodemailer 6-digit OTP (30s cooldown) and Google OAuth 2.0.\n', options: { fontSize: 11.5, color: COLORS.SLATE_DARK } },
  { text: 'b. Profile & Competency Mapping: Trainees build profiles; Admins map trainer expertise to subjects for optimal allocation.\n', options: { fontSize: 11.5, color: COLORS.SLATE_DARK } },
  { text: 'c. RAG AI Course Intelligence: Trainees ask questions; RAG engine fetches verified lesson passages and generates grounded answers.\n', options: { fontSize: 11.5, color: COLORS.SLATE_DARK } },
  { text: 'd. Assessment & Certification: Timed MCQ quizzes evaluate skill levels; passing scores unlock SHA-256 hash verified certificates.', options: { fontSize: 11.5, color: COLORS.SLATE_DARK } },
];
slide3.addText(processText, { x: 0.8, y: 4.2, w: 7.0, h: 2.6, valign: 'top' });

// Right Column: Process Flow Graphic Badges
const steps = [
  { text: '1. Secure Auth (OTP + Google OAuth)', fill: 'DBEAFE', border: '3B82F6' },
  { text: '2. 3-Role RBAC (Trainee/Trainer/Admin)', fill: 'DCFCE7', border: '22C55E' },
  { text: '3. RAG AI Assistant & Course Material', fill: 'FEF3C7', border: 'F59E0B' },
  { text: '4. MCQ Assessments & Skill Gap Formula', fill: 'F3E8FF', border: 'A855F7' },
  { text: '5. SHA-256 Cryptographic Certificates', fill: 'FFE4E6', border: 'F43F5E' },
];

let stepY = 1.2;
steps.forEach((s) => {
  slide3.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 8.3, y: stepY, w: 4.5, h: 0.85,
    fill: { color: s.fill },
    line: { color: s.border, width: 2 },
  });
  slide3.addText(s.text, {
    x: 8.4, y: stepY, w: 4.3, h: 0.85,
    fontFace: 'Arial', fontSize: 12, bold: true, color: COLORS.SLATE_DARK, align: 'center', valign: 'middle',
  });
  stepY += 1.05;
});


// =============================================================================
// SLIDE 4: FEASIBILITY AND VIABILITY
// =============================================================================
const slide4 = pptx.addSlide();
addHeader(slide4, 'FEASIBILITY AND VIABILITY', '4');

// Feasibility Box
slide4.addShape(pptx.shapes.RECTANGLE, {
  x: 0.5, y: 1.0, w: 12.33, h: 1.8,
  fill: { color: COLORS.WHITE },
  line: { color: COLORS.SLATE_DARK, width: 1.5 },
});
slide4.addText('Feasibility :', {
  x: 0.7, y: 1.1, w: 11.9, h: 0.35,
  fontFace: 'Arial', fontSize: 14, bold: true, underline: true, color: COLORS.NAVY_BLUE,
});
const feasItems = [
  { text: '• Built on open-source stack (React, Node.js, PostgreSQL) → eliminates proprietary licensing costs and keeps budget minimal.\n', options: { fontSize: 11, color: COLORS.SLATE_DARK } },
  { text: '• Highly scalable architecture capable of supporting thousands of simultaneous trainees across MoES/IMD departments.\n', options: { fontSize: 11, color: COLORS.SLATE_DARK } },
  { text: '• Resilient dual-database mode (PostgreSQL + Memory Store) guarantees 99.9% uptime even during database maintenance.', options: { fontSize: 11, color: COLORS.SLATE_DARK } },
];
slide4.addText(feasItems, { x: 0.8, y: 1.45, w: 11.8, h: 1.3, valign: 'top' });

// Challenges Box
slide4.addShape(pptx.shapes.RECTANGLE, {
  x: 0.5, y: 2.95, w: 12.33, h: 1.7,
  fill: { color: COLORS.WHITE },
  line: { color: COLORS.SLATE_DARK, width: 1.5 },
});
slide4.addText('Challenges :', {
  x: 0.7, y: 3.05, w: 11.9, h: 0.35,
  fontFace: 'Arial', fontSize: 14, bold: true, underline: true, color: COLORS.NAVY_BLUE,
});
const chalItems = [
  { text: '• Limited internet connectivity in remote regional meteorological centers.\n', options: { fontSize: 11, color: COLORS.SLATE_DARK } },
  { text: '• Data fragmentation across legacy departmental training records.\n', options: { fontSize: 11, color: COLORS.SLATE_DARK } },
  { text: '• Diverse digital literacy levels among trainees hindering platform adoption.', options: { fontSize: 11, color: COLORS.SLATE_DARK } },
];
slide4.addText(chalItems, { x: 0.8, y: 3.4, w: 11.8, h: 1.2, valign: 'top' });

// Solutions Box
slide4.addShape(pptx.shapes.RECTANGLE, {
  x: 0.5, y: 4.8, w: 12.33, h: 2.0,
  fill: { color: COLORS.WHITE },
  line: { color: COLORS.SLATE_DARK, width: 1.5 },
});
slide4.addText('Solutions :', {
  x: 0.7, y: 4.9, w: 11.9, h: 0.35,
  fontFace: 'Arial', fontSize: 14, bold: true, underline: true, color: COLORS.NAVY_BLUE,
});
const sol2Items = [
  { text: '• Offline Resilient Mode: Client-side session caching and memory fallback during network drops.\n', options: { fontSize: 11, color: COLORS.SLATE_DARK } },
  { text: '• Automated Data Normalization: Seamless migration scripts for importing legacy employee training records.\n', options: { fontSize: 11, color: COLORS.SLATE_DARK } },
  { text: '• Intuitive Voice & AI Assistance: Simplified UI with instant suggestion chips, mode toggles, and step-by-step guidance.', options: { fontSize: 11, color: COLORS.SLATE_DARK } },
];
slide4.addText(sol2Items, { x: 0.8, y: 5.25, w: 11.8, h: 1.4, valign: 'top' });


// =============================================================================
// SLIDE 5: IMPACT AND BENEFITS
// =============================================================================
const slide5 = pptx.addSlide();
addHeader(slide5, 'IMPACT AND BENEFITS', '5');

// Left Column: Target Audience, Impact, Benefits, Wider Impact
slide5.addText('Target Audience :', {
  x: 0.5, y: 0.95, w: 7.0, h: 0.3,
  fontFace: 'Arial', fontSize: 13, bold: true, underline: true, color: COLORS.NAVY_BLUE,
});
slide5.addText('• Meteorological staff, software engineers, trainers, HR managers, and MoES/IMD heads.', {
  x: 0.6, y: 1.25, w: 7.0, h: 0.4, fontFace: 'Arial', fontSize: 11, color: COLORS.SLATE_DARK,
});

slide5.addText('Impact :', {
  x: 0.5, y: 1.7, w: 7.0, h: 0.3,
  fontFace: 'Arial', fontSize: 13, bold: true, underline: true, color: COLORS.NAVY_BLUE,
});
const impactText = [
  { text: '• Promotes structured capacity building with real-time competency analytics.\n', options: { fontSize: 11, color: COLORS.SLATE_DARK } },
  { text: '• 40% faster skill gap identification and targeted training deployment.\n', options: { fontSize: 11, color: COLORS.SLATE_DARK } },
  { text: '• Capacity Radar prevents employee burnout through real-time workload heatmaps.', options: { fontSize: 11, color: COLORS.SLATE_DARK } },
];
slide5.addText(impactText, { x: 0.6, y: 2.0, w: 7.0, h: 1.1, valign: 'top' });

slide5.addText('Benefits :', {
  x: 0.5, y: 3.2, w: 7.0, h: 0.3,
  fontFace: 'Arial', fontSize: 13, bold: true, underline: true, color: COLORS.NAVY_BLUE,
});
const benText = [
  { text: '• 100% Cryptographic Certificate Verification via SHA-256 public links.\n', options: { fontSize: 11, color: COLORS.SLATE_DARK } },
  { text: '• Zero AI Hallucination: AI Assistant prioritizes approved course materials.\n', options: { fontSize: 11, color: COLORS.SLATE_DARK } },
  { text: '• Low cloud infrastructure footprint using Vite + Express architecture.', options: { fontSize: 11, color: COLORS.SLATE_DARK } },
];
slide5.addText(benText, { x: 0.6, y: 3.5, w: 7.0, h: 1.1, valign: 'top' });

slide5.addText('Wider Impact :', {
  x: 0.5, y: 4.7, w: 7.0, h: 0.3,
  fontFace: 'Arial', fontSize: 13, bold: true, underline: true, color: COLORS.NAVY_BLUE,
});
const widerText = [
  { text: '• Aligned with ', options: { fontSize: 11, color: COLORS.SLATE_DARK } },
  { text: 'Mission Karmayogi ', options: { bold: true, fontSize: 11, color: COLORS.SIH_ORANGE } },
  { text: '(National Programme for Civil Services Capacity Building).\n', options: { fontSize: 11, color: COLORS.SLATE_DARK } },
  { text: '• Supports ', options: { fontSize: 11, color: COLORS.SLATE_DARK } },
  { text: 'SDG 4: Quality Education ', options: { bold: true, fontSize: 11, color: COLORS.BLUE_ACCENT } },
  { text: '& Lifelong Learning Opportunities.', options: { fontSize: 11, color: COLORS.SLATE_DARK } },
];
slide5.addText(widerText, { x: 0.6, y: 5.0, w: 7.0, h: 1.5, valign: 'top' });

// Right Column: Impact Graphic Badges
const impactBadges = [
  { text: 'Boost Capacity & Reduce Gaps', fill: 'DCFCE7', color: '15803D' },
  { text: 'Zero AI Hallucination Engine', fill: 'FEF3C7', color: 'B45309' },
  { text: '100% Cryptographic Certificate Trust', fill: 'DBEAFE', color: '1D4ED8' },
  { text: 'Real-Time Burnout Risk Mitigation', fill: 'F3E8FF', color: '6B21A8' },
  { text: 'Aligned with Mission Karmayogi', fill: 'FFEDD5', color: 'C2410C' },
];

let bY = 1.1;
impactBadges.forEach((b) => {
  slide5.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 8.2, y: bY, w: 4.6, h: 0.85,
    fill: { color: b.fill },
    line: { color: b.color, width: 2 },
  });
  slide5.addText(b.text, {
    x: 8.3, y: bY, w: 4.4, h: 0.85,
    fontFace: 'Arial', fontSize: 11.5, bold: true, color: b.color, align: 'center', valign: 'middle',
  });
  bY += 1.05;
});


// =============================================================================
// SLIDE 6: RESEARCH AND REFERENCES
// =============================================================================
const slide6 = pptx.addSlide();
addHeader(slide6, 'RESEARCH AND REFERENCES', '6');

slide6.addText('Key References & Technical Documentation :', {
  x: 0.5, y: 1.0, w: 12.33, h: 0.4,
  fontFace: 'Arial', fontSize: 15, bold: true, color: COLORS.NAVY_BLUE,
});

const refItems = [
  { text: '• Artificial Intelligence in Capacity Building & Yield Optimization: Advancing Competency Tracking\n', options: { bold: true, fontSize: 12, color: COLORS.SLATE_DARK } },
  { text: '  https://www.sciencedirect.com/science/article/pii/S2666154325001334\n\n', options: { fontSize: 11, color: COLORS.BLUE_ACCENT, hyperlink: { url: 'https://www.sciencedirect.com/science/article/pii/S2666154325001334' } } },

  { text: '• Retrieval-Augmented Generation (RAG) Architecture for Enterprise Course Learning:\n', options: { bold: true, fontSize: 12, color: COLORS.SLATE_DARK } },
  { text: '  https://arxiv.org/abs/2005.11401 (Lewis et al., RAG for Knowledge-Intensive NLP Tasks)\n\n', options: { fontSize: 11, color: COLORS.BLUE_ACCENT, hyperlink: { url: 'https://arxiv.org/abs/2005.11401' } } },

  { text: '• India Meteorological Department (IMD) Official Capacity Portal & Guidelines:\n', options: { bold: true, fontSize: 12, color: COLORS.SLATE_DARK } },
  { text: '  https://mausam.imd.gov.in (MoES / IMD Smart Education Framework 2025)\n\n', options: { fontSize: 11, color: COLORS.BLUE_ACCENT, hyperlink: { url: 'https://mausam.imd.gov.in' } } },

  { text: '• React.js & Node.js Enterprise Performance & State Management Documentation:\n', options: { bold: true, fontSize: 12, color: COLORS.SLATE_DARK } },
  { text: '  https://react.dev | https://nodejs.org (Modern Web Application Best Practices)\n\n', options: { fontSize: 11, color: COLORS.BLUE_ACCENT, hyperlink: { url: 'https://react.dev' } } },

  { text: '• PostgreSQL Relational Schema & Cryptographic SHA-256 Hashing Security Standards:\n', options: { bold: true, fontSize: 12, color: COLORS.SLATE_DARK } },
  { text: '  https://www.postgresql.org/docs (Database Integrity & Security Guidelines)\n\n', options: { fontSize: 11, color: COLORS.BLUE_ACCENT, hyperlink: { url: 'https://www.postgresql.org/docs' } } },

  { text: '• Capacity Connect Official Open-Source GitHub Repository:\n', options: { bold: true, fontSize: 12, color: COLORS.SLATE_DARK } },
  { text: '  https://github.com/jagendra481/Capacity_connect (Source Code, Tests, and Migrations)', options: { bold: true, fontSize: 11, color: COLORS.SIH_ORANGE, hyperlink: { url: 'https://github.com/jagendra481/Capacity_connect' } } },
];

slide6.addText(refItems, { x: 0.6, y: 1.5, w: 12.0, h: 5.2, valign: 'top' });

// Save PowerPoint Presentation
const outputPath = path.join(__dirname, '../Capacity_Connect_SIH_2025_Presentation.pptx');
pptx.writeFile({ fileName: outputPath })
  .then((fileName) => {
    console.log(`\n✅ PowerPoint presentation generated successfully!`);
    console.log(`📁 File Saved at: ${fileName}\n`);
  })
  .catch((err) => {
    console.error(`❌ Error generating PowerPoint file:`, err);
  });
