"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

type LogoLinkProps = {
  className?: string;
  variant?: "gradient" | "sidebar";
  /** Always navigate to the marketing home page (e.g. login screen) */
  toHome?: boolean;
};

export default function LogoLink({
  className = "",
  variant = "gradient",
  toHome = false,
}: LogoLinkProps) {
  const { token, isLoading } = useAuth();
  const href = toHome ? "/" : !isLoading && token ? "/dashboard" : "/";

  const base =
    variant === "sidebar"
      ? "text-2xl font-extrabold text-[#c0c1ff] hover:opacity-90 transition-opacity"
      : "text-2xl font-bold gradient-text hover:opacity-90 transition-opacity";

  return (
    <Link href={href} className={`${base} ${className}`.trim()}>
      DocMind AI
    </Link>
  );
}
