export type RoleType = 'All' | 'Full-Stack' | 'Mobile' | 'Cloud';

export const portfolioData = {
  profile: {
    name: 'Muhammad Faizan',
    location: 'Islamabad, Pakistan',
    email: 'faizanwaseem070@gmail.com',
    headline: 'IT Support & App Developer',
    summary:
      'I build reliable systems, polished apps, and streamlined cloud operations for teams that need practical execution and strong product thinking.',
    resumeUrl: '#resume',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    availability: 'Available for selected work',
    statusNote: '10 months of freelance experience managing hosting environments, DNS, and Azure Entra configurations.',
  },
  stats: [
    { label: 'Freelance Experience', value: '10 months' },
    { label: 'Core Stack', value: 'Next.js · Flutter · Azure' },
    { label: 'Ops Exposure', value: 'Linux CLI · MySQL · cPanel' },
  ],
  skills: [
    'Next.js',
    'Web Development',
    'Flutter',
    'Dart',
    'Kotlin',
    'Python',
    'C++',
    'Azure',
    'Linux CLI',
    'MySQL',
    'cPanel',
  ],
  capabilityGroups: [
    { title: 'Web Development', points: ['Next.js', 'TypeScript', 'UX systems', 'Performance', 'Delivery'] },
    { title: 'Mobile', points: ['Flutter', 'Dart', 'Kotlin', 'App flows', 'UI polish'] },
    { title: 'Cloud & Infrastructure', points: ['Azure', 'Linux CLI', 'MySQL', 'DNS', 'cPanel'] },
  ],
  roles: ['All', 'Full-Stack', 'Mobile', 'Cloud'] as RoleType[],
  projects: [
    {
      id: 'therapy-app',
      title: 'Bilingual Mental Health Therapy App',
      category: 'Full-Stack',
      tags: ['Firebase Auth', 'Safe Room', 'Secure flows'],
      description:
        'A bilingual mental health platform with secure authentication, structured therapy journeys, and a virtual safe room for sensitive, user-first conversations.',
      impact: 'Built for privacy, trust, and accessible digital care experiences.',
      metrics: ['Firebase Auth', 'Secure architecture', 'Mental health UX'],
      accent: '#74c0fc',
    },
    {
      id: 'gomoon-flutter',
      title: 'Cross-Platform App Portfolio',
      category: 'Mobile',
      tags: ['Flutter', 'Taskly', 'Animdo', 'Gomoon'],
      description:
        'A design-forward cross-platform app ecosystem spanning personal portfolio, task management, and creative product experiences across mobile interfaces.',
      impact: 'Unified product storytelling with clean mobile-first patterns and reusable UI systems.',
      metrics: ['Flutter', 'Reusable widgets', 'Product polish'],
      accent: '#c084fc',
    },
    {
      id: 'woocommerce',
      title: 'Live WooCommerce Infrastructure Deployment',
      category: 'Cloud',
      tags: ['WooCommerce', 'DNS', 'Hosting', 'Linux'],
      description:
        'Production deployment and infrastructure support for live WooCommerce storefronts, covering uptime, hosting configuration, DNS, and operational reliability.',
      impact: 'Hardened deployment process with a strong focus on stability, resilience, and performance.',
      metrics: ['Hosting ops', 'DNS', 'Production uptime'],
      accent: '#fbbf24',
    },
  ],
  experience: [
    {
      title: 'Freelance IT Support & App Developer',
      period: '2024 — Present',
      summary:
        'Managed hosting environments, DNS, Azure Entra configurations, and app delivery workflows while building polished digital experiences for clients and internal systems.',
    },
    {
      title: 'Infrastructure & Support Specialist',
      period: '2023 — 2024',
      summary:
        'Handled cPanel, Plesk, Linux CLI, MySQL operations, and secure digital infrastructure tasks with a problem-solving-first operational mindset.',
    },
  ],
  architecture: [
    {
      id: 'frontend',
      name: 'Frontend',
      label: 'Next.js / UI layer',
      details: 'High-quality interfaces and product storytelling tuned for clarity, polish, and conversion.',
      tradeoff: 'Beautiful interfaces need disciplined performance tuning to remain fast and accessible.',
    },
    {
      id: 'api',
      name: 'Application logic',
      label: 'Secure business logic',
      details: 'Handles request flow, identity validation, and data process boundaries with clarity and control.',
      tradeoff: 'Centralizing logic increases reliability, but requires careful validation and monitoring.',
    },
    {
      id: 'cloud',
      name: 'Cloud infra',
      label: 'Azure / MySQL / Hosting',
      details: 'Delivers dependable system availability, identity control, DNS management, and operational visibility.',
      tradeoff: 'Cloud flexibility is powerful, but cost and access control need a disciplined approach.',
    },
    {
      id: 'pipeline',
      name: 'CI/CD',
      label: 'Deploy & iterate',
      details: 'Supported release readiness with realistic production workflows and continuous system observation.',
      tradeoff: 'Fast delivery cycles require clean rollback plans and quality checking.',
    },
  ],
  telemetry: {
    status: 'System status: stable and healthy',
    uptime: '99.98%',
    version: 'v2.9.4',
    commits: '18 new commits / 4h',
  },
  resume: {
    title: 'Muhammad Faizan — IT Support & App Developer',
    contact: 'Islamabad, Pakistan | faizanwaseem070@gmail.com',
    summary:
      'IT support and app developer with hands-on experience across hosting, DNS, Azure Entra, and app delivery. Focused on practical system reliability, secure workflows, and elegant product execution.',
    experience: [
      'Managed hosting environments, Azure configuration, and DNS administration for production-facing digital setups.',
      'Built app and web experiences with Flutter, Next.js, and secure data-aware architecture.',
      'Supported services ranging from cPanel operations to MySQL and Linux CLI administration.',
    ],
    skills: ['Next.js', 'Flutter', 'Dart', 'Kotlin', 'Python', 'C++', 'Azure', 'Linux CLI', 'MySQL', 'cPanel'],
  },
};
