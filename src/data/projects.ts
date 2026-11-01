export interface Project {
  id: string;
  name: string;
  description: string;
  highlight: string;
  tech: string[];
  liveUrl?: string;
  githubUrl?: string;
  type: string;
  year: string;
  /** When false, hide from primary showcase surfaces (Start menu tiles, overview grid). */
  featured: boolean;
}

/**
 * Professional showcase only. License-bypass / activation-script repos
 * (e.g. IDM-Activation-Script) are intentionally excluded from this list.
 */
export const projects: Project[] = [
  {
    id: 'qodex',
    name: 'Qodex',
    description:
      'Web development agency site built with Next.js 15, TypeScript, and Tailwind CSS. Service showcases, client testimonials, and contact flows.',
    highlight: 'Agency site with conversion-focused service pages',
    tech: ['TypeScript', 'Next.js', 'Tailwind'],
    liveUrl: 'https://www.qodex.co.za',
    type: 'Client Work',
    year: '2025',
    featured: true,
  },
  {
    id: 'midostransport',
    name: 'Midostransport',
    description:
      'Full-stack transportation management platform for a heavy haulage company: fleet ops, logistics tracking, and a client portal.',
    highlight: 'Fleet and logistics platform for heavy haulage',
    tech: ['TypeScript', 'Next.js', 'Tailwind'],
    liveUrl: 'https://www.midostransport.co.za',
    type: 'Client Work',
    year: '2024',
    featured: true,
  },
  {
    id: 'p2p-media',
    name: 'P2P Media',
    description:
      'Portfolio and CRM for a photography business with client/staff portals and booking. Advising on hosting and backend architecture.',
    highlight: 'Photography CRM with booking and portals',
    tech: ['TypeScript', 'React', 'Convex'],
    liveUrl: 'https://p2pmedia.co.za',
    type: 'Consulting',
    year: '2024',
    featured: true,
  },
  {
    id: 'whatsapp-ai-bot',
    name: 'WhatsApp AI Bot',
    description:
      'Modular WhatsApp bot powered by Google Gemini. Customizable personalities, conversation memory, multi-language support, and token-aware prompting.',
    highlight: 'Gemini-powered WhatsApp assistant with memory',
    tech: ['JavaScript', 'Node.js'],
    githubUrl: 'https://github.com/modded-soldier-9/whats-bot',
    type: 'Open Source',
    year: '2024',
    featured: true,
  },
  {
    id: 'browser-fingerprint-honeypot',
    name: 'Browser Fingerprint Honeypot',
    description:
      'Browser fingerprinting research tool for cybersecurity education. Demonstrates reconnaissance techniques and privacy analysis.',
    highlight: 'Educational fingerprinting research tool',
    tech: ['TypeScript'],
    githubUrl: 'https://github.com/modded-soldier-9/honeypot',
    type: 'Security Research',
    year: '2024',
    featured: true,
  },
  {
    id: 'sa-digital-license',
    name: 'SA Digital License',
    description:
      "Mobile-first demo for South African drivers: digital driver's license display, traffic fine tracker, and 11 official languages.",
    highlight: 'Multilingual digital license concept demo',
    tech: ['TypeScript', 'React'],
    liveUrl: 'https://demo-digital-liscense.vercel.app',
    githubUrl: 'https://github.com/modded-soldier-9/demo-digital-liscense',
    type: 'Demo/Concept',
    year: '2023',
    featured: true,
  },
];

/** Primary showcase list (excludes deprioritized or non-professional repos). */
export const featuredProjects: Project[] = projects.filter((p) => p.featured);
