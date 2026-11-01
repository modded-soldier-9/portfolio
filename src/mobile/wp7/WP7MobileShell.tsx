'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { siteConfig } from '@/config/site';
import { experiences } from '@/data/experience';
import { featuredProjects } from '@/data/projects';
import { certificationGroups } from '@/data/certifications';
import { education } from '@/data/education';
import { skillGroups } from '@/data/skills';
import { buildDefaultResumeText, useOS } from '@/state/os-store';
import { aeroSound } from '@/components/AeroSound';
import { SecurityShieldIcon, ComputerIcon, NotepadIcon } from '@/components/AeroIcons';
import { WP7Tile } from './WP7Tile';
import { WP7DetailModal } from './WP7DetailModal';

export interface WP7MobileShellProps {
  onSwitchToDesktop: () => void;
  className?: string;
}

type ActiveHub = 'overview' | 'security' | 'projects' | 'experience' | 'skills' | 'games' | 'contact' | null;

export const WP7MobileShell: React.FC<WP7MobileShellProps> = ({
  onSwitchToDesktop,
  className = '',
}) => {
  const { openWindow } = useOS();
  const [activeHub, setActiveHub] = useState<ActiveHub>(null);

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

  const allCerts = certificationGroups.flatMap((g) => g.certifications);

  return (
    <div className={`min-h-screen bg-[#000000] text-white flex flex-col font-sans select-none overflow-x-hidden ${className}`}>
      {/* Mobile Top WP7 Status Bar */}
      <div className="h-6 px-4 flex items-center justify-between text-[11px] text-white/70 select-none">
        <div className="flex items-center gap-1.5 font-medium">
          {/* Signal bars */}
          <div className="flex items-end gap-0.5 h-3">
            <span className="w-0.5 h-1 bg-white" />
            <span className="w-0.5 h-1.5 bg-white" />
            <span className="w-0.5 h-2 bg-white" />
            <span className="w-0.5 h-2.5 bg-white" />
          </div>
          <span>Aero Mobile</span>
        </div>

        <div className="flex items-center gap-2 font-mono">
          <span>Wi-Fi</span>
          <span>100%</span>
        </div>
      </div>

      {/* WP7 Header */}
      <header className="px-5 pt-3 pb-4">
        <div className="text-[12px] uppercase tracking-widest text-[#0078d7] font-bold">
          {siteConfig.name}
        </div>
        <h1 className="text-[36px] font-light tracking-tight text-white leading-none mt-0.5">
          start
        </h1>
      </header>

      {/* 2-Column Live Tile Grid */}
      <main className="flex-1 px-4 pb-8 overflow-y-auto w7-scroll">
        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
          {/* 1. Profile / Overview Tile (Wide) */}
          <WP7Tile
            title={siteConfig.name}
            subtitle={siteConfig.role}
            size="wide"
            accentColor="#0078d7"
            onClick={() => setActiveHub('overview')}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-white/40 shrink-0 bg-white/10 relative">
                <Image
                  src="/personal.jpg"
                  alt={siteConfig.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="text-left text-[12px] text-white/90 leading-tight">
                <div className="font-semibold text-white">Executive Profile</div>
                <div className="text-[11px] text-white/75 truncate">{siteConfig.location}</div>
              </div>
            </div>
          </WP7Tile>

          {/* 2. Security Hub (Square) */}
          <WP7Tile
            title="Security"
            subtitle="15+ Certifications"
            size="square"
            accentColor="#107c10"
            badge="15+"
            icon={<SecurityShieldIcon size={24} />}
            onClick={() => setActiveHub('security')}
          />

          {/* 3. Projects Hub (Square) */}
          <WP7Tile
            title="Projects"
            subtitle={`${featuredProjects.length} Applications`}
            size="square"
            accentColor="#008272"
            badge={featuredProjects.length}
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
            onClick={() => setActiveHub('projects')}
          />

          {/* 4. Work Experience (Square) */}
          <WP7Tile
            title="Experience"
            subtitle="8+ Yrs Roles"
            size="square"
            accentColor="#b146c2"
            badge={experiences.length}
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
              </svg>
            }
            onClick={() => setActiveHub('experience')}
          />

          {/* 5. Skills & Tech (Square) */}
          <WP7Tile
            title="Skills & IT"
            subtitle="BSc CS & IT"
            size="square"
            accentColor="#d83b01"
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="4" y="4" width="16" height="16" rx="2" />
                <rect x="9" y="9" width="6" height="6" />
                <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
              </svg>
            }
            onClick={() => setActiveHub('skills')}
          />

          {/* 6. Games Hub (Wide) */}
          <WP7Tile
            title="Retro Games"
            subtitle="Space Cadet Pinball, Minesweeper, Solitaire"
            size="wide"
            accentColor="#68217a"
            badge="4 Games"
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="6" width="20" height="12" rx="2" />
                <path d="M6 12h4m-2-2v4m9-2h.01m3 0h.01" strokeLinecap="round" />
              </svg>
            }
            onClick={() => setActiveHub('games')}
          />

          {/* 7. Contact Tile (Wide) */}
          <WP7Tile
            title="Contact & Links"
            subtitle="WhatsApp, Email, GitHub, LinkedIn"
            size="wide"
            accentColor="#0099bc"
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            }
            onClick={() => setActiveHub('contact')}
          />
        </div>

        {/* Switch to Desktop Mode Footer Button */}
        <div className="mt-8 text-center max-w-md mx-auto">
          <button
            type="button"
            onClick={() => {
              aeroSound.playClick();
              onSwitchToDesktop();
            }}
            className="w-full py-3.5 px-4 rounded bg-gradient-to-r from-[#1e395b] via-[#244c7d] to-[#1e395b] hover:from-[#2a558c] hover:to-[#2a558c] border border-white/30 text-white font-medium text-[14px] shadow-lg flex items-center justify-center gap-2.5 active:scale-[0.98] transition-transform"
          >
            <ComputerIcon size={18} />
            <span>Switch to Windows 7 Desktop</span>
          </button>
          <p className="text-[11px] text-white/50 mt-2">
            View full Aero Glass multi-window desktop environment
          </p>
        </div>
      </main>

      {/* --- Detail Modals --- */}

      {/* Overview Modal */}
      <WP7DetailModal
        isOpen={activeHub === 'overview'}
        onClose={() => setActiveHub(null)}
        title="Overview"
        subtitle="Executive Summary & Bio"
        accentColor="#0078d7"
      >
        <div className="space-y-4 text-[14px] leading-relaxed">
          <div className="bg-white/10 p-4 rounded border border-white/20">
            <h2 className="text-[18px] font-semibold text-white mb-1">{siteConfig.name}</h2>
            <div className="text-[13px] text-[#60a5fa] font-medium mb-2">{siteConfig.role}</div>
            <p className="text-white/90 text-[13px]">{siteConfig.tagline}</p>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              type="button"
              onClick={handleDownloadResume}
              className="py-3 px-4 rounded bg-[#0078d7] hover:bg-[#106ebe] text-white font-semibold text-[14px] flex items-center justify-center gap-2 shadow"
            >
              <NotepadIcon size={16} />
              <span>Download Full Resume (.txt)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                aeroSound.playClick();
                window.open(
                  `https://wa.me/${siteConfig.contact.whatsappCountryCode}${siteConfig.contact.whatsapp}`,
                  '_blank'
                );
              }}
              className="py-3 px-4 rounded bg-[#22c55e] hover:bg-[#16a34a] text-white font-semibold text-[14px] flex items-center justify-center gap-2 shadow"
            >
              <span>💬 Message on WhatsApp</span>
            </button>
          </div>
        </div>
      </WP7DetailModal>

      {/* Security Modal */}
      <WP7DetailModal
        isOpen={activeHub === 'security'}
        onClose={() => setActiveHub(null)}
        title="Security Credentials"
        subtitle="15+ Verified Certifications"
        accentColor="#107c10"
      >
        <div className="space-y-3">
          {allCerts.map((cert, idx) => (
            <div key={`${cert.name}-${idx}`} className="bg-white/10 p-3.5 rounded border border-white/20">
              <div className="text-[14px] font-semibold text-white">{cert.name}</div>
              <div className="text-[12px] text-white/70">{cert.issuer} &middot; {cert.issued}</div>
              {cert.skills && (
                <div className="text-[11px] text-white/60 mt-1">{cert.skills}</div>
              )}
              {cert.link && (
                <a
                  href={cert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-[12px] text-[#60a5fa] font-medium underline"
                >
                  Verify Certificate ↗
                </a>
              )}
            </div>
          ))}
        </div>
      </WP7DetailModal>

      {/* Projects Modal */}
      <WP7DetailModal
        isOpen={activeHub === 'projects'}
        onClose={() => setActiveHub(null)}
        title="Featured Projects"
        subtitle="Full-Stack & Security Engineering"
        accentColor="#008272"
      >
        <div className="space-y-4">
          {featuredProjects.map((proj) => (
            <div key={proj.id} className="bg-white/10 p-4 rounded border border-white/20 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-[16px] font-semibold text-white">{proj.name}</h2>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[11px] px-2 py-0.5 rounded bg-white/20 uppercase tracking-wide font-medium">
                    {proj.type}
                  </span>
                  <span className="text-[11px] text-white/70 font-mono">{proj.year}</span>
                </div>
              </div>
              <p className="text-[13px] text-[#93c5fd] font-medium">{proj.highlight}</p>
              <p className="text-[13px] text-white/80 leading-relaxed">{proj.description}</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {proj.tech.map((t) => (
                  <span key={t} className="text-[11px] bg-black/40 px-2 py-0.5 rounded text-white/90">
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-3 pt-2">
                {proj.liveUrl && (
                  <a
                    href={proj.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[12px] text-[#60a5fa] font-medium underline"
                  >
                    Live Demo ↗
                  </a>
                )}
                {proj.githubUrl && (
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[12px] text-white/80 font-medium underline"
                  >
                    Source Code ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </WP7DetailModal>

      {/* Experience Modal */}
      <WP7DetailModal
        isOpen={activeHub === 'experience'}
        onClose={() => setActiveHub(null)}
        title="Work Experience"
        subtitle="8+ Years Engineering History"
        accentColor="#b146c2"
      >
        <div className="space-y-4">
          {experiences.map((exp) => (
            <div key={exp.id} className="bg-white/10 p-4 rounded border border-white/20 space-y-2">
              <div className="text-[15px] font-semibold text-white">{exp.title}</div>
              <div className="text-[12px] text-[#e879f9] font-medium">{exp.company} &middot; {exp.duration}</div>
              <p className="text-[13px] text-white/80 leading-relaxed">{exp.description}</p>
              {exp.achievements.length > 0 && (
                <ul className="list-disc list-inside text-[12px] text-white/70 space-y-1 pt-1">
                  {exp.achievements.map((ach) => (
                    <li key={ach}>{ach}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </WP7DetailModal>

      {/* Skills Modal */}
      <WP7DetailModal
        isOpen={activeHub === 'skills'}
        onClose={() => setActiveHub(null)}
        title="Skills & Education"
        subtitle="Computer Science & Information Technology"
        accentColor="#d83b01"
      >
        <div className="space-y-4 text-[13px]">
          <div className="bg-white/10 p-4 rounded border border-white/20 space-y-2">
            <h2 className="text-[15px] font-semibold text-white mb-1">Education</h2>
            {education.map((edu, idx) => (
              <div key={idx} className="border-b border-white/10 pb-2 last:border-b-0 last:pb-0">
                <div className="font-medium text-white/90">{edu.degree}</div>
                <div className="text-white/70 text-[12px]">{edu.institution} {edu.duration ? `· ${edu.duration}` : ''}</div>
              </div>
            ))}
          </div>

          <div className="bg-white/10 p-4 rounded border border-white/20 space-y-3">
            <h2 className="text-[15px] font-semibold text-white">Technical Proficiencies</h2>
            {skillGroups.map((group) => (
              <div key={group.title}>
                <div className="font-medium text-[#fb923c] mb-1 flex items-center justify-between gap-2">
                  <span>{group.title}</span>
                  <span className="text-[11px] text-white/60 font-mono">{group.level}</span>
                </div>
                <p className="text-white/80 text-[12px]">{group.skills.join(', ')}</p>
              </div>
            ))}
          </div>
        </div>
      </WP7DetailModal>

      {/* Games Hub Modal */}
      <WP7DetailModal
        isOpen={activeHub === 'games'}
        onClose={() => setActiveHub(null)}
        title="Retro Games"
        subtitle="Windows 7 Nostalgia Suite"
        accentColor="#68217a"
      >
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => {
              aeroSound.playClick();
              onSwitchToDesktop();
              openWindow('space-cadet');
            }}
            className="w-full text-left p-4 rounded bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-between"
          >
            <div>
              <div className="text-[15px] font-semibold text-white">3D Space Cadet Pinball</div>
              <div className="text-[12px] text-white/70">Classic arcade table flippers &amp; bumpers</div>
            </div>
            <span className="text-[13px] text-[#c084fc] font-semibold">Play ↗</span>
          </button>

          <button
            type="button"
            onClick={() => {
              aeroSound.playClick();
              onSwitchToDesktop();
              openWindow('minesweeper');
            }}
            className="w-full text-left p-4 rounded bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-between"
          >
            <div>
              <div className="text-[15px] font-semibold text-white">Minesweeper</div>
              <div className="text-[12px] text-white/70">Grid logic puzzle with custom difficulty</div>
            </div>
            <span className="text-[13px] text-[#60a5fa] font-semibold">Play ↗</span>
          </button>

          <button
            type="button"
            onClick={() => {
              aeroSound.playClick();
              onSwitchToDesktop();
              openWindow('solitaire');
            }}
            className="w-full text-left p-4 rounded bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-between"
          >
            <div>
              <div className="text-[15px] font-semibold text-white">Solitaire (Klondike)</div>
              <div className="text-[12px] text-white/70">Card draw &amp; tableau cascades</div>
            </div>
            <span className="text-[13px] text-[#4ade80] font-semibold">Play ↗</span>
          </button>
        </div>
      </WP7DetailModal>

      {/* Contact Modal */}
      <WP7DetailModal
        isOpen={activeHub === 'contact'}
        onClose={() => setActiveHub(null)}
        title="Contact"
        subtitle="Get in Touch"
        accentColor="#0099bc"
      >
        <div className="space-y-3">
          <a
            href={`https://wa.me/${siteConfig.contact.whatsappCountryCode}${siteConfig.contact.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 rounded bg-[#22c55e]/20 hover:bg-[#22c55e]/30 border border-[#22c55e]/40 text-white"
          >
            <div className="text-[15px] font-semibold text-[#4ade80]">WhatsApp Direct</div>
            <div className="text-[12px] text-white/80">{siteConfig.contact.phoneDisplay}</div>
          </a>

          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="block p-4 rounded bg-white/10 hover:bg-white/20 border border-white/20 text-white"
          >
            <div className="text-[15px] font-semibold text-white">Email</div>
            <div className="text-[12px] text-white/80">{siteConfig.contact.email}</div>
          </a>

          <a
            href={siteConfig.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 rounded bg-white/10 hover:bg-white/20 border border-white/20 text-white"
          >
            <div className="text-[15px] font-semibold text-[#60a5fa]">LinkedIn Profile ↗</div>
            <div className="text-[12px] text-white/80">Connect professionally</div>
          </a>

          <a
            href={siteConfig.github.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 rounded bg-white/10 hover:bg-white/20 border border-white/20 text-white"
          >
            <div className="text-[15px] font-semibold text-white">GitHub ({siteConfig.github.username}) ↗</div>
            <div className="text-[12px] text-white/80">Browse repositories &amp; open-source code</div>
          </a>
        </div>
      </WP7DetailModal>
    </div>
  );
};
