export interface SkillGroup {
  title: string;
  level: string;
  skills: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    title: 'Security & Vulnerability Research',
    level: '99%',
    skills: [
      'Threat Detection',
      'Vulnerability Assessment',
      'Penetration Testing',
      'Network Security',
      'API Security',
      'Security Auditing',
      'Responsible Disclosure',
    ],
  },
  {
    title: 'Cloud & Infrastructure Operations',
    level: '95%',
    skills: ['AWS', 'Cloud Architecture', 'Linux', 'System Administration', 'Disaster Recovery'],
  },
  {
    title: 'Full-Stack Web Development',
    level: '98%',
    skills: [
      'Python',
      'JavaScript',
      'TypeScript',
      'Next.js',
      'React',
      'SQL',
      'API Development',
      'HTML/CSS',
    ],
  },
];
