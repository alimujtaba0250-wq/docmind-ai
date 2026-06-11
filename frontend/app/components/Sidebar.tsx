"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import LogoLink from "./LogoLink";

const navItems = [
  { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
  { href: "/chat", icon: "chat", label: "Sessions" },
  { href: "/documents", icon: "description", label: "Documents" },
  { href: "/settings", icon: "settings", label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-full z-40 flex flex-col py-12 bg-[#12121d]/90 backdrop-blur-lg border-r border-[#464554]/20 shadow-xl w-64">
      <div className="px-6 mb-10">
        <LogoLink variant="sidebar" className="block" />
        <p className="text-[#c7c4d7] text-sm opacity-70">Pro Plan</p>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive =
            item.href === "/chat"
              ? pathname === "/chat" || pathname.startsWith("/chat/")
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-6 py-3 text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-[#8083ff]/20 text-[#4cd7f6] border-r-4 border-[#4cd7f6]"
                  : "text-[#c7c4d7] hover:bg-[#343440]/30 hover:translate-x-1"
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-6 mt-auto space-y-6">
        <Link
          href="/settings"
          className="w-full py-3 px-4 rounded-xl bg-[#8083ff] text-[#0d0096] text-sm font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">settings</span>
          Account settings
        </Link>
        <div className="space-y-1">
          <Link
            href="/"
            className="text-[#c7c4d7] flex items-center gap-4 px-6 py-3 hover:bg-[#343440]/30 text-sm transition-all"
          >
            <span className="material-symbols-outlined">home</span>
            <span>Home</span>
          </Link>
          <button
            onClick={() => { logout(); router.push("/login"); }}
            className="w-full text-[#c7c4d7] flex items-center gap-4 px-6 py-3 hover:bg-[#343440]/30 text-sm transition-all"
          >
            <span className="material-symbols-outlined">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
