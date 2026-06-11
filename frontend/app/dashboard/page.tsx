"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "../components/Sidebar";
import { useAuth } from "@/lib/auth-context";
import { sessionsApi, documentsApi, type ChatSession } from "@/lib/api";

const SESSION_ICONS: Record<number, { icon: string; color: string; bg: string }> = {};
const PALETTE = [
  { icon: "gavel", color: "text-[#c0c1ff]", bg: "bg-[#c0c1ff]/10" },
  { icon: "science", color: "text-[#4cd7f6]", bg: "bg-[#4cd7f6]/10" },
  { icon: "badge", color: "text-[#4edea3]", bg: "bg-[#4edea3]/10" },
  { icon: "article", color: "text-[#c0c1ff]", bg: "bg-[#c0c1ff]/10" },
  { icon: "description", color: "text-[#4cd7f6]", bg: "bg-[#4cd7f6]/10" },
];
function sessionStyle(id: number) {
  if (!SESSION_ICONS[id]) SESSION_ICONS[id] = PALETTE[id % PALETTE.length];
  return SESSION_ICONS[id];
}

export default function DashboardPage() {
  const router = useRouter();
  const { token, userEmail, isLoading, logout } = useAuth();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !token) router.push("/login");
  }, [isLoading, token, router]);

  // Load sessions
  useEffect(() => {
    if (!token) return;
    setLoadingSessions(true);
    sessionsApi
      .list(token)
      .then(setSessions)
      .catch((err: unknown) => {
        const status = err instanceof Error ? (err as Error & { status?: number }).status : undefined;
        if (status === 401) {
          logout();
          router.push("/login");
          return;
        }
        console.error(err);
      })
      .finally(() => setLoadingSessions(false));
  }, [token, logout, router]);

  async function handleCreateSession(e: FormEvent) {
    e.preventDefault();
    if (!token || !newTitle.trim()) return;
    setCreating(true);
    setCreateError("");
    try {
      const session = await sessionsApi.create(newTitle.trim(), token);
      if (uploadFile) {
        await documentsApi.upload(session.id, uploadFile, token);
      }
      setSessions((prev) => [session, ...prev]);
      setShowModal(false);
      setNewTitle("");
      setUploadFile(null);
      router.push(`/chat?session=${session.id}`);
    } catch (err: unknown) {
      setCreateError(err instanceof Error ? err.message : "Failed to create session");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: number, e: React.MouseEvent) {
    e.stopPropagation();
    if (!token) return;
    if (!confirm("Delete this session?")) return;
    try {
      await sessionsApi.delete(id, token);
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch {
      alert("Failed to delete session");
    }
  }

  function formatTime(s: ChatSession) {
    if (!s.created_at) return "";
    const d = new Date(s.created_at);
    const now = new Date();
    const diff = (now.getTime() - d.getTime()) / 1000;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return d.toLocaleDateString();
  }

  const firstName = userEmail?.split("@")[0] ?? "there";

  if (isLoading || !token) return null;

  return (
    <div className="text-[#e3e0f1]">
      <Sidebar />

      <main className="ml-64 min-h-screen p-6 max-w-[1280px] mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold">Good morning, {firstName} 👋</h2>
            <p className="text-[#c7c4d7] text-base">Your workspace is ready for analysis.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setShowModal(true); setCreateError(""); }}
              className="gradient-button text-[#1000a9] text-sm font-semibold px-6 py-3 rounded-full flex items-center gap-2 shadow-lg shadow-[#c0c1ff]/20 hover:scale-105 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined">add</span>
              New Session
            </button>
            <button
              onClick={() => { logout(); router.push("/login"); }}
              className="p-3 rounded-xl glass-card hover:bg-[#343440] text-[#c7c4d7] transition-colors"
              title="Sign out"
            >
              <span className="material-symbols-outlined">logout</span>
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex justify-between items-start mb-4">
              <span className="material-symbols-outlined text-[#c0c1ff]">history_edu</span>
              <span className="text-[#c7c4d7] text-sm font-semibold">{sessions.length} sessions</span>
            </div>
            <p className="text-[#c7c4d7] text-sm font-semibold mb-1">Total Sessions</p>
            <p className="text-2xl font-semibold mb-4">{sessions.length}</p>
            <div className="h-2 w-full bg-[#343440] rounded-full overflow-hidden">
              <div className="h-full bg-[#c0c1ff] rounded-full" style={{ width: `${Math.min((sessions.length / 50) * 100, 100)}%` }} />
            </div>
          </div>
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex justify-between items-start mb-4">
              <span className="material-symbols-outlined text-[#4cd7f6]">person</span>
              <span className="text-[#c7c4d7] text-sm font-semibold">Active</span>
            </div>
            <p className="text-[#c7c4d7] text-sm font-semibold mb-1">Account</p>
            <p className="text-base font-semibold mb-4 truncate">{userEmail}</p>
            <div className="h-2 w-full bg-[#343440] rounded-full overflow-hidden">
              <div className="h-full bg-[#4cd7f6] rounded-full w-full" />
            </div>
          </div>
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex justify-between items-start mb-4">
              <span className="material-symbols-outlined text-[#4edea3]">forum</span>
              <span className="text-[#c7c4d7] text-sm font-semibold">Unlimited</span>
            </div>
            <p className="text-[#c7c4d7] text-sm font-semibold mb-1">Messages</p>
            <p className="text-2xl font-semibold mb-4">Unlimited</p>
            <div className="h-2 w-full bg-[#343440] rounded-full overflow-hidden">
              <div className="h-full bg-[#4edea3] rounded-full w-full" />
            </div>
          </div>
        </section>

        {/* Upgrade Banner */}
        <section className="mb-12 relative rounded-2xl p-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#c0c1ff]/20 via-[#4cd7f6]/20 to-[#1f1e2a]" />
          <div className="relative z-10 max-w-2xl">
            <span className="bg-[#4cd7f6]/20 text-[#4cd7f6] text-sm font-semibold px-3 py-1 rounded-full mb-4 inline-block uppercase tracking-widest">Pro Plan Active</span>
            <h3 className="text-3xl font-bold mb-4">Your AI workspace is ready</h3>
            <p className="text-[#c7c4d7] text-base">Upload documents, create sessions, and start asking questions instantly.</p>
          </div>
        </section>

        {/* Sessions List */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <h3 className="text-2xl font-semibold">Your Sessions</h3>
            <span className="text-[#c7c4d7] text-sm">{sessions.length} total</span>
          </div>

          {loadingSessions ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#c0c1ff]/30 border-t-[#c0c1ff] rounded-full animate-spin" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="glass-card p-12 rounded-2xl text-center">
              <span className="material-symbols-outlined text-[#c0c1ff] text-6xl mb-4 block">chat_bubble</span>
              <p className="text-xl font-semibold mb-2">No sessions yet</p>
              <p className="text-[#c7c4d7] mb-6">Create your first session to start chatting with documents.</p>
              <button
                onClick={() => setShowModal(true)}
                className="gradient-button text-[#1000a9] text-sm font-semibold px-6 py-3 rounded-full"
              >
                Create First Session
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {sessions.map((session) => {
                const style = sessionStyle(session.id);
                return (
                  <div
                    key={session.id}
                    className="glass-card p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-[#343440]/20 transition-all cursor-pointer"
                    onClick={() => router.push(`/chat?session=${session.id}`)}
                  >
                    <div className="flex items-center gap-6 flex-1">
                      <div className={`w-12 h-12 rounded-xl ${style.bg} flex items-center justify-center ${style.color}`}>
                        <span className="material-symbols-outlined">{style.icon}</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold">{session.title}</h4>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-[#908fa0] text-sm">{formatTime(session)}</span>
                          <span className="text-[#c7c4d7] text-sm">Session #{session.id}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/chat?session=${session.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="px-6 py-2 rounded-lg border border-[#908fa0] hover:border-[#4cd7f6] hover:text-[#4cd7f6] text-sm font-semibold transition-all flex items-center gap-2"
                      >
                        Open Chat
                        <span className="material-symbols-outlined text-lg">chevron_right</span>
                      </Link>
                      <button
                        onClick={(e) => handleDelete(session.id, e)}
                        className="p-2 rounded-lg border border-[#464554]/30 hover:border-[#ffb4ab] hover:text-[#ffb4ab] text-[#c7c4d7] transition-all"
                        title="Delete session"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* New Session Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-[#12121d]/60 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="glass-card w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-[#c0c1ff] to-[#4cd7f6] p-8 flex justify-between items-start">
              <div>
                <h3 className="text-[#1000a9] text-3xl font-bold">Start New Session</h3>
                <p className="text-[#1000a9]/80 text-base">Give it a title and optionally upload a document.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all">
                <span className="material-symbols-outlined text-white">close</span>
              </button>
            </div>
            <form onSubmit={handleCreateSession} className="p-8">
              {/* File drop zone */}
              <div
                onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-4 bg-[#1b1a26] transition-colors cursor-pointer mb-6 ${uploadFile ? "border-[#4cd7f6]" : "border-[#464554]/50 hover:border-[#4cd7f6]"}`}
              >
                <div className="w-16 h-16 rounded-full bg-[#343440] flex items-center justify-center text-[#4cd7f6]">
                  <span className="material-symbols-outlined text-4xl">{uploadFile ? "task" : "upload_file"}</span>
                </div>
                {uploadFile ? (
                  <div className="text-center">
                    <p className="text-[#4cd7f6] font-semibold">{uploadFile.name}</p>
                    <p className="text-[#c7c4d7] text-sm">{(uploadFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-lg text-[#e3e0f1]">Click to upload or drag and drop</p>
                    <p className="text-[#c7c4d7] text-sm">PDF, DOCX, TXT (up to 50MB)</p>
                  </div>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                  onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#c7c4d7] mb-2">Session Title <span className="text-[#ffb4ab]">*</span></label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  placeholder="e.g., Marketing Strategy Q4"
                  className="w-full bg-[#1f1e2a] rounded-xl border border-[#464554] focus:border-[#4cd7f6] focus:ring-1 focus:ring-[#4cd7f6] py-3 px-4 text-[#e3e0f1] outline-none"
                />
              </div>

              {createError && (
                <div className="mb-4 p-3 rounded-xl bg-[#93000a]/30 border border-[#ffb4ab]/30 text-[#ffb4ab] text-sm">
                  {createError}
                </div>
              )}

              <div className="flex gap-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 rounded-xl border border-[#464554] text-sm font-semibold hover:bg-[#343440] transition-all">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !newTitle.trim()}
                  className="flex-[2] py-4 rounded-xl bg-[#c0c1ff] text-[#1000a9] text-sm font-bold hover:opacity-90 shadow-lg shadow-[#c0c1ff]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {creating && <span className="w-4 h-4 border-2 border-[#1000a9]/30 border-t-[#1000a9] rounded-full animate-spin" />}
                  Create Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="ml-64 py-6 px-12 flex flex-col md:flex-row justify-between items-center bg-[#0d0d18] border-t border-[#464554]/10">
        <p className="text-[#c7c4d7] text-sm">© 2024 DocMind AI. Built for the future of knowledge work.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          {["Privacy Policy", "Terms of Service", "Security", "Status"].map((l) => (
            <a key={l} href="#" className="text-[#c7c4d7] text-sm hover:text-[#4cd7f6] transition-colors">{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
