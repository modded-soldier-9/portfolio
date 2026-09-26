'use client';

import React, { useState, useMemo } from 'react';
import { siteConfig } from '@/config/site';
import { projects, type Project } from '@/data/projects';
import { experiences, type Experience } from '@/data/experience';
import { certificationGroups } from '@/data/certifications';
import { education } from '@/data/education';
import {
  ExplorerIcon,
  FolderIcon,
  ProjectAppIcon,
  BriefcaseIcon,
  CertificateIcon,
  SecurityShieldIcon,
  ComputerIcon,
  ContactMailIcon,
  NotepadIcon,
  CmdIcon,
} from '../AeroIcons';
import { aeroSound } from '../AeroSound';
import type { ExplorerSection } from './SystemWindow';

const skillGroups = [
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
    skills: ['Python', 'JavaScript', 'TypeScript', 'Next.js', 'React', 'SQL', 'API Development', 'HTML/CSS'],
  },
];

interface ExplorerWindowProps {
  activeSection: ExplorerSection;
  onSectionChange: (section: ExplorerSection) => void;
  onOpenWindow: (windowId: string) => void;
}

type ViewMode = 'content' | 'tiles' | 'details';

export const ExplorerWindow: React.FC<ExplorerWindowProps> = ({
  activeSection,
  onSectionChange,
  onOpenWindow,
}) => {
  const [history, setHistory] = useState<ExplorerSection[]>([activeSection]);
  const [historyIdx, setHistoryIdx] = useState<number>(0);
  const [viewMode, setViewMode] = useState<ViewMode>('content');
  const [showNavPane, setShowNavPane] = useState(true);
  const [showPreviewPane, setShowPreviewPane] = useState(true);
  const [showOrganizeMenu, setShowOrganizeMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(projects[0]);
  const [selectedExp, setSelectedExp] = useState<Experience | null>(experiences[0]);
  const [selectedCert, setSelectedCert] = useState<{
    name: string;
    issuer: string;
    issued: string;
    skills: string;
    link: string;
    group: string;
  }>({
    ...certificationGroups[0].certifications[0],
    group: certificationGroups[0].title,
  });
  const [overviewFocus, setOverviewFocus] = useState<'project' | 'experience'>('project');
  const [sortCol, setSortCol] = useState<'name' | 'type' | 'tech'>('name');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const totalCertCount = useMemo(
    () => certificationGroups.reduce((acc, g) => acc + g.certifications.length, 0),
    []
  );

  // Sync external activeSection changes into history
  React.useEffect(() => {
    if (history[historyIdx] !== activeSection) {
      const nextHist = [...history.slice(0, historyIdx + 1), activeSection];
      setHistory(nextHist);
      setHistoryIdx(nextHist.length - 1);
    }
  }, [activeSection, history, historyIdx]);

  const navigateTo = (sec: ExplorerSection) => {
    aeroSound.playClick();
    setSearchQuery('');
    onSectionChange(sec);
  };

  const goBack = () => {
    if (historyIdx > 0) {
      aeroSound.playClick();
      const nextIdx = historyIdx - 1;
      setHistoryIdx(nextIdx);
      onSectionChange(history[nextIdx]);
    }
  };

  const goForward = () => {
    if (historyIdx < history.length - 1) {
      aeroSound.playClick();
      const nextIdx = historyIdx + 1;
      setHistoryIdx(nextIdx);
      onSectionChange(history[nextIdx]);
    }
  };

  const sectionLabels: Record<ExplorerSection, string> = {
    overview: 'Portfolio Library',
    projects: 'Projects (6)',
    experience: 'Work Experience (4)',
    skills: 'Skills & Education',
    certifications: `Certifications (${totalCertCount})`,
    mentorship: 'Mentorship & Community',
  };

  const sortedProjects = useMemo(() => {
    const copy = [...projects];
    copy.sort((a, b) => {
      const valA = sortCol === 'tech' ? a.tech.join(', ') : a[sortCol];
      const valB = sortCol === 'tech' ? b.tech.join(', ') : b[sortCol];
      return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
    return copy;
  }, [sortCol, sortAsc]);

  const handleSort = (col: 'name' | 'type' | 'tech') => {
    aeroSound.playClick();
    if (sortCol === col) {
      setSortAsc(!sortAsc);
    } else {
      setSortCol(col);
      setSortAsc(true);
    }
  };

  // Search filtering across all portfolio datasets
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return null;
    const matchedProjects = projects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q) ||
        p.tech.some((t) => t.toLowerCase().includes(q))
    );
    const matchedExp = experiences.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.company.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.skills.some((s) => s.toLowerCase().includes(q)) ||
        e.achievements.some((a) => a.toLowerCase().includes(q))
    );
    const matchedCerts = certificationGroups.flatMap((g) =>
      g.certifications
        .filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.issuer.toLowerCase().includes(q) ||
            g.title.toLowerCase().includes(q)
        )
        .map((c) => ({ ...c, group: g.title }))
    );
    return { matchedProjects, matchedExp, matchedCerts };
  }, [searchQuery]);


  return (
    <div className="flex flex-col h-full bg-white select-none" onClick={() => setShowOrganizeMenu(false)}>
      {/* 1. Top Explorer Navigation Bar (Back/Forward Orbs + Breadcrumb + Search) */}
      <div className="w7-explorer-nav">
        <div className="w7-nav-orb-group">
          <button
            type="button"
            className="w7-nav-orb"
            disabled={historyIdx <= 0}
            onClick={goBack}
            title="Back"
            aria-label="Back"
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M11 8H3M6 4L2 8l4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            className="w7-nav-orb"
            disabled={historyIdx >= history.length - 1}
            onClick={goForward}
            title="Forward"
            aria-label="Forward"
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M5 8h8M10 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Breadcrumb Address Bar */}
        <div className="w7-address-bar">
          <ExplorerIcon size={15} className="mr-1 shrink-0" />
          <span className="text-[#666] text-[11px] mx-0.5">▸</span>
          <button
            type="button"
            className="w7-crumb-btn"
            onClick={() => navigateTo('overview')}
          >
            Libraries
          </button>
          <span className="text-[#666] text-[11px] mx-0.5">▸</span>
          <button
            type="button"
            className="w7-crumb-btn"
            onClick={() => navigateTo('overview')}
          >
            {siteConfig.name}
          </button>
          <span className="text-[#666] text-[11px] mx-0.5">▸</span>
          <span className="w7-crumb-btn font-semibold text-[#003399]">
            {searchQuery ? `Search Results: "${searchQuery}"` : sectionLabels[activeSection]}
          </span>
        </div>

        {/* Instant Search Input */}
        <div className="w7-search-wrap w-[150px] sm:w-[205px]">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${sectionLabels[activeSection]}...`}
            aria-label="Search Portfolio"
            className="w7-search-input"
          />
          {!searchQuery && (
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
          )}
        </div>
      </div>

      {/* 2. Explorer Command Bar */}
      <div className="w7-command-bar relative">
        <div className="flex items-center gap-1 flex-wrap">
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => {
                aeroSound.playClick();
                setShowOrganizeMenu(!showOrganizeMenu);
              }}
              className={`w7-cmd-btn ${showOrganizeMenu ? 'active' : ''}`}
            >
              <span>Organize</span>
              <span className="text-[9px]">▼</span>
            </button>
            {showOrganizeMenu && (
              <div className="w7-context-menu !fixed sm:!absolute !top-7 !left-0 z-50">
                <button
                  type="button"
                  className="w7-menu-item"
                  onClick={() => {
                    setShowNavPane(!showNavPane);
                    setShowOrganizeMenu(false);
                  }}
                >
                  <span>{showNavPane ? '✓ ' : ''}Navigation pane</span>
                </button>
                <button
                  type="button"
                  className="w7-menu-item"
                  onClick={() => {
                    setShowPreviewPane(!showPreviewPane);
                    setShowOrganizeMenu(false);
                  }}
                >
                  <span>{showPreviewPane ? '✓ ' : ''}Preview pane</span>
                </button>
                <div className="w7-menu-sep" />
                <button
                  type="button"
                  className="w7-menu-item"
                  onClick={() => {
                    onOpenWindow('system');
                    setShowOrganizeMenu(false);
                  }}
                >
                  <span>System Properties</span>
                </button>
              </div>
            )}
          </div>

          <span className="h-4 w-[1px] bg-[#b8c9de] mx-0.5 hidden sm:inline-block" />

          <button
            type="button"
            onClick={() => navigateTo('overview')}
            className={`w7-cmd-btn ${activeSection === 'overview' && !searchQuery ? 'active font-semibold' : ''}`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => navigateTo('projects')}
            className={`w7-cmd-btn ${activeSection === 'projects' && !searchQuery ? 'active font-semibold' : ''}`}
          >
            Projects (6)
          </button>
          <button
            type="button"
            onClick={() => navigateTo('experience')}
            className={`w7-cmd-btn ${activeSection === 'experience' && !searchQuery ? 'active font-semibold' : ''}`}
          >
            Experience (4)
          </button>
          <button
            type="button"
            onClick={() => navigateTo('skills')}
            className={`w7-cmd-btn ${activeSection === 'skills' && !searchQuery ? 'active font-semibold' : ''}`}
          >
            Skills &amp; Edu
          </button>
          <button
            type="button"
            onClick={() => navigateTo('certifications')}
            className={`w7-cmd-btn ${activeSection === 'certifications' && !searchQuery ? 'active font-semibold' : ''}`}
          >
            Certifications ({totalCertCount})
          </button>

          <span className="h-4 w-[1px] bg-[#b8c9de] mx-0.5 hidden md:inline-block" />

          <button
            type="button"
            onClick={() => {
              aeroSound.playClick();
              onOpenWindow('contact');
            }}
            className="w7-cmd-btn hidden md:inline-flex"
          >
            <ContactMailIcon size={14} />
            <span>New Message</span>
          </button>
        </div>

        {/* Right Command Bar Controls (View Mode + Preview Pane Toggle) */}
        <div className="flex items-center gap-1 ml-auto">
          <button
            type="button"
            title="Change your view (Content / Tiles / Details)"
            onClick={() => {
              aeroSound.playClick();
              const order: ViewMode[] = ['content', 'tiles', 'details'];
              const next = order[(order.indexOf(viewMode) + 1) % order.length];
              setViewMode(next);
            }}
            className="w7-cmd-btn text-[11px]"
          >
            <span>View: {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}</span>
            <span className="text-[9px]">▼</span>
          </button>

          <button
            type="button"
            title={showPreviewPane ? 'Hide the preview pane' : 'Show the preview pane'}
            onClick={() => {
              aeroSound.playClick();
              setShowPreviewPane(!showPreviewPane);
            }}
            className={`w7-cmd-btn hidden lg:inline-flex px-2 ${showPreviewPane ? 'active' : ''}`}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#1e395b" strokeWidth="1.4">
              <rect x="1.5" y="2.5" width="13" height="11" rx="1" />
              <line x1="10" y1="2.5" x2="10" y2="13.5" />
              <rect x="10.5" y="3" width="3.5" height="10" fill="#7da2ce" stroke="none" />
            </svg>
          </button>
        </div>
      </div>

      {/* 3. Main Explorer Split Body (Navigation Tree | Folder Content | Preview Pane) */}
      <div className="flex flex-1 min-h-0 overflow-hidden bg-white">
        {/* Left Navigation Tree Pane */}
        {showNavPane && (
          <aside className="w-[195px] shrink-0 hidden sm:flex flex-col border-r border-[#d6dfe9] bg-[#fcfdff] overflow-y-auto w7-scroll p-2 text-[12px]">
            {/* Favorites Group */}
            <div className="mb-3">
              <div className="flex items-center gap-1.5 px-1.5 py-1 text-[11px] font-semibold text-[#1e395b] uppercase tracking-wider">
                <span>★</span>
                <span>Favorites</span>
              </div>
              <div className="space-y-0.5 pl-2">
                <button
                  type="button"
                  onClick={() => navigateTo('overview')}
                  className={`w-full flex items-center gap-2 px-2 py-1 text-left w7-item-box ${
                    activeSection === 'overview' && !searchQuery ? 'selected font-medium' : ''
                  }`}
                >
                  <ExplorerIcon size={16} />
                  <span className="truncate">Full Portfolio</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('projects')}
                  className={`w-full flex items-center gap-2 px-2 py-1 text-left w7-item-box ${
                    activeSection === 'projects' && !searchQuery ? 'selected font-medium' : ''
                  }`}
                >
                  <ProjectAppIcon size={16} />
                  <span className="truncate">Featured Projects</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    aeroSound.playClick();
                    onOpenWindow('contact');
                  }}
                  className="w-full flex items-center gap-2 px-2 py-1 text-left w7-item-box"
                >
                  <ContactMailIcon size={16} />
                  <span className="truncate">Contact &amp; Hire</span>
                </button>
              </div>
            </div>

            {/* Libraries Group */}
            <div className="mb-3">
              <div className="flex items-center gap-1.5 px-1.5 py-1 text-[11px] font-semibold text-[#1e395b] uppercase tracking-wider">
                <span>▾</span>
                <span>Libraries</span>
              </div>
              <div className="space-y-0.5 pl-2">
                <button
                  type="button"
                  onClick={() => navigateTo('experience')}
                  className={`w-full flex items-center gap-2 px-2 py-1 text-left w7-item-box ${
                    activeSection === 'experience' && !searchQuery ? 'selected font-medium' : ''
                  }`}
                >
                  <BriefcaseIcon size={16} />
                  <span className="truncate">Experience (4)</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('projects')}
                  className={`w-full flex items-center gap-2 px-2 py-1 text-left w7-item-box ${
                    activeSection === 'projects' && !searchQuery ? 'selected font-medium' : ''
                  }`}
                >
                  <FolderIcon size={16} badgeColor="#2563eb" />
                  <span className="truncate">Projects (6)</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('skills')}
                  className={`w-full flex items-center gap-2 px-2 py-1 text-left w7-item-box ${
                    activeSection === 'skills' && !searchQuery ? 'selected font-medium' : ''
                  }`}
                >
                  <FolderIcon size={16} badgeColor="#16a34a" />
                  <span className="truncate">Skills &amp; Education</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('certifications')}
                  className={`w-full flex items-center gap-2 px-2 py-1 text-left w7-item-box ${
                    activeSection === 'certifications' && !searchQuery ? 'selected font-medium' : ''
                  }`}
                >
                  <CertificateIcon size={16} />
                  <span className="truncate">Certifications ({totalCertCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('mentorship')}
                  className={`w-full flex items-center gap-2 px-2 py-1 text-left w7-item-box ${
                    activeSection === 'mentorship' && !searchQuery ? 'selected font-medium' : ''
                  }`}
                >
                  <SecurityShieldIcon size={16} />
                  <span className="truncate">Mentorship</span>
                </button>
              </div>
            </div>

            {/* Computer / System Shortcuts */}
            <div>
              <div className="flex items-center gap-1.5 px-1.5 py-1 text-[11px] font-semibold text-[#1e395b] uppercase tracking-wider">
                <span>▾</span>
                <span>Computer</span>
              </div>
              <div className="space-y-0.5 pl-2">
                <button
                  type="button"
                  onClick={() => {
                    aeroSound.playClick();
                    onOpenWindow('system');
                  }}
                  className="w-full flex items-center gap-2 px-2 py-1 text-left w7-item-box"
                >
                  <ComputerIcon size={16} />
                  <span className="truncate">System Info (C:)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    aeroSound.playClick();
                    onOpenWindow('notepad');
                  }}
                  className="w-full flex items-center gap-2 px-2 py-1 text-left w7-item-box"
                >
                  <NotepadIcon size={16} />
                  <span className="truncate">Resume.txt</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    aeroSound.playClick();
                    onOpenWindow('cmd');
                  }}
                  className="w-full flex items-center gap-2 px-2 py-1 text-left w7-item-box"
                >
                  <CmdIcon size={16} />
                  <span className="truncate">cmd.exe</span>
                </button>
              </div>
            </div>
          </aside>
        )}

        {/* Center Folder Content Area */}
        <div className="flex-1 overflow-y-auto w7-scroll p-3 sm:p-4 selectable-text">
          {/* Library Header Banner */}
          <div className="flex flex-wrap items-baseline justify-between border-b border-[#e2e8f0] pb-2 mb-3 gap-2">
            <div>
              <span className="text-[16px] text-[#003399] font-normal mr-2" style={{ fontFamily: 'Calibri, "Segoe UI", sans-serif' }}>
                {searchQuery ? `Search Results for "${searchQuery}"` : sectionLabels[activeSection]}
              </span>
              <span className="text-[11.5px] text-[#64748b]">
                Includes: <strong className="font-normal text-[#0066cc]">{siteConfig.name} Portfolio</strong>
              </span>
            </div>
            <div className="text-[11px] text-[#555] flex items-center gap-2">
              <a
                href={siteConfig.github.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0066cc] hover:underline"
              >
                All on GitHub ↗
              </a>
            </div>
          </div>

          {/* A. SEARCH RESULTS VIEW */}
          {searchResults ? (
            <div className="space-y-5">
              {searchResults.matchedProjects.length === 0 &&
                searchResults.matchedExp.length === 0 &&
                searchResults.matchedCerts.length === 0 && (
                  <div className="py-10 text-center text-[#666] text-[12.5px]">
                    No items match your search &ldquo;{searchQuery}&rdquo;.
                  </div>
                )}

              {searchResults.matchedProjects.length > 0 && (
                <div>
                  <h3 className="text-[12px] font-semibold text-[#003399] mb-2 border-b border-[#e5edf5] pb-1">
                    Projects ({searchResults.matchedProjects.length})
                  </h3>
                  <div className="space-y-1.5">
                    {searchResults.matchedProjects.map((proj) => (
                      <div
                        key={proj.id}
                        onClick={() => setSelectedProject(proj)}
                        className={`w7-item-box p-2.5 flex items-start gap-3 ${
                          selectedProject?.id === proj.id ? 'selected' : ''
                        }`}
                      >
                        <ProjectAppIcon size={32} className="shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-[13px] text-[#111]">{proj.name}</span>
                            <span className="text-[11px] text-[#4c627d] bg-[#eef5fc] px-2 py-0.5 rounded border border-[#c8dcf2]">
                              {proj.type}
                            </span>
                          </div>
                          <p className="text-[12px] text-[#333] mt-0.5">{proj.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.matchedExp.length > 0 && (
                <div>
                  <h3 className="text-[12px] font-semibold text-[#003399] mb-2 border-b border-[#e5edf5] pb-1">
                    Experience ({searchResults.matchedExp.length})
                  </h3>
                  <div className="space-y-1.5">
                    {searchResults.matchedExp.map((exp) => (
                      <div key={exp.id} className="w7-item-box p-2.5 flex items-start gap-3">
                        <BriefcaseIcon size={32} className="shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-[13px] text-[#111]">
                              {exp.title} &mdash; {exp.company}
                            </span>
                            <span className="text-[11px] text-[#666]">{exp.duration}</span>
                          </div>
                          <p className="text-[12px] text-[#333] mt-0.5">{exp.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.matchedCerts.length > 0 && (
                <div>
                  <h3 className="text-[12px] font-semibold text-[#003399] mb-2 border-b border-[#e5edf5] pb-1">
                    Certifications ({searchResults.matchedCerts.length})
                  </h3>
                  <div className="space-y-1">
                    {searchResults.matchedCerts.map((cert, idx) => (
                      <a
                        key={idx}
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w7-item-box p-2 flex items-center justify-between gap-2 text-[12px] hover:no-underline"
                      >
                        <div className="flex items-center gap-2.5">
                          <CertificateIcon size={22} />
                          <div>
                            <div className="font-medium text-[#0066cc] hover:underline">{cert.name}</div>
                            <div className="text-[11px] text-[#666]">{cert.issuer}</div>
                          </div>
                        </div>
                        <span className="text-[11px] text-[#555] shrink-0">{cert.issued.split(' |')[0]} ↗</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : activeSection === 'overview' ? (
            /* B. OVERVIEW SECTION (Library Folders + Complete Executive Portfolio) */
            <div className="space-y-6">
              {/* Top Quick-Access Library Folders */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[12.5px] font-semibold text-[#1e395b]">Portfolio Libraries (5)</span>
                  <div className="flex-1 h-[1px] bg-[#e2e8f0]" />
                </div>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-2">
                  <button
                    type="button"
                    onClick={() => navigateTo('projects')}
                    className="w7-item-box p-2.5 flex items-center gap-2.5 text-left"
                  >
                    <FolderIcon size={34} badgeColor="#2563eb" className="shrink-0" />
                    <div className="min-w-0">
                      <div className="font-semibold text-[12px] text-[#111] truncate">Projects</div>
                      <div className="text-[11px] text-[#666]">6 applications</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigateTo('experience')}
                    className="w7-item-box p-2.5 flex items-center gap-2.5 text-left"
                  >
                    <BriefcaseIcon size={34} className="shrink-0" />
                    <div className="min-w-0">
                      <div className="font-semibold text-[12px] text-[#111] truncate">Experience</div>
                      <div className="text-[11px] text-[#666]">4 active roles</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigateTo('skills')}
                    className="w7-item-box p-2.5 flex items-center gap-2.5 text-left"
                  >
                    <FolderIcon size={34} badgeColor="#16a34a" className="shrink-0" />
                    <div className="min-w-0">
                      <div className="font-semibold text-[12px] text-[#111] truncate">Skills &amp; Edu</div>
                      <div className="text-[11px] text-[#666]">Security &amp; Dev</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigateTo('certifications')}
                    className="w7-item-box p-2.5 flex items-center gap-2.5 text-left"
                  >
                    <CertificateIcon size={34} className="shrink-0" />
                    <div className="min-w-0">
                      <div className="font-semibold text-[12px] text-[#111] truncate">Certifications</div>
                      <div className="text-[11px] text-[#666]">{totalCertCount} credentials</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigateTo('mentorship')}
                    className="w7-item-box p-2.5 flex items-center gap-2.5 text-left"
                  >
                    <SecurityShieldIcon size={34} className="shrink-0" />
                    <div className="min-w-0">
                      <div className="font-semibold text-[12px] text-[#111] truncate">Mentorship</div>
                      <div className="text-[11px] text-[#666]">AFRITECH &amp; Talks</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Featured Projects Section */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[13px] font-semibold text-[#003399]">Featured Projects (6)</span>
                  <button
                    type="button"
                    onClick={() => navigateTo('projects')}
                    className="text-[11.5px] text-[#0066cc] hover:underline"
                  >
                    Open Projects Folder &rarr;
                  </button>
                </div>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-2">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      onClick={() => {
                        setSelectedProject(project);
                        setOverviewFocus('project');
                      }}
                      className={`w7-item-box p-3 flex items-start gap-3 ${
                        overviewFocus === 'project' && selectedProject?.id === project.id ? 'selected' : ''
                      }`}
                    >
                      <ProjectAppIcon size={32} className="shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-1.5">
                          <h3 className="font-semibold text-[12.5px] text-[#111]">{project.name}</h3>
                          <span className="text-[10.5px] text-[#3b5978] bg-[#eef5fc] px-1.5 py-0.5 rounded border border-[#c8dcf2] shrink-0">
                            {project.type}
                          </span>
                        </div>
                        <p className="text-[11.5px] text-[#333] line-clamp-2 mt-0.5">{project.description}</p>
                        <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
                          <div className="flex flex-wrap gap-1">
                            {project.tech.map((t) => (
                              <span key={t} className="px-1.5 py-0.5 text-[10px] rounded bg-[#f4f6f9] border border-[#d5dde6] text-[#334155]">
                                {t}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-2 text-[11px]">
                            {project.liveUrl && (
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-[#0066cc] hover:underline font-medium"
                              >
                                Live ↗
                              </a>
                            )}
                            {project.githubUrl && (
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-[#0066cc] hover:underline font-medium"
                              >
                                Source ↗
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience Summary Section */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[13px] font-semibold text-[#003399]">Career Experience (4 Roles)</span>
                  <button
                    type="button"
                    onClick={() => navigateTo('experience')}
                    className="text-[11.5px] text-[#0066cc] hover:underline"
                  >
                    Open Experience Folder &rarr;
                  </button>
                </div>
                <div className="space-y-2">
                  {experiences.map((exp) => (
                    <div
                      key={exp.id}
                      onClick={() => {
                        setSelectedExp(exp);
                        setOverviewFocus('experience');
                      }}
                      className={`w7-item-box p-3 flex items-start gap-3 ${
                        overviewFocus === 'experience' && selectedExp?.id === exp.id ? 'selected' : ''
                      }`}
                    >
                      <BriefcaseIcon size={28} className="shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-baseline justify-between gap-1">
                          <h3 className="font-semibold text-[12.5px] text-[#111]">
                            {exp.title} <span className="font-normal text-[#555]">&middot; {exp.company}</span>
                          </h3>
                          <span className="text-[11px] text-[#555] font-mono">{exp.duration}</span>
                        </div>
                        <p className="text-[11.5px] text-[#333] mt-0.5">{exp.description}</p>
                        {exp.achievements.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-1.5">
                            {exp.achievements.map((ach) => (
                              <span key={ach} className="text-[11px] text-[#15803d] bg-[#f0fdf4] border border-[#bbf7d0] px-2 py-0.5 rounded">
                                ✓ {ach}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : activeSection === 'projects' ? (
            /* C. PROJECTS SECTION (Supports Content, Tiles, and Sortable Details Table View!) */
            viewMode === 'details' ? (
              <div className="border border-[#d0d7de] rounded-sm overflow-x-auto">
                <table className="w7-table">
                  <thead>
                    <tr>
                      <th onClick={() => handleSort('name')}>
                        Name {sortCol === 'name' ? (sortAsc ? '▲' : '▼') : ''}
                      </th>
                      <th onClick={() => handleSort('type')}>
                        Category {sortCol === 'type' ? (sortAsc ? '▲' : '▼') : ''}
                      </th>
                      <th onClick={() => handleSort('tech')}>
                        Technology Stack {sortCol === 'tech' ? (sortAsc ? '▲' : '▼') : ''}
                      </th>
                      <th>Links</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedProjects.map((project) => (
                      <tr
                        key={project.id}
                        onClick={() => setSelectedProject(project)}
                        onDoubleClick={() => {
                          const targetUrl = project.liveUrl || project.githubUrl;
                          if (targetUrl) window.open(targetUrl, '_blank');
                        }}
                        className={selectedProject?.id === project.id ? 'selected' : ''}
                      >
                        <td className="font-medium">
                          <div className="flex items-center gap-2">
                            <ProjectAppIcon size={18} />
                            <span>{project.name}</span>
                          </div>
                        </td>
                        <td>{project.type}</td>
                        <td>{project.tech.join(', ')}</td>
                        <td>
                          <div className="flex items-center gap-3">
                            {project.liveUrl && (
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#0066cc] hover:underline"
                              >
                                Live ↗
                              </a>
                            )}
                            {project.githubUrl && (
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#0066cc] hover:underline"
                              >
                                Source ↗
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'tiles'
                    ? 'grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-2.5'
                    : 'space-y-2'
                }
              >
                {sortedProjects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    onDoubleClick={() => {
                      const targetUrl = project.liveUrl || project.githubUrl;
                      if (targetUrl) window.open(targetUrl, '_blank');
                    }}
                    className={`w7-item-box p-3 flex items-start gap-3.5 ${
                      selectedProject?.id === project.id ? 'selected' : ''
                    }`}
                  >
                    <ProjectAppIcon size={38} className="shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-[13px] font-semibold text-[#111]">{project.name}</h3>
                        <span className="text-[11px] text-[#003399] bg-[#eef5fc] px-2 py-0.5 rounded border border-[#c8dcf2] shrink-0">
                          {project.type}
                        </span>
                      </div>
                      <p className="text-[12px] text-[#333] mt-1 leading-relaxed">{project.description}</p>
                      <div className="flex flex-wrap items-center justify-between gap-2 mt-2.5">
                        <div className="flex flex-wrap gap-1.5">
                          {project.tech.map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 text-[11px] rounded bg-[#f3f6fa] border border-[#cbd5e1] text-[#1e293b]"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="w7-btn !min-h-[21px] !px-2.5 !text-[11px]"
                            >
                              Live Site ↗
                            </a>
                          )}
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="w7-btn !min-h-[21px] !px-2.5 !text-[11px]"
                            >
                              GitHub Source ↗
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : activeSection === 'experience' ? (
            /* D. EXPERIENCE SECTION (Supports Content, Tiles, and Details View!) */
            viewMode === 'details' ? (
              <div className="border border-[#d0d7de] rounded-sm overflow-x-auto">
                <table className="w7-table">
                  <thead>
                    <tr>
                      <th>Role Title</th>
                      <th>Organization</th>
                      <th>Duration</th>
                      <th>Key Skills</th>
                    </tr>
                  </thead>
                  <tbody>
                    {experiences.map((exp) => (
                      <tr
                        key={exp.id}
                        onClick={() => setSelectedExp(exp)}
                        className={selectedExp?.id === exp.id ? 'selected' : ''}
                      >
                        <td className="font-medium">
                          <div className="flex items-center gap-2">
                            <BriefcaseIcon size={18} />
                            <span>{exp.title}</span>
                          </div>
                        </td>
                        <td>{exp.company}</td>
                        <td className="font-mono text-[11px]">{exp.duration}</td>
                        <td>{exp.skills.join(', ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'tiles'
                    ? 'grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-2.5'
                    : 'space-y-3'
                }
              >
                {experiences.map((exp) => (
                  <article
                    key={exp.id}
                    onClick={() => setSelectedExp(exp)}
                    className={`w7-item-box p-3.5 flex items-start gap-3.5 ${
                      selectedExp?.id === exp.id ? 'selected' : ''
                    }`}
                  >
                    <BriefcaseIcon size={36} className="shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                        <h3 className="text-[13.5px] font-semibold text-[#003399]">
                          {exp.title} <span className="text-[#222] font-normal">&mdash; {exp.company}</span>
                        </h3>
                        <span className="text-[11.5px] font-mono text-[#4c627d] bg-[#f0f6fc] px-2 py-0.5 rounded border border-[#cfe0f5]">
                          {exp.duration}
                        </span>
                      </div>
                      <p className="text-[12.5px] text-[#222] mt-1.5 leading-relaxed">{exp.description}</p>

                      {exp.achievements.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {exp.achievements.map((a) => (
                            <li key={a} className="text-[12px] text-[#15803d] font-medium flex items-center gap-1.5">
                              <span>✓</span>
                              <span>{a}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {exp.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {exp.skills.map((s) => (
                            <span
                              key={s}
                              className="px-2 py-0.5 text-[11px] rounded bg-[#f4f7fb] border border-[#cbd5e1] text-[#334155]"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )
          ) : activeSection === 'skills' ? (
            /* E. SKILLS & EDUCATION SECTION */
            <div className="space-y-5">
              <div className="space-y-4">
                {skillGroups.map((g) => (
                  <fieldset key={g.title} className="w7-groupbox">
                    <legend className="font-semibold text-[12.5px]">{g.title}</legend>
                    <div className="mb-2.5 flex items-center gap-3">
                      <span className="text-[11px] text-[#555] w-24 shrink-0">Proficiency:</span>
                      <div className="w7-progressbar flex-1">
                        <div className="w7-progressbar-fill" style={{ width: g.level }} />
                      </div>
                      <span className="text-[11px] font-bold text-[#15803d] w-10 text-right">{g.level}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {g.skills.map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-1 text-[11.5px] rounded bg-gradient-to-b from-[#ffffff] to-[#eef4fb] border border-[#9abbe0] text-[#0f2942] font-medium shadow-sm"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </fieldset>
                ))}
              </div>

              {/* Academic Education */}
              <fieldset className="w7-groupbox">
                <legend className="font-semibold text-[12.5px]">Academic Education</legend>
                <div className="space-y-3 pt-1">
                  {education.map((edu) => (
                    <div
                      key={edu.institution}
                      className="p-2.5 rounded border border-[#dce6f2] bg-[#f8fbff] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div>
                        <div className="text-[13px] font-semibold text-[#111]">{edu.institution}</div>
                        <div className="text-[12px] text-[#003399]">{edu.degree}</div>
                        {edu.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {edu.skills.map((sk) => (
                              <span
                                key={sk}
                                className="px-2 py-0.5 text-[10.5px] rounded bg-white border border-[#cbd5e1] text-[#475569]"
                              >
                                {sk}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      {edu.duration && (
                        <span className="font-mono text-[11.5px] text-[#4c627d] bg-white px-2.5 py-1 rounded border border-[#cbd5e1] shrink-0 self-start">
                          {edu.duration}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </fieldset>
            </div>
          ) : activeSection === 'certifications' ? (
            /* F. CERTIFICATIONS SECTION */
            <div className="space-y-5">
              {certificationGroups.map((group) => (
                <fieldset key={group.title} className="w7-groupbox">
                  <legend className="font-semibold text-[12.5px]">
                    {group.title} ({group.certifications.length})
                  </legend>
                  <div
                    className={
                      viewMode === 'tiles'
                        ? 'grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-2 pt-1'
                        : 'space-y-1.5 pt-1'
                    }
                  >
                    {group.certifications.map((cert, i) => {
                      const isSel = selectedCert.name === cert.name;
                      return (
                        <div
                          key={i}
                          onClick={() => setSelectedCert({ ...cert, group: group.title })}
                          onDoubleClick={() => window.open(cert.link, '_blank')}
                          className={`w7-item-box p-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                            isSel ? 'selected' : ''
                          }`}
                        >
                          <div className="flex items-start gap-2.5 min-w-0">
                            <CertificateIcon size={24} className="shrink-0 mt-0.5" />
                            <div className="min-w-0">
                              <a
                                href={cert.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-[12.5px] font-medium text-[#0066cc] hover:underline block"
                              >
                                {cert.name}
                              </a>
                              <div className="text-[11px] text-[#555]">
                                Issuer: {cert.issuer}
                                {cert.skills ? ` · ${cert.skills}` : ''}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                            <span className="font-mono text-[11px] text-[#4c627d] bg-[#f2f7fc] px-2 py-0.5 rounded border border-[#d0e0f2]">
                              {cert.issued.split(' |')[0]}
                            </span>
                            <a
                              href={cert.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="w7-btn !min-h-[20px] !px-2 !text-[11px]"
                            >
                              Verify ↗
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </fieldset>
              ))}
            </div>
          ) : (
            /* G. MENTORSHIP SECTION */
            <div className="space-y-4">
              <div className="p-4 rounded border border-[#b8d4f2] bg-gradient-to-b from-[#f5faff] to-[#e6f2ff] flex items-start gap-4">
                <SecurityShieldIcon size={42} className="shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h2 className="text-[15px] font-semibold text-[#003399]">
                    Technical Mentorship &amp; Cybersecurity Community Leadership
                  </h2>
                  <p className="text-[12.5px] text-[#222] leading-relaxed">
                    Mentored student teams at <strong>AFRITECH</strong> &mdash; three groups secured top-3 finishes
                    building cashless campus payment solutions. I also give talks on cybersecurity careers and
                    technical problem-solving.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => onOpenWindow('contact')}
                      className="w7-btn default"
                    >
                      Invite for Speaking / Mentorship
                    </button>
                    <a
                      href={siteConfig.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w7-btn"
                    >
                      Connect on LinkedIn ↗
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Preview Pane (Context-Aware across all sections, Toggleable via Command Bar) */}
        {showPreviewPane && (
          <aside className="w-[225px] shrink-0 hidden lg:flex flex-col border-l border-[#d6dfe9] bg-gradient-to-b from-[#fafcff] to-[#f0f6fc] p-3.5 text-[12px] overflow-y-auto w7-scroll">
            {activeSection === 'experience' || (activeSection === 'overview' && overviewFocus === 'experience') ? (
              selectedExp && (
                <div className="space-y-3">
                  <div className="flex flex-col items-center text-center pb-3 border-b border-[#d5e2f0]">
                    <BriefcaseIcon size={50} />
                    <h4 className="font-semibold text-[13.5px] text-[#003399] mt-2">{selectedExp.title}</h4>
                    <span className="text-[11.5px] font-medium text-[#222]">{selectedExp.company}</span>
                    <span className="text-[11px] font-mono text-[#4c627d] mt-0.5">{selectedExp.duration}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[11px] font-semibold text-[#4c627d] uppercase">Role Overview</div>
                    <p className="text-[11.5px] text-[#222] leading-relaxed">{selectedExp.description}</p>
                  </div>

                  {selectedExp.achievements.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-[11px] font-semibold text-[#4c627d] uppercase">Key Achievements</div>
                      <ul className="space-y-1">
                        {selectedExp.achievements.map((a) => (
                          <li key={a} className="text-[11px] text-[#15803d] font-medium">
                            ✓ {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="text-[11px] font-semibold text-[#4c627d] uppercase">Skills Applied</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedExp.skills.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 text-[10.5px] rounded bg-white border border-[#b8cfe8] text-[#1e395b]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )
            ) : activeSection === 'certifications' ? (
              <div className="space-y-3">
                <div className="flex flex-col items-center text-center pb-3 border-b border-[#d5e2f0]">
                  <CertificateIcon size={50} />
                  <h4 className="font-semibold text-[13px] text-[#003399] mt-2 leading-snug">
                    {selectedCert.name}
                  </h4>
                  <span className="text-[11px] text-[#4c627d] mt-0.5">{selectedCert.issuer}</span>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] font-semibold text-[#4c627d] uppercase">Suite</div>
                  <div className="text-[11.5px] text-[#222]">{selectedCert.group}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] font-semibold text-[#4c627d] uppercase">Issued Date</div>
                  <div className="text-[11.5px] font-mono text-[#222]">{selectedCert.issued}</div>
                </div>

                {selectedCert.skills && (
                  <div className="space-y-1">
                    <div className="text-[11px] font-semibold text-[#4c627d] uppercase">Credential Details</div>
                    <div className="text-[11px] text-[#222]">{selectedCert.skills}</div>
                  </div>
                )}

                <div className="pt-2">
                  <a
                    href={selectedCert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w7-btn default w-full"
                  >
                    Verify Credential ↗
                  </a>
                </div>
              </div>
            ) : activeSection === 'skills' ? (
              <div className="space-y-3">
                <div className="flex flex-col items-center text-center pb-3 border-b border-[#d5e2f0]">
                  <FolderIcon size={50} badgeColor="#16a34a" />
                  <h4 className="font-semibold text-[13.5px] text-[#003399] mt-2">Skills &amp; Academic Matrix</h4>
                  <span className="text-[11px] text-[#4c627d]">3 Core Domains &middot; 20+ Technologies</span>
                </div>
                <div className="space-y-1.5 text-[11.5px] text-[#222]">
                  <p>
                    <strong>Degree:</strong> {education[0].degree} ({education[0].duration})
                  </p>
                  <p>
                    <strong>Institution:</strong> {education[0].institution}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenWindow('notepad')}
                  className="w7-btn default w-full"
                >
                  Open Full Resume.txt
                </button>
              </div>
            ) : activeSection === 'mentorship' ? (
              <div className="space-y-3">
                <div className="flex flex-col items-center text-center pb-3 border-b border-[#d5e2f0]">
                  <SecurityShieldIcon size={50} />
                  <h4 className="font-semibold text-[13.5px] text-[#003399] mt-2">AFRITECH Mentorship</h4>
                  <span className="text-[11px] text-[#4c627d]">3 Top-3 Student Team Finishes</span>
                </div>
                <p className="text-[11.5px] text-[#222] leading-relaxed">
                  Guided student engineering teams building cashless campus payment platforms and delivers talks on cybersecurity careers.
                </p>
                <button
                  type="button"
                  onClick={() => onOpenWindow('contact')}
                  className="w7-btn default w-full"
                >
                  Book Speaking / Mentorship
                </button>
              </div>
            ) : selectedProject ? (
              <div className="space-y-3">
                <div className="flex flex-col items-center text-center pb-3 border-b border-[#d5e2f0]">
                  <ProjectAppIcon size={54} />
                  <h4 className="font-semibold text-[13.5px] text-[#003399] mt-2">{selectedProject.name}</h4>
                  <span className="text-[11px] text-[#4c627d]">{selectedProject.type}</span>
                </div>

                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold text-[#4c627d] uppercase">Description</div>
                  <p className="text-[11.5px] text-[#222] leading-relaxed">{selectedProject.description}</p>
                </div>

                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold text-[#4c627d] uppercase">Technologies</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedProject.tech.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 text-[11px] rounded bg-white border border-[#b8cfe8] text-[#1e395b]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 space-y-1.5">
                  {selectedProject.liveUrl && (
                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w7-btn default w-full"
                    >
                      Open Live Site ↗
                    </a>
                  )}
                  {selectedProject.githubUrl && (
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w7-btn w-full"
                    >
                      View GitHub Source ↗
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="my-auto text-center text-[#64748b] text-[12px]">
                Select a file or project to preview its details.
              </div>
            )}
          </aside>
        )}
      </div>

      {/* 4. Bottom Explorer Details Pane */}
      <div className="min-h-[34px] px-3 py-1 bg-gradient-to-b from-[#f2f7fc] to-[#dce9f7] border-t border-[#b6c9e0] flex flex-wrap items-center justify-between gap-2 text-[11.5px] text-[#1e395b] shrink-0">
        <div className="flex items-center gap-2.5">
          <ExplorerIcon size={20} />
          <div>
            <span className="font-semibold">
              {activeSection === 'experience' || (activeSection === 'overview' && overviewFocus === 'experience')
                ? selectedExp
                  ? `${selectedExp.title} (${selectedExp.company})`
                  : siteConfig.name
                : activeSection === 'certifications'
                ? selectedCert.name
                : activeSection === 'skills'
                ? `${education[0].degree}`
                : activeSection === 'mentorship'
                ? 'AFRITECH Technical Mentorship'
                : selectedProject
                ? selectedProject.name
                : siteConfig.name}
            </span>
            <span className="mx-2 text-[#7a93b0]">|</span>
            <span className="text-[#3b5978]">
              {activeSection === 'projects'
                ? `${projects.length} projects`
                : activeSection === 'experience'
                ? `${experiences.length} experience roles`
                : activeSection === 'certifications'
                ? `${totalCertCount} verified certifications`
                : `6 Projects · 4 Roles · ${totalCertCount} Certifications`}
            </span>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-[11px] text-[#3b5978]">
          <span>Author: {siteConfig.name}</span>
          <span>&middot;</span>
          <span>Status: Verified &amp; Online</span>
        </div>
      </div>
    </div>
  );
};

