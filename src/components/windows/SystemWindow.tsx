'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { siteConfig } from '@/config/site';
import { buildDefaultResumeText } from '@/state/os-store';
import { ComputerIcon, SecurityShieldIcon, ExplorerIcon, ContactMailIcon, CmdIcon, PersonalizeIcon, NotepadIcon } from '../AeroIcons';
import { aeroSound } from '../AeroSound';

export type ExplorerSection =
  | 'overview'
  | 'projects'
  | 'experience'
  | 'skills'
  | 'certifications'
  | 'mentorship'
  | 'documents'
  | 'pictures'
  | 'computer'
  | 'recycle';

interface SystemWindowProps {
  onOpenExplorerSection: (section: ExplorerSection) => void;
  onOpenWindow: (windowId: string) => void;
}

export const SystemWindow: React.FC<SystemWindowProps> = ({
  onOpenExplorerSection,
  onOpenWindow,
}) => {
  const [showWeiDetails, setShowWeiDetails] = useState(false);

  const handleDownloadResume = () => {
    aeroSound.playClick();
    const text = buildDefaultResumeText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Resume_${siteConfig.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-white select-none">
      {/* Top Explorer Chrome */}
      <div className="w7-explorer-nav">
        <div className="w7-nav-orb-group">
          <button
            type="button"
            className="w7-nav-orb"
            title="Back to Portfolio Explorer"
            onClick={() => {
              aeroSound.playClick();
              onOpenExplorerSection('overview');
            }}
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M11 8H3M6 4L2 8l4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" className="w7-nav-orb" disabled title="Forward">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M5 8h8M10 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Breadcrumb Bar */}
        <div className="w7-address-bar">
          <ComputerIcon size={15} className="mr-1 shrink-0" />
          <span className="text-[#666] text-[11px] mx-0.5">▸</span>
          <button
            type="button"
            className="w7-crumb-btn"
            onClick={() => {
              aeroSound.playClick();
              onOpenExplorerSection('overview');
            }}
          >
            Control Panel
          </button>
          <span className="text-[#666] text-[11px] mx-0.5">▸</span>
          <button
            type="button"
            className="w7-crumb-btn"
            onClick={() => {
              aeroSound.playClick();
              onOpenWindow('security');
            }}
          >
            System and Security
          </button>
          <span className="text-[#666] text-[11px] mx-0.5">▸</span>
          <span className="w7-crumb-btn font-semibold text-[#003399]">System</span>
        </div>

        {/* Search Box */}
        <div className="w7-search-wrap hidden sm:block">
          <input
            type="text"
            readOnly
            placeholder="Search Control Panel"
            onClick={() => onOpenExplorerSection('overview')}
            className="w7-search-input cursor-pointer"
          />
          <svg
            className="w-3.5 h-3.5 text-[#2070b9] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <circle cx="10" cy="6" r="4.2" />
            <path d="M2.5 13.5L6.8 9.2" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Main Two-Column System Layout */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left Control Panel Task Pane */}
        <aside className="w-[195px] shrink-0 hidden md:flex flex-col justify-between border-r border-[#d6e2f0] bg-gradient-to-b from-[#eef4fb] via-[#e3eefb] to-[#d3e4f8] p-3.5 text-[12px]">
          <div className="space-y-1.5">
            <div className="font-semibold text-[#1e395b] pb-1 mb-1 border-b border-[#bfd3eb]">
              Control Panel Home
            </div>
            <button
              type="button"
              onClick={() => {
                aeroSound.playClick();
                onOpenExplorerSection('overview');
              }}
              className="w-full text-left py-1 px-1.5 rounded hover:bg-white/60 text-[#0066cc] hover:underline flex items-center gap-2"
            >
              <ExplorerIcon size={16} />
              <span>Portfolio Overview</span>
            </button>
            <button
              type="button"
              onClick={() => {
                aeroSound.playClick();
                onOpenExplorerSection('experience');
              }}
              className="w-full text-left py-1 px-1.5 rounded hover:bg-white/60 text-[#0066cc] hover:underline flex items-center gap-2"
            >
              <span className="w-4 text-center text-[#1e395b]">▸</span>
              <span>Work Experience (4)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                aeroSound.playClick();
                onOpenExplorerSection('projects');
              }}
              className="w-full text-left py-1 px-1.5 rounded hover:bg-white/60 text-[#0066cc] hover:underline flex items-center gap-2"
            >
              <span className="w-4 text-center text-[#1e395b]">▸</span>
              <span>Featured Projects (6)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                aeroSound.playClick();
                onOpenExplorerSection('skills');
              }}
              className="w-full text-left py-1 px-1.5 rounded hover:bg-white/60 text-[#0066cc] hover:underline flex items-center gap-2"
            >
              <span className="w-4 text-center text-[#1e395b]">▸</span>
              <span>Skills &amp; Education</span>
            </button>
            <button
              type="button"
              onClick={() => {
                aeroSound.playClick();
                onOpenWindow('security');
              }}
              className="w-full text-left py-1 px-1.5 rounded hover:bg-white/60 text-[#0066cc] hover:underline flex items-center gap-2"
            >
              <SecurityShieldIcon size={16} />
              <span>Certifications (15+)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                aeroSound.playClick();
                onOpenWindow('notepad');
              }}
              className="w-full text-left py-1 px-1.5 rounded hover:bg-white/60 text-[#0066cc] hover:underline flex items-center gap-2"
            >
              <NotepadIcon size={16} />
              <span>Resume.txt (CV)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                aeroSound.playClick();
                onOpenWindow('contact');
              }}
              className="w-full text-left py-1 px-1.5 rounded hover:bg-white/60 text-[#0066cc] hover:underline flex items-center gap-2"
            >
              <ContactMailIcon size={16} />
              <span>Contact Mohamed</span>
            </button>
          </div>

          <div className="space-y-1.5 pt-3 border-t border-[#bfd3eb]">
            <div className="text-[#4c627d] text-[11px] font-semibold">See also</div>
            <button
              type="button"
              onClick={() => {
                aeroSound.playClick();
                onOpenWindow('cmd');
              }}
              className="w-full text-left py-0.5 px-1 rounded hover:bg-white/60 text-[#0066cc] hover:underline flex items-center gap-1.5"
            >
              <CmdIcon size={15} />
              <span>Command Prompt</span>
            </button>
            <button
              type="button"
              onClick={() => {
                aeroSound.playClick();
                onOpenWindow('personalize');
              }}
              className="w-full text-left py-0.5 px-1 rounded hover:bg-white/60 text-[#0066cc] hover:underline flex items-center gap-1.5"
            >
              <PersonalizeIcon size={15} />
              <span>Personalization</span>
            </button>
            <a
              href={siteConfig.github.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block py-0.5 px-1 rounded hover:bg-white/60 text-[#0066cc] hover:underline"
            >
              GitHub ({siteConfig.github.username}) ↗
            </a>
            <a
              href={siteConfig.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="block py-0.5 px-1 rounded hover:bg-white/60 text-[#0066cc] hover:underline"
            >
              LinkedIn Profile ↗
            </a>
          </div>
        </aside>

        {/* Right Main System Information Sheet */}
        <div className="flex-1 overflow-y-auto w7-scroll p-4 sm:p-6 selectable-text bg-white">
          <div className="max-w-3xl space-y-5">
            {/* Main Blue Control Panel Header */}
            <div className="flex items-center justify-between border-b border-[#d9e3f0] pb-2.5">
              <h1 className="text-[18px] sm:text-[20px] font-normal text-[#003399] tracking-tight" style={{ fontFamily: 'Calibri, "Segoe UI", sans-serif' }}>
                View basic information about {siteConfig.name}
              </h1>
              <span className="text-[11px] text-[#5a6b7c] hidden sm:inline">
                {siteConfig.location}
              </span>
            </div>

            {/* Executive Direct-Action Command Bar */}
            <div className="bg-gradient-to-r from-[#205493] via-[#1a4478] to-[#112e51] text-white p-3 rounded shadow-sm border border-[#163863] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-white text-[13px] shadow-inner shrink-0">
                  ME
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-white tracking-wide">
                    Executive Recruiter Quick Actions
                  </div>
                  <div className="text-[11px] text-[#cfe2ff]">
                    Available for Senior Cybersecurity &amp; Full-Stack Architecture roles
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadResume}
                  className="px-3 py-1.5 rounded bg-gradient-to-b from-[#ffffff] to-[#d8e6f6] hover:from-[#f0f6ff] hover:to-[#c8dbf0] text-[#003399] font-semibold text-[11.5px] border border-[#7ba0cd] shadow hover:shadow-md flex items-center gap-1.5 active:translate-y-0.5"
                >
                  <NotepadIcon size={14} />
                  <span>Download Resume (.txt)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    aeroSound.playClick();
                    window.open('https://wa.me/201021464357', '_blank');
                  }}
                  className="px-3 py-1.5 rounded bg-gradient-to-b from-[#22c55e] to-[#16a34a] hover:from-[#34d399] hover:to-[#15803d] text-white font-semibold text-[11.5px] border border-[#166534] shadow hover:shadow-md flex items-center gap-1.5 active:translate-y-0.5"
                >
                  <span>💬 WhatsApp Chat</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    aeroSound.playClick();
                    onOpenWindow('security');
                  }}
                  className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white font-medium text-[11.5px] border border-white/30 shadow-sm flex items-center gap-1.5"
                >
                  <SecurityShieldIcon size={14} />
                  <span>15+ Certifications</span>
                </button>
              </div>
            </div>

            {/* Section 1: Edition / Identity */}
            <div className="grid sm:grid-cols-[1fr_auto] gap-4 items-start bg-gradient-to-r from-[#f5f9fe] via-[#ffffff] to-[#f0f6fc] p-3.5 rounded border border-[#d6e4f5]">
              <div className="space-y-1.5">
                <div className="text-[11px] font-semibold text-[#003399] uppercase tracking-wider">
                  System Edition &amp; Executive Summary
                </div>
                <div className="flex items-center gap-2.5">
                  <SecurityShieldIcon size={30} className="shrink-0" />
                  <div>
                    <div className="text-[16px] font-semibold text-[#111]">
                      {siteConfig.name} — {siteConfig.role}
                    </div>
                    <div className="text-[12px] text-[#3b4a5a]">
                      Security-First Full-Stack Architecture &middot; Service Pack 1 (2025)
                    </div>
                  </div>
                </div>
                <p className="text-[12.5px] text-[#222] leading-relaxed pt-1">
                  {siteConfig.tagline}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      aeroSound.playClick();
                      onOpenExplorerSection('projects');
                    }}
                    className="w7-btn default font-medium"
                  >
                    Browse Projects (6)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      aeroSound.playClick();
                      onOpenExplorerSection('experience');
                    }}
                    className="w7-btn"
                  >
                    View Experience (4)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      aeroSound.playClick();
                      onOpenWindow('contact');
                    }}
                    className="w7-btn"
                  >
                    Get in Touch
                  </button>
                  <a
                    href={siteConfig.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w7-btn"
                  >
                    LinkedIn ↗
                  </a>
                </div>
              </div>

              {/* Glossy Aero User Portrait Frame */}
              <div className="flex flex-col items-center gap-1.5 mx-auto sm:mx-0">
                <div className="p-1.5 rounded-[5px] bg-gradient-to-br from-white via-[#d4e4f7] to-[#9abbe0] border border-[#5a7da0] shadow-[0_3px_10px_rgba(0,0,0,0.22),inset_0_0_0_1px_rgba(255,255,255,0.9)]">
                  <div className="w-24 h-28 rounded-[3px] overflow-hidden border border-[#3b5978] bg-[#eef3f8]">
                    <Image
                      src="/personal.jpg"
                      alt={siteConfig.name}
                      width={96}
                      height={112}
                      className="w-full h-full object-cover"
                      priority
                    />
                  </div>
                </div>
                <span className="text-[11px] text-[#4c627d] font-medium">
                  Administrator: {siteConfig.initials}
                </span>
              </div>
            </div>

            {/* Section 2: System Specifications */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[13.5px] text-[#003399] font-normal" style={{ fontFamily: 'Calibri, "Segoe UI", sans-serif' }}>
                  System &amp; Career Specifications
                </span>
                <div className="flex-1 h-[1px] bg-gradient-to-r from-[#c8d8ec] to-transparent" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[165px_1fr] gap-y-2 gap-x-4 pl-1 sm:pl-3 text-[12px]">
                <div className="text-[#555]">Rating:</div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      aeroSound.playClick();
                      setShowWeiDetails(!showWeiDetails);
                    }}
                    className="inline-flex items-center gap-2 px-2 py-0.5 rounded border border-[#7da2ce] bg-gradient-to-b from-[#f2f8ff] to-[#d2e6fc] text-[#003399] font-semibold shadow-sm hover:brightness-105 cursor-pointer"
                  >
                    <span className="px-1.5 py-0.2 bg-gradient-to-b from-[#3b82f6] to-[#1d4ed8] text-white rounded text-[12px] font-bold shadow-inner">
                      7.9
                    </span>
                    <span>Security &amp; Engineering Experience Index</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowWeiDetails(!showWeiDetails)}
                    className="text-[#0066cc] hover:underline text-[11.5px]"
                  >
                    {showWeiDetails ? 'Hide subscores ▲' : 'View subscores ▼'}
                  </button>
                </div>

                <div className="text-[#555]">Experience:</div>
                <div className="font-medium text-[#111]">
                  8+ Years &mdash; Vulnerability Research, Cyber Security Leadership &amp; Full-Stack Development
                </div>

                <div className="text-[#555]">Active Leadership:</div>
                <div className="text-[#111]">
                  Founder &amp; CEO @ <strong>Qodex</strong> &middot; Head of Cyber Security @ <strong>Quota Libex</strong> &middot; IT Manager @ <strong>Midostransport</strong>
                </div>

                <div className="text-[#555]">Certifications:</div>
                <div className="text-[#111]">
                  <strong>15+ Industry Credentials</strong> (AWS Cloud Architecting &amp; Foundations, Microsoft Cybersecurity Analyst, Google Cybersecurity Suite, freeCodeCamp)
                </div>

                <div className="text-[#555]">Academic Education:</div>
                <div className="text-[#111]">
                  <strong>BSc in Computer Science &amp; Information Technology</strong> &mdash; Richfield Graduate Institute of Technology (2023 &mdash; 2026)
                </div>

                <div className="text-[#555]">Core Architecture:</div>
                <div className="text-[#111]">
                  Penetration Testing, API &amp; Network Security, Python, TypeScript, Next.js, React, AWS Cloud, Linux
                </div>
              </div>

              {/* Expandable Experience Index Subscores Table */}
              {showWeiDetails && (
                <div className="mt-3 ml-0 sm:ml-3 p-3 rounded border border-[#b8cfe8] bg-[#f7fbff] space-y-2">
                  <div className="flex items-center justify-between text-[11.5px] font-semibold text-[#003399]">
                    <span>Component Subscores (Scale: 1.0 to 7.9)</span>
                    <button
                      type="button"
                      onClick={() => onOpenExplorerSection('skills')}
                      className="text-[#0066cc] hover:underline font-normal"
                    >
                      Open Full Skills Matrix &rarr;
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr_44px] gap-y-1.5 gap-x-3 items-center text-[11.5px]">
                    <span className="font-medium text-[#222]">Vulnerability &amp; Pen Testing</span>
                    <div className="w7-progressbar"><div className="w7-progressbar-fill" style={{ width: '99%' }} /></div>
                    <span className="font-bold text-right text-[#003399]">7.9</span>

                    <span className="font-medium text-[#222]">Full-Stack Web (Next.js/TS)</span>
                    <div className="w7-progressbar"><div className="w7-progressbar-fill" style={{ width: '98%' }} /></div>
                    <span className="font-bold text-right text-[#003399]">7.9</span>

                    <span className="font-medium text-[#222]">Cloud &amp; Infrastructure (AWS)</span>
                    <div className="w7-progressbar"><div className="w7-progressbar-fill" style={{ width: '96%' }} /></div>
                    <span className="font-bold text-right text-[#003399]">7.8</span>

                    <span className="font-medium text-[#222]">Security Team Leadership</span>
                    <div className="w7-progressbar"><div className="w7-progressbar-fill" style={{ width: '99%' }} /></div>
                    <span className="font-bold text-right text-[#003399]">7.9</span>
                  </div>
                </div>
              )}
            </div>

            {/* Section 3: Network, Location, and Direct Contact */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[13.5px] text-[#003399] font-normal" style={{ fontFamily: 'Calibri, "Segoe UI", sans-serif' }}>
                  Network, Location, and Contact Settings
                </span>
                <div className="flex-1 h-[1px] bg-gradient-to-r from-[#c8d8ec] to-transparent" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[165px_1fr] gap-y-1.5 gap-x-4 pl-1 sm:pl-3 text-[12px]">
                <div className="text-[#555]">Node / Hostname:</div>
                <div className="font-mono text-[11.5px] text-[#111]">MOHAMED-ELSHEIKH-ZA</div>

                <div className="text-[#555]">Location:</div>
                <div className="text-[#111]">{siteConfig.location}</div>

                <div className="text-[#555]">Direct Email:</div>
                <div>
                  <a href={`mailto:${siteConfig.contact.email}`} className="text-[#0066cc] hover:underline">
                    {siteConfig.contact.email}
                  </a>
                </div>

                <div className="text-[#555]">Phone / WhatsApp:</div>
                <div className="flex items-center gap-3">
                  <span>{siteConfig.contact.phoneDisplay}</span>
                  <button
                    type="button"
                    onClick={() => onOpenWindow('contact')}
                    className="text-[#0066cc] hover:underline text-[11.5px]"
                  >
                    Send message
                  </button>
                </div>

                <div className="text-[#555]">GitHub Repository:</div>
                <div>
                  <a href={siteConfig.github.url} target="_blank" rel="noopener noreferrer" className="text-[#0066cc] hover:underline">
                    {siteConfig.github.url} ↗
                  </a>
                </div>
              </div>
            </div>

            {/* Section 4: Verification & Genuine Seal */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[13.5px] text-[#003399] font-normal" style={{ fontFamily: 'Calibri, "Segoe UI", sans-serif' }}>
                  Verification &amp; Mentorship
                </span>
                <div className="flex-1 h-[1px] bg-gradient-to-r from-[#c8d8ec] to-transparent" />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pl-1 sm:pl-3 text-[12px]">
                <div className="space-y-1">
                  <div className="font-medium text-[#111]">
                    Verified Independent Security Researcher &amp; Technical Mentor
                  </div>
                  <div className="text-[#444] max-w-lg">
                    Mentored student teams at AFRITECH (three top-3 finishes building cashless campus payment solutions) and delivers talks on cybersecurity careers.
                  </div>
                  <div className="text-[#666] font-mono text-[11px]">
                    Credential ID: 7Z1WLTXOC8PF &middot; Status: Active &amp; Open to Opportunities
                  </div>
                </div>

                {/* Genuine Seal Badge */}
                <div className="flex items-center gap-2.5 px-3 py-2 rounded border border-[#9abbe0] bg-gradient-to-b from-[#f4f9ff] to-[#dcebfa] shrink-0 self-start">
                  <SecurityShieldIcon size={28} />
                  <div className="leading-tight">
                    <div className="text-[10px] uppercase tracking-wider text-[#205493] font-bold">
                      Verified Profile
                    </div>
                    <div className="text-[12px] font-semibold text-[#0b2e59]">
                      Genuine Security
                    </div>
                    <div className="text-[10px] text-[#4c6b8a]">
                      {siteConfig.url.replace('https://', '')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="h-[23px] px-3 bg-[#f0f0f0] border-t border-[#d0d0d0] flex items-center justify-between text-[11px] text-[#333] shrink-0">
        <span>{siteConfig.name} &middot; {siteConfig.role}</span>
        <span className="hidden sm:inline">8+ yrs experience &middot; 15+ certifications &middot; BSc CS &amp; IT</span>
      </div>
    </div>
  );
};
