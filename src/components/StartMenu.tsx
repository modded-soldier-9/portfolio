'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Image from 'next/image';
import { siteConfig } from '@/config/site';
import { projects } from '@/data/projects';
import { experiences } from '@/data/experience';
import { certificationGroups } from '@/data/certifications';
import {
  ExplorerIcon,
  ComputerIcon,
  SecurityShieldIcon,
  ContactMailIcon,
  CmdIcon,
  NotepadIcon,
  PersonalizeIcon,
  FolderIcon,
  ProjectAppIcon,
  CertificateIcon,
  BriefcaseIcon,
  CalculatorIcon,
  PaintIcon,
  MinesweeperIcon,
  SolitaireIcon,
  HeartsIcon,
  UserAvatarSvg,
} from './AeroIcons';
import { aeroSound } from './AeroSound';
import { animateStartMenuOpen, animateFlyoutOpen } from '@/core/animation';
import { useOS } from '@/state/os-store';
import type { ExplorerSection } from './windows/SystemWindow';

interface StartMenuProps {
  onOpenWindow: (id: string) => void;
  onOpenExplorerSection: (section: ExplorerSection) => void;
  onResetDesktop: () => void;
  onCloseMenu: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({
  onOpenWindow,
  onOpenExplorerSection,
  onResetDesktop,
  onCloseMenu,
}) => {
  const [allProgramsOpen, setAllProgramsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [showShutMenu, setShowShutMenu] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const shutMenuRef = useRef<HTMLDivElement>(null);

  const { userProfile, lockOrLogOff, sleepSystem, restartSystem, files } = useOS();
  const recycleCount = useMemo(
    () => files.filter((f) => f.folder === 'RecycleBin').length,
    [files]
  );

  useEffect(() => {
    animateStartMenuOpen(menuRef.current);
  }, []);

  useEffect(() => {
    if (showShutMenu) {
      animateFlyoutOpen(shutMenuRef.current);
    }
  }, [showShutMenu]);

  const pinnedPrograms = useMemo(
    () => [
      {
        id: 'explorer',
        title: 'Windows Explorer',
        subtitle: 'Portfolio, Documents & Computer',
        icon: <ExplorerIcon size={30} />,
        action: () => {
          onOpenExplorerSection('overview');
          onCloseMenu();
        },
      },
      {
        id: 'system',
        title: 'System Properties',
        subtitle: 'About Mohamed Elsheikh & Specs',
        icon: <ComputerIcon size={30} />,
        action: () => {
          onOpenWindow('system');
          onCloseMenu();
        },
      },
      {
        id: 'notepad',
        title: 'Notepad',
        subtitle: 'Text Editor & Resume_Mohamed.txt',
        icon: <NotepadIcon size={30} />,
        action: () => {
          onOpenWindow('notepad');
          onCloseMenu();
        },
      },
      {
        id: 'calculator',
        title: 'Calculator',
        subtitle: 'Standard & Scientific Aero Calc',
        icon: <CalculatorIcon size={30} />,
        action: () => {
          onOpenWindow('calculator');
          onCloseMenu();
        },
      },
      {
        id: 'paint',
        title: 'Paint',
        subtitle: 'Create & edit drawings and shapes',
        icon: <PaintIcon size={30} />,
        action: () => {
          onOpenWindow('paint');
          onCloseMenu();
        },
      },
      {
        id: 'minesweeper',
        title: 'Minesweeper',
        subtitle: 'Classic Aero logic puzzle game',
        icon: <MinesweeperIcon size={30} />,
        action: () => {
          onOpenWindow('minesweeper');
          onCloseMenu();
        },
      },
      {
        id: 'solitaire',
        title: 'Solitaire',
        subtitle: 'Klondike card game (Draw 1 / 3)',
        icon: <SolitaireIcon size={30} />,
        action: () => {
          onOpenWindow('solitaire');
          onCloseMenu();
        },
      },
      {
        id: 'hearts',
        title: 'Hearts',
        subtitle: '4-player trick-taking card game',
        icon: <HeartsIcon size={30} />,
        action: () => {
          onOpenWindow('hearts');
          onCloseMenu();
        },
      },
      {
        id: 'security',
        title: 'Cyber Security Center',
        subtitle: 'Leadership & 15+ Certifications',
        icon: <SecurityShieldIcon size={30} />,
        action: () => {
          onOpenWindow('security');
          onCloseMenu();
        },
      },
      {
        id: 'cmd',
        title: 'Command Prompt',
        subtitle: 'Interactive CLI terminal (cmd.exe)',
        icon: <CmdIcon size={30} />,
        action: () => {
          onOpenWindow('cmd');
          onCloseMenu();
        },
      },
      {
        id: 'contact',
        title: 'Contact & WhatsApp',
        subtitle: 'Send direct message or email',
        icon: <ContactMailIcon size={30} />,
        action: () => {
          onOpenWindow('contact');
          onCloseMenu();
        },
      },
      {
        id: 'personalize',
        title: 'Personalization',
        subtitle: 'Aero Glass colors & wallpaper',
        icon: <PersonalizeIcon size={30} />,
        action: () => {
          onOpenWindow('personalize');
          onCloseMenu();
        },
      },
    ],
    [onCloseMenu, onOpenExplorerSection, onOpenWindow]
  );

  const searchResults = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return null;
    const progs = pinnedPrograms.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q)
    );
    const projs = projects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tech.some((t) => t.toLowerCase().includes(q))
    );
    const exps = experiences.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.company.toLowerCase().includes(q)
    );
    const certs = certificationGroups.flatMap((g) =>
      g.certifications.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.issuer.toLowerCase().includes(q)
      )
    );
    return { progs, projs, exps, certs };
  }, [search, pinnedPrograms]);

  return (
    <div
      ref={menuRef}
      className="w7-start-menu"
      role="dialog"
      aria-label="Start Menu"
      onClick={(e) => e.stopPropagation()}
    >
      {/* LEFT WHITE PANE */}
      <div className="w7-start-left">
        <div className="flex-1 overflow-y-auto w7-scroll p-1.5">
          {searchResults ? (
            /* Live Search Results inside Start Menu */
            <div className="space-y-2 p-1 text-[11.5px]">
              {searchResults.progs.length > 0 && (
                <div>
                  <div className="font-semibold text-[#003399] px-1.5 py-0.5 border-b border-[#e2e8f0]">
                    Programs &amp; Games ({searchResults.progs.length})
                  </div>
                  {searchResults.progs.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        aeroSound.playClick();
                        p.action();
                      }}
                      className="w-full w7-item-box flex items-center gap-2 p-1.5 text-left"
                    >
                      {p.icon}
                      <div className="min-w-0">
                        <div className="font-semibold text-[#111] truncate">
                          {p.title}
                        </div>
                        <div className="text-[10.5px] text-[#666] truncate">
                          {p.subtitle}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {searchResults.projs.length > 0 && (
                <div>
                  <div className="font-semibold text-[#003399] px-1.5 py-0.5 border-b border-[#e2e8f0]">
                    Projects ({searchResults.projs.length})
                  </div>
                  {searchResults.projs.map((pr) => (
                    <button
                      key={pr.id}
                      type="button"
                      onClick={() => {
                        aeroSound.playClick();
                        onOpenExplorerSection('projects');
                        onCloseMenu();
                      }}
                      className="w-full w7-item-box flex items-center gap-2 p-1.5 text-left"
                    >
                      <ProjectAppIcon size={22} />
                      <div className="min-w-0">
                        <div className="font-medium text-[#111] truncate">
                          {pr.name}
                        </div>
                        <div className="text-[10.5px] text-[#666] truncate">
                          {pr.tech.join(', ')}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {searchResults.exps.length > 0 && (
                <div>
                  <div className="font-semibold text-[#003399] px-1.5 py-0.5 border-b border-[#e2e8f0]">
                    Experience ({searchResults.exps.length})
                  </div>
                  {searchResults.exps.map((ex) => (
                    <button
                      key={ex.id}
                      type="button"
                      onClick={() => {
                        aeroSound.playClick();
                        onOpenExplorerSection('experience');
                        onCloseMenu();
                      }}
                      className="w-full w7-item-box flex items-center gap-2 p-1.5 text-left"
                    >
                      <BriefcaseIcon size={20} />
                      <div className="min-w-0">
                        <div className="font-medium text-[#111] truncate">
                          {ex.title}
                        </div>
                        <div className="text-[10.5px] text-[#666] truncate">
                          {ex.company}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {searchResults.certs.length > 0 && (
                <div>
                  <div className="font-semibold text-[#003399] px-1.5 py-0.5 border-b border-[#e2e8f0]">
                    Certifications ({searchResults.certs.length})
                  </div>
                  {searchResults.certs.slice(0, 5).map((ct, i) => (
                    <a
                      key={i}
                      href={ct.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full w7-item-box flex items-center gap-2 p-1.5 text-left hover:no-underline"
                    >
                      <CertificateIcon size={20} />
                      <div className="min-w-0">
                        <div className="font-medium text-[#0066cc] truncate">
                          {ct.name}
                        </div>
                        <div className="text-[10px] text-[#666] truncate">
                          {ct.issuer}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}

              {searchResults.progs.length === 0 &&
                searchResults.projs.length === 0 &&
                searchResults.exps.length === 0 &&
                searchResults.certs.length === 0 && (
                  <div className="py-8 text-center text-[#666]">
                    No items match your search.
                  </div>
                )}
            </div>
          ) : allProgramsOpen ? (
            /* All Programs Tree View */
            <div className="space-y-1.5 p-1 text-[11.5px]">
              <div className="font-semibold text-[#003399] px-1.5 py-0.5 border-b border-[#e2e8f0]">
                Accessories
              </div>
              {[
                { id: 'notepad', label: 'Notepad', icon: <NotepadIcon size={18} /> },
                { id: 'calculator', label: 'Calculator', icon: <CalculatorIcon size={18} /> },
                { id: 'paint', label: 'Paint', icon: <PaintIcon size={18} /> },
                { id: 'cmd', label: 'Command Prompt', icon: <CmdIcon size={18} /> },
              ].map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => {
                    aeroSound.playClick();
                    onOpenWindow(acc.id);
                    onCloseMenu();
                  }}
                  className="w-full w7-item-box flex items-center gap-2 px-2 py-1 text-left"
                >
                  {acc.icon}
                  <span className="truncate font-medium text-[#111]">
                    {acc.label}
                  </span>
                </button>
              ))}

              <div className="font-semibold text-[#003399] px-1.5 py-0.5 border-b border-[#e2e8f0] pt-1">
                Games
              </div>
              {[
                { id: 'minesweeper', label: 'Minesweeper', icon: <MinesweeperIcon size={18} /> },
                { id: 'solitaire', label: 'Solitaire', icon: <SolitaireIcon size={18} /> },
                { id: 'hearts', label: 'Hearts', icon: <HeartsIcon size={18} /> },
              ].map((gm) => (
                <button
                  key={gm.id}
                  type="button"
                  onClick={() => {
                    aeroSound.playClick();
                    onOpenWindow(gm.id);
                    onCloseMenu();
                  }}
                  className="w-full w7-item-box flex items-center gap-2 px-2 py-1 text-left"
                >
                  {gm.icon}
                  <span className="truncate font-medium text-[#111]">
                    {gm.label}
                  </span>
                </button>
              ))}

              <div className="font-semibold text-[#003399] px-1.5 py-0.5 border-b border-[#e2e8f0] pt-1">
                Featured Projects (6)
              </div>
              {projects.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    aeroSound.playClick();
                    if (p.liveUrl) {
                      window.open(p.liveUrl, '_blank');
                    } else if (p.githubUrl) {
                      window.open(p.githubUrl, '_blank');
                    } else {
                      onOpenExplorerSection('projects');
                    }
                    onCloseMenu();
                  }}
                  className="w-full w7-item-box flex items-center gap-2 px-2 py-1 text-left"
                >
                  <ProjectAppIcon size={18} />
                  <span className="truncate font-medium text-[#111]">
                    {p.name}
                  </span>
                  <span className="ml-auto text-[10px] text-[#666]">
                    {p.type}
                  </span>
                </button>
              ))}

              <div className="font-semibold text-[#003399] px-1.5 py-0.5 border-b border-[#e2e8f0] pt-1">
                Career Experience (4)
              </div>
              {experiences.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => {
                    aeroSound.playClick();
                    onOpenExplorerSection('experience');
                    onCloseMenu();
                  }}
                  className="w-full w7-item-box flex items-center gap-2 px-2 py-1 text-left"
                >
                  <BriefcaseIcon size={18} />
                  <span className="truncate text-[#111]">
                    {e.title} ({e.company})
                  </span>
                </button>
              ))}

              <div className="font-semibold text-[#003399] px-1.5 py-0.5 border-b border-[#e2e8f0] pt-1">
                Certification Suites (4)
              </div>
              {certificationGroups.map((g) => (
                <button
                  key={g.title}
                  type="button"
                  onClick={() => {
                    aeroSound.playClick();
                    onOpenExplorerSection('certifications');
                    onCloseMenu();
                  }}
                  className="w-full w7-item-box flex items-center gap-2 px-2 py-1 text-left"
                >
                  <FolderIcon size={18} />
                  <span className="truncate text-[#111]">{g.title}</span>
                </button>
              ))}
            </div>
          ) : (
            /* Default Pinned Programs List */
            <div className="space-y-0.5">
              {pinnedPrograms.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    aeroSound.playClick();
                    item.action();
                  }}
                  className="w-full w7-item-box flex items-center gap-2.5 p-1.5 text-left"
                >
                  <div className="shrink-0">{item.icon}</div>
                  <div className="min-w-0">
                    <div className="font-semibold text-[12px] text-[#111] truncate leading-tight">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-[#5c6b7a] truncate leading-tight mt-0.5">
                      {item.subtitle}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* All Programs Toggle + Search Input Footer */}
        <div className="border-t border-[#d5dfe8] bg-[#f4f7fb] p-1.5 space-y-1.5">
          <button
            type="button"
            onClick={() => {
              aeroSound.playClick();
              setAllProgramsOpen(!allProgramsOpen);
            }}
            className="w-full w7-item-box flex items-center justify-between px-2.5 py-1 text-[12px] font-medium text-[#1e395b]"
          >
            <span>{allProgramsOpen ? '◂ Back' : 'All Programs'}</span>
            {!allProgramsOpen && <span className="text-[#2070b9]">▸</span>}
          </button>

          <div className="relative">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search programs and files"
              aria-label="Search Start Menu"
              className="w7-search-input w-full"
            />
            {!search && (
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
      </div>

      {/* RIGHT DARK AERO GLASS PANE */}
      <div className="w7-start-right">
        {/* Protruding User Portrait Picture Frame */}
        <div className="w7-start-avatar-frame">
          <div className="w-full h-full rounded-[3px] overflow-hidden border border-black/60 bg-[#0f2942]">
            {userProfile.useVectorAvatar ? (
              <UserAvatarSvg size={54} />
            ) : (
              <Image
                src={userProfile.avatarUrl}
                alt={userProfile.name}
                width={54}
                height={54}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>

        <div className="space-y-0.5">
          <button
            type="button"
            onClick={() => {
              aeroSound.playClick();
              onOpenWindow('system');
              onCloseMenu();
            }}
            className="w7-start-right-item font-semibold"
          >
            <span>{userProfile.name}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              aeroSound.playClick();
              onOpenExplorerSection('documents');
              onCloseMenu();
            }}
            className="w7-start-right-item"
          >
            <span>Documents</span>
          </button>

          <button
            type="button"
            onClick={() => {
              aeroSound.playClick();
              onOpenExplorerSection('pictures');
              onCloseMenu();
            }}
            className="w7-start-right-item"
          >
            <span>Pictures</span>
          </button>

          <button
            type="button"
            onClick={() => {
              aeroSound.playClick();
              onOpenExplorerSection('projects');
              onCloseMenu();
            }}
            className="w7-start-right-item"
          >
            <span>Projects (6)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              aeroSound.playClick();
              onOpenWindow('minesweeper');
              onCloseMenu();
            }}
            className="w7-start-right-item"
          >
            <span>Games</span>
          </button>

          <div className="my-1.5 h-[2px] bg-gradient-to-r from-transparent via-white/25 to-transparent" />

          <button
            type="button"
            onClick={() => {
              aeroSound.playClick();
              onOpenExplorerSection('computer');
              onCloseMenu();
            }}
            className="w7-start-right-item"
          >
            <span>Computer</span>
          </button>

          <button
            type="button"
            onClick={() => {
              aeroSound.playClick();
              onOpenExplorerSection('recycle');
              onCloseMenu();
            }}
            className="w7-start-right-item flex items-center justify-between"
          >
            <span>Recycle Bin</span>
            {recycleCount > 0 && (
              <span className="text-[10px] px-1.5 rounded bg-white/15 text-sky-200">
                {recycleCount}
              </span>
            )}
          </button>

          <div className="my-1.5 h-[2px] bg-gradient-to-r from-transparent via-white/25 to-transparent" />

          <button
            type="button"
            onClick={() => {
              aeroSound.playClick();
              onOpenWindow('system');
              onCloseMenu();
            }}
            className="w7-start-right-item"
          >
            <span>Control Panel</span>
          </button>

          <button
            type="button"
            onClick={() => {
              aeroSound.playClick();
              onOpenWindow('personalize');
              onCloseMenu();
            }}
            className="w7-start-right-item"
          >
            <span>Personalization</span>
          </button>

          <a
            href={siteConfig.github.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w7-start-right-item hover:no-underline"
          >
            <span>GitHub ↗</span>
          </a>
        </div>

        {/* Bottom-Right Windows 7 Shut Down Split Button */}
        <div className="relative pt-2 flex items-center">
          <button
            type="button"
            onClick={() => {
              aeroSound.playClick();
              onCloseMenu();
              lockOrLogOff();
            }}
            className="flex-1 h-[24px] px-2.5 text-[11.5px] text-white font-medium rounded-l-[3px] border border-black/70 bg-gradient-to-b from-white/35 via-white/15 to-black/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] hover:brightness-125 cursor-pointer text-left truncate"
          >
            Shut down
          </button>
          <button
            type="button"
            aria-label="Power and session options"
            onClick={() => {
              aeroSound.playClick();
              setShowShutMenu(!showShutMenu);
            }}
            className="w-[22px] h-[24px] flex items-center justify-center text-[10px] text-white rounded-r-[3px] border border-l-0 border-black/70 bg-gradient-to-b from-white/35 via-white/15 to-black/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] hover:brightness-125 cursor-pointer"
          >
            ▸
          </button>

          {showShutMenu && (
            <div
              ref={shutMenuRef}
              style={{ transformOrigin: 'bottom right' }}
              className="w7-context-menu !absolute !bottom-8 !right-0 !left-auto min-w-[185px]"
            >
              <button
                type="button"
                className="w7-menu-item"
                onClick={() => {
                  onCloseMenu();
                  lockOrLogOff();
                }}
              >
                <span>Switch user</span>
              </button>
              <button
                type="button"
                className="w7-menu-item"
                onClick={() => {
                  onCloseMenu();
                  lockOrLogOff();
                }}
              >
                <span>Log off</span>
              </button>
              <button
                type="button"
                className="w7-menu-item"
                onClick={() => {
                  onCloseMenu();
                  lockOrLogOff();
                }}
              >
                <span>Lock</span>
              </button>
              <div className="w7-menu-sep" />
              <button
                type="button"
                className="w7-menu-item font-semibold text-[#003399]"
                onClick={() => {
                  onCloseMenu();
                  restartSystem();
                }}
              >
                <span>Restart (Boot Sequence)</span>
              </button>
              <button
                type="button"
                className="w7-menu-item"
                onClick={() => {
                  onCloseMenu();
                  sleepSystem();
                }}
              >
                <span>Sleep</span>
              </button>
              <div className="w7-menu-sep" />
              <button
                type="button"
                className="w7-menu-item"
                onClick={() => {
                  onOpenWindow('contact');
                  onCloseMenu();
                }}
              >
                <span>Contact Mohamed...</span>
              </button>
              <button
                type="button"
                className="w7-menu-item"
                onClick={() => {
                  onResetDesktop();
                  onCloseMenu();
                }}
              >
                <span>Reset Desktop Layout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
