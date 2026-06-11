"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";
import { useAuth } from "@/lib/auth-context";
import { authApi } from "@/lib/api";

export default function SettingsPage() {
  const router = useRouter();
  const { token, userEmail, isLoading, logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [newsletterLoading, setNewsletterLoading] = useState(true);
  const [newsletterMessage, setNewsletterMessage] = useState("");

  useEffect(() => {
    if (!isLoading && !token) router.push("/login");
  }, [isLoading, token, router]);

  useEffect(() => {
    if (!token) return;
    setNewsletterLoading(true);
    authApi
      .getProfile(token)
      .then((profile) => setNewsletterSubscribed(profile.newsletter_subscribed))
      .catch(console.error)
      .finally(() => setNewsletterLoading(false));
  }, [token]);

  async function handleNewsletterToggle() {
    if (!token) return;
    const next = !newsletterSubscribed;
    setNewsletterMessage("");
    try {
      const profile = await authApi.updateNewsletter(next, token);
      setNewsletterSubscribed(profile.newsletter_subscribed);
      setNewsletterMessage(
        profile.newsletter_subscribed
          ? "You are subscribed to product updates and tips."
          : "You have unsubscribed from the newsletter."
      );
    } catch (err: unknown) {
      setNewsletterMessage(
        err instanceof Error ? err.message : "Failed to update newsletter preference."
      );
    }
  }

  async function handleChangePassword(e: FormEvent) {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!token) return;
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setChangingPassword(true);
    try {
      await authApi.changePassword(currentPassword, newPassword, token);
      setPasswordSuccess("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      setPasswordError(err instanceof Error ? err.message : "Failed to update password.");
    } finally {
      setChangingPassword(false);
    }
  }

  if (isLoading || !token) return null;

  return (
    <div className="text-[#e3e0f1] min-h-screen">
      <Sidebar />

      <main className="ml-64 min-h-screen p-6 max-w-[720px] mx-auto">
        <header className="mb-10">
          <h2 className="text-3xl font-bold">Settings</h2>
          <p className="text-[#c7c4d7] text-base mt-1">Manage your account and preferences.</p>
        </header>

        <section className="glass-card rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c0c1ff]">person</span>
            Account
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-[#908fa0] uppercase tracking-wider mb-1">Email</p>
              <p className="text-base">{userEmail ?? "—"}</p>
            </div>
            <button
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#ffb4ab]/40 text-[#ffb4ab] text-sm font-semibold hover:bg-[#93000a]/20 transition-all"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
              Sign out
            </button>
          </div>
        </section>

        <section className="glass-card rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd7f6]">lock</span>
            Change password
          </h3>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#908fa0] uppercase tracking-wider mb-2">
                Current password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full bg-[#1f1e2a] rounded-xl border border-[#464554] focus:border-[#4cd7f6] focus:ring-1 focus:ring-[#4cd7f6] py-3 px-4 text-[#e3e0f1] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#908fa0] uppercase tracking-wider mb-2">
                New password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className="w-full bg-[#1f1e2a] rounded-xl border border-[#464554] focus:border-[#4cd7f6] focus:ring-1 focus:ring-[#4cd7f6] py-3 px-4 text-[#e3e0f1] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#908fa0] uppercase tracking-wider mb-2">
                Confirm new password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="w-full bg-[#1f1e2a] rounded-xl border border-[#464554] focus:border-[#4cd7f6] focus:ring-1 focus:ring-[#4cd7f6] py-3 px-4 text-[#e3e0f1] outline-none"
              />
            </div>
            {passwordError && (
              <p className="text-sm text-[#ffb4ab] flex items-center gap-2">
                <span className="material-symbols-outlined text-base">error</span>
                {passwordError}
              </p>
            )}
            {passwordSuccess && (
              <p className="text-sm text-[#4edea3] flex items-center gap-2">
                <span className="material-symbols-outlined text-base">check_circle</span>
                {passwordSuccess}
              </p>
            )}
            <button
              type="submit"
              disabled={changingPassword}
              className="gradient-button text-[#1000a9] text-sm font-semibold px-6 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {changingPassword && (
                <span className="w-4 h-4 border-2 border-[#1000a9]/30 border-t-[#1000a9] rounded-full animate-spin" />
              )}
              Update password
            </button>
          </form>
        </section>

        <section className="glass-card rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c0c1ff]">mail</span>
            Newsletter
          </h3>
          <p className="text-sm text-[#c7c4d7] mb-4">
            Get occasional updates about new features, tips for document chat, and product news.
          </p>
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[#1b1a26] border border-[#464554]/30">
            <div>
              <p className="text-sm font-semibold">Email newsletter</p>
              <p className="text-xs text-[#908fa0] mt-1">Sent to {userEmail}</p>
            </div>
            <button
              type="button"
              onClick={handleNewsletterToggle}
              disabled={newsletterLoading}
              role="switch"
              aria-checked={newsletterSubscribed}
              className={`relative w-12 h-7 rounded-full transition-colors flex-shrink-0 disabled:opacity-50 ${
                newsletterSubscribed ? "bg-[#4cd7f6]" : "bg-[#464554]"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform ${
                  newsletterSubscribed ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>
          {newsletterMessage && (
            <p className="text-sm text-[#4edea3] mt-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-base">info</span>
              {newsletterMessage}
            </p>
          )}
        </section>

        <section className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c0c1ff]">info</span>
            About
          </h3>
          <p className="text-sm text-[#c7c4d7]">
            DocMind AI — chat with your PDFs and documents using local RAG.
          </p>
          <p className="text-xs text-[#908fa0] mt-2">Version 1.0</p>
        </section>
      </main>
    </div>
  );
}
