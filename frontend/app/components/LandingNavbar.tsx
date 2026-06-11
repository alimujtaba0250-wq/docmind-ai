"use client";

import { useState } from "react";
import Link from "next/link";
import LogoLink from "./LogoLink";

const links = [
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export default function LandingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  function closeMobile() {
    setMobileOpen(false);
  }

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#1f1e2a]/80 backdrop-blur-xl border-b border-[#464554]/30 shadow-sm">
      <div className="flex justify-between items-center px-6 py-4 max-w-[1280px] mx-auto">
        <LogoLink />

        <div className="hidden md:flex items-center gap-8">
          {links.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-[#c7c4d7] hover:text-[#4cd7f6] transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-semibold text-[#c7c4d7] hover:text-[#e3e0f1] transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/login"
            className="gradient-button text-[#1000a9] text-sm font-semibold px-6 py-2.5 rounded-full hover:scale-105 transition-transform duration-200"
          >
            Get Started Free
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="md:hidden p-2 rounded-lg text-[#e3e0f1] hover:bg-[#343440]/50"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          <span className="material-symbols-outlined">{mobileOpen ? "close" : "menu"}</span>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-[#464554]/30 px-6 py-4 space-y-3 bg-[#1f1e2a]/95">
          {links.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={closeMobile}
              className="block text-sm font-semibold text-[#c7c4d7] hover:text-[#4cd7f6] py-2"
            >
              {item.label}
            </a>
          ))}
          <Link
            href="/login"
            onClick={closeMobile}
            className="block text-sm font-semibold text-[#c7c4d7] py-2"
          >
            Log In
          </Link>
          <Link
            href="/login"
            onClick={closeMobile}
            className="block text-center gradient-button text-[#1000a9] text-sm font-semibold px-6 py-3 rounded-full"
          >
            Get Started Free
          </Link>
        </div>
      )}
    </nav>
  );
}
