'use client';

import React, { useState } from 'react';
import { siteConfig } from '@/config/site';
import { ContactMailIcon } from '../AeroIcons';
import { aeroSound } from '../AeroSound';

export const ContactWindow: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: 'Security / Development Inquiry', message: '' });
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    aeroSound.playChime();
    const text = `Hi! I'm ${form.name} (${form.email}).\nSubject: ${form.subject}\n\n${form.message}`;
    window.open(
      `https://wa.me/${siteConfig.contact.whatsappCountryCode}${siteConfig.contact.whatsapp}?text=${encodeURIComponent(text)}`,
      '_blank'
    );
  };

  const handleCopyEmail = () => {
    aeroSound.playClick();
    navigator.clipboard?.writeText(siteConfig.contact.email).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="flex flex-col h-full bg-[#f5f8fc] select-none">
      {/* Top Mail Command Ribbon */}
      <div className="w7-command-bar">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="submit"
            form="win7-contact-form"
            className="w7-cmd-btn font-semibold text-[#003399]"
          >
            <ContactMailIcon size={15} />
            <span>Send via WhatsApp</span>
          </button>

          <a
            href={`mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(form.message)}`}
            className="w7-cmd-btn hover:no-underline"
          >
            <span>✉️ Email Directly</span>
          </a>

          <button type="button" onClick={handleCopyEmail} className="w7-cmd-btn">
            <span>{copied ? '✓ Copied Email!' : '📋 Copy Email'}</span>
          </button>

          <span className="h-4 w-[1px] bg-[#b8c9de] mx-0.5 hidden sm:inline-block" />

          <a
            href={siteConfig.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="w7-cmd-btn hover:no-underline"
          >
            <span>LinkedIn ↗</span>
          </a>
          <a
            href={siteConfig.github.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w7-cmd-btn hover:no-underline"
          >
            <span>GitHub ↗</span>
          </a>
        </div>
      </div>

      {/* Compose Message Body */}
      <form
        id="win7-contact-form"
        onSubmit={handleSubmit}
        className="flex-1 flex flex-col p-4 gap-2.5 overflow-y-auto w7-scroll selectable-text"
      >
        {/* Recipient Header Box */}
        <div className="bg-white border border-[#b8cfe8] rounded p-3 space-y-2 shadow-sm">
          <div className="grid grid-cols-[75px_1fr] items-center gap-2 text-[12px]">
            <span className="text-[#4c627d] font-medium">To:</span>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#e8f2fc] border border-[#9abbe0] text-[#003399] font-medium text-[11.5px]">
                {siteConfig.name} &lt;{siteConfig.contact.email}&gt;
              </span>
              <span className="text-[11px] text-[#555]">
                ({siteConfig.contact.phoneDisplay} &middot; {siteConfig.location})
              </span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-2.5 pt-1">
            <div className="grid grid-cols-[75px_1fr] items-center gap-2 text-[12px]">
              <label htmlFor="w7-contact-name" className="text-[#4c627d] font-medium">
                Your Name:
              </label>
              <input
                id="w7-contact-name"
                type="text"
                required
                autoComplete="name"
                placeholder="Enter your name..."
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w7-input w-full"
              />
            </div>

            <div className="grid grid-cols-[75px_1fr] items-center gap-2 text-[12px]">
              <label htmlFor="w7-contact-email" className="text-[#4c627d] font-medium">
                Your Email:
              </label>
              <input
                id="w7-contact-email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w7-input w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-[75px_1fr] items-center gap-2 text-[12px]">
            <label htmlFor="w7-contact-subject" className="text-[#4c627d] font-medium">
              Subject:
            </label>
            <input
              id="w7-contact-subject"
              type="text"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w7-input w-full"
            />
          </div>
        </div>

        {/* Message Textarea */}
        <div className="flex-1 flex flex-col min-h-[130px]">
          <label htmlFor="w7-contact-msg" className="text-[11.5px] text-[#4c627d] font-medium mb-1">
            Message Body:
          </label>
          <textarea
            id="w7-contact-msg"
            required
            rows={5}
            placeholder={`Write your message to ${siteConfig.name} here...`}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w7-input flex-1 w-full resize-none p-2.5 text-[12.5px] leading-relaxed"
          />
        </div>

        {/* Bottom Dialog Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <span className="text-[11px] text-[#555]">
            Direct Email:{' '}
            <a href={`mailto:${siteConfig.contact.email}`} className="text-[#0066cc] hover:underline">
              {siteConfig.contact.email}
            </a>
          </span>
          <div className="flex items-center gap-2">
            <button type="submit" className="w7-btn default font-semibold px-4">
              Send via WhatsApp
            </button>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="w7-btn px-4 hover:no-underline"
            >
              Email Directly
            </a>
          </div>
        </div>
      </form>
    </div>
  );
};
