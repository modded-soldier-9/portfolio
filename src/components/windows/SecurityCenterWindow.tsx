'use client';

import React, { useState } from 'react';
import { experiences } from '@/data/experience';
import { certificationGroups } from '@/data/certifications';
import { SecurityShieldIcon, CertificateIcon, BriefcaseIcon } from '../AeroIcons';
import { aeroSound } from '../AeroSound';
import type { ExplorerSection } from './SystemWindow';

interface SecurityCenterWindowProps {
  onOpenExplorerSection: (section: ExplorerSection) => void;
  onOpenWindow: (windowId: string) => void;
}

export const SecurityCenterWindow: React.FC<SecurityCenterWindowProps> = ({
  onOpenExplorerSection,
  onOpenWindow,
}) => {
  const [secOpen, setSecOpen] = useState(true);
  const [certOpen, setCertOpen] = useState(true);
  const [selectedGroupIdx, setSelectedGroupIdx] = useState<number>(0);

  return (
    <div className="flex flex-col h-full bg-white select-none">
      {/* Top Explorer Chrome */}
      <div className="w7-explorer-nav">
        <div className="w7-nav-orb-group">
          <button
            type="button"
            className="w7-nav-orb"
            title="Back to System Properties"
            onClick={() => {
              aeroSound.playClick();
              onOpenWindow('system');
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

        <div className="w7-address-bar">
          <SecurityShieldIcon size={15} className="mr-1 shrink-0" />
          <span className="text-[#666] text-[11px] mx-0.5">▸</span>
          <button type="button" className="w7-crumb-btn" onClick={() => onOpenWindow('system')}>
            Control Panel
          </button>
          <span className="text-[#666] text-[11px] mx-0.5">▸</span>
          <span className="w7-crumb-btn font-semibold text-[#003399]">
            Cyber Security &amp; Credentials Center
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto w7-scroll p-4 sm:p-5 selectable-text space-y-4">
        <div className="flex items-start justify-between gap-4 border-b border-[#dce6f2] pb-3">
          <div className="flex items-start gap-3">
            <SecurityShieldIcon size={38} className="shrink-0 mt-0.5" />
            <div>
              <h1 className="text-[18px] text-[#003399] font-normal" style={{ fontFamily: 'Calibri, "Segoe UI", sans-serif' }}>
                Review security leadership, audits, and verified credentials
              </h1>
              <p className="text-[12px] text-[#444]">
                All security protocols, responsible disclosure operations, and 15 industry certifications are active and verified.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenWindow('contact')}
            className="w7-btn default shrink-0"
          >
            Request Security Audit
          </button>
        </div>

        {/* Collapsible Banner 1: Security & Leadership Operations */}
        <div className="border border-[#b8cfe8] rounded bg-white overflow-hidden shadow-sm">
          <button
            type="button"
            onClick={() => {
              aeroSound.playClick();
              setSecOpen(!secOpen);
            }}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-gradient-to-b from-[#f3f8fe] to-[#dfecfa] border-b border-[#c5d9f0] text-left cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-6 rounded-sm bg-gradient-to-b from-[#22c55e] to-[#15803d]" />
              <div>
                <span className="text-[14px] font-semibold text-[#003399]">
                  Security Leadership &amp; Operations (4 Active Roles)
                </span>
                <span className="ml-2 text-[11px] text-[#15803d] font-semibold bg-[#dcfce7] px-2 py-0.5 rounded border border-[#86efac]">
                  STATUS: PROTECTED
                </span>
              </div>
            </div>
            <span className="text-[12px] text-[#003399]">{secOpen ? '▲' : '▼'}</span>
          </button>

          {secOpen && (
            <div className="p-3.5 divide-y divide-[#eef2f6]">
              {experiences.map((exp) => (
                <div key={exp.id} className="py-2.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <BriefcaseIcon size={18} />
                      <span className="font-semibold text-[12.5px] text-[#111]">{exp.title}</span>
                      <span className="text-[12px] text-[#555]">&middot; {exp.company}</span>
                      <span className="text-[11px] font-mono text-[#4c627d]">({exp.duration})</span>
                    </div>
                    <p className="text-[12px] text-[#333] pl-6">{exp.description}</p>
                    {exp.achievements.length > 0 && (
                      <div className="flex flex-wrap gap-2 pl-6 pt-0.5">
                        {exp.achievements.map((a) => (
                          <span key={a} className="text-[11px] text-[#15803d] font-medium">
                            ✓ {a}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="pl-6 sm:pl-0 shrink-0">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#f0fdf4] border border-[#86efac] text-[#166534] text-[11px] font-semibold">
                      ● Active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Collapsible Banner 2: Verified Certifications (15 Badges) */}
        <div className="border border-[#b8cfe8] rounded bg-white overflow-hidden shadow-sm">
          <button
            type="button"
            onClick={() => {
              aeroSound.playClick();
              setCertOpen(!certOpen);
            }}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-gradient-to-b from-[#f3f8fe] to-[#dfecfa] border-b border-[#c5d9f0] text-left cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-6 rounded-sm bg-gradient-to-b from-[#22c55e] to-[#15803d]" />
              <div>
                <span className="text-[14px] font-semibold text-[#003399]">
                  Verified Industry Certifications (15 Credentials)
                </span>
                <span className="ml-2 text-[11px] text-[#15803d] font-semibold bg-[#dcfce7] px-2 py-0.5 rounded border border-[#86efac]">
                  VERIFIED
                </span>
              </div>
            </div>
            <span className="text-[12px] text-[#003399]">{certOpen ? '▲' : '▼'}</span>
          </button>

          {certOpen && (
            <div className="p-3.5 space-y-3">
              {/* Group filter tabs */}
              <div className="flex flex-wrap gap-1.5 border-b border-[#dce6f2] pb-2.5">
                {certificationGroups.map((grp, idx) => (
                  <button
                    key={grp.title}
                    type="button"
                    onClick={() => {
                      aeroSound.playClick();
                      setSelectedGroupIdx(idx);
                    }}
                    className={`w7-btn ${selectedGroupIdx === idx ? 'default font-semibold' : ''}`}
                  >
                    {grp.title.replace(' Certifications', '')} ({grp.certifications.length})
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => onOpenExplorerSection('certifications')}
                  className="w7-btn ml-auto"
                >
                  View All in Explorer &rarr;
                </button>
              </div>

              {/* Selected Certification Group List */}
              <div className="space-y-1.5">
                {certificationGroups[selectedGroupIdx]?.certifications.map((cert, i) => (
                  <a
                    key={i}
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w7-item-box p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:no-underline"
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <CertificateIcon size={24} className="shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <div className="text-[12.5px] font-semibold text-[#0066cc] hover:underline truncate">
                          {cert.name}
                        </div>
                        <div className="text-[11px] text-[#555]">
                          Issued by <strong>{cert.issuer}</strong> &middot; {cert.issued}
                          {cert.skills ? ` · ${cert.skills}` : ''}
                        </div>
                      </div>
                    </div>
                    <span className="w7-btn !min-h-[21px] !px-2.5 !text-[11px] shrink-0 self-end sm:self-center">
                      Verify Credential ↗
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
