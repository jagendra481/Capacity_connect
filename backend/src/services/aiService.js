const ragService = require('./ragService');
const env = require('../config/env');

/**
 * Real-Time Capacity Connect Enterprise Dataset
 */
const capacityData = {
  resources: [
    { id: 'res_1', name: 'Rahul Sharma', role: 'Senior React Developer', department: 'Digital Infrastructure', skills: ['React', 'TypeScript', 'Node.js', 'Redux', 'Next.js'], availableHours: 32, currentProject: 'Enterprise Portal', status: 'Available', email: 'rahul.sharma@capacityconnect.org' },
    { id: 'res_2', name: 'Priya Patel', role: 'Full Stack Engineer', department: 'Core Engineering', skills: ['React', 'Node.js', 'PostgreSQL', 'GraphQL', 'Express'], availableHours: 27, currentProject: 'Auth Microservice', status: 'Available', email: 'priya.patel@capacityconnect.org' },
    { id: 'res_3', name: 'Amit Verma', role: 'Frontend Specialist', department: 'Product Design & UI', skills: ['React', 'Next.js', 'TailwindCSS', 'Vite', 'TypeScript'], availableHours: 24, currentProject: 'Dashboard Redesign', status: 'Available', email: 'amit.verma@capacityconnect.org' },
    { id: 'res_4', name: 'Sneha Rao', role: 'Cloud & DevOps Architect', department: 'Platform Engineering', skills: ['Kubernetes', 'Docker', 'AWS', 'CI/CD', 'Terraform'], availableHours: 15, currentProject: 'Infra Migration', status: 'Partially Allocated', email: 'sneha.rao@capacityconnect.org' },
    { id: 'res_5', name: 'Vikram Singh', role: 'Backend Developer', department: 'Digital Infrastructure', skills: ['Node.js', 'Express', 'MongoDB', 'Redis', 'Microservices'], availableHours: 38, currentProject: 'None', status: 'Available', email: 'vikram.singh@capacityconnect.org' },
    { id: 'res_6', name: 'Ananya Iyer', role: 'UI/UX & Frontend Engineer', department: 'Product Design & UI', skills: ['Figma', 'React', 'CSS', 'Accessibility', 'TailwindCSS'], availableHours: 20, currentProject: 'Design System 2.0', status: 'Available', email: 'ananya.iyer@capacityconnect.org' },
    { id: 'res_7', name: 'Rohan Gupta', role: 'Data Engineer', department: 'Analytics & AI', skills: ['Python', 'SQL', 'BigQuery', 'Kafka', 'ETL'], availableHours: 8, currentProject: 'Analytics Pipeline', status: 'Overallocated', email: 'rohan.gupta@capacityconnect.org' }
  ],
  projects: [
    { id: 'proj_1', name: 'Capacity Connect AI', status: 'In Progress', requiredSkills: ['React', 'Node.js', 'AI Integration', 'TailwindCSS'], lead: 'Aarav Sharma', deadline: '2026-10-15', teamSize: 4 },
    { id: 'proj_2', name: 'Cloud Security Audit', status: 'Active', requiredSkills: ['Kubernetes', 'AWS', 'Security', 'Docker'], lead: 'Sneha Rao', deadline: '2026-11-01', teamSize: 3 },
    { id: 'proj_3', name: 'Design System 2.0', status: 'Planning', requiredSkills: ['React', 'Figma', 'CSS', 'TypeScript'], lead: 'Ananya Iyer', deadline: '2026-12-10', teamSize: 2 },
    { id: 'proj_4', name: 'Analytics & Telemetry Pipeline', status: 'Active', requiredSkills: ['Python', 'BigQuery', 'Kafka', 'SQL'], lead: 'Rohan Gupta', deadline: '2026-09-30', teamSize: 3 }
  ],
  departments: [
    { name: 'Digital Infrastructure', head: 'Vikram Singh', totalCapacity: 70, allocatedCapacity: 38 },
    { name: 'Core Engineering', head: 'Priya Patel', totalCapacity: 60, allocatedCapacity: 33 },
    { name: 'Product Design & UI', head: 'Ananya Iyer', totalCapacity: 50, allocatedCapacity: 30 },
    { name: 'Platform Engineering', head: 'Sneha Rao', totalCapacity: 40, allocatedCapacity: 25 },
    { name: 'Analytics & AI', head: 'Rohan Gupta', totalCapacity: 40, allocatedCapacity: 32 }
  ],
  platformRoutes: [
    { name: 'Trainee Dashboard', path: '/trainee/dashboard', description: 'Overview of your competencies, enrolled courses, assessments, and notifications' },
    { name: 'My Courses', path: '/trainee/courses', description: 'Access all your enrolled courses, syllabus, lessons, and video lectures' },
    { name: 'Skill Gap Analysis', path: '/skills/gap', description: 'Interactive skill gap analyzer showing required vs current competency levels' },
    { name: 'Competency Matrix', path: '/competency/matrix', description: 'Role-based competency grid across all organizational levels' },
    { name: 'Capacity Radar (USP)', path: '/capacity/radar', description: 'Organizational capacity risk radar, skill distribution, and ROI training calculator' },
    { name: 'Capacity Report', path: '/capacity/report', description: 'Detailed executive report on enterprise capacity and departmental metrics' },
    { name: 'Assessments & Quizzes', path: '/trainee/assessments', description: 'Test your knowledge with timed quizzes and view instant grading results' },
    { name: 'Certificates & Verification', path: '/certificates', description: 'View and download earned certificates with cryptographic hash verification' },
    { name: 'Training Calendar', path: '/calendar', description: 'Schedule of live trainer workshops, webinars, and session registrations' },
    { name: 'Knowledge Hub', path: '/knowledge', description: 'Enterprise social knowledge base to read, create posts, share insights, and comment' },
    { name: 'Gamification & Leaderboard', path: '/gamification/leaderboard', description: 'XP points leaderboard and employee rank standings' },
    { name: 'Achievements & Badges', path: '/gamification/achievements', description: 'Unlock achievement badges by completing courses and scoring high on quizzes' },
    { name: 'Recommendations & Learning Paths', path: '/recommendations', description: 'AI-driven custom course recommendations based on your skill gaps' },
    { name: 'AI Learning Assistant', path: '/ai/assistant', description: 'Dedicated RAG study tool for deep course Q&A, flashcards, and practice questions' },
    { name: 'User Profile & Settings', path: '/trainee/profile', description: 'View and edit your personal profile, bio, skills, and department' },
    { name: 'Admin Dashboard', path: '/admin/dashboard', description: 'Administrator controls for user management, department analytics, and reports' }
  ]
};

class AIService {
  /**
   * Domain Tool Helpers
   */
  getAvailableResources(minHours = 0) {
    return capacityData.resources.filter(r => r.availableHours >= minHours);
  }

  searchResourcesBySkillOrRole(query) {
    const q = query.toLowerCase();
    return capacityData.resources.filter(r => 
      r.skills.some(s => s.toLowerCase().includes(q)) ||
      r.role.toLowerCase().includes(q) ||
      r.name.toLowerCase().includes(q) ||
      r.department.toLowerCase().includes(q)
    );
  }

  getCapacitySummary() {
    const totalResources = capacityData.resources.length;
    const totalHoursAvailable = capacityData.resources.reduce((sum, r) => sum + r.availableHours, 0);
    const highCap = capacityData.resources.filter(r => r.availableHours >= 20).length;
    const overAlloc = capacityData.resources.filter(r => r.availableHours < 10).length;
    return {
      totalResources,
      totalHoursAvailable,
      highCapacityDevs: highCap,
      overAllocatedDevs: overAlloc,
      averageHours: Math.round(totalHoursAvailable / totalResources)
    };
  }

  getAllProjects() {
    return capacityData.projects;
  }

  /**
   * Main Broad Dispatcher
   */
  async chat({ prompt, courseId = null, mode = 'general', history = [], user = null }) {
    const query = (prompt || '').trim();
    const qLower = query.toLowerCase();

    // =========================================================================
    // 1. External LLM Provider (Google Gemini / OpenAI) if API Key configured
    // =========================================================================
    const apiKey = env.aiApiKey || process.env.AI_API_KEY || process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'mock_ai_key_change_in_production' && apiKey !== 'your_api_key_here') {
      try {
        const systemPrompt = `You are the Capacity Connect Enterprise AI Assistant.
You have full domain knowledge of the Capacity Connect platform (competencies, skill gaps, capacity radar, courses, certificates, assessments, training calendar, team resources, and technical engineering best practices).
Platform Data Context:
${JSON.stringify({ capacityData: this.getCapacitySummary(), resources: capacityData.resources, projects: capacityData.projects, routes: capacityData.platformRoutes }, null, 2)}

Instructions:
1. Answer the user's question directly, concisely, and professionally.
2. Format answers with clear markdown headers, bold keywords, and bullet points.
3. If the user asks about platform features, recommend the specific page/route.
4. If the user asks technical, coding, or architecture questions, provide clear explanations, analogies, and best practices.
5. If the user asks about available people, quote real names, roles, and hours from the data.`;

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Question: ${query}` }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 1000 }
          })
        });

        if (res.ok) {
          const data = await res.json();
          const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidate) {
            return {
              answer: candidate,
              reply: candidate,
              sources: [],
              ragUsed: false,
              mode
            };
          }
        }
      } catch (err) {
        console.warn('[AI Service] Gemini LLM call failed; engaging local intelligence engine:', err.message);
      }
    }

    // =========================================================================
    // 2. Comprehensive Local Domain & Technical Intelligence Engine
    // =========================================================================

    // A. Greetings & Identity
    if (/^(hi|hello|hey|greetings|good\s*(morning|afternoon|evening)|who are you|what can you do)/i.test(query) && !qLower.includes('architecture') && !qLower.includes('capacity') && !qLower.includes('skill')) {
      const userName = user?.name ? ` ${user.name}` : '';
      const text = `👋 Hello${userName}! I am your **Capacity Connect AI Assistant**.\n\nI can help you across the entire platform with:\n\n` +
        `• 🔍 **Resource & Capacity Management**: Find available developers, check workload metrics, search talent by skill.\n` +
        `• 📊 **Capacity Radar & ROI**: Analyze skill gaps, risk heatmaps, and training ROI.\n` +
        `• 🧭 **Platform Navigation**: Direct you to any course, assessment, calendar event, certificate, or leaderboard.\n` +
        `• 📚 **Technical & Architecture Guidance**: Explain clean code, software engineering concepts, APIs, and frameworks.\n` +
        `• 🎓 **Exam Prep & Flashcards**: Generate practice questions and summarized study notes.\n\n` +
        `What would you like to explore today?`;
      return { answer: text, reply: text, sources: [], ragUsed: false, mode };
    }

    // B. Resource Availability & Hours
    if (qLower.includes('available') || qLower.includes('availability') || qLower.includes('who is free') || qLower.includes('free hours') || qLower.includes('who can work')) {
      const minHours = qLower.match(/(\d+)\s*hours?/i) ? parseInt(qLower.match(/(\d+)\s*hours?/i)[1], 10) : 10;
      const available = this.getAvailableResources(minHours);
      if (available.length === 0) {
        const text = `Currently, no team members have more than **${minHours} hours** available this week.\n\nTry checking the [Capacity Radar](/capacity/radar) for departmental capacity trends.`;
        return { answer: text, reply: text, sources: [], ragUsed: false, mode };
      }
      const list = available.map(r => `• **${r.name}** (${r.role}) — **${r.availableHours}h** available | Skills: ${r.skills.join(', ')}`).join('\n');
      const text = `Here are the team members with at least **${minHours} hours** available this week:\n\n${list}\n\n💡 *Tip: You can allocate these developers to ongoing projects or request specific skill matches.*`;
      return { answer: text, reply: text, sources: [], ragUsed: false, mode };
    }

    // C. Skill or Talent Search across all technical domains
    const commonSkills = ['react', 'node', 'python', 'kubernetes', 'docker', 'figma', 'aws', 'sql', 'bigquery', 'kafka', 'next.js', 'typescript', 'mongodb', 'graphql', 'redux', 'tailwind', 'devops', 'backend', 'frontend', 'data'];
    const matchedSkill = commonSkills.find(s => qLower.includes(s));
    if (matchedSkill || qLower.includes('find developer') || qLower.includes('search resource') || qLower.includes('who knows')) {
      const searchKey = matchedSkill || query.replace(/find|search|who knows|developer|engineer|specialist/gi, '').trim();
      const matches = this.searchResourcesBySkillOrRole(searchKey);
      if (matches.length > 0) {
        const list = matches.map(r => `• **${r.name}** (${r.role}, ${r.department}) — **${r.availableHours}h** available\n  *Skills*: ${r.skills.join(', ')}`).join('\n\n');
        const text = `Found **${matches.length}** team members matching **"${searchKey}"**:\n\n${list}\n\nWould you like project assignment recommendations for any of these members?`;
        return { answer: text, reply: text, sources: [], ragUsed: false, mode };
      }
    }

    // D. Projects & Allocations
    if (qLower.includes('project') || qLower.includes('deadline') || qLower.includes('ongoing initiatives')) {
      const projects = this.getAllProjects();
      const list = projects.map(p => `• **${p.name}** (${p.status})\n  - **Lead**: ${p.lead} | **Team Size**: ${p.teamSize}\n  - **Deadline**: ${p.deadline}\n  - **Required Stack**: ${p.requiredSkills.join(', ')}`).join('\n\n');
      const text = `Here is the current status of all enterprise projects in Capacity Connect:\n\n${list}\n\nNeed help staffing any of these projects?`;
      return { answer: text, reply: text, sources: [], ragUsed: false, mode };
    }

    // E. Capacity Radar, ROI & Organizational Risk (USP)
    if (qLower.includes('radar') || qLower.includes('roi') || qLower.includes('risk') || qLower.includes('workload summary') || (qLower.includes('capacity') && !qLower.includes('available'))) {
      const summary = this.getCapacitySummary();
      const text = `📊 **Capacity Connect Radar & Analytics (USP)**\n\n` +
        `• **Total Team Resources**: ${summary.totalResources} specialists\n` +
        `• **Total Available Capacity**: ${summary.totalHoursAvailable} hours this week\n` +
        `• **Average Bandwidth**: ${summary.averageHours} hrs/person\n` +
        `• **High-Capacity Talent (>20h)**: ${summary.highCapacityDevs} members\n` +
        `• **Over-Allocated Risk (<10h)**: ${summary.overAllocatedDevs} members at burnout risk\n\n` +
        `📈 **How ROI is calculated**: ROI (%) = ((Estimated Cost Savings + Productivity Gain - Training Cost) / Training Cost) × 100.\n\n` +
        `👉 Visit the [Capacity Radar Dashboard](/capacity/radar) to view interactive department heatmaps and the ROI Calculator.`;
      return { answer: text, reply: text, sources: [], ragUsed: false, mode };
    }

    // F. Skill Gap Analysis & Competency Matrix
    if (qLower.includes('skill gap') || qLower.includes('competency') || qLower.includes('gap formula') || qLower.includes('matrix')) {
      const text = `🎯 **Competency & Skill Gap Analysis**\n\n` +
        `**Formula**: \`Skill Gap = Required Role Level (1-5) - Current Demonstrated Level (1-5)\`\n\n` +
        `• **No Gap (0)**: Fully proficient in assigned role.\n` +
        `• **Low Gap (1)**: Minor upskilling recommended via micro-lessons.\n` +
        `• **Medium Gap (2)**: Requires structured course enrollment.\n` +
        `• **Critical Gap (3+)**: Priority training required before deployment to production.\n\n` +
        `🔗 Quick Links:\n` +
        `• View your personalized gaps: [Skill Gap Analysis](/skills/gap)\n` +
        `• View organizational baselines: [Competency Matrix](/competency/matrix)`;
      return { answer: text, reply: text, sources: [], ragUsed: false, mode };
    }

    // G. Assessments, Quizzes & Grading
    if (qLower.includes('assessment') || qLower.includes('quiz') || qLower.includes('exam') || qLower.includes('score') || qLower.includes('grade') || qLower.includes('retake')) {
      const text = `📝 **Assessments & Evaluation System**\n\n` +
        `• **Format**: Timed multiple-choice questions linked directly to course modules.\n` +
        `• **Passing Threshold**: 70% or higher unlocks the course completion badge and certificate.\n` +
        `• **Retake Policy**: You can retake assessments to improve your competency score.\n` +
        `• **Instant Feedback**: Every question provides a detailed breakdown of correct principles.\n\n` +
        `👉 Ready to test your skills? Check your pending tests on [My Assessments](/trainee/assessments).`;
      return { answer: text, reply: text, sources: [], ragUsed: false, mode };
    }

    // H. Certificates & Cryptographic Verification
    if (qLower.includes('certificate') || qLower.includes('verify') || qLower.includes('credential') || qLower.includes('download certificate')) {
      const text = `📜 **Certificates & Verification**\n\n` +
        `• **Issuance**: Automatically generated upon completing 100% of course lessons and passing the final assessment.\n` +
        `• **Verification**: Each certificate is cryptographically secured with a unique SHA-256 validation hash.\n` +
        `• **Public Verification**: Employers and external auditors can verify authenticity directly at \`/certificates/verify/:hash\`.\n\n` +
        `👉 Access your credentials on the [Certificates Page](/certificates).`;
      return { answer: text, reply: text, sources: [], ragUsed: false, mode };
    }

    // I. Training Calendar, Workshops & Sessions
    if (qLower.includes('calendar') || qLower.includes('session') || qLower.includes('workshop') || qLower.includes('webinar') || qLower.includes('schedule') || qLower.includes('rsvp')) {
      const text = `📅 **Live Training Calendar & Workshops**\n\n` +
        `• **Live Sessions**: Weekly interactive masterclasses hosted by enterprise trainers.\n` +
        `• **Registration**: Click the **Register / RSVP** button on any upcoming session.\n` +
        `• **Topics**: Microservices, Cloud Architecture, Security Compliance, and UI Systems.\n\n` +
        `👉 Check upcoming dates and RSVP on the [Training Calendar](/calendar).`;
      return { answer: text, reply: text, sources: [], ragUsed: false, mode };
    }

    // J. Gamification, Badges & Leaderboard
    if (qLower.includes('badge') || qLower.includes('leaderboard') || qLower.includes('points') || qLower.includes('xp') || qLower.includes('gamification') || qLower.includes('rank')) {
      const text = `🏆 **Gamification, XP & Leaderboard**\n\n` +
        `• **Earning XP**: Earn +50 XP for completed lessons, +100 XP for scoring 90%+ on quizzes, and +20 XP for Knowledge Hub contributions.\n` +
        `• **Achievement Badges**: Unlock milestones like *Fast Learner*, *Clean Architect*, and *Top Contributor*.\n` +
        `• **Leaderboard**: Compete with colleagues across departments for top monthly rankings.\n\n` +
        `🔗 Explore:\n` +
        `• View standings: [Leaderboard](/gamification/leaderboard)\n` +
        `• View your badges: [My Achievements](/gamification/achievements)`;
      return { answer: text, reply: text, sources: [], ragUsed: false, mode };
    }

    // K. Knowledge Hub & Community
    if (qLower.includes('knowledge') || qLower.includes('post') || qLower.includes('community') || qLower.includes('share article')) {
      const text = `💡 **Capacity Connect Knowledge Hub**\n\n` +
        `• **Collaborative Learning**: Share engineering articles, code snippets, and architectural post-mortems.\n` +
        `• **Engagement**: Upvote helpful posts and engage in discussion threads.\n` +
        `• **Create a Post**: Write in Markdown and tag relevant competencies.\n\n` +
        `👉 Share with the team on the [Knowledge Hub](/knowledge) or [Create a Post](/knowledge/create).`;
      return { answer: text, reply: text, sources: [], ragUsed: false, mode };
    }

    // D2. Courses, Syllabus & Learning Modules
    if (qLower.includes('course') || qLower.includes('lesson') || qLower.includes('syllabus') || qLower.includes('curriculum') || qLower.includes('learning path')) {
      const text = `📚 **Courses, Lessons & Syllabus**\n\n` +
        `• **Enrolled Courses**: Access your active courses, video lectures, and syllabus on [My Courses](/trainee/courses).\n` +
        `• **Course Catalog**: Browse enterprise competency courses in React, Node.js, Cloud Architecture, and AI on the [Course Catalog](/courses).\n` +
        `• **Custom Learning Paths**: Follow targeted paths curated for your role on [Learning Paths](/recommendations/paths).\n\n` +
        `💡 *Need recommendations for a specific role or skill? Ask me!*`;
      return { answer: text, reply: text, sources: [], ragUsed: false, mode };
    }

    // L. Platform Navigation & Page Finder (GPS)
    if (qLower.includes('where') || qLower.includes('how to find') || qLower.includes('navigate') || qLower.includes('go to') || qLower.includes('page') || qLower.includes('link')) {
      const matchedRoute = capacityData.platformRoutes.find(r => 
        qLower.includes(r.name.toLowerCase()) || 
        r.description.toLowerCase().split(' ').some(w => w.length > 4 && qLower.includes(w))
      );
      if (matchedRoute) {
        const text = `🧭 **Navigation Guide**:\n\nTo access **${matchedRoute.name}**, visit [**${matchedRoute.name}**](${matchedRoute.path}).\n\n*Feature Summary*: ${matchedRoute.description}`;
        return { answer: text, reply: text, sources: [], ragUsed: false, mode };
      }
    }

    // M. Broad Software Engineering & Architecture Technical Q&A
    if (qLower.includes('jwt') || qLower.includes('token') || qLower.includes('auth')) {
      const text = `🔒 **JWT (JSON Web Token) Authentication Guide**\n\n` +
        `1. **Structure**: Header (algorithm), Payload (claims, user ID, role), and Signature (secret verification).\n` +
        `2. **Transmission**: Sent via HTTP \`Authorization: Bearer <token>\` headers.\n` +
        `3. **Security Best Practice**: Validate tokens on backend middleware; never store critical secrets in client-side localStorage without expiration.\n` +
        `4. **Capacity Connect Integration**: Stored securely to protect trainee and trainer API endpoints.`;
      return { answer: text, reply: text, sources: [], ragUsed: false, mode };
    }

    if (qLower.includes('docker') || qLower.includes('container') || qLower.includes('kubernetes') || qLower.includes('k8s')) {
      const text = `🐳 **Containers & Kubernetes Architecture**\n\n` +
        `• **Docker**: Packages application code, runtime, system tools, and libraries into lightweight, reproducible containers.\n` +
        `• **Kubernetes (K8s)**: Container orchestration engine that automates deployment, scaling, load balancing, and self-healing across server clusters.\n` +
        `• **Enterprise Value**: Eliminates "it works on my machine" issues and enables zero-downtime rolling updates.`;
      return { answer: text, reply: text, sources: [], ragUsed: false, mode };
    }

    if (qLower.includes('rest') || qLower.includes('graphql') || qLower.includes('api design')) {
      const text = `🌐 **REST vs GraphQL Comparison**\n\n` +
        `• **REST**: Resource-oriented architecture using standard HTTP verbs (\`GET\`, \`POST\`, \`PUT\`, \`DELETE\`). Simpler caching and ubiquitous tooling.\n` +
        `• **GraphQL**: Schema-driven query language where the client specifies exact requested fields, eliminating over-fetching and under-fetching.\n` +
        `• **Capacity Connect Pattern**: Uses clean REST APIs with centralized error handling and JWT middleware.`;
      return { answer: text, reply: text, sources: [], ragUsed: false, mode };
    }

    if (qLower.includes('microservice') || qLower.includes('monolith')) {
      const text = `🏗️ **Microservices vs Monolithic Architecture**\n\n` +
        `• **Monolith**: Single unified codebase. Faster to develop initially, but harder to scale across large distributed teams.\n` +
        `• **Microservices**: Independent services communicating via REST/gRPC/Kafka. Enables domain decoupling, independent CI/CD, and targeted autoscaling.\n` +
        `• **Clean Architecture**: Both patterns benefit from isolating business domain logic from infrastructure and databases.`;
      return { answer: text, reply: text, sources: [], ragUsed: false, mode };
    }

    if (qLower.includes('state') || qLower.includes('redux') || qLower.includes('hook') || qLower.includes('context')) {
      const text = `⚛️ **Modern React State Management**\n\n` +
        `• **Local State (\`useState\`)**: Component-specific UI states (toggle dropdowns, form inputs).\n` +
        `• **Global Context (\`useContext\`)**: App-wide low-frequency state (Theme, AuthUser, ActiveNotifications).\n` +
        `• **Redux / Zustand**: Complex multi-step data flows and time-travel debugging.\n` +
        `• **Best Practice**: Encapsulate async API interactions within dedicated custom hooks for maintainability.`;
      return { answer: text, reply: text, sources: [], ragUsed: false, mode };
    }

    // N. Fallback to Course Material RAG retrieval
    const relevantChunks = await ragService.retrieveRelevantMaterial(query, courseId);
    const contextText = relevantChunks.map(c => c.chunk).join('\n---\n');
    const sources = relevantChunks.map(c => ({
      courseTitle: c.courseTitle,
      source: c.source,
    }));

    let answer = '';
    if (mode === 'explain') {
      answer = `### 💡 Simplified Breakdown\n\nRegarding **"${query}"**:\n\n1. **Core Concept**: It organizes your system into decoupled, modular components.\n2. **Practical Analogy**: Think of it like a building blueprint — each subsystem has a designated role to prevent bottlenecks.\n\n*Reference Material Context*:\n${contextText}`;
    } else if (mode === 'summarize') {
      answer = `### 📋 Key Summary\n\nTop takeaways for **"${query}"**:\n\n- Encapsulate reusable state and API logic in custom services/hooks.\n- Maintain clean architecture and secure authentication token headers.\n- Use centralized error handling for process stability.\n\n*Course Context*:\n${contextText}`;
    } else {
      answer = `### 📚 Knowledge Base Response\n\nRegarding **"${query}"**:\n\n${relevantChunks[0]?.chunk || 'In enterprise software systems, clean architecture, automated competency management, and resource visibility ensure consistent project delivery.'}\n\n💡 *Tip: You can ask me about team capacity, developer skills, certificates, or quizzes.*`;
    }

    return {
      answer,
      reply: answer,
      sources,
      ragUsed: relevantChunks.length > 0,
      mode,
    };
  }

  async generatePracticeQuestions(topic = 'React & Node.js') {
    return [
      {
        question: `What is the primary benefit of Clean Architecture in ${topic}?`,
        options: [
          'Decouples core business domain logic from UI frameworks and external drivers',
          'Eliminates the need for testing',
          'Forces all code into a single massive file',
          'Bypasses security protocols'
        ],
        correctIndex: 0,
        explanation: 'Clean Architecture ensures that core business rules remain independent of UI, database, and third-party changes.',
      },
      {
        question: `Why should JWT validation happen on the backend server?`,
        options: [
          'Because the backend is the final authority for authorization',
          'To reduce bundle size on the frontend',
          'To bypass database connection limits',
          'It is not necessary'
        ],
        correctIndex: 0,
        explanation: 'Client-side state can be inspected or modified; backend validation cryptographically ensures authorization.',
      },
      {
        question: `How is Skill Gap calculated in Capacity Connect?`,
        options: [
          'Skill Gap = Required Role Level - Current Demonstrated Level',
          'Skill Gap = Total Hours / 100',
          'Skill Gap = Number of Courses Completed',
          'Skill Gap is assigned randomly'
        ],
        correctIndex: 0,
        explanation: 'The formula evaluates the deficit between the required baseline competency level and the current assessed level.',
      }
    ];
  }

  async generateFlashcards(topic = 'Software Engineering') {
    return [
      {
        id: 1,
        front: `What is Clean Architecture in ${topic}?`,
        back: 'A software design philosophy that separates core business logic from UI frameworks and database drivers.',
      },
      {
        id: 2,
        front: 'What is Retrieval-Augmented Generation (RAG)?',
        back: 'A pattern that combines semantic text retrieval from a verified knowledge base with LLM generation to deliver factual responses with source citations.',
      },
      {
        id: 3,
        front: 'How is Training ROI calculated in Capacity Connect?',
        back: 'ROI (%) = ((Cost Savings + Productivity Gain - Training Cost) / Training Cost) × 100.',
      },
      {
        id: 4,
        front: 'What is the purpose of Certificate Hash Verification?',
        back: 'Generates a unique SHA-256 cryptographic signature allowing employers to independently verify authenticity.',
      }
    ];
  }
}

module.exports = new AIService();
