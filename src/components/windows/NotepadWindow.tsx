'use client';

import React, { useState } from 'react';
import { siteConfig } from '@/config/site';
import { experiences } from '@/data/experience';
import { projects } from '@/data/projects';
import { certificationGroups } from '@/data/certifications';
import { education } from '@/data/education';
import { aeroSound } from '../AeroSound';

export const NotepadWindow: React.FC = () => {
  const [wordWrap, setWordWrap] = useState(true);
  const [markMode, setMarkMode] = useState(false);
  const [markedLines, setMarkedLines] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);

  const resumeSections = [
    `========================================================================`,
    `${siteConfig.name.toUpperCase()} — ${siteConfig.role.toUpperCase()}`,
    `Location : ${siteConfig.location}`,
    `Email    : ${siteConfig.contact.email} | Phone/WA: ${siteConfig.contact.phoneDisplay}`,
    `GitHub   : ${siteConfig.github.url} | LinkedIn: ${siteConfig.linkedin}`,
    `========================================================================`,
    ``,
    `SUMMARY`,
    `${siteConfig.tagline}`,
    `Quick Stats: 8+ yrs experience | 15+ certifications | BSc CS & IT`,
    ``,
    `EXPERIENCE`,
    ...experiences.flatMap((exp) => [
      `• ${exp.title} — ${exp.company} (${exp.duration})`,
      `  ${exp.description}`,
      ...(exp.achievements.length ? [`  Achievements: ${exp.achievements.join(' · ')}`] : []),
      `  Skills: ${exp.skills.join(', ')}`,
      ``,
    ]),
    `PROJECTS`,
    ...projects.flatMap((proj) => [
      `• ${proj.name} [${proj.type}] — Tech: ${proj.tech.join(', ')}`,
      `  ${proj.description}`,
      ...(proj.liveUrl ? [`  Live: ${proj.liveUrl}`] : []),
      ...(proj.githubUrl ? [`  Source: ${proj.githubUrl}`] : []),
      ``,
    ]),
    `SKILLS`,
    `• Security    : Threat Detection, Vulnerability Assessment, Penetration Testing, Network Security, API Security, Security Auditing`,
    `• Cloud & Ops : AWS, Cloud Architecture, Linux, System Administration, Disaster Recovery`,
    `• Development : Python, JavaScript, TypeScript, Next.js, React, SQL, API Development, HTML/CSS`,
    ``,
    `EDUCATION`,
    ...education.map(
      (edu) => `• ${edu.degree} — ${edu.institution} ${edu.duration ? `(${edu.duration})` : ''}`
    ),
    ``,
    `MENTORSHIP`,
    `• Mentored student teams at AFRITECH — three groups secured top-3 finishes building cashless campus payment solutions.`,
    `• Delivers talks on cybersecurity careers and technical problem-solving.`,
    ``,
    `CERTIFICATIONS (15 VERIFIED CREDENTIALS)`,
    ...certificationGroups.flatMap((grp) => [
      `[${grp.title}]`,
      ...grp.certifications.map((c) => `  - ${c.name} (${c.issuer}, ${c.issued.split(' |')[0]})`),
    ]),
  ];

  const toggleLineMark = (idx: number) => {
    if (!markMode) return;
    aeroSound.playClick();
    setMarkedLines((prev) => (prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]));
  };

  const handleCopyAll = () => {
    aeroSound.playClick();
    navigator.clipboard?.writeText(resumeSections.join('\n')).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleDownloadTxt = () => {
    aeroSound.playClick();
    const blob = new Blob([resumeSections.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Resume_Mohamed_Elsheikh.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-white select-none">
      {/* Classic Aero Menubar */}
      <div className="flex items-center justify-between px-2 py-1 bg-gradient-to-b from-[#ffffff] via-[#f1f4fa] to-[#e4eaf5] border-b border-[#c8d2e0] text-[12px]">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleDownloadTxt}
            className="px-2 py-0.5 rounded hover:bg-[#3399ff] hover:text-white transition-colors"
            title="Download Resume as .txt"
          >
            <u>F</u>ile (Download .txt)
          </button>
          <button
            type="button"
            onClick={handleCopyAll}
            className="px-2 py-0.5 rounded hover:bg-[#3399ff] hover:text-white transition-colors"
          >
            {copied ? '✓ Copied All' : 'Edit (Copy CV)'}
          </button>
          <button
            type="button"
            onClick={() => {
              aeroSound.playClick();
              setWordWrap(!wordWrap);
            }}
            className="px-2 py-0.5 rounded hover:bg-[#3399ff] hover:text-white transition-colors"
          >
            F<u>o</u>rmat ({wordWrap ? '✓ Word Wrap' : 'Word Wrap'})
          </button>
        </div>

        {/* Interactive Resume Highlighter Toggle (Honoring original PenCanvas) */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              aeroSound.playClick();
              setMarkMode(!markMode);
            }}
            className={`w7-btn !min-h-[20px] !px-2.5 !text-[11px] ${markMode ? 'default font-semibold' : ''}`}
          >
            {markMode ? '🖍️ Highlighting: ON' : '🖍️ Highlight Lines'}
          </button>
          {markedLines.length > 0 && (
            <button
              type="button"
              onClick={() => setMarkedLines((prev) => prev.slice(0, -1))}
              className="w7-btn !min-h-[20px] !px-2 !text-[11px]"
            >
              Undo ({markedLines.length})
            </button>
          )}
        </div>
      </div>

      {/* Notepad Text Area */}
      <div
        className={`flex-1 overflow-auto w7-scroll p-3 font-mono text-[12px] leading-[1.6] text-[#111] selectable-text ${
          markMode ? 'cursor-crosshair' : ''
        }`}
      >
        {resumeSections.map((line, idx) => {
          const isMarked = markedLines.includes(idx);
          return (
            <div
              key={idx}
              onClick={() => toggleLineMark(idx)}
              className={`${wordWrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre'} px-1 rounded-sm ${
                isMarked
                  ? 'bg-[#fef08a] border-b border-[#eab308]'
                  : markMode && line.trim()
                  ? 'hover:bg-[#fef9c3]'
                  : ''
              }`}
            >
              {line || ' '}
            </div>
          );
        })}
      </div>

      {/* Notepad Status Bar */}
      <div className="h-[22px] px-3 bg-[#f0f0f0] border-t border-[#d0d0d0] flex items-center justify-between text-[11px] text-[#333] shrink-0">
        <span>
          {markMode
            ? 'Interactive Highlighter Active: Click any line to mark/unmark'
            : 'Resume_Mohamed_Elsheikh.txt — UTF-8'}
        </span>
        <span>Ln {resumeSections.length}, Col 1 &middot; 100%</span>
      </div>
    </div>
  );
};
