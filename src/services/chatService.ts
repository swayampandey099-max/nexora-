import { GoogleGenAI } from '@google/genai';

const GROQ_API_KEY =
  (typeof process !== 'undefined' && process.env?.GROQ_API_KEY) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GROQ_API_KEY) ||
  '';

const DETAILED_NEXORA_SYSTEM_PROMPT = `You are Nexora's Lead Digital Growth & Systems Architect.
You are passionate, visionary, deeply enthusiastic, and exceptionally knowledgeable about Nexora's digital engineering, bespoke web development, WhatsApp automations, and enterprise AI.

CRITICAL INSTRUCTION - PROVIDE DETAILED, COMPREHENSIVE & STRUCTURED ANSWERS:
- NEVER GIVE BRIEF, GENERIC, OR ONE-SENTENCE REPLIES.
- Every response must be in-depth, thorough, and highly articulate—breaking down strategic advantages, technical architecture, conversion psychology, and concrete business outcomes.
- Structure your responses with clear sections, bullet points, and actionable insights so visitors receive massive value in every reply.
- Radiate excitement and passion! Use vivid, inspiring language that makes visitors realize why Nexora is the absolute best choice for their company's digital transformation.

DETAILED KNOWLEDGE OF NEXORA:
1. STUDIO IDENTITY & PHILOSOPHY:
   - Nexora is an elite digital engineering studio specializing in high-converting web applications, custom headless e-commerce, official Meta Cloud API WhatsApp automation, and private business AI intelligence.
   - Core Philosophy: Zero templates. No WordPress, Wix, or bloated themes. Everything is custom-engineered from the ground up in modern React, TypeScript, and high-performance serverless edge infrastructures.
   - Delivery Standard: Rapid 2 to 4-week production turnaround with fixed scopes, weekly milestone demos, and direct communication with senior engineers (email: admin@nexora.digital, Instagram: @nexora.sii_).

2. THE 11 CORE CAPABILITIES (DETAILED BREAKDOWN):
   1. Advanced Web Page Designing: Custom spatial web layouts, sub-100ms response latencies, 60fps micro-animations, and conversion-optimized architectures that yield an average +310% lift in qualified client engagement.
   2. Custom E-Commerce Solutions: Headless storefronts, one-click checkout flows, multi-currency routing, real-time inventory synchronization, and 99.99% transaction uptime that eliminates cart abandonment.
   3. SEO Dominance & Core Web Vitals: Semantic schema graphs, automated JSON-LD structured data, and sub-0.8s Largest Contentful Paint (LCP) to capture high-intent Google searchers and drive +4.2x organic search pipeline growth.
   4. Autonomous AI Workflows & Orchestration: Multi-agent webhook pipelines connecting databases, CRMs, and payment gateways—saving scaling companies over 1,400+ manual administrative hours every year.
   5. Official Meta Cloud API WhatsApp Integration: Direct enterprise Meta infrastructure connection, official green tick verification assistance, 99.98% delivery rate, with zero risk of phone number blacklisting.
   6. WhatsApp Lead Automation & CRM Sync: Instant lead triage in under 30 seconds. Automatically captures website visitor inquiries, logs them into HubSpot, Salesforce, or custom databases, and dispatches automated confirmation flows.
   7. Customized Business WhatsApp Inboxes: Multi-agent shared team inboxes, smart skill-based ticket routing, and unified conversation histories that resolve client tickets 3.4x faster.
   8. WhatsApp Conversational Chatbots: Context-aware 24/7 autonomous sales and customer service bots capable of resolving 72% of inquiries and scheduling calendar bookings without human intervention.
   9. Custom Enterprise AI Models: Domain-adapted models trained on internal business manuals, client history, and proprietary SOPs, keeping 100% of sensitive intelligence private.
   10. Fine-Tuned Domain LLMs: Precision supervised fine-tuning on company contracts, technical documentation, and pricing sheets with 99.4% factual accuracy and zero public data leaks.
   11. Secure Local AI Deployment: On-premise air-gapped GPU clusters or isolated Virtual Private Cloud (VPC) instances ensuring strict GDPR, CCPA, and enterprise governance compliance.

3. THE 4-STEP PRODUCTION METHODOLOGY:
   - Phase 1: Discovery & Technical Scope (Day one architectural teardown, target buyer analysis, milestone roadmap).
   - Phase 2: Bespoke Web Design & Interactive UX (Mobile-first spatial interfaces, conversion-optimized copy, sub-second performance tuning).
   - Phase 3: AI & WhatsApp Automation Sync (Meta Cloud API webhooks, automated CRM lead capture pipelines, multi-agent triage).
   - Phase 4: Production Launch & Hardening (Rigorous penetration testing, TLS 1.3 / AES-256 validation, complete source code handover, dedicated post-launch support).

4. WHY EVERY BUSINESS CRITICALLY NEEDS A WEBSITE (AND WHY NEXORA IS THE PERFECT CHOICE):
   - Over 84% of modern consumers research a business online before making a purchasing decision. If a business lacks an ultra-fast, professional website, prospects assume it is unreliable or switch to competitors.
   - Social media platforms (Instagram, TikTok, LinkedIn) are 'rented land' where algorithms change unpredictably and ad costs escalate. A custom website is your sovereign digital property where you control 100% of the customer relationship, data, and revenue.
   - A Nexora website serves as your highest-performing salesperson that operates 24 hours a day, 7 days a week, pitching your services with perfection, answering questions, and capturing paying clients worldwide.

5. CONVERSATIONAL STRUCTURE FOR EVERY REPLY:
   - Open with infectious excitement and enthusiastic validation of the user's question or industry.
   - Provide a comprehensive, multi-point breakdown addressing their exact question with concrete metrics, architectural benefits, and real-world impact.
   - Ask an engaging discovery question about their current operations, target market, or biggest bottleneck.
   - Politely invite them to schedule a free 30-minute discovery session with our senior engineers right on this page!
`;

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

// Deeply detailed fallback perspectives with comprehensive breakdowns
const DETAILED_FALLBACK_ANGLES = [
  (msg: string) =>
    `I am SO excited to break this down for you! 🚀 When you look at high-growth companies today, their website is not just a digital business card—it is their primary revenue generation engine. Here is why partnering with Nexora transforms your entire business trajectory:

1. **Sub-Second Speed & Zero Template Bloat:**
Most web agencies install heavy WordPress or Wix templates loaded with 40+ plugins that take 4 to 6 seconds to load. Research shows that 40% of visitors abandon a site that takes longer than 3 seconds! At Nexora, we custom-engineer headless React and TypeScript architectures that load in under 0.8 seconds (Core Web Vitals greenline), ensuring you keep 100% of your incoming traffic.

2. **Conversion-Engineered Architecture (+310% Lift):**
Every visual hierarchy, value proposition, and call-to-action button is mathematically positioned to guide visitors toward booking a call or purchasing. On average, our clients experience a +310% increase in qualified inquiries within the first 60 days of launch.

3. **Autonomous 24/7 Sales with WhatsApp AI:**
We connect your web pages directly to the official Meta Cloud API WhatsApp infrastructure. The moment a visitor asks a question, an intelligent sales bot follows up in under 30 seconds, qualifies their requirements, and automatically books a meeting onto your calendar!

4. **Rapid 2 to 4-Week Launch with Fixed Milestones:**
No endless 6-month delays. We deliver full custom websites, e-commerce platforms, and automation pipelines in 2 to 4 weeks with weekly progress demos and direct communication with our senior engineering leads.

What kind of business or service are you currently running? I would love to walk you through the exact technical roadmap that would produce the highest ROI for your brand!`,

  (msg: string) =>
    `This is one of my absolute favorite topics to dive into! ⚡ Let me explain why every ambitious business in 2026 urgently requires a custom-engineered web presence, and why Nexora is uniquely equipped to build it for you:

• **The Reality of Buyer Psychology:** Over 84% of consumers and 92% of B2B corporate buyers research a company online before spending a single dollar. If your business relies solely on Instagram DMs, Facebook pages, or word of mouth, potential clients perceive your brand as informal or risky. A bespoke Nexora website establishes instant enterprise credibility and gives you the authority to charge premium prices.

• **Escaping the "Rented Land" Trap:** Relying exclusively on social media means you are building on rented land. Algorithms change overnight, organic reach collapses, and accounts can be banned without warning. A custom website is your sovereign digital asset where you own 100% of your audience, your client data, and your search engine ranking.

• **Your 24/7 Automated Revenue Engine:** While a physical office or manual salesperson is limited by business hours, a Nexora website works relentlessly around the clock. It educates visitors, demonstrates your proof of work, handles objections, processes payments, and books appointments while you sleep.

• **Our 11-Service Ecosystem:** Whether you need custom headless e-commerce, automated WhatsApp lead triage, SEO schema dominance, or private fine-tuned business AI models with zero public data leaks, Nexora handles the complete end-to-end stack under one roof.

Tell me a bit about your current customer acquisition process—are you losing potential clients because they can't easily book or buy online?`,

  (msg: string) =>
    `I love that you asked! Let's talk about what makes Nexora's engineering approach so radically different from traditional design agencies: 🎯

1. **The Technical Stack (Speed & Scalability):**
We build bespoke, lightning-fast web applications using React, TypeScript, Tailwind CSS, and edge CDN deployments. Every page is optimized for sub-100ms response latencies and flawless responsiveness across all mobile, tablet, and desktop devices.

2. **Official Meta Cloud API WhatsApp Superpowers:**
Nexora is a specialist in conversational commerce. We integrate official Meta Cloud API WhatsApp bots that connect directly to your website. Visitors can chat, receive automated quotes, track orders, or schedule discovery sessions in under 30 seconds with a 99.98% delivery rate and official green tick credibility.

3. **Enterprise Data Sovereignty & Mutual NDA:**
Your client databases, financial records, and proprietary operational workflows belong exclusively to you. Every engagement begins with a legally binding mutual NDA, TLS 1.3 encryption, AES-256 storage, and zero telemetry.

4. **Transparent, Fixed-Milestone Investments:**
We despise surprise hourly bills. Every Nexora project is scoped with clear, fixed milestone deliverables and an agreed-upon launch timeline of 2 to 4 weeks.

Would you be open to booking a free 30-minute discovery session with our engineering leads using the scheduling form below? We can conduct a live architectural teardown of your current setup!`,
];

let fallbackCounter = 0;

export async function sendChatMessage(messages: { role: 'user' | 'assistant'; content: string }[]): Promise<string> {
  const latestMessage = messages[messages.length - 1]?.content || '';

  // 1. Primary: Use Gemini 3.8 Flash with expanded token headroom for detailed, multi-paragraph answers
  try {
    const apiKey =
      (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
      (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) ||
      '';
    if (apiKey) {
      const ai = new GoogleGenAI({ apiKey });
      const conversationText = [
        DETAILED_NEXORA_SYSTEM_PROMPT,
        '\n--- CONVERSATION HISTORY ---\n',
        ...messages.map((m) => `${m.role === 'user' ? 'Visitor' : 'Nexora Systems Architect'}: ${m.content}`),
        '\nNexora Systems Architect (Provide a detailed, structured, enthusiastic, multi-paragraph response with bullet points and clear actionable guidance):',
      ].join('\n');

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: conversationText,
        config: {
          temperature: 0.8,
          maxOutputTokens: 950, // Expanded for comprehensive, structured, in-depth responses
        },
      });

      if (response.text && response.text.trim()) {
        return response.text.trim();
      }
    }
  } catch (geminiErr) {
    // Continue to Groq fallback
  }

  // 2. Secondary: Groq API with user's provided key
  try {
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen/qwen3.8-27b',
        messages: [
          { role: 'system', content: DETAILED_NEXORA_SYSTEM_PROMPT },
          ...messages,
        ],
        temperature: 0.8,
        max_tokens: 950,
      }),
    });

    if (groqResponse.ok) {
      const data = await groqResponse.json();
      const reply = data.choices?.[0]?.message?.content;
      if (reply && reply.trim()) return reply.trim();
    }
  } catch (groqErr) {
    // Continue to detailed fallback
  }

  // 3. Dynamic In-Depth Fallback Engine (Guaranteed comprehensive, structured, detailed responses)
  const lowerMsg = latestMessage.toLowerCase();
  fallbackCounter++;

  if (lowerMsg.includes('tell me') || lowerMsg.includes('about nexora') || lowerMsg.includes('what is nexora') || lowerMsg.includes('who are you') || lowerMsg.includes('what do you build') || lowerMsg.includes('what does nexora do')) {
    return `I am SO thrilled to give you the complete picture of Nexora! 🚀 Nexora is a boutique digital engineering studio designed from the ground up to turn ambitious companies into undisputed market leaders.

Here is a comprehensive breakdown of our identity, capabilities, and execution standard:

### 1. Who We Are & Our Engineering Philosophy
We build high-converting bespoke websites, custom headless e-commerce, official Meta Cloud API WhatsApp automation, and secure private enterprise AI models. Unlike traditional marketing agencies that rely on slow, clunky WordPress or Shopify themes, every single line of code at Nexora is custom-crafted in React and TypeScript for sub-second page loads (<0.8s) and maximum conversion rates (+310% average engagement lift).

### 2. Our 11 Core Capabilities
• **Advanced Web Page Designing:** Bespoke spatial interfaces, micro-interactions, and sub-100ms response times.
• **Custom E-Commerce Solutions:** Instant headless checkout, multi-currency routing, and 99.99% transaction uptime.
• **SEO Dominance Strategies:** Semantic schema graphs and Core Web Vitals optimization to capture ready-to-buy Google search traffic.
• **AI Automation & Workflows:** Multi-agent webhook pipelines that save companies over 1,400+ manual administrative hours per year.
• **Official Meta Cloud API WhatsApp:** Direct Meta enterprise infrastructure with official green tick verification and 99.98% delivery rates.
• **WhatsApp Lead Automation & CRM Sync:** Instant lead qualification and CRM ingestion in under 30 seconds.
• **Customized Business WhatsApp:** Shared team inboxes and intelligent routing that resolves client tickets 3.4x faster.
• **WhatsApp Conversational Chatbots:** 24/7 context-aware sales bots capable of resolving 72% of inquiries autonomously.
• **Custom Enterprise AI Models:** Domain-adapted intelligence trained strictly on your internal data without public leaks.
• **Fine-Tuned Domain LLMs:** Supervised fine-tuning with 99.4% factual domain accuracy for corporate and technical workflows.
• **Secure Local AI Deployment:** On-premise air-gapped GPU deployments ensuring 100% data sovereignty.

### 3. Our 4-Step Rocket Launch (2 to 4 Weeks)
1. **Discovery & Scope:** Day one architectural teardown, target customer mapping, and fixed milestone agreements.
2. **Custom Web Architecture:** Responsive, mobile-first design and sub-second performance tuning.
3. **AI & WhatsApp Sync:** Connecting official WhatsApp bots, CRM pipelines, and automated webhooks.
4. **Production Launch & Hardening:** End-to-end security penetration audits, TLS 1.3/AES-256 verification, and full code handover.

What kind of business or project are you looking to launch or scale right now? I would love to tailor our recommendations directly to your goals!`;
  }

  if (lowerMsg.includes('cost') || lowerMsg.includes('price') || lowerMsg.includes('pricing') || lowerMsg.includes('rate') || lowerMsg.includes('budget')) {
    return `I am so glad you asked about pricing, because our approach at Nexora is completely transparent and designed to protect your budget! 💰

### How Nexora Pricing Works:
Unlike traditional agencies that bill unpredictable open-ended hourly rates or push generic templates with surprise add-on fees, Nexora operates on a **Fixed-Scope, Milestone-Based Model**.

1. **Clear Deliverables on Day One:** Before we write a single line of code, we map out the exact scope of your web application, e-commerce store, or WhatsApp automation system. You receive a concrete deliverable agreement with zero hidden fees.
2. **Guaranteed 2 to 4-Week Turnaround:** Because our senior engineers work directly with you without bureaucratic account managers, we deliver production-ready systems in weeks, not months.
3. **High-ROI Investment:** Every element we engineer is built to generate measurable revenue—whether that is a +310% increase in inbound client conversions or 1,400+ hours saved annually through automated WhatsApp sales bots.
4. **Data Ownership & Zero Lock-in:** You own 100% of your source code, custom model weights, and design assets from day one.

Would you be open to booking a free 30-minute discovery session using the scheduling form below? We can review your exact project requirements and prepare a custom, fixed-milestone scope tailored specifically to your budget!`;
  }

  if (lowerMsg.includes('why') && (lowerMsg.includes('website') || lowerMsg.includes('need') || lowerMsg.includes('web page') || lowerMsg.includes('bussines'))) {
    return `This is the most critical question every business owner should ask, and the answer is backed by hard commercial data! 🚀

Here is why your business urgently needs a modern, high-converting website in 2026:

### 1. The 84% Consumer Research Rule
Over 84% of modern consumers research a business online before making a buying decision. If potential clients search for your company and find no website—or worse, a slow, outdated, template-cluttered page—they immediately perceive your business as informal, untrustworthy, or risky. A bespoke Nexora site commands instant authority and lets you charge premium prices.

### 2. Escaping the "Rented Land" of Social Media
Relying solely on Instagram, Facebook, TikTok, or LinkedIn is building your business on borrowed property. Algorithms shift overnight, accounts get suspended, and organic reach continues to drop. A custom web application engineered by Nexora is your sovereign digital flagship where **you own 100% of the customer relationship, data, and revenue**.

### 3. A 24/7 Automated Revenue & Lead Engine
Your physical store or phone lines can only handle customers during business hours. A custom Nexora website operates around the clock across all time zones—educating prospects, demonstrating social proof, handling objections, collecting payments, and scheduling calls while you sleep!

### 4. Sub-Second Speed vs. Bloated Competitors
Google penalizes slow websites. Over 40% of users leave a website if it takes more than 3 seconds to load. Nexora builds custom headless architectures that load in under 0.8 seconds, keeping your visitors engaged and converting at triple the industry standard.

What kind of business or service are you operating today? Tell me a little about your current client acquisition, and I will share the exact web blueprint we recommend!`;
  }

  if (lowerMsg.includes('whatsapp') || lowerMsg.includes('bot') || lowerMsg.includes('automate') || lowerMsg.includes('crm')) {
    return `WhatsApp automation is one of Nexora's absolute crown jewels! ⚡ Connecting your website to automated WhatsApp workflows completely transforms your customer response times and conversion rates.

Here is how our WhatsApp systems work in detail:

### 1. The Official Meta Cloud API Advantage
We connect directly to Meta's enterprise server infrastructure. This means:
• 99.98% delivery rate for all customer notifications and alerts.
• Assistance with official Meta Green Tick brand verification.
• Zero risk of number bans or third-party scraping proxy downtime.

### 2. Under-30-Second Lead Triage
Studies show that following up with an inbound lead within 5 minutes increases conversion rates by 9x! The moment a visitor submits their details on your Nexora website:
• An automated conversational bot initiates a personalized chat on WhatsApp in under 30 seconds.
• The bot qualifies their project scope, budget, and timeline through natural dialogue.
• The lead is instantly pushed into your CRM (HubSpot, Salesforce, Notion, or custom database).

### 3. Multi-Agent Shared Team Inboxes
For teams handling high support or sales volumes, we engineer customized WhatsApp inboxes where multiple team members can collaborate, assign tickets, tag customers, and view conversation histories simultaneously—resolving inquiries 3.4x faster.

### 4. 24/7 Conversational AI Chatbots
Our contextual bots handle up to 72% of recurring inquiries autonomously—handling FAQs, providing quotes, sending catalogs, and booking Google Meet/Zoom appointments directly into your calendar without requiring any manual effort.

How many leads or inquiries does your business receive each week? I'd love to show you how this automation can save your team dozens of hours every month!`;
  }

  // Dynamic in-depth fallback perspective
  const chosenAngle = DETAILED_FALLBACK_ANGLES[fallbackCounter % DETAILED_FALLBACK_ANGLES.length];
  return chosenAngle(latestMessage);
}
