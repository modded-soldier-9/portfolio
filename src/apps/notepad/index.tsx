'use client';

import React, { useState, useEffect, useRef } from 'react';
import { NotepadIcon } from '@/core/assets';
import { aeroSound } from '@/components/AeroSound';
import { useOS, buildDefaultResumeText } from '@/state/os-store';
import type { AppModuleContract } from '@/apps/types';

export const NotepadApp: React.FC = () => {
  const { files, activeNotepadFileId, saveVirtualFile, updateWindowTitle } = useOS();

  const currentFile = files.find((f) => f.id === activeNotepadFileId && f.type === 'txt');

  const [text, setText] = useState<string>(() => currentFile?.content || buildDefaultResumeText());
  const [fileName, setFileName] = useState<string>(() => currentFile?.name || 'Resume_Mohamed_Elsheikh.txt');
  const [fileId, setFileId] = useState<string | undefined>(() => currentFile?.id || 'file-resume');
  const [isDirty, setIsDirty] = useState<boolean>(false);

  const [wordWrap, setWordWrap] = useState<boolean>(true);
  const [showStatusBar, setShowStatusBar] = useState<boolean>(true);
  const [fontSize, setFontSize] = useState<'11px' | '12.5px' | '14px'>('12.5px');
  const [markMode, setMarkMode] = useState<boolean>(false);
  const [markedLines, setMarkedLines] = useState<number[]>([]);

  const [openMenu, setOpenMenu] = useState<'file' | 'edit' | 'format' | 'view' | 'help' | null>(null);
  const [showOpenDialog, setShowOpenDialog] = useState<boolean>(false);
  const [showSaveDialog, setShowSaveDialog] = useState<boolean>(false);
  const [showFindBar, setShowFindBar] = useState<boolean>(false);
  const [showAboutModal, setShowAboutModal] = useState<boolean>(false);
  const [findQuery, setFindQuery] = useState<string>('');
  const [statusNotice, setStatusNotice] = useState<string | null>(null);
  const [cursorPos, setCursorPos] = useState<{ ln: number; col: number }>({ ln: 1, col: 1 });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync when activeNotepadFileId changes from File Explorer
  useEffect(() => {
    const target = files.find((f) => f.id === activeNotepadFileId && f.type === 'txt');
    if (target) {
      setText(target.content);
      setFileName(target.name);
      setFileId(target.id);
      setIsDirty(false);
    }
  }, [activeNotepadFileId, files]);

  const flashNotice = (msg: string) => {
    setStatusNotice(msg);
    setTimeout(() => setStatusNotice(null), 2600);
  };

  const handleNewFile = () => {
    aeroSound.playClick();
    setOpenMenu(null);
    setText('');
    setFileName('Untitled.txt');
    setFileId(undefined);
    setIsDirty(false);
    setMarkMode(false);
    updateWindowTitle('notepad', 'Untitled.txt — Notepad');
  };

  const handleSaveToVfs = (customName?: string) => {
    aeroSound.playClick();
    setOpenMenu(null);
    setShowSaveDialog(false);
    const finalName = (customName || fileName).trim().endsWith('.txt')
      ? (customName || fileName).trim()
      : `${(customName || fileName).trim() || 'Untitled'}.txt`;

    const saved = saveVirtualFile({
      id: fileId,
      name: finalName,
      folder: 'Documents',
      type: 'txt',
      content: text,
      size: `${Math.max(0.2, Math.round((text.length / 1024) * 10) / 10)} KB`,
    });
    setFileId(saved.id);
    setFileName(saved.name);
    setIsDirty(false);
    updateWindowTitle('notepad', `${saved.name} — Notepad`);
    flashNotice(`Saved "${saved.name}" to Libraries\\Documents`);
  };

  const handleDownloadTxt = () => {
    aeroSound.playClick();
    setOpenMenu(null);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName || 'Document.txt';
    a.click();
    URL.revokeObjectURL(url);
    flashNotice(`Downloaded "${fileName}"`);
  };

  const handleLoadResume = () => {
    aeroSound.playClick();
    setOpenMenu(null);
    const resumeTxt = buildDefaultResumeText();
    setText(resumeTxt);
    setFileName('Resume_Mohamed_Elsheikh.txt');
    setFileId('file-resume');
    setIsDirty(false);
    updateWindowTitle('notepad', 'Resume_Mohamed_Elsheikh.txt — Notepad');
    flashNotice('Loaded Resume_Mohamed_Elsheikh.txt');
  };

  const handleInsertTimeDate = () => {
    aeroSound.playClick();
    setOpenMenu(null);
    const stamp = new Date().toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
    });
    setText((prev) => `${prev}${prev.endsWith('\n') || !prev ? '' : ' '}${stamp}`);
    setIsDirty(true);
  };

  const handleCopyAll = () => {
    aeroSound.playClick();
    setOpenMenu(null);
    navigator.clipboard?.writeText(text).catch(() => {});
    flashNotice('Copied full document to clipboard');
  };

  const updateCursorMetrics = () => {
    const el = textareaRef.current;
    if (!el) return;
    const upto = el.value.slice(0, el.selectionStart || 0);
    const lines = upto.split('\n');
    setCursorPos({
      ln: lines.length,
      col: lines[lines.length - 1].length + 1,
    });
  };

  const toggleLineMark = (idx: number) => {
    if (!markMode) return;
    aeroSound.playClick();
    setMarkedLines((prev) => (prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]));
  };

  const linesArray = text.split('\n');
  const txtFilesInVfs = files.filter((f) => f.type === 'txt' && f.folder !== 'RecycleBin');

  return (
    <div
      className="flex flex-col h-full bg-white select-none relative"
      onClick={() => setOpenMenu(null)}
      onKeyDown={(e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
          e.preventDefault();
          handleSaveToVfs();
        } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'o') {
          e.preventDefault();
          setOpenMenu(null);
          setShowOpenDialog(true);
        } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
          e.preventDefault();
          setOpenMenu(null);
          setShowFindBar((prev) => !prev);
        } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
          e.preventDefault();
          handleNewFile();
        } else if (e.key === 'F5') {
          e.preventDefault();
          handleInsertTimeDate();
        }
      }}
    >
      {/* 1. Classic Windows 7 Notepad Menu Bar */}
      <div
        className="flex items-center justify-between px-2 py-0.5 bg-gradient-to-b from-[#ffffff] via-[#f2f5fa] to-[#e5ebf5] border-b border-[#c8d2e0] text-[12px] relative z-30"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-0.5">
          {/* FILE MENU */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenMenu(openMenu === 'file' ? null : 'file')}
              className={`px-2 py-0.5 rounded border ${
                openMenu === 'file'
                  ? 'bg-[#dcebfa] border-[#7da2ce]'
                  : 'border-transparent hover:bg-[#e8f2fc] hover:border-[#b8d6fb]'
              }`}
            >
              <u>F</u>ile
            </button>
            {openMenu === 'file' && (
              <div className="w7-context-menu !absolute !top-6 !left-0 min-w-[215px]">
                <button type="button" className="w7-menu-item" onClick={handleNewFile}>
                  <span>New</span>
                  <span className="text-[#666] text-[11px]">Ctrl+N</span>
                </button>
                <button
                  type="button"
                  className="w7-menu-item"
                  onClick={() => {
                    setOpenMenu(null);
                    setShowOpenDialog(true);
                  }}
                >
                  <span>Open from Documents...</span>
                  <span className="text-[#666] text-[11px]">Ctrl+O</span>
                </button>
                <button
                  type="button"
                  className="w7-menu-item"
                  onClick={() => handleSaveToVfs()}
                >
                  <span>Save</span>
                  <span className="text-[#666] text-[11px]">Ctrl+S</span>
                </button>
                <button
                  type="button"
                  className="w7-menu-item"
                  onClick={() => {
                    setOpenMenu(null);
                    setShowSaveDialog(true);
                  }}
                >
                  <span>Save As...</span>
                </button>
                <div className="w7-menu-sep" />
                <button type="button" className="w7-menu-item" onClick={handleLoadResume}>
                  <span>Reload Resume_Mohamed.txt</span>
                </button>
                <button type="button" className="w7-menu-item" onClick={handleDownloadTxt}>
                  <span>Export / Download .txt</span>
                </button>
              </div>
            )}
          </div>

          {/* EDIT MENU */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenMenu(openMenu === 'edit' ? null : 'edit')}
              className={`px-2 py-0.5 rounded border ${
                openMenu === 'edit'
                  ? 'bg-[#dcebfa] border-[#7da2ce]'
                  : 'border-transparent hover:bg-[#e8f2fc] hover:border-[#b8d6fb]'
              }`}
            >
              <u>E</u>dit
            </button>
            {openMenu === 'edit' && (
              <div className="w7-context-menu !absolute !top-6 !left-0 min-w-[205px]">
                <button type="button" className="w7-menu-item" onClick={handleCopyAll}>
                  <span>Copy All</span>
                  <span className="text-[#666] text-[11px]">Ctrl+C</span>
                </button>
                <button
                  type="button"
                  className="w7-menu-item"
                  onClick={() => {
                    setOpenMenu(null);
                    textareaRef.current?.focus();
                    textareaRef.current?.select();
                  }}
                >
                  <span>Select All</span>
                  <span className="text-[#666] text-[11px]">Ctrl+A</span>
                </button>
                <div className="w7-menu-sep" />
                <button
                  type="button"
                  className="w7-menu-item"
                  onClick={() => {
                    setOpenMenu(null);
                    setShowFindBar(!showFindBar);
                  }}
                >
                  <span>Find...</span>
                  <span className="text-[#666] text-[11px]">Ctrl+F</span>
                </button>
                <button type="button" className="w7-menu-item" onClick={handleInsertTimeDate}>
                  <span>Time/Date</span>
                  <span className="text-[#666] text-[11px]">F5</span>
                </button>
              </div>
            )}
          </div>

          {/* FORMAT MENU */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenMenu(openMenu === 'format' ? null : 'format')}
              className={`px-2 py-0.5 rounded border ${
                openMenu === 'format'
                  ? 'bg-[#dcebfa] border-[#7da2ce]'
                  : 'border-transparent hover:bg-[#e8f2fc] hover:border-[#b8d6fb]'
              }`}
            >
              F<u>o</u>rmat
            </button>
            {openMenu === 'format' && (
              <div className="w7-context-menu !absolute !top-6 !left-0 min-w-[195px]">
                <button
                  type="button"
                  className="w7-menu-item"
                  onClick={() => {
                    aeroSound.playClick();
                    setWordWrap(!wordWrap);
                    setOpenMenu(null);
                  }}
                >
                  <span>{wordWrap ? '✓ ' : ''}Word Wrap</span>
                </button>
                <div className="w7-menu-sep" />
                <button
                  type="button"
                  className="w7-menu-item"
                  onClick={() => {
                    setFontSize('11px');
                    setOpenMenu(null);
                  }}
                >
                  <span>{fontSize === '11px' ? '✓ ' : ''}Font: Consolas 11px</span>
                </button>
                <button
                  type="button"
                  className="w7-menu-item"
                  onClick={() => {
                    setFontSize('12.5px');
                    setOpenMenu(null);
                  }}
                >
                  <span>{fontSize === '12.5px' ? '✓ ' : ''}Font: Consolas 12.5px</span>
                </button>
                <button
                  type="button"
                  className="w7-menu-item"
                  onClick={() => {
                    setFontSize('14px');
                    setOpenMenu(null);
                  }}
                >
                  <span>{fontSize === '14px' ? '✓ ' : ''}Font: Consolas 14px</span>
                </button>
              </div>
            )}
          </div>

          {/* VIEW MENU */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenMenu(openMenu === 'view' ? null : 'view')}
              className={`px-2 py-0.5 rounded border ${
                openMenu === 'view'
                  ? 'bg-[#dcebfa] border-[#7da2ce]'
                  : 'border-transparent hover:bg-[#e8f2fc] hover:border-[#b8d6fb]'
              }`}
            >
              <u>V</u>iew
            </button>
            {openMenu === 'view' && (
              <div className="w7-context-menu !absolute !top-6 !left-0 min-w-[205px]">
                <button
                  type="button"
                  className="w7-menu-item"
                  onClick={() => {
                    setShowStatusBar(!showStatusBar);
                    setOpenMenu(null);
                  }}
                >
                  <span>{showStatusBar ? '✓ ' : ''}Status Bar</span>
                </button>
                <button
                  type="button"
                  className="w7-menu-item"
                  onClick={() => {
                    setMarkMode(!markMode);
                    setOpenMenu(null);
                  }}
                >
                  <span>{markMode ? '✓ ' : ''}CV Line Highlighter</span>
                </button>
              </div>
            )}
          </div>

          {/* HELP MENU */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenMenu(openMenu === 'help' ? null : 'help')}
              className={`px-2 py-0.5 rounded border ${
                openMenu === 'help'
                  ? 'bg-[#dcebfa] border-[#7da2ce]'
                  : 'border-transparent hover:bg-[#e8f2fc] hover:border-[#b8d6fb]'
              }`}
            >
              <u>H</u>elp
            </button>
            {openMenu === 'help' && (
              <div className="w7-context-menu !absolute !top-6 !left-0 min-w-[180px]">
                <button
                  type="button"
                  className="w7-menu-item"
                  onClick={() => {
                    setOpenMenu(null);
                    setShowAboutModal(true);
                  }}
                >
                  <span>About Notepad</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Quick Action Bar */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleSaveToVfs()}
            className="w7-btn !min-h-[20px] !px-2.5 !text-[11px]"
            title="Save file to Documents folder"
          >
            💾 Save
          </button>
          <button
            type="button"
            onClick={handleDownloadTxt}
            className="w7-btn !min-h-[20px] !px-2.5 !text-[11px]"
          >
            ⬇ .txt
          </button>
          <button
            type="button"
            onClick={() => {
              aeroSound.playClick();
              setMarkMode(!markMode);
            }}
            className={`w7-btn !min-h-[20px] !px-2.5 !text-[11px] ${
              markMode ? 'default font-semibold' : ''
            }`}
          >
            {markMode ? '🖍️ Highlighter: ON' : '🖍️ Highlight Mode'}
          </button>
        </div>
      </div>

      {/* Optional Find Bar */}
      {showFindBar && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#f4f8fd] border-b border-[#c8d8ec] text-[12px]">
          <span className="font-medium text-[#1e395b]">Find:</span>
          <input
            type="search"
            value={findQuery}
            onChange={(e) => setFindQuery(e.target.value)}
            placeholder="Search text in document..."
            className="w7-input w-56 !py-0.5"
            autoFocus
          />
          {findQuery && (
            <span className="text-[11px] text-[#003399]">
              Matches:{' '}
              {text.toLowerCase().split(findQuery.toLowerCase()).length - 1}
            </span>
          )}
          <button
            type="button"
            onClick={() => {
              setShowFindBar(false);
              setFindQuery('');
            }}
            className="ml-auto text-[11px] text-[#555] hover:text-[#111] px-1.5"
          >
            ✕ Close
          </button>
        </div>
      )}

      {/* 2. Main Document Area: Either Full Editable Textarea OR Interactive Line Highlighter */}
      {markMode ? (
        <div
          style={{ fontSize }}
          className="flex-1 overflow-auto w7-scroll p-3 font-mono leading-[1.6] text-[#111] selectable-text cursor-crosshair bg-[#fffef8]"
        >
          {linesArray.map((line, idx) => {
            const isMarked = markedLines.includes(idx);
            const matchesFind =
              findQuery.trim() && line.toLowerCase().includes(findQuery.trim().toLowerCase());
            return (
              <div
                key={idx}
                onClick={() => toggleLineMark(idx)}
                className={`${
                  wordWrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre'
                } px-1 rounded-sm ${
                  isMarked
                    ? 'bg-[#fef08a] border-b border-[#eab308]'
                    : matchesFind
                    ? 'bg-[#bae6fd]'
                    : line.trim()
                    ? 'hover:bg-[#fef9c3]'
                    : ''
                }`}
              >
                {line || ' '}
              </div>
            );
          })}
        </div>
      ) : (
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setIsDirty(true);
            updateCursorMetrics();
          }}
          onClick={updateCursorMetrics}
          onKeyUp={updateCursorMetrics}
          spellCheck={false}
          aria-label="Notepad Text Editor"
          style={{ fontSize }}
          wrap={wordWrap ? 'soft' : 'off'}
          className={`flex-1 w-full resize-none border-0 outline-none p-3 font-mono leading-[1.6] text-[#111] bg-white w7-scroll selectable-text ${
            wordWrap ? 'whitespace-pre-wrap' : 'whitespace-pre overflow-x-auto'
          }`}
        />
      )}

      {/* 3. Open File Dialog Modal */}
      {showOpenDialog && (
        <div
          className="absolute inset-0 bg-black/30 flex items-center justify-center z-40 p-4"
          onClick={() => setShowOpenDialog(false)}
        >
          <div
            className="w-full max-w-sm rounded-[5px] border border-[#3c7fb1] bg-[#f0f4f9] shadow-xl p-3.5 space-y-3 text-[12px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#cbd5e1] pb-1.5 font-semibold text-[#003399]">
              <span>Open Text Document (Libraries\Documents)</span>
              <button type="button" onClick={() => setShowOpenDialog(false)}>
                ✕
              </button>
            </div>
            <div className="max-h-48 overflow-y-auto bg-white border border-[#94a3b8] rounded p-1.5 space-y-1">
              {txtFilesInVfs.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    aeroSound.playClick();
                    setText(f.content);
                    setFileName(f.name);
                    setFileId(f.id);
                    setIsDirty(false);
                    updateWindowTitle('notepad', `${f.name} — Notepad`);
                    setShowOpenDialog(false);
                  }}
                  className="w-full w7-item-box flex items-center justify-between p-1.5 text-left"
                >
                  <div className="flex items-center gap-2 truncate">
                    <NotepadIcon size={18} />
                    <span className="font-medium text-[#111] truncate">{f.name}</span>
                  </div>
                  <span className="text-[10.5px] text-[#666] shrink-0">{f.size}</span>
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="w7-btn"
                onClick={() => setShowOpenDialog(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Save As Dialog Modal */}
      {showSaveDialog && (
        <div
          className="absolute inset-0 bg-black/30 flex items-center justify-center z-40 p-4"
          onClick={() => setShowSaveDialog(false)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveToVfs(fileName);
            }}
            className="w-full max-w-sm rounded-[5px] border border-[#3c7fb1] bg-[#f0f4f9] shadow-xl p-3.5 space-y-3 text-[12px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#cbd5e1] pb-1.5 font-semibold text-[#003399]">
              <span>Save As to Libraries\Documents</span>
              <button type="button" onClick={() => setShowSaveDialog(false)}>
                ✕
              </button>
            </div>
            <div>
              <label className="block text-[11.5px] text-[#333] mb-1">File name:</label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w7-input w-full"
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-2">
              <button type="submit" className="w7-btn default font-semibold">
                Save
              </button>
              <button
                type="button"
                className="w7-btn"
                onClick={() => setShowSaveDialog(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 5. About Notepad Modal */}
      {showAboutModal && (
        <div
          className="absolute inset-0 bg-black/30 flex items-center justify-center z-40 p-4"
          onClick={() => setShowAboutModal(false)}
        >
          <div
            className="w-full max-w-xs rounded-[5px] border border-[#3c7fb1] bg-[#f0f4f9] shadow-xl p-4 space-y-3 text-[12px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-[#cbd5e1] pb-2">
              <NotepadIcon size={36} />
              <div>
                <div className="font-bold text-[#003399] text-[14px]">Windows 7 Notepad</div>
                <div className="text-[11px] text-[#555]">Version 6.1 (Build 7601: SP1)</div>
              </div>
            </div>
            <p className="text-[#333] leading-relaxed">
              Full-featured text editor integrated with the Virtual File System (Documents &amp; Recycle Bin) and Mohamed Elsheikh&apos;s interactive CV highlighter.
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                className="w7-btn default !min-w-[72px]"
                onClick={() => setShowAboutModal(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Notepad Status Bar */}
      {showStatusBar && (
        <div className="h-[22px] px-3 bg-[#f0f0f0] border-t border-[#d0d0d0] flex items-center justify-between text-[11px] text-[#333] shrink-0">
          <span className="truncate">
            {statusNotice
              ? `✓ ${statusNotice}`
              : markMode
              ? 'Highlighter Mode: Click any line to mark/unmark'
              : `${fileName}${isDirty ? ' *' : ''} — UTF-8`}
          </span>
          <span className="shrink-0 ml-2">
            Ln {cursorPos.ln}, Col {cursorPos.col} &middot; {linesArray.length} lines &middot; 100%
          </span>
        </div>
      )}
    </div>
  );
};

export const notepadModule: AppModuleContract = {
  id: 'notepad',
  getWindowConfig: () => ({
    id: 'notepad',
    title: 'Resume_Mohamed_Elsheikh.txt — Notepad',
    shortLabel: 'Notepad',
    glowColor: 'rgba(34, 211, 238, 0.62)',
    defaultPos: { x: 240, y: 46, width: 710, height: 505 },
    pinned: true,
    category: 'accessory',
    description: 'Open, edit, and save text documents or read Resume.txt',
  }),
  renderIcon: (size = 32) => <NotepadIcon size={size} />,
  Component: NotepadApp,
};
