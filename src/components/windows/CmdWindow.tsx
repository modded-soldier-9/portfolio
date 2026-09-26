'use client';

import React, { useState, useRef, useEffect } from 'react';
import { siteConfig } from '@/config/site';
import { projects } from '@/data/projects';
import { experiences } from '@/data/experience';
import { certificationGroups } from '@/data/certifications';
import { education } from '@/data/education';
import { aeroSound } from '../AeroSound';

interface CmdLine {
  id: number;
  type: 'input' | 'output';
  text: string;
}

export const CmdWindow: React.FC<{ onOpenWindow: (id: string) => void }> = ({ onOpenWindow }) => {
  const [input, setInput] = useState('');
  const [termColor, setTermColor] = useState<'silver' | 'green' | 'amber'>('silver');
  const [lines, setLines] = useState<CmdLine[]>([
    {
      id: 1,
      type: 'output',
      text: `Security & Engineering Command Processor [Version 6.1.7601 Service Pack 1]\nCopyright (c) ${siteConfig.name}. All rights reserved.\nType "help" to list available portfolio commands.`,
    },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const executeCommand = (rawCmd: string) => {
    const cmd = rawCmd.trim();
    const lower = cmd.toLowerCase();
    aeroSound.playClick();

    const nextLines: CmdLine[] = [
      ...lines,
      { id: Date.now(), type: 'input', text: `C:\\Users\\Mohamed.Elsheikh>${cmd}` },
    ];

    if (!lower) {
      setLines(nextLines);
      return;
    }

    if (lower === 'cls' || lower === 'clear') {
      setLines([]);
      return;
    }

    let response = '';
    switch (lower) {
      case 'help':
        response = [
          'Available Commands:',
          '  whoami       Display Mohamed Elsheikh profile & summary',
          '  projects     List all 6 featured projects & live URLs',
          '  experience   Display career leadership & work history',
          '  skills       Display Security, Cloud & Development stack',
          '  certs        List all 15 verified industry certifications',
          '  education    Display academic credentials & mentorship',
          '  contact      Show direct email, phone, WhatsApp & open mailer',
          '  systeminfo   Display system architecture specifications',
          '  dir          List directory contents of C:\\Users\\Mohamed.Elsheikh',
          '  calc         Launch Windows 7 Aero Calculator',
          '  mspaint      Launch Windows 7 MS Paint',
          '  notepad      Launch Windows 7 Notepad (Resume.txt)',
          '  minesweeper  Launch Windows 7 Minesweeper',
          '  solitaire    Launch Windows 7 Klondike Solitaire',
          '  hearts       Launch Windows 7 Hearts card game',
          '  color 0a     Switch terminal to matrix green (or color 07 for default)',
          '  cls          Clear the command prompt screen',
        ].join('\n');
        break;

      case 'calc':
      case 'calculator':
        response = 'Launching C:\\Windows\\System32\\calc.exe...';
        onOpenWindow('calculator');
        break;

      case 'mspaint':
      case 'paint':
        response = 'Launching C:\\Windows\\System32\\mspaint.exe...';
        onOpenWindow('paint');
        break;

      case 'notepad':
        response = 'Launching C:\\Windows\\System32\\notepad.exe...';
        onOpenWindow('notepad');
        break;

      case 'minesweeper':
      case 'winmine':
        response = 'Launching Windows 7 Minesweeper...';
        onOpenWindow('minesweeper');
        break;

      case 'solitaire':
      case 'sol':
        response = 'Launching Windows 7 Klondike Solitaire...';
        onOpenWindow('solitaire');
        break;

      case 'hearts':
      case 'mshearts':
        response = 'Launching Windows 7 Hearts...';
        onOpenWindow('hearts');
        break;

      case 'whoami':
        response = [
          `Name     : ${siteConfig.name}`,
          `Role     : ${siteConfig.role}`,
          `Location : ${siteConfig.location}`,
          `Bio      : ${siteConfig.tagline}`,
          `Stats    : 8+ yrs experience | 15+ certifications | BSc CS & IT`,
        ].join('\n');
        break;

      case 'projects':
        response = projects
          .map(
            (p, idx) =>
              `[${idx + 1}] ${p.name} (${p.type})\n    Tech : ${p.tech.join(', ')}\n    Desc : ${p.description}${
                p.liveUrl ? `\n    Live : ${p.liveUrl}` : ''
              }${p.githubUrl ? `\n    Repo : ${p.githubUrl}` : ''}`
          )
          .join('\n\n');
        break;

      case 'experience':
        response = experiences
          .map(
            (e) =>
              `* ${e.title} @ ${e.company} (${e.duration})\n  ${e.description}${
                e.achievements.length ? `\n  Achievements: ${e.achievements.join(' | ')}` : ''
              }`
          )
          .join('\n\n');
        break;

      case 'skills':
        response = [
          '[SECURITY]    Threat Detection, Vulnerability Assessment, Penetration Testing, Network Security, API Security, Security Auditing',
          '[CLOUD & OPS] AWS, Cloud Architecture, Linux, System Administration, Disaster Recovery',
          '[DEVELOPMENT] Python, JavaScript, TypeScript, Next.js, React, SQL, API Development, HTML/CSS',
        ].join('\n');
        break;

      case 'certs':
      case 'certifications':
        response = certificationGroups
          .map(
            (g) =>
              `=== ${g.title} ===\n` +
              g.certifications.map((c) => `  - ${c.name} (${c.issuer}, ${c.issued.split(' |')[0]})`).join('\n')
          )
          .join('\n\n');
        break;

      case 'education':
      case 'mentorship':
        response =
          education.map((ed) => `* ${ed.degree} — ${ed.institution} ${ed.duration ? `(${ed.duration})` : ''}`).join('\n') +
          '\n\n[MENTORSHIP]\n* Mentored student teams at AFRITECH — three groups secured top-3 finishes building cashless campus payment solutions.\n* Speaker on cybersecurity careers and technical problem-solving.';
        break;

      case 'contact':
        response = [
          `Email    : ${siteConfig.contact.email}`,
          `Phone/WA : ${siteConfig.contact.phoneDisplay}`,
          `GitHub   : ${siteConfig.github.url}`,
          `LinkedIn : ${siteConfig.linkedin}`,
          `-> Opening Contact Message window...`,
        ].join('\n');
        onOpenWindow('contact');
        break;

      case 'dir':
      case 'ls':
        response = [
          ' Volume in drive C is ELSHEIKH_PORTFOLIO',
          ' Volume Serial Number is 7Z1W-LTXO',
          '',
          ' Directory of C:\\Users\\Mohamed.Elsheikh',
          '',
          '07/16/2025  12:00 PM    <DIR>          Projects (6 items)',
          '07/16/2025  12:00 PM    <DIR>          Experience (4 roles)',
          '07/16/2025  12:00 PM    <DIR>          Certifications (15 badges)',
          '07/16/2025  12:00 PM    <DIR>          Skills_And_Education',
          '07/16/2025  12:00 PM             4,096 Resume_Mohamed_Elsheikh.txt',
          '07/16/2025  12:00 PM             2,048 Contact_Direct.lnk',
          '               2 File(s)          6,144 bytes',
          '               4 Dir(s)  99,999,999,999 bytes free',
        ].join('\n');
        break;

      case 'systeminfo':
      case 'ver':
        response = [
          'Host Name:                 MOHAMED-SEC-PC',
          `OS Owner:                  ${siteConfig.name} (${siteConfig.role})`,
          'System Version:            6.1.7601 Service Pack 1 Build 7601',
          'System Type:               x64-based Security & Full-Stack Environment',
          'Experience Index:          7.9 / 7.9',
          `Location:                  ${siteConfig.location}`,
          'Uptime Track Record:       99.9% (Midostransport Infrastructure)',
          'Incident Reduction:        40% (Quota Libex Cyber Security)',
        ].join('\n');
        break;

      case 'color 0a':
        setTermColor('green');
        response = 'Terminal color changed to Matrix Green (0A).';
        break;

      case 'color 0e':
        setTermColor('amber');
        response = 'Terminal color changed to Amber (0E).';
        break;

      case 'color 07':
        setTermColor('silver');
        response = 'Terminal color restored to Classic Silver (07).';
        break;

      default:
        response = `'${cmd}' is not recognized as an internal or external command.\nType "help" to see all available commands.`;
        break;
    }

    setLines([...nextLines, { id: Date.now() + 1, type: 'output', text: response }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(input);
    setInput('');
  };

  const textColorClass =
    termColor === 'green' ? 'text-[#22c55e]' : termColor === 'amber' ? 'text-[#fbbf24]' : 'text-[#e5e7eb]';

  return (
    <div
      className={`flex flex-col h-full bg-[#0c0c0c] ${textColorClass} font-mono text-[12.5px] select-text`}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Scrollable Terminal Output */}
      <div className="flex-1 overflow-y-auto w7-scroll p-3 space-y-2 leading-relaxed">
        {lines.map((line) => (
          <pre
            key={line.id}
            className={`whitespace-pre-wrap break-words font-mono ${
              line.type === 'input' ? 'font-bold brightness-110' : ''
            }`}
          >
            {line.text}
          </pre>
        ))}

        {/* Active Prompt Input Line */}
        <form onSubmit={handleSubmit} className="flex items-center gap-1 pt-1">
          <span className="shrink-0 font-bold">C:\Users\Mohamed.Elsheikh&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-label="Command Prompt Input"
            className={`flex-1 bg-transparent border-0 outline-none font-mono text-[12.5px] ${textColorClass}`}
            autoFocus
          />
        </form>
        <div ref={bottomRef} />
      </div>

      {/* Quick Command Bar for 1-Click Execution */}
      <div className="px-2.5 py-1.5 bg-[#18181b] border-t border-[#27272a] flex flex-wrap items-center gap-1.5 text-[11px] select-none">
        <span className="text-[#9ca3af] mr-1">Quick run:</span>
        {['help', 'whoami', 'projects', 'experience', 'skills', 'certs', 'systeminfo', 'color 0a', 'cls'].map((cmd) => (
          <button
            key={cmd}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              executeCommand(cmd);
            }}
            className="px-2 py-0.5 rounded bg-[#27272a] hover:bg-[#3f3f46] text-[#e4e4e7] border border-[#52525b] cursor-pointer transition-colors"
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
};
